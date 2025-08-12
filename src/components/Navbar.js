import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function Navbar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Home';
      case '/quiz': return 'Quiz Mode';
      case '/translator': return 'Translator';
      case '/bingo': return 'Jargon Bingo';
      case '/dictionary': return 'Dictionary';
      case '/challenge': return 'Daily Challenge';
      case '/submit': return 'Submit Jargon';
      default: return 'Consultingo';
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card m-4 p-4 sticky top-4 z-50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg glass-card hover:bg-white/20 transition-colors"
          >
            {sidebarOpen ? (
              <XMarkIcon className="h-6 w-6 text-white" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-white" />
            )}
          </button>
            <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-3xl"
            >
              🎯
            </motion.div>            <h1 className="text-2xl font-bold hidden sm:block relative overflow-hidden group-hover:cursor-pointer">
              <span className="relative z-10 bg-gradient-to-r from-white via-white to-white bg-clip-text text-transparent group-hover:from-white group-hover:via-light-gray group-hover:to-white group-hover:bg-[length:200%_100%] group-hover:animate-shimmer transition-all duration-300">
                WordWise
              </span>
            </h1>
          </Link>
        </div>        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-white hidden md:block">
            {getPageTitle()}
          </h2>
          
          <div className="px-2">
            <span className="text-white/60 text-xs font-medium tracking-wide">
              🚀 Level Up Your Jargon Game
            </span>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
