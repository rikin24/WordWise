import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { jargonData } from '../data/jargonData';

function QuizMode({ onCelebration }) {
  const { state, updateQuizScore } = useApp();
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);

  useEffect(() => {
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const terms = jargonData.terms;
    const correctTerm = terms[Math.floor(Math.random() * terms.length)];
    
    // Get wrong answers
    const wrongOptions = [];
    
    // Add funny literal if available
    if (correctTerm.funny_literal) {
      wrongOptions.push(correctTerm.funny_literal);
    }
    
    // Add other random definitions
    const otherTerms = terms.filter(t => t.term !== correctTerm.term);
    while (wrongOptions.length < 3) {
      const randomTerm = otherTerms[Math.floor(Math.random() * otherTerms.length)];
      if (!wrongOptions.includes(randomTerm.definition)) {
        wrongOptions.push(randomTerm.definition);
      }
    }
    
    // Shuffle all options
    const allOptions = [correctTerm.definition, ...wrongOptions.slice(0, 3)];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
    
    setCurrentQuestion(correctTerm);
    setOptions(shuffledOptions);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answer) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.definition;
    setIsCorrect(correct);
    setShowResult(true);
    
    updateQuizScore(correct);
    
    if (correct) {
      toast.success('Correct! 🎉');
      if (state.user.streak > 0 && state.user.streak % 5 === 0) {
        onCelebration();
      }
    } else {
      toast.error('Not quite right 😅');
    }
  };

  const nextQuestion = () => {
    setQuestionNumber(prev => prev + 1);
    generateQuestion();
  };

  const accuracy = state.user.totalQuestions > 0 
    ? Math.round((state.user.score / state.user.totalQuestions) * 100) 
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          🧠 Quiz Mode
        </h1>
        <p className="text-xl text-white/80">
          Test your corporate jargon knowledge!
        </p>
      </motion.div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 rounded-2xl mb-8"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{state.user.score}</p>
            <p className="text-white/70 text-sm">Correct</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{state.user.totalQuestions}</p>
            <p className="text-white/70 text-sm">Total</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{accuracy}%</p>
            <p className="text-white/70 text-sm">Accuracy</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{state.user.streak}</p>
            <p className="text-white/70 text-sm">Streak 🔥</p>
          </div>
        </div>
      </motion.div>

      {/* Question Card */}
      {currentQuestion && (
        <motion.div
          key={questionNumber}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="glass-card p-8 rounded-2xl mb-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4"
            >
              Question {questionNumber}
            </motion.div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              What does <span className="text-blue-400">"{currentQuestion.term}"</span> mean?
            </h2>
            
            {currentQuestion.category && (
              <div className="inline-block bg-white/20 text-white px-3 py-1 rounded-full text-sm">
                Category: {currentQuestion.category}
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4">
            {options.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(option)}
                disabled={showResult}
                className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                  showResult
                    ? option === currentQuestion.definition
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                      : option === selectedAnswer && !isCorrect
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                      : 'glass-card text-white/70'
                    : 'glass-card text-white hover:bg-white/20 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="flex-1">{option}</span>
                  {showResult && option === currentQuestion.definition && (
                    <CheckIcon className="h-6 w-6 text-white ml-2" />
                  )}
                  {showResult && option === selectedAnswer && !isCorrect && (
                    <XMarkIcon className="h-6 w-6 text-white ml-2" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Result Section */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 pt-6 border-t border-white/20"
              >
                <div className={`p-4 rounded-xl mb-4 ${
                  isCorrect 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-red-500/20 border border-red-500/30'
                }`}>
                  <p className="text-white font-semibold mb-2">
                    {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
                  </p>
                  {!isCorrect && (
                    <p className="text-white/80">
                      The correct answer is: <strong>{currentQuestion.definition}</strong>
                    </p>
                  )}
                </div>

                {/* Example */}
                <div className="glass-card p-4 rounded-xl mb-6">
                  <p className="text-white/80 text-sm mb-2">💡 Example usage:</p>
                  <p className="text-white italic">"{currentQuestion.example}"</p>
                </div>

                {/* Next Question Button */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextQuestion}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center space-x-2"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                    <span>Next Question</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-4 rounded-2xl"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/80 text-sm">Progress</span>
          <span className="text-white/80 text-sm">{state.user.experience % 100}/100 XP</span>
        </div>
        <div className="bg-white/20 rounded-full h-3">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(state.user.experience % 100)}%` }}
            transition={{ duration: 1 }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-3 rounded-full"
          />
        </div>
        <p className="text-white/70 text-xs mt-2 text-center">
          Level {state.user.level} • Keep going to level up!
        </p>
      </motion.div>
    </div>
  );
}

export default QuizMode;
