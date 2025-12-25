# 🔒 Configuration Sécurisée

## ✅ Ce qui a été fait

1. ✅ Les clés API sont maintenant dans `.env` (non versionné)
2. ✅ `firebase.ts` utilise les variables d'environnement
3. ✅ `movieService.ts` utilise les variables d'environnement
4. ✅ `.env` est dans `.gitignore`

---

## 📝 Installation locale

1. **Copie `.env.example` en `.env`** :
   ```bash
   cp .env.example .env
   ```

2. **Remplis `.env` avec tes vraies clés** :
   - Firebase : Utilise les valeurs existantes
   - Gemini : Crée une nouvelle clé sur https://aistudio.google.com/app/apikey

3. **Installe les dépendances** :
   ```bash
   npm install
   ```

4. **Lance en dev** :
   ```bash
   npm run dev
   ```

---

## 🚀 Déploiement Vercel

### Étape 1 : Ajouter les variables d'environnement

1. Va sur **Vercel Dashboard** → Ton projet
2. **Settings** → **Environment Variables**
3. Ajoute **TOUTES** ces variables :

```
VITE_FIREBASE_API_KEY = AIzaSyAkh65EHlbpP2udQRlhKxP7FQ8xi7KwLy8
VITE_FIREBASE_AUTH_DOMAIN = movie-social-app-cd0ff.firebaseapp.com
VITE_FIREBASE_PROJECT_ID = movie-social-app-cd0ff
VITE_FIREBASE_STORAGE_BUCKET = movie-social-app-cd0ff.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 939787402914
VITE_FIREBASE_APP_ID = 1:939787402914:web:45c8218d1f320ba97621fb
VITE_GEMINI_API_KEY = [TA_NOUVELLE_CLÉ_GEMINI]
```

### Étape 2 : Déployer

```bash
git add .
git commit -m "Secure API keys with environment variables"
git push
```

Vercel redéploiera automatiquement avec les variables d'environnement.

---

## ⚠️ Important

- **Ne commit JAMAIS le fichier `.env`** (il est déjà dans .gitignore)
- **Partage `.env.example`** pour que les autres développeurs sachent quelles variables sont nécessaires
- **Change la clé Gemini** dans `.env` avec ta nouvelle clé

---

## 🔐 Sécurité Firebase

La clé API Firebase publique est normale. La vraie sécurité vient de :

1. **Règles Firestore** (déjà configurées ✅)
2. **Domaines autorisés** :
   - Console Firebase → Settings → Your apps
   - Ajoute seulement : `localhost` et `movie-social-app-nqpy.vercel.app`
3. **Authentication** (déjà configurée ✅)

---

## ✅ Checklist de sécurité

- [x] `.env` dans `.gitignore`
- [x] Variables d'environnement dans le code
- [ ] Nouvelle clé Gemini générée
- [ ] Variables ajoutées dans Vercel
- [ ] Domaines Firebase restreints
- [ ] Code poussé sur GitHub

---

Tout est prêt ! 🎉
