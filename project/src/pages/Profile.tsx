import React from 'react';
import { User } from 'lucide-react';
import { api } from '../lib/api';
import type { User as UserType } from '../types';

export function Profile() {
  const [user, setUser] = React.useState<UserType | null>(null);

  React.useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.getProfile();
        setUser(data);
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    loadProfile();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-indigo-100 p-4 rounded-full">
            <User size={48} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{user.username}</h2>
            <p className="text-gray-500">Member</p>
          </div>
        </div>
      </div>
    </div>
  );
}