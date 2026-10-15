import React from 'react';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-brand-600 rounded-xl text-white shadow-lg shadow-brand-600/30">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="font-extrabold text-white text-base">ST. XAVIER'S HIGH SCHOOL</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Empowering over 60,000+ students across five state-of-the-art campuses. 
              Accredited by CBSE & International Baccalaureate (IB) for academic distinction and character development.
            </p>
            <div className="flex items-center space-x-2 text-xs text-brand-400">
              <ShieldCheck className="h-4 w-4" />
              <span>ISO 9001:2026 Certified Educational Quality</span>
            </div>
          </div>

          {/* Column 1: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Academics</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#academics" className="hover:text-brand-400 transition">Primary School</a></li>
              <li><a href="#academics" className="hover:text-brand-400 transition">Middle School STEAM</a></li>
              <li><a href="#academics" className="hover:text-brand-400 transition">Senior Secondary</a></li>
              <li><a href="#academics" className="hover:text-brand-400 transition">Competitive Exam Wings</a></li>
              <li><a href="#facilities" className="hover:text-brand-400 transition">Robotics & AI Labs</a></li>
            </ul>
          </div>

          {/* Column 2: Campus Life */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Campus Life</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#facilities" className="hover:text-brand-400 transition">Olympic Sports Complex</a></li>
              <li><a href="#facilities" className="hover:text-brand-400 transition">Digital Research Vault</a></li>
              <li><a href="#gallery" className="hover:text-brand-400 transition">Fine Arts & Theater</a></li>
              <li><a href="#news" className="hover:text-brand-400 transition">Annual Hackathon</a></li>
              <li><a href="#facilities" className="hover:text-brand-400 transition">Safe Transit Fleet</a></li>
            </ul>
          </div>

          {/* Column 3: Admissions & Portals */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Admissions & ERP</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#admissions" className="hover:text-brand-400 transition">Admissions 2026-27</a></li>
              <li><a href="#fees" className="hover:text-brand-400 transition">Fee Structure & Aid</a></li>
              <li><a href="#admissions" className="hover:text-brand-400 transition">Campus Tours Booking</a></li>
              <li><a href="#about" className="hover:text-brand-400 transition">Principal's Welcome</a></li>
              <li><a href="#contact" className="hover:text-brand-400 transition">Directorate Contact</a></li>
              <li><span className="text-brand-400 font-semibold cursor-pointer">ERP Cloud Login</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div>
            © 2026 St. Xavier's Educational Trust. All rights reserved.
          </div>
          <div className="flex items-center space-x-1">
            <span>Built with precision for 60,000+ students & educators</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
