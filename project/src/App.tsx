import React from 'react';
import { AuthForm } from './components/AuthForm';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Search } from './pages/Search';

function App() {
  const [token, setToken] = React.useState<string | null>(
    localStorage.getItem('token')
  );
  const [currentPage, setCurrentPage] = React.useState('home');
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleLogin = (token: string) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return <AuthForm onSuccess={handleLogin} />;
  }

  const renderContent = () => {
    if (searchQuery) {
      return <Search query={searchQuery} />;
    }

    switch (currentPage) {
      case 'profile':
        return <Profile />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        onSearch={setSearchQuery}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <Sidebar />
          <main className="flex-1">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
}

export default App;