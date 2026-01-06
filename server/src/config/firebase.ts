import * as admin from "firebase-admin"
import serviceAccount from "./email-password-auth-3764b-firebase-adminsdk-fbsvc-6d88fcc3f4.json"

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID || "email-password-auth-3764b",
})

console.log("✅ Firebase Admin SDK Initialized")

export const firebaseAdmin = admin
export const auth = admin.auth()

export default admin
