import React, { useState, useEffect } from 'react';
import { userSubmissionService } from '../services/userSubmissionService';
import { userSubmittedData } from '../data/userSubmittedData';

function DebugUserData() {
  const [localStorageData, setLocalStorageData] = useState(null);
  const [serviceData, setServiceData] = useState(null);

  useEffect(() => {
    // Get data directly from localStorage
    const rawData = localStorage.getItem('userSubmittedTerms');
    setLocalStorageData(rawData ? JSON.parse(rawData) : null);
    
    // Get data from service
    setServiceData(userSubmissionService.getUserSubmissions());
  }, []);
  const handleReset = () => {
    userSubmissionService.resetToFileData();
    setServiceData(userSubmissionService.getUserSubmissions());
    const rawData = localStorage.getItem('userSubmittedTerms');
    setLocalStorageData(rawData ? JSON.parse(rawData) : null);
  };

  const handleClearLocalStorage = () => {
    localStorage.removeItem('userSubmittedTerms');
    // Force service to reinitialize
    userSubmissionService.initializeStorage();
    setServiceData(userSubmissionService.getUserSubmissions());
    setLocalStorageData(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Debug User Data</h1>
        <button 
        onClick={handleReset}
        className="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-4"
      >
        Reset to File Data
      </button>
      
      <button 
        onClick={handleClearLocalStorage}
        className="mb-4 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
      >
        Clear localStorage & Reinitialize
      </button>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* File Data */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold text-white mb-2">File Data (userSubmittedData.js)</h2>          <div className="text-white text-sm">
            <p>Version: {userSubmittedData.version}</p>
            <p>Terms: {userSubmittedData.terms.length}</p>
            <p>Acronyms: {userSubmittedData.acronyms.length}</p>
            {userSubmittedData.terms.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Term Statuses:</p>
                {userSubmittedData.terms.map(term => (
                  <p key={term.id} className="text-xs">
                    {term.term}: {term.status}
                  </p>
                ))}
              </div>
            )}
            {userSubmittedData.acronyms.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Acronym Statuses:</p>
                {userSubmittedData.acronyms.map(acronym => (
                  <p key={acronym.id} className="text-xs">
                    {acronym.acronym}: {acronym.status}
                  </p>
                ))}
              </div>
            )}
          </div>
          <pre className="text-xs text-green-300 mt-2 overflow-auto max-h-64">
            {JSON.stringify(userSubmittedData, null, 2)}
          </pre>
        </div>

        {/* localStorage Data */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold text-white mb-2">localStorage Data</h2>          <div className="text-white text-sm">
            <p>Version: {localStorageData?.version || 'None'}</p>
            <p>Terms: {localStorageData?.terms?.length || 0}</p>
            <p>Acronyms: {localStorageData?.acronyms?.length || 0}</p>
            {localStorageData?.terms?.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Term Statuses:</p>
                {localStorageData.terms.map(term => (
                  <p key={term.id} className="text-xs">
                    {term.term}: {term.status}
                  </p>
                ))}
              </div>
            )}
            {localStorageData?.acronyms?.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Acronym Statuses:</p>
                {localStorageData.acronyms.map(acronym => (
                  <p key={acronym.id} className="text-xs">
                    {acronym.acronym}: {acronym.status}
                  </p>
                ))}
              </div>
            )}
          </div>
          <pre className="text-xs text-blue-300 mt-2 overflow-auto max-h-64">
            {localStorageData ? JSON.stringify(localStorageData, null, 2) : 'No data'}
          </pre>
        </div>

        {/* Service Data */}
        <div className="bg-gray-800 p-4 rounded">
          <h2 className="text-xl font-bold text-white mb-2">Service Data</h2>          <div className="text-white text-sm">
            <p>Version: {serviceData?.version || 'None'}</p>
            <p>Terms: {serviceData?.terms?.length || 0}</p>
            <p>Acronyms: {serviceData?.acronyms?.length || 0}</p>
            {serviceData?.terms?.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Term Statuses:</p>
                {serviceData.terms.map(term => (
                  <p key={term.id} className="text-xs">
                    {term.term}: {term.status}
                  </p>
                ))}
              </div>
            )}
            {serviceData?.acronyms?.length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Acronym Statuses:</p>
                {serviceData.acronyms.map(acronym => (
                  <p key={acronym.id} className="text-xs">
                    {acronym.acronym}: {acronym.status}
                  </p>
                ))}
              </div>
            )}
          </div>
          <pre className="text-xs text-yellow-300 mt-2 overflow-auto max-h-64">
            {serviceData ? JSON.stringify(serviceData, null, 2) : 'No data'}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default DebugUserData;
