import React from 'react';
import '../../styles/Footer.css';  // Added CSS import
import { useTranslation } from '../../translation/useTranslation';
function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="main-footer">
      <p>© 2025 Video Claim Catcher. {t('footer.copyright')} <a href="/contact">{t('footer.contact')}</a></p>
    </footer>
  );
}

export default Footer; 