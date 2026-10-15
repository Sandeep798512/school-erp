import React from 'react';
import { Star, Quote, Award } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Ananya Roy',
      role: 'Class of 2024 • Computer Science at MIT',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      badge: 'Alumna Achievement',
      content:
        'The robotics program and individual research mentorship at St. Xavier’s gave me the technical confidence to build independent AI prototypes in high school, which became the cornerstone of my MIT acceptance.',
    },
    {
      name: 'Dr. Rajesh Singhania',
      role: 'Parent of Grade 9 & 11 Students • Chief Cardiac Surgeon',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      badge: 'Parent Review',
      content:
        'As parents, the transparency through the cloud ERP portal combined with the genuine dedication of the faculty makes St. Xavier’s peerless. Both my children have grown into disciplined, compassionate critical thinkers.',
    },
    {
      name: 'Devashish Mehra',
      role: 'Class of 2022 • Rhodes Scholar, Oxford University',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      badge: 'Rhodes Scholar',
      content:
        'St. Xavier’s taught me that excellence is a habit, not an act. The Model UN debates, rigorous humanities curriculum, and teachers who challenged me every day fundamentally shaped my academic trajectory.',
    },
  ];

  return (
    <section className="py-24 bg-slate-900/90 border-y border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 scroll-reveal">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full inline-flex items-center space-x-1.5">
            <Award className="h-3.5 w-3.5" />
            <span>Voices of Our Community</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Hear From Our Alumni & Parents
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Our graduates study at the world's most prestigious universities and our families 
            share their journeys of transformation.
          </p>
        </div>

        {/* Testimonials 3 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-slate-950 border border-slate-800 glass-card-hover flex flex-col justify-between space-y-6 scroll-reveal"
            >
              <div className="space-y-4">
                {/* Top Row: Stars + Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="h-6 w-6 text-brand-500/30" />
                </div>

                <p className="text-slate-300 text-sm leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              {/* Author Profile */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center space-x-4">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-13 h-13 rounded-2xl object-cover border-2 border-brand-500/40 shadow-md"
                />
                <div>
                  <div className="text-white text-sm font-bold">{item.name}</div>
                  <div className="text-[11px] text-brand-400 font-medium leading-tight">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
