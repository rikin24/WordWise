import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userSubmissionService } from '../services/userSubmissionService';

function UserSubmissionTest() {
  const [submissions, setSubmissions] = useState({ terms: [], acronyms: [] });
  const [testTerm, setTestTerm] = useState({
    term: 'Synergize',
    definition: 'To work together in a way that produces an effect greater than the sum of individual efforts',
    example: 'Let\'s synergize our cross-functional capabilities to optimize deliverables.',
    category: 'Strategy',
    funnyLiteral: 'When everyone agrees to pretend they understand what everyone else is doing'
  });

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    const data = userSubmissionService.getUserSubmissions();
    setSubmissions(data);
  };

  const addTestTerm = () => {
    const result = userSubmissionService.submitTerm(testTerm);
    if (result) {
      loadSubmissions();
    }
  };

  const approveAllPending = () => {
    const data = userSubmissionService.getUserSubmissions();
    data.terms.forEach(term => {
      if (term.status === 'pending') {
        userSubmissionService.approveTerm(term.id);
      }
    });
    loadSubmissions();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          🧪 User Submission Test
        </h1>
        <p className="text-white/80">
          Test the user submission system functionality
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Test Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Test Actions</h2>
          
          <div className="space-y-4">
            <button
              onClick={addTestTerm}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Add Test Term
            </button>
            
            <button
              onClick={approveAllPending}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Approve All Pending
            </button>
            
            <button
              onClick={loadSubmissions}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Refresh Data
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-2">Test Term Preview</h3>
            <div className="text-sm text-white/80 space-y-1">
              <p><strong>Term:</strong> {testTerm.term}</p>
              <p><strong>Category:</strong> {testTerm.category}</p>
              <p><strong>Definition:</strong> {testTerm.definition.substring(0, 50)}...</p>
            </div>
          </div>
        </motion.div>

        {/* Submission Stats */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h2 className="text-xl font-bold text-white mb-4">Submission Stats</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">{submissions.terms.length}</p>
                <p className="text-white/70 text-sm">Total Terms</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{submissions.acronyms.length}</p>
                <p className="text-white/70 text-sm">Total Acronyms</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-yellow-400">
                  {submissions.terms.filter(t => t.status === 'pending').length}
                </p>
                <p className="text-white/70 text-sm">Pending Terms</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-green-400">
                  {submissions.terms.filter(t => t.status === 'approved').length}
                </p>
                <p className="text-white/70 text-sm">Approved Terms</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Submissions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 glass-card p-6 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-white mb-4">Recent Submissions</h2>
        
        {submissions.terms.length === 0 ? (
          <p className="text-white/70 text-center py-8">No submissions yet. Add a test term to get started!</p>
        ) : (
          <div className="space-y-3">
            {submissions.terms.slice(-5).reverse().map((term, index) => (
              <div key={term.id || index} className="bg-white/5 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{term.term}</h3>
                    <p className="text-white/80 text-sm">{term.definition.substring(0, 100)}...</p>
                    <p className="text-white/60 text-xs mt-1">
                      {term.category} • {term.submittedDate}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    term.status === 'pending' 
                      ? 'bg-yellow-500/20 text-yellow-300' 
                      : term.status === 'approved'
                      ? 'bg-green-500/20 text-green-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {term.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default UserSubmissionTest;
