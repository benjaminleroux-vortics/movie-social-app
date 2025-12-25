// Service Firebase pour les notifications
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
  onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Notification {
  id?: string;
  userId: string;
  type: 'friend_request' | 'friend_accepted' | 'post_like' | 'post_comment' | 'message';
  message: string;
  fromUserId?: string;
  fromUsername?: string;
  relatedId?: string; // ID du post, de la demande d'ami, etc.
  read: boolean;
  createdAt: string;
}

// Créer une notification
export const createNotification = async (
  userId: string,
  type: Notification['type'],
  message: string,
  fromUserId?: string,
  fromUsername?: string,
  relatedId?: string
): Promise<void> => {
  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      type,
      message,
      fromUserId,
      fromUsername,
      relatedId,
      read: false,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur création notification:', error);
    throw error;
  }
};

// Récupérer les notifications d'un utilisateur
export const getUserNotifications = async (userId: string): Promise<Notification[]> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Notification));
  } catch (error) {
    console.error('Erreur récupération notifications:', error);
    return [];
  }
};

// Écouter les notifications en temps réel
export const subscribeToNotifications = (
  userId: string,
  callback: (notifications: Notification[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Notification));
    
    callback(notifications);
  });

  return unsubscribe;
};

// Marquer une notification comme lue
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  try {
    const notifRef = doc(db, 'notifications', notificationId);
    await updateDoc(notifRef, {
      read: true
    });
  } catch (error) {
    console.error('Erreur marquage notification:', error);
    throw error;
  }
};

// Marquer toutes les notifications comme lues
export const markAllNotificationsAsRead = async (userId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    const updatePromises = snapshot.docs.map(doc =>
      updateDoc(doc.ref, { read: true })
    );
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Erreur marquage toutes notifications:', error);
    throw error;
  }
};

// Supprimer une notification
export const deleteNotification = async (notificationId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'notifications', notificationId));
  } catch (error) {
    console.error('Erreur suppression notification:', error);
    throw error;
  }
};

// Supprimer toutes les notifications d'un utilisateur
export const deleteAllNotifications = async (userId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Erreur suppression toutes notifications:', error);
    throw error;
  }
};

// Notifications automatiques pour les actions courantes

// Notifier lors d'une demande d'ami
export const notifyFriendRequest = async (
  toUserId: string,
  fromUserId: string,
  fromUsername: string
): Promise<void> => {
  await createNotification(
    toUserId,
    'friend_request',
    `${fromUsername} vous a envoyé une demande d'ami`,
    fromUserId,
    fromUsername
  );
};

// Notifier lors de l'acceptation d'une demande d'ami
export const notifyFriendAccepted = async (
  toUserId: string,
  fromUserId: string,
  fromUsername: string
): Promise<void> => {
  await createNotification(
    toUserId,
    'friend_accepted',
    `${fromUsername} a accepté votre demande d'ami`,
    fromUserId,
    fromUsername
  );
};

// Notifier lors d'un like sur un post
export const notifyPostLike = async (
  postOwnerId: string,
  postId: string,
  fromUserId: string,
  fromUsername: string
): Promise<void> => {
  // Ne pas notifier si on like son propre post
  if (postOwnerId === fromUserId) return;
  
  await createNotification(
    postOwnerId,
    'post_like',
    `${fromUsername} a aimé votre post`,
    fromUserId,
    fromUsername,
    postId
  );
};

// Notifier lors d'un commentaire sur un post
export const notifyPostComment = async (
  postOwnerId: string,
  postId: string,
  fromUserId: string,
  fromUsername: string
): Promise<void> => {
  // Ne pas notifier si on commente son propre post
  if (postOwnerId === fromUserId) return;
  
  await createNotification(
    postOwnerId,
    'post_comment',
    `${fromUsername} a commenté votre post`,
    fromUserId,
    fromUsername,
    postId
  );
};

// Notifier lors d'un nouveau message
export const notifyNewMessage = async (
  toUserId: string,
  fromUserId: string,
  fromUsername: string,
  chatId: string
): Promise<void> => {
  await createNotification(
    toUserId,
    'message',
    `${fromUsername} vous a envoyé un message`,
    fromUserId,
    fromUsername,
    chatId
  );
};
