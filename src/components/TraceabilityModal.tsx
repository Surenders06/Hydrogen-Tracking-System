import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle, ShieldCheck, Factory, Cylinder, Truck, Building2, Hash, Calendar, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { TraceChain } from '../types';

interface TraceabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const TraceabilityModal: React.FC<TraceabilityModalProps> = ({
  isOpen,
  onClose,
  initialQuery = 'H2-PRD-2026-0891'
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [traceData, setTraceData] = useState<TraceChain | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrace = async (q: string) => {
    if (!q) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTraceability(q);
      setTraceData(data);
    } catch (err: any) {
      setError(err.message || 'Failed to locate trace record');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setQuery(initialQuery);
      fetchTrace(initialQuery);
    }
  }, [isOpen, initialQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              Digital Supply Chain Passport & Traceability
            </div>
            <h2 className="text-xl font-bold text-white mt-1">
              End-to-End Chain of Custody Audit
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cryptographically verified journey from green power generation to final customer offload
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar & quick chips */}
        <div className="mt-4 pb-3 border-b border-slate-800/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchTrace(query);
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter Batch ID (e.g. H2-PRD-2026-0891) or Shipment (SHP-H2-26-0412)..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
            >
              {loading ? 'Searching...' : 'Trace Journey'}
            </button>
          </form>

          <div className="flex items-center gap-2 mt-2.5 text-xs text-slate-400">
            <span>Quick Audit:</span>
            <button
              onClick={() => {
                setQuery('H2-PRD-2026-0891');
                fetchTrace('H2-PRD-2026-0891');
              }}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono transition-colors"
            >
              H2-PRD-2026-0891 (PEM)
            </button>
            <button
              onClick={() => {
                setQuery('H2-PRD-2026-0892');
                fetchTrace('H2-PRD-2026-0892');
              }}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono transition-colors"
            >
              H2-PRD-2026-0892 (Cryo)
            </button>
            <button
              onClick={() => {
                setQuery('PO-HYU-88219');
                fetchTrace('PO-HYU-88219');
              }}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono transition-colors"
            >
              PO-HYU-88219 (Mobility)
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto mt-4 space-y-6 pr-1">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800 rounded-lg text-red-300 text-xs">
              {error}
            </div>
          )}

          {traceData && (
            <div className="space-y-6">
              {/* Certificate badge */}
              <div className="p-3.5 bg-emerald-950/20 border border-emerald-800/40 rounded-lg flex items-center justify-between">
                <div>
                  <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    Green Clean Hydrogen Certified
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {traceData.certifications.isoStandard} · Carbon Intensity: {traceData.certifications.carbonIntensity}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Tamper-Proof Digital Hash</span>
                  <span className="text-xs font-mono text-slate-300">{traceData.certifications.tamperProofHash}</span>
                </div>
              </div>

              {/* Step 1: Production Batch */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold text-xs">
                      01
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <Factory className="w-4 h-4 text-cyan-400" />
                        Electrolyzer Generation & Batch Verification
                      </h4>
                      <p className="text-xs text-slate-400">
                        Origin: {traceData.productionBatch?.facility}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-cyan-300 font-semibold px-2 py-0.5 bg-cyan-950/80 border border-cyan-800/60 rounded">
                    {traceData.productionBatch?.batchId}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 mt-3 text-xs bg-slate-900/60 p-3 rounded border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Stack Technology</span>
                    <span className="font-medium text-slate-200">{traceData.productionBatch?.technology}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Energy Origin</span>
                    <span className="font-medium text-emerald-400">{traceData.productionBatch?.energySource}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Mass Produced</span>
                    <span className="font-mono font-medium text-slate-200">{traceData.productionBatch?.quantityKg?.toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tested Purity</span>
                    <span className="font-mono font-medium text-cyan-400">{traceData.productionBatch?.purityPercent}% Grade 5</span>
                  </div>
                </div>
              </div>

              {/* Arrow connector */}
              <div className="flex justify-center -my-3">
                <div className="p-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                </div>
              </div>

              {/* Step 2: Storage Vessel */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800 flex items-center justify-center text-indigo-400 font-bold text-xs">
                      02
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <Cylinder className="w-4 h-4 text-indigo-400" />
                        Storage Vessel Allocation & Conditioning
                      </h4>
                      <p className="text-xs text-slate-400">
                        Facility Tank: {traceData.storageTank?.tankName} ({traceData.storageTank?.tankId})
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-indigo-300 font-semibold px-2 py-0.5 bg-indigo-950/80 border border-indigo-800/60 rounded">
                    {traceData.storageTank?.type}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 mt-3 text-xs bg-slate-900/60 p-3 rounded border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Operating Pressure</span>
                    <span className="font-mono font-medium text-slate-200">{traceData.storageTank?.pressureBar} bar</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Operating Temp</span>
                    <span className="font-mono font-medium text-slate-200">{traceData.storageTank?.temperatureCelsius} °C</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Active Stock In Vessel</span>
                    <span className="font-mono font-medium text-slate-200">{traceData.storageTank?.currentStockKg?.toLocaleString()} / {traceData.storageTank?.maxCapacityKg?.toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Safety Relief Status</span>
                    <span className="font-medium text-emerald-400">{traceData.storageTank?.safetyReliefValveStatus}</span>
                  </div>
                </div>
              </div>

              {/* Arrow connector */}
              <div className="flex justify-center -my-3">
                <div className="p-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                </div>
              </div>

              {/* Step 3: Logistics Transport */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800 flex items-center justify-center text-amber-400 font-bold text-xs">
                      03
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <Truck className="w-4 h-4 text-amber-400" />
                        Logistics Movement & In-Transit Telemetry
                      </h4>
                      <p className="text-xs text-slate-400">
                        Shipment: {traceData.transportationShipment?.shipmentNumber} · Carrier: {traceData.transportationShipment?.carrierName}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-amber-300 font-semibold px-2 py-0.5 bg-amber-950/80 border border-amber-800/60 rounded">
                    Status: {traceData.transportationShipment?.status}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 mt-3 text-xs bg-slate-900/60 p-3 rounded border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Vehicle & Trailer</span>
                    <span className="font-mono font-medium text-slate-200">{traceData.transportationShipment?.vehiclePlate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Assigned Driver</span>
                    <span className="font-medium text-slate-200">{traceData.transportationShipment?.driverName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Payload Transferred</span>
                    <span className="font-mono font-medium text-amber-400">{traceData.transportationShipment?.h2PayloadKg?.toLocaleString()} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Latest Checkpoint</span>
                    <span className="font-medium text-slate-300 truncate">{traceData.transportationShipment?.currentCheckpoint}</span>
                  </div>
                </div>
              </div>

              {/* Arrow connector */}
              <div className="flex justify-center -my-3">
                <div className="p-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                </div>
              </div>

              {/* Step 4: Customer Delivery */}
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold text-xs">
                      04
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                        <Building2 className="w-4 h-4 text-emerald-400" />
                        Customer Delivery Acceptance & Offload Sign-Off
                      </h4>
                      <p className="text-xs text-slate-400">
                        Client: {traceData.customerDelivery?.customerName} · Order: {traceData.customerDelivery?.orderNumber}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-emerald-300 font-semibold px-2 py-0.5 bg-emerald-950/80 border border-emerald-800/60 rounded">
                    Status: {traceData.customerDelivery?.status}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 mt-3 text-xs bg-slate-900/60 p-3 rounded border border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Sector / Industry</span>
                    <span className="font-medium text-slate-200">{traceData.customerDelivery?.industry}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Quantity Received</span>
                    <span className="font-mono font-medium text-emerald-400">{traceData.customerDelivery?.quantityDeliveredKg || traceData.customerDelivery?.quantityOrderedKg} kg</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Digital Verification Code</span>
                    <span className="font-mono font-medium text-cyan-400">{traceData.customerDelivery?.digitalSignOffCode || 'VERIFY-PENDING'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Receiver Signature</span>
                    <span className="font-medium text-slate-300">{traceData.customerDelivery?.receiverSignatureName || traceData.customerDelivery?.contactPerson}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Chain timestamp: {traceData ? new Date(traceData.timestamp).toLocaleString() : 'N/A'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
