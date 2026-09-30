import React from 'react';
import { ShieldCheck, Building2, RotateCcw, Database, LogOut, User } from 'lucide-react';
import { UserAccount } from '../types';

export type ActiveModule = 'overview' | 'production' | 'storage' | 'transportation' | 'deliveries' | 'demand';

interface NavbarProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  onOpenTraceability: () => void;
  onOpenCompanyInfo: () => void;
  onOpenMongoStudio: () => void;
  onResetDb: () => void;
  currentUser?: UserAccount | null;
  onLogout?: () => void;
  isResetting?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeModule,
  onSelectModule,
  onOpenTraceability,
  onOpenCompanyInfo,
  onOpenMongoStudio,
  onResetDb,
  currentUser,
  onLogout,
  isResetting
}) => {
  const navItems: Array<{ id: ActiveModule; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'production', label: 'Production' },
    { id: 'storage', label: 'Storage' },
    { id: 'transportation', label: 'Transportation' },
    { id: 'deliveries', label: 'Deliveries' },
    { id: 'demand', label: 'Demand Forecasting' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element Brand Title */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectModule('overview');
            }}
            className="text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors flex items-center gap-2"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Vanguard H2 Digital Tracking
          </a>
          <button
            onClick={onOpenMongoStudio}
            className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 hover:bg-emerald-900/40 transition-colors cursor-pointer"
            title="Open live MongoDB Document Studio & Collections"
          >
            <Database className="w-3 h-3" />
            MongoDB Connected
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-medium">
          {navItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMongoStudio}
            title="Directly edit MongoDB collections, insert documents, or modify JSON"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-700/80 rounded-lg hover:bg-emerald-900/60 transition-colors whitespace-nowrap"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">MongoDB</span> Studio
          </button>

          <button
            onClick={onOpenTraceability}
            title="Inspect end-to-end batch supply chain passport"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:border-cyan-500/50 transition-colors whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Audit</span> Traceability
          </button>

          <button
            onClick={onOpenCompanyInfo}
            title="View corporate profile, infrastructure & certifications"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Building2 className="w-3.5 h-3.5" />
            Company Profile
          </button>

          <button
            onClick={onResetDb}
            disabled={isResetting}
            title="Restore initial demonstration records"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
          </button>

          {/* User profile & Logout */}
          {currentUser && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="hidden lg:block text-right">
                <span className="text-xs font-semibold text-white block leading-tight truncate max-w-[140px]">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono block leading-tight">
                  {currentUser.role}
                </span>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  title="Sign out of session"
                  className="flex items-center gap-1 p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="md:hidden flex items-center gap-1 overflow-x-auto pt-2.5 mt-2 border-t border-slate-800/60 no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap ${
                isActive
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
