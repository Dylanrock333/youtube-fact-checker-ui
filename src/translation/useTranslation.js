import { useAnalysis } from '../context/AnalysisContext';
import { en } from './language';
import { es } from './language';
import { fr } from './language';
import { de } from './language';
import { pt } from './language';
import { it } from './language';
import { ja } from './language';
import { zh } from './language';
import { ru } from './language';
// Import other language files as needed

const translations = {
  en,
  es,
  fr,
  de,
  pt,
  it,
  ja,
  zh,
  ru,
};

export const useTranslation = () => {
  const { currentLanguage } = useAnalysis();
  
  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[currentLanguage] || translations.en;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (!value) {
      // Fallback to English if translation not found
      value = translations.en;
      for (const k of keys) {
        value = value?.[k];
      }
    }
    
    if (!value) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    // Replace parameters in the string (e.g., {time} -> actual time)
    return Object.keys(params).reduce((str, param) => {
      return str.replace(`{${param}}`, params[param]);
    }, value);
  };
  
  return { t, currentLanguage };
};