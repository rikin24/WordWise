import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowsRightLeftIcon,
  PaperAirplaneIcon,
  ClipboardDocumentIcon,
  SpeakerWaveIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../context/AppContext';
import { translateToJargon, translateToPlain } from '../services/translationService';
import toast from 'react-hot-toast';

function Translator() {
  const { state } = useApp();
  const [translationMode, setTranslationMode] = useState('toJargon'); // 'toJargon' or 'toPlain'
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const translateText = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter some text to translate');
      return;
    }

    setIsLoading(true);
    try {
      let translatedText;
      
      if (translationMode === 'toJargon') {
        translatedText = await translateToJargon(inputText);
      } else {
        translatedText = await translateToPlain(inputText);
      }
      
      setOutputText(translatedText);
      
      // Add to history
      const newEntry = {
        id: Date.now(),
        input: inputText,
        output: translatedText,
        mode: translationMode,
        timestamp: new Date().toLocaleTimeString()
      };
      setHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 translations
      
      toast.success('Translation completed!');
    } catch (error) {
      console.error('Translation error:', error);
      toast.error(error.message || 'Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      toast.error('Text-to-speech not supported in your browser');
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
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
          🔄 Jargon Translator
        </h1>
        <p className="text-xl text-white/80">
          Convert between corporate jargon and plain English
        </p>
      </motion.div>

      {/* Translation Mode Selector */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex justify-center mb-8"
      >
        <div className="glass-card p-2 rounded-xl flex space-x-2">
          <button
            onClick={() => setTranslationMode('toJargon')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
              translationMode === 'toJargon'
                ? 'bg-gradient-to-r from-medium-blue to-dark-blue text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🗣️ Plain → Jargon</span>
          </button>
          <button
            onClick={() => setTranslationMode('toPlain')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
              translationMode === 'toPlain'
                ? 'bg-gradient-to-r from-medium-plum to-dark-plum text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>🔧 Jargon → Plain</span>
          </button>
        </div>
      </motion.div>

      {/* Translation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <span>{translationMode === 'toJargon' ? '📝' : '🏢'}</span>
            <span>{translationMode === 'toJargon' ? 'Plain English' : 'Corporate Jargon'}</span>
          </h3>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={translationMode === 'toJargon' 
              ? "Enter plain English text to convert to corporate jargon..."
              : "Enter corporate jargon to convert to plain English..."
            }
            className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <div className="flex justify-between items-center mt-4">
            <span className="text-white/60 text-sm">
              {inputText.length}/500 characters
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={translateText}
              disabled={isLoading || !inputText.trim()}
              className="bg-gradient-to-r from-medium-blue to-medium-plum text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  <span>Translating...</span>
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-4 w-4" />
                  <span>Translate</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Output Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-6 rounded-2xl"
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <ArrowsRightLeftIcon className="h-5 w-5" />
            <span>{translationMode === 'toJargon' ? 'Corporate Jargon' : 'Plain English'}</span>
          </h3>
          <div className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-lg text-white overflow-y-auto">
            {outputText || (
              <span className="text-white/50 italic">
                Translation will appear here...
              </span>
            )}
          </div>
          {outputText && (
            <div className="flex space-x-2 mt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(outputText)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2"
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
                <span>Copy</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => speakText(outputText)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2"
              >
                <SpeakerWaveIcon className="h-4 w-4" />
                <span>Speak</span>
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Examples */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-2xl mb-8"
      >
        <h3 className="text-xl font-semibold text-white mb-4">💡 Quick Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {translationMode === 'toJargon' ? (
            <>
              <button
                onClick={() => setInputText("Let's have a quick meeting to fix this problem.")}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-left text-white/90 transition-colors"
              >
                "Let's have a quick meeting to fix this problem."
              </button>
              <button
                onClick={() => setInputText("We need to check our progress and make improvements.")}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-left text-white/90 transition-colors"
              >
                "We need to check our progress and make improvements."
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setInputText("Let's leverage synergy to optimize our deliverables and move the needle forward.")}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-left text-white/90 transition-colors"
              >
                "Let's leverage synergy to optimize our deliverables..."
              </button>
              <button
                onClick={() => setInputText("We need to circle back and do a deep dive to ensure alignment.")}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-lg text-left text-white/90 transition-colors"
              >
                "We need to circle back and do a deep dive..."
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Translation History */}
      <AnimatePresence>
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6 rounded-2xl"
          >
            <h3 className="text-xl font-semibold text-white mb-4">📜 Recent Translations</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {history.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 bg-white/10 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-white/60">
                      {entry.mode === 'toJargon' ? '🗣️ → 🏢' : '🏢 → 🗣️'} | {entry.timestamp}
                    </span>
                  </div>
                  <div className="text-sm text-white/80 mb-1">
                    <strong>Input:</strong> {entry.input}
                  </div>
                  <div className="text-sm text-white/90">
                    <strong>Output:</strong> {entry.output}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Translator;
