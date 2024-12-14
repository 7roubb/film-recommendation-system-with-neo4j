export interface Movie {
  id: string;
  title: string;
  genres: string[];
  poster_path?: string;
}

export interface TMDBMovie {
  id: number;
  title: string;
  genres: string[];
  poster_path: string | null;
}