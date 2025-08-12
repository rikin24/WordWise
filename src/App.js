import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Confetti from 'react-confetti';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import QuizMode from './components/QuizMode';
import Translator from './components/Translator';
import JargonBingo from './components/JargonBingo';
import Dictionary from './components/Dictionary';
import DailyChallenge from './components/DailyChallenge';
import SubmitTerm from './components/SubmitTerm';
import LoadingScreen from './components/LoadingScreen';
import UserSubmissionTest from './components/UserSubmissionTest';
import TranslationTest from './components/TranslationTest';
import LocalStorageViewer from './components/LocalStorageViewer';
import DebugUserData from './components/DebugUserData';

// Data
import { jargonData } from './data/jargonData';

// Context
import { AppProvider } from './context/AppContext';

function App() {
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Simulate loading time for splash screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleCelebration = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  if (loading) {
    return <LoadingScreen />;
  }  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen h-full bg-gradient-to-br from-midnight-blue via-dark-plum to-dark-blue w-full overflow-x-hidden relative">
          {showConfetti && (
            <Confetti
              width={typeof window !== 'undefined' ? window.innerWidth : 1920}
              height={typeof window !== 'undefined' ? window.innerHeight : 1080}
              recycle={false}
              numberOfPieces={200}
              gravity={0.3}
              style={{ position: 'fixed', top: 0, left: 0, zIndex: 1000 }}
            />
          )}
          
          <Navbar 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
          />
          
          <div className="flex">
            <Sidebar 
              isOpen={sidebarOpen} 
              setIsOpen={setSidebarOpen} 
            />
            
            <main className={`flex-1 transition-all duration-300 ${
              sidebarOpen ? 'ml-64' : 'ml-0'
            } lg:ml-64`}>
              <div className="p-4 lg:p-8">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route 
                      path="/" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Home onCelebration={handleCelebration} />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/quiz" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <QuizMode onCelebration={handleCelebration} />
                        </motion.div>
                      } 
                    />                    <Route 
                      path="/translator" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Translator />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/bingo" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <JargonBingo onCelebration={handleCelebration} />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/dictionary" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Dictionary />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/challenge" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, rotateY: 90 }}
                          animate={{ opacity: 1, rotateY: 0 }}
                          exit={{ opacity: 0, rotateY: -90 }}
                          transition={{ duration: 0.4 }}
                        >
                          <DailyChallenge onCelebration={handleCelebration} />
                        </motion.div>
                      } 
                    />                    <Route 
                      path="/submit" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <SubmitTerm />
                        </motion.div>
                      } 
                    />                    <Route 
                      path="/test-submissions" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <UserSubmissionTest />
                        </motion.div>
                      } 
                    />
                    <Route 
                      path="/test-translation" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TranslationTest />
                        </motion.div>
                      }                    />
                    <Route 
                      path="/localstorage-viewer" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <LocalStorageViewer />
                        </motion.div>
                      }                    />
                    <Route 
                      path="/debug-data" 
                      element={
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <DebugUserData />
                        </motion.div>
                      } 
                    />
                  </Routes>
                </AnimatePresence>
              </div>
            </main>
          </div>
            <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'rgba(46, 48, 142, 0.9)',
                color: '#fff',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(133, 160, 249, 0.3)',
              },
            }}
          />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
