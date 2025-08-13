import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userSubmissionService } from '../services/userSubmissionService';
import { userDataCleanup } from '../utils/cleanupUserData';

function LiveDataViewer() {
  const [localStorageData, setLocalStorageData] = useState(null);
  const [cleanupResults, setCleanupResults] = useState(null);

  const loadData = () => {
    // Get raw localStorage data
    const rawData = localStorage.getItem('userSubmittedTerms');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        setLocalStorageData(parsed);
      } catch (error) {
        console.error('Error parsing localStorage:', error);
        setLocalStorageData({ error: 'Failed to parse localStorage data' });
      }
    } else {
      setLocalStorageData(null);
    }
  };

  const runCleanup = () => {
    const result = userDataCleanup.cleanupUserData();
    setCleanupResults(result);
    loadData(); // Reload data after cleanup
  };

  const clearAllData = () => {
    localStorage.removeItem('userSubmittedTerms');
    userSubmissionService.resetToFileData();
    loadData();
    setCleanupResults(null);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          📊 Live Data Viewer
        </h1>
        <p className="text-white/80">
          Real-time view of localStorage and cleanup tools
        </p>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadData}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300"
        >
          🔄 Refresh Data
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={runCleanup}
          className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all duration-300"
        >
          🧹 Clean Data
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearAllData}
          className="px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-all duration-300"
        >
          🗑️ Clear All
        </motion.button>
      </div>

      {/* Cleanup Results */}
      {cleanupResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Cleanup Results</h3>
          {cleanupResults.success ? (
            <div className="text-green-400">
              <p>✅ Cleanup successful!</p>
              <p>Removed {cleanupResults.removed.terms} terms and {cleanupResults.removed.acronyms} acronyms</p>
            </div>
          ) : (
            <div className="text-red-400">
              <p>❌ Cleanup failed</p>
              <p>{cleanupResults.error}</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Data Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-4">Current localStorage Data</h3>
        
        {localStorageData ? (
          <div>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">
                  {localStorageData.terms?.length || 0}
                </p>
                <p className="text-white/70 text-sm">Terms</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">
                  {localStorageData.acronyms?.length || 0}
                </p>
                <p className="text-white/70 text-sm">Acronyms</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-purple-400">
                  {localStorageData.version || 'No version'}
                </p>
                <p className="text-white/70 text-sm">Version</p>
              </div>
            </div>

            {/* Terms */}
            {localStorageData.terms && localStorageData.terms.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Terms:</h4>
                <div className="space-y-2">
                  {localStorageData.terms.map((term, index) => (
                    <div key={term.id || index} className="bg-white/5 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-white">{term.term}</h5>
                          <p className="text-white/70 text-sm">{term.category}</p>
                          <p className="text-white/60 text-xs">{term.submittedDate} • {term.status}</p>
                        </div>
                        {term.term && term.term.toLowerCase().includes('test') && (
                          <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">
                            ⚠️ Test Term
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acronyms */}
            {localStorageData.acronyms && localStorageData.acronyms.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">Acronyms:</h4>
                <div className="space-y-2">
                  {localStorageData.acronyms.map((acronym, index) => (
                    <div key={acronym.id || index} className="bg-white/5 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-white">
                            {acronym.acronym} - {acronym.fullName || acronym.full_name}
                          </h5>
                          <p className="text-white/70 text-sm">{acronym.category}</p>
                          <p className="text-white/60 text-xs">{acronym.submittedDate} • {acronym.status}</p>
                        </div>
                        {/* Check for duplicate indicators */}
                        <div className="flex space-x-1">
                          {acronym.acronym === 'WIP' && (
                            <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs">
                              ⚠️ Check for duplicate
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Raw Data */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-3">Raw Data:</h4>
              <pre className="bg-gray-800 p-4 rounded-lg text-white text-xs overflow-auto max-h-96">
                {JSON.stringify(localStorageData, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/70">No localStorage data found</p>
            <p className="text-white/60 text-sm mt-2">
              The app will use default file data until submissions are made
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default LiveDataViewer;
