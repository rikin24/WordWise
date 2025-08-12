import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { jargonData } from '../data/jargonData';
import { userSubmissionService } from '../services/userSubmissionService';

function Dictionary() {  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [filteredUserTerms, setFilteredUserTerms] = useState([]);
  const [currentView, setCurrentView] = useState('terms');
  const [currentSection, setCurrentSection] = useState('official'); // 'official' or 'community'
  const [userSubmissions, setUserSubmissions] = useState({ terms: [], acronyms: [] });

  const allTerms = jargonData.terms;
  const allAcronyms = jargonData.acronyms;
  
  // Get user submissions on component mount and when view changes
  useEffect(() => {
    const submissions = userSubmissionService.getUserSubmissions();
    setUserSubmissions(submissions);
  }, [currentView]);
  
  const categories = ['all', ...new Set([
    ...allTerms.map(term => term.category),
    ...userSubmissions.terms.map(term => term.category)
  ].filter(Boolean))];
  
  const acronymCategories = ['all', ...new Set([
    ...allAcronyms.map(item => item.category),
    ...userSubmissions.acronyms.map(item => item.category)
  ].filter(Boolean))];
  useEffect(() => {
    filterItems();
  }, [searchTerm, selectedCategory, currentView, currentSection, userSubmissions]);const filterItems = () => {
    // Filter official items
    const officialItems = currentView === 'terms' ? allTerms : allAcronyms;
    const filteredOfficial = officialItems.filter(item => {
      const searchMatch = currentView === 'terms'
        ? item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.definition.toLowerCase().includes(searchTerm.toLowerCase())
        : item.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
      
      return searchMatch && categoryMatch;
    });

    // Filter user-submitted items
    const userItems = currentView === 'terms' ? userSubmissions.terms : userSubmissions.acronyms;
    const filteredUser = userItems.filter(item => {
      const searchMatch = currentView === 'terms'
        ? item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.definition.toLowerCase().includes(searchTerm.toLowerCase())
        : item.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
      
      return searchMatch && categoryMatch;
    });

    setFilteredTerms(filteredOfficial);
    setFilteredUserTerms(filteredUser);
  };
  const handleViewChange = (view) => {
    setCurrentView(view);
    setCurrentSection('official'); // Reset to official section when changing view
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    setSearchTerm('');
    setSelectedCategory('all');
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
          📖 Dictionary
        </h1>
        <p className="text-xl text-white/80">
          Your comprehensive guide to corporate jargon
        </p>
      </motion.div>

      {/* View Selector */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center mb-8"
      >
        <div className="glass-card p-2 rounded-xl flex space-x-2">          <button
            onClick={() => handleViewChange('terms')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentView === 'terms'
                ? 'bg-gradient-to-r from-medium-blue to-dark-blue text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            🔤 Terms ({allTerms.length + userSubmissions.terms.length})
          </button>
          <button
            onClick={() => handleViewChange('acronyms')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentView === 'acronyms'
                ? 'bg-gradient-to-r from-medium-plum to-blue-400 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            🏢 Acronyms ({allAcronyms.length + userSubmissions.acronyms.length})
          </button>        </div>
      </motion.div>

      {/* Section Selector */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center mb-8"
      >
        <div className="glass-card p-2 rounded-xl flex space-x-2">
          <button
            onClick={() => handleSectionChange('official')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentSection === 'official'
                ? 'bg-gradient-to-r from-medium-teal to-blue-400 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            📚 Official ({currentView === 'terms' ? allTerms.length : allAcronyms.length})
          </button>
          <button
            onClick={() => handleSectionChange('community')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentSection === 'community'
                ? 'bg-gradient-to-r from-medium-blue to-blue-400 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            👥 Community ({currentView === 'terms' ? userSubmissions.terms.length : userSubmissions.acronyms.length})
          </button>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-2xl mb-8"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
            <input
              type="text"
              placeholder={`Search ${currentView}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
            >
              {(currentView === 'terms' ? categories : acronymCategories).map(category => (
                <option key={category} value={category} className="bg-gray-800">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>        {/* Results Count */}
        <div className="mt-4 text-center">
          <span className="text-white/70 text-sm">
            {currentSection === 'official' ? (
              <>Showing {filteredTerms.length} of {currentView === 'terms' ? allTerms.length : allAcronyms.length} official {currentView}</>
            ) : (
              <>Showing {filteredUserTerms.length} of {currentView === 'terms' ? userSubmissions.terms.length : userSubmissions.acronyms.length} community {currentView}</>
            )}
          </span>
        </div>
      </motion.div>      {/* Results Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid gap-4"
      >
        {((currentSection === 'official' ? filteredTerms : filteredUserTerms).length === 0) ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-2xl text-center"
          >
            <div className="text-6xl mb-4">
              {currentSection === 'community' ? '👥' : '🔍'}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {currentSection === 'community' ? 'No community submissions yet' : 'No results found'}
            </h3>
            <p className="text-white/70">
              {currentSection === 'community' 
                ? 'Be the first to contribute! Visit the Submit Term page to add your own jargon.'
                : 'Try adjusting your search terms or category filter'
              }
            </p>
          </motion.div>
        ) : (
          (currentSection === 'official' ? filteredTerms : filteredUserTerms).map((item, index) => (            <motion.div
              key={`${currentSection}-${currentView}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`glass-card p-6 rounded-2xl card-hover ${
                currentSection === 'community' 
                  ? 'border border-light-blue/30 bg-gradient-to-br from-light-blue/5 to-medium-blue/5' 
                  : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {currentView === 'terms' ? item.term : item.acronym}
                    </h3>
                    {item.category && (
                      <span className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                        {item.category}
                      </span>
                    )}
                    {currentSection === 'community' && (
                      <span className="bg-gradient-to-r from-light-blue/20 to-medium-blue/20 text-light-blue px-3 py-1 rounded-full text-sm border border-light-blue/30 flex items-center gap-1">
                        👥 Community
                      </span>
                    )}
                    {currentSection === 'community' && item.status === 'pending' && (
                      <span className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-200 px-3 py-1 rounded-full text-sm border border-yellow-500/30 flex items-center gap-1">
                        ⏳ Pending
                      </span>
                    )}
                    {currentSection === 'community' && item.status === 'approved' && (
                      <span className="bg-gradient-to-r from-medium-teal/20 to-light-teal/20 text-light-teal px-3 py-1 rounded-full text-sm border border-medium-teal/30 flex items-center gap-1">
                        ✅ Approved
                      </span>
                    )}
                    {currentSection === 'community' && item.submittedDate && (
                      <span className="bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-200 px-3 py-1 rounded-full text-sm border border-gray-500/30">
                        📅 {item.submittedDate}
                      </span>
                    )}
                  </div>

                  <p className="text-lg text-white/90 mb-4 leading-relaxed">
                    {currentView === 'terms' ? item.definition : item.full_name}
                  </p>

                  {currentView === 'terms' && item.example && (
                    <div className="glass-card p-4 rounded-xl bg-white/5">
                      <p className="text-white/70 text-sm mb-2">💡 Example:</p>
                      <p className="text-white/90 text-sm italic">
                        "{item.example}"
                      </p>
                    </div>
                  )}

                  {currentView === 'terms' && item.funny_literal && (
                    <div className="mt-4 glass-card p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                      <p className="text-yellow-200 text-sm mb-2">😄 Funny interpretation:</p>
                      <p className="text-yellow-100 text-sm">
                        {item.funny_literal}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-medium-teal to-blue-400 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                    onClick={() => {
                      navigator.clipboard.writeText(currentView === 'terms' ? item.term : `${item.acronym} - ${item.full_name}`);
                      // You could add a toast here
                    }}
                  >
                    📋 Copy
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>      {/* Footer Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 glass-card p-6 rounded-2xl text-center"
      >
        <h3 className="text-lg font-bold text-white mb-4">📊 Dictionary Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div>
            <p className="text-2xl font-bold text-white">{allTerms.length}</p>
            <p className="text-white/70 text-sm">Official Terms</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{allAcronyms.length}</p>
            <p className="text-white/70 text-sm">Official Acronyms</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-teal-500">{userSubmissions.terms.length}</p>
            <p className="text-white/70 text-sm">Community Terms</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-teal-500">{userSubmissions.acronyms.length}</p>
            <p className="text-white/70 text-sm">Community Acronyms</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{categories.length - 1}</p>
            <p className="text-white/70 text-sm">Categories</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {allTerms.filter(t => t.example).length + userSubmissions.terms.filter(t => t.example).length}
            </p>
            <p className="text-white/70 text-sm">With Examples</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Dictionary;
