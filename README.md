# 🎬 Movie Social App

Application sociale pour partager et découvrir des films avec tes amis !

## 🚀 Déploiement sur Vercel

### Étape 1 : Préparer le projet localement

1. **Installe Node.js** (si pas déjà fait)
   - Télécharge depuis : https://nodejs.org/
   - Prends la version LTS recommandée

2. **Extrait le projet**
   - Dézipe le fichier `movie-social-app.zip`
   - Ouvre un terminal dans le dossier `movie-social-app`

3. **Installe les dépendances**
   ```bash
   npm install
   ```

4. **Teste localement** (optionnel)
   ```bash
   npm run dev
   ```
   - Ouvre http://localhost:5173 dans ton navigateur

### Étape 2 : Crée un compte GitHub (si pas déjà fait)

1. Va sur https://github.com
2. Crée un compte gratuit
3. Vérifie ton email

### Étape 3 : Pousse ton code sur GitHub

1. **Initialise Git dans ton projet**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Crée un nouveau repository sur GitHub**
   - Va sur https://github.com/new
   - Nom : `movie-social-app`
   - Laisse-le Public ou Private (au choix)
   - Ne coche RIEN d'autre
   - Clique sur "Create repository"

3. **Pousse ton code**
   ```bash
   git remote add origin https://github.com/TON-USERNAME/movie-social-app.git
   git branch -M main
   git push -u origin main
   ```

### Étape 4 : Déploie sur Vercel

1. **Crée un compte Vercel**
   - Va sur https://vercel.com/signup
   - Connecte-toi avec GitHub (recommandé)

2. **Importe ton projet**
   - Clique sur "Add New..." → "Project"
   - Sélectionne ton repository `movie-social-app`
   - Clique sur "Import"

3. **Configure le projet**
   - Framework Preset : Vite
   - Root Directory : ./
   - Build Command : `npm run build`
   - Output Directory : `dist`
   - Clique sur "Deploy"

4. **Attends 2-3 minutes** ⏱️
   - Vercel va construire et déployer ton app
   - Tu recevras une URL gratuite (ex: movie-social-app.vercel.app)

### ✅ C'est fait !

Ton application est maintenant en ligne ! 🎉

---

## 📝 Phase 2 : Migration vers Firebase (À venir)

Les instructions pour intégrer Firebase seront fournies dans la prochaine étape.

### Ce qui va changer :
- ✅ Base de données partagée (tous les utilisateurs se voient)
- ✅ Authentification sécurisée
- ✅ Données synchronisées en temps réel
- ✅ Reviews et amis persistants

---

## 🛠️ Commandes utiles

```bash
# Lancer en local
npm run dev

# Construire pour la production
npm run build

# Preview de la build
npm run preview
```

## 📦 Structure du projet

```
movie-social-app/
├── public/              # Fichiers statiques
├── src/
│   ├── App.tsx         # Composant principal
│   ├── main.tsx        # Point d'entrée
│   └── index.css       # Styles de base
├── package.json        # Dépendances
├── vite.config.ts      # Configuration Vite
└── tsconfig.json       # Configuration TypeScript
```

## ⚠️ Note importante

Cette version utilise localStorage. Les données sont stockées localement dans le navigateur de chaque utilisateur. Pour une vraie application sociale avec base de données partagée, on va intégrer Firebase dans la Phase 2.

## 🆘 Problèmes ?

- Node.js pas installé → https://nodejs.org/
- Git pas installé → https://git-scm.com/
- Erreurs de build → Vérifie que toutes les dépendances sont installées avec `npm install`

---

**Bon déploiement ! 🚀**
