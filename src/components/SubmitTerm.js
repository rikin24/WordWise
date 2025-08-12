import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon, CheckIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { userSubmissionService } from '../services/userSubmissionService';

function SubmitTerm() {
  const [formData, setFormData] = useState({
    term: '',
    definition: '',
    example: '',
    category: '',
    funnyLiteral: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    'Strategy',
    'Communication',
    'Analysis',
    'Resources',
    'Metrics',
    'Finance',
    'Management',
    'Technology',
    'Process',
    'Innovation',
    'Planning',
    'Project Management',
    'Team',
    'Business',
    'Other'
  ];  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Use the user submission service
    const submittedTerm = userSubmissionService.submitTerm({
      term: formData.term,
      definition: formData.definition,
      example: formData.example,
      category: formData.category,
      funny_literal: formData.funnyLiteral
    });

    if (submittedTerm) {
      console.log('Submitted term:', submittedTerm);
      toast.success('🎉 Term submitted successfully!');
      setIsSubmitted(true);
    } else {
      toast.error('❌ Failed to submit term. Please try again.');
    }
    
    setIsSubmitting(false);
    
    // Reset form after a delay
    setTimeout(() => {
      setFormData({
        term: '',
        definition: '',
        example: '',
        category: '',
        funnyLiteral: ''
      });
      setIsSubmitted(false);
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-12 rounded-2xl text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Thank You!
          </h2>
          <p className="text-xl text-white/80 mb-6">
            Your term has been submitted for review. We appreciate your contribution to the community!
          </p>
          <div className="glass-card p-4 rounded-xl bg-green-500/20 border border-green-500/30">
            <p className="text-green-200 text-sm">
              📋 Term: <strong>{formData.term}</strong>
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          ➕ Submit Term
        </h1>
        <p className="text-xl text-white/80">
          Help grow our corporate jargon database!
        </p>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid md:grid-cols-2 gap-6 mb-8"
      >
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-3">🎯 Why Contribute?</h3>
          <ul className="space-y-2 text-white/80 text-sm">
            <li>• Help fellow colleagues decode corporate speak</li>
            <li>• Share your expertise and insights</li>
            <li>• Build a comprehensive learning resource</li>
            <li>• Get recognized as a community contributor</li>
          </ul>
        </div>
        
        <div className="glass-card p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-3">📝 Submission Guidelines</h3>
          <ul className="space-y-2 text-white/80 text-sm">
            <li>• Use clear, professional definitions</li>
            <li>• Provide real workplace examples</li>
            <li>• Keep it appropriate and helpful</li>
            <li>• Add humor if you want (optional field)</li>
          </ul>
        </div>
      </motion.div>

      {/* Submission Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8 rounded-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Term */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Corporate Term/Phrase *
            </label>
            <input
              type="text"
              name="term"
              value={formData.term}
              onChange={handleChange}
              placeholder="e.g., Circle back, Low-hanging fruit"
              required
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" className="bg-gray-800">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category} className="bg-gray-800">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Definition */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Professional Definition *
            </label>
            <textarea
              name="definition"
              value={formData.definition}
              onChange={handleChange}
              placeholder="Provide a clear, professional definition of the term..."
              required
              rows={3}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Example */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Example Usage *
            </label>
            <textarea
              name="example"
              value={formData.example}
              onChange={handleChange}
              placeholder="Provide a realistic example of how this term is used in workplace context..."
              required
              rows={2}
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Funny Literal */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Funny Literal Interpretation (Optional) 😄
            </label>
            <input
              type="text"
              name="funnyLiteral"
              value={formData.funnyLiteral}
              onChange={handleChange}
              placeholder="e.g., For 'Circle back': A circular office layout designed to improve communication"
              className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-white/60 text-sm mt-2">
              Add a humorous literal interpretation to make learning more fun!
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
              className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                isSubmitting
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-medium-teal to-blue-400 hover:shadow-lg'
              } text-white flex items-center space-x-2`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-5 w-5" />
                  <span>Submit Term</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* Review Process */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 glass-card p-6 rounded-2xl"
      >
        <h3 className="text-lg font-bold text-white mb-4 text-center">
          📋 What Happens Next?
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl mb-2">📝</div>
            <h4 className="font-semibold text-white mb-2">1. Review</h4>
            <p className="text-white/70 text-sm">
              Our team reviews your submission for quality and appropriateness
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">✅</div>
            <h4 className="font-semibold text-white mb-2">2. Approval</h4>
            <p className="text-white/70 text-sm">
              Approved terms are added to the main dictionary
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2">🏆</div>
            <h4 className="font-semibold text-white mb-2">3. Recognition</h4>
            <p className="text-white/70 text-sm">
              Contributors get special badges and recognition
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default SubmitTerm;
