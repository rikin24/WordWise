import React from 'react';
import { motion } from 'framer-motion';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-midnight-blue via-dark-plum to-dark-blue flex items-center justify-center">
      <div className="text-center">        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8 pb-4"
        >
          <div className="text-8xl mb-4">🎯</div>
          <div className="pb-2">
            <h1 className="text-6xl font-bold text-white mb-4 gradient-text" style={{ lineHeight: '1.3', paddingBottom: '8px' }}>
              Consultingo
            </h1>
          </div>
          <p className="text-xl text-white/80">
            Master corporate jargon like a pro!
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex justify-center space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [-10, 10, -10],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-4 h-4 bg-white rounded-full"
            />
          ))}
        </motion.div>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-8 h-1 bg-gradient-to-r from-blue-400 to-medium-teal rounded-full mx-auto max-w-xs"
        />
      </div>
    </div>
  );
}

export default LoadingScreen;
