import React from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import './language-handler.css';
//import './LanguageSelector.css';

const LanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage, SUPPORTED_LANGUAGES } = useAnalysis();

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setCurrentLanguage(newLanguage);
  };

  return (
    <select 
      value={currentLanguage} 
      onChange={handleLanguageChange}
      className="language-selector"
    >
      {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
        <option key={code} value={code}>
          {lang.name}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;