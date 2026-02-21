import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Landing page components
import { Navbar } from './components/LandingPage/Navbar';
import { HeroSection } from './components/LandingPage/HeroSection';
import { ServiceCategories } from './components/LandingPage/ServiceCategories';
import { HowItWorks } from './components/LandingPage/HowItWorks';
import { FeaturedProfessionals } from './components/LandingPage/FeaturedProfessionals';
import { Testimonials } from './components/LandingPage/Testimonials';
import { CTASection } from './components/LandingPage/CTASection';
import { Footer } from './components/LandingPage/Footer';
import { ProgressBar } from './components/LandingPage/ProgressBar';

// Auth
import { LoginPage } from './pages/LoginPage';

// Client pages
import { ClientDashboard } from './pages/client/ClientDashboard';
import { ClientSearch } from './pages/client/ClientSearch';
import { ClientReservations } from './pages/client/ClientReservations';
import { ClientProfile } from './pages/client/ClientProfile';

// Prestataire pages
import { PrestataireDashboard } from './pages/prestataire/PrestataireDashboard';
import { PrestataireProfile } from './pages/prestataire/PrestataireProfile';
import { PrestataireReservations } from './pages/prestataire/PrestataireReservations';
import { PrestatataireTariffs } from './pages/prestataire/PrestatataireTariffs';
import { PrestataireReviews } from './pages/prestataire/PrestataireReviews';

function LandingPage() {
  // Scroll reveal functionality
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
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Landing page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />

          {/* Client routes */}
          <Route
            path="/client"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/search"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/reservations"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientReservations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/profile"
            element={
              <ProtectedRoute requiredRole="client">
                <ClientProfile />
              </ProtectedRoute>
            }
          />

          {/* Prestataire routes */}
          <Route
            path="/prestataire"
            element={
              <ProtectedRoute requiredRole="prestataire">
                <PrestataireDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prestataire/profile"
            element={
              <ProtectedRoute requiredRole="prestataire">
                <PrestataireProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prestataire/reservations"
            element={
              <ProtectedRoute requiredRole="prestataire">
                <PrestataireReservations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prestataire/tariffs"
            element={
              <ProtectedRoute requiredRole="prestataire">
                <PrestatataireTariffs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prestataire/reviews"
            element={
              <ProtectedRoute requiredRole="prestataire">
                <PrestataireReviews />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
