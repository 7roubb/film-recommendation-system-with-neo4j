import React from 'react';
import { Star, Clock, Info } from 'lucide-react';
import { Movie } from '../types/movie';
import { api } from '../lib/api';
import { getTMDBPosterUrl } from '../lib/tmdb';

interface MovieCardProps {
  movie: Movie;
  onWatch?: () => void;
}

export function MovieCard({ movie, onWatch }: MovieCardProps) {
  const [rating, setRating] = React.useState(0);
  const [showDetails, setShowDetails] = React.useState(false);

  const handleRate = async (newRating: number) => {
    try {
      await api.rateMovie(movie.id, newRating);
      setRating(newRating);
    } catch (error) {
      console.error('Failed to rate movie:', error);
    }
  };

  const handleWatch = async () => {
    try {
      await api.watchMovie(movie.id);
      onWatch?.();
    } catch (error) {
      console.error('Failed to mark movie as watched:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-[2/3] bg-gray-200">
        <img
          src={getTMDBPosterUrl(movie.poster_path || null)}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
      
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {movie.genres && movie.genres.length > 0 ? (
            movie.genres.map((genre) => (
              <span
                key={genre}
                className="px-2 py-1 bg-gray-100 text-sm rounded-full"
              >
                {genre}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No genres available</span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                className={`${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                <Star size={20} />
              </button>
            ))}
          </div>
          <button
            onClick={handleWatch}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-500"
          >
            <Clock size={20} />
            Watch
          </button>
        </div>
      </div>
    </div>
  );
}
