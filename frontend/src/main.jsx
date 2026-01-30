import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './i18n'; // Initialize i18n
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import About from './pages/About';
import Faq from './pages/Faq';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import TikTokCPMCalculator from './pages/TikTokCPMCalculator';
import TikTokEngagementCalculator from './pages/TikTokEngagementCalculator';
import './index.css';

const App = () => (
  <BrowserRouter>
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/tiktok-cpm-calculator" element={<TikTokCPMCalculator />} />
          <Route path="/tiktok-engagement-calculator" element={<TikTokEngagementCalculator />} />
        </Routes>
      </main>
      <Footer />
    </div>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

