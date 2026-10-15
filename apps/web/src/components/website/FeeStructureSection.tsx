import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';

export const FeeStructureSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'ANNUAL' | 'QUARTERLY'>('ANNUAL');

  const feeTiers = [
    {
      grade: 'Primary Wing',
      classes: 'Grades 1 to 5',
      badge: 'Foundational',
      color: 'border-brand-500/30',
      tagColor: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
      annualTuition: 55000,
      quarterlyTuition: 13750,
      activityFee: 14000,
      quarterlyActivity: 3500,
      oneTimeAdmission: 15000,
      highlights: [
        'Interactive Smart Digital Classroom Access',
        'Experiential STEM Kits & Junior Robotics',
        'Physical Education & Swimming Instruction',
        'Digital Library & Cloud ERP Ward Tracking',
        'Annual Comprehensive Medical Screening',
      ],
    },
    {
      grade: 'Middle Wing',
      classes: 'Grades 6 to 8',
      badge: 'STEAM & Logic',
      color: 'border-emerald-500/30',
      tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      annualTuition: 68000,
      quarterlyTuition: 17000,
      activityFee: 20000,
      quarterlyActivity: 5000,
      oneTimeAdmission: 15000,
      highlights: [
        'Advanced Physics, Chem & Biology Labs',
        'Robotics, 3D Prototyping & Coding Lab',
        'Foreign Language Elective (French/German)',
        'Interschool Sports League Coaching',
        'Model UN & National Olympiad Training',
      ],
    },
    {
      grade: 'Secondary Wing',
      classes: 'Grades 9 & 10',
      badge: 'Board Preparation',
      popular: true,
      color: 'border-indigo-500/50 shadow-2xl shadow-indigo-950/50',
      tagColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      annualTuition: 82000,
      quarterlyTuition: 20500,
      activityFee: 24000,
      quarterlyActivity: 6000,
      oneTimeAdmission: 20000,
      highlights: [
        'Rigorous CBSE Board Curriculum & Testing',
        'Specialized Biotech & Computer Science Labs',
        'National Talent Search & Science Olympiads',
        'Dedicated Career Aptitude Mentorship',
        'Unlimited Digital Vault & Online Mock Exams',
      ],
    },
    {
      grade: 'Senior Secondary',
      classes: 'Grades 11 & 12',
      badge: 'College Specialization',
      color: 'border-purple-500/30',
      tagColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      annualTuition: 98000,
      quarterlyTuition: 24500,
      activityFee: 34000,
      quarterlyActivity: 8500,
      oneTimeAdmission: 25000,
      highlights: [
        'Science (PCMB/CS), Commerce & Humanities',
        'Integrated SAT, JEE & NEET Prep Modules',
        'Global University Admissions Guidance Office',
        'Independent Capstone Research Program',
        'Executive Leadership & Internship Credits',
      ],
    },
  ];

  return (
    <section id="fees" className="py-24 bg-slate-900/90 border-y border-slate-800 relative overflow-hidden">
      {/* Background Subtle Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 scroll-reveal">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-widest px-3 py-1 bg-brand-500/10 border border-brand-500/20 rounded-full inline-flex items-center space-x-1.5">
            <CreditCard className="h-3.5 w-3.5" />
            <span>Transparent Investment</span>
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Institutional Fee Structure
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            100% transparent fee schedules with zero hidden charges. Includes digital learning systems, 
            sports amenities, laboratory access, and complete cloud ERP services.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="pt-2 flex justify-center">
            <div className="p-1 bg-slate-950 border border-slate-800 rounded-2xl inline-flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setBillingCycle('ANNUAL')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition duration-300 ${
                  billingCycle === 'ANNUAL'
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Annual Payment (Best Value)
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('QUARTERLY')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition duration-300 ${
                  billingCycle === 'QUARTERLY'
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Quarterly Installments
              </button>
            </div>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
          {feeTiers.map((tier, idx) => {
            const tuition = billingCycle === 'ANNUAL' ? tier.annualTuition : tier.quarterlyTuition;
            const activity = billingCycle === 'ANNUAL' ? tier.activityFee : tier.quarterlyActivity;
            const total = tuition + activity;

            return (
              <div
                key={idx}
                className={`p-7 rounded-3xl bg-slate-950 border ${tier.color} glass-card-hover flex flex-col justify-between space-y-6 relative scroll-reveal`}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-full shadow-lg shadow-brand-600/40">
                    Most Popular
                  </div>
                )}

                <div className="space-y-4">
                  {/* Grade Title & Badge */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">{tier.grade}</h3>
                      <p className="text-xs text-slate-400">{tier.classes}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${tier.tagColor}`}>
                      {tier.badge}
                    </span>
                  </div>

                  {/* Price Block */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="text-xs text-slate-400">
                      {billingCycle === 'ANNUAL' ? 'Total Annual Composite Fee' : 'Per Quarter Composite Fee'}
                    </div>
                    <div className="flex items-baseline space-x-1 mt-1">
                      <span className="text-3xl font-extrabold text-white tracking-tight">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400">
                        {billingCycle === 'ANNUAL' ? '/year' : '/quarter'}
                      </span>
                    </div>

                    <div className="mt-3 p-3 bg-slate-900/80 rounded-xl space-y-1.5 text-[11px] text-slate-300">
                      <div className="flex justify-between">
                        <span>Tuition Fee:</span>
                        <span className="font-semibold text-white">₹{tuition.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lab, Tech & Sports:</span>
                        <span className="font-semibold text-white">₹{activity.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                        <span>One-time Admission:</span>
                        <span>₹{tier.oneTimeAdmission.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-2.5 pt-2">
                    <div className="text-xs font-semibold text-slate-200">Included Amenities:</div>
                    {tier.highlights.map((item, fIdx) => (
                      <div key={fIdx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Apply Button */}
                <div className="pt-4 border-t border-slate-800">
                  <a
                    href="#admissions"
                    className="w-full py-3 bg-slate-900 hover:bg-brand-600 border border-slate-700/80 hover:border-brand-500 font-bold rounded-xl text-xs text-center block text-white transition duration-300"
                  >
                    Enquire For Admission
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Scholarship & Waiver Policies */}
        <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-6 scroll-reveal">
          <div className="flex items-center space-x-2 text-brand-400">
            <Sparkles className="h-5 w-5" />
            <h3 className="text-lg font-bold text-white">Institutional Scholarships & Fee Waivers</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="text-sm font-bold text-emerald-400">Academic Merit Scholarship</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Up to <strong>50% tuition waiver</strong> awarded to students securing 95%+ in qualifying board examinations.
              </p>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="text-sm font-bold text-brand-400">Sibling Concession</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                A <strong>15% annual tuition waiver</strong> is automatically credited for second and third siblings enrolled simultaneously.
              </p>
            </div>

            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
              <div className="text-sm font-bold text-purple-400">Sports & Performing Arts Wards</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Up to <strong>40% waiver</strong> for students representing state or national athletic and cultural tournaments.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Payments accepted online via Netbanking, UPI, Debit/Credit Card, and Zero-Cost EMI options.</span>
            </div>
            <a
              href="#contact"
              className="font-bold text-brand-400 hover:text-brand-300 transition flex items-center space-x-1"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Have financial aid questions? Contact Accounts Office</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
