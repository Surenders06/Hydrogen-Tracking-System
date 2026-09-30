import React, { useState } from 'react';
import { TrendingUp, Plus, Sparkles, BarChart2, ShieldAlert, ArrowUpRight, CheckCircle2, AlertTriangle, Layers, Trash2, Edit3 } from 'lucide-react';
import { CustomerDemandRecord, ForecastResponse } from '../types';

interface DemandForecastingModuleProps {
  demands: CustomerDemandRecord[];
  aiForecast: ForecastResponse | null;
  forecastProvider: string | null;
  loadingAi: boolean;
  onRunAiForecast: () => Promise<void>;
  onCreateDemand: (data: Partial<CustomerDemandRecord>) => Promise<void>;
  onUpdateDemand: (id: string, data: Partial<CustomerDemandRecord>) => Promise<void>;
  onDeleteDemand: (id: string) => Promise<void>;
}

export const DemandForecastingModule: React.FC<DemandForecastingModuleProps> = ({
  demands,
  aiForecast,
  forecastProvider,
  loadingAi,
  onRunAiForecast,
  onCreateDemand,
  onUpdateDemand,
  onDeleteDemand
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDemand, setEditingDemand] = useState<CustomerDemandRecord | null>(null);
  const [formData, setFormData] = useState({
    customerName: 'Chennai Port Container Eco-Logistics',
    industry: 'Heavy Mobility / Fueling Station',
    month: '2026-06',
    historicalDemandKg: 12000,
    growthFactor: 1.20,
    priorityLevel: 'High' as CustomerDemandRecord['priorityLevel'],
    contractType: 'Take-or-Pay Long Term' as CustomerDemandRecord['contractType']
  });

  const totalHistorical = demands.reduce((s, d) => s + (d.historicalDemandKg || 0), 0);
  const totalForecast = demands.reduce((s, d) => s + (d.forecastDemandKg || 0), 0);
  const overallGrowth = totalHistorical > 0 ? (((totalForecast - totalHistorical) / totalHistorical) * 100).toFixed(1) : '0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateDemand(formData);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create demand forecast record:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            Demand Forecasting & Production Planning
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Customer Demand Analytics & Predictive Dispatch Planning
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Analyze historical customer demand patterns, model upcoming offload volumes, and optimize electrolyzer run-rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRunAiForecast}
            disabled={loadingAi}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 disabled:opacity-50 rounded-lg transition-all shadow-sm"
          >
            <Sparkles className={`w-4 h-4 ${loadingAi ? 'animate-spin' : ''}`} />
            {loadingAi ? 'Synthesizing...' : 'Run Strategic Forecast'}
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Demand Record
          </button>
        </div>
      </div>

      {/* Aggregate Demand Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Baseline Historical Demand</span>
          <div className="text-xl font-bold text-white font-mono-numbers mt-1">
            {totalHistorical.toLocaleString()} <span className="text-xs font-normal text-slate-400">kg/mo</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Aggregated client baseload</span>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Projected Monthly Demand</span>
          <div className="text-xl font-bold text-rose-400 font-mono-numbers mt-1">
            {totalForecast.toLocaleString()} <span className="text-xs font-normal text-slate-400">kg/mo</span>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">+{overallGrowth}% Aggregate Expansion</span>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Quarterly Projection (Q2)</span>
          <div className="text-xl font-bold text-white font-mono-numbers mt-1">
            {(totalForecast * 3).toLocaleString()} <span className="text-xs font-normal text-slate-400">kg H2</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">3-Month rolling cumulative</span>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Supply Buffer Coverage</span>
          <div className="text-xl font-bold text-cyan-400 font-mono-numbers mt-1">
            {aiForecast ? `${aiForecast.storageBufferSufficiencyDays} Days` : '5.4 Days'}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Based on active terminal stock</span>
        </div>
      </div>

      {/* Strategic Forecast Panel (Gemini / Predictive Analytics) */}
      {aiForecast && (
        <div className="p-5 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 border border-indigo-900/50 rounded-xl shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-900/40">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white">
                Strategic Supply-Demand Optimization Plan
              </h3>
              <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 bg-cyan-950/70 border border-cyan-800 rounded">
                Engine: {forecastProvider || 'gemini-3.8-flash'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400">Supply Gap Risk:</span>
              <span className={`px-2 py-0.5 font-bold font-mono rounded ${
                aiForecast.supplyGapRisk === 'LOW'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : aiForecast.supplyGapRisk === 'MODERATE'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-rose-950 text-rose-400 border border-rose-800'
              }`}>
                {aiForecast.supplyGapRisk} RISK
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3.5 rounded-lg border border-slate-800">
            {aiForecast.executiveSummary}
          </p>

          {/* Actionable recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block mb-2">
                Production Target & Scheduling Advice
              </span>
              <div className="mb-2 text-slate-200">
                Electrolyzer Daily Target: <span className="font-mono text-cyan-300 font-bold">{aiForecast.dailyElectrolyzerTargetKg.toLocaleString()} kg/day</span>
              </div>
              <ul className="space-y-1.5 text-slate-300">
                {aiForecast.productionRecommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800/80">
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block mb-2">
                Sector Trend Insights
              </span>
              <div className="space-y-2">
                {aiForecast.industryInsights.map((ins, i) => (
                  <div key={i} className="text-[11px] pb-1.5 border-b border-slate-800/60 last:border-0">
                    <span className="font-semibold text-white block">{ins.sector}</span>
                    <p className="text-slate-400 mt-0.5">{ins.trend}</p>
                    <p className="text-indigo-300 mt-0.5">Rec: {ins.recommendation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Historical vs Forecast Comparison Ledger */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-white">
          Client Demand Forecast Ledger (Contractual Quotas vs Projected)
        </h3>

        <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/50">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Customer & Industry</th>
                <th className="py-3 px-4 font-semibold">Contract Type</th>
                <th className="py-3 px-4 font-semibold">Target Period</th>
                <th className="py-3 px-4 font-semibold text-right">Historical Demand</th>
                <th className="py-3 px-4 font-semibold text-right">Forecast Demand</th>
                <th className="py-3 px-4 font-semibold text-right">Growth Rate</th>
                <th className="py-3 px-4 font-semibold">Priority</th>
                <th className="py-3 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {demands.map((item) => {
                const growth = item.variancePercent;
                return (
                  <tr key={item._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-medium text-white block">{item.customerName}</span>
                      <span className="text-[11px] text-slate-400">{item.industry}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {item.contractType}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {item.month}
                    </td>
                    <td className="py-3 px-4 text-right font-mono-numbers text-slate-300">
                      {item.historicalDemandKg.toLocaleString()} kg
                    </td>
                    <td className="py-3 px-4 text-right font-mono-numbers text-rose-400 font-semibold">
                      {item.forecastDemandKg.toLocaleString()} kg
                    </td>
                    <td className="py-3 px-4 text-right font-mono-numbers text-emerald-400 font-medium">
                      +{growth}%
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs font-semibold text-slate-300">
                        {item.priorityLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setEditingDemand({ ...item })}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                          title="Edit demand forecast parameters"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteDemand(item._id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                          title="Delete demand record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Demand Record */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-rose-400" />
                Add Customer Demand Forecast Record
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Industrial Sector</label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Heavy Mobility / Fueling Station">Heavy Mobility / Fueling Station</option>
                  <option value="Green Steel DRI Plant">Green Steel DRI Plant</option>
                  <option value="Chemical & Ammonia Synthesis">Chemical & Ammonia Synthesis</option>
                  <option value="Semiconductor Fabrication">Semiconductor Fabrication</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Historical Demand (kg)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={formData.historicalDemandKg}
                    onChange={(e) => setFormData({ ...formData, historicalDemandKg: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Growth Multiplier (e.g. 1.15)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="3.0"
                    required
                    value={formData.growthFactor}
                    onChange={(e) => setFormData({ ...formData, growthFactor: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Target Month</label>
                  <input
                    type="month"
                    required
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Priority Level</label>
                  <select
                    value={formData.priorityLevel}
                    onChange={(e) => setFormData({ ...formData, priorityLevel: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Commit Demand Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Demand Record */}
      {editingDemand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-rose-400" />
                Edit Demand: {editingDemand.customerName}
              </h3>
              <button onClick={() => setEditingDemand(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const hist = Number(editingDemand.historicalDemandKg);
                  const factor = Number(editingDemand.growthFactor) || 1.1;
                  const forecast = Math.round(hist * factor);
                  const variance = Math.round(((forecast - hist) / hist) * 1000) / 10;

                  await onUpdateDemand(editingDemand._id, {
                    ...editingDemand,
                    historicalDemandKg: hist,
                    forecastDemandKg: forecast,
                    variancePercent: variance,
                    growthFactor: factor
                  });
                  setEditingDemand(null);
                } catch (err) {
                  console.error(err);
                }
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 mb-1">Customer / Offtaker Name</label>
                <input
                  type="text"
                  required
                  value={editingDemand.customerName}
                  onChange={(e) => setEditingDemand({ ...editingDemand, customerName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Industrial Sector</label>
                <select
                  value={editingDemand.industry}
                  onChange={(e) => setEditingDemand({ ...editingDemand, industry: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Heavy Mobility / Fueling Station">Heavy Mobility / Fueling Station</option>
                  <option value="Green Steel DRI Plant">Green Steel DRI Plant</option>
                  <option value="Chemical & Ammonia Synthesis">Chemical & Ammonia Synthesis</option>
                  <option value="Semiconductor Fabrication">Semiconductor Fabrication</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Historical Demand (kg)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={editingDemand.historicalDemandKg}
                    onChange={(e) => setEditingDemand({ ...editingDemand, historicalDemandKg: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Growth Multiplier</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="3.0"
                    required
                    value={editingDemand.growthFactor}
                    onChange={(e) => setEditingDemand({ ...editingDemand, growthFactor: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Target Period</label>
                  <input
                    type="month"
                    required
                    value={editingDemand.month}
                    onChange={(e) => setEditingDemand({ ...editingDemand, month: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Priority</label>
                  <select
                    value={editingDemand.priorityLevel}
                    onChange={(e) => setEditingDemand({ ...editingDemand, priorityLevel: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Contract Type</label>
                <select
                  value={editingDemand.contractType}
                  onChange={(e) => setEditingDemand({ ...editingDemand, contractType: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Take-or-Pay Long Term">Take-or-Pay Long Term</option>
                  <option value="Fixed Monthly Quota">Fixed Monthly Quota</option>
                  <option value="Spot Contract">Spot Contract</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingDemand(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Update Demand in MongoDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
