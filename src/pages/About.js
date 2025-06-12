import React from 'react';
import '../styles/About.css';  // Added CSS import
import { useTranslation } from '../translation/useTranslation';
function About() {
  const { t } = useTranslation();
  return (
    <div className="page-content">
      <h1>{t('nav.about')}</h1>
      
      <div className="about-intro">
        {t('about.intro')}
      </div>

      <div className="about-section">
        <p>
          {t('about.aboutSection')}
        </p>

        <p>
          {t('about.aboutSection2')}
        </p>

        <p>
          {t('about.aboutSection3')}
        </p>

        <p> 
          {t('about.aboutSection4')}
        </p>
      </div>
    </div>
  );
}

export default About; 