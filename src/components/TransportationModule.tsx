import React, { useState } from 'react';
import { Truck, Plus, MapPin, Gauge, Thermometer, ShieldCheck, CheckCircle2, ChevronRight, Navigation, Trash2, ArrowUpRight, Edit3 } from 'lucide-react';
import { TransportShipment, StorageTank, ProductionRecord } from '../types';

interface TransportationModuleProps {
  transports: TransportShipment[];
  storageTanks: StorageTank[];
  productions: ProductionRecord[];
  onDispatchShipment: (data: Partial<TransportShipment>) => Promise<void>;
  onUpdateTransport: (id: string, data: Partial<TransportShipment>) => Promise<void>;
  onAdvanceCheckpoint: (id: string, checkpointName?: string) => Promise<void>;
  onDeleteTransport: (id: string) => Promise<void>;
  onTraceShipment: (shipmentNumber: string) => void;
}

export const TransportationModule: React.FC<TransportationModuleProps> = ({
  transports,
  storageTanks,
  productions,
  onDispatchShipment,
  onUpdateTransport,
  onAdvanceCheckpoint,
  onDeleteTransport,
  onTraceShipment
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingShipment, setEditingShipment] = useState<TransportShipment | null>(null);

  const [formData, setFormData] = useState({
    shipmentNumber: '',
    vehiclePlate: 'TN-09-H2-7801',
    vehicleType: 'Type IV Tube Trailer' as TransportShipment['vehicleType'],
    carrierName: 'Apex Clean Logistics Ltd',
    driverName: 'S. Karthi',
    driverPhone: '+91 98402 44321',
    originFacility: 'Bharathi Terminal, Chennai',
    destination: 'Sriperumbudur Auto Corridor - Hyundai Fueling Station',
    customerName: 'Hyundai Clean Mobility Depot',
    associatedBatchId: productions[0]?.batchId || 'H2-PRD-2026-0891',
    sourceTankId: storageTanks[0]?.tankId || 'TK-700-01',
    h2PayloadKg: 1000,
    pressureBar: 350,
    temperatureCelsius: 22.0,
    totalDistanceKm: 52
  });

  const activeInTransit = transports.filter(t => t.status === 'In Transit').length;
  const totalPayloadMoving = transports
    .filter(t => t.status === 'In Transit' || t.status === 'Dispatched')
    .reduce((s, t) => s + (t.h2PayloadKg || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onDispatchShipment(formData);
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to dispatch shipment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider">
            <Truck className="w-4 h-4" />
            Transportation & Fleet Logistics
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Logistics Fleet, Route Telemetry & Hazmat Tracking
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor high-pressure tube trailers & cryo tankers in transit, trace live route checkpoints, and verify road safety compliance.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Dispatch New Shipment
        </button>
      </div>

      {/* Fleet KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Fleet in Motion</span>
          <div className="text-xl font-bold text-amber-400 font-mono-numbers mt-1">
            {activeInTransit} Trailers Active
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Live GPS Telemetry Connected</span>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Hydrogen In Transit</span>
          <div className="text-xl font-bold text-white font-mono-numbers mt-1">
            {totalPayloadMoving.toLocaleString()} <span className="text-xs font-normal text-slate-400">kg H2</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">En route to industrial buyers</span>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Carrier Partners</span>
          <div className="text-xl font-bold text-white font-mono-numbers mt-1">
            2 Certified Fleets
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Apex Clean & Southern Cryo</span>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Hazmat Safety Score</span>
          <div className="text-xl font-bold text-emerald-400 font-mono-numbers mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" />
            100% Verified
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">PESO & ADR Hazmat Compliant</span>
        </div>
      </div>

      {/* Shipment Cards */}
      <div className="space-y-4">
        {transports.map((shp) => {
          const progressPct = shp.totalDistanceKm > 0
            ? Math.min(100, Math.round((shp.distanceCoveredKm / shp.totalDistanceKm) * 100))
            : 0;

          return (
            <div
              key={shp._id}
              className="p-5 bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
            >
              {/* Header of shipment */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800 text-amber-400">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-white">{shp.shipmentNumber}</span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs text-amber-400 font-semibold">{shp.vehicleType}</span>
                      <span className="text-xs text-slate-500">·</span>
                      <span className="text-xs font-mono text-slate-300">{shp.vehiclePlate}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Carrier: <span className="text-slate-200">{shp.carrierName}</span> · Driver: <span className="text-slate-200">{shp.driverName}</span> ({shp.driverPhone})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    shp.status === 'In Transit'
                      ? 'bg-amber-950/60 text-amber-300 border-amber-800 animate-pulse'
                      : shp.status === 'Arrived'
                      ? 'bg-cyan-950/60 text-cyan-300 border-cyan-800'
                      : shp.status === 'Offloaded'
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {shp.status}
                  </span>

                  <button
                    onClick={() => setEditingShipment({ ...shp })}
                    title="Edit shipment parameters"
                    className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onTraceShipment(shp.shipmentNumber)}
                    title="Audit complete chain of custody"
                    className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteTransport(shp._id)}
                    title="Delete shipment"
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Route & Progress */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Col 1: Origin to Destination */}
                <div className="text-xs space-y-2">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Origin Facility</span>
                    <span className="font-medium text-slate-200">{shp.originFacility}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Destination & Client</span>
                    <span className="font-semibold text-white block">{shp.customerName}</span>
                    <span className="text-slate-400 text-[11px]">{shp.destination}</span>
                  </div>
                </div>

                {/* Col 2: Telemetry in motion */}
                <div className="grid grid-cols-3 gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Payload</span>
                    <span className="font-mono-numbers font-bold text-amber-400 text-sm">{shp.h2PayloadKg} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Tank Pressure</span>
                    <span className="font-mono-numbers font-bold text-white text-sm">{shp.pressureBar} bar</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Temperature</span>
                    <span className="font-mono-numbers font-bold text-white text-sm">{shp.temperatureCelsius} °C</span>
                  </div>
                </div>

                {/* Col 3: Checkpoint Action */}
                <div className="flex flex-col justify-between bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Current Checkpoint</span>
                    <span className="font-medium text-slate-200 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      {shp.currentCheckpoint}
                    </span>
                  </div>

                  {shp.status === 'In Transit' && (
                    <button
                      onClick={() => onAdvanceCheckpoint(shp._id)}
                      className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-700/50 rounded text-xs font-semibold transition-colors"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Advance Route Checkpoint (+15 km)
                    </button>
                  )}
                  {shp.status === 'Arrived' && (
                    <span className="mt-2 text-center text-xs text-cyan-400 font-semibold py-1 bg-cyan-950/50 rounded border border-cyan-800">
                      Ready for Customer Offloading
                    </span>
                  )}
                  {shp.status === 'Offloaded' && (
                    <span className="mt-2 text-center text-xs text-emerald-400 font-semibold py-1 bg-emerald-950/50 rounded border border-emerald-800">
                      Offload Verified & Complete
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/60">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Transit Distance Progress: {shp.distanceCoveredKm} / {shp.totalDistanceKm} km ({progressPct}%)</span>
                  <span>Batch Source: <span className="font-mono text-cyan-400">{shp.associatedBatchId}</span> (from {shp.sourceTankId})</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-1.5 rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Dispatch Shipment */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-400" />
                Dispatch Hydrogen Transport Vehicle
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Vehicle Plate / Registration</label>
                  <input
                    type="text"
                    required
                    value={formData.vehiclePlate}
                    onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Vehicle Type</label>
                  <select
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Type IV Tube Trailer">Type IV Tube Trailer (350/700 bar)</option>
                    <option value="Cryogenic LH2 Tanker">Cryogenic LH2 Tanker (-253°C)</option>
                    <option value="Modular Skid Trailer">Modular Skid Trailer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Source Storage Vessel</label>
                  <select
                    value={formData.sourceTankId}
                    onChange={(e) => setFormData({ ...formData, sourceTankId: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  >
                    {storageTanks.map(t => (
                      <option key={t._id} value={t.tankId}>
                        {t.tankId} (Avail: {t.currentStockKg} kg)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">H2 Payload Weight (kg)</label>
                  <input
                    type="number"
                    min="50"
                    required
                    value={formData.h2PayloadKg}
                    onChange={(e) => setFormData({ ...formData, h2PayloadKg: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Customer / Recipient</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Delivery Destination Address</label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Assigned Driver Name</label>
                  <input
                    type="text"
                    required
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Total Distance (km)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.totalDistanceKm}
                    onChange={(e) => setFormData({ ...formData, totalDistanceKm: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
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
                  disabled={submitting}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors"
                >
                  {submitting ? 'Dispatching...' : 'Dispatch Shipment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Shipment */}
      {editingShipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                Edit Shipment {editingShipment.shipmentNumber}
              </h3>
              <button onClick={() => setEditingShipment(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setSubmitting(true);
                try {
                  await onUpdateTransport(editingShipment._id, editingShipment);
                  setEditingShipment(null);
                } catch (err) {
                  console.error(err);
                } finally {
                  setSubmitting(false);
                }
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Vehicle Plate</label>
                  <input
                    type="text"
                    required
                    value={editingShipment.vehiclePlate}
                    onChange={(e) => setEditingShipment({ ...editingShipment, vehiclePlate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={editingShipment.status}
                    onChange={(e) => setEditingShipment({ ...editingShipment, status: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Arrived">Arrived</option>
                    <option value="Offloaded">Offloaded</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Driver Name</label>
                  <input
                    type="text"
                    required
                    value={editingShipment.driverName}
                    onChange={(e) => setEditingShipment({ ...editingShipment, driverName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Driver Phone</label>
                  <input
                    type="text"
                    value={editingShipment.driverPhone}
                    onChange={(e) => setEditingShipment({ ...editingShipment, driverPhone: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Payload (kg H2)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingShipment.h2PayloadKg}
                    onChange={(e) => setEditingShipment({ ...editingShipment, h2PayloadKg: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Pressure (bar)</label>
                  <input
                    type="number"
                    value={editingShipment.pressureBar}
                    onChange={(e) => setEditingShipment({ ...editingShipment, pressureBar: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Temp (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingShipment.temperatureCelsius}
                    onChange={(e) => setEditingShipment({ ...editingShipment, temperatureCelsius: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Current Checkpoint</label>
                  <input
                    type="text"
                    value={editingShipment.currentCheckpoint}
                    onChange={(e) => setEditingShipment({ ...editingShipment, currentCheckpoint: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Distance Covered (km)</label>
                  <input
                    type="number"
                    value={editingShipment.distanceCoveredKm}
                    onChange={(e) => setEditingShipment({ ...editingShipment, distanceCoveredKm: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Destination</label>
                <input
                  type="text"
                  value={editingShipment.destination}
                  onChange={(e) => setEditingShipment({ ...editingShipment, destination: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingShipment(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors"
                >
                  {submitting ? 'Saving...' : 'Update Shipment in MongoDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
