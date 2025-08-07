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
      circle back, deep dive, move the needle, bandwidth, actionable insights, etc.`
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
      systemInstruction: `You are a translation engine that converts corporate consulting jargon into 
      simple, plain English. Do not add any additional context or explanations. Only translate the 
      provided sentences into clear, everyday language while maintaining the original meaning.

      Reference the following terms to understand their meanings:

      --- Terms ---
      ${context.combinedTermsText}

      Convert complex corporate language into simple, understandable English that anyone can understand.
      Replace jargon terms with their plain English equivalents:
      - synergy → working together
      - leverage → use
      - optimize → improve
      - facilitate → help
      - deliverables → things to complete
      - stakeholders → people involved
      - alignment → agreement
      - circle back → talk about later
      - deep dive → detailed look
      - move the needle → make progress
      - bandwidth → time/capacity
      - actionable insights → useful information`
    });
    
    const prompt = `Translate this corporate jargon into plain English: "${jargonText}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text();
  } catch (error) {
    console.error('Translation to plain English failed:', error);
    throw new Error('Failed to translate to plain English. Please try again.');
  }
};
