import React from 'react';
import { MovieCard } from '../components/MovieCard';
import { Movie } from '../types';
import { api } from '../lib/api';

export function Home() {
  const [movies, setMovies] = React.useState<Movie[]>([]);
  const [recommendations, setRecommendations] = React.useState<Movie[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const loadMovies = async () => {
    try {
      const data = await api.getMovies('', page);
      setMovies(prev => [...prev, ...data]);
      setHasMore(data.length === 10);
    } catch (error) {
      console.error('Failed to load movies:', error);
    }
  };

  const loadRecommendations = async () => {
    try {
      const data = await api.getRecommendedContent();
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  React.useEffect(() => {
    loadMovies();
    loadRecommendations();
  }, [page]);

  return (
    <div className="p-6">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onWatch={loadRecommendations}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">All Movies</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              
              onWatch={loadMovies}
            />
          ))}
        </div>
        
        {hasMore && (
          <button
            onClick={() => setPage(p => p + 1)}
            className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
          >
            Load more
          </button>
        )}
      </section>
    </div>
  );
}