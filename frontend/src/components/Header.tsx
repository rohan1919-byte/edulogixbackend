import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-purple-800 via-purple-700 to-purple-900 shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-2">
          <img 
  src="/logo.png" 
  alt="icon" 
  className="w-10 h-10 text-white filter brightness-200 " 
/>

            <Link to="/" className="text-2xl font-bold text-white hover:text-purple-200 transition-colors flex items-center">
              EDULOGIX
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-purple-100">Welcome, {user.name || user.email}</span>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-purple-900 to-purple-800 text-white px-4 py-2 rounded-md hover:from-purple-800 hover:to-purple-700 transition-all duration-300 border-2 border-purple-300 hover:border-purple-200 shadow-lg hover:shadow-purple-500/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="text-purple-100 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-md hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 