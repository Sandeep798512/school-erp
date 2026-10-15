import React, { useState, useEffect } from 'react';
import { ArrowRight, Award, Users, School, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { School3DBackground } from './School3DBackground';

export interface HeroSectionProps {
  onApplyNow: () => void;
  onExploreERP: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onApplyNow, onExploreERP }) => {
  // Dynamic Typewriter Effect
  const typingWords = [
    'Global Leaders',
    'Future Innovators',
    'Academic Champions',
    'Tech Pioneers',
    'Inspiring Visionaries',
  ];

  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = typingWords[wordIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayText !== currentWord) {
      timer = setTimeout(() => {
        setDisplayText(currentWord.slice(0, displayText.length + 1));
      }, 95);
    } else if (!isDeleting && displayText === currentWord) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 1900);
    } else if (isDeleting && displayText !== '') {
      timer = setTimeout(() => {
        setDisplayText(currentWord.slice(0, displayText.length - 1));
      }, 50);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % typingWords.length);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex]);

  return (
    <section id="hero" className="relative min-h-[86vh] flex items-center justify-center bg-slate-950 overflow-hidden py-8 sm:py-12 lg:py-14">
      {/* 3D Atmospheric Video & Interactive Particle Canvas Background */}
      <School3DBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Live Announcement Ticker */}
        <div className="flex justify-center mb-6 lg:mb-8 scroll-reveal">
          <div className="inline-flex items-center space-x-3 px-4 py-1.5 sm:py-2 rounded-full bg-slate-900/90 border border-brand-500/30 text-xs text-slate-300 shadow-xl backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-brand-400 uppercase tracking-wider text-[10px] sm:text-[11px]">
              Admissions Open 2026-27
            </span>
            <span className="text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-300">CBSE & IB World School Accreditation</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          </div>
        </div>

        {/* 2-Column Hero Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-5 lg:space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Shaping Tomorrow's{' '}
              <span className="inline-block min-h-[1.15em] text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-400">
                {displayText}
                <span className="inline-block w-0.5 sm:w-1 h-[0.82em] ml-1 bg-sky-400 animate-pulse align-middle shadow-lg shadow-sky-400/50" />
              </span>{' '}
              Through Excellence
            </h1>

            <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Experience India's premier multi-campus educational institution. Combining 
              rigorous academic foundation, AI-driven digital classrooms, world-class athletic facilities, 
              and an integrated cloud ERP portal for 60,000+ students.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
              <button
                onClick={onApplyNow}
                className="group relative flex items-center justify-center space-x-2.5 px-6 sm:px-7 py-3.5 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-xl shadow-brand-600/30 hover:shadow-brand-600/50 hover:scale-[1.02] transition duration-300 text-sm sm:text-base"
              >
                <span>Apply For Admission 2026</span>
                <ArrowRight className="h-4.5 w-4.5 group-hover:translate-x-1 transition duration-300" />
              </button>

              <button
                onClick={onExploreERP}
                className="flex items-center justify-center space-x-2 px-6 sm:px-7 py-3.5 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 text-slate-200 font-semibold rounded-xl backdrop-blur-sm transition duration-300 hover:scale-[1.02] text-sm sm:text-base"
              >
                <ShieldCheck className="h-4.5 w-4.5 text-brand-400" />
                <span>Explore ERP Portal</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 sm:pt-3 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Ranked #1 K-12 Institution</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>100% University Placement</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>35+ Global STEM Awards</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Image Showcase with Floating Glass Cards */}
          <div className="lg:col-span-5 relative scroll-reveal-right">
            {/* Main Visual Image Frame */}
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-brand-950/80 group">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                  alt="Students learning together at St. Xavier's High School"
                  className="w-full h-[320px] sm:h-[380px] lg:h-[400px] object-cover group-hover:scale-105 transition duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-slate-900/85 border border-slate-700/60 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white text-xs sm:text-sm font-bold">Main Academic Campus</div>
                      <div className="text-[11px] text-slate-400">Collaborative STEM & Robotics Lab</div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md text-[10px] font-semibold">
                      Live Campus
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Glass Card 1 (Top Left) */}
              <div className="absolute -top-5 -left-5 sm:-left-6 p-3 sm:p-3.5 rounded-2xl glass-card shadow-2xl animate-float hidden sm:flex items-center space-x-3 border border-white/10">
                <div className="p-2 sm:p-2.5 bg-brand-500/20 border border-brand-500/30 rounded-xl text-brand-400">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Board Results</div>
                  <div className="text-base sm:text-lg font-extrabold text-white">99.4% Pass Rate</div>
                </div>
              </div>

              {/* Floating Glass Card 2 (Bottom Right) */}
              <div className="absolute -bottom-5 -right-5 sm:-right-6 p-3 sm:p-3.5 rounded-2xl glass-card shadow-2xl animate-float-delayed hidden sm:flex items-center space-x-3 border border-white/10">
                <div className="p-2 sm:p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Global Alums</div>
                  <div className="text-base sm:text-lg font-extrabold text-white">Harvard, MIT & IIT</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Operational Stats Counter Bar */}
        <div className="mt-10 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 max-w-6xl mx-auto scroll-reveal-zoom">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md glass-card-hover text-center">
            <Users className="h-6 w-6 text-brand-400 mx-auto mb-1.5" />
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              <AnimatedCounter end={60000} suffix="+" />
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider mt-1">Active Students</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md glass-card-hover text-center">
            <Award className="h-6 w-6 text-emerald-400 mx-auto mb-1.5" />
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              <AnimatedCounter end={99.4} decimals={1} suffix="%" />
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider mt-1">Board Pass Rate</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md glass-card-hover text-center">
            <School className="h-6 w-6 text-indigo-400 mx-auto mb-1.5" />
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              <AnimatedCounter end={5} suffix=" Modern" />
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider mt-1">Campuses</div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md glass-card-hover text-center">
            <Sparkles className="h-6 w-6 text-amber-400 mx-auto mb-1.5" />
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              <AnimatedCounter end={2500} suffix="+" />
            </div>
            <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider mt-1">Expert Faculty</div>
          </div>
        </div>
      </div>
    </section>
  );
};
