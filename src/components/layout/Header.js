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
        </ul>
      </nav>
      <button onClick={toggleTheme} className={`theme-toggle`}>
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