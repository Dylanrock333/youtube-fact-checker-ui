import React from 'react';
import '../../styles/Footer.css';  // Added CSS import
import packageJson from '../../../package.json';

function Footer() {
  return (
    <footer className="main-footer">
      <p>© 2025 Verofyi. All rights reserved. <a href="/contact">Contact Us</a> | v{packageJson.version}</p>
    </footer>
  );
}

export default Footer; 