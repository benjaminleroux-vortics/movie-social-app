// Service Firebase pour les listes personnalisées de films
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc,
  deleteDoc,
  doc, 
  query, 
  where,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface MovieList {
  id?: string;
  userId: string;
  name: string;
  description?: string;
  movies: any[]; // Liste des films
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Créer une liste
export const createList = async (
  userId: string,
  name: string,
  description?: string,
  isPublic: boolean = false
): Promise<string> => {
  try {
    const listRef = await addDoc(collection(db, 'movieLists'), {
      userId,
      name,
      description: description || '',
      movies: [],
      isPublic,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return listRef.id;
  } catch (error) {
    console.error('Erreur création liste:', error);
    throw error;
  }
};

// Récupérer les listes d'un utilisateur
export const getUserLists = async (userId: string): Promise<MovieList[]> => {
  try {
    const q = query(
      collection(db, 'movieLists'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MovieList));
  } catch (error) {
    console.error('Erreur récupération listes:', error);
    return [];
  }
};

// Récupérer une liste spécifique
export const getList = async (listId: string): Promise<MovieList | null> => {
  try {
    const snapshot = await getDocs(
      query(collection(db, 'movieLists'), where('__name__', '==', listId))
    );
    
    if (snapshot.empty) return null;
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as MovieList;
  } catch (error) {
    console.error('Erreur récupération liste:', error);
    return null;
  }
};

// Ajouter un film à une liste
export const addMovieToList = async (
  listId: string,
  movie: any
): Promise<void> => {
  try {
    const listRef = doc(db, 'movieLists', listId);
    
    await updateDoc(listRef, {
      movies: arrayUnion(movie),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur ajout film à liste:', error);
    throw error;
  }
};

// Retirer un film d'une liste
export const removeMovieFromList = async (
  listId: string,
  movie: any
): Promise<void> => {
  try {
    const listRef = doc(db, 'movieLists', listId);
    
    await updateDoc(listRef, {
      movies: arrayRemove(movie),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur retrait film de liste:', error);
    throw error;
  }
};

// Mettre à jour une liste (nom, description, visibilité)
export const updateList = async (
  listId: string,
  updates: {
    name?: string;
    description?: string;
    isPublic?: boolean;
  }
): Promise<void> => {
  try {
    const listRef = doc(db, 'movieLists', listId);
    
    await updateDoc(listRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur mise à jour liste:', error);
    throw error;
  }
};

// Supprimer une liste
export const deleteList = async (listId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'movieLists', listId));
  } catch (error) {
    console.error('Erreur suppression liste:', error);
    throw error;
  }
};

// Récupérer les listes publiques (pour découverte)
export const getPublicLists = async (limit: number = 20): Promise<MovieList[]> => {
  try {
    const q = query(
      collection(db, 'movieLists'),
      where('isPublic', '==', true)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MovieList))
      .slice(0, limit);
  } catch (error) {
    console.error('Erreur récupération listes publiques:', error);
    return [];
  }
};

// Dupliquer une liste (pour copier une liste publique)
export const duplicateList = async (
  originalListId: string,
  newUserId: string,
  newName?: string
): Promise<string> => {
  try {
    const originalList = await getList(originalListId);
    if (!originalList) throw new Error('Liste introuvable');
    
    const newListId = await createList(
      newUserId,
      newName || `Copie de ${originalList.name}`,
      originalList.description,
      false // Toujours privée par défaut
    );
    
    // Copier les films
    for (const movie of originalList.movies) {
      await addMovieToList(newListId, movie);
    }
    
    return newListId;
  } catch (error) {
    console.error('Erreur duplication liste:', error);
    throw error;
  }
};

// Vérifier si un film est dans une liste
export const isMovieInList = async (
  listId: string,
  movieTitle: string
): Promise<boolean> => {
  try {
    const list = await getList(listId);
    if (!list) return false;
    
    return list.movies.some(m => m.title === movieTitle);
  } catch (error) {
    console.error('Erreur vérification film dans liste:', error);
    return false;
  }
};
