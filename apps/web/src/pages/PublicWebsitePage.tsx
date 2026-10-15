import React from 'react';
import { Navbar } from '../components/website/Navbar';
import { HeroSection } from '../components/website/HeroSection';
import { PrincipalMessage } from '../components/website/PrincipalMessage';
import { AcademicsSection } from '../components/website/AcademicsSection';
import { FacilitiesSection } from '../components/website/FacilitiesSection';
import { CampusLifeGallery } from '../components/website/CampusLifeGallery';
import { TestimonialsSection } from '../components/website/TestimonialsSection';
import { AdmissionsSection } from '../components/website/AdmissionsSection';
import { NewsEventsSection } from '../components/website/NewsEventsSection';
import { ContactSection } from '../components/website/ContactSection';
import { Footer } from '../components/website/Footer';
import { useScrollReveal } from '../hooks/useScrollReveal';

export interface PublicWebsitePageProps {
  onNavigateLogin: () => void;
}

export const PublicWebsitePage: React.FC<PublicWebsitePageProps> = ({ onNavigateLogin }) => {
  // Activate automatic scroll entrance animations
  useScrollReveal();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-brand-500 selection:text-white">
      <Navbar onNavigateLogin={onNavigateLogin} onScrollTo={scrollToSection} />
      
      <main>
        <HeroSection
          onApplyNow={() => scrollToSection('admissions')}
          onExploreERP={onNavigateLogin}
        />
        <PrincipalMessage />
        <AcademicsSection />
        <FacilitiesSection />
        <CampusLifeGallery />
        <TestimonialsSection />
        <AdmissionsSection />
        <NewsEventsSection />
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
};
