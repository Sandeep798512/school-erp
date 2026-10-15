import React from 'react';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 scroll-reveal">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full inline-flex items-center space-x-1.5">
            <Navigation className="h-3.5 w-3.5" />
            <span>Connect With Us</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Campus Locations & Contact
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Our admissions counselors and administrative staff are ready to assist you.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-7 bg-slate-900 border border-slate-800 rounded-3xl glass-card-hover space-y-3 text-center scroll-reveal">
            <div className="p-3.5 bg-brand-500/10 text-brand-400 rounded-2xl w-fit mx-auto">
              <MapPin className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">Main Campus</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              100 Education Boulevard, Knowledge City, Sector 4
            </p>
          </div>

          <div className="p-7 bg-slate-900 border border-slate-800 rounded-3xl glass-card-hover space-y-3 text-center scroll-reveal">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl w-fit mx-auto">
              <Phone className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">Helpline Phone</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              +1-800-555-0199<br />+1-800-555-0200
            </p>
          </div>

          <div className="p-7 bg-slate-900 border border-slate-800 rounded-3xl glass-card-hover space-y-3 text-center scroll-reveal">
            <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl w-fit mx-auto">
              <Mail className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">Official Email</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              admissions@stxaviersnorth.edu<br />info@stxaviersnorth.edu
            </p>
          </div>

          <div className="p-7 bg-slate-900 border border-slate-800 rounded-3xl glass-card-hover space-y-3 text-center scroll-reveal">
            <div className="p-3.5 bg-amber-500/10 text-amber-400 rounded-2xl w-fit mx-auto">
              <Clock className="h-6 w-6" />
            </div>
            <h4 className="text-base font-bold text-white">Office Timings</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monday – Saturday<br />8:00 AM – 4:30 PM IST
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
