import { GoogleGenerativeAI } from '@google/generative-ai';
import { jargonData } from '../data/jargonData';
import { userSubmissionService } from './userSubmissionService';

// Initialize Google Generative AI
// TODO: Replace "YOUR_GEMINI_KEY" with your actual Gemini API key
// Get your API key from: https://aistudio.google.com/app/apikey
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_KEY");

// Prepare jargon context for AI
const prepareJargonContext = () => {
  try {
    // Official terms
    const termsText = jargonData.terms
      .map(item => `${item.term}: ${item.definition}`)
      .join('\n');
    
    const acronymsText = jargonData.acronyms
      ? jargonData.acronyms
          .map(item => `${item.acronym}: ${item.full_name}`)
          .join('\n')
      : '';
    
    const examplesText = jargonData.terms
      .filter(item => item.example)
      .map(item => item.example)
      .join('\n');

    // User-submitted terms (approved only) - with error handling
    let userTermsText = '';
    let userAcronymsText = '';
    
    try {
      const userContext = userSubmissionService.getContextForTranslation();
      userTermsText = userContext.userTermsText || '';
      userAcronymsText = userContext.userAcronymsText || '';
    } catch (userError) {
      console.warn('Warning: Could not load user submissions for translation context:', userError);
      // Continue without user submissions
    }
    
    return {
      termsText,
      acronymsText,
      examplesText,
      userTermsText,
      userAcronymsText,
      combinedTermsText: [termsText, acronymsText, userTermsText, userAcronymsText]
        .filter(text => text.trim().length > 0)
        .join('\n')
    };
  } catch (error) {
    console.error('Error preparing jargon context:', error);
    // Return basic context if there's an error
    return {
      termsText: '',
      acronymsText: '',
      examplesText: '',
      userTermsText: '',
      userAcronymsText: '',
      combinedTermsText: 'leverage, synergy, optimize, facilitate, deliverables, stakeholders, alignment'
    };
  }
};

export const translateToJargon = async (plainText) => {
  try {
    // Check if API key is still the placeholder
    if (genAI.apiKey === "YOUR_GEMINI_KEY") {
      throw new Error('🔧 Setup Required: Please replace "YOUR_GEMINI_KEY" with your actual Gemini API key in translationService.js');
    }
    
    console.log('Starting translation to jargon for:', plainText);
    
    const context = prepareJargonContext();
    console.log('Context prepared successfully');
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: `You are a translation engine specializing in corporate consulting jargon. 
      Do not add any additional context or explanations. Only translate the provided sentences into 
      corporate consulting jargon while maintaining the original meaning.

      Reference the following terms if relevant, but feel free to improvise beyond them:

      --- Terms ---
      ${context.combinedTermsText}

      --- Examples ---
      ${context.examplesText}

      Transform the input into sophisticated corporate consulting language while keeping the core message intact.
      Use terms like: leverage, synergy, optimize, facilitate, deliverables, stakeholders, alignment, 
      circle back, deep dive, move the needle, bandwidth, actionable insights, etc.
      
      Make sure the response only contains the translated text without any additional explanations or context, 
      or any speech marks.`
    });
    
    const prompt = `Translate this plain English into corporate consulting jargon: "${plainText}"`;
    console.log('Sending prompt to AI...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    const translatedText = response.text();
    console.log('Translation successful:', translatedText);
    
    return translatedText;  } catch (error) {    console.error('Translation to jargon failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Check for API key related errors
    if (error.message && (
      error.message.includes('API_KEY_INVALID') ||
      error.message.includes('invalid API key') ||
      error.message.includes('API key not valid') ||
      error.message.includes('YOUR_GEMINI_KEY') ||
      error.message.includes('PERMISSION_DENIED') ||
      error.message.includes('Invalid API key') ||
      error.message.includes('Unauthorized') ||
      error.message.includes('401') ||
      error.message.includes('403') ||
      error.status === 401 ||
      error.status === 403
    )) {
      throw new Error('🔑 Invalid or missing API key. Please check your Gemini API configuration.');
    }
    
    // Check for quota/billing errors
    if (error.message && (
      error.message.includes('quota') ||
      error.message.includes('billing') ||
      error.message.includes('QUOTA_EXCEEDED') ||
      error.message.includes('429')
    )) {
      throw new Error('📊 API quota exceeded. Please check your Gemini API usage limits.');
    }
    
    // Check for network errors
    if (error.message && (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('timeout') ||
      error.message.includes('NETWORK_ERROR')
    )) {
      throw new Error('🌐 Network error. Please check your internet connection and try again.');
    }
    
    // Generic fallback error
    throw new Error(`❌ Translation failed: ${error.message || 'Unknown error occurred'}`);
  }
};

