import React, { useState } from 'react';
import { Send, CheckCircle2, Calendar, Sparkles } from 'lucide-react';

export const AdmissionsSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [grade, setGrade] = useState('Grade 1');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/v1/public/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, studentGrade: grade }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      // Fallback for visual demo
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="admissions" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Admission Info + Campus Photo */}
          <div className="lg:col-span-6 space-y-8 scroll-reveal-left">
            <div className="space-y-3">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-widest px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full inline-flex items-center space-x-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Admissions 2026-2027</span>
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Begin Your Journey With St. Xavier's
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                We invite applications from curious, motivated students eager to excel in our 
                rigorous academic programs, state-of-the-art laboratories, and holistic co-curricular culture.
              </p>
            </div>

            {/* Campus Image Frame */}
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80"
                alt="St Xavier's Historic Campus Architecture"
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 backdrop-blur-md flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-brand-400" />
                  <span>Campus Tours: Every Saturday 10:00 AM</span>
                </div>
                <span className="text-emerald-400 font-semibold">Bookings Active</span>
              </div>
            </div>

            {/* Steps List */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-slate-300 text-xs sm:text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Step 1: Submit Online Enquiry & Schedule Campus Visit</span>
              </div>
              <div className="flex items-start space-x-3 text-slate-300 text-xs sm:text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Step 2: Interactive Diagnostic Assessment & Faculty Interaction</span>
              </div>
              <div className="flex items-start space-x-3 text-slate-300 text-xs sm:text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Step 3: Provisional Admission Offer & Document Verification</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Admission Form */}
          <div className="lg:col-span-6 scroll-reveal-right">
            <div className="p-8 sm:p-10 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Application Received!</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you for applying to St. Xavier’s High School. Our admissions directorate 
                    will review your enquiry and contact you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Online Admission Enquiry
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Fill out this quick form for academic counselling and prospectus download.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Parent / Guardian Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vikram Singhania"
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-white placeholder-slate-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-white placeholder-slate-500 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-white placeholder-slate-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Target Admission Grade
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-white transition"
                    >
                      <option value="Grade 1">Primary School (Grades 1 to 5)</option>
                      <option value="Grade 6">Middle School (Grades 6 to 8)</option>
                      <option value="Grade 9">Secondary School (Grades 9 & 10)</option>
                      <option value="Grade 11-Science">Senior Secondary - Science (PCMB / PCM-CS)</option>
                      <option value="Grade 11-Commerce">Senior Secondary - Commerce & Economics</option>
                      <option value="Grade 11-Humanities">Senior Secondary - Humanities & Liberal Arts</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 font-bold rounded-xl text-sm transition duration-300 flex items-center justify-center space-x-2 text-white shadow-xl shadow-brand-600/30 disabled:opacity-50 hover:scale-[1.01]"
                  >
                    <span>{loading ? 'Submitting Application...' : 'Submit Admission Enquiry'}</span>
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
