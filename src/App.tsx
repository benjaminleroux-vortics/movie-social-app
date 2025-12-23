import React, { useState, useEffect } from 'react';
import { Film, Home, Users, MessageCircle, Search, Heart, LogOut, User, Send, Sparkles } from 'lucide-react';

const CineMatchApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState('login');
  const [users, setUsers] = useState([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [mood, setMood] = useState('');
  const [genre, setGenre] = useState('');
  const [actor, setActor] = useState('');
  const [duration, setDuration] = useState('');
  const [era, setEra] = useState('');
  const [watchWith, setWatchWith] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mediaSearchResults, setMediaSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [viewingProfile, setViewingProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [shareMessage, setShareMessage] = useState('');
  const [sharingMovie, setSharingMovie] = useState(null);
  const [commentTexts, setCommentTexts] = useState({});
  const [commentPrivacy, setCommentPrivacy] = useState('public');
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [identifyDescription, setIdentifyDescription] = useState('');
  const [identifyResult, setIdentifyResult] = useState(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [identifyActor, setIdentifyActor] = useState('');
  const [identifyYear, setIdentifyYear] = useState('');
  const [identifyGenre, setIdentifyGenre] = useState('');
  const [identifyLocation, setIdentifyLocation] = useState('');
  const [identifySummary, setIdentifySummary] = useState('');
  const [identifyCharacters, setIdentifyCharacters] = useState('');
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedList, setSelectedList] = useState(null);
  const [ratingMovie, setRatingMovie] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [feedFilter, setFeedFilter] = useState('all');
  const [upcomingReleases, setUpcomingReleases] = useState([]);
  const [isLoadingReleases, setIsLoadingReleases] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [viewMode, setViewMode] = useState('list');
  const [showProfilePicUpload, setShowProfilePicUpload] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [emojiReactions, setEmojiReactions] = useState({});

  useEffect(() => {
    loadUsers();
    if (currentUser) {
      loadFriendRequests();
      loadPosts();
      loadChats();
      loadNotifications();
      checkBadges();
    }
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      const result = await window.storage.get('users');
      if (result) setUsers(JSON.parse(result.value));
    } catch (error) {
      console.log('Aucun utilisateur');
    }
  };

  const saveUsers = async (updatedUsers) => {
    await window.storage.set('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const loadFriendRequests = async () => {
    try {
      const result = await window.storage.get('friendRequests');
      if (result) {
        const allRequests = JSON.parse(result.value);
        setFriendRequests(allRequests.filter(req => req.toUserId === currentUser.id));
      }
    } catch (error) {
      console.log('Aucune demande');
    }
  };

  const saveFriendRequests = async (requests) => {
    await window.storage.set('friendRequests', JSON.stringify(requests));
    if (currentUser) {
      setFriendRequests(requests.filter(req => req.toUserId === currentUser.id));
    }
  };

  const loadPosts = async () => {
    try {
      const result = await window.storage.get('posts');
      if (result) setPosts(JSON.parse(result.value));
    } catch (error) {
      console.log('Aucun post');
    }
  };

  const savePosts = async (updatedPosts) => {
    await window.storage.set('posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const loadChats = async () => {
    try {
      const result = await window.storage.get('chats');
      if (result) {
        const allChats = JSON.parse(result.value);
        setChats(allChats.filter(chat => chat.participants.includes(currentUser.id)));
      }
    } catch (error) {
      console.log('Aucun chat');
    }
  };

  const saveChats = async (updatedChats) => {
    await window.storage.set('chats', JSON.stringify(updatedChats));
    setChats(updatedChats.filter(chat => chat.participants.includes(currentUser.id)));
  };

  const handleSignup = async () => {
    if (!signupUsername || !signupEmail || !signupPassword) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    if (users.some(u => u.email === signupEmail)) {
      alert('Cet email est déjà utilisé');
      return;
    }
    const newUser = {
      id: Date.now().toString(),
      username: signupUsername,
      email: signupEmail,
      password: signupPassword,
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
    await saveUsers([...users, newUser]);
    setCurrentUser(newUser);
    setPage('home');
    alert('Compte créé ! 🎉');
  };

  const handleLogin = () => {
    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
    if (user) {
      setCurrentUser(user);
      setPage('home');
    } else {
      alert('Email ou mot de passe incorrect');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPage('login');
    setLoginEmail('');
    setLoginPassword('');
  };

  const getAIRecommendation = async () => {
    if (!mediaType) {
      alert('Veuillez choisir si vous cherchez un film ou une série');
      return;
    }
    if (!mood && !genre && !actor && !duration && !era && !watchWith) {
      alert('Veuillez renseigner au moins un critère');
      return;
    }
    setIsLoading(true);
    try {
      const mediaLabel = mediaType === 'film' ? 'film' : 'série';
      
      // Liste des films/séries déjà vus pour éviter de les proposer
      const watchedTitles = currentUser.watchedMovies.map(m => m.title).join(', ');
      const excludeText = watchedTitles ? `\nNe propose PAS ces ${mediaLabel}s déjà vus : ${watchedTitles}` : '';
      
      const criteriaText = `
${mood ? `- Humeur: ${mood}` : ''}
${genre ? `- Genre: ${genre}` : ''}
${actor ? `- Acteur préféré: ${actor}` : ''}
${duration ? `- Durée: ${duration}` : ''}
${era ? `- Période: ${era}` : ''}
${watchWith ? `- Regarder avec: ${watchWith}` : ''}${excludeText}
      `.trim();

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Tu es un expert en recommandation de ${mediaLabel}s. Un utilisateur recherche un${mediaType === 'film' ? '' : 'e'} ${mediaLabel} avec ces critères:
${criteriaText}

Réponds UNIQUEMENT en JSON (sans markdown, sans backticks):
{
  "title": "Titre du ${mediaLabel}",
  "year": "Année",
  "director": "${mediaType === 'film' ? 'Réalisateur' : 'Créateur'}",
  "actors": "Acteurs principaux",
  "synopsis": "Synopsis en 2-3 phrases",
  "why": "Pourquoi ce ${mediaLabel} correspond aux critères (2 phrases max)",
  "rating": "Note/10",
  "type": "${mediaType}"
  ${mediaType === 'serie' ? ',"seasons": "Nombre de saisons"' : ''}
}`
          }]
        })
      });
      const data = await response.json();
      const text = data.content.find(i => i.type === "text")?.text || "";
      setAiRecommendation(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch (error) {
      alert('Erreur lors de la recommandation');
    } finally {
      setIsLoading(false);
    }
  };

  const likeMovie = async (movie) => {
    const alreadyLiked = currentUser.likedMovies.some(m => 
      m.title.toLowerCase() === movie.title.toLowerCase() && 
      m.year === movie.year
    );
    
    if (alreadyLiked) {
      const mediaLabel = movie.type === 'serie' ? 'série' : 'film';
      alert(`Ce${movie.type === 'serie' ? 'tte' : ''} ${mediaLabel} est déjà dans vos favoris ! ❤️`);
      return;
    }
    
    const updatedUser = { ...currentUser, likedMovies: [...currentUser.likedMovies, { ...movie, likedAt: new Date().toISOString() }] };
    await saveUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    const mediaLabel = movie.type === 'serie' ? 'série' : 'film';
    alert(`${movie.type === 'serie' ? 'Série' : 'Film'} ajouté${movie.type === 'serie' ? 'e' : ''} aux favoris ! ❤️`);
  };

  const markAsWatched = async (movie) => {
    const alreadyWatched = currentUser.watchedMovies?.some(m => 
      m.title.toLowerCase() === movie.title.toLowerCase() && 
      m.year === movie.year
    );
    
    if (alreadyWatched) {
      const mediaLabel = movie.type === 'serie' ? 'série' : 'film';
      alert(`Ce${movie.type === 'serie' ? 'tte' : ''} ${mediaLabel} est déjà marqué${movie.type === 'serie' ? 'e' : ''} comme vu${movie.type === 'serie' ? 'e' : ''} !`);
      return;
    }
    
    const watchedMovies = currentUser.watchedMovies || [];
    const updatedUser = { ...currentUser, watchedMovies: [...watchedMovies, { ...movie, watchedAt: new Date().toISOString() }] };
    await saveUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    alert('Marqué comme vu ! ✓ L\'IA ne le proposera plus.');
  };

  // Créer une liste
  const createList = async () => {
    if (!newListName.trim()) {
      alert('Veuillez entrer un nom de liste');
      return;
    }
    const lists = currentUser.lists || [];
    const newList = {
      id: Date.now().toString(),
      name: newListName,
      movies: [],
      createdAt: new Date().toISOString()
    };
    const updatedUser = { ...currentUser, lists: [...lists, newList] };
    await saveUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setNewListName('');
    setShowCreateList(false);
    alert('Liste créée ! ✓');
  };

  // Ajouter à une liste
  const addToList = async (listId, movie) => {
    const lists = currentUser.lists || [];
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        const alreadyInList = list.movies.some(m => m.title === movie.title && m.year === movie.year);
        if (alreadyInList) {
          alert('Déjà dans cette liste !');
          return list;
        }
        return { ...list, movies: [...list.movies, movie] };
      }
      return list;
    });
    const updatedUser = { ...currentUser, lists: updatedLists };
    await saveUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    alert('Ajouté à la liste ! ✓');
  };

  // Supprimer une liste
  const deleteList = async (listId) => {
    if (!confirm('Supprimer cette liste ?')) return;
    const lists = currentUser.lists || [];
    const updatedUser = { ...currentUser, lists: lists.filter(l => l.id !== listId) };
    await saveUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    alert('Liste supprimée');
  };

  // Noter un film
  const rateMovie = async (movie, rating) => {
    const ratings = currentUser.ratings || [];
    const existingIndex = ratings.findIndex(r => r.title === movie.title && r.year === movie.year);
    let updatedRatings;
    if (existingIndex >= 0) {
      updatedRatings = [...ratings];
      updatedRatings[existingIndex] = { ...movie, userRating: rating, ratedAt: new Date().toISOString() };
    } else {
      updatedRatings = [...ratings, { ...movie, userRating: rating, ratedAt: new Date().toISOString() }];
    }
    const updatedUser = { ...currentUser, ratings: updatedRatings };
    await saveUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
    setRatingMovie(null);
    setUserRating(0);
    alert(`Noté ${rating}/10 ! ⭐`);
  };

  // Obtenir la note utilisateur
  const getUserRating = (movie) => {
    const ratings = currentUser.ratings || [];
    const rating = ratings.find(r => r.title === movie.title && r.year === movie.year);
    return rating ? rating.userRating : null;
  };

  // Recommandations intelligentes basées sur l'historique
  const getSmartRecommendation = async () => {
    const likedMovies = currentUser.likedMovies || [];
    const ratings = currentUser.ratings || [];
    
    if (likedMovies.length === 0 && ratings.length === 0) {
      alert('Aimez ou notez des films d\'abord pour des recommandations personnalisées !');
      return;
    }

    setIsLoading(true);
    try {
      const topRated = ratings.filter(r => r.userRating >= 8).slice(0, 3);
      const favorites = likedMovies.slice(0, 3);
      
      const historyText = `
Films aimés : ${favorites.map(m => `${m.title} (${m.year})`).join(', ')}
Films bien notés : ${topRated.map(m => `${m.title} (${m.year}) - Note: ${m.userRating}/10`).join(', ')}
      `.trim();

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Analyse l'historique de cet utilisateur et recommande un film/série qu'il n'a pas encore vu :
${historyText}

Réponds en JSON :
{
  "title": "Titre",
  "year": "Année",
  "director": "Réalisateur",
  "actors": "Acteurs",
  "synopsis": "Synopsis",
  "why": "Pourquoi basé sur l'historique (2 phrases)",
  "rating": "Note/10",
  "type": "film ou serie",
  "seasons": "Saisons si série"
}`
          }]
        })
      });
      const data = await response.json();
      const text = data.content.find(i => i.type === "text")?.text || "";
      setAiRecommendation(JSON.parse(text.replace(/```json|```/g, "").trim()));
      setPage('ai');
    } catch (error) {
      alert('Erreur lors de la recommandation');
    } finally {
      setIsLoading(false);
    }
  };

  // Obtenir les prochaines sorties
  const getUpcomingReleases = async () => {
    setIsLoadingReleases(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{
            role: "user",
            content: `Liste 5 films ou séries qui sortent prochainement (dans les 3 prochains mois) en 2024-2025. Réponds en JSON array :
[
  {
    "title": "Titre",
    "releaseDate": "Date de sortie",
    "type": "film ou serie",
    "director": "Réalisateur",
    "synopsis": "Court synopsis",
    "genre": "Genre"
  }
]`
          }]
        })
      });
      const data = await response.json();
      const text = data.content.find(i => i.type === "text")?.text || "";
      setUpcomingReleases(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch (error) {
      alert('Erreur lors du chargement');
    } finally {
      setIsLoadingReleases(false);
    }
  };

  // Charger les notifications
  const loadNotifications = async () => {
    try {
      const result = await window.storage.get('notifications');
      if (result) {
        const allNotifs = JSON.parse(result.value);
        setNotifications(allNotifs.filter(n => n.userId === currentUser.id));
      }
    } catch (error) {
      console.log('Aucune notification');
    }
  };

  // Ajouter une notification
  const addNotification = async (userId, message, type) => {
    try {
      const result = await window.storage.get('notifications');
      const allNotifs = result ? JSON.parse(result.value) : [];
      const newNotif = {
        id: Date.now().toString(),
        userId: userId,
        message: message,
        type: type,
        read: false,
        createdAt: new Date().toISOString()
      };
      await window.storage.set('notifications', JSON.stringify([...allNotifs, newNotif]));
      if (userId === currentUser.id) {
        setNotifications([newNotif, ...notifications]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Marquer comme lu
  const markNotificationRead = async (notifId) => {
    try {
      const result = await window.storage.get('notifications');
      const allNotifs = result ? JSON.parse(result.value) : [];
      const updated = allNotifs.map(n => n.id === notifId ? { ...n, read: true } : n);
      await window.storage.set('notifications', JSON.stringify(updated));
      setNotifications(updated.filter(n => n.userId === currentUser.id));
    } catch (error) {
      console.error(error);
    }
  };

  // Vérifier et attribuer les badges
  const checkBadges = async () => {
    const badges = currentUser.badges || [];
    const newBadges = [];

    // Badge Marathonien : 50 films vus
    if ((currentUser.watchedMovies?.length || 0) >= 50 && !badges.find(b => b.id === 'marathonien')) {
      newBadges.push({ id: 'marathonien', name: 'Marathonien', icon: '🏃', description: '50 films/séries vus' });
    }

    // Badge Critique : 20 films notés
    if ((currentUser.ratings?.length || 0) >= 20 && !badges.find(b => b.id === 'critique')) {
      newBadges.push({ id: 'critique', name: 'Critique', icon: '⭐', description: '20 films/séries notés' });
    }

    // Badge Social : 10 amis
    if (currentUser.friends.length >= 10 && !badges.find(b => b.id === 'social')) {
      newBadges.push({ id: 'social', name: 'Social', icon: '👥', description: '10 amis' });
    }

    // Badge Organisé : 5 listes créées
    if ((currentUser.lists?.length || 0) >= 5 && !badges.find(b => b.id === 'organise')) {
      newBadges.push({ id: 'organise', name: 'Organisé', icon: '📝', description: '5 listes créées' });
    }

    if (newBadges.length > 0) {
      const updatedUser = { ...currentUser, badges: [...badges, ...newBadges] };
      await saveUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
      setCurrentUser(updatedUser);
      newBadges.forEach(badge => {
        addNotification(currentUser.id, `🏆 Nouveau badge débloqué : ${badge.name} ${badge.icon}`, 'badge');
      });
    }
  };

  // Calculer les statistiques
  const getStats = () => {
    const watched = currentUser.watchedMovies || [];
    const ratings = currentUser.ratings || [];
    
    // Temps total (estimation 2h par film, 45min par épisode série)
    const totalMinutes = watched.reduce((acc, m) => {
      if (m.type === 'serie' && m.seasons) {
        return acc + (parseInt(m.seasons) * 10 * 45); // ~10 épisodes par saison
      }
      return acc + 120; // 2h par film
    }, 0);
    const totalHours = Math.round(totalMinutes / 60);

    // Genre préféré
    const genres = {};
    [...currentUser.likedMovies, ...watched].forEach(m => {
      if (m.genre) {
        genres[m.genre] = (genres[m.genre] || 0) + 1;
      }
    });
    const favoriteGenre = Object.keys(genres).sort((a, b) => genres[b] - genres[a])[0] || 'Aucun';

    // Note moyenne
    const avgRating = ratings.length > 0 
      ? (ratings.reduce((acc, r) => acc + r.userRating, 0) / ratings.length).toFixed(1)
      : 0;

    return { totalHours, favoriteGenre, avgRating };
  };

  // Réaction emoji sur un post
  const reactToPost = async (postId, emoji) => {
    try {
      const result = await window.storage.get('posts');
      const allPosts = result ? JSON.parse(result.value) : [];
      
      const updatedPosts = allPosts.map(post => {
        if (post.id === postId) {
          const reactions = post.reactions || {};
          const userReactions = reactions[currentUser.id] || [];
          
          if (userReactions.includes(emoji)) {
            reactions[currentUser.id] = userReactions.filter(e => e !== emoji);
          } else {
            reactions[currentUser.id] = [...userReactions, emoji];
          }
          
          return { ...post, reactions };
        }
        return post;
      });

      await savePosts(updatedPosts);
    } catch (error) {
      console.error(error);
    }
  };

  // Compter les réactions
  const getReactionCount = (post, emoji) => {
    const reactions = post.reactions || {};
    return Object.values(reactions).filter(userReactions => userReactions.includes(emoji)).length;
  };

  // Vérifier si l'utilisateur a réagi
  const hasReacted = (post, emoji) => {
    const reactions = post.reactions || {};
    const userReactions = reactions[currentUser.id] || [];
    return userReactions.includes(emoji);
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const searchMedia = async () => {
    if (!searchTerm.trim()) {
      alert('Veuillez entrer un titre de film ou série');
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{
            role: "user",
            content: `Recherche le film ou la série "${searchTerm}". Réponds UNIQUEMENT en JSON (sans markdown, sans backticks):
{
  "title": "Titre exact",
  "year": "Année",
  "director": "Réalisateur ou Créateur",
  "actors": "Acteurs principaux",
  "synopsis": "Synopsis en 2-3 phrases",
  "rating": "Note/10",
  "type": "film ou serie",
  "seasons": "Nombre de saisons (seulement si série)"
}`
          }]
        })
      });
      const data = await response.json();
      const text = data.content.find(i => i.type === "text")?.text || "";
      const result = JSON.parse(text.replace(/```json|```/g, "").trim());
      setMediaSearchResults([result]);
    } catch (error) {
      alert('Aucun résultat trouvé');
      setMediaSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const searchUsers = () => {
    if (!userSearchQuery.trim()) {
      setUserSearchResults([]);
      return;
    }
    setUserSearchResults(users.filter(u => u.id !== currentUser.id && u.username.toLowerCase().includes(userSearchQuery.toLowerCase())));
  };

  const identifyMedia = async () => {
    if (!identifyDescription.trim() && !identifyActor.trim() && !identifyYear.trim() && !identifyGenre.trim() && !identifyLocation.trim() && !identifySummary.trim() && !identifyCharacters.trim()) {
      alert('Veuillez renseigner au moins un critère');
      return;
    }
    setIsIdentifying(true);
    try {
      const criteria = `
${identifyDescription ? `Description/Scène : ${identifyDescription}` : ''}
${identifyActor ? `Acteur/Actrice : ${identifyActor}` : ''}
${identifyYear ? `Année approximative : ${identifyYear}` : ''}
${identifyGenre ? `Genre : ${identifyGenre}` : ''}
${identifyLocation ? `Lieu/Décor : ${identifyLocation}` : ''}
${identifySummary ? `Résumé/Intrigue : ${identifySummary}` : ''}
${identifyCharacters ? `Noms des personnages : ${identifyCharacters}` : ''}
      `.trim();

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{
            role: "user",
            content: `Un utilisateur essaie d'identifier un film ou une série avec ces indices :
${criteria}

Analyse ces informations et identifie le film ou la série le plus probable. Réponds UNIQUEMENT en JSON (sans markdown, sans backticks) :
{
  "title": "Titre identifié",
  "year": "Année",
  "director": "Réalisateur ou Créateur",
  "actors": "Acteurs principaux",
  "synopsis": "Synopsis en 2-3 phrases",
  "rating": "Note/10",
  "type": "film ou serie",
  "seasons": "Nombre de saisons (si série)",
  "confidence": "Niveau de confiance (élevé/moyen/faible)",
  "why": "Pourquoi cette identification correspond (1-2 phrases)"
}`
          }]
        })
      });
      const data = await response.json();
      const text = data.content.find(i => i.type === "text")?.text || "";
      const result = JSON.parse(text.replace(/```json|```/g, "").trim());
      setIdentifyResult(result);
    } catch (error) {
      alert('Impossible d\'identifier. Essayez avec plus de détails.');
      setIdentifyResult(null);
    } finally {
      setIsIdentifying(false);
    }
  };

  const isFriend = (userId) => currentUser.friends.some(f => f.id === userId);

  const sendFriendRequest = async (toUser) => {
    try {
      const result = await window.storage.get('friendRequests');
      const allRequests = result ? JSON.parse(result.value) : [];
      const newRequest = {
        id: Date.now().toString(),
        fromUserId: currentUser.id,
        fromUsername: currentUser.username,
        toUserId: toUser.id,
        toUsername: toUser.username,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      await saveFriendRequests([...allRequests, newRequest]);
      alert(`Demande envoyée à ${toUser.username} !`);
    } catch (error) {
      console.error(error);
    }
  };

  const acceptFriendRequest = async (request) => {
    try {
      const result = await window.storage.get('friendRequests');
      const allRequests = result ? JSON.parse(result.value) : [];
      await saveFriendRequests(allRequests.map(req => req.id === request.id ? { ...req, status: 'accepted' } : req));
      const fromUser = users.find(u => u.id === request.fromUserId);
      const toUser = users.find(u => u.id === request.toUserId);
      const updatedUsers = users.map(u => {
        if (u.id === fromUser.id) return { ...u, friends: [...u.friends, { id: toUser.id, username: toUser.username, addedAt: new Date().toISOString() }] };
        if (u.id === toUser.id) return { ...u, friends: [...u.friends, { id: fromUser.id, username: fromUser.username, addedAt: new Date().toISOString() }] };
        return u;
      });
      await saveUsers(updatedUsers);
      setCurrentUser(updatedUsers.find(u => u.id === currentUser.id));
      alert(`Vous êtes ami avec ${fromUser.username} ! 🎉`);
    } catch (error) {
      console.error(error);
    }
  };

  const rejectFriendRequest = async (request) => {
    try {
      const result = await window.storage.get('friendRequests');
      const allRequests = result ? JSON.parse(result.value) : [];
      await saveFriendRequests(allRequests.map(req => req.id === request.id ? { ...req, status: 'rejected' } : req));
      alert('Demande refusée');
    } catch (error) {
      console.error(error);
    }
  };

  const shareMovie = async (movie) => {
    if (!shareMessage.trim()) {
      alert('Veuillez ajouter un message');
      return;
    }
    try {
      const result = await window.storage.get('posts');
      const allPosts = result ? JSON.parse(result.value) : [];
      const newPost = {
        id: Date.now().toString(),
        userId: currentUser.id,
        username: currentUser.username,
        movie: movie,
        message: shareMessage,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString()
      };
      await savePosts([newPost, ...allPosts]);
      setShareMessage('');
      setSharingMovie(null);
      setPage('feed');
      alert('Film partagé ! 🎉');
    } catch (error) {
      console.error(error);
    }
  };

  const likePost = async (postId) => {
    try {
      const result = await window.storage.get('posts');
      const allPosts = result ? JSON.parse(result.value) : [];
      await savePosts(allPosts.map(post => {
        if (post.id === postId) {
          const hasLiked = post.likes.includes(currentUser.id);
          return { ...post, likes: hasLiked ? post.likes.filter(id => id !== currentUser.id) : [...post.likes, currentUser.id] };
        }
        return post;
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const commentPost = async (postId) => {
    const text = commentTexts[postId];
    if (!text?.trim()) return;
    try {
      const result = await window.storage.get('posts');
      const allPosts = result ? JSON.parse(result.value) : [];
      await savePosts(allPosts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            comments: [...post.comments, {
              id: Date.now().toString(),
              userId: currentUser.id,
              username: currentUser.username,
              text: text,
              privacy: commentPrivacy,
              createdAt: new Date().toISOString()
            }]
          };
        }
        return post;
      }));
      setCommentTexts({ ...commentTexts, [postId]: '' });
      alert('Commentaire ajouté !');
    } catch (error) {
      console.error(error);
    }
  };

  const sendChatMessage = async (friendId) => {
    if (!chatMessage.trim()) return;
    try {
      const result = await window.storage.get('chats');
      const allChats = result ? JSON.parse(result.value) : [];
      let chat = allChats.find(c => c.participants.includes(currentUser.id) && c.participants.includes(friendId));
      const newMessage = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        senderUsername: currentUser.username,
        text: chatMessage,
        createdAt: new Date().toISOString()
      };
      if (chat) {
        chat.messages.push(newMessage);
        chat.lastMessage = chatMessage;
        chat.lastMessageAt = new Date().toISOString();
      } else {
        const friend = users.find(u => u.id === friendId);
        chat = {
          id: Date.now().toString(),
          participants: [currentUser.id, friendId],
          participantNames: { [currentUser.id]: currentUser.username, [friendId]: friend.username },
          messages: [newMessage],
          lastMessage: chatMessage,
          lastMessageAt: new Date().toISOString()
        };
        allChats.push(chat);
      }
      await saveChats(allChats);
      setChatMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  const recommendMovieInChat = async (friendId, movie) => {
    const text = `🎬 Je te recommande : ${movie.title} (${movie.year}) - ${movie.rating}/10`;
    try {
      const result = await window.storage.get('chats');
      const allChats = result ? JSON.parse(result.value) : [];
      let chat = allChats.find(c => c.participants.includes(currentUser.id) && c.participants.includes(friendId));
      const newMessage = {
        id: Date.now().toString(),
        senderId: currentUser.id,
        senderUsername: currentUser.username,
        text: text,
        movie: movie,
        createdAt: new Date().toISOString()
      };
      if (chat) {
        chat.messages.push(newMessage);
        chat.lastMessage = text;
        chat.lastMessageAt = new Date().toISOString();
      } else {
        const friend = users.find(u => u.id === friendId);
        chat = {
          id: Date.now().toString(),
          participants: [currentUser.id, friendId],
          participantNames: { [currentUser.id]: currentUser.username, [friendId]: friend.username },
          messages: [newMessage],
          lastMessage: text,
          lastMessageAt: new Date().toISOString()
        };
        allChats.push(chat);
      }
      await saveChats(allChats);
      alert('Film recommandé ! 🎉');
    } catch (error) {
      console.error(error);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-black text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <Film className="inline-block w-16 h-16 mb-4 text-blue-400" />
            <h1 className="text-4xl font-bold mb-2">Vortics</h1>
            <p className="text-gray-300">Trouvez votre prochain film parfait avec l'IA</p>
          </div>
          <div className="max-w-md mx-auto">
            {page === 'login' ? (
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">Connexion</h2>
                <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none" />
                <input type="password" placeholder="Mot de passe" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full p-3 mb-6 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none" />
                <button onClick={handleLogin} className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-semibold transition">Se connecter</button>
                <p className="text-center mt-4 text-gray-400">Pas encore de compte ? <button onClick={() => setPage('signup')} className="text-purple-400 hover:underline">S'inscrire</button></p>
              </div>
            ) : (
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 shadow-2xl">
                <h2 className="text-2xl font-bold mb-6">Inscription</h2>
                <input type="text" placeholder="Pseudonyme" value={signupUsername} onChange={(e) => setSignupUsername(e.target.value)} className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none" />
                <input type="email" placeholder="Email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none" />
                <input type="password" placeholder="Mot de passe" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className="w-full p-3 mb-6 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none" />
                <button onClick={handleSignup} className="w-full bg-purple-600 hover:bg-purple-700 p-3 rounded-lg font-semibold transition">Créer mon compte</button>
                <p className="text-center mt-4 text-gray-400">Déjà un compte ? <button onClick={() => setPage('login')} className="text-purple-400 hover:underline">Se connecter</button></p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black text-white">
      <div className="bg-gray-900 bg-opacity-50 backdrop-blur-lg border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Film className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold">Vortics</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative text-gray-400 hover:text-white">
              <span className="text-2xl">🔔</span>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            <span className="text-sm text-gray-300">👤 {currentUser.username}</span>
            <button onClick={handleLogout} className="text-gray-400 hover:text-white"><LogOut className="w-5 h-5" /></button>
          </div>
        </div>
        
        {/* Panneau notifications */}
        {showNotifications && (
          <div className={`absolute right-4 top-16 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-2xl w-80 max-h-96 overflow-y-auto z-50 border animate-fadeIn`}>
            <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className="font-bold">Notifications</h3>
            </div>
            {notifications.length === 0 ? (
              <p className={`p-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Aucune notification</p>
            ) : (
              <div>
                {notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'} cursor-pointer transition-all ${!notif.read ? (theme === 'dark' ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50') : ''}`}
                    onClick={() => markNotificationRead(notif.id)}
                  >
                    <p className="text-sm">{notif.message}</p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-1`}>{new Date(notif.createdAt).toLocaleString('fr-FR')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-gray-800 bg-opacity-30 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            <button onClick={() => setPage('home')} className={`flex items-center gap-2 px-4 py-3 transition whitespace-nowrap ${page === 'home' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}`}><Home className="w-5 h-5" /><span>Accueil</span></button>
            <button onClick={() => setPage('feed')} className={`flex items-center gap-2 px-4 py-3 transition whitespace-nowrap ${page === 'feed' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}`}><Film className="w-5 h-5" /><span>Fil</span></button>
            <button onClick={() => setPage('ai')} className={`flex items-center gap-2 px-4 py-3 transition whitespace-nowrap ${page === 'ai' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}`}><Sparkles className="w-5 h-5" /><span>IA</span></button>
            <button onClick={() => setPage('search')} className={`flex items-center gap-2 px-4 py-3 transition whitespace-nowrap ${page === 'search' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}`}><Search className="w-5 h-5" /><span>Recherche</span></button>
            <button onClick={() => setPage('identify')} className={`flex items-center gap-2 px-4 py-3 transition whitespace-nowrap ${page === 'identify' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}`}>
              <span className="text-lg">🎯</span>
              <span>Identifier</span>
            </button>
            <button onClick={() => setPage('friends')} className={`flex items-center gap-2 px-4 py-3 transition relative whitespace-nowrap ${page === 'friends' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}`}>
              <Users className="w-5 h-5" /><span>Amis</span>
              {friendRequests.filter(r => r.status === 'pending').length > 0 && <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{friendRequests.filter(r => r.status === 'pending').length}</span>}
            </button>
            <button onClick={() => setPage('chat')} className={`flex items-center gap-2 px-4 py-3 transition whitespace-nowrap ${page === 'chat' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}`}><MessageCircle className="w-5 h-5" /><span>Chat</span></button>
            <button onClick={() => setPage('profile')} className={`flex items-center gap-2 px-4 py-3 transition whitespace-nowrap ${page === 'profile' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}`}><User className="w-5 h-5" /><span>Profil</span></button>
            <button onClick={() => setPage('calendar')} className={`flex items-center gap-2 px-4 py-3 transition whitespace-nowrap ${page === 'calendar' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}`}>
              <span className="text-lg">📅</span>
              <span>Sorties</span>
            </button>
            <button onClick={() => setPage('stats')} className={`flex items-center gap-2 px-4 py-3 transition whitespace-nowrap ${page === 'stats' ? 'bg-blue-600' : 'text-gray-400 hover:text-white'}`}>
              <span className="text-lg">📊</span>
              <span>Stats</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {page === 'home' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Bienvenue {currentUser.username} ! 🎬</h2>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">🚀 Fonctionnalités</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✅ Recommandations IA (Films & Séries)</li>
                <li>✅ Recommandations basées sur votre historique</li>
                <li>✅ Identifier un film/série (comme Shazam!)</li>
                <li>✅ Listes personnalisées</li>
                <li>✅ Système de notation personnel</li>
                <li>✅ Calendrier des sorties</li>
                <li>✅ Statistiques détaillées</li>
                <li>✅ Badges et récompenses</li>
                <li>✅ Notifications</li>
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Recommandation IA</h3>
                <p className="mb-4 text-gray-100">Critères personnalisés</p>
                <button onClick={() => setPage('ai')} className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Découvrir
                </button>
              </div>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-center">
                <span className="text-5xl mb-4 block">🎯</span>
                <h3 className="text-2xl font-bold mb-2">Recommandation intelligente</h3>
                <p className="mb-4 text-gray-100">Basée sur votre historique</p>
                <button onClick={getSmartRecommendation} disabled={isLoading} className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition disabled:opacity-50">
                  {isLoading ? '⏳' : 'Suggérer'}
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Découvrez votre prochain film !</h3>
              <button onClick={() => setPage('ai')} className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">Obtenir une recommandation</button>
            </div>
          </div>
        )}

        {page === 'ai' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">🤖 Recommandation IA</h2>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 mb-6">
              <p className="text-gray-300 mb-6">Renseignez vos critères pour une recommandation personnalisée</p>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm mb-2 font-medium">🎬 Type de média</label>
                  <select value={mediaType} onChange={(e) => setMediaType(e.target.value)} className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none">
                    <option value="">Choisir...</option>
                    <option value="film">🎬 Film</option>
                    <option value="serie">📺 Série</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 font-medium">😊 Humeur du moment</label>
                  <select value={mood} onChange={(e) => setMood(e.target.value)} className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none">
                    <option value="">Choisir...</option>
                    <option value="joyeux">😊 Joyeux / Bonne humeur</option>
                    <option value="triste">😢 Triste / Mélancolique</option>
                    <option value="excité">🤩 Excité / Énergique</option>
                    <option value="détendu">😌 Détendu / Calme</option>
                    <option value="pensif">🤔 Pensif / Réflexif</option>
                    <option value="romantique">❤️ Romantique</option>
                    <option value="aventureux">🗺️ Aventureux</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 font-medium">🎭 Genre préféré</label>
                  <input type="text" value={genre} onChange={(e) => setGenre(e.target.value)} placeholder="Action, Comédie, Drame, Thriller, Horreur, SF..." className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm mb-2 font-medium">⭐ Acteur / Actrice</label>
                  <input type="text" value={actor} onChange={(e) => setActor(e.target.value)} placeholder="Nom de l'acteur..." className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm mb-2 font-medium">⏱️ Durée disponible</label>
                  <select value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none">
                    <option value="">Peu importe</option>
                    <option value="court">Court (moins de 90 min)</option>
                    <option value="moyen">Moyen (90-120 min)</option>
                    <option value="long">Long (plus de 120 min)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 font-medium">📅 Période / Époque</label>
                  <select value={era} onChange={(e) => setEra(e.target.value)} className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none">
                    <option value="">Peu importe</option>
                    <option value="classique">Classique (avant 1980)</option>
                    <option value="80-90">Années 80-90</option>
                    <option value="2000">Années 2000</option>
                    <option value="2010">Années 2010</option>
                    <option value="recent">Récent (2020+)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 font-medium">👥 Avec qui regarder ?</label>
                  <select value={watchWith} onChange={(e) => setWatchWith(e.target.value)} className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none">
                    <option value="">Peu importe</option>
                    <option value="seul">Seul(e)</option>
                    <option value="couple">En couple</option>
                    <option value="amis">Entre amis</option>
                    <option value="famille">En famille</option>
                    <option value="enfants">Avec des enfants</option>
                  </select>
                </div>
              </div>
              <button onClick={getAIRecommendation} disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 p-4 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2">
                {isLoading ? '⏳ Analyse en cours...' : <><Sparkles className="w-5 h-5" />Trouver mon film parfait</>}
              </button>
            </div>
            {aiRecommendation && (
              <div className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-2xl p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{aiRecommendation.type === 'serie' ? '📺' : '🎬'}</span>
                      <h3 className="text-2xl font-bold">{aiRecommendation.title}</h3>
                    </div>
                    <p className="text-gray-300">{aiRecommendation.year} • {aiRecommendation.director}</p>
                    {aiRecommendation.seasons && <p className="text-sm text-gray-400">📺 {aiRecommendation.seasons} saison{aiRecommendation.seasons > 1 ? 's' : ''}</p>}
                  </div>
                  <div className="bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold">⭐ {aiRecommendation.rating}</div>
                </div>
                <p className="text-sm text-gray-400 mb-4">{aiRecommendation.actors}</p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">📖 Synopsis</h4>
                  <p>{aiRecommendation.synopsis}</p>
                </div>
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">💡 Pourquoi ?</h4>
                  <p>{aiRecommendation.why}</p>
                </div>
                <button onClick={() => likeMovie(aiRecommendation)} className="w-full bg-red-500 hover:bg-red-600 p-3 rounded-lg font-semibold flex items-center justify-center gap-2 mb-3">
                  <Heart className="w-5 h-5" />Ajouter aux favoris
                </button>
                <button onClick={() => markAsWatched(aiRecommendation)} className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold flex items-center justify-center gap-2 mb-3">
                  ✓ Marquer comme vu
                </button>
                <button onClick={() => setRatingMovie(aiRecommendation)} className="w-full bg-yellow-600 hover:bg-yellow-700 p-3 rounded-lg font-semibold flex items-center justify-center gap-2 mb-3">
                  ⭐ Noter ce {aiRecommendation.type === 'serie' ? 'série' : 'film'}
                </button>
                <button onClick={() => { setSharingMovie(aiRecommendation); setPage('share'); }} className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />Partager
                </button>
              </div>
            )}
          </div>
        )}

        {page === 'search' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">🔍 Rechercher un film ou une série</h2>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 mb-6">
              <p className="text-gray-300 mb-4">Entrez le titre exact du film ou de la série</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchMedia()}
                  placeholder="Ex: Inception, Breaking Bad..." 
                  className="flex-1 p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none" 
                />
                <button 
                  onClick={searchMedia} 
                  disabled={isSearching}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isSearching ? '⏳' : <Search className="w-5 h-5" />}
                  <span>Rechercher</span>
                </button>
              </div>
            </div>

            {mediaSearchResults.length > 0 && (
              <div className="space-y-4">
                {mediaSearchResults.map((result, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-2xl p-6">
                    <div className="flex justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{result.type === 'serie' ? '📺' : '🎬'}</span>
                          <h3 className="text-2xl font-bold">{result.title}</h3>
                        </div>
                        <p className="text-gray-300">{result.year} • {result.director}</p>
                        {result.seasons && <p className="text-sm text-gray-400">📺 {result.seasons} saison{result.seasons > 1 ? 's' : ''}</p>}
                      </div>
                      <div className="bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold">⭐ {result.rating}</div>
                    </div>
                    <p className="text-sm text-gray-400 mb-4">{result.actors}</p>
                    <div className="mb-6">
                      <h4 className="font-semibold mb-2">📖 Synopsis</h4>
                      <p>{result.synopsis}</p>
                    </div>
                    <button onClick={() => likeMovie(result)} className="w-full bg-red-500 hover:bg-red-600 p-3 rounded-lg font-semibold flex items-center justify-center gap-2 mb-3">
                      <Heart className="w-5 h-5" />Ajouter aux favoris
                    </button>
                    <button onClick={() => markAsWatched(result)} className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold flex items-center justify-center gap-2 mb-3">
                      ✓ Marquer comme vu
                    </button>
                    <button onClick={() => { setSharingMovie(result); setPage('share'); }} className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                      <Send className="w-5 h-5" />Partager
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {page === 'identify' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">🎯 Identifier un Film ou Série</h2>
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-xl transition-all`}>
              <div className={`${theme === 'dark' ? 'bg-blue-900 border-blue-500' : 'bg-blue-100 border-blue-300'} bg-opacity-40 border rounded-xl p-4 mb-6 transition-all`}>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Comment ça marche ?
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Renseignez un ou plusieurs critères ci-dessous. Plus vous donnez d'indices, plus l'identification sera précise !</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className={`block text-sm mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>🎬 Description de scène ou dialogue</label>
                  <textarea 
                    value={identifyDescription} 
                    onChange={(e) => setIdentifyDescription(e.target.value)}
                    placeholder="Ex: Une scène où quelqu'un dit 'Je suis ton père', un combat dans l'espace..."
                    className={`w-full p-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} rounded-lg border focus:border-blue-500 focus:outline-none h-24 resize-none transition-all`} 
                  />
                </div>

                <div>
                  <label className={`block text-sm mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>⭐ Acteur ou actrice</label>
                  <input 
                    type="text"
                    value={identifyActor} 
                    onChange={(e) => setIdentifyActor(e.target.value)}
                    placeholder="Ex: Tom Hanks, Margot Robbie..."
                    className={`w-full p-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} rounded-lg border focus:border-blue-500 focus:outline-none transition-all`} 
                  />
                </div>

                <div>
                  <label className={`block text-sm mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>📅 Année approximative</label>
                  <select 
                    value={identifyYear} 
                    onChange={(e) => setIdentifyYear(e.target.value)}
                    className={`w-full p-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} rounded-lg border focus:border-blue-500 focus:outline-none transition-all`}
                  >
                    <option value="">Peu importe</option>
                    <option value="avant 1980">Avant 1980</option>
                    <option value="années 80">Années 80</option>
                    <option value="années 90">Années 90</option>
                    <option value="années 2000">Années 2000 (2000-2009)</option>
                    <option value="années 2010">Années 2010 (2010-2019)</option>
                    <option value="2020 et après">2020 et après</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>🎭 Genre</label>
                  <input 
                    type="text"
                    value={identifyGenre} 
                    onChange={(e) => setIdentifyGenre(e.target.value)}
                    placeholder="Ex: Action, Comédie, Horreur, Science-fiction..."
                    className={`w-full p-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} rounded-lg border focus:border-blue-500 focus:outline-none transition-all`} 
                  />
                </div>

                <div>
                  <label className={`block text-sm mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>📍 Lieu ou décor</label>
                  <input 
                    type="text"
                    value={identifyLocation} 
                    onChange={(e) => setIdentifyLocation(e.target.value)}
                    placeholder="Ex: New York, espace, île déserte, lycée..."
                    className={`w-full p-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} rounded-lg border focus:border-blue-500 focus:outline-none transition-all`} 
                  />
                </div>

                <div>
                  <label className={`block text-sm mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>📖 Résumé/Intrigue</label>
                  <textarea 
                    value={identifySummary} 
                    onChange={(e) => setIdentifySummary(e.target.value)}
                    placeholder="Ex: Une histoire d'amour tragique sur un bateau qui coule, un groupe d'amis dans un café à New York..."
                    className={`w-full p-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} rounded-lg border focus:border-blue-500 focus:outline-none h-24 resize-none transition-all`} 
                  />
                </div>

                <div>
                  <label className={`block text-sm mb-2 font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>👥 Noms des personnages</label>
                  <input 
                    type="text"
                    value={identifyCharacters} 
                    onChange={(e) => setIdentifyCharacters(e.target.value)}
                    placeholder="Ex: Harry Potter, Walter White, Jack Sparrow, Rachel et Ross..."
                    className={`w-full p-3 ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} rounded-lg border focus:border-blue-500 focus:outline-none transition-all`} 
                  />
                </div>
              </div>
              
              <button 
                onClick={identifyMedia} 
                disabled={isIdentifying}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 p-4 rounded-lg font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isIdentifying ? '⏳ Identification en cours...' : <>🎯 Identifier</>}
              </button>
            </div>

            {identifyResult && (
              <div className="bg-gradient-to-br from-blue-800 to-cyan-800 rounded-2xl p-6">
                <div className="bg-white bg-opacity-10 rounded-lg p-3 mb-4">
                  <p className="text-sm flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      identifyResult.confidence === 'élevé' ? 'bg-green-500' :
                      identifyResult.confidence === 'moyen' ? 'bg-yellow-500' : 'bg-orange-500'
                    }`}>
                      Confiance : {identifyResult.confidence}
                    </span>
                    <span className="text-gray-300">{identifyResult.why}</span>
                  </p>
                </div>
                
                <div className="flex justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{identifyResult.type === 'serie' ? '📺' : '🎬'}</span>
                      <h3 className="text-2xl font-bold">{identifyResult.title}</h3>
                    </div>
                    <p className="text-gray-300">{identifyResult.year} • {identifyResult.director}</p>
                    {identifyResult.seasons && <p className="text-sm text-gray-400">📺 {identifyResult.seasons} saison{identifyResult.seasons > 1 ? 's' : ''}</p>}
                  </div>
                  <div className="bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold h-fit">⭐ {identifyResult.rating}</div>
                </div>
                
                <p className="text-sm text-gray-400 mb-4">{identifyResult.actors}</p>
                
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">📖 Synopsis</h4>
                  <p>{identifyResult.synopsis}</p>
                </div>
                
                <div className="space-y-3">
                  <button onClick={() => likeMovie(identifyResult)} className="w-full bg-red-500 hover:bg-red-600 p-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />Ajouter aux favoris
                  </button>
                  <button onClick={() => markAsWatched(identifyResult)} className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                    ✓ Marquer comme vu
                  </button>
                  <button onClick={() => { setSharingMovie(identifyResult); setPage('share'); }} className="w-full bg-blue-500 hover:bg-blue-600 p-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />Partager
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {page === 'calendar' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">📅 Prochaines Sorties</h2>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 mb-6">
              <p className="text-gray-300 mb-4">Découvrez les films et séries qui sortent prochainement</p>
              <button 
                onClick={getUpcomingReleases} 
                disabled={isLoadingReleases}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 p-4 rounded-lg font-semibold transition disabled:opacity-50"
              >
                {isLoadingReleases ? '⏳ Chargement...' : '🎬 Voir les prochaines sorties'}
              </button>
            </div>

            {upcomingReleases.length > 0 && (
              <div className="space-y-4">
                {upcomingReleases.map((release, index) => (
                  <div key={index} className="bg-gradient-to-br from-purple-800 to-pink-800 rounded-2xl p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{release.type === 'serie' ? '📺' : '🎬'}</span>
                          <h3 className="text-2xl font-bold">{release.title}</h3>
                        </div>
                        <p className="text-sm text-gray-300">📅 Sortie : {release.releaseDate}</p>
                        <p className="text-sm text-gray-300">🎭 {release.genre}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mb-3">Réalisé par {release.director}</p>
                    <p className="text-gray-200">{release.synopsis}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {page === 'stats' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">📊 Mes Statistiques</h2>
            
            {/* Stats globales */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">📈 Vue d'ensemble</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold mb-2">{getStats().totalHours}h</div>
                  <div className="text-sm text-gray-200">Temps de visionnage</div>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold mb-2">{getStats().favoriteGenre}</div>
                  <div className="text-sm text-gray-200">Genre préféré</div>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold mb-2">{getStats().avgRating || 'N/A'}</div>
                  <div className="text-sm text-gray-200">Note moyenne donnée</div>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">🏆 Badges débloqués</h3>
              {(currentUser.badges?.length || 0) === 0 ? (
                <p className="text-gray-400">Aucun badge débloqué pour le moment</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {currentUser.badges.map(badge => (
                    <div key={badge.id} className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl p-4 text-center">
                      <div className="text-4xl mb-2">{badge.icon}</div>
                      <div className="font-bold">{badge.name}</div>
                      <div className="text-xs text-gray-200">{badge.description}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Progression vers les prochains badges */}
              <div className="mt-6">
                <h4 className="font-semibold mb-3">🎯 Prochains objectifs</h4>
                <div className="space-y-3">
                  {(currentUser.watchedMovies?.length || 0) < 50 && (
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">🏃 Marathonien</span>
                        <span className="text-sm">{currentUser.watchedMovies?.length || 0}/50</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: `${((currentUser.watchedMovies?.length || 0) / 50) * 100}%`}}></div>
                      </div>
                    </div>
                  )}
                  {(currentUser.ratings?.length || 0) < 20 && (
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">⭐ Critique</span>
                        <span className="text-sm">{currentUser.ratings?.length || 0}/20</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${((currentUser.ratings?.length || 0) / 20) * 100}%`}}></div>
                      </div>
                    </div>
                  )}
                  {currentUser.friends.length < 10 && (
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">👥 Social</span>
                        <span className="text-sm">{currentUser.friends.length}/10</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: `${(currentUser.friends.length / 10) * 100}%`}}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Répartition */}
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">📺 Répartition Films / Séries</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-900 bg-opacity-40 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-2">🎬</div>
                  <div className="text-3xl font-bold mb-1">{currentUser.watchedMovies?.filter(m => m.type === 'film').length || 0}</div>
                  <div className="text-sm text-gray-300">Films vus</div>
                </div>
                <div className="bg-purple-900 bg-opacity-40 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-2">📺</div>
                  <div className="text-3xl font-bold mb-1">{currentUser.watchedMovies?.filter(m => m.type === 'serie').length || 0}</div>
                  <div className="text-sm text-gray-300">Séries vues</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {page === 'share' && sharingMovie && (
          <div>
            <button onClick={() => setPage(mediaSearchResults.length > 0 ? 'search' : 'ai')} className="mb-4 text-purple-400">← Retour</button>
            <h2 className="text-3xl font-bold mb-6">📤 Partager {sharingMovie.type === 'serie' ? 'une série' : 'un film'}</h2>
            <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6">
              <div className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{sharingMovie.type === 'serie' ? '📺' : '🎬'}</span>
                  <h4 className="text-xl font-bold">{sharingMovie.title}</h4>
                </div>
                <p className="text-sm">{sharingMovie.year} • ⭐ {sharingMovie.rating}</p>
                {sharingMovie.seasons && <p className="text-xs text-gray-300">📺 {sharingMovie.seasons} saison{sharingMovie.seasons > 1 ? 's' : ''}</p>}
              </div>
              <textarea value={shareMessage} onChange={(e) => setShareMessage(e.target.value)} placeholder="Votre avis..." className="w-full p-4 bg-gray-700 rounded-lg border border-gray-600 mb-4 h-32 resize-none" />
              <div className="flex gap-3">
                <button onClick={() => shareMovie(sharingMovie)} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-lg font-semibold">Partager</button>
                <button onClick={() => { setSharingMovie(null); setShareMessage(''); setPage(mediaSearchResults.length > 0 ? 'search' : 'ai'); }} className="bg-gray-600 px-6 py-3 rounded-lg">Annuler</button>
              </div>
            </div>
          </div>
        )}

        {page === 'feed' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold">📱 Fil d'actualité</h2>
              <div className="flex gap-2 items-center">
                <select value={feedFilter} onChange={(e) => setFeedFilter(e.target.value)} className={`p-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} rounded-lg border text-sm transition-all`}>
                  <option value="all">Tous</option>
                  <option value="films">Films uniquement</option>
                  <option value="series">Séries uniquement</option>
                </select>
                <button onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} className={`p-2 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'} rounded-lg border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'} transition-all`}>
                  {viewMode === 'list' ? '▦' : '☰'}
                </button>
              </div>
            </div>
            {posts.length === 0 ? (
              <div className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 text-center">
                <Film className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <p className="text-gray-400">Aucun partage pour le moment</p>
              </div>
            ) : (
              <div className="space-y-6">
                {posts.filter(post => {
                  if (feedFilter === 'films') return post.movie.type === 'film';
                  if (feedFilter === 'series') return post.movie.type === 'serie';
                  return true;
                }).map(post => {
                  const hasLiked = post.likes.includes(currentUser.id);
                  const visibleComments = post.comments.filter(c => c.privacy === 'public' || c.userId === currentUser.id || post.userId === currentUser.id);
                  return (
                    <div key={post.id} className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xl">{post.username.charAt(0).toUpperCase()}</div>
                        <div>
                          <p className="font-semibold">{post.username}</p>
                          <p className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleString('fr-FR')}</p>
                        </div>
                      </div>
                      <p className="mb-4">{post.message}</p>
                      <div className="bg-gradient-to-br from-purple-800 to-blue-800 rounded-xl p-4 mb-4">
                        <div className="flex justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span>{post.movie.type === 'serie' ? '📺' : '🎬'}</span>
                              <h4 className="text-xl font-bold">{post.movie.title}</h4>
                            </div>
                            <p className="text-sm">{post.movie.year} • {post.movie.director}</p>
                            {post.movie.seasons && <p className="text-xs text-gray-300">📺 {post.movie.seasons} saison{post.movie.seasons > 1 ? 's' : ''}</p>}
                          </div>
                          <div className="bg-yellow-500 text-black px-2 py-1 rounded font-bold">⭐ {post.movie.rating}</div>
                        </div>
                        <p className="text-sm">{post.movie.actors}</p>
                      </div>
                      <div className="flex gap-4 mb-4 pb-4 border-b border-gray-700">
                        <button onClick={() => likePost(post.id)} className={`flex items-center gap-2 ${hasLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-400 transition-all hover:scale-110`}><Heart className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} /><span>{post.likes.length}</span></button>
                        <div className="flex items-center gap-2 text-gray-400"><MessageCircle className="w-5 h-5" /><span>{visibleComments.length}</span></div>
                        <button onClick={() => markAsWatched(post.movie)} className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-all text-sm hover:scale-110">
                          ✓ Marquer vu
                        </button>
                        
                        {/* Réactions émojis */}
                        <div className="flex gap-1 ml-auto">
                          {['😍', '🔥', '😱', '👏'].map(emoji => (
                            <button 
                              key={emoji}
                              onClick={() => reactToPost(post.id, emoji)}
                              className={`text-lg transition-all hover:scale-125 ${hasReacted(post, emoji) ? 'scale-110' : ''}`}
                            >
                              {emoji}
                              {getReactionCount(post, emoji) > 0 && (
                                <span className="text-xs ml-1">{getReactionCount(post, emoji)}</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                      {visibleComments.length > 0 && (
                        <div className="space-y-3 mb-4">
                          {visibleComments.map(c => (
                            <div key={c.id} className="bg-gray-700 bg-opacity-50 p-3 rounded-lg">
                              <div className="flex justify-between mb-1">
                                <p className="font-semibold text-sm">{c.username}</p>
                                <span className="text-xs text-gray-400">{c.privacy === 'private' ? '🔒 Privé' : '🌍 Public'}</span>
                              </div>
                              <p className="text-sm">{c.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input type="text" value={commentTexts[post.id] || ''} onChange={(e) => setCommentTexts({ ...commentTexts, [post.id]: e.target.value })} placeholder="Commenter..." className="flex-1 p-2 bg-gray-700 rounded-lg border border-gray-600 text-sm" />
                        <select value={commentPrivacy} onChange={(e) => setCommentPrivacy(e.target.value)} className="p-2 bg-gray-700 rounded-lg text-sm">
                          <option value="public">🌍</option>
                          <option value="private">🔒</option>
                        </select>
                        <button onClick={() => commentPost(post.id)} className="bg-purple-600 px-4 py-2 rounded-lg"><Send className="w-4 h-4" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {page === 'friends' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">👥 Amis</h2>
            {friendRequests.filter(r => r.status === 'pending').length > 0 && (
              <div className="bg-yellow-900 bg-opacity-30 border border-yellow-500 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">✉️ Demandes ({friendRequests.filter(r => r.status === 'pending').length})</h3>
                <div className="space-y-3">
                  {friendRequests.filter(r => r.status === 'pending').map(req => (
                    <div key={req.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                      <p className="font-semibold">{req.fromUsername}</p>
                      <div className="flex gap-2">
                        <button onClick={() => acceptFriendRequest(req)} className="bg-green-600 px-4 py-2 rounded-lg">✓</button>
                        <button onClick={() => rejectFriendRequest(req)} className="bg-red-600 px-4 py-2 rounded-lg">✗</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">🔍 Trouver des amis</h3>
              <div className="flex gap-2 mb-4">
                <input type="text" value={userSearchQuery} onChange={(e) => setUserSearchQuery(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && searchUsers()} placeholder="Rechercher..." className="flex-1 p-3 bg-gray-700 rounded-lg border border-gray-600" />
                <button onClick={searchUsers} className="bg-purple-600 px-6 py-3 rounded-lg"><Search className="w-5 h-5" /></button>
              </div>
              {userSearchResults.length > 0 && (
                <div className="space-y-3">
                  {userSearchResults.map(u => (
                    <div key={u.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xl">{u.username.charAt(0).toUpperCase()}</div>
                        <p className="font-semibold">{u.username}</p>
                      </div>
                      {!isFriend(u.id) ? (
                        <button onClick={() => sendFriendRequest(u)} className="bg-blue-600 px-4 py-2 rounded-lg">➕ Ajouter</button>
                      ) : (
                        <span className="bg-green-600 px-4 py-2 rounded-lg">✓ Ami</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4">👥 Mes amis ({currentUser.friends.length})</h3>
              {currentUser.friends.length === 0 ? (
                <p className="text-gray-400 text-center py-4">Aucun ami</p>
              ) : (
                <div className="space-y-3">
                  {currentUser.friends.map(f => (
                    <div key={f.id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xl">{f.username.charAt(0).toUpperCase()}</div>
                        <p className="font-semibold">{f.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {page === 'chat' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">💬 Messagerie</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-gray-800 bg-opacity-50 rounded-2xl p-4">
                <h3 className="text-lg font-semibold mb-4">Conversations</h3>
                {currentUser.friends.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">Aucun ami</p>
                ) : (
                  <div className="space-y-2">
                    {currentUser.friends.map(f => (
                      <button key={f.id} onClick={() => setSelectedChat(f)} className={`w-full p-3 rounded-lg text-left ${selectedChat?.id === f.id ? 'bg-purple-600' : 'bg-gray-700 hover:bg-gray-600'}`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">{f.username.charAt(0).toUpperCase()}</div>
                          <p className="font-semibold">{f.username}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="md:col-span-2 bg-gray-800 bg-opacity-50 rounded-2xl p-6">
                {!selectedChat ? (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                      <p>Sélectionnez une conversation</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-700 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xl">{selectedChat.username.charAt(0).toUpperCase()}</div>
                      <p className="font-semibold">{selectedChat.username}</p>
                    </div>
                    <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                      {(() => {
                        const chat = chats.find(c => c.participants.includes(selectedChat.id));
                        if (!chat || chat.messages.length === 0) {
                          return <p className="text-gray-400 text-center py-8">Aucun message</p>;
                        }
                        return chat.messages.map(msg => {
                          const isMe = msg.senderId === currentUser.id;
                          return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs p-3 rounded-lg ${isMe ? 'bg-purple-600' : 'bg-gray-700'}`}>
                                {msg.movie && (
                                  <div className="bg-black bg-opacity-30 rounded p-2 mb-2 text-sm">
                                    <p className="font-bold">{msg.movie.title}</p>
                                    <p className="text-xs">{msg.movie.year} • ⭐ {msg.movie.rating}</p>
                                  </div>
                                )}
                                <p className="text-sm">{msg.text}</p>
                                <p className="text-xs text-gray-400 mt-1">{new Date(msg.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                    {currentUser.likedMovies.length > 0 && (
                      <div className="mb-3">
                        <details className="bg-gray-700 bg-opacity-50 rounded-lg">
                          <summary className="p-2 cursor-pointer text-sm text-purple-400">🎬 Recommander un film</summary>
                          <div className="p-2 space-y-2 max-h-40 overflow-y-auto">
                            {currentUser.likedMovies.map((m, i) => (
                              <button key={i} onClick={() => recommendMovieInChat(selectedChat.id, m)} className="w-full text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm">{m.title} ({m.year})</button>
                            ))}
                          </div>
                        </details>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendChatMessage(selectedChat.id)} placeholder="Message..." className="flex-1 p-3 bg-gray-700 rounded-lg border border-gray-600" />
                      <button onClick={() => sendChatMessage(selectedChat.id)} className="bg-purple-600 px-6 py-3 rounded-lg"><Send className="w-5 h-5" /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {page === 'profile' && (
          <div>
            <h2 className="text-3xl font-bold mb-6">Mon Profil</h2>
            <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl">{currentUser.username.charAt(0).toUpperCase()}</div>
                <div>
                  <h3 className="text-2xl font-bold">{currentUser.username}</h3>
                  <p className="text-gray-400">{currentUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-400">{currentUser.likedMovies.length}</div>
                  <div className="text-sm text-gray-400">Favoris</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-400">{currentUser.watchedMovies?.length || 0}</div>
                  <div className="text-sm text-gray-400">Vus</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-yellow-400">{currentUser.ratings?.length || 0}</div>
                  <div className="text-sm text-gray-400">Notés</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-400">{currentUser.lists?.length || 0}</div>
                  <div className="text-sm text-gray-400">Listes</div>
                </div>
              </div>

              {/* Mes listes */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xl font-semibold">📝 Mes listes</h4>
                  <button onClick={() => setShowCreateList(true)} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm">
                    + Nouvelle liste
                  </button>
                </div>

                {showCreateList && (
                  <div className="bg-gray-700 p-4 rounded-lg mb-4">
                    <input 
                      type="text" 
                      value={newListName} 
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="Nom de la liste (ex: À regarder, Films d'horreur...)"
                      className="w-full p-2 bg-gray-600 rounded border border-gray-500 mb-2"
                    />
                    <div className="flex gap-2">
                      <button onClick={createList} className="bg-green-600 px-4 py-2 rounded">Créer</button>
                      <button onClick={() => { setShowCreateList(false); setNewListName(''); }} className="bg-gray-600 px-4 py-2 rounded">Annuler</button>
                    </div>
                  </div>
                )}

                {(currentUser.lists?.length || 0) === 0 ? (
                  <p className="text-gray-400">Aucune liste créée</p>
                ) : (
                  <div className="space-y-3">
                    {currentUser.lists.map(list => (
                      <div key={list.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-bold text-lg">{list.name}</h5>
                          <button onClick={() => deleteList(list.id)} className="text-red-400 hover:text-red-300">🗑️</button>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{list.movies.length} film(s)/série(s)</p>
                        {list.movies.length > 0 && (
                          <div className="space-y-2">
                            {list.movies.map((m, i) => (
                              <div key={i} className="bg-gray-600 p-2 rounded flex items-center gap-2">
                                <span>{m.type === 'serie' ? '📺' : '🎬'}</span>
                                <span className="text-sm">{m.title} ({m.year})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <h4 className="text-xl font-semibold mb-4">❤️ Mes films favoris</h4>
              {currentUser.likedMovies.length === 0 ? (
                <p className="text-gray-400">Aucun film ou série</p>
              ) : (
                <div className="space-y-3">
                  {currentUser.likedMovies.map((m, i) => {
                    const rating = getUserRating(m);
                    return (
                      <div key={i} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span>{m.type === 'serie' ? '📺' : '🎬'}</span>
                              <h5 className="font-bold">{m.title}</h5>
                            </div>
                            <p className="text-sm text-gray-400">{m.year} • {m.director}</p>
                            {m.seasons && <p className="text-xs text-gray-400">📺 {m.seasons} saison{m.seasons > 1 ? 's' : ''}</p>}
                            {rating && <p className="text-sm text-yellow-400 mt-1">Votre note : {rating}/10 ⭐</p>}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="bg-yellow-500 text-black px-2 py-1 rounded text-sm font-bold text-center">⭐ {m.rating}</div>
                            {!rating && (
                              <button onClick={() => setRatingMovie(m)} className="bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs">Noter</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal de notation */}
        {ratingMovie && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
            <div className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 max-w-md w-full shadow-2xl transform animate-scaleIn`}>
              <h3 className="text-2xl font-bold mb-4">Noter {ratingMovie.title}</h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-6`}>Donnez votre note personnelle</p>
              <div className="flex gap-2 justify-center mb-6">
                {[1,2,3,4,5,6,7,8,9,10].map(star => (
                  <button 
                    key={star}
                    onClick={() => setUserRating(star)}
                    className={`w-12 h-12 rounded-lg font-bold transition-all transform hover:scale-110 ${
                      userRating >= star ? 'bg-yellow-500 text-black shadow-lg' : (theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-500')
                    }`}
                  >
                    {star}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => rateMovie(ratingMovie, userRating)} 
                  disabled={userRating === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold disabled:opacity-50 transition-all transform hover:scale-105"
                >
                  Valider
                </button>
                <button onClick={() => { setRatingMovie(null); setUserRating(0); }} className={`${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'} px-6 py-3 rounded-lg transition-all transform hover:scale-105`}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out;
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(99, 102, 241, 0.3);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(99, 102, 241, 0.5);
          }
          .glass-morphism {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
        `}</style>
      </div>
    </div>
  );
};

export default CineMatchApp;