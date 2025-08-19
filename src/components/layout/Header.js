import React from 'react';
import '../../styles/Header.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="main-header">
      <nav>
        <ul>
          <li>
            <Link to="/">
              <img src="/hexagon-static.svg" alt="Home" className="nav-logo" />
            </Link>
          </li>
        </ul>
      </nav>
  
    </header>
  );
}

export default Header; 