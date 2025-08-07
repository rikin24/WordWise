import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowPathIcon, TrophyIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { useApp } from '../context/AppContext';
import { jargonData } from '../data/jargonData';

function JargonBingo({ onCelebration }) {
  const { state, updateBingoBoard, selectBingoCell, bingoWin } = useApp();
  const [board, setBoard] = useState([]);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [winningLines, setWinningLines] = useState([]);

  useEffect(() => {
    generateBoard();
  }, []);

  const generateBoard = () => {
    const terms = jargonData.terms;
    const shuffled = [...terms].sort(() => Math.random() - 0.5);
    const newBoard = shuffled.slice(0, 25).map((term, index) => ({
      id: index,
      term: term.term,
      definition: term.definition,
      selected: false
    }));
    
    // Make center cell "FREE"
    newBoard[12] = {
      id: 12,
      term: "FREE",
      definition: "Free space!",
      selected: true
    };
    
    setBoard(newBoard);
    setSelectedCells(new Set([12]));
    setWinningLines([]);
    updateBingoBoard(newBoard);
  };

  const checkForBingo = (selected) => {
    const size = 5;
    const wins = [];
    
    // Check rows
    for (let row = 0; row < size; row++) {
      const rowCells = [];
      for (let col = 0; col < size; col++) {
        rowCells.push(row * size + col);
      }
      if (rowCells.every(cell => selected.has(cell))) {
        wins.push(rowCells);
      }
    }
    
    // Check columns
    for (let col = 0; col < size; col++) {
      const colCells = [];
      for (let row = 0; row < size; row++) {
        colCells.push(row * size + col);
      }
      if (colCells.every(cell => selected.has(cell))) {
        wins.push(colCells);
      }
    }
    
    // Check diagonals
    const diagonal1 = [0, 6, 12, 18, 24];
    const diagonal2 = [4, 8, 12, 16, 20];
    
    if (diagonal1.every(cell => selected.has(cell))) {
      wins.push(diagonal1);
    }
    if (diagonal2.every(cell => selected.has(cell))) {
      wins.push(diagonal2);
    }
    
    return wins;
  };

  const handleCellClick = (cellId) => {
    if (cellId === 12) return; // FREE space is always selected
    
    const newSelected = new Set(selectedCells);
    if (newSelected.has(cellId)) {
      newSelected.delete(cellId);
    } else {
      newSelected.add(cellId);
    }
    
    setSelectedCells(newSelected);
    selectBingoCell(cellId);
    
    const wins = checkForBingo(newSelected);
    setWinningLines(wins);
    
    if (wins.length > 0 && winningLines.length === 0) {
      toast.success('🎉 BINGO! You won!');
      bingoWin();
      onCelebration();
    }
  };

  const resetBoard = () => {
    generateBoard();
    toast.success('New board generated!');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          🎯 Jargon Bingo
        </h1>
        <p className="text-xl text-white/80">
          Make meetings fun! Mark off terms as you hear them.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="glass-card p-4 rounded-xl text-center">
          <TrophyIcon className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{state.bingo.wins}</p>
          <p className="text-white/70 text-sm">Bingo Wins</p>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-white">{selectedCells.size}</p>
          <p className="text-white/70 text-sm">Marked</p>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-white">{25 - selectedCells.size}</p>
          <p className="text-white/70 text-sm">Remaining</p>
        </div>
        <div className="glass-card p-4 rounded-xl text-center">
          <p className="text-2xl font-bold text-white">{winningLines.length}</p>
          <p className="text-white/70 text-sm">Lines</p>
        </div>
      </motion.div>

      {/* Bingo Board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 rounded-2xl mb-8"
      >
        <div className="grid grid-cols-5 gap-3 max-w-2xl mx-auto">
          {/* Header */}
          {['B', 'I', 'N', 'G', 'O'].map((letter, index) => (
            <div
              key={letter}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold h-16 rounded-xl flex items-center justify-center"
            >
              {letter}
            </div>
          ))}
          
          {/* Board Cells */}
          {board.map((cell) => {
            const isSelected = selectedCells.has(cell.id);
            const isWinning = winningLines.some(line => line.includes(cell.id));
            
            return (
              <motion.button
                key={cell.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: cell.id * 0.02 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCellClick(cell.id)}
                className={`h-16 p-2 rounded-xl font-semibold text-xs transition-all duration-300 ${
                  isWinning
                    ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 shadow-lg animate-pulse'
                    : isSelected
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                    : 'glass-card text-white hover:bg-white/20'
                } ${cell.id === 12 ? 'cursor-default' : 'cursor-pointer'}`}
                title={cell.definition}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  {cell.id === 12 && <div className="text-lg mb-1">🎁</div>}
                  <span className="leading-tight text-center">
                    {cell.term}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetBoard}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold inline-flex items-center space-x-2 shadow-lg"
        >
          <ArrowPathIcon className="h-5 w-5" />
          <span>New Game</span>
        </motion.button>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6 rounded-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          🎮 How to Play
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-white/80">
          <div>
            <h4 className="font-semibold text-white mb-2">📋 Instructions:</h4>
            <ul className="space-y-2 text-sm">
              <li>• Click terms as you hear them in meetings</li>
              <li>• Get 5 in a row (horizontal, vertical, or diagonal)</li>
              <li>• Center "FREE" space is automatically marked</li>
              <li>• Hover over cells to see definitions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">🏆 Winning:</h4>
            <ul className="space-y-2 text-sm">
              <li>• Complete any row, column, or diagonal</li>
              <li>• Multiple lines count as separate wins</li>
              <li>• Generate new boards for more challenges</li>
              <li>• Track your total wins in the stats</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default JargonBingo;
