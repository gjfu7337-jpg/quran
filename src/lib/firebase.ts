import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFusNem672E2v2ge43Z2fOtV4Yc_3P8jg",
  authDomain: "qurab-cdce7.firebaseapp.com",
  projectId: "qurab-cdce7",
  storageBucket: "qurab-cdce7.firebasestorage.app",
  messagingSenderId: "978531179269",
  appId: "1:978531179269:web:bc9120e5b516183766b56c",
  measurementId: "G-TNLZ5PRXLG"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
