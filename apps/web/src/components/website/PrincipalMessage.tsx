import React from 'react';
import { Quote, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export const PrincipalMessage: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-slate-900/90 border-y border-slate-800 relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Principal Portrait & Credo */}
          <div className="lg:col-span-5 space-y-6 scroll-reveal-left">
            <div>
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest">Leadership & Vision</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
                Principal's Message
              </h2>
            </div>

            {/* Photo Card with Quote Overlay */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80"
                alt="Dr. Arthur Pendelton, Principal"
                className="w-full h-[380px] object-cover object-top group-hover:scale-105 transition duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-brand-600 rounded-lg text-white">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-white text-base font-bold">Dr. Arthur Pendelton, Ph.D.</h3>
                    <p className="text-xs text-brand-400 font-medium">Principal & Academic Director • Oxford Fellow</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Card */}
            <div className="p-6 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3 relative">
              <Quote className="h-8 w-8 text-brand-400/40 absolute -top-3 left-4 bg-slate-950 px-1" />
              <p className="text-slate-300 text-sm leading-relaxed italic pt-1">
                "At St. Xavier's, we believe true education goes far beyond examination scores. 
                It is about instilling moral integrity, curiosity, and technological agility into 
                every child, empowering them to lead with empathy and solve tomorrow's grand challenges."
              </p>
            </div>
          </div>

          {/* Right Column: Values & Core Philosophy */}
          <div className="lg:col-span-7 space-y-8 scroll-reveal-right">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold mb-3">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Our Core Values & Mission</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                An Educational Philosophy Built For The 21st Century
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed mt-2">
                Our institution has championed holistic pedagogy for over three decades, nurturing future 
                scientists, artists, entrepreneurs, and global leaders through a balanced synthesis of 
                academics and character.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl glass-card-hover space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 font-bold">
                  01
                </div>
                <h4 className="text-lg font-bold text-white">Academic Rigor & Inquiry</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Deep concept mastery with experiential learning modules that stimulate analytical reasoning and independent thinking.
                </p>
              </div>

              <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl glass-card-hover space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                  02
                </div>
                <h4 className="text-lg font-bold text-white">Character & Moral Integrity</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Emphasizing ethical decision-making, resilience, empathy, and active community outreach alongside scholarly success.
                </p>
              </div>

              <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl glass-card-hover space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                  03
                </div>
                <h4 className="text-lg font-bold text-white">Global Citizenship</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  International exchange partnerships, multi-cultural symposiums, and United Nations educational simulations.
                </p>
              </div>

              <div className="p-6 bg-slate-950/60 border border-slate-800 rounded-2xl glass-card-hover space-y-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                  04
                </div>
                <h4 className="text-lg font-bold text-white">AI & Emerging Technologies</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Next-generation coding, robotics, artificial intelligence labs, and cybersecurity literacy woven into everyday classes.
                </p>
              </div>
            </div>

            {/* Quick check marks */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-brand-400" />
                <span>1:15 Teacher-to-Student Ratio</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-brand-400" />
                <span>Dual CBSE & IB Diploma Programs</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-brand-400" />
                <span>100% University Acceptance</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-brand-400" />
                <span>Certified Mental Health Counselors</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
