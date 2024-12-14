export interface Movie {
  id: string;
  title: string;
  genres: string[];
}

export interface WatchedMovie extends Movie {
  watched_at: number;
}

export interface User {
  username: string;
}

export interface AuthResponse {
  token: string;
}

export interface ApiError {
  error?: string;
  message?: string;
}