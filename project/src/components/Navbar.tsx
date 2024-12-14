import React from 'react';
import { Home, User, LogOut } from 'lucide-react';
import { SearchBar } from './SearchBar';

interface NavbarProps {
  onSearch: (query: string) => void;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Navbar({ onSearch, onNavigate, onLogout }: NavbarProps) {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
            >
              <Home size={24} />
              <span className="font-semibold">MovieApp</span>
            </button>
            
            <SearchBar onSearch={onSearch} />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
            >
              <User size={24} />
              <span>Profile</span>
            </button>
            
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600"
            >
              <LogOut size={24} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}