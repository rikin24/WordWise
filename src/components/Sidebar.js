import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  AcademicCapIcon, 
  LanguageIcon, 
  CubeIcon,
  BookmarkIcon,
  StarIcon,
  PlusIcon,
  ChartBarIcon,
  TrophyIcon,
  FireIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';

function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const { state } = useApp();
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);  const menuItems = [
    { path: '/', name: 'Home', icon: HomeIcon },
    { path: '/quiz', name: 'Quiz Mode', icon: AcademicCapIcon },
    { path: '/translator', name: 'Translator', icon: LanguageIcon },
    { path: '/bingo', name: 'Jargon Bingo', icon: CubeIcon },
    { path: '/dictionary', name: 'Dictionary', icon: BookmarkIcon },
    { path: '/challenge', name: 'Daily Challenge', icon: StarIcon },
    { path: '/submit', name: 'Submit Term', icon: PlusIcon },
  ];

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: -280 }
  };

  // On large screens, sidebar should always be visible
  const animateState = isLargeScreen ? "open" : (isOpen ? "open" : "closed");

  const accuracy = state.user.totalQuestions > 0 
    ? Math.round((state.user.score / state.user.totalQuestions) * 100) 
    : 0;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && !isLargeScreen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={animateState}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-20 left-0 bottom-0 w-64 glass-card m-4 rounded-2xl z-40 overflow-hidden`}
      >
        <div className="p-6 h-full flex flex-col overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="text-3xl">🎯</div>
            <div>
              <h2 className="text-xl font-bold text-white">Consultingo</h2>
              <p className="text-sm text-white/70">Corporate Jargon Master</p>
            </div>
          </div>

          {/* Stats
          <div className="mb-6 space-y-3 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card p-4 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ChartBarIcon className="h-5 w-5 text-blue-400" />
                  <span className="text-white text-sm">Accuracy</span>
                </div>
                <span className="text-white font-bold">{accuracy}%</span>
              </div>
              <div className="mt-2 bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${accuracy}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-light-blue to-medium-blue h-2 rounded-full"
                />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card p-4 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FireIcon className="h-5 w-5 text-orange-400" />
                  <span className="text-white text-sm">Streak</span>
                </div>
                <span className="text-white font-bold">{state.user.streak}</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="glass-card p-4 rounded-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <TrophyIcon className="h-5 w-5 text-yellow-400" />
                  <span className="text-white text-sm">Level</span>
                </div>
                <span className="text-white font-bold">{state.user.level}</span>
              </div>
              <div className="mt-2 bg-white/20 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(state.user.experience % 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-light-teal to-medium-teal h-2 rounded-full"
                />
              </div>
              <p className="text-xs text-white/70 mt-1">
                {state.user.experience % 100}/100 XP
              </p>
            </motion.div>
          </div> */}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto min-h-0 sidebar-nav">
            <ul className="space-y-2 pb-4">
              {menuItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.li
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => !isLargeScreen && setIsOpen(false)}
                      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-medium-blue/30 to-medium-plum/30 text-white shadow-lg'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* Footer stats */}
          <div className="border-t border-white/20 pt-4 mt-4 flex-shrink-0">
            <div className="text-center">
              <p className="text-white/70 text-xs mb-2">
                Quiz Score: {state.user.score}/{state.user.totalQuestions}
              </p>
              <p className="text-white/70 text-xs">
                Achievements: {state.user.achievements.length}
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

export default Sidebar;
