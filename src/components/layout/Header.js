import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/Header.css';

function Header() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="main-header">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
        </ul>
      </nav>
      <button onClick={toggleTheme} className="theme-toggle">
        {isDarkMode ? '☀️ Light' : '🌙 Dark'}
      </button>
    </header>
  );
}

export default Header; 