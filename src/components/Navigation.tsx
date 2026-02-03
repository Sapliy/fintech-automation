import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { mode, setMode } = useUIStore();

  const handleModeChange = (newMode: 'friendly' | 'advanced') => {
    setMode(newMode);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-white">
              IoT Automation
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors">
                Dashboard
              </Link>
              <Link to="/devices" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors">
                Devices
              </Link>
              <Link to="/automations" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors">
                Automations
              </Link>
              <Link to="/analytics" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition-colors">
                Analytics
              </Link>
              
              {/* Mode Switcher */}
              <div className="relative">
                <button
                  onClick={() => handleModeChange(mode === 'friendly' ? 'advanced' : 'friendly')}
                  className="px-4 py-2 rounded-md text-sm font-medium bg-blue-800 hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <span>{mode === 'friendly' ? 'Friendly Mode' : 'Advanced Mode'}</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
            >
              Dashboard
            </Link>
            <Link
              to="/devices"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
            >
              Devices
            </Link>
            <Link
              to="/automations"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
            >
              Automations
            </Link>
            <Link
              to="/analytics"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
            >
              Analytics
            </Link>
            <button
              onClick={() => handleModeChange(mode === 'friendly' ? 'advanced' : 'friendly')}
              className="w-full text-left px-3 py-2 rounded-md text-base font-medium bg-blue-800 hover:bg-blue-700"
            >
              {mode === 'friendly' ? 'Friendly Mode' : 'Advanced Mode'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation; 