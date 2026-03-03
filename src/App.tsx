import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FacebookCallbackPage } from './pages/Facebookcallbackpage';
import { PrestataireDashboard } from './pages/PrestataireDashboard';
import { ClientInterface } from './pages/ClientInterface';
// Landing Page Components
import { Navbar } from './components/LandingPage/Navbar';
import { HeroSection } from './components/LandingPage/HeroSection';
import { ServiceCategories } from './components/LandingPage/ServiceCategories';
import { HowItWorks } from './components/LandingPage/HowItWorks';
import { FeaturedProfessionals } from './components/LandingPage/FeaturedProfessionals';
import { Testimonials } from './components/LandingPage/Testimonials';
import { CTASection } from './components/LandingPage/CTASection';
import { Footer } from './components/LandingPage/Footer';
import { ProgressBar } from './components/LandingPage/ProgressBar';
import { HeroSearch } from './components/LandingPage/Search';

function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.reveal, .stagger-children').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <ProgressBar />
      <Navbar />
      <main>
        <HeroSearch />
        <HeroSection />
        <ServiceCategories />
        <HowItWorks />
        <FeaturedProfessionals />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

export function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-client-id';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/facebook/callback" element={<FacebookCallbackPage />} />

            {/* Client dashboard */}
            <Route path="/dashboard/client" element={<ClientInterface />} />

            {/* Prestataire dashboard */}
            <Route path="/dashboard/prestataire" element={<PrestataireDashboard />} />
            <Route path="/dashboard/prestataire/*" element={<PrestataireDashboard />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
           
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}