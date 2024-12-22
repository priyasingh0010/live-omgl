// components/Layout.jsx
import { useEffect } from 'react';
import UserStats from './UserStats';

export default function Layout({ children, userCount, username }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <UserStats userCount={userCount} username={username} />
        </div>
      </div>
      <div className="flex-1 max-w-4xl mx-auto w-full p-4">
        {children}
      </div>
    </div>
  );
}
