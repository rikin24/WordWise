// Utility to extract current localStorage data for userSubmittedData
// Run this in browser console to get current data

function extractUserSubmissions() {
  const storageKey = 'userSubmittedTerms';
  const data = localStorage.getItem(storageKey);
  
  if (data) {
    const parsed = JSON.parse(data);
    console.log('Current localStorage data:');
    console.log(JSON.stringify(parsed, null, 2));
    return parsed;
  } else {
    console.log('No data found in localStorage');
    return null;
  }
}

// Call this function in browser console
// extractUserSubmissions();

export default extractUserSubmissions;
