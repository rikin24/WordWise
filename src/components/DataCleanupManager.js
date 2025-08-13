import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrashIcon, MagnifyingGlassIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { userDataCleanup } from '../utils/cleanupUserData';
import { userSubmissionService } from '../services/userSubmissionService';
import toast from 'react-hot-toast';

function DataCleanupManager() {
  const [currentData, setCurrentData] = useState({ terms: [], acronyms: [] });
  const [previewData, setPreviewData] = useState(null);
  const [problematicEntries, setProblematicEntries] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCurrentData();
    analyzeData();
  }, []);

  const loadCurrentData = () => {
    const data = userSubmissionService.getUserSubmissions();
    setCurrentData(data);
  };

  const analyzeData = () => {
    const preview = userDataCleanup.previewCleanup();
    const problematic = userDataCleanup.findProblematicEntries();
    
    setPreviewData(preview);
    setProblematicEntries(problematic);
  };

  const handleCleanup = async () => {
    setIsLoading(true);
    
    try {
      const result = userDataCleanup.cleanupUserData();
      
      if (result.success) {
        toast.success(
          `🧹 Cleaned successfully! Removed ${result.removed.terms} terms and ${result.removed.acronyms} acronyms`,
          {
            duration: 5000,
            className: 'custom-toast toast-success',
            style: {
              background: 'transparent',
              border: 'none',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              backdropFilter: 'blur(16px)',
              color: '#f0fdf4',
              fontSize: '14px',
              fontWeight: '500',
              lineHeight: '1.4'
            }
          }
        );
        
        // Reload data after cleanup
        loadCurrentData();
        analyzeData();
      } else {
        toast.error('❌ Cleanup failed. Please try again.', {
          duration: 4000,
          className: 'custom-toast toast-error'
        });
      }
    } catch (error) {
      console.error('Cleanup error:', error);
      toast.error('❌ An error occurred during cleanup.', {
        duration: 4000,
        className: 'custom-toast toast-error'
      });
    }
    
    setIsLoading(false);
  };

  const handleRemoveSpecific = async (type, id) => {
    const success = type === 'term' 
      ? userDataCleanup.removeTerm(id)
      : userDataCleanup.removeAcronym(id);
    
    if (success) {
      toast.success(`✅ ${type} removed successfully!`, {
        duration: 3000,
        className: 'custom-toast toast-success'
      });
      loadCurrentData();
      analyzeData();
    } else {
      toast.error(`❌ Failed to remove ${type}.`, {
        duration: 3000,
        className: 'custom-toast toast-error'
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          🧹 Data Cleanup Manager
        </h1>
        <p className="text-white/80 text-lg">
          Remove unwanted terms and duplicate acronyms from user submissions
        </p>
      </motion.div>

      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-3 gap-6 mb-8"
      >
        <div className="glass-card p-6 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-green-400 mb-2">
            {currentData.terms?.length || 0}
          </h3>
          <p className="text-white/70">Total Terms</p>
        </div>
        
        <div className="glass-card p-6 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-blue-400 mb-2">
            {currentData.acronyms?.length || 0}
          </h3>
          <p className="text-white/70">Total Acronyms</p>
        </div>
        
        <div className="glass-card p-6 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-red-400 mb-2">
            {(problematicEntries?.summary.testTermsCount || 0) + (problematicEntries?.summary.duplicateAcronymsCount || 0)}
          </h3>
          <p className="text-white/70">Issues Found</p>
        </div>
      </motion.div>

      {/* Problematic Entries */}
      {problematicEntries && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Test Terms */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <MagnifyingGlassIcon className="h-6 w-6 mr-2" />
                Test Terms ({problematicEntries.testTerms.length})
              </h3>
              
              {problematicEntries.testTerms.length > 0 ? (
                <div className="space-y-3">
                  {problematicEntries.testTerms.map((term) => (
                    <div key={term.id} className="bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white">{term.term}</h4>
                          <p className="text-white/70 text-sm">{term.category}</p>
                          <p className="text-white/60 text-xs">{term.submittedDate}</p>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleRemoveSpecific('term', term.id)}
                          className="text-red-400 hover:text-red-300 p-2"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <p className="text-white/70">No test terms found!</p>
                </div>
              )}
            </div>

            {/* Duplicate Acronyms */}
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <MagnifyingGlassIcon className="h-6 w-6 mr-2" />
                Duplicate Acronyms ({problematicEntries.duplicateAcronyms.length})
              </h3>
              
              {problematicEntries.duplicateAcronyms.length > 0 ? (
                <div className="space-y-3">
                  {problematicEntries.duplicateAcronyms.map((dup, index) => (
                    <div key={index} className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold text-white">
                            {dup.duplicate.acronym} - {dup.duplicate.fullName}
                          </h4>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveSpecific('acronym', dup.duplicate.id)}
                            className="text-yellow-400 hover:text-yellow-300 p-2"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </motion.button>
                        </div>
                        <p className="text-white/60 text-xs">
                          Duplicate of: {dup.original.acronym} - {dup.original.fullName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <p className="text-white/70">No duplicate acronyms found!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Cleanup Preview */}
      {previewData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-2xl mb-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Cleanup Preview</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-white mb-2">Current Counts</h4>
              <p className="text-white/70">Terms: {previewData.currentCount.terms}</p>
              <p className="text-white/70">Acronyms: {previewData.currentCount.acronyms}</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">After Cleanup</h4>
              <p className="text-green-400">Terms: {previewData.afterCleanup.terms}</p>
              <p className="text-green-400">Acronyms: {previewData.afterCleanup.acronyms}</p>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-white mb-2">What will be removed:</h4>
            <p className="text-red-400">
              {previewData.toRemove.terms.length} test terms, {previewData.toRemove.acronyms.length} duplicate acronyms
            </p>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCleanup}
          disabled={isLoading || (!problematicEntries?.summary.testTermsCount && !problematicEntries?.summary.duplicateAcronymsCount)}
          className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
            isLoading || (!problematicEntries?.summary.testTermsCount && !problematicEntries?.summary.duplicateAcronymsCount)
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-500 to-orange-500 hover:shadow-lg'
          } text-white flex items-center space-x-2 mx-auto`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              <span>Cleaning...</span>
            </>
          ) : (
            <>
              <TrashIcon className="h-5 w-5" />
              <span>Clean Up Data</span>
            </>
          )}
        </motion.button>

        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { loadCurrentData(); analyzeData(); }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300"
          >
            Refresh Analysis
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => userSubmissionService.resetToFileData()}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-all duration-300"
          >
            Reset to File Data
          </motion.button>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 glass-card p-6 rounded-2xl"
      >
        <h3 className="text-lg font-bold text-white mb-3">How This Works</h3>
        <ul className="space-y-2 text-white/80 text-sm">
          <li>• <strong>Test Terms:</strong> Removes any terms containing "test" (case-insensitive)</li>
          <li>• <strong>Duplicate Acronyms:</strong> Keeps the first occurrence, removes subsequent duplicates</li>
          <li>• <strong>Safe Operation:</strong> Preview before cleanup, individual removal options available</li>
          <li>• <strong>Automatic Sync:</strong> Updates localStorage and file data simultaneously</li>
        </ul>
      </motion.div>
    </div>
  );
}

export default DataCleanupManager;
