"use server";
import { adminDb } from "@/lib/firebase/admin";

export async function getFarmersAction(tenantId: string) {
  const snapshot = await adminDb.collection('tenants').doc(tenantId).collection('farmers')
    .orderBy('joiningDate', 'desc')
    .get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

export async function getCollectionsAction(tenantId: string) {
  const snapshot = await adminDb.collection('tenants').doc(tenantId).collection('milkCollections')
    .orderBy('time', 'desc')
    .limit(100)
    .get();
  // In a real app we'd map and join, but for simplicity here we return flat data.
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

export async function getOperatorSessionsAction(tenantId: string) {
  const snapshot = await adminDb.collection('tenants').doc(tenantId).collection('operatorSessions')
    .orderBy('actualLoginTime', 'desc')
    .limit(50)
    .get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

export async function getLedgerAction(tenantId: string) {
  const snapshot = await adminDb.collection('tenants').doc(tenantId).collection('ledgerTransactions')
    .orderBy('date', 'desc')
    .limit(100)
    .get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

export async function getRateRulesAction(tenantId: string) {
  const snapshot = await adminDb.collection('tenants').doc(tenantId).collection('rateRules')
    .orderBy('effectiveStartDate', 'desc')
    .get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}
