import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp
} from "firebase/firestore";
import { db } from "../config/firebase";

export interface Post {
  id?: string;
  userId: string;
  username: string;
  movie: any;
  message: string;
  likes: string[];
  comments: Comment[];
  reactions?: any;
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

// Créer un post
export const createPost = async (userId: string, username: string, movie: any, message: string) => {
  try {
    const post: Omit<Post, 'id'> = {
      userId,
      username,
      movie,
      message,
      likes: [],
      comments: [],
      reactions: {},
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "posts"), post);
    return { id: docRef.id, ...post };
  } catch (error) {
    console.error("Erreur création post:", error);
    return null;
  }
};

// Récupérer tous les posts
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as Post);
    });
    
    return posts;
  } catch (error) {
    console.error("Erreur récupération posts:", error);
    return [];
  }
};

// Récupérer les posts d'un utilisateur
export const getUserPosts = async (userId: string): Promise<Post[]> => {
  try {
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", userId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const posts: Post[] = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() } as Post);
    });
    
    return posts;
  } catch (error) {
    console.error("Erreur récupération posts utilisateur:", error);
    return [];
  }
};

// Liker un post
export const likePost = async (postId: string, userId: string) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDocs(query(collection(db, "posts"), where("__name__", "==", postId)));
    
    if (!postDoc.empty) {
      const postData = postDoc.docs[0].data() as Post;
      const likes = postData.likes || [];
      
      if (likes.includes(userId)) {
        // Retirer le like
        await updateDoc(postRef, {
          likes: likes.filter(id => id !== userId)
        });
      } else {
        // Ajouter le like
        await updateDoc(postRef, {
          likes: [...likes, userId]
        });
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erreur like post:", error);
    return false;
  }
};

// Ajouter un commentaire
export const addComment = async (postId: string, userId: string, username: string, text: string) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postDoc = await getDocs(query(collection(db, "posts"), where("__name__", "==", postId)));
    
    if (!postDoc.empty) {
      const postData = postDoc.docs[0].data() as Post;
      const comments = postData.comments || [];
      
      const newComment: Comment = {
        id: Date.now().toString(),
        userId,
        username,
        text,
        createdAt: new Date().toISOString()
      };
      
      await updateDoc(postRef, {
        comments: [...comments, newComment]
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erreur ajout commentaire:", error);
    return false;
  }
};

// Supprimer un post
export const deletePost = async (postId: string) => {
  try {
    await deleteDoc(doc(db, "posts", postId));
    return true;
  } catch (error) {
    console.error("Erreur suppression post:", error);
    return false;
  }
};
