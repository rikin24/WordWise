import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { jargonData } from '../data/jargonData';

function Dictionary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredTerms, setFilteredTerms] = useState([]);
  const [currentView, setCurrentView] = useState('terms');

  const allTerms = jargonData.terms;
  const allAcronyms = jargonData.acronyms;
  
  const categories = ['all', ...new Set(allTerms.map(term => term.category).filter(Boolean))];
  const acronymCategories = ['all', ...new Set(allAcronyms.map(item => item.category).filter(Boolean))];

  useEffect(() => {
    filterItems();
  }, [searchTerm, selectedCategory, currentView]);

  const filterItems = () => {
    const items = currentView === 'terms' ? allTerms : allAcronyms;
    
    let filtered = items.filter(item => {
      const searchMatch = currentView === 'terms'
        ? item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.definition.toLowerCase().includes(searchTerm.toLowerCase())
        : item.acronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.full_name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const categoryMatch = selectedCategory === 'all' || item.category === selectedCategory;
      
      return searchMatch && categoryMatch;
    });

    setFilteredTerms(filtered);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
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
        <div className="glass-card p-2 rounded-xl flex space-x-2">
          <button
            onClick={() => handleViewChange('terms')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentView === 'terms'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            🔤 Terms ({allTerms.length})
          </button>
          <button
            onClick={() => handleViewChange('acronyms')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              currentView === 'acronyms'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            🏢 Acronyms ({allAcronyms.length})
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
        </div>

        {/* Results Count */}
        <div className="mt-4 text-center">
          <span className="text-white/70 text-sm">
            Showing {filteredTerms.length} of {currentView === 'terms' ? allTerms.length : allAcronyms.length} {currentView}
          </span>
        </div>
      </motion.div>

      {/* Results Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid gap-4"
      >
        {filteredTerms.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 rounded-2xl text-center"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
            <p className="text-white/70">
              Try adjusting your search terms or category filter
            </p>
          </motion.div>
        ) : (
          filteredTerms.map((item, index) => (
            <motion.div
              key={`${currentView}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="glass-card p-6 rounded-2xl card-hover"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl md:text-2xl font-bold text-white">
                      {currentView === 'terms' ? item.term : item.acronym}
                    </h3>
                    {item.category && (
                      <span className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 px-3 py-1 rounded-full text-sm border border-blue-500/30">
                        {item.category}
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
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
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
      </motion.div>

      {/* Footer Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-12 glass-card p-6 rounded-2xl text-center"
      >
        <h3 className="text-lg font-bold text-white mb-4">📊 Dictionary Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-2xl font-bold text-white">{allTerms.length}</p>
            <p className="text-white/70 text-sm">Total Terms</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{allAcronyms.length}</p>
            <p className="text-white/70 text-sm">Acronyms</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{categories.length - 1}</p>
            <p className="text-white/70 text-sm">Categories</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">
              {allTerms.filter(t => t.example).length}
            </p>
            <p className="text-white/70 text-sm">With Examples</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Dictionary;
