const API_URL = 'http://localhost:5000';

// Utility function for making fetch requests with authentication
export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }
    return await response.json();
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}

// API methods for handling user actions, movies, and recommendations
export const api = {
  signup: (username: string, password: string) =>
    fetchWithAuth('/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  login: (username: string, password: string) =>
    fetchWithAuth('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),

  getMovies: (search = '', page = 1) =>
    fetchWithAuth(`/movies?search=${search}&limit=10&skip=${(page - 1) * 10}`),

  addMovie: (movie: { id: string; title: string; genres: string[] }) =>
    fetchWithAuth('/add_movie', {
      method: 'POST',
      body: JSON.stringify(movie),
    }),

  rateMovie: (movieId: string, rating: number) =>
    fetchWithAuth('/rate_movie', {
      method: 'POST',
      body: JSON.stringify({ movie_id: movieId, rating }),
    }),

  watchMovie: (movieId: string) =>
    fetchWithAuth('/watch_movie', {
      method: 'POST',
      body: JSON.stringify({ movie_id: movieId }),
    }),

  getHistory: (page = 1) =>
    fetchWithAuth(`/history?limit=10&skip=${(page - 1) * 10}`),

  getRecommendedContent: () =>
    fetchWithAuth('/recommend_content'),

  getRecommendedUsers: () =>
    fetchWithAuth('/recommend_user'),

  searchMovies: (query: string, page = 1) =>
    fetchWithAuth(`/search/movies?search=${query}&limit=10&skip=${(page - 1) * 10}`),

  getProfile: () =>
    fetchWithAuth('/profile'),
};
