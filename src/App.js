import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AnalysisProvider } from './context/AnalysisContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import DeepSearchPage from './pages/DeepSearchPage';
import './styles/App.css';

function AppContent() {
  const { isDarkMode } = useTheme();
  
  return (
    <Router>
      <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/deep-search" element={<DeepSearchPage />} />
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

export default App; 