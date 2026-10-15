import React, { useState } from 'react';
import { Camera } from 'lucide-react';

export const CampusLifeGallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const galleryItems = [
    {
      id: 1,
      category: 'ARTS',
      title: 'Annual Symphonic & Drama Gala',
      location: 'Grand Auditorium',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      category: 'STEM',
      title: 'National Robotics Hackathon',
      location: 'Turing Technology Wing',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      category: 'SPORTS',
      title: 'Inter-School Athletics Championship',
      location: 'Olympic Track Complex',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      category: 'CAMPUS',
      title: 'Graduation Commencement Day',
      location: 'Convocation Amphitheatre',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 5,
      category: 'ARTS',
      title: 'Contemporary Art & Pottery Showcase',
      location: 'Design Studios',
      image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 6,
      category: 'CAMPUS',
      title: 'Global Model United Nations',
      location: 'International Assembly Hall',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const filteredItems = activeFilter === 'ALL'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeFilter);

  return (
    <section id="gallery" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 scroll-reveal">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full inline-flex items-center space-x-1.5">
              <Camera className="h-3.5 w-3.5" />
              <span>Life At St. Xavier's</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Moments That Inspire Greatness
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              From athletic podiums and art exhibitions to international robotics championships, 
              explore vibrant student life across our campuses.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {['ALL', 'SPORTS', 'STEM', 'ARTS', 'CAMPUS'].map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-300 ${
                  activeFilter === category
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl scroll-reveal"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition duration-300" />

                {/* Badge */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 border border-white/10 rounded-full text-[11px] font-semibold text-brand-300 backdrop-blur-md">
                  {item.category}
                </span>

                {/* Content Overlay */}
                <div className="absolute bottom-4 left-4 right-4 space-y-1">
                  <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition duration-300">
                    {item.title}
                  </h3>
                  <div className="text-xs text-slate-400 flex items-center space-x-1">
                    <span>📍 {item.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
