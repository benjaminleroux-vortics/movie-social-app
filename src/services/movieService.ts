// Service de recherche de films avec Google Gemini

const GEMINI_API_KEY = 'AIzaSyBv7hTfHe62r9xmBylytifEYkhipon8vFY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';



export interface MovieResult {
  id: string;
  title: string;
  year: string;
  director: string;
  actors: string;
  synopsis: string;
  rating: string;
  type: 'film' | 'serie';
  seasons?: string;
  genre?: string;
  releaseDate?: string;
}

export const searchMovie = async (searchTerm: string): Promise<MovieResult | null> => {
  try {
    const prompt = `Recherche le film ou la série "${searchTerm}". Réponds UNIQUEMENT en JSON valide (sans markdown, sans backticks, sans commentaires):
{
  "title": "Titre exact du film ou série",
  "year": "Année de sortie",
  "director": "Réalisateur principal ou Créateur de la série",
  "actors": "3-4 acteurs principaux séparés par des virgules",
  "synopsis": "Synopsis en 2-3 phrases maximum",
  "rating": "Note estimée sur 10",
  "type": "film ou serie",
  "seasons": "Nombre de saisons (seulement si série, sinon mettre null)",
  "genre": "Genre principal",
  "releaseDate": "Date de sortie (format: YYYY-MM-DD)"
}

Exemple pour un film:
{"title":"Inception","year":"2010","director":"Christopher Nolan","actors":"Leonardo DiCaprio, Marion Cotillard, Tom Hardy","synopsis":"Un voleur qui s'introduit dans les rêves des gens pour voler leurs secrets.","rating":"8.8","type":"film","seasons":null,"genre":"Science-Fiction","releaseDate":"2010-07-16"}

IMPORTANT: Réponds UNIQUEMENT avec le JSON, rien d'autre.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Erreur API Gemini');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Nettoyer la réponse (enlever markdown, backticks, etc.)
    const cleanedText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    const result = JSON.parse(cleanedText);
    
    // Ajouter un ID unique basé sur le titre et l'année
    result.id = `${result.title.toLowerCase().replace(/\s/g, '-')}-${result.year}`;
    
    return result as MovieResult;
  } catch (error) {
    console.error('Erreur recherche film:', error);
    return null;
  }
};

// Fonction pour rechercher plusieurs résultats (si besoin plus tard)
export const searchMovies = async (searchTerm: string, limit: number = 5): Promise<MovieResult[]> => {
  try {
    const prompt = `Trouve ${limit} films ou séries qui correspondent à "${searchTerm}". Réponds UNIQUEMENT avec un tableau JSON valide (sans markdown, sans backticks):
[
  {
    "title": "Titre",
    "year": "Année",
    "director": "Réalisateur",
    "actors": "Acteurs",
    "synopsis": "Synopsis court",
    "rating": "Note/10",
    "type": "film ou serie",
    "seasons": "Nombre ou null",
    "genre": "Genre",
    "releaseDate": "YYYY-MM-DD"
  }
]`;

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Erreur API Gemini');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    const cleanedText = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    
    const results = JSON.parse(cleanedText);
    
    // Ajouter des IDs uniques
    return results.map((movie: any) => ({
      ...movie,
      id: `${movie.title.toLowerCase().replace(/\s/g, '-')}-${movie.year}`
    }));
  } catch (error) {
    console.error('Erreur recherche films:', error);
    return [];
  }
};
