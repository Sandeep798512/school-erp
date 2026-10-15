import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, ArrowRight, Bell } from 'lucide-react';

export const NewsEventsSection: React.FC = () => {
  const defaultEvents = [
    {
      id: 'evt-1',
      date: 'OCT 28, 2026',
      title: 'Annual STEM & International Robotics Exposition',
      description: 'Over 120 student engineering projects, live AI model showcases, and humanoid robot battleground tournament.',
      location: 'Grand Exhibition Hall, Main Campus',
      image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80',
      tag: 'STEM Fair',
    },
    {
      id: 'evt-2',
      date: 'NOV 12, 2026',
      title: 'Inter-School Invitational Aquatic & Athletics Meet',
      description: 'Athletes from 35 schools competing in track & field, 400m relay, swimming, and basketball finals.',
      location: 'Olympic Sports Pavilion',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=600&q=80',
      tag: 'Sports Tourney',
    },
    {
      id: 'evt-3',
      date: 'DEC 05, 2026',
      title: 'Winter Philharmonic Symphony & Theatrical Gala',
      description: 'Student choir, classical orchestra, and Shakespeare theatrical performance open to all parents & alumni.',
      location: 'Performing Arts Auditorium',
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
      tag: 'Cultural Fest',
    },
  ];

  const [events, setEvents] = useState<any[]>(defaultEvents);

  useEffect(() => {
    fetch('/api/v1/public/events')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          // Merge API data with images
          const merged = json.data.map((evt: any, idx: number) => ({
            ...evt,
            image: defaultEvents[idx % defaultEvents.length].image,
            tag: defaultEvents[idx % defaultEvents.length].tag,
          }));
          setEvents(merged);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="news" className="py-24 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 scroll-reveal">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-widest px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full inline-flex items-center space-x-1.5">
              <Bell className="h-3.5 w-3.5" />
              <span>Campus Happenings</span>
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Upcoming Events & News
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Stay connected with academic symposiums, sports championships, and cultural celebrations.
            </p>
          </div>
        </div>

        {/* 3 Event Cards with Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="group rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden glass-card-hover flex flex-col scroll-reveal"
            >
              {/* Event Image */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={evt.image}
                  alt={evt.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {/* Date Pill */}
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-brand-600/90 text-white rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 shadow-lg backdrop-blur-md">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{evt.date}</span>
                </div>

                {/* Tag */}
                <span className="absolute top-4 right-4 px-2.5 py-1 bg-slate-900/80 border border-white/10 rounded-lg text-[11px] font-semibold text-slate-300 backdrop-blur-md">
                  {evt.tag}
                </span>
              </div>

              {/* Details */}
              <div className="p-6 sm:p-7 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition duration-300 leading-snug">
                    {evt.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center space-x-1.5 truncate max-w-[200px]">
                    <MapPin className="h-3.5 w-3.5 text-brand-400 shrink-0" />
                    <span className="truncate">{evt.location}</span>
                  </div>
                  <span className="text-brand-400 font-semibold group-hover:translate-x-1 transition flex items-center space-x-1">
                    <span>Details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
