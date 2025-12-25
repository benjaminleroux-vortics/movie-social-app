# 🔥 Guide de Migration vers Firebase

## ✅ Ce qui a été créé

### Fichiers de configuration
- `/src/config/firebase.ts` - Configuration Firebase
- `/src/services/authService.ts` - Authentification (signup, signin, signout)
- `/src/services/userService.ts` - Gestion des utilisateurs (profil, amis, films)
- `/src/services/postService.ts` - Posts sociaux (créer, liker, commenter)

### Dépendances ajoutées
- `firebase` v10.7.1 dans package.json

---

## 🚀 Étapes de Migration

### Étape 1 : Installer les dépendances
```bash
npm install
```

### Étape 2 : Modifier App.tsx

#### A. Ajouter les imports Firebase en haut du fichier

Remplacer :
```typescript
import React, { useState, useEffect } from 'react';
import { Film, Home, Users, MessageCircle, Search, Heart, LogOut, User, Send, Sparkles } from 'lucide-react';
```

Par :
```typescript
import React, { useState, useEffect } from 'react';
import { Film, Home, Users, MessageCircle, Search, Heart, LogOut, User, Send, Sparkles } from 'lucide-react';
import { signUp, signIn, signOut, onAuthChange, getUserData } from './services/authService';
import { updateUserProfile, searchUsers, getAllUsers, addFriend, removeFriend } from './services/userService';
import { createPost, getAllPosts, likePost, addComment } from './services/postService';
```

#### B. Remplacer la fonction handleSignup

Ancien code (lignes ~145-175) :
```typescript
const handleSignup = () => {
  const existingUser = users.find(u => u.email === signupEmail);
  if (existingUser) {
    alert('Email déjà utilisé');
    return;
  }

  const newUser = {
    id: Date.now().toString(),
    username: signupUsername,
    email: signupEmail,
    password: signupPassword,
    // ... reste
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  setCurrentUser(newUser);
  setPage('home');
};
```

Nouveau code :
```typescript
const handleSignup = async () => {
  try {
    const userData = await signUp(signupEmail, signupPassword, signupUsername);
    setCurrentUser(userData);
    setPage('home');
    setSignupEmail('');
    setSignupPassword('');
    setSignupUsername('');
  } catch (error) {
    alert(error.message);
  }
};
```

#### C. Remplacer la fonction handleLogin

Ancien code :
```typescript
const handleLogin = () => {
  const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
  if (user) {
    setCurrentUser(user);
    setPage('home');
  } else {
    alert('Email ou mot de passe incorrect');
  }
};
```

Nouveau code :
```typescript
const handleLogin = async () => {
  try {
    const userData = await signIn(loginEmail, loginPassword);
    setCurrentUser(userData);
    setPage('home');
    setLoginEmail('');
    setLoginPassword('');
  } catch (error) {
    alert('Email ou mot de passe incorrect');
  }
};
```

#### D. Remplacer la fonction handleLogout

Ancien code :
```typescript
const handleLogout = () => {
  setCurrentUser(null);
  setPage('login');
};
```

Nouveau code :
```typescript
const handleLogout = async () => {
  try {
    await signOut();
    setCurrentUser(null);
    setPage('login');
  } catch (error) {
    console.error('Erreur déconnexion:', error);
  }
};
```

#### E. Ajouter useEffect pour observer l'authentification

Ajouter après les autres useEffect :
```typescript
// Observer l'état de connexion Firebase
useEffect(() => {
  const unsubscribe = onAuthChange(async (firebaseUser) => {
    if (firebaseUser) {
      const userData = await getUserData(firebaseUser.uid);
      if (userData) {
        setCurrentUser(userData);
      }
    } else {
      setCurrentUser(null);
    }
  });

  return () => unsubscribe();
}, []);
```

#### F. Remplacer loadUsers

Ancien code :
```typescript
const loadUsers = async () => {
  try {
    const result = localStorage.getItem('users');
    if (result) setUsers(JSON.parse(result));
  } catch (error) {
    console.log('Aucun utilisateur');
  }
};
```

Nouveau code :
```typescript
const loadUsers = async () => {
  const allUsers = await getAllUsers();
  setUsers(allUsers);
};
```

#### G. Remplacer toggleLike

Ancien code utilisant localStorage

Nouveau code :
```typescript
const toggleLike = async (movie) => {
  if (!currentUser) return;
  
  const isLiked = currentUser.likedMovies.some(m => m.id === movie.id);
  
  if (isLiked) {
    await removeFromLikedMovies(currentUser.id, movie);
  } else {
    await addToLikedMovies(currentUser.id, movie);
  }
  
  // Recharger les données utilisateur
  const updatedUser = await getUserData(currentUser.id);
  if (updatedUser) setCurrentUser(updatedUser);
};
```

#### H. Remplacer shareMovie

Ancien code utilisant localStorage

Nouveau code :
```typescript
const shareMovie = async (movie) => {
  if (!currentUser || !shareMessage) return;
  
  await createPost(currentUser.id, currentUser.username, movie, shareMessage);
  
  // Recharger les posts
  const allPosts = await getAllPosts();
  setPosts(allPosts);
  
  setSharingMovie(null);
  setShareMessage('');
};
```

---

## ⚠️ IMPORTANT : Règles Firestore

Dans Firebase Console → Firestore Database → Rules, remplace par :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Les utilisateurs peuvent lire tous les profils
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Les posts sont publics en lecture, seul l'auteur peut écrire
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 📝 À faire progressivement

1. ✅ Installer Firebase : `npm install`
2. ✅ Remplacer handleSignup, handleLogin, handleLogout
3. ✅ Ajouter l'observer d'authentification
4. ✅ Tester signup/login/logout
5. ⬜ Migrer toggleLike, toggleWatched
6. ⬜ Migrer shareMovie, loadPosts
7. ⬜ Migrer les amis (sendFriendRequest, acceptFriendRequest)
8. ⬜ Migrer les ratings
9. ⬜ Tester l'application complète
10. ⬜ Déployer sur Vercel

---

## 🆘 En cas de problème

- Vérifie que Firebase Authentication est activé (Email/Password)
- Vérifie que Firestore est créé en mode "test"
- Vérifie les règles Firestore
- Regarde la console du navigateur pour les erreurs

---

**Prêt à migrer ? Commence par les étapes 1-4, teste, puis reviens me voir pour la suite ! 🚀**
