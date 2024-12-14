
import React, { useState, useCallback, useEffect } from 'react';
import { MovieCard } from '../components/MovieCard';
import { api } from '../lib/api'; // Make sure this points to the correct api module
import { getTMDBPosterUrl } from '../lib/tmdb';

export function Search({ query }: { query: string }) {
  const [movies, setMovies] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const searchMovies = useCallback(async () => {
    if (!query.trim()) {
      setMovies([]);
      setHasMore(false);
      return;
    }

    setLoading(true);
    try {
      // Make sure you are calling the searchMovies API correctly
      const localMovies = await api.searchMovies(query, page);

      // Ensure that both local movies are valid
      const validateMovie = (movie: any) => movie && movie.id && movie.title;
      const validMovies = localMovies.filter(validateMovie);

      setMovies(prev => page === 1 ? validMovies : [...prev, ...validMovies]);
      setHasMore(validMovies.length > 0);
    } catch (error) {
      console.error('Failed to search movies:', error);
    } finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    searchMovies();
  }, [searchMovies]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Search Results for "{query}"</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie, index) => (
          <MovieCard
            key={`${movie.id}-${index}`}
            movie={{ ...movie, poster_path: getTMDBPosterUrl(movie.poster_path) }}
          />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button onClick={() => setPage((p) => p + 1)} className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700">
            Load more
          </button>
        </div>
      )}
      {!loading && movies.length === 0 && (
        <div className="text-center text-gray-500 mt-12">
          <p className="text-xl">No movies found</p>
          <p className="mt-2">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}