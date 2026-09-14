// Navbar component — OceanGuard
import { Link, useLocation } from 'react-router-dom';
import {
  Shield, Bell, Settings, Menu, X, Radio, ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { scenarios } from '../../data/spills';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/spill-detection', label: 'Spill Detection' },
  { to: '/map', label: 'Marine Map' },
  { to: '/ais-correlation', label: 'AIS Analysis' },
  { to: '/alerts', label: 'Alerts' },
  { to: '/reports', label: 'Reports' },
];

export default function Navbar() {
  const location = useLocation();
  const { alerts, sidebarOpen, setSidebarOpen, activeScenario, loadScenario, addToast, stats } = useApp();
  const unreadAlerts = alerts.filter(a => !a.acknowledged).length;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-900/95 border-b border-cyan-500/10 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden btn-icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Shield size={22} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-cyan-400 rounded-full animate-ping-slow" />
            </div>
            <span className="font-bold text-white text-base tracking-tight">
              Ocean<span className="text-cyan-400">Guard</span>
            </span>
          </Link>

          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 ml-2 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
            <Radio size={10} className="text-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-medium">LIVE</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ to, label }) => {
            const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-navy-700'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Scenario selector */}
          <div className="hidden md:flex items-center">
            <div className="relative group">
              <button className="flex items-center gap-2 bg-navy-700 border border-cyan-500/20 hover:border-cyan-500/40 rounded-lg px-3 py-1.5 text-sm text-cyan-300 transition-all">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="truncate max-w-[140px]">Demo Scenario</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              <div className="absolute right-0 top-full mt-1 w-80 bg-navy-800 border border-cyan-500/20 rounded-xl shadow-panel z-50 hidden group-hover:block">
                <div className="p-2">
                  <div className="text-xs text-gray-500 uppercase tracking-wider px-2 py-1 mb-1">Load Demo Scenario</div>
                  {scenarios.map(sc => (
                    <button
                      key={sc.id}
                      onClick={() => loadScenario(sc)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all hover:bg-navy-700 ${
                        activeScenario.id === sc.id ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'text-gray-300'
                      }`}
                    >
                      <div className="font-medium">{sc.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{sc.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <Link to="/alerts" className="relative btn-icon">
            <Bell size={18} />
            {unreadAlerts > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                {unreadAlerts}
              </span>
            )}
          </Link>

          {/* Settings */}
          <button className="btn-icon">
            <Settings size={18} />
          </button>

          {/* Demo badge */}
          <div className="bg-amber-500/15 border border-amber-500/30 rounded-lg px-2 py-1">
            <span className="text-amber-400 text-xs font-semibold">DEMO</span>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {sidebarOpen && (
        <div className="lg:hidden border-t border-cyan-500/10 bg-navy-900/98 px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active ? 'bg-cyan-500/15 text-cyan-400' : 'text-gray-400 hover:text-white hover:bg-navy-700'
                }`}
              >
                {label}
              </Link>
            );
          })}
          {/* Mobile scenario selector */}
          <div className="pt-2 border-t border-cyan-500/10">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 px-1">Load Scenario</div>
            {scenarios.map(sc => (
              <button
                key={sc.id}
                onClick={() => { loadScenario(sc); setSidebarOpen(false); }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-all ${
                  activeScenario.id === sc.id ? 'bg-cyan-500/10 text-cyan-300' : 'text-gray-400 hover:bg-navy-700'
                }`}
              >
                {sc.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
