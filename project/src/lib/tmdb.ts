import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '../config/constants';
import type { TMDBMovie } from '../types/movie';

export async function searchTMDBMovies(query: string): Promise<TMDBMovie[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
    );
    
    if (!response.ok) {
      console.error('TMDB API Error:', await response.text());
      return [];
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('TMDB API Error:', error);
    return [];
  }
}

export function getTMDBPosterUrl(posterPath: string | null): string {
  if (!posterPath) {
    return 'https://via.placeholder.com/500x750?text=No+Poster';
  }
  return `${TMDB_IMAGE_BASE_URL}${posterPath}`;
}