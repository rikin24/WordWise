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
    // Define all available achievements
  const allAchievements = [
    {
      id: 'first-correct',
      name: 'First Steps',
      description: 'Answer your first question correctly',
      emoji: '🎯',
      requirement: 'Get 1 correct answer'
    },
    {
      id: 'streak-5',
      name: 'Getting Warmed Up',
      description: 'Achieve a 5-question streak',
      emoji: '🔥',
      requirement: 'Reach 5 streak'
    },
    {
      id: 'streak-10',
      name: 'On Fire',
      description: 'Achieve a 10-question streak',
      emoji: '🚀',
      requirement: 'Reach 10 streak'
    },
    {
      id: 'level-5',
      name: 'Rising Expert',
      description: 'Reach Level 5',
      emoji: '⭐',
      requirement: 'Reach Level 5'
    },
    {
      id: 'bingo-master',
      name: 'Bingo Champion',
      description: 'Win 3 bingo games',
      emoji: '🏆',
      requirement: 'Win 3 bingo games'
    },
    {
      id: 'daily-warrior',
      name: 'Daily Warrior',
      description: 'Complete daily challenges for 7 days',
      emoji: '⚔️',
      requirement: 'Complete 7 daily challenges'
    }
  ];

  const features = [{
      title: 'Quiz Mode',
      description: 'Test your knowledge with interactive quizzes',
      icon: AcademicCapIcon,
      path: '/quiz',
      color: 'from-blue-400 to-light-plum',
      emoji: '🧠'
    },    {
      title: 'Translator',
      description: 'Convert between corporate jargon and plain English',
      icon: LanguageIcon,
      path: '/translator',
      color: 'from-blue-400 to-medium-blue',
      emoji: '🔄'
    },
    {
      title: 'Jargon Bingo',
      description: 'Make meetings more fun with bingo',
      icon: CubeIcon,
      path: '/bingo',
      color: 'from-blue-400 to-medium-teal',
      emoji: '🎯'
    },
    {
      title: 'Dictionary',
      description: 'Browse all corporate terms',
      icon: BookmarkIcon,
      path: '/dictionary',
      color: 'from-blue-400 to-light-plum',
      emoji: '📖'
    },    {
      title: 'Daily Challenge',
      description: 'Complete daily challenges for rewards',
      icon: StarIcon,
      path: '/challenge',
      color: 'from-blue-400 to-medium-blue',
      emoji: '🌟'
    },
    {
      title: 'Submit Term',
      description: 'Contribute to the community',
      icon: PlusIcon,
      path: '/submit',
      color: 'from-blue-400 to-medium-teal',
      emoji: '➕'
    }
  ];
  const stats = [
    {
      label: 'Quiz Accuracy',
      value: state.user.totalQuestions > 0 ? Math.round((state.user.score / state.user.totalQuestions) * 100) : 0,
      suffix: '%',
      icon: ChartBarIcon,
      color: 'text-light-plum'
    },
    {
      label: 'Current Streak',
      value: state.user.streak,
      suffix: '',
      icon: FireIcon,
      color: 'text-light-teal'
    },
    {
      label: 'Level',
      value: state.user.level,
      suffix: '',
      icon: TrophyIcon,
      color: 'text-light-blue'
    },
    {
      label: 'Experience',
      value: state.user.experience,
      suffix: ' XP',
      icon: RocketLaunchIcon,
      color: 'text-medium-gray'
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
        </motion.div>        <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
          <span className="gradient-text">Consultingo</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-8">
          Master corporate jargon through quizzes, translation, bingo, and daily challenges. Level up, earn achievements, and contribute to the community!
        </p><motion.div
          whileHover={{ 
            scale: 1.03,
            y: -2,
            rotateX: 3
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 15 
          }}
        >
          <Link
            to="/translator"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-medium-teal via-medium-blue to-dark-blue hover:from-light-teal hover:via-medium-blue hover:to-light-blue text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-light-plum/20 hover:shadow-3xl transition-all duration-400 neon-glow relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            <motion.div
              whileHover={{ rotate: 10 }}
              transition={{ duration: 0.3 }}
            >
              <LanguageIcon className="h-6 w-6 relative z-10" />
            </motion.div>
            <span className="relative z-10">Try the Translator</span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
      >        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              transition: { duration: 0.15 }
            }}
            whileTap={{ scale: 0.98 }}
            style={{ transition: "all 0.15s ease-out" }}
            className="glass-card p-6 rounded-2xl text-center"
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
      >        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
            whileHover={{ 
              scale: 1.03, 
              y: -5,
              transition: { duration: 0.15 }
            }}
            whileTap={{ scale: 0.98 }}
            style={{ transition: "all 0.15s ease-out" }}
          >
            <Link to={feature.path}>              <div className="glass-card p-6 rounded-2xl h-full flex flex-col">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{feature.emoji}</div>
                  {/* <feature.icon className="h-6 w-6 text-white" /> */}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-white/70 mb-4 flex-grow">
                  {feature.description}
                </p>                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.15 }}
                  className={`inline-block bg-gradient-to-r ${feature.color} text-white px-4 py-2.5 rounded-lg font-semibold text-sm w-fit`}
                >
                  Get Started →
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>      {/* Achievement Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-12"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          🏆 Achievements
        </h2>
        
        <div className="glass-card p-6 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allAchievements.map((achievement, index) => {
              const isUnlocked = state.user.achievements.includes(achievement.id);
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  whileHover={{ scale: isUnlocked ? 1.05 : 1.02 }}                  className={`relative p-4 rounded-xl transition-all duration-300 ${
                    isUnlocked 
                      ? 'bg-gradient-to-r from-blue-400 to-medium-teal shadow-lg border border-blue-400/30' 
                      : 'bg-gradient-to-r from-dark-gray/50 to-medium-gray/40 border border-gray-400/30'
                  }`}
                >
                  {/* Achievement Content */}
                  <div className="text-center">
                    <div className={`text-3xl mb-2 ${isUnlocked ? '' : 'grayscale opacity-70'}`}>
                      {achievement.emoji}
                    </div>
                    <h3 className={`font-bold text-sm mb-1 ${
                      isUnlocked ? 'text-white' : 'text-gray-200'
                    }`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-xs mb-2 ${
                      isUnlocked ? 'text-white/90' : 'text-gray-300'
                    }`}>
                      {achievement.description}
                    </p>
                    <p className={`text-xs ${
                      isUnlocked ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {achievement.requirement}
                    </p>
                  </div>
                  
                  {/* Unlock indicator */}
                  {isUnlocked && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
          
          {/* Progress Stats */}
          <div className="mt-6 pt-4 border-t border-white/20 text-center">
            <p className="text-white/70 text-sm">
              Progress: {state.user.achievements.length} of {allAchievements.length} achievements unlocked
            </p>
            <div className="mt-2 bg-white/20 rounded-full h-2 max-w-xs mx-auto">
              <div 
                className="bg-gradient-to-r from-blue-400 to-medium-teal h-2 rounded-full transition-all duration-500"
                style={{ width: `${(state.user.achievements.length / allAchievements.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Progress Celebration Section
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-12 glass-card p-8 rounded-2xl text-center"
      >        {state.user.totalQuestions === 0 ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">
              🎉 Welcome to Consultingo!
            </h2>
            <p className="text-white/80 mb-6">
              Ready to start your jargon mastery journey? Every correct answer earns XP and builds your streak. Let's celebrate the beginning of something great!
            </p>
          </>
        ) : state.user.streak >= 5 ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">
              🔥 You're on Fire!
            </h2>
            <p className="text-white/80 mb-6">
              Your {state.user.streak}-question streak shows serious dedication! That's {state.user.streak * 10} XP from pure consistency. This kind of progress deserves a celebration!
            </p>
          </>
        ) : state.user.level >= 3 ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">
              🚀 Level {state.user.level} Achieved!
            </h2>
            <p className="text-white/80 mb-6">
              You've crushed {state.user.totalQuestions} questions and earned {state.user.experience} XP! Reaching Level {state.user.level} is no small feat - time to celebrate this milestone!
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">
              💪 Great Progress!
            </h2>
            <p className="text-white/80 mb-6">
              {state.user.totalQuestions} questions down, {state.user.experience} XP earned! Every answer gets you closer to jargon mastery. Your learning journey is worth celebrating!
            </p>
          </>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCelebration}
          className="bg-gradient-to-r from-light-plum to-medium-plum text-white px-6 py-3 rounded-xl font-semibold"
        >
          Let's Celebrate! 🎊
        </motion.button>
      </motion.div> */}
    </div>
  );
}

export default Home;
