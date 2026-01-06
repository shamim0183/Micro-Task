import admin from "firebase-admin"

// Initialize Firebase Admin using environment variable
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID || "email-password-auth-3764b",
  })
}

console.log("✅ Firebase Admin SDK Initialized")

export const firebaseAdmin = admin
export const auth = admin.auth()

export default admin
