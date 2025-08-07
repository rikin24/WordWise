import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AcademicCapIcon, 
  LanguageIcon, 
  CubeIcon,
  BookmarkIcon,
  StarIcon,
  PlusIcon,
  ChartBarIcon,
  TrophyIcon,
  FireIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';

function Home({ onCelebration }) {
  const { state } = useApp();

  const features = [
    {
      title: 'Quiz Mode',
      description: 'Test your knowledge with interactive quizzes',
      icon: AcademicCapIcon,
      path: '/quiz',
      color: 'from-blue-500 to-blue-700',
      emoji: '🧠'
    },    {
      title: 'Translator',
      description: 'Convert between corporate jargon and plain English',
      icon: LanguageIcon,
      path: '/flashcards',
      color: 'from-green-500 to-green-700',
      emoji: '🔄'
    },
    {
      title: 'Jargon Bingo',
      description: 'Make meetings more fun with bingo',
      icon: CubeIcon,
      path: '/bingo',
      color: 'from-purple-500 to-purple-700',
      emoji: '🎯'
    },
    {
      title: 'Dictionary',
      description: 'Browse all corporate terms',
      icon: BookmarkIcon,
      path: '/dictionary',
      color: 'from-indigo-500 to-indigo-700',
      emoji: '📖'
    },
    {
      title: 'Daily Challenge',
      description: 'Complete daily challenges for rewards',
      icon: StarIcon,
      path: '/challenge',
      color: 'from-yellow-500 to-yellow-700',
      emoji: '🌟'
    },
    {
      title: 'Submit Term',
      description: 'Contribute to the community',
      icon: PlusIcon,
      path: '/submit',
      color: 'from-pink-500 to-pink-700',
      emoji: '➕'
    }
  ];

  const stats = [
    {
      label: 'Quiz Accuracy',
      value: state.user.totalQuestions > 0 ? Math.round((state.user.score / state.user.totalQuestions) * 100) : 0,
      suffix: '%',
      icon: ChartBarIcon,
      color: 'text-blue-400'
    },
    {
      label: 'Current Streak',
      value: state.user.streak,
      suffix: '',
      icon: FireIcon,
      color: 'text-orange-400'
    },
    {
      label: 'Level',
      value: state.user.level,
      suffix: '',
      icon: TrophyIcon,
      color: 'text-yellow-400'
    },
    {
      label: 'Experience',
      value: state.user.experience,
      suffix: ' XP',
      icon: RocketLaunchIcon,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-8xl mb-6"
        >
          🎯
        </motion.div>
        
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
          <span className="gradient-text">Consultingo</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8">
          Master corporate jargon like a pro! Transform confusing buzzwords into career-boosting knowledge with our gamified learning platform.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/quiz"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 neon-glow"
          >
            <AcademicCapIcon className="h-6 w-6" />
            <span>Start Learning Now</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="glass-card p-6 rounded-2xl text-center card-hover"
          >
            <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
            <p className="text-2xl md:text-3xl font-bold text-white mb-1">
              {stat.value}{stat.suffix}
            </p>
            <p className="text-white/70 text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.03, y: -5 }}
            className="card-hover"
          >
            <Link to={feature.path}>
              <div className="glass-card p-6 rounded-2xl h-full">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{feature.emoji}</div>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-white/70 mb-4">
                  {feature.description}
                </p>
                
                <motion.div
                  whileHover={{ x: 5 }}
                  className={`inline-block bg-gradient-to-r ${feature.color} text-white px-4 py-2 rounded-lg font-semibold text-sm`}
                >
                  Get Started →
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Achievement Section */}
      {state.user.achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            🏆 Your Achievements
          </h2>
          
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex flex-wrap gap-3 justify-center">
              {state.user.achievements.map((achievement, index) => (
                <motion.div
                  key={achievement}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 px-4 py-2 rounded-full font-semibold text-sm shadow-lg"
                >
                  🏅 {achievement.replace('-', ' ').toUpperCase()}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Welcome Message for New Users */}
      {state.user.totalQuestions === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 glass-card p-8 rounded-2xl text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            🎉 Welcome to Consultingo!
          </h2>
          <p className="text-white/80 mb-6">
            Ready to decode the mysterious world of corporate speak? Start with a quick quiz to see where you stand!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCelebration}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Let's Celebrate! 🎊
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}

export default Home;
