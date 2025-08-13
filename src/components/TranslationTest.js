// Simple translation test to debug the issue
import React, { useState } from 'react';
import { translateToJargon, translateToPlain } from '../services/translationService';
import toast from 'react-hot-toast';

async function testTranslation() {
  try {
    console.log('Testing translation service...');
    
    // Test simple translation
    const plainText = 'I need to finish this project';
    console.log('Input:', plainText);
    
    const jargonResult = await translateToJargon(plainText);
    console.log('Jargon result:', jargonResult);
    
    const plainResult = await translateToPlain('We need to leverage synergy to optimize deliverables');
    console.log('Plain result:', plainResult);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Auto-run test when component mounts
export default function TranslationTest() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState([]);
  const runTest = async () => {
    setIsRunning(true);
    try {
      const plainText = 'I need to finish this project';
      const result1 = await translateToJargon(plainText);
      
      const jargonText = 'We need to leverage synergy to optimize deliverables';
      const result2 = await translateToPlain(jargonText);
      
      setResults([
        { input: plainText, output: result1, type: 'to-jargon' },
        { input: jargonText, output: result2, type: 'to-plain' }
      ]);
    } catch (error) {
      // Provide user-friendly error message
      let friendlyError = error.message;
      if (error.message.includes('Setup Required')) {
        friendlyError = '🔧 Please configure your Gemini API key to test translation features.';
      } else if (error.message.includes('Invalid or missing API key')) {
        friendlyError = '🔑 Invalid API key. Please check your Gemini API configuration.';
      }
      setResults([{ error: friendlyError }]);
    }
    setIsRunning(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Translation Test</h2>
      <button 
        onClick={runTest}
        disabled={isRunning}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {isRunning ? 'Testing...' : 'Run Translation Test'}
      </button>
      
      <div className="space-y-4">
        {results.map((result, index) => (
          <div key={index} className="bg-white/10 p-4 rounded">
            {result.error ? (
              <div className="text-red-400">Error: {result.error}</div>
            ) : (
              <>
                <div className="text-white/70">Input ({result.type}):</div>
                <div className="text-white mb-2">{result.input}</div>
                <div className="text-white/70">Output:</div>
                <div className="text-green-400">{result.output}</div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
