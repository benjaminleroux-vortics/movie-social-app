// Service Firebase pour le chat / messages privés
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Message {
  id?: string;
  chatId: string;
  senderId: string;
  senderUsername: string;
  text: string;
  createdAt: string;
  read?: boolean;
}

export interface Chat {
  id?: string;
  participants: string[]; // [userId1, userId2]
  participantNames: { [userId: string]: string };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount?: { [userId: string]: number };
}

// Créer ou récupérer une conversation entre deux utilisateurs
export const getOrCreateChat = async (
  user1Id: string,
  user1Name: string,
  user2Id: string,
  user2Name: string
): Promise<string> => {
  try {
    // Chercher si une conversation existe déjà
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user1Id)
    );
    
    const snapshot = await getDocs(q);
    
    // Vérifier si l'autre participant est aussi dans la conversation
    const existingChat = snapshot.docs.find(doc => {
      const data = doc.data();
      return data.participants.includes(user2Id);
    });

    if (existingChat) {
      return existingChat.id;
    }

    // Créer une nouvelle conversation
    const chatRef = await addDoc(collection(db, 'chats'), {
      participants: [user1Id, user2Id],
      participantNames: {
        [user1Id]: user1Name,
        [user2Id]: user2Name
      },
      lastMessage: '',
      lastMessageAt: new Date().toISOString(),
      unreadCount: {
        [user1Id]: 0,
        [user2Id]: 0
      }
    });

    return chatRef.id;
  } catch (error) {
    console.error('Erreur création chat:', error);
    throw error;
  }
};

// Envoyer un message
export const sendMessage = async (
  chatId: string,
  senderId: string,
  senderUsername: string,
  text: string,
  recipientId: string
): Promise<void> => {
  try {
    // Ajouter le message
    await addDoc(collection(db, 'messages'), {
      chatId,
      senderId,
      senderUsername,
      text,
      createdAt: new Date().toISOString(),
      read: false
    });

    // Mettre à jour le chat avec le dernier message
    const chatRef = doc(db, 'chats', chatId);
    
    // Récupérer le chat actuel pour incrémenter unreadCount
    const chatDoc = await getDocs(query(collection(db, 'chats'), where('__name__', '==', chatId)));
    const chatData = chatDoc.docs[0]?.data();
    
    const currentUnreadCount = chatData?.unreadCount || {};
    
    await updateDoc(chatRef, {
      lastMessage: text.substring(0, 100), // Limiter à 100 caractères
      lastMessageAt: new Date().toISOString(),
      unreadCount: {
        ...currentUnreadCount,
        [recipientId]: (currentUnreadCount[recipientId] || 0) + 1
      }
    });
  } catch (error) {
    console.error('Erreur envoi message:', error);
    throw error;
  }
};

// Récupérer tous les chats d'un utilisateur
export const getUserChats = async (userId: string): Promise<Chat[]> => {
  try {
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', userId),
      orderBy('lastMessageAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Chat));
  } catch (error) {
    console.error('Erreur récupération chats:', error);
    return [];
  }
};

// Récupérer les messages d'un chat
export const getChatMessages = async (chatId: string): Promise<Message[]> => {
  try {
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('createdAt', 'asc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Message));
  } catch (error) {
    console.error('Erreur récupération messages:', error);
    return [];
  }
};

// Écouter les nouveaux messages en temps réel
export const subscribeToMessages = (
  chatId: string,
  callback: (messages: Message[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'messages'),
    where('chatId', '==', chatId),
    orderBy('createdAt', 'asc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Message));
    
    callback(messages);
  });

  return unsubscribe;
};

// Marquer les messages comme lus
export const markMessagesAsRead = async (
  chatId: string,
  userId: string
): Promise<void> => {
  try {
    const chatRef = doc(db, 'chats', chatId);
    
    // Récupérer le chat actuel
    const chatDoc = await getDocs(query(collection(db, 'chats'), where('__name__', '==', chatId)));
    const chatData = chatDoc.docs[0]?.data();
    
    const currentUnreadCount = chatData?.unreadCount || {};
    
    await updateDoc(chatRef, {
      unreadCount: {
        ...currentUnreadCount,
        [userId]: 0
      }
    });
  } catch (error) {
    console.error('Erreur marquage messages lus:', error);
    throw error;
  }
};

// Recommander un film à un ami via chat
export const recommendMovie = async (
  chatId: string,
  senderId: string,
  senderUsername: string,
  movie: any,
  recipientId: string
): Promise<void> => {
  try {
    const messageText = `🎬 Je te recommande : ${movie.title} (${movie.year})`;
    await sendMessage(chatId, senderId, senderUsername, messageText, recipientId);
  } catch (error) {
    console.error('Erreur recommandation film:', error);
    throw error;
  }
};
