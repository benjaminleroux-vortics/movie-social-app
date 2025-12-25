import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

// Interface pour les données utilisateur
export interface UserData {
  id: string;
  username: string;
  email: string;
  likedMovies: any[];
  watchedMovies: any[];
  friends: string[];
  lists: any[];
  ratings: any[];
  badges: any[];
  profilePic: string | null;
  banner: string | null;
  createdAt: string;
}

// Inscription
export const signUp = async (email: string, password: string, username: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Créer le profil utilisateur dans Firestore
    const userData: UserData = {
      id: user.uid,
      username,
      email,
      likedMovies: [],
      watchedMovies: [],
      friends: [],
      lists: [],
      ratings: [],
      badges: [],
      profilePic: null,
      banner: null,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, "users", user.uid), userData);

    return userData;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Connexion
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Récupérer les données utilisateur
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    throw new Error("Utilisateur non trouvé");
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Déconnexion
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Observer l'état de connexion
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Récupérer les données d'un utilisateur
export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    return null;
  }
};
