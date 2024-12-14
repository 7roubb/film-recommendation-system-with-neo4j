import React from 'react';
import { Clock } from 'lucide-react';
import { WatchedMovie } from '../types';
import { api } from '../lib/api';

export function Sidebar() {
  const [history, setHistory] = React.useState<WatchedMovie[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  const loadHistory = async () => {
    try {
      const data = await api.getHistory(page);
      setHistory(prev => [...prev, ...data]);
      setHasMore(data.length === 10);
    } catch (error) {
      console.error('Failed to load history:', error);
    }
  };

  React.useEffect(() => {
    loadHistory();
  }, [page]);

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock size={20} />
        Watch History
      </h2>
      
      <div className="space-y-4">
        {history.map((movie, index) => (
          <div key={`${movie.id}-${index}`} className="border-b pb-2">
            <h3 className="font-medium">{movie.title}</h3>
            <p className="text-sm text-gray-500">
              {new Date(movie.watched_at).toLocaleDateString()}
            </p>
          </div>
        ))}
        
        {hasMore && (
          <button
            onClick={() => setPage(p => p + 1)}
            className="text-indigo-600 hover:text-indigo-500 text-sm w-full text-center"
          >
            Load more
          </button>
        )}
      </div>
    </aside>
  );
}