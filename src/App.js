import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AnalysisProvider } from './context/AnalysisContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import DeepSearchPage from './pages/DeepSearchPage';
import AnalysisPage from './pages/AnalysisPage';
import './styles/App.css';

// Create a ScrollToTop component that uses the useLocation hook
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

function AppContent() {
  const { theme } = useTheme();
  
  return (
    <Router>
      <div className={`App ${theme}`}>
        {/* Add the ScrollToTop component inside Router */}
        <ScrollToTop />
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/deep-search" element={<DeepSearchPage />} />
            <Route path="/analysis-page" element={<AnalysisPage />} />
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