export const translateToPlain = async (jargonText) => {
  try {
    // Check if API key is still the placeholder
    if (genAI.apiKey === "YOUR_GEMINI_KEY") {
      throw new Error('🔧 Setup Required: Please replace "YOUR_GEMINI_KEY" with your actual Gemini API key in translationService.js');
    }
    
    console.log('Starting translation to plain English for:', jargonText);
    
    const context = prepareJargonContext();
    console.log('Context prepared successfully');
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
      systemInstruction: `You are an expert at translating corporate jargon into natural, conversational English. 
      Your goal is to make corporate speak sound like how real people actually talk in everyday conversations.

      IMPORTANT GUIDELINES:
      1. Keep the tone conversational and natural - like explaining to a friend
      2. Maintain the original sentence structure when possible
      3. Don't over-simplify - just remove the unnecessary jargon
      4. Use common, everyday words that people actually use
      5. Preserve the intent and urgency of the original message
      6. Make it sound like something a normal person would say

      Reference these jargon terms and their meanings:
      --- Terms ---
      ${context.combinedTermsText}

      TRANSLATION EXAMPLES:
      Jargon: "Let's leverage synergy to optimize our deliverables and move the needle forward."
      Natural: "Let's work together to improve our results and make real progress."

      Jargon: "We need to circle back and do a deep dive to ensure alignment."
      Natural: "We need to follow up and take a closer look to make sure we're all on the same page."

      Jargon: "I don't have bandwidth to take on additional initiatives right now."
      Natural: "I don't have time to take on any more projects right now."

      Jargon: "Let's touch base to discuss actionable insights from our stakeholder analysis."
      Natural: "Let's check in to talk about what we learned from talking to everyone involved."

      Focus on making the translation sound like natural human speech, not a dictionary definition. Make sure the
      response only contains the translated text without any additional explanations or context, or any speech marks.`
    });
    
    const prompt = `Convert this corporate jargon into natural, conversational English that sounds like how real people talk: "${jargonText}"`;
    console.log('Sending prompt to AI...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    const translatedText = response.text();
    console.log('Translation successful:', translatedText);
    
    return translatedText;  } catch (error) {    console.error('Translation to plain English failed:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Check for API key related errors
    if (error.message && (
      error.message.includes('API_KEY_INVALID') ||
      error.message.includes('invalid API key') ||
      error.message.includes('API key not valid') ||
      error.message.includes('YOUR_GEMINI_KEY') ||
      error.message.includes('PERMISSION_DENIED') ||
      error.message.includes('Invalid API key') ||
      error.message.includes('Unauthorized') ||
      error.message.includes('401') ||
      error.message.includes('403') ||
      error.status === 401 ||
      error.status === 403
    )) {
      throw new Error('🔑 Invalid or missing API key. Please check your Gemini API configuration.');
    }
    
    // Check for quota/billing errors
    if (error.message && (
      error.message.includes('quota') ||
      error.message.includes('billing') ||
      error.message.includes('QUOTA_EXCEEDED') ||
      error.message.includes('429')
    )) {
      throw new Error('📊 API quota exceeded. Please check your Gemini API usage limits.');
    }
    
    // Check for network errors
    if (error.message && (
      error.message.includes('network') ||
      error.message.includes('fetch') ||
      error.message.includes('timeout') ||
      error.message.includes('NETWORK_ERROR')
    )) {
      throw new Error('🌐 Network error. Please check your internet connection and try again.');
    }
    
    // Generic fallback error
    throw new Error(`❌ Translation failed: ${error.message || 'Unknown error occurred'}`);
  }
};
