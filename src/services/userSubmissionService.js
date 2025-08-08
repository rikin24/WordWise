// User submission service for handling user-submitted terms
import { userSubmittedData } from '../data/userSubmittedData';

class UserSubmissionService {
  constructor() {
    // Use localStorage as persistent storage simulation
    this.storageKey = 'userSubmittedTerms';
    this.initializeStorage();
  }

  initializeStorage() {
    const existingData = localStorage.getItem(this.storageKey);
    if (!existingData) {
      localStorage.setItem(this.storageKey, JSON.stringify(userSubmittedData));
    }
  }

  getUserSubmissions() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : userSubmittedData;
    } catch (error) {
      console.error('Error reading user submissions:', error);
      return userSubmittedData;
    }
  }

  saveUserSubmissions(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving user submissions:', error);
      return false;
    }
  }

  submitTerm(termData) {
    const submissions = this.getUserSubmissions();
    
    const newTerm = {
      ...termData,
      id: `user_${Date.now()}`,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    submissions.terms.push(newTerm);
    return this.saveUserSubmissions(submissions) ? newTerm : null;
  }

  submitAcronym(acronymData) {
    const submissions = this.getUserSubmissions();
    
    const newAcronym = {
      ...acronymData,
      id: `user_${Date.now()}`,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    submissions.acronyms.push(newAcronym);
    return this.saveUserSubmissions(submissions) ? newAcronym : null;
  }

  getApprovedTerms() {
    const submissions = this.getUserSubmissions();
    return submissions.terms.filter(term => term.status === 'approved');
  }

  getApprovedAcronyms() {
    const submissions = this.getUserSubmissions();
    return submissions.acronyms.filter(acronym => acronym.status === 'approved');
  }

  getPendingTerms() {
    const submissions = this.getUserSubmissions();
    return submissions.terms.filter(term => term.status === 'pending');
  }

  getPendingAcronyms() {
    const submissions = this.getUserSubmissions();
    return submissions.acronyms.filter(acronym => acronym.status === 'pending');
  }

  // For admin functionality (future use)
  approveTerm(termId) {
    const submissions = this.getUserSubmissions();
    const term = submissions.terms.find(t => t.id === termId);
    if (term) {
      term.status = 'approved';
      return this.saveUserSubmissions(submissions);
    }
    return false;
  }

  rejectTerm(termId) {
    const submissions = this.getUserSubmissions();
    const term = submissions.terms.find(t => t.id === termId);
    if (term) {
      term.status = 'rejected';
      return this.saveUserSubmissions(submissions);
    }
    return false;
  }

  // Get combined context for translation service
  getContextForTranslation() {
    const approvedTerms = this.getApprovedTerms();
    const approvedAcronyms = this.getApprovedAcronyms();

    const termsText = approvedTerms
      .map(item => `${item.term}: ${item.definition}`)
      .join('\n');
    
    const acronymsText = approvedAcronyms
      .map(item => `${item.acronym}: ${item.full_name}`)
      .join('\n');
    
    return {
      userTermsText: termsText,
      userAcronymsText: acronymsText,
      userCombinedText: termsText + '\n' + acronymsText
    };
  }
}

// Export singleton instance
export const userSubmissionService = new UserSubmissionService();
