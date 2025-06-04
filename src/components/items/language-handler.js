import React from 'react';
import { useAnalysis } from '../../context/AnalysisContext';
import '../../styles/LanguageSelector.css';
//import './LanguageSelector.css';

const LanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage, SUPPORTED_LANGUAGES } = useAnalysis();

  return (
    <select 
      value={currentLanguage} 
      onChange={(e) => setCurrentLanguage(e.target.value)}
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