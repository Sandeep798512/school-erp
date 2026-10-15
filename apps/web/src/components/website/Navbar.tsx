import React, { useState } from 'react';
import { GraduationCap, LogIn, Menu, X } from 'lucide-react';

export interface NavbarProps {
  onNavigateLogin: () => void;
  onScrollTo: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateLogin, onScrollTo }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onScrollTo(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          className="flex items-center space-x-3.5 cursor-pointer group"
          onClick={() => handleNavClick('hero')}
        >
          <div className="p-2.5 bg-gradient-to-tr from-brand-600 to-blue-500 rounded-2xl shadow-lg shadow-brand-600/30 group-hover:scale-105 transition duration-300">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                ST. XAVIER'S
              </span>
              <span className="text-base sm:text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-sky-300">
                HIGH SCHOOL
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              CBSE & IB World Institution
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 text-sm font-semibold text-slate-300">
          <button onClick={() => handleNavClick('about')} className="hover:text-brand-400 transition">About</button>
          <button onClick={() => handleNavClick('academics')} className="hover:text-brand-400 transition">Academics</button>
          <button onClick={() => handleNavClick('facilities')} className="hover:text-brand-400 transition">Facilities</button>
          <button onClick={() => handleNavClick('fees')} className="hover:text-brand-400 transition">Fee Structure</button>
          <button onClick={() => handleNavClick('gallery')} className="hover:text-brand-400 transition">Campus Life</button>
          <button onClick={() => handleNavClick('admissions')} className="hover:text-brand-400 transition">Admissions</button>
          <button onClick={() => handleNavClick('news')} className="hover:text-brand-400 transition">Events</button>
          <button onClick={() => handleNavClick('contact')} className="hover:text-brand-400 transition">Contact</button>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center space-x-4">
          <button
            onClick={onNavigateLogin}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-brand-600/25 transition duration-300 hover:scale-[1.02]"
          >
            <LogIn className="h-4 w-4" />
            <span>Portal Sign In</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="lg:hidden flex items-center space-x-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3 text-sm font-medium text-slate-300">
            <button onClick={() => handleNavClick('about')} className="text-left py-2 hover:text-brand-400">About Us</button>
            <button onClick={() => handleNavClick('academics')} className="text-left py-2 hover:text-brand-400">Academics</button>
            <button onClick={() => handleNavClick('facilities')} className="text-left py-2 hover:text-brand-400">Facilities</button>
            <button onClick={() => handleNavClick('fees')} className="text-left py-2 hover:text-brand-400">Fee Structure</button>
            <button onClick={() => handleNavClick('gallery')} className="text-left py-2 hover:text-brand-400">Campus Life</button>
            <button onClick={() => handleNavClick('admissions')} className="text-left py-2 hover:text-brand-400">Admissions</button>
            <button onClick={() => handleNavClick('news')} className="text-left py-2 hover:text-brand-400">News & Events</button>
            <button onClick={() => handleNavClick('contact')} className="text-left py-2 hover:text-brand-400">Contact</button>
          </nav>
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onNavigateLogin();
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-brand-600 text-white font-bold rounded-xl shadow-lg"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In to ERP Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
