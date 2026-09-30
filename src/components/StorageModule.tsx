import React, { useState } from 'react';
import { Cylinder, Plus, AlertCircle, Thermometer, Gauge, ShieldAlert, CheckCircle2, Droplets, Trash2, Edit3 } from 'lucide-react';
import { StorageTank } from '../types';

interface StorageModuleProps {
  storageTanks: StorageTank[];
  onCreateTank: (data: Partial<StorageTank>) => Promise<void>;
  onUpdateTank: (id: string, data: Partial<StorageTank>) => Promise<void>;
  onDeleteTank: (id: string) => Promise<void>;
}

export const StorageModule: React.FC<StorageModuleProps> = ({
  storageTanks,
  onCreateTank,
  onUpdateTank,
  onDeleteTank
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTank, setEditingTank] = useState<StorageTank | null>(null);

  const [formData, setFormData] = useState({
    tankId: '',
    tankName: 'Type IV Fast-Fill Buffer #03',
    facility: 'Bharathi Terminal - South Yard',
    type: 'Type IV High Pressure (700 bar)' as StorageTank['type'],
    maxCapacityKg: 4500,
    currentStockKg: 2800,
    pressureBar: 550,
    maxPressureBar: 700,
    temperatureCelsius: 21.5,
    boilOffRatePercentPerDay: 0.0,
    safetyReliefValveStatus: 'Normal' as StorageTank['safetyReliefValveStatus'],
    status: 'Operational' as StorageTank['status'],
    location: 'Zone B - Rapid Dispense Yard'
  });

  const totalCapacity = storageTanks.reduce((s, t) => s + (t.maxCapacityKg || 0), 0);
  const totalStock = storageTanks.reduce((s, t) => s + (t.currentStockKg || 0), 0);
  const totalFillPct = totalCapacity > 0 ? Math.round((totalStock / totalCapacity) * 100) : 0;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateTank(formData);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create storage tank:', err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTank) return;
    try {
      await onUpdateTank(editingTank._id, {
        currentStockKg: Number(editingTank.currentStockKg),
        pressureBar: Number(editingTank.pressureBar),
        temperatureCelsius: Number(editingTank.temperatureCelsius),
        safetyReliefValveStatus: editingTank.safetyReliefValveStatus
      });
      setEditingTank(null);
    } catch (err) {
      console.error('Failed to update storage tank:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
            <Cylinder className="w-4 h-4" />
            Storage & Inventory Management
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Cryogenic & High-Pressure Storage Vessel Farm
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor real-time hydrogen inventory levels, internal barometric pressure, boil-off rates, and safety valve status.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Commission Storage Vessel
        </button>
      </div>

      {/* Aggregate Storage Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Total Terminal Stock</span>
          <div className="text-2xl font-bold text-white font-mono-numbers mt-1">
            {totalStock.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ {totalCapacity.toLocaleString()} kg</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all ${
                totalFillPct > 90 ? 'bg-amber-400' : 'bg-indigo-500'
              }`}
              style={{ width: `${Math.min(100, totalFillPct)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
            <span>Overall Inventory Fill</span>
            <span className="font-mono-numbers font-semibold text-indigo-400">{totalFillPct}%</span>
          </div>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Vessels Under Active Monitoring</span>
          <div className="text-2xl font-bold text-white font-mono-numbers mt-1">
            {storageTanks.length} Units
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            1 Cryogenic Liquid (-253°C) · 2 High-Pressure Type IV (700 bar) · 1 Plant Buffer
          </p>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Safety Relief Valve Integrity</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono-numbers mt-1 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6" />
            100% Nominal
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Automatic blowdown valves tested & compliant with PESO and ISO 19880 standards.
          </p>
        </div>
      </div>

      {/* Storage Tank Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {storageTanks.map((tank) => {
          const fillPct = tank.maxCapacityKg > 0 ? Math.round((tank.currentStockKg / tank.maxCapacityKg) * 100) : 0;
          const pressurePct = tank.maxPressureBar > 0 ? Math.round((tank.pressureBar / tank.maxPressureBar) * 100) : 0;
          const isCryo = tank.type.includes('Cryo');

          return (
            <div
              key={tank._id}
              className="p-5 bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
            >
              {/* Card top */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-950 text-indigo-400 border border-indigo-900/60 rounded">
                      {tank.tankId}
                    </span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-400">{tank.location}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mt-1.5">{tank.tankName}</h3>
                  <p className="text-[11px] text-slate-400">{tank.type}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingTank(tank)}
                    title="Adjust pressure or stock"
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTank(tank._id)}
                    title="Decommission vessel"
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Volume Fill Bar */}
              <div className="mt-4 p-3 bg-slate-950/70 rounded-lg border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-cyan-400" />
                    Storage Volume Fill
                  </span>
                  <span className="font-mono-numbers font-semibold text-white">
                    {tank.currentStockKg.toLocaleString()} / {tank.maxCapacityKg.toLocaleString()} kg ({fillPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      fillPct > 85 ? 'bg-amber-400' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${Math.min(100, fillPct)}%` }}
                  ></div>
                </div>
              </div>

              {/* Gauge telemetry row */}
              <div className="grid grid-cols-3 gap-2.5 mt-3 text-xs">
                {/* Pressure */}
                <div className="p-2.5 bg-slate-950/50 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Gauge className="w-3 h-3 text-slate-400" />
                    Pressure
                  </span>
                  <div className="text-sm font-bold text-white font-mono-numbers mt-0.5">
                    {tank.pressureBar} <span className="text-[10px] text-slate-400 font-normal">/ {tank.maxPressureBar} bar</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono-numbers mt-0.5 block">
                    {pressurePct}% rated cap
                  </span>
                </div>

                {/* Temperature */}
                <div className="p-2.5 bg-slate-950/50 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-slate-400" />
                    Temperature
                  </span>
                  <div className={`text-sm font-bold font-mono-numbers mt-0.5 ${
                    isCryo ? 'text-cyan-300' : 'text-slate-200'
                  }`}>
                    {tank.temperatureCelsius} °C
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {isCryo ? 'Liquid cryogenic' : 'Ambient thermal'}
                  </span>
                </div>

                {/* Valve Status */}
                <div className="p-2.5 bg-slate-950/50 rounded-lg border border-slate-800">
                  <span className="text-[11px] text-slate-500 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-slate-400" />
                    Relief Valve
                  </span>
                  <div className="text-sm font-bold text-emerald-400 font-mono-numbers mt-0.5">
                    {tank.safetyReliefValveStatus}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    {isCryo ? `Boil-off: ${tank.boilOffRatePercentPerDay}%/d` : 'Zero leakage'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Commission New Vessel */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cylinder className="w-4 h-4 text-indigo-400" />
                Commission New Storage Tank Vessel
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Vessel Designation Name</label>
                <input
                  type="text"
                  required
                  value={formData.tankName}
                  onChange={(e) => setFormData({ ...formData, tankName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Tank Vessel Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Type IV High Pressure (700 bar)">Type IV High Pressure (700 bar)</option>
                    <option value="Cryogenic Liquid H2 (-253°C)">Cryogenic Liquid H2 (-253°C)</option>
                    <option value="Type I Industrial Tube Buffer (250 bar)">Type I Industrial Tube Buffer (250 bar)</option>
                    <option value="Salt Cavern Buffer">Salt Cavern Buffer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Maximum Capacity (kg)</label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={formData.maxCapacityKg}
                    onChange={(e) => setFormData({ ...formData, maxCapacityKg: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Initial Stock Level (kg)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.currentStockKg}
                    onChange={(e) => setFormData({ ...formData, currentStockKg: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Rated Pressure (bar)</label>
                  <input
                    type="number"
                    required
                    value={formData.maxPressureBar}
                    onChange={(e) => setFormData({ ...formData, maxPressureBar: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Commission Vessel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Tank */}
      {editingTank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                Adjust {editingTank.tankName} ({editingTank.tankId})
              </h3>
              <button onClick={() => setEditingTank(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleUpdate} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Current Stock Level (kg)</label>
                <input
                  type="number"
                  min="0"
                  max={editingTank.maxCapacityKg}
                  value={editingTank.currentStockKg}
                  onChange={(e) => setEditingTank({ ...editingTank, currentStockKg: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Pressure (bar)</label>
                  <input
                    type="number"
                    value={editingTank.pressureBar}
                    onChange={(e) => setEditingTank({ ...editingTank, pressureBar: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Temperature (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingTank.temperatureCelsius}
                    onChange={(e) => setEditingTank({ ...editingTank, temperatureCelsius: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Safety Relief Valve Status</label>
                <select
                  value={editingTank.safetyReliefValveStatus}
                  onChange={(e) => setEditingTank({ ...editingTank, safetyReliefValveStatus: e.target.value as any })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                >
                  <option value="Normal">Normal</option>
                  <option value="Active Release">Active Release</option>
                  <option value="Inspection Required">Inspection Required</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTank(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Update Telemetry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
