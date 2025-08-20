import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AnalysisProvider } from './context/AnalysisContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import DeepSearchPage from './pages/DeepSearchPage';
import AnalysisPage from './pages/AnalysisPage';
import Contact from './pages/Contact';
import './styles/App.css';

// Create a ScrollToTop component that uses the useLocation hook
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Only scroll to top on home page, not on deep-search or analysis pages
    if (pathname === '/') {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  
  return null;
}


function AppContent() {
  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/deep-search" element={<DeepSearchPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AnalysisProvider>
        <AppContent />
      </AnalysisProvider>
    </ThemeProvider>    
  );
}


export default App; 