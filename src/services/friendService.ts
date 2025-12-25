// Service Firebase pour le système d'amis
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy,
  Timestamp,
  onSnapshot  
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface FriendRequest {
  id?: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  toUsername: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// Envoyer une demande d'ami
export const sendFriendRequest = async (
  fromUserId: string,
  fromUsername: string,
  toUserId: string,
  toUsername: string
): Promise<void> => {
  try {
    // Vérifier qu'une demande n'existe pas déjà
    const existingRequest = await checkExistingRequest(fromUserId, toUserId);
    if (existingRequest) {
      throw new Error('Une demande est déjà en cours');
    }

    await addDoc(collection(db, 'friendRequests'), {
      fromUserId,
      fromUsername,
      toUserId,
      toUsername,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur envoi demande ami:', error);
    throw error;
  }
};

// Vérifier si une demande existe déjà
const checkExistingRequest = async (
  fromUserId: string,
  toUserId: string
): Promise<boolean> => {
  const q = query(
    collection(db, 'friendRequests'),
    where('fromUserId', '==', fromUserId),
    where('toUserId', '==', toUserId),
    where('status', '==', 'pending')
  );
  
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

// Récupérer les demandes d'amis reçues
export const getFriendRequests = async (userId: string): Promise<FriendRequest[]> => {
  try {
    const q = query(
      collection(db, 'friendRequests'),
      where('toUserId', '==', userId),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FriendRequest));
  } catch (error) {
    console.error('Erreur récupération demandes:', error);
    return [];
  }
};

// Accepter une demande d'ami
export const acceptFriendRequest = async (
  requestId: string,
  fromUserId: string,
  toUserId: string
): Promise<void> => {
  try {
    // Mettre à jour le statut de la demande
    const requestRef = doc(db, 'friendRequests', requestId);
    await updateDoc(requestRef, {
      status: 'accepted'
    });

    // Ajouter l'ami dans les deux profils
    const userRef1 = doc(db, 'users', fromUserId);
    const userRef2 = doc(db, 'users', toUserId);

    // On utilise arrayUnion dans userService.ts plus tard
    // Pour l'instant on met juste à jour le statut
  } catch (error) {
    console.error('Erreur acceptation ami:', error);
    throw error;
  }
};

// Refuser une demande d'ami
export const rejectFriendRequest = async (requestId: string): Promise<void> => {
  try {
    const requestRef = doc(db, 'friendRequests', requestId);
    await updateDoc(requestRef, {
      status: 'rejected'
    });
  } catch (error) {
    console.error('Erreur refus ami:', error);
    throw error;
  }
};

// Supprimer un ami
export const removeFriend = async (
  userId: string,
  friendId: string
): Promise<void> => {
  try {
    // La suppression se fait via userService en retirant de friends[]
    // Supprimer aussi les demandes associées
    const q1 = query(
      collection(db, 'friendRequests'),
      where('fromUserId', '==', userId),
      where('toUserId', '==', friendId)
    );
    
    const q2 = query(
      collection(db, 'friendRequests'),
      where('fromUserId', '==', friendId),
      where('toUserId', '==', userId)
    );

    const [snapshot1, snapshot2] = await Promise.all([
      getDocs(q1),
      getDocs(q2)
    ]);

    const deletePromises = [...snapshot1.docs, ...snapshot2.docs].map(doc =>
      deleteDoc(doc.ref)
    );

    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Erreur suppression ami:', error);
    throw error;
  }
};

// Récupérer tous les utilisateurs (pour recherche)
export const searchUsers = async (searchTerm: string, currentUserId: string): Promise<any[]> => {
  try {
    // Note: Firestore ne supporte pas la recherche LIKE
    // On récupère tous les users et on filtre côté client
    const snapshot = await getDocs(collection(db, 'users'));
    
    const users = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(user => 
        user.id !== currentUserId && 
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    return users;
  } catch (error) {
    console.error('Erreur recherche utilisateurs:', error);
    return [];
  }
};

import { onSnapshot } from 'firebase/firestore';

// Écouter les demandes d'amis en temps réel
export const subscribeFriendRequests = (
  userId: string,
  callback: (requests: FriendRequest[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'friendRequests'),
    where('toUserId', '==', userId),
    where('status', '==', 'pending'),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as FriendRequest));
    
    callback(requests);
  });

  return unsubscribe;
};