import React, { useState } from 'react';
import { GraduationCap, LogIn, Shield, Eye, EyeOff } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';

export interface LoginPageProps {
  onLoginSuccess?: (data: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@stxaviers.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const demoAccounts = [
    { label: 'Admin', email: 'admin@stxaviers.com', pass: 'Admin@123', color: 'hover:border-brand-500' },
    { label: 'Teacher', email: 'teacher@stxaviers.com', pass: 'Teacher@123', color: 'hover:border-emerald-500' },
    { label: 'Student', email: 'student@stxaviers.com', pass: 'Student@123', color: 'hover:border-indigo-500' },
    { label: 'Parent', email: 'parent@stxaviers.com', pass: 'Parent@123', color: 'hover:border-amber-500' },
    { label: 'Accountant', email: 'accountant@stxaviers.com', pass: 'Accountant@123', color: 'hover:border-purple-500' },
  ];

  const handleSelectDemo = (acc: typeof demoAccounts[0]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.detail || 'Login failed. Please check credentials.');
      }

      if (onLoginSuccess) {
        onLoginSuccess(json.data);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify that the API server and database are running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Theme Toggle */}
      <div className="absolute top-5 right-5 z-20">
        <ThemeToggle variant="pill" />
      </div>
      {/* Background Image with Dark Tint */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80"
          alt="Campus Library"
          className="w-full h-full object-cover filter brightness-[0.2] contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/90" />
      </div>

      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-600/15 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Login Card */}
      <div className="w-full max-w-lg bg-slate-900/90 border border-slate-800/80 rounded-3xl shadow-2xl p-8 sm:p-10 space-y-7 relative z-10 backdrop-blur-2xl">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3 bg-gradient-to-tr from-brand-600 to-blue-500 rounded-2xl shadow-xl shadow-brand-600/30">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Enterprise ERP Portal
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Sign in with your role-specific institutional credentials
            </p>
          </div>
        </div>

        {/* Demo Fill Pills */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Quick Fill Demo Roles:</span>
            <span className="text-brand-400 text-[10px]">Click any role</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.label}
                type="button"
                onClick={() => handleSelectDemo(acc)}
                className={`px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 transition duration-200 hover:text-white ${acc.color} ${email === acc.email ? 'border-brand-500 bg-brand-500/20 text-brand-300' : ''}`}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs leading-relaxed flex items-start space-x-2">
            <span className="font-bold">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Institutional Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@stxaviers.com"
              className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-white placeholder-slate-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-white placeholder-slate-500 transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-500 hover:to-blue-500 font-bold rounded-xl text-sm transition duration-300 text-white shadow-xl shadow-brand-600/30 disabled:opacity-50 flex items-center justify-center space-x-2 hover:scale-[1.01]"
          >
            <LogIn className="h-4 w-4" />
            <span>{loading ? 'Authenticating with Token...' : 'Sign In To Portal'}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500 flex items-center justify-center space-x-2">
          <Shield className="h-3.5 w-3.5 text-brand-400" />
          <span>Stateless 15m JWT & Redis Session Whitelist Security</span>
        </div>
      </div>
    </div>
  );
};
