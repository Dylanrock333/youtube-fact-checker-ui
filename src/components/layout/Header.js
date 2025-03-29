import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { ReactComponent as SunIcon } from '../../assets/sun-icon.svg';
import { ReactComponent as MoonIcon } from '../../assets/moon-icon.svg';
import '../../styles/Header.css';

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="main-header">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === 'dark' ? (
          <>
            <SunIcon className="theme-icon" />
            <span>Light</span>
          </>
        ) : (
          <>
            <MoonIcon className="theme-icon" />
            <span>Dark</span>
          </>
        )}
      </button>
    </header>
  );
}

export default Header; 