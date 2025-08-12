import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userSubmissionService } from '../services/userSubmissionService';

function UserSubmissionTest() {
  const [submissions, setSubmissions] = useState({ terms: [], acronyms: [] });  const [testTerm, setTestTerm] = useState({
    term: 'Synergize',
    definition: 'To work together in a way that produces an effect greater than the sum of individual efforts',
    example: 'Let\'s synergize our cross-functional capabilities to optimize deliverables.',
    category: 'Strategy',
    funny_literal: 'When everyone agrees to pretend they understand what everyone else is doing'
  });

  const [testAcronym, setTestAcronym] = useState({
    acronym: 'ASAP',
    fullName: 'As Soon As Possible',
    definition: 'Indicates something needs to be done with high priority and urgency',
    example: 'Please review this document ASAP.',
    category: 'Time Management',
    funny_literal: 'As Slow As Practical (because that\'s usually what happens)'
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

  const addTestAcronym = () => {
    const result = userSubmissionService.submitAcronym(testAcronym);
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
    data.acronyms.forEach(acronym => {
      if (acronym.status === 'pending') {
        userSubmissionService.approveAcronym(acronym.id);
      }
    });
    loadSubmissions();
  };

  const resetToFileData = () => {
    userSubmissionService.resetToFileData();
    loadSubmissions();
  };

  const getDataSummary = () => {
    return userSubmissionService.getDataSummary();
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
              className="w-full bg-gradient-to-r from-medium-teal to-dark-teal text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Add Test Term
            </button>
            
            <button
              onClick={addTestAcronym}
              className="w-full bg-gradient-to-r from-medium-blue to-dark-blue text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Add Test Acronym
            </button>
            
            <button
              onClick={approveAllPending}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Approve All Pending
            </button>
            
            <button
              onClick={loadSubmissions}
              className="w-full bg-gradient-to-r from-medium-plum to-dark-plum text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Refresh Data
            </button>

            <button
              onClick={resetToFileData}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              Reset to File Data
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Test Term Preview</h3>
              <div className="text-sm text-white/80 space-y-1">
                <p><strong>Term:</strong> {testTerm.term}</p>
                <p><strong>Category:</strong> {testTerm.category}</p>
                <p><strong>Definition:</strong> {testTerm.definition.substring(0, 50)}...</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Test Acronym Preview</h3>
              <div className="text-sm text-white/80 space-y-1">
                <p><strong>Acronym:</strong> {testAcronym.acronym}</p>
                <p><strong>Full Name:</strong> {testAcronym.fullName}</p>
                <p><strong>Category:</strong> {testAcronym.category}</p>
              </div>
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
            </div>            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-yellow-400">
                  {submissions.acronyms.filter(a => a.status === 'pending').length}
                </p>
                <p className="text-white/70 text-sm">Pending Acronyms</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-green-400">
                  {submissions.acronyms.filter(a => a.status === 'approved').length}
                </p>
                <p className="text-white/70 text-sm">Approved Acronyms</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Submissions */}      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 glass-card p-6 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-white mb-4">Recent Submissions</h2>
        
        {submissions.terms.length === 0 && submissions.acronyms.length === 0 ? (
          <p className="text-white/70 text-center py-8">No submissions yet. Add a test term or acronym to get started!</p>
        ) : (
          <div className="space-y-6">
            {/* Recent Terms */}
            {submissions.terms.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Recent Terms</h3>
                <div className="space-y-3">
                  {submissions.terms.slice(-3).reverse().map((term, index) => (
                    <div key={term.id || index} className="bg-white/5 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white">{term.term}</h4>
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
              </div>
            )}

            {/* Recent Acronyms */}
            {submissions.acronyms.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Recent Acronyms</h3>
                <div className="space-y-3">
                  {submissions.acronyms.slice(-3).reverse().map((acronym, index) => (
                    <div key={acronym.id || index} className="bg-white/5 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white">{acronym.acronym} - {acronym.fullName}</h4>
                          <p className="text-white/80 text-sm">{acronym.definition.substring(0, 100)}...</p>
                          <p className="text-white/60 text-xs mt-1">
                            {acronym.category} • {acronym.submittedDate}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          acronym.status === 'pending' 
                            ? 'bg-yellow-500/20 text-yellow-300' 
                            : acronym.status === 'approved'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-red-500/20 text-red-300'
                        }`}>
                          {acronym.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default UserSubmissionTest;
