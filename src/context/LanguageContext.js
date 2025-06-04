// // src/context/LanguageContext.js
// import React, { createContext, useContext, useState, useEffect } from 'react';

// const LanguageContext = createContext();

// const SUPPORTED_LANGUAGES = {
//   'en': { name: 'English', code: 'en' },
//   'es': { name: 'Español', code: 'es' },
//   'fr': { name: 'Français', code: 'fr' },
//   'de': { name: 'Deutsch', code: 'de' },
//   'pt': { name: 'Português', code: 'pt' },
//   'it': { name: 'Italiano', code: 'it' },
//   'ja': { name: '日本語', code: 'ja' },
//   'zh': { name: '中文', code: 'zh-cn' },
//   'ru': { name: 'Русский', code: 'ru' }
// };

// export function LanguageProvider({ children }) {
//   const [currentLanguage, setCurrentLanguage] = useState(() => {
//     // Check localStorage first, then browser, then default to English
//     const saved = localStorage.getItem('selectedLanguage');
//     if (saved && SUPPORTED_LANGUAGES[saved]) return saved;
    
//     const browserLang = navigator.language.split('-')[0];
//     return SUPPORTED_LANGUAGES[browserLang] ? browserLang : 'en';
//   });

//   useEffect(() => {
//     localStorage.setItem('selectedLanguage', currentLanguage);
//   }, [currentLanguage]);

//   return (
//     <LanguageContext.Provider value={{ 
//       currentLanguage, 
//       setCurrentLanguage, 
//       SUPPORTED_LANGUAGES 
//     }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// }

// export const useLanguage = () => useContext(LanguageContext);