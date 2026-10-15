import { useEffect, useState } from 'react';
import { Users, GraduationCap, DollarSign, Calendar, Activity, School, Plus, LogOut, CheckCircle2, BookOpen } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';

export interface DashboardPageProps {
  user: any;
  onLogout: () => void;
}

export const DashboardPage = ({ user, onLogout }: DashboardPageProps) => {
  const [stats, setStats] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Admin Dashboard Stats
    fetch('/api/v1/admin/dashboard-stats', {
      headers: { Authorization: `Bearer ${user?.tokens?.accessToken}` }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setStats(json.data.metrics);
      })
      .catch(() => {});

    // Fetch Classes
    fetch('/api/v1/admin/classes', {
      headers: { Authorization: `Bearer ${user?.tokens?.accessToken}` }
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setClasses(json.data);
      })
      .catch(() => {});
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-8 font-sans">
      {/* Top Header Navigation */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-semibold rounded-full mb-2">
            <School className="h-3.5 w-3.5" />
            <span>St. Xavier's High School North Campus</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Admin Operational ERP Console</h1>
          <p className="text-xs text-slate-400">
            Authenticated User: <span className="font-mono text-white">{user?.email}</span> | Tenant ID: <span className="font-mono text-brand-400">{user?.schoolId || 'GLOBAL_SCOPE'}</span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <ThemeToggle variant="icon" />
          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 text-sm font-semibold rounded-lg transition"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Operational Summary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-semibold tracking-wider">Active Students</span>
            <Users className="h-5 w-5 text-brand-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.totalStudents || '1,250'}</div>
          <div className="text-xs text-emerald-400 flex items-center space-x-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>96.2% Attendance Today</span>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-semibold tracking-wider">Faculty & Staff</span>
            <GraduationCap className="h-5 w-5 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.totalTeachers || '85'} Teachers</div>
          <div className="text-xs text-slate-400">{stats?.totalStaff || '40'} Non-Teaching Staff</div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-semibold tracking-wider">Fee Collection</span>
            <DollarSign className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.totalFeeCollected || '$485,200.00'}</div>
          <div className="text-xs text-amber-400 font-mono">Dues Outstanding: {stats?.outstandingDues || '$32,450.00'}</div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs uppercase font-semibold tracking-wider">Active Classes</span>
            <Calendar className="h-5 w-5 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{stats?.totalClasses || '24'} Grade Sections</div>
          <div className="text-xs text-slate-400">{stats?.upcomingExams || '2'} Exams Scheduled</div>
        </div>
      </div>

      {/* Quick Action & Management Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Action Palette */}
        <div className="lg:col-span-4 p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Activity className="h-5 w-5 text-brand-400" />
            <span>Admin Quick Actions</span>
          </h3>

          <div className="space-y-3 pt-2">
            <button className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl text-xs font-semibold text-white flex items-center justify-between transition">
              <span>Register New Student Admission</span>
              <Plus className="h-4 w-4 text-brand-400" />
            </button>
            <button className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl text-xs font-semibold text-white flex items-center justify-between transition">
              <span>Collect Student Fee Payment</span>
              <Plus className="h-4 w-4 text-emerald-400" />
            </button>
            <button className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl text-xs font-semibold text-white flex items-center justify-between transition">
              <span>Publish School Notice</span>
              <Plus className="h-4 w-4 text-indigo-400" />
            </button>
            <button className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700/80 border border-slate-700/80 rounded-xl text-xs font-semibold text-white flex items-center justify-between transition">
              <span>Configure Class & Section Structure</span>
              <Plus className="h-4 w-4 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Academic Structure & RBAC Security Profile */}
        <div className="lg:col-span-8 p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-indigo-400" />
                <span>Class Structure & RBAC Security Profile</span>
              </h3>
              <p className="text-xs text-slate-400">Verified server-side role claims, active classes, and granted permission nodes.</p>
            </div>
            <div className="text-xs text-brand-400 font-mono">{classes.length} Classes Configured</div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs uppercase text-slate-400 font-semibold tracking-wider mb-2">Assigned Roles</h4>
              <div className="flex flex-wrap gap-2">
                {user?.roles?.map((r: string) => (
                  <span key={r} className="px-3 py-1 bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-lg text-xs font-mono font-bold">
                    {r}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase text-slate-400 font-semibold tracking-wider mb-2">Granular Permissions ({user?.permissions?.length || 0})</h4>
              <div className="max-h-48 overflow-y-auto p-4 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300">
                {user?.permissions?.map((p: string) => (
                  <div key={p} className="flex items-center space-x-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
