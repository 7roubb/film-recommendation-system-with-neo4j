import type { Movie, TMDBMovie } from '../types/movie';

export function convertTMDBMovieToMovie(tmdbMovie: TMDBMovie): Movie {
  return {
    id: `tmdb-${tmdbMovie.id}`,
    title: tmdbMovie.title,
    genres: [], // We could map genre_ids to names if needed
    posterPath: tmdbMovie.poster_path,
    overview: tmdbMovie.overview,
    releaseDate: tmdbMovie.release_date,
  };
}

export function enrichMovieWithTMDBData(
  existingMovie: Movie,
  tmdbMovie: TMDBMovie
): Movie {
  return {
    ...existingMovie,
    posterPath: tmdbMovie.poster_path,
    overview: tmdbMovie.overview,
    releaseDate: tmdbMovie.release_date,
  };
}