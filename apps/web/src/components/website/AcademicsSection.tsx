import React from 'react';
import { BookOpen, Cpu, Sparkles, Check } from 'lucide-react';

export const AcademicsSection: React.FC = () => {
  const pathways = [
    {
      title: 'Primary School (Grades 1-5)',
      subtitle: 'Foundational Discovery & Inquiry',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      icon: BookOpen,
      badge: 'Early Years Foundation',
      badgeColor: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
      description: 'Nurturing curiosity, foundational literacy, numeracy, experiential science, music, visual arts, and emotional intelligence in vibrant modern classrooms.',
      features: ['Play-Based Experiential Learning', 'Bilingual Literacy & Phonics', 'Junior STEM & Coding Basics', 'Art, Music & Physical Kinesthetics']
    },
    {
      title: 'Middle School (Grades 6-8)',
      subtitle: 'Exploration, Logic & Practical Skills',
      image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80',
      icon: Cpu,
      badge: 'STEAM & Innovation',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      description: 'Deepening academic rigor with advanced science, robotics competitions, computer logic, world language electives, and structured athletic participation.',
      features: ['Hands-on Robotics & 3D Prototyping', 'Foreign Languages (French/German/Spanish)', 'Interschool Olympiads Training', 'Leadership & Model UN Debates']
    },
    {
      title: 'Senior Secondary (Grades 9-12)',
      subtitle: 'Specialization & College Readiness',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
      icon: Sparkles,
      badge: 'Board & Competitive Prep',
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      description: 'Specialized streams in Science, Commerce, and Humanities paired with comprehensive mentorship for global university admissions (IIT, SAT, NEET, APs).',
      features: ['Advanced Science & Commerce Streams', 'Integrated SAT, JEE & NEET Coaching', 'Global Career Counseling Office', 'Capstone Independent Research Thesis']
    }
  ];

  return (
    <section id="academics" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 scroll-reveal">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full">
            Academics & Curricula
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Comprehensive Learning Pathways
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Our progressive curriculum empowers every student with the intellectual curiosity, 
            academic discipline, and technical confidence needed to succeed in an ever-evolving world.
          </p>
        </div>

        {/* 3 Pathway Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pathways.map((path, idx) => {
            const Icon = path.icon;
            return (
              <div
                key={idx}
                className="group rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden glass-card-hover flex flex-col scroll-reveal-zoom"
              >
                {/* Visual Image Header */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={path.image}
                    alt={path.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/30 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border backdrop-blur-md ${path.badgeColor}`}>
                      {path.badge}
                    </span>
                  </div>

                  {/* Icon Avatar */}
                  <div className="absolute -bottom-4 right-6 p-3 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl text-brand-400">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-brand-400 uppercase tracking-wider">{path.subtitle}</div>
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-300 transition">{path.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      {path.description}
                    </p>
                  </div>

                  {/* Features list */}
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    {path.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center space-x-2 text-xs text-slate-300">
                        <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
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
