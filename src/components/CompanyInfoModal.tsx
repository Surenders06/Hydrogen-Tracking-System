import React from 'react';
import { X, Building2, ShieldCheck, Database, Server, Monitor, Layers, CheckCircle2, Globe, Cpu } from 'lucide-react';

interface CompanyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompanyInfoModal: React.FC<CompanyInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              Corporate Profile & System Overview
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              Vanguard Hydrogen Technologies
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enterprise digital monitoring platform for commercial hydrogen generation, terminal storage, fleet logistics & predictive dispatch.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Company Brief */}
          <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="font-semibold text-white text-sm">Industrial Clean Energy Network</span>
              <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ISO 14687 Certified
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Vanguard Hydrogen Technologies operates integrated clean hydrogen production complexes, cryogenic liquefaction trains, and high-pressure cascade dispense hubs. Our digital tracking platform provides unbroken chain-of-custody tracking from renewable power generation to end-customer offloading.
            </p>
          </div>

          {/* Operational Infrastructure */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              Production & Logistics Infrastructure
            </h3>
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
                <span className="text-slate-400 text-[11px] block">Generation Hub Alpha</span>
                <span className="font-semibold text-white">Coastal Electrolyzer Complex</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Multi-megawatt PEM and alkaline electrolysis powered by co-located offshore wind and solar PV arrays.
                </p>
              </div>

              <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
                <span className="text-slate-400 text-[11px] block">Distribution Terminal Beta</span>
                <span className="font-semibold text-white">Central Cryo & Cascade Depot</span>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Liquid LH2 spherical containment (-253°C) and 700-bar rapid dispense tube trailer buffer banks.
                </p>
              </div>
            </div>
          </div>

          {/* Technology Architecture */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Enterprise Platform Architecture
            </h3>
            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
                <div className="flex items-center gap-1.5 text-cyan-400 font-medium mb-1">
                  <Monitor className="w-3.5 h-3.5" />
                  Frontend Portal
                </div>
                <p className="text-slate-300 font-semibold">React 19 & Tailwind</p>
                <p className="text-slate-500 text-[11px] mt-0.5">Real-time telemetry displays, workflow stages, and digital passport audits.</p>
              </div>

              <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium mb-1">
                  <Server className="w-3.5 h-3.5" />
                  Backend Services
                </div>
                <p className="text-slate-300 font-semibold">Node.js + Express</p>
                <p className="text-slate-500 text-[11px] mt-0.5">RESTful dispatch endpoints, electronic BOL verification & real-time telemetry event sync.</p>
              </div>

              <div className="p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
                <div className="flex items-center gap-1.5 text-amber-400 font-medium mb-1">
                  <Database className="w-3.5 h-3.5" />
                  Database Engine
                </div>
                <p className="text-slate-300 font-semibold">MongoDB Document DB</p>
                <p className="text-slate-500 text-[11px] mt-0.5">ACID document transactions, live inventory adjustments, and audit log persistence.</p>
              </div>
            </div>
          </div>

          {/* Standards & Certifications */}
          <div>
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Safety & Regulatory Compliance
            </h3>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-start gap-2 p-2 bg-slate-950/40 rounded border border-slate-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">ISO 14687:2019 Grade D & E: </span>
                  Guaranteed 99.999% purity for proton-exchange membrane fuel cell mobility and industrial reduction applications.
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-slate-950/40 rounded border border-slate-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">ASME Section VIII & Hazmat DOT 407: </span>
                  High-pressure containment vessel inspection, certified burst disks, and real-time transit telemetry tracking.
                </div>
              </div>

              <div className="flex items-start gap-2 p-2 bg-slate-950/40 rounded border border-slate-800/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Gemini 3.8 Flash AI Strategic Forecasting: </span>
                  Predictive supply-demand balancing that models customer consumption patterns to optimize electrolyzer run-rates.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
