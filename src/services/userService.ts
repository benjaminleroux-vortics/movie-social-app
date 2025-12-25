import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  arrayUnion,
  arrayRemove 
} from "firebase/firestore";
import { db } from "../config/firebase";
import { UserData } from "./authService";

// Mettre à jour le profil utilisateur
export const updateUserProfile = async (userId: string, updates: Partial<UserData>) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, updates);
    return true;
  } catch (error) {
    console.error("Erreur mise à jour profil:", error);
    return false;
  }
};

// Rechercher des utilisateurs
export const searchUsers = async (searchTerm: string): Promise<UserData[]> => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef);
    const querySnapshot = await getDocs(q);
    
    const users: UserData[] = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data() as UserData;
      if (userData.username.toLowerCase().includes(searchTerm.toLowerCase())) {
        users.push(userData);
      }
    });
    
    return users;
  } catch (error) {
    console.error("Erreur recherche utilisateurs:", error);
    return [];
  }
};

// Ajouter un film aux favoris
export const addToLikedMovies = async (userId: string, movie: any) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      likedMovies: arrayUnion(movie)
    });
    return true;
  } catch (error) {
    console.error("Erreur ajout film aimé:", error);
    return false;
  }
};


// Ajouter un film aux films vus
export const addToWatchedMovies = async (userId: string, movie: any) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      watchedMovies: arrayUnion(movie)
    });
    return true;
  } catch (error) {
    console.error("Erreur ajout film vu:", error);
    return false;
  }
};

// Ajouter/Mettre à jour une note
export const addOrUpdateRating = async (userId: string, movieId: string, rating: number, review?: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData;
      const ratings = userData.ratings || [];
      
      // Chercher si une note existe déjà
      const existingRatingIndex = ratings.findIndex((r: any) => r.movieId === movieId);
      
      const newRating = {
        movieId,
        rating,
        review: review || '',
        date: new Date().toISOString()
      };
      
      if (existingRatingIndex >= 0) {
        ratings[existingRatingIndex] = newRating;
      } else {
        ratings.push(newRating);
      }
      
      await updateDoc(userRef, { ratings });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erreur ajout note:", error);
    return false;
  }
};



// Retirer un ami
export const removeFriend = async (userId: string, friendId: string) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      friends: arrayRemove(friendId)
    });
    return true;
  } catch (error) {
    console.error("Erreur retrait ami:", error);
    return false;
  }
};

// Récupérer tous les utilisateurs
export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    
    const users: UserData[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as UserData);
    });
    
    return users;
  } catch (error) {
    console.error("Erreur récupération utilisateurs:", error);
    return [];
  }
};


// Ajouter un ami
export const addFriend = async (
  userId: string,
  friendId: string,
  friendUsername: string
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      friends: arrayUnion({
        id: friendId,
        username: friendUsername,
        addedAt: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Erreur ajout ami:', error);
    throw error;
  }
};

// Retirer un ami
export const removeFriendFromUser = async (
  userId: string,
  friendId: string
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    
    const updatedFriends = (userData?.friends || []).filter(
      (f: any) => f.id !== friendId
    );
    
    await updateDoc(userRef, {
      friends: updatedFriends
    });
  } catch (error) {
    console.error('Erreur suppression ami:', error);
    throw error;
  }
};

// Retirer un film des films aimés
export const removeFromLikedMovies = async (
  userId: string,
  movieTitle: string
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    
    const updatedLikedMovies = (userData?.likedMovies || []).filter(
      (m: any) => m.title !== movieTitle
    );
    
    await updateDoc(userRef, {
      likedMovies: updatedLikedMovies
    });
  } catch (error) {
    console.error('Erreur retrait film aimé:', error);
    throw error;
  }
};

// Retirer un film des films vus
export const removeFromWatchedMovies = async (
  userId: string,
  movieTitle: string
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    
    const updatedWatchedMovies = (userData?.watchedMovies || []).filter(
      (m: any) => m.title !== movieTitle
    );
    
    await updateDoc(userRef, {
      watchedMovies: updatedWatchedMovies
    });
  } catch (error) {
    console.error('Erreur retrait film vu:', error);
    throw error;
  }
};