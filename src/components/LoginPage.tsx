import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building2,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { UserAccount } from '../types';
import { api } from '../services/api';

interface LoginPageProps {
  onLoginSuccess: (user: UserAccount, token: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Registration state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserAccount['role']>('Operations Engineer');
  const [regDepartment, setRegDepartment] = useState('Electrolysis Process Operations');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [demoUsers, setDemoUsers] = useState<UserAccount[]>([]);

  useEffect(() => {
    // Load directory of available demo profiles
    api.getUsers()
      .then(users => setDemoUsers(users))
      .catch(err => console.warn('Could not load demo user directory', err));
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your corporate email address');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.login(email, password);
      if (rememberMe) {
        localStorage.setItem('vanguard_h2_user', JSON.stringify(res.user));
        localStorage.setItem('vanguard_h2_token', res.token);
      }
      onLoginSuccess(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) {
      setError('Please fill out all required registration fields');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.register({
        name: regName,
        email: regEmail,
        password: regPassword || 'password123',
        role: regRole,
        department: regDepartment
      });
      if (rememberMe) {
        localStorage.setItem('vanguard_h2_user', JSON.stringify(res.user));
        localStorage.setItem('vanguard_h2_token', res.token);
      }
      onLoginSuccess(res.user, res.token);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDemoUser = (user: UserAccount) => {
    setEmail(user.email);
    setPassword('password123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background industrial grid & glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(6,182,212,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top corporate bar */}
      <header className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-400 font-bold">
            H2
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
              <span>Vanguard Hydrogen Technologies</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-400">Enterprise Hydrogen Supply Chain Digital Tracking Portal</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-2.5 py-1 rounded">
          <ShieldCheck className="w-3.5 h-3.5" />
          ISO 14687:2019 Certified
        </div>
      </header>

      {/* Center login box */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex p-3 rounded-2xl bg-cyan-950/50 border border-cyan-800/60 text-cyan-400 mb-3 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Hydrogen Supply Chain Portal Authentication
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Secure digital access to hydrogen generation monitoring, cryogenic storage vessels, logistics dispatch, and predictive demand modeling.
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 mb-6">
            <button
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'signin'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In to System
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'register'
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Register New Personnel
            </button>
          </div>

          {/* Alert Message */}
          {error && (
            <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800/80 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Sign In Form */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1.5 flex items-center justify-between">
                  <span>Corporate Supply Chain Email</span>
                  <span className="text-[11px] text-slate-500 font-mono">@vanguard-h2.com</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. watson.engineer@vanguard-h2.com"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  Security Passkey / Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security password (or use one-click demo profiles below)"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-cyan-600 focus:ring-cyan-500/20"
                  />
                  <span>Persist workstation session</span>
                </label>
                <span className="text-[11px] text-slate-500">MERN Token Auth</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Authenticating with System...' : 'Authenticate & Enter Dashboard'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          )}

          {/* Registration Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name & Title</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Dr. Arthur Vance"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="user@vanguard-h2.com"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create security password"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Security Role</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Operations Engineer">Operations Engineer</option>
                    <option value="Fleet Dispatcher">Fleet Dispatcher</option>
                    <option value="Commercial Lead">Commercial Lead</option>
                    <option value="System Administrator">System Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assigned Department</label>
                  <input
                    type="text"
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-cyan-600 hover:bg-cyan-500 rounded-xl transition-colors cursor-pointer mt-2"
              >
                {loading ? 'Registering...' : 'Provision User Account in MongoDB'}
              </button>
            </form>
          )}

          {/* Quick Demo Logins Section */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Quick One-Click Demo Access
              </span>
              <span className="text-[11px] text-slate-500">Auto-fills credentials</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {demoUsers.map((u) => {
                const isSelected = email === u.email;
                return (
                  <button
                    key={u._id}
                    type="button"
                    onClick={() => handleSelectDemoUser(u)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500/80 text-white shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-mono text-cyan-400 font-semibold">{u.role}</span>
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                    </div>
                    <div className="font-medium text-white truncate">{u.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">{u.email}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Footer info bar */}
      <footer className="relative z-10 px-6 py-4 border-t border-slate-800/80 bg-slate-950/60 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Vanguard Hydrogen Technologies · Zero-Emission Supply Chain Platform</span>
          <div className="flex items-center gap-3 text-[11px]">
            <span>MERN Stack (MongoDB / Express / React / Node)</span>
            <span>·</span>
            <span>AES-256 Enterprise Token Encryption</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
