import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, XMarkIcon, FireIcon, CalendarIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { jargonData } from '../data/jargonData';

function DailyChallenge({ onCelebration }) {
  const { state, completeDailyChallenge } = useApp();
  const [todaysChallenge, setTodaysChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [options, setOptions] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [challengeType, setChallengeType] = useState('multiple-choice'); // or 'text-input'

  useEffect(() => {
    generateDailyChallenge();
  }, []);

  const generateDailyChallenge = () => {
    const today = new Date().toDateString();
    
    // Check if challenge is already completed today
    if (state.dailyChallenge.date === today && state.dailyChallenge.completed) {
      return;
    }

    // Use date as seed for consistent daily challenge
    const seed = new Date().getDate() + new Date().getMonth() * 31 + new Date().getFullYear() * 365;
    const terms = jargonData.terms;
    const challengeTerm = terms[seed % terms.length];
    
    // Randomly choose challenge type
    const types = ['multiple-choice', 'text-input'];
    const type = types[seed % types.length];
    setChallengeType(type);
    
    if (type === 'multiple-choice') {
      // Generate multiple choice options
      const wrongOptions = [];
      const otherTerms = terms.filter(t => t.term !== challengeTerm.term);
      
      // Add funny literal if available
      if (challengeTerm.funny_literal) {
        wrongOptions.push(challengeTerm.funny_literal);
      }
      
      // Add other random definitions
      while (wrongOptions.length < 3) {
        const randomTerm = otherTerms[Math.floor(Math.random() * otherTerms.length)];
        if (!wrongOptions.includes(randomTerm.definition)) {
          wrongOptions.push(randomTerm.definition);
        }
      }
      
      const allOptions = [challengeTerm.definition, ...wrongOptions.slice(0, 3)];
      setOptions(allOptions.sort(() => Math.random() - 0.5));
    }
    
    setTodaysChallenge(challengeTerm);
    setShowResult(false);
    setUserAnswer('');
  };

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    
    let correct = false;
    
    if (challengeType === 'multiple-choice') {
      correct = userAnswer === todaysChallenge.definition;
    } else {
      // For text input, check if the answer contains key words
      const correctAnswer = todaysChallenge.definition.toLowerCase();
      const answer = userAnswer.toLowerCase();
      correct = correctAnswer.includes(answer) || answer.includes(correctAnswer.split(' ')[0]);
    }
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      completeDailyChallenge();
      toast.success('🎉 Daily challenge completed!');
      onCelebration();
    } else {
      toast.error('Not quite right. Try again tomorrow!');
    }
  };

  const getDaysUntilNext = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diffMs = tomorrow.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours: diffHours, minutes: diffMinutes };
  };

  const timeUntilNext = getDaysUntilNext();
  const today = new Date().toDateString();
  const isCompletedToday = state.dailyChallenge.date === today && state.dailyChallenge.completed;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          🌟 Daily Challenge
        </h1>
        <p className="text-xl text-white/80">
          Complete daily challenges to build your streak!
        </p>
      </motion.div>

      {/* Streak Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className="glass-card p-6 rounded-2xl text-center">
          <FireIcon className="h-12 w-12 text-orange-400 mx-auto mb-3" />
          <p className="text-3xl font-bold text-white">{state.dailyChallenge.streak}</p>
          <p className="text-white/70">Day Streak</p>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center">
          <CalendarIcon className="h-12 w-12 text-blue-400 mx-auto mb-3" />
          <p className="text-3xl font-bold text-white">
            {isCompletedToday ? '✅' : '⏳'}
          </p>
          <p className="text-white/70">Today's Status</p>
        </div>
        <div className="glass-card p-6 rounded-2xl text-center">
          <div className="text-3xl mb-3">⏰</div>
          <p className="text-lg font-bold text-white">
            {timeUntilNext.hours}h {timeUntilNext.minutes}m
          </p>
          <p className="text-white/70 text-sm">Until Next Challenge</p>
        </div>
      </motion.div>

      {/* Challenge Card */}
      {todaysChallenge && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-2xl mb-8"
        >
          {isCompletedToday ? (
            // Already completed
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Challenge Completed!
              </h2>
              <p className="text-white/80 mb-6">
                Come back tomorrow for a new challenge to continue your streak!
              </p>
              <div className="glass-card p-4 rounded-xl">
                <p className="text-white/70 text-sm mb-2">Today's term was:</p>
                <p className="text-xl font-bold text-white mb-2">{todaysChallenge.term}</p>
                <p className="text-white/90">{todaysChallenge.definition}</p>
              </div>
            </div>
          ) : (
            // Active challenge
            <div>
              <div className="text-center mb-8">
                <div className="inline-block bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  Daily Challenge #{new Date().getDate()}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  What does <span className="text-yellow-400">"{todaysChallenge.term}"</span> mean?
                </h2>
                {todaysChallenge.category && (
                  <div className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                    Category: {todaysChallenge.category}
                  </div>
                )}
              </div>

              {challengeType === 'multiple-choice' ? (
                // Multiple Choice
                <div className="space-y-4 mb-8">
                  {options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setUserAnswer(option)}
                      disabled={showResult}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                        showResult
                          ? option === todaysChallenge.definition
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                            : option === userAnswer && !isCorrect
                            ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                            : 'glass-card text-white/50'
                          : userAnswer === option
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'glass-card text-white hover:bg-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showResult && option === todaysChallenge.definition && (
                          <CheckIcon className="h-6 w-6" />
                        )}
                        {showResult && option === userAnswer && !isCorrect && (
                          <XMarkIcon className="h-6 w-6" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                // Text Input
                <div className="mb-8">
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    disabled={showResult}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                    rows={4}
                  />
                </div>
              )}

              {/* Submit Button */}
              {!showResult && (
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={!userAnswer.trim()}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Answer
                  </motion.button>
                </div>
              )}

              {/* Result */}
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 pt-6 border-t border-white/20"
                >
                  <div className={`p-4 rounded-xl mb-4 ${
                    isCorrect 
                      ? 'bg-green-500/20 border border-green-500/30' 
                      : 'bg-red-500/20 border border-red-500/30'
                  }`}>
                    <p className="text-white font-semibold mb-2">
                      {isCorrect ? '🎉 Correct! Streak continued!' : '❌ Not quite right'}
                    </p>
                    {!isCorrect && (
                      <p className="text-white/80">
                        Correct answer: <strong>{todaysChallenge.definition}</strong>
                      </p>
                    )}
                  </div>

                  {/* Example */}
                  <div className="glass-card p-4 rounded-xl">
                    <p className="text-white/80 text-sm mb-2">💡 Example usage:</p>
                    <p className="text-white italic">"{todaysChallenge.example}"</p>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* Challenge History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6 rounded-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          📈 Challenge Benefits
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-3">🎯 Daily Rewards:</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>• +25 XP for completion</li>
              <li>• Build your daily streak</li>
              <li>• Unlock special achievements</li>
              <li>• Maintain learning momentum</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3">🏆 Streak Milestones:</h4>
            <ul className="space-y-2 text-white/80 text-sm">
              <li>• 7 days: Consistent Learner</li>
              <li>• 30 days: Jargon Master</li>
              <li>• 90 days: Corporate Guru</li>
              <li>• 365 days: Ultimate Champion</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default DailyChallenge;
