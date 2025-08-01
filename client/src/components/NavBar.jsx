import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/login");
    } catch (error) {
      console.error("Logout Error: ", error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">

          {/* Hamburger icon on the right side */}
          <div className="absolute inset-y-0 right-0 flex items-center sm:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* App Title - Centered */}
          <div className="flex-shrink-0 text-white font-bold text-xl">
            Team Task Manager
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:block sm:ml-6">
            <div className="flex space-x-4">
              <Link to="/" className="text-white px-3 py-2 rounded-md text-lg font-medium hover:bg-blue-500">
                Dashboard
              </Link>
              <Link to="/teams" className="text-white px-3 py-2 rounded-md text-lg font-medium hover:bg-blue-500">
                Teams
              </Link>
              <Link to="/tasks" className="text-white px-3 py-2 rounded-md text-lg font-medium hover:bg-blue-500">
                Tasks
              </Link>
              <button
                onClick={handleLogout}
                className="text-white px-3 py-2 rounded-md text-lg font-medium hover:bg-blue-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-blue-600 text-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500">
              Dashboard
            </Link>
            <Link to="/teams" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500">
              Teams
            </Link>
            <Link to="/tasks" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500">
              Tasks
            </Link>
            <button
              onClick={handleLogout}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-500"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
