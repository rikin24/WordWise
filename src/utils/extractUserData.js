// This script extracts localStorage data and formats it for userSubmittedData.js
// Run this in the browser console to get the current localStorage data

function extractAndFormatUserSubmissions() {
  const storageKey = 'userSubmittedTerms';
  const data = localStorage.getItem(storageKey);
  
  if (!data) {
    console.log('No localStorage data found');
    return null;
  }
  
  try {
    const parsed = JSON.parse(data);
    
    // Format the data for userSubmittedData.js
    const formattedData = {
      terms: parsed.terms || [],
      acronyms: parsed.acronyms || []
    };
    
    // Generate the file content
    const fileContent = `export const userSubmittedData = ${JSON.stringify(formattedData, null, 2)};`;
    
    console.log('=== COPY THIS CONTENT TO userSubmittedData.js ===');
    console.log(fileContent);
    console.log('=== END OF CONTENT ===');
    
    // Also create a downloadable file
    const blob = new Blob([fileContent], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'userSubmittedData.js';
    a.click();
    URL.revokeObjectURL(url);
    
    return formattedData;
  } catch (error) {
    console.error('Error parsing localStorage data:', error);
    return null;
  }
}

// Run the extraction
extractAndFormatUserSubmissions();
