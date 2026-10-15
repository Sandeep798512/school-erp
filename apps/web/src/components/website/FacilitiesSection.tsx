import React from 'react';
import { Monitor, FlaskConical, Trophy, Bus, BookOpenCheck, Cpu, ArrowUpRight } from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
  const facilities = [
    {
      title: 'Smart Digital Classrooms',
      tag: 'Interactive Tech',
      desc: 'Interactive 85" 4K touchboards, gigabit Wi-Fi 6, ergonomic seating, and multi-angle lecture recording suites.',
      image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
      icon: Monitor,
    },
    {
      title: 'Advanced Science & Biotech Labs',
      tag: 'Research Grade',
      desc: 'Fully equipped Physics, Chemistry, Biology, and Biotechnology research suites exceeding university safety standards.',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      icon: FlaskConical,
    },
    {
      title: 'Olympic-Standard Sports Complex',
      tag: 'Athletic Excellence',
      desc: 'All-weather heated swimming pool, synthetic FIFA-size football pitch, indoor wooden basketball and badminton courts.',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      icon: Trophy,
    },
    {
      title: 'GPS-Tracked Safe Fleet',
      tag: 'Safe Transit',
      desc: '100% air-conditioned luxury buses equipped with live GPS tracking, speed governors, RFID card attendance, and CCTV.',
      image: 'https://images.unsplash.com/photo-1557223562-6c77ef16210f?auto=format&fit=crop&w=800&q=80',
      icon: Bus,
    },
    {
      title: 'Digital Research Library Vault',
      tag: 'Knowledge Vault',
      desc: '50,000+ print volumes, 200,000+ international e-journal subscriptions, and quiet sound-isolated study pods.',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
      icon: BookOpenCheck,
    },
    {
      title: 'AI, Robotics & Drone Lab',
      tag: 'Future Skills',
      desc: 'Industrial 3D printers, laser cutters, programmable humanoid robotics kits, and drone flight testing arena.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      icon: Cpu,
    },
  ];

  return (
    <section id="facilities" className="py-24 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 scroll-reveal">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            World-Class Infrastructure
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Campus Facilities & Infrastructure
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Spanning over 45 acres of green, technologically integrated campus architecture 
            engineered to ignite creativity, safety, and athletic triumph.
          </p>
        </div>

        {/* 6 Facilities Grid with Real Photos & Hover Effects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((fac, idx) => {
            const Icon = fac.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 glass-card-hover flex flex-col scroll-reveal"
              >
                {/* Photo container */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={fac.image}
                    alt={fac.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Tag */}
                  <span className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 border border-white/10 rounded-full text-[11px] font-semibold text-white backdrop-blur-md">
                    {fac.tag}
                  </span>

                  {/* Icon badge */}
                  <div className="absolute bottom-4 right-4 p-3 bg-brand-600/90 rounded-xl text-white shadow-lg backdrop-blur-sm group-hover:bg-brand-500 transition">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition flex items-center justify-between">
                      <span>{fac.title}</span>
                      <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-brand-400 transition" />
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {fac.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
