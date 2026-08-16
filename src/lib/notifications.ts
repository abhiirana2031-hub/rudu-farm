import { adminDb } from "./firebase/admin";

export async function sendNotification(
  tenantId: string,
  recipient: string,
  channel: "SMS" | "EMAIL" | "WHATSAPP",
  template: string,
  content: string
) {
  // This is an abstraction. In a real system, you would integrate Twilio, SendGrid, Gupshup, etc.
  const isSuccess = Math.random() > 0.05; // 95% simulated success rate

  const notificationRef = await adminDb.collection('tenants').doc(tenantId).collection('notifications').add({
    type: channel,
    template,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const logRef = await adminDb.collection('tenants').doc(tenantId).collection('notificationLogs').add({
    notificationId: notificationRef.id,
    recipient,
    channel,
    content,
    status: isSuccess ? 'SENT' : 'FAILED',
    providerResponse: isSuccess ? "200 OK" : "503 Service Unavailable",
    failureReason: isSuccess ? null : "Simulated network timeout",
    sentAt: isSuccess ? new Date() : null,
    createdAt: new Date()
  });

  return logRef.id;
}
