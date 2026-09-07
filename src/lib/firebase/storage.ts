/**
 * Firebase Storage Operations (Farmer Documents, Center Photos, Logos, Receipts)
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './client';
import { DEFAULT_TENANT_ID } from './firestore';

/**
 * Upload Farmer KYC/Profile Photo
 */
export const uploadFarmerFile = async (
  file: File | Blob,
  farmerId: string,
  fileName: string,
  tenantId: string = DEFAULT_TENANT_ID
): Promise<string | null> => {
  if (!storage) return null;
  try {
    const storageRef = ref(storage, `tenants/${tenantId}/farmers/${farmerId}/${fileName}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (err) {
    console.error('[Storage] Upload farmer file failed:', err);
    return null;
  }
};

/**
 * Upload Dairy Organization Logo
 */
export const uploadDairyLogo = async (
  file: File | Blob,
  tenantId: string = DEFAULT_TENANT_ID
): Promise<string | null> => {
  if (!storage) return null;
  try {
    const storageRef = ref(storage, `tenants/${tenantId}/branding/logo_${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (err) {
    console.error('[Storage] Upload logo failed:', err);
    return null;
  }
};

/**
 * Delete a file in Firebase Storage by URL or path
 */
export const deleteStorageFile = async (filePath: string): Promise<boolean> => {
  if (!storage) return false;
  try {
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
    return true;
  } catch (err) {
    console.warn('[Storage] Delete file warning:', err);
    return false;
  }
};
