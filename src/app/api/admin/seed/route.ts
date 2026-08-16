import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

export async function GET(req: NextRequest) {
  try {
    const adminEmail = "abhayrana8272@gmail.com";
    const adminPassword = "Admin@#005";
    const tenantId = "default";
    
    // 1. Create or get user in Firebase Auth
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(adminEmail);
      console.log("User already exists in Firebase Auth:", userRecord.uid);
      // Optional: Update password just to be sure
      await adminAuth.updateUser(userRecord.uid, { password: adminPassword });
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        userRecord = await adminAuth.createUser({
          email: adminEmail,
          password: adminPassword,
          displayName: "Abhay Chaudhary",
        });
        console.log("Created new user in Firebase Auth:", userRecord.uid);
      } else {
        throw error;
      }
    }
    
    const uid = userRecord.uid;

    console.log("Firebase App Name:", adminAuth.app.name);
    console.log("Firebase App Options:", adminAuth.app.options.projectId);
    
    try {
      adminDb.settings({ projectId: "rudu-dairy", ignoreUndefinedProperties: true });
    } catch (e) {
      // settings can only be called before any other methods
    }

    // 2. Create Global User Document
    await adminDb.collection("users").doc(uid).set({
      email: adminEmail,
      name: "Abhay Chaudhary",
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    }, { merge: true });
    
    // 3. Create Tenant Document
    await adminDb.collection("tenants").doc(tenantId).set({
      name: "Rudu Farm Default Tenant",
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    }, { merge: true });

    // 4. Create Tenant Membership Document (SUPER_ADMIN)
    await adminDb.collection("tenants").doc(tenantId).collection("members").doc(uid).set({
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      joinedAt: new Date().toISOString()
    }, { merge: true });

    // 5. Create default configuration (Session Config, Rate Rules) if they don't exist
    // Rate Rules
    await adminDb.collection("tenants").doc(tenantId).collection("rateRules").doc("default").set({
      baseRate: 54.0,
      standardFat: 4.0,
      standardSNF: 8.5,
      fatBonusPerUnit: 1.5,
      snfBonusPerUnit: 1.0,
      minRate: 40.0,
      maxRate: 80.0,
      effectiveStartDate: new Date().toISOString(),
    }, { merge: true });

    // Session Config
    const schedulesRef = adminDb.collection("tenants").doc(tenantId).collection("operatorSchedules");
    const morningSnap = await schedulesRef.where("sessionName", "==", "Morning Shift").get();
    if (morningSnap.empty) {
      await schedulesRef.add({
        sessionName: "Morning Shift",
        startTime: "05:00",
        endTime: "08:00",
        enabled: true
      });
    }

    const eveningSnap = await schedulesRef.where("sessionName", "==", "Evening Shift").get();
    if (eveningSnap.empty) {
      await schedulesRef.add({
        sessionName: "Evening Shift",
        startTime: "17:00",
        endTime: "20:00",
        enabled: true
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully. You can now log in.", 
      uid 
    });

  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
