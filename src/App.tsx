import React, { useEffect } from 'react';
import { Navbar } from './components/LandingPage/Navbar';
import { HeroSection } from './components/LandingPage/HeroSection';
import { ServiceCategories } from './components/LandingPage/ServiceCategories';
import { HowItWorks } from './components/LandingPage/HowItWorks';
import { FeaturedProfessionals } from './components/LandingPage/FeaturedProfessionals';
import { Testimonials } from './components/LandingPage/Testimonials';
import { CTASection } from './components/LandingPage/CTASection';
import { Footer } from './components/LandingPage/Footer';
import { ProgressBar } from './components/LandingPage/ProgressBar';

export function App() {
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
