import { GoogleGenerativeAI } from '@google/generative-ai';
import { jargonData } from '../data/jargonData';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyA2h30rLiYuSgzB13zJEwSpie1w3Wlyui8");

// Prepare jargon context for AI
const prepareJargonContext = () => {
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
  
  return {
    termsText,
    acronymsText,
    examplesText,
    combinedTermsText: termsText + '\n' + acronymsText
  };
};

export const translateToJargon = async (plainText) => {
  try {
    const context = prepareJargonContext();
    
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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Translation to jargon failed:', error);
    throw new Error('Failed to translate to corporate jargon. Please try again.');
  }
};

export const translateToPlain = async (jargonText) => {
  try {
    const context = prepareJargonContext();
    
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
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Translation to plain English failed:', error);
    throw new Error('Failed to translate to plain English. Please try again.');
  }
};
