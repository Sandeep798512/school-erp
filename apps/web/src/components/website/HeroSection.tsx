import React from 'react';
import { ArrowRight, Award, Users, School, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';

export interface HeroSectionProps {
  onApplyNow: () => void;
  onExploreERP: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onApplyNow, onExploreERP }) => {
  return (
    <section id="hero" className="relative min-h-[92vh] flex items-center justify-center bg-slate-950 overflow-hidden py-16 lg:py-24">
      {/* Decorative Gradient Glows */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-brand-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Live Announcement Ticker */}
        <div className="flex justify-center mb-8 scroll-reveal">
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-slate-900/90 border border-brand-500/30 text-xs text-slate-300 shadow-xl backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-brand-400 uppercase tracking-wider text-[11px]">Admissions Open 2026-27</span>
            <span className="text-slate-600">|</span>
            <span className="hidden sm:inline text-slate-300">CBSE & IB World School Accreditation</span>
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          </div>
        </div>

        {/* 2-Column Hero Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTA */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Shaping Tomorrow's{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-400">
                Global Leaders
              </span>{' '}
              Through Excellence
            </h1>

            <p className="text-slate-300 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Experience India's premier multi-campus educational institution. Combining 
              rigorous academic foundation, AI-driven digital classrooms, world-class athletic facilities, 
              and an integrated cloud ERP portal for 60,000+ students.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onApplyNow}
                className="group relative flex items-center justify-center space-x-3 px-8 py-4 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-xl shadow-brand-600/30 hover:shadow-brand-600/50 hover:scale-[1.02] transition duration-300"
              >
                <span>Apply For Admission 2026</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition duration-300" />
              </button>

              <button
                onClick={onExploreERP}
                className="flex items-center justify-center space-x-2 px-8 py-4 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 text-slate-200 font-semibold rounded-xl backdrop-blur-sm transition duration-300 hover:scale-[1.02]"
              >
                <ShieldCheck className="h-5 w-5 text-brand-400" />
                <span>Explore ERP Portal</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Ranked #1 K-12 Institution</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>100% University Placement</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>35+ Global STEM Awards</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Image Showcase with Floating Glass Cards */}
          <div className="lg:col-span-5 relative scroll-reveal-right">
            {/* Main Visual Image Frame */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-brand-950/80 group">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
                  alt="Students learning together at St. Xavier's High School"
                  className="w-full h-[440px] sm:h-[480px] object-cover group-hover:scale-105 transition duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white text-sm font-bold">Main Academic Campus</div>
                      <div className="text-xs text-slate-400">Collaborative STEM & Robotics Lab</div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md text-[11px] font-semibold">
                      Live Campus
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Glass Card 1 (Top Left) */}
              <div className="absolute -top-6 -left-6 sm:-left-8 p-4 rounded-2xl glass-card shadow-2xl animate-float hidden sm:flex items-center space-x-3.5 border border-white/10">
                <div className="p-3 bg-brand-500/20 border border-brand-500/30 rounded-xl text-brand-400">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Board Results</div>
                  <div className="text-xl font-extrabold text-white">99.4% Pass Rate</div>
                </div>
              </div>

              {/* Floating Glass Card 2 (Bottom Right) */}
              <div className="absolute -bottom-6 -right-6 sm:-right-8 p-4 rounded-2xl glass-card shadow-2xl animate-float-delayed hidden sm:flex items-center space-x-3.5 border border-white/10">
                <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">Global Alums</div>
                  <div className="text-xl font-extrabold text-white">Harvard, MIT & IIT</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Operational Stats Counter Bar */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto scroll-reveal-zoom">
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md glass-card-hover text-center">
            <Users className="h-7 w-7 text-brand-400 mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              <AnimatedCounter end={60000} suffix="+" />
            </div>
            <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1">Active Students</div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md glass-card-hover text-center">
            <Award className="h-7 w-7 text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              <AnimatedCounter end={99.4} decimals={1} suffix="%" />
            </div>
            <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1">Board Pass Rate</div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md glass-card-hover text-center">
            <School className="h-7 w-7 text-indigo-400 mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              <AnimatedCounter end={5} suffix=" Modern" />
            </div>
            <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1">Campuses</div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-md glass-card-hover text-center">
            <Sparkles className="h-7 w-7 text-amber-400 mx-auto mb-2" />
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              <AnimatedCounter end={2500} suffix="+" />
            </div>
            <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mt-1">Expert Faculty</div>
          </div>
        </div>
      </div>
    </section>
  );
};
