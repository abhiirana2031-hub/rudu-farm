import { NextRequest } from "next/server";
import { adminAuth, adminDb } from "./firebase/admin";

export type MembershipRole = 'SUPER_ADMIN' | 'TENANT_ADMIN' | 'OPERATOR' | 'FARMER';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export type TenantContext = {
  user: any; // Firestore user doc
  employee?: any; // Firestore employee doc
  farmer?: any; // Firestore farmer doc
  tenantId: string;
  role: MembershipRole;
};

export async function verifyAuth(req: NextRequest, allowedRoles?: MembershipRole[]): Promise<{ error?: string; status?: number; ctx?: TenantContext }> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "Missing or invalid authorization header", status: 401 };
  }

  const token = authHeader.split(" ")[1];
  
  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (error) {
    return { error: "Invalid token", status: 401 };
  }

  const uid = decodedToken.uid;
  const userSnap = await adminDb.collection('users').doc(uid).get();

  if (!userSnap.exists) {
    return { error: "User not found in database", status: 403 };
  }

  const dbUser = userSnap.data() as any;

  if (dbUser.status !== 'ACTIVE') {
    return { error: "User account is not active", status: 403 };
  }

  // 1. Get Tenant ID from Headers
  let tenantId = req.headers.get("X-Tenant-ID");

  // 2. We skip auto-inferring for now unless we query all tenants where user is a member
  if (!tenantId) {
    return { error: "X-Tenant-ID header is required.", status: 400 };
  }

  // 3. Verify Membership
  const memberSnap = await adminDb.collection('tenants').doc(tenantId).collection('members').doc(uid).get();

  if (!memberSnap.exists) {
    return { error: "Forbidden: Not an active member of this tenant", status: 403 };
  }

  const membership = memberSnap.data() as any;

  if (membership.status !== "ACTIVE") {
    return { error: "Forbidden: Not an active member of this tenant", status: 403 };
  }

  // 4. Check Roles
  if (allowedRoles && !allowedRoles.includes(membership.role)) {
    return { error: "Forbidden: insufficient permissions", status: 403 };
  }

  // 5. Fetch additional relations (Employee or Farmer)
  let employee = null;
  let farmer = null;
  
  if (membership.role === 'OPERATOR' || membership.role === 'TENANT_ADMIN') {
     const employeesSnap = await adminDb.collection('tenants').doc(tenantId).collection('employees').where('authUserId', '==', uid).limit(1).get();
     if (!employeesSnap.empty) {
       employee = { id: employeesSnap.docs[0].id, ...employeesSnap.docs[0].data() };
     }
  } else if (membership.role === 'FARMER') {
     const farmersSnap = await adminDb.collection('tenants').doc(tenantId).collection('farmers').where('authUserId', '==', uid).limit(1).get();
     if (!farmersSnap.empty) {
       farmer = { id: farmersSnap.docs[0].id, ...farmersSnap.docs[0].data() };
     }
  }

  return { 
    ctx: {
      user: dbUser,
      employee,
      farmer,
      tenantId: tenantId,
      role: membership.role
    } 
  };
}
