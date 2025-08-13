import React from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function ErrorTestDemo() {
  const testSetupError = () => {
    toast.error('🔧 Setup Required\nPlease configure your Gemini API key to use translation features.', {
      duration: 8000,
      className: 'custom-toast toast-info',
      style: {
        background: 'transparent',
        border: 'none',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        backdropFilter: 'blur(16px)',
        color: '#eff6ff',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '1.4'
      }
    });
  };

  const testApiError = () => {
    toast.error('🔑 Invalid or missing API key. Please check your Gemini API configuration.', {
      duration: 6000,
      className: 'custom-toast toast-error',
      style: {
        background: 'transparent',
        border: 'none',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        backdropFilter: 'blur(16px)',
        color: '#fef2f2',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '1.4'
      }
    });
  };

  const testQuotaError = () => {
    toast.error('📊 API quota exceeded. Please check your Gemini API usage limits.', {
      duration: 6000,
      className: 'custom-toast toast-warning',
      style: {
        background: 'transparent',
        border: 'none',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        backdropFilter: 'blur(16px)',
        color: '#fffbeb',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '1.4'
      }
    });
  };

  const testNetworkError = () => {
    toast.error('🌐 Network error. Please check your internet connection and try again.', {
      duration: 4000,
      className: 'custom-toast toast-info',
      style: {
        background: 'transparent',
        border: 'none',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        backdropFilter: 'blur(16px)',
        color: '#eff6ff',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '1.4'
      }
    });
  };

  const testSuccessMessage = () => {
    toast.success('Translation completed!', {
      duration: 3000,
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
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          🎨 Glassmorphism Toast Demo
        </h1>
        <p className="text-xl text-white/80">
          Test the new beautiful error messages with glassmorphism effects
        </p>
      </motion.div>

      <div className="glass-card p-8 rounded-2xl">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Try Different Error Types</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={testSetupError}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold"
          >
            🔧 Test Setup Required
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={testApiError}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-4 rounded-xl font-semibold"
          >
            🔑 Test API Key Error
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={testQuotaError}
            className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-4 rounded-xl font-semibold"
          >
            📊 Test Quota Error
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={testNetworkError}
            className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold"
          >
            🌐 Test Network Error
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={testSuccessMessage}
            className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-4 rounded-xl font-semibold md:col-span-2"
          >
            ✅ Test Success Message
          </motion.button>
        </div>

        <div className="mt-8 p-4 bg-white/10 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-3">✨ Features:</h3>
          <ul className="text-white/80 space-y-2">
            <li>• 🌟 Beautiful glassmorphism effects with blur and transparency</li>
            <li>• 🎨 Color-coded error types (info, error, warning, success)</li>
            <li>• 📱 Responsive design that works on all devices</li>
            <li>• 🔥 Smooth animations and hover effects</li>
            <li>• 🎯 User-friendly messages with clear icons and instructions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ErrorTestDemo;
