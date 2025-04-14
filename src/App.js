import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AnalysisProvider } from './context/AnalysisContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import DeepSearchPage from './pages/DeepSearchPage';
import AnalysisPage from './pages/AnalysisPage';
import './styles/App.css';

function AppContent() {
  const { theme } = useTheme();
  
  return (
    <Router>
      <div className={`App ${theme}`}>
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

//TODO: save content of the video analysis unless there is a refresh or a new video is uploaded 
//TODO: when I refresh the page the theme goes to light mode. keep it to whatever the theme was last

export default App; 