import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  user: {
    score: 0,
    totalQuestions: 0,
    streak: 0,
    level: 1,
    experience: 0,
    achievements: [],
  },
  flashcards: {
    currentIndex: 0,
    mastered: [],
  },
  bingo: {
    board: [],
    selected: [],
    wins: 0,
  },
  dailyChallenge: {
    date: new Date().toDateString(),
    completed: false,
    streak: 0,
  },
  theme: 'dark',
  soundEnabled: true,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_QUIZ_SCORE':
      const newScore = state.user.score + (action.payload.correct ? 1 : 0);
      const newTotal = state.user.totalQuestions + 1;
      const newStreak = action.payload.correct ? state.user.streak + 1 : 0;
      const newExperience = state.user.experience + (action.payload.correct ? 10 : 5);
      const newLevel = Math.floor(newExperience / 100) + 1;
      
      return {
        ...state,
        user: {
          ...state.user,
          score: newScore,
          totalQuestions: newTotal,
          streak: newStreak,
          experience: newExperience,
          level: newLevel,
        },
      };

    case 'UPDATE_FLASHCARD_INDEX':
      return {
        ...state,
        flashcards: {
          ...state.flashcards,
          currentIndex: action.payload,
        },
      };

    case 'MASTER_FLASHCARD':
      return {
        ...state,
        flashcards: {
          ...state.flashcards,
          mastered: [...state.flashcards.mastered, action.payload],
        },
      };

    case 'UPDATE_BINGO_BOARD':
      return {
        ...state,
        bingo: {
          ...state.bingo,
          board: action.payload,
        },
      };

    case 'SELECT_BINGO_CELL':
      const newSelected = state.bingo.selected.includes(action.payload)
        ? state.bingo.selected.filter(id => id !== action.payload)
        : [...state.bingo.selected, action.payload];
      
      return {
        ...state,
        bingo: {
          ...state.bingo,
          selected: newSelected,
        },
      };

    case 'BINGO_WIN':
      return {
        ...state,
        bingo: {
          ...state.bingo,
          wins: state.bingo.wins + 1,
        },
        user: {
          ...state.user,
          experience: state.user.experience + 50,
        },
      };

    case 'COMPLETE_DAILY_CHALLENGE':
      const today = new Date().toDateString();
      const challengeStreak = state.dailyChallenge.date === today 
        ? state.dailyChallenge.streak 
        : state.dailyChallenge.streak + 1;
      
      return {
        ...state,
        dailyChallenge: {
          date: today,
          completed: true,
          streak: challengeStreak,
        },
        user: {
          ...state.user,
          experience: state.user.experience + 25,
        },
      };

    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        user: {
          ...state.user,
          achievements: [...state.user.achievements, action.payload],
        },
      };

    case 'TOGGLE_SOUND':
      return {
        ...state,
        soundEnabled: !state.soundEnabled,
      };

    case 'RESET_PROGRESS':
      return initialState;

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Save state to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('consultingo-state', JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, [state]);

  // Check for achievements
  useEffect(() => {
    const checkAchievements = () => {
      const { user } = state;
      const newAchievements = [];

      // First correct answer
      if (user.score === 1 && !user.achievements.includes('first-correct')) {
        newAchievements.push('first-correct');
      }

      // Perfect streak of 5
      if (user.streak === 5 && !user.achievements.includes('streak-5')) {
        newAchievements.push('streak-5');
      }

      // Perfect streak of 10
      if (user.streak === 10 && !user.achievements.includes('streak-10')) {
        newAchievements.push('streak-10');
      }

      // Level up achievements
      if (user.level >= 5 && !user.achievements.includes('level-5')) {
        newAchievements.push('level-5');
      }

      // Bingo master
      if (state.bingo.wins >= 3 && !user.achievements.includes('bingo-master')) {
        newAchievements.push('bingo-master');
      }

      newAchievements.forEach(achievement => {
        dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
      });
    };

    checkAchievements();
  }, [state.user.score, state.user.streak, state.user.level, state.bingo.wins]);

  const value = {
    state,
    dispatch,
    updateQuizScore: (correct) => dispatch({ type: 'UPDATE_QUIZ_SCORE', payload: { correct } }),
    updateFlashcardIndex: (index) => dispatch({ type: 'UPDATE_FLASHCARD_INDEX', payload: index }),
    masterFlashcard: (id) => dispatch({ type: 'MASTER_FLASHCARD', payload: id }),
    updateBingoBoard: (board) => dispatch({ type: 'UPDATE_BINGO_BOARD', payload: board }),
    selectBingoCell: (id) => dispatch({ type: 'SELECT_BINGO_CELL', payload: id }),
    bingoWin: () => dispatch({ type: 'BINGO_WIN' }),
    completeDailyChallenge: () => dispatch({ type: 'COMPLETE_DAILY_CHALLENGE' }),
    toggleSound: () => dispatch({ type: 'TOGGLE_SOUND' }),
    resetProgress: () => dispatch({ type: 'RESET_PROGRESS' }),
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
