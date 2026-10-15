import React, { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'dashboard'>('home');
  const [userData, setUserData] = useState<any>(null);

  const handleLoginSuccess = (data: any) => {
    setUserData(data.user);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUserData(null);
    setCurrentView('home');
  };

  return (
    <div>
      {/* View Switcher Bar for Development & Testing */}
      <nav className="bg-slate-900 border-b border-slate-800 px-6 py-2 flex justify-between items-center text-xs">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentView('home')}
            className={`font-semibold ${currentView === 'home' ? 'text-brand-400' : 'text-slate-400 hover:text-white'}`}
          >
            Public Website
          </button>
          <button
            onClick={() => setCurrentView('login')}
            className={`font-semibold ${currentView === 'login' ? 'text-brand-400' : 'text-slate-400 hover:text-white'}`}
          >
            Portal Login
          </button>
          {userData && (
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`font-semibold ${currentView === 'dashboard' ? 'text-brand-400' : 'text-slate-400 hover:text-white'}`}
            >
              ERP Dashboard
            </button>
          )}
        </div>

        {userData ? (
          <div className="text-slate-400">
            Authenticated as: <span className="text-white font-mono">{userData.email}</span>
          </div>
        ) : (
          <button
            onClick={() => setCurrentView('login')}
            className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white rounded font-medium transition"
          >
            Sign In to ERP Portal
          </button>
        )}
      </nav>

      {/* Main View Renderer */}
      {currentView === 'home' && <HomePage onNavigateLogin={() => setCurrentView('login')} />}
      {currentView === 'login' && <LoginPage onLoginSuccess={handleLoginSuccess} />}
      {currentView === 'dashboard' && <DashboardPage user={userData} onLogout={handleLogout} />}
    </div>
  );
};

export default App;
