import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { app, auth } from '../lib/firebase/client';

const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
];

const provider = new GoogleAuthProvider();
// Add all requested Drive scopes
SCOPES.forEach((scope) => provider.addScope(scope));

// Flags and in-memory cache (strictly in-memory as required)
let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get Google OAuth access token');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  iconLink?: string;
}

/**
 * Get or create "Rudu Farm Dairy Archives" folder in user's Google Drive
 */
export const getOrCreateDairyFolder = async (accessToken: string): Promise<string> => {
  try {
    const folderName = 'Rudu Farm Dairy Archives';
    const query = encodeURIComponent(
      `name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`
    );
    const searchRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!searchRes.ok) {
      throw new Error(`Drive search failed: ${searchRes.statusText}`);
    }

    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }

    // Create folder
    const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        description: 'Auto-synced milk ledgers, shift summaries, and financial reports from Rudu Farm Smart Dairy',
      }),
    });

    if (!createRes.ok) {
      throw new Error(`Failed to create dairy folder in Drive: ${createRes.statusText}`);
    }

    const newFolder = await createRes.json();
    return newFolder.id;
  } catch (err) {
    console.error('Error finding/creating Drive folder:', err);
    throw err;
  }
};

/**
 * Upload text/CSV/JSON/file to Google Drive using multipart upload
 */
export const uploadFileToDrive = async (
  accessToken: string,
  fileName: string,
  mimeType: string,
  content: string | Blob,
  folderId?: string
): Promise<DriveFileItem> => {
  const metadata: any = {
    name: fileName,
    mimeType: mimeType,
  };

  if (folderId) {
    metadata.parents = [folderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  let bodyContent = content;
  if (content instanceof Blob) {
    bodyContent = await content.text();
  }

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    bodyContent +
    closeDelimiter;

  const res = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,size,webViewLink,createdTime',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`,
      },
      body: multipartRequestBody,
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to upload to Google Drive: ${errText}`);
  }

  return await res.json();
};

/**
 * List files in user's Google Drive inside the Rudu Farm directory or root
 */
export const listDairyDriveFiles = async (
  accessToken: string,
  folderId?: string
): Promise<DriveFileItem[]> => {
  try {
    let query = 'trashed = false';
    if (folderId) {
      query += ` and '${folderId}' in parents`;
    }

    const encodedQuery = encodeURIComponent(query);
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodedQuery}&orderBy=createdTime desc&pageSize=30&fields=files(id,name,mimeType,size,webViewLink,createdTime,modifiedTime,iconLink)`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
      throw new Error(`Failed to list Drive files: ${res.statusText}`);
    }

    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.error('Failed to list files from Google Drive:', err);
    throw err;
  }
};

/**
 * Delete a file from Google Drive
 */
export const deleteDriveFile = async (
  accessToken: string,
  fileId: string
): Promise<boolean> => {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to delete file from Google Drive: ${res.statusText}`);
  }

  return true;
};
