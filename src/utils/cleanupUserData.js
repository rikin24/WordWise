// Utility to clean up user submitted data
// This utility helps remove unwanted terms like "Test" and duplicate acronyms like "WIP"

import { userSubmissionService } from '../services/userSubmissionService';

class UserDataCleanup {
  constructor() {
    this.cleanupRules = {
      // Terms to remove (case-insensitive)
      unwantedTerms: ['test'],
      // Acronyms to remove duplicates of (case-insensitive)
      duplicateAcronyms: ['wip', 'wfh', 'asap'] // Common ones that might get duplicated
    };
  }

  // Check if a term should be removed
  shouldRemoveTerm(term) {
    const termLower = term.toLowerCase().trim();
    return this.cleanupRules.unwantedTerms.some(unwanted => 
      termLower === unwanted || termLower.includes(unwanted)
    );
  }

  // Check if an acronym is a duplicate
  isDuplicateAcronym(acronym, existingAcronyms) {
    const acronymLower = acronym.toLowerCase().trim();
    return existingAcronyms.some(existing => 
      existing.acronym.toLowerCase().trim() === acronymLower
    );
  }

  // Clean up terms - remove test terms and other unwanted entries
  cleanTerms(terms) {
    const cleaned = terms.filter(term => {
      if (this.shouldRemoveTerm(term.term)) {
        console.log(`Removing unwanted term: "${term.term}"`);
        return false;
      }
      return true;
    });

    console.log(`Cleaned terms: ${terms.length} -> ${cleaned.length}`);
    return cleaned;
  }

  // Clean up acronyms - remove duplicates, keeping the first occurrence
  cleanAcronyms(acronyms) {
    const seen = new Set();
    const cleaned = [];

    acronyms.forEach(acronym => {
      const key = acronym.acronym.toLowerCase().trim();
      
      if (seen.has(key)) {
        console.log(`Removing duplicate acronym: "${acronym.acronym}"`);
      } else {
        seen.add(key);
        cleaned.push(acronym);
      }
    });

    console.log(`Cleaned acronyms: ${acronyms.length} -> ${cleaned.length}`);
    return cleaned;
  }

  // Main cleanup function
  cleanupUserData() {
    console.log('Starting user data cleanup...');
    
    // Get current data
    const currentData = userSubmissionService.getUserSubmissions();
    
    // Clean terms and acronyms
    const cleanedTerms = this.cleanTerms(currentData.terms || []);
    const cleanedAcronyms = this.cleanAcronyms(currentData.acronyms || []);
    
    // Create cleaned data object
    const cleanedData = {
      ...currentData,
      terms: cleanedTerms,
      acronyms: cleanedAcronyms,
      // Update version to trigger localStorage sync
      version: `${currentData.version}-cleaned`
    };

    // Save cleaned data
    const success = userSubmissionService.saveUserSubmissions(cleanedData);
    
    if (success) {
      console.log('✅ User data cleaned successfully!');
      return {
        success: true,
        removed: {
          terms: (currentData.terms?.length || 0) - cleanedTerms.length,
          acronyms: (currentData.acronyms?.length || 0) - cleanedAcronyms.length
        },
        data: cleanedData
      };
    } else {
      console.error('❌ Failed to save cleaned data');
      return { success: false, error: 'Failed to save cleaned data' };
    }
  }

  // Preview what would be cleaned without actually cleaning
  previewCleanup() {
    const currentData = userSubmissionService.getUserSubmissions();
    
    const termsToRemove = (currentData.terms || []).filter(term => 
      this.shouldRemoveTerm(term.term)
    );
    
    const acronymsToRemove = [];
    const seen = new Set();
    (currentData.acronyms || []).forEach(acronym => {
      const key = acronym.acronym.toLowerCase().trim();
      if (seen.has(key)) {
        acronymsToRemove.push(acronym);
      } else {
        seen.add(key);
      }
    });

    return {
      currentCount: {
        terms: currentData.terms?.length || 0,
        acronyms: currentData.acronyms?.length || 0
      },
      toRemove: {
        terms: termsToRemove,
        acronyms: acronymsToRemove
      },
      afterCleanup: {
        terms: (currentData.terms?.length || 0) - termsToRemove.length,
        acronyms: (currentData.acronyms?.length || 0) - acronymsToRemove.length
      }
    };
  }

  // Remove specific term by ID
  removeTerm(termId) {
    const currentData = userSubmissionService.getUserSubmissions();
    const updatedTerms = currentData.terms.filter(term => term.id !== termId);
    
    const updatedData = {
      ...currentData,
      terms: updatedTerms
    };

    return userSubmissionService.saveUserSubmissions(updatedData);
  }

  // Remove specific acronym by ID
  removeAcronym(acronymId) {
    const currentData = userSubmissionService.getUserSubmissions();
    const updatedAcronyms = currentData.acronyms.filter(acronym => acronym.id !== acronymId);
    
    const updatedData = {
      ...currentData,
      acronyms: updatedAcronyms
    };

    return userSubmissionService.saveUserSubmissions(updatedData);
  }

  // Find duplicates and test entries
  findProblematicEntries() {
    const currentData = userSubmissionService.getUserSubmissions();
    
    // Find test terms
    const testTerms = (currentData.terms || []).filter(term => 
      this.shouldRemoveTerm(term.term)
    );

    // Find duplicate acronyms
    const acronymMap = new Map();
    const duplicateAcronyms = [];
    
    (currentData.acronyms || []).forEach(acronym => {
      const key = acronym.acronym.toLowerCase().trim();
      if (acronymMap.has(key)) {
        duplicateAcronyms.push({
          original: acronymMap.get(key),
          duplicate: acronym
        });
      } else {
        acronymMap.set(key, acronym);
      }
    });

    return {
      testTerms,
      duplicateAcronyms,
      summary: {
        testTermsCount: testTerms.length,
        duplicateAcronymsCount: duplicateAcronyms.length
      }
    };
  }
}

// Export singleton instance
export const userDataCleanup = new UserDataCleanup();

// Export class for custom instances
export default UserDataCleanup;
