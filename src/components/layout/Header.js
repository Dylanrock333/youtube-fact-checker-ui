import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ReactComponent as SunIcon } from '../../assets/sun-icon.svg';
import { ReactComponent as MoonIcon } from '../../assets/moon-icon.svg';
import '../../styles/Header.css';
import LanguageSelector from '../items/language-handler';
import { useTranslation } from '../../translation/useTranslation';
import Analytics from '../../utils/analytics';
function Header() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const handleNavClick = (destination) => {
    Analytics.trackNavigation(destination, 'header');
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    Analytics.trackFeatureUse('theme_toggle', 'toggle', {
      from_theme: theme,
      to_theme: newTheme
    });
    toggleTheme();
  };

  return (
    <header className="main-header">
      <nav>
        <ul>
          <li><Link to="/" onClick={() => handleNavClick('home')}>{t('nav.home')}</Link></li>
          <li><Link to="/about" onClick={() => handleNavClick('about')}>{t('nav.about')}</Link></li>
          <li><LanguageSelector /></li>
        </ul>
      </nav>
      <button onClick={handleThemeToggle} className={`theme-toggle`}>
        {theme === 'dark' ? (
          <div className="theme-icon">
            <SunIcon style={{fill: 'black', stroke: 'black'}} />
          </div>
        ) : (
          <div className="theme-icon">
            <MoonIcon style={{fill: 'black', stroke: 'black'}} />
          </div>
        )}
      </button>
    </header>
  );
}

export default Header; 