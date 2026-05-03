import admin from 'firebase-admin';

export const initFirebase = () => {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    console.warn('⚠️  FIREBASE_PROJECT_ID not set — Firebase auth will not work');
    return;
  }
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL || ''
        })
      });
    }
    console.log('✅ Firebase Admin initialized');
  } catch (err) {
    console.warn('⚠️  Firebase init failed:', err.message);
  }
};

export const verifyFirebaseToken = async (idToken) => {
  return admin.auth().verifyIdToken(idToken);
};

export default admin;
