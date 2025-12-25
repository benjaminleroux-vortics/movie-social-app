import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAkh65EHlbpP2udQRlhKxP7FQ8xi7KwLy8",
  authDomain: "movie-social-app-cd0ff.firebaseapp.com",
  projectId: "movie-social-app-cd0ff",
  storageBucket: "movie-social-app-cd0ff.firebasestorage.app",
  messagingSenderId: "939787402914",
  appId: "1:939787402914:web:45c8218d1f320ba97621fb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
