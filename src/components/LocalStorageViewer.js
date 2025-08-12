import React, { useState, useEffect } from 'react';
import { userSubmissionService } from '../services/userSubmissionService';

function LocalStorageViewer() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const currentData = userSubmissionService.getUserSubmissions();
    setData(currentData);
  }, []);

  const exportToFile = () => {
    if (data) {
      const exportData = {
        terms: data.terms,
        acronyms: data.acronyms
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'userSubmittedData.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Current localStorage Data</h1>
      
      <button 
        onClick={exportToFile}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Export to File
      </button>
      
      {data ? (
        <div className="bg-gray-800 p-4 rounded text-white">
          <h2 className="text-xl mb-2">Terms: {data.terms.length}</h2>
          <pre className="text-sm overflow-auto max-h-96 mb-4">
            {JSON.stringify(data.terms, null, 2)}
          </pre>
          
          <h2 className="text-xl mb-2">Acronyms: {data.acronyms.length}</h2>
          <pre className="text-sm overflow-auto max-h-96">
            {JSON.stringify(data.acronyms, null, 2)}
          </pre>
        </div>
      ) : (
        <p className="text-white">Loading...</p>
      )}
    </div>
  );
}

export default LocalStorageViewer;
