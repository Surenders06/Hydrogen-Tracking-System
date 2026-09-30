import React, { useState } from 'react';
import { Factory, Plus, Search, Filter, ShieldCheck, CheckCircle2, Zap, ArrowUpRight, Trash2, Edit3 } from 'lucide-react';
import { ProductionRecord, StorageTank } from '../types';

interface ProductionModuleProps {
  productions: ProductionRecord[];
  storageTanks: StorageTank[];
  onCreateBatch: (data: Partial<ProductionRecord>) => Promise<void>;
  onUpdateBatch: (id: string, data: Partial<ProductionRecord>) => Promise<void>;
  onDeleteBatch: (id: string) => Promise<void>;
  onTraceBatch: (batchId: string) => void;
}

export const ProductionModule: React.FC<ProductionModuleProps> = ({
  productions,
  storageTanks,
  onCreateBatch,
  onUpdateBatch,
  onDeleteBatch,
  onTraceBatch
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [techFilter, setTechFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingBatch, setEditingBatch] = useState<ProductionRecord | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    batchId: '',
    electrolyzerUnit: 'PEM Stack Unit #03',
    technology: 'PEM Electrolyzer' as ProductionRecord['technology'],
    energySource: '100% Solar Green' as ProductionRecord['energySource'],
    purityPercent: 99.9992,
    quantityKg: 2100,
    pressureBar: 350,
    costPerKg: 3.80,
    productionDate: new Date().toISOString().split('T')[0],
    shift: 'Day Shift' as ProductionRecord['shift'],
    operator: 'E. Watson (Principal Process Eng)',
    status: 'Completed' as ProductionRecord['status'],
    assignedStorageTankId: storageTanks[0]?.tankId || 'TK-700-01',
    notes: 'Nominal cell voltage 1.81V, certified green hydrogen production run.'
  });

  const filtered = productions.filter(p => {
    const matchesSearch = p.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.electrolyzerUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.operator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTech = techFilter === 'all' || p.technology.toLowerCase().includes(techFilter.toLowerCase());
    return matchesSearch && matchesTech;
  });

  const totalKg = productions.reduce((sum, p) => sum + (p.quantityKg || 0), 0);
  const avgPurity = productions.length > 0
    ? (productions.reduce((sum, p) => sum + (p.purityPercent || 0), 0) / productions.length).toFixed(4)
    : '99.9990';
  const greenShare = Math.round(
    (productions.filter(p => p.energySource.includes('Green') || p.energySource.includes('Solar') || p.energySource.includes('Wind')).length / (productions.length || 1)) * 100
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onCreateBatch(formData);
      setIsModalOpen(false);
      // Reset form
      setFormData({
        ...formData,
        batchId: '',
        quantityKg: 2000
      });
    } catch (err) {
      console.error('Failed to create batch:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Metric Summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold uppercase tracking-wider">
            <Factory className="w-4 h-4" />
            Production & Electrolysis Management
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Electrolyzer Batch Generation & Digital Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Log green hydrogen production runs, verify gas purity standards, and automatically allocate to storage tanks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Record Production Batch
          </button>
        </div>
      </div>

      {/* Production KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Total Output</span>
          <div className="text-xl font-bold text-white font-mono-numbers mt-1">
            {totalKg.toLocaleString()} <span className="text-xs font-normal text-slate-400">kg H2</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across {productions.length} logged batches</span>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Average Gas Purity</span>
          <div className="text-xl font-bold text-cyan-400 font-mono-numbers mt-1">
            {avgPurity}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">ISO 14687 Fuel Cell Grade</span>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Green Energy Index</span>
          <div className="text-xl font-bold text-emerald-400 font-mono-numbers mt-1">
            {greenShare}% Renewable
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Solar & Wind Farm Power</span>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Active Electrolyzer Stacks</span>
          <div className="text-xl font-bold text-white font-mono-numbers mt-1">
            3 Online <span className="text-xs font-normal text-slate-400">/ 1 Standby</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">PEM & Alkaline Generation</span>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Batch ID, operator, or stack..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Segmented filter controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 w-full sm:w-auto">
          {['all', 'PEM', 'Alkaline', 'AEM'].map((tech) => (
            <button
              key={tech}
              onClick={() => setTechFilter(tech)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                techFilter === tech
                  ? 'bg-slate-800 text-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tech === 'all' ? 'All Stacks' : tech}
            </button>
          ))}
        </div>
      </div>

      {/* Batches Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/50">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Batch ID & Date</th>
              <th className="py-3 px-4 font-semibold">Electrolyzer & Technology</th>
              <th className="py-3 px-4 font-semibold">Energy Source</th>
              <th className="py-3 px-4 font-semibold text-right">Mass (kg)</th>
              <th className="py-3 px-4 font-semibold text-right">Purity</th>
              <th className="py-3 px-4 font-semibold">Target Storage</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  No production records matched your search criteria.
                </td>
              </tr>
            ) : (
              filtered.map((batch) => (
                <tr key={batch._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-semibold text-cyan-400 block">{batch.batchId}</span>
                    <span className="text-[11px] text-slate-500">{batch.productionDate} · {batch.shift}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-white block">{batch.electrolyzerUnit}</span>
                    <span className="text-[11px] text-slate-400">{batch.technology}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-400 font-medium block">{batch.energySource}</span>
                    <span className="text-[11px] text-slate-500">Op: {batch.operator}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono-numbers text-white font-semibold">
                    {batch.quantityKg.toLocaleString()} kg
                  </td>
                  <td className="py-3 px-4 text-right font-mono-numbers text-cyan-400 font-medium">
                    {batch.purityPercent}%
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-slate-300 text-[11px] px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                      {batch.assignedStorageTankId || 'Auto-Buffer'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-300">
                      {batch.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingBatch({ ...batch })}
                        title="Edit batch record parameters"
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onTraceBatch(batch.batchId)}
                        title="Audit full supply chain journey for this batch"
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteBatch(batch._id)}
                        title="Remove batch record"
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Record Production Batch */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Factory className="w-4 h-4 text-cyan-400" />
                Record New Hydrogen Production Batch
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Electrolyzer Stack Unit</label>
                  <input
                    type="text"
                    required
                    value={formData.electrolyzerUnit}
                    onChange={(e) => setFormData({ ...formData, electrolyzerUnit: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Stack Technology</label>
                  <select
                    value={formData.technology}
                    onChange={(e) => setFormData({ ...formData, technology: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="PEM Electrolyzer">PEM Electrolyzer</option>
                    <option value="Alkaline Electrolyzer">Alkaline Electrolyzer</option>
                    <option value="AEM Electrolyzer">AEM Electrolyzer</option>
                    <option value="Solid Oxide (SOEC)">Solid Oxide (SOEC)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Clean Energy Source</label>
                  <select
                    value={formData.energySource}
                    onChange={(e) => setFormData({ ...formData, energySource: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="100% Solar Green">100% Solar Green</option>
                    <option value="Wind Farm Green">Wind Farm Green</option>
                    <option value="Solar-Wind Hybrid">Solar-Wind Hybrid</option>
                    <option value="Hydroelectric">Hydroelectric</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Hydrogen Output (kg)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantityKg}
                    onChange={(e) => setFormData({ ...formData, quantityKg: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Tested Purity (%)</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="99.0"
                    max="100"
                    required
                    value={formData.purityPercent}
                    onChange={(e) => setFormData({ ...formData, purityPercent: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Pressure (bar)</label>
                  <input
                    type="number"
                    value={formData.pressureBar}
                    onChange={(e) => setFormData({ ...formData, pressureBar: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Destination Tank</label>
                  <select
                    value={formData.assignedStorageTankId}
                    onChange={(e) => setFormData({ ...formData, assignedStorageTankId: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  >
                    {storageTanks.map(t => (
                      <option key={t._id} value={t.tankId}>
                        {t.tankId} ({t.type.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Process Operator</label>
                  <input
                    type="text"
                    value={formData.operator}
                    onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Production Shift</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Day Shift">Day Shift</option>
                    <option value="Night Shift">Night Shift</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Operational & Quality Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white resize-none"
                />
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
                  disabled={submitting}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors"
                >
                  {submitting ? 'Recording...' : 'Commit Batch Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Production Batch */}
      {editingBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                Edit Batch {editingBatch.batchId}
              </h3>
              <button
                onClick={() => setEditingBatch(null)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                try {
                  await onUpdateBatch(editingBatch._id, editingBatch);
                  setEditingBatch(null);
                } catch (err) {
                  console.error(err);
                } finally {
                  setSubmitting(false);
                }
              }}
              className="mt-4 space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Batch Identifier</label>
                  <input
                    type="text"
                    required
                    value={editingBatch.batchId}
                    onChange={(e) => setEditingBatch({ ...editingBatch, batchId: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Electrolyzer Stack Unit</label>
                  <input
                    type="text"
                    required
                    value={editingBatch.electrolyzerUnit}
                    onChange={(e) => setEditingBatch({ ...editingBatch, electrolyzerUnit: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Production Technology</label>
                  <select
                    value={editingBatch.technology}
                    onChange={(e) => setEditingBatch({ ...editingBatch, technology: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="PEM Electrolyzer">PEM Electrolyzer</option>
                    <option value="Alkaline Electrolyzer">Alkaline Electrolyzer</option>
                    <option value="AEM Electrolyzer">AEM Electrolyzer</option>
                    <option value="Solid Oxide (SOEC)">Solid Oxide (SOEC)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Clean Energy Source</label>
                  <select
                    value={editingBatch.energySource}
                    onChange={(e) => setEditingBatch({ ...editingBatch, energySource: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="100% Solar Green">100% Solar Green</option>
                    <option value="Wind Farm Green">Wind Farm Green</option>
                    <option value="Solar-Wind Hybrid">Solar-Wind Hybrid</option>
                    <option value="Hydroelectric">Hydroelectric</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Quantity (kg H2)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingBatch.quantityKg}
                    onChange={(e) => setEditingBatch({ ...editingBatch, quantityKg: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Tested Purity (%)</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="99.0"
                    max="100"
                    required
                    value={editingBatch.purityPercent}
                    onChange={(e) => setEditingBatch({ ...editingBatch, purityPercent: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Pressure (bar)</label>
                  <input
                    type="number"
                    value={editingBatch.pressureBar}
                    onChange={(e) => setEditingBatch({ ...editingBatch, pressureBar: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Assigned Storage Vessel</label>
                  <select
                    value={editingBatch.assignedStorageTankId}
                    onChange={(e) => setEditingBatch({ ...editingBatch, assignedStorageTankId: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  >
                    {storageTanks.map(t => (
                      <option key={t._id} value={t.tankId}>
                        {t.tankId} ({t.type.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={editingBatch.status}
                    onChange={(e) => setEditingBatch({ ...editingBatch, status: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Production">In Production</option>
                    <option value="Quality Check">Quality Check</option>
                    <option value="Scheduled">Scheduled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Lead Operator</label>
                  <input
                    type="text"
                    value={editingBatch.operator}
                    onChange={(e) => setEditingBatch({ ...editingBatch, operator: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Unit Cost ($/kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={editingBatch.costPerKg}
                    onChange={(e) => setEditingBatch({ ...editingBatch, costPerKg: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={editingBatch.notes}
                  onChange={(e) => setEditingBatch({ ...editingBatch, notes: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBatch(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors"
                >
                  {submitting ? 'Saving...' : 'Update Batch in MongoDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
