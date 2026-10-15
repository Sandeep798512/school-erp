import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface ThemeToggleProps {
  variant?: 'icon' | 'pill' | 'compact';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'icon', className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
        className={`relative inline-flex items-center h-9 px-3 rounded-full text-xs font-semibold transition-all duration-300 shadow-md ${
          isDark
            ? 'bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600'
            : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-slate-200/50'
        } ${className}`}
      >
        <div className="flex items-center space-x-2">
          <div
            className={`p-1 rounded-full transition-transform duration-500 ${
              isDark
                ? 'bg-indigo-500/20 text-indigo-400 rotate-0'
                : 'bg-amber-500/20 text-amber-500 rotate-180'
            }`}
          >
            {isDark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
          </div>
          <span className="tracking-wide">
            {isDark ? 'Night Mode' : 'Day Mode'}
          </span>
        </div>
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        title={isDark ? 'Switch to Day (Light) Mode' : 'Switch to Night (Dark) Mode'}
        aria-label={isDark ? 'Switch to Day (Light) Mode' : 'Switch to Night (Dark) Mode'}
        className={`p-1.5 rounded-lg transition-all duration-300 flex items-center justify-center ${
          isDark
            ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800'
            : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-100'
        } ${className}`}
      >
        {isDark ? (
          <Sun className="h-4 w-4 transition-transform hover:rotate-45" />
        ) : (
          <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
        )}
      </button>
    );
  }

  // Default 'icon' variant
  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Day (Light) Mode' : 'Switch to Night (Dark) Mode'}
      aria-label={isDark ? 'Switch to Day (Light) Mode' : 'Switch to Night (Dark) Mode'}
      className={`relative p-2.5 rounded-xl transition-all duration-300 group flex items-center justify-center ${
        isDark
          ? 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:shadow-lg hover:shadow-indigo-500/10'
          : 'bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 hover:shadow-md'
      } ${className}`}
    >
      <div
        className={`transition-all duration-500 transform ${
          isDark
            ? 'rotate-0 text-sky-400 group-hover:scale-110 group-hover:text-amber-400'
            : 'rotate-180 text-amber-500 group-hover:scale-110 group-hover:text-indigo-600'
        }`}
      >
        {isDark ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </div>
      <span className="sr-only">{isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
    </button>
  );
};
