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
      // No localStorage data, initialize with file data
      localStorage.setItem(this.storageKey, JSON.stringify(userSubmittedData));
    } else {
      // Check if localStorage version matches file version
      try {
        const parsed = JSON.parse(existingData);
        if (!parsed.version || parsed.version !== userSubmittedData.version) {
          // Version mismatch, merge file data with any new localStorage submissions
          const mergedData = this.mergeFileWithLocalStorage(parsed);
          localStorage.setItem(this.storageKey, JSON.stringify(mergedData));
        }
      } catch (error) {
        // Corrupted localStorage, reset with file data
        localStorage.setItem(this.storageKey, JSON.stringify(userSubmittedData));
      }
    }
  }

  mergeFileWithLocalStorage(localData) {
    // Start with file data as base
    const merged = { ...userSubmittedData };
    
    if (localData.terms) {
      // Keep any new submissions that aren't in the file
      const fileTermIds = new Set(userSubmittedData.terms.map(t => t.id));
      const newLocalTerms = localData.terms.filter(t => !fileTermIds.has(t.id));
      merged.terms = [...userSubmittedData.terms, ...newLocalTerms];
    }
    
    if (localData.acronyms) {
      // Keep any new submissions that aren't in the file
      const fileAcronymIds = new Set(userSubmittedData.acronyms.map(a => a.id));
      const newLocalAcronyms = localData.acronyms.filter(a => !fileAcronymIds.has(a.id));
      merged.acronyms = [...userSubmittedData.acronyms, ...newLocalAcronyms];
    }
    
    return merged;
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

  approveAcronym(acronymId) {
    const submissions = this.getUserSubmissions();
    const acronym = submissions.acronyms.find(a => a.id === acronymId);
    if (acronym) {
      acronym.status = 'approved';
      return this.saveUserSubmissions(submissions);
    }
    return false;
  }

  rejectAcronym(acronymId) {
    const submissions = this.getUserSubmissions();
    const acronym = submissions.acronyms.find(a => a.id === acronymId);
    if (acronym) {
      acronym.status = 'rejected';
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
      .map(item => `${item.acronym}: ${item.fullName}`)
      .join('\n');
    
    return {
      userTermsText: termsText,
      userAcronymsText: acronymsText,
      userCombinedText: termsText + '\n' + acronymsText
    };
  }
  // Method to reset localStorage with current file data (useful for development)
  resetToFileData() {
    localStorage.setItem(this.storageKey, JSON.stringify(userSubmittedData));
    return userSubmittedData;
  }

  // Method to get a summary of current data
  getDataSummary() {
    const submissions = this.getUserSubmissions();
    return {
      totalTerms: submissions.terms.length,
      approvedTerms: submissions.terms.filter(t => t.status === 'approved').length,
      pendingTerms: submissions.terms.filter(t => t.status === 'pending').length,
      totalAcronyms: submissions.acronyms.length,
      approvedAcronyms: submissions.acronyms.filter(a => a.status === 'approved').length,
      pendingAcronyms: submissions.acronyms.filter(a => a.status === 'pending').length
    };
  }
}

// Export singleton instance
export const userSubmissionService = new UserSubmissionService();
