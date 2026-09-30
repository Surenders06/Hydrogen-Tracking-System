import React from 'react';
import {
  Factory,
  Cylinder,
  Truck,
  Building2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import { DBStats, ProductionRecord, StorageTank, TransportShipment, SystemAlert } from '../types';
import { ActiveModule } from './Navbar';

interface DashboardOverviewProps {
  stats: DBStats | null;
  productions: ProductionRecord[];
  storageTanks: StorageTank[];
  transports: TransportShipment[];
  alerts: SystemAlert[];
  onSelectModule: (module: ActiveModule) => void;
  onOpenTraceability: () => void;
  onResolveAlert: (id: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  stats,
  productions,
  storageTanks,
  transports,
  alerts,
  onSelectModule,
  onOpenTraceability,
  onResolveAlert
}) => {
  const activeAlerts = alerts.filter(a => !a.resolved);

  return (
    <div className="space-y-6">
      {/* Corporate & Operations Overview Banner */}
      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-cyan-400 font-semibold uppercase tracking-wider">Vanguard Hydrogen Technologies</span>
            <span aria-hidden="true">·</span>
            <span>Commercial Supply Chain Network</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white mt-1">
            Enterprise Hydrogen Digital Tracking System
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Centralized digital monitoring of green production, storage inventories, fleet logistics, customer deliveries, and predictive demand planning.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs bg-slate-950/80 p-3 rounded-lg border border-slate-800 shrink-0">
          <div>
            <span className="text-slate-500 block text-[11px]">System Status</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live System Active
            </span>
            <span className="text-slate-400 block font-mono text-[10px]">ISO 14687:2019</span>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div>
            <span className="text-slate-500 block text-[11px]">Commercial Network</span>
            <span className="font-semibold text-slate-200">Complex Alpha & Beta</span>
            <span className="text-slate-400 block text-[10px]">Multi-Regional Hub</span>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards (Tabular Numbers & No Pills) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* KPI 1 */}
        <div
          onClick={() => onSelectModule('production')}
          className="p-4 bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 rounded-xl cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Total Production</span>
            <Factory className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-numbers">
            {stats ? stats.totalProducedKg.toLocaleString() : '---'}
            <span className="text-xs text-slate-400 ml-1 font-sans font-normal">kg H2</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>{productions.length} Batches Logged</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
          </div>
        </div>

        {/* KPI 2 */}
        <div
          onClick={() => onSelectModule('storage')}
          className="p-4 bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 rounded-xl cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Active Storage Stock</span>
            <Cylinder className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-numbers">
            {stats ? stats.totalStockKg.toLocaleString() : '---'}
            <span className="text-xs text-slate-400 ml-1 font-sans font-normal">kg H2</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>{stats ? stats.storageFillPercent : 0}% Terminal Fill</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />
          </div>
        </div>

        {/* KPI 3 */}
        <div
          onClick={() => onSelectModule('transportation')}
          className="p-4 bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 rounded-xl cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Shipments In Transit</span>
            <Truck className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-numbers">
            {stats ? stats.activeShipments : '---'}
            <span className="text-xs text-slate-400 ml-1 font-sans font-normal">Active Trailers</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>{transports.length} Total Dispatches</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
          </div>
        </div>

        {/* KPI 4 */}
        <div
          onClick={() => onSelectModule('deliveries')}
          className="p-4 bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 rounded-xl cursor-pointer transition-colors group"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Customer Deliveries</span>
            <Building2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-numbers">
            {stats ? stats.completedDeliveries : '---'}
            <span className="text-xs text-slate-400 ml-1 font-sans font-normal">Fulfilled</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>{stats ? stats.pendingDeliveries : 0} Orders Queued</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
          </div>
        </div>

        {/* KPI 5 */}
        <div
          onClick={() => onSelectModule('demand')}
          className="p-4 bg-slate-900/70 border border-slate-800 hover:border-rose-500/50 rounded-xl cursor-pointer transition-colors group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Quarterly Demand</span>
            <TrendingUp className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white font-mono-numbers">
            {stats ? (stats.totalDemandKg * 3).toLocaleString() : '---'}
            <span className="text-xs text-slate-400 ml-1 font-sans font-normal">kg H2</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center justify-between">
            <span>Gemini AI Forecast</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-rose-400" />
          </div>
        </div>
      </div>

      {/* Supply Chain Workflow Pipeline */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Integrated Supply Chain End-to-End Workflow
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous operational data flow across production, storage, logistics, delivery, and demand planning.
            </p>
          </div>
          <button
            onClick={onOpenTraceability}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium transition-colors"
          >
            Traceability Audit <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5 mt-4">
          {/* Node 1: Production */}
          <button
            onClick={() => onSelectModule('production')}
            className="p-3 bg-slate-950/70 border border-slate-800 hover:border-cyan-500/60 rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-cyan-400 font-semibold">01</span>
              <Factory className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
            </div>
            <div className="text-xs font-semibold text-white">Production</div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono-numbers">
              {productions.filter(p => p.status === 'Completed').length} Complete
            </div>
          </button>

          {/* Node 2: Storage */}
          <button
            onClick={() => onSelectModule('storage')}
            className="p-3 bg-slate-950/70 border border-slate-800 hover:border-indigo-500/60 rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-indigo-400 font-semibold">02</span>
              <Cylinder className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400" />
            </div>
            <div className="text-xs font-semibold text-white">Storage</div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono-numbers">
              {storageTanks.length} Vessels Monitored
            </div>
          </button>

          {/* Node 3: Transportation */}
          <button
            onClick={() => onSelectModule('transportation')}
            className="p-3 bg-slate-950/70 border border-slate-800 hover:border-amber-500/60 rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-amber-400 font-semibold">03</span>
              <Truck className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
            </div>
            <div className="text-xs font-semibold text-white">Transportation</div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono-numbers">
              {transports.filter(t => t.status === 'In Transit').length} En Route
            </div>
          </button>

          {/* Node 4: Delivery */}
          <button
            onClick={() => onSelectModule('deliveries')}
            className="p-3 bg-slate-950/70 border border-slate-800 hover:border-emerald-500/60 rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-emerald-400 font-semibold">04</span>
              <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400" />
            </div>
            <div className="text-xs font-semibold text-white">Delivery</div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono-numbers">
              {stats?.completedDeliveries || 0} Offloaded
            </div>
          </button>

          {/* Node 5: Customer Demand */}
          <button
            onClick={() => onSelectModule('demand')}
            className="p-3 bg-slate-950/70 border border-slate-800 hover:border-rose-500/60 rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-rose-400 font-semibold">05</span>
              <TrendingUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-400" />
            </div>
            <div className="text-xs font-semibold text-white">Customer Demand</div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono-numbers">
              +16.4% YoY Growth
            </div>
          </button>

          {/* Node 6: Forecast & Plan */}
          <button
            onClick={() => onSelectModule('demand')}
            className="p-3 bg-slate-950/70 border border-slate-800 hover:border-cyan-500/60 rounded-lg text-left transition-colors group"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-mono text-cyan-400 font-semibold">06</span>
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400" />
            </div>
            <div className="text-xs font-semibold text-white">Forecast & Plan</div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono-numbers">
              Gemini AI Optimized
            </div>
          </button>
        </div>
      </div>

      {/* Industrial Visual Assets Section (using generated images with fallback) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Visual 1: Production Plant */}
        <div
          onClick={() => onSelectModule('production')}
          className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer h-48 flex flex-col justify-end p-4"
        >
          <img
            src="/src/assets/images/h2_production_facility_1790751206635.jpg"
            alt="Green hydrogen PEM electrolysis production stacks"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
          <div className="relative z-10">
            <span className="text-[11px] font-mono text-cyan-300 uppercase tracking-wider block">Production Hub</span>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
              PEM & Alkaline Electrolysis
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              100% solar and wind powered green hydrogen generation at Complex Alpha facility.
            </p>
          </div>
        </div>

        {/* Visual 2: Cryo Storage */}
        <div
          onClick={() => onSelectModule('storage')}
          className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer h-48 flex flex-col justify-end p-4"
        >
          <img
            src="/src/assets/images/h2_cryo_storage_terminal_1790751220051.jpg"
            alt="Cryogenic liquid hydrogen spherical tanks and high pressure tube bundles"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
          <div className="relative z-10">
            <span className="text-[11px] font-mono text-indigo-300 uppercase tracking-wider block">Storage Terminal</span>
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
              Liquid LH2 & 700-Bar Buffers
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Cryogenic spherical tanks (-253°C) and composite rapid dispense manifolds.
            </p>
          </div>
        </div>

        {/* Visual 3: Transportation Logistics */}
        <div
          onClick={() => onSelectModule('transportation')}
          className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer h-48 flex flex-col justify-end p-4"
        >
          <img
            src="/src/assets/images/h2_logistics_transport_1790751231450.jpg"
            alt="Hydrogen tube trailer and cryogenic tanker on logistics transit"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
          <div className="relative z-10">
            <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider block">Fleet Logistics</span>
            <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
              Certified Tube Trailers & Tankers
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Live in-transit pressure sensors and automated GPS checkpoint tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Real-time Alerts & Active Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: System Alerts & Safety Thresholds */}
        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">
                Active Operational Alerts ({activeAlerts.length})
              </h3>
            </div>
            <span className="text-xs text-slate-500">Auto-Refreshed via Real-Time Telemetry</span>
          </div>

          <div className="mt-3 space-y-2.5">
            {activeAlerts.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                All storage pressures, electrolyzers, and logistics routes operating within nominal safety parameters.
              </div>
            ) : (
              activeAlerts.map(alert => (
                <div
                  key={alert._id}
                  className={`p-3 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                    alert.severity === 'critical'
                      ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                      : alert.severity === 'warning'
                      ? 'bg-amber-950/30 border-amber-800/60 text-amber-200'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 font-medium">
                      <span className="uppercase text-[10px] font-mono tracking-wider px-1.5 py-0.2 bg-black/40 rounded">
                        {alert.module}
                      </span>
                      <span>{alert.title}</span>
                    </div>
                    <p className="mt-1 text-[11px] opacity-80">{alert.message}</p>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <button
                    onClick={() => onResolveAlert(alert._id)}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors whitespace-nowrap"
                  >
                    Resolve
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Live Transports In Motion */}
        <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">
                Live In-Transit Logistics ({transports.length})
              </h3>
            </div>
            <button
              onClick={() => onSelectModule('transportation')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Manage Fleet &rarr;
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            {transports.slice(0, 3).map(shp => (
              <div key={shp._id} className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-cyan-400 font-semibold">{shp.shipmentNumber}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-300">{shp.customerName}</span>
                  </div>
                  <span className="font-mono font-medium text-slate-300">
                    {shp.status}
                  </span>
                </div>

                <div className="mt-2 text-slate-400 text-[11px] flex items-center justify-between">
                  <span>Dest: {shp.destination.slice(0, 36)}...</span>
                  <span className="font-mono-numbers text-amber-400 font-semibold">{shp.h2PayloadKg} kg H2</span>
                </div>

                {/* Progress bar */}
                <div className="mt-2">
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-400 h-1.5 rounded-full transition-all"
                      style={{
                        width: `${shp.totalDistanceKm > 0 ? Math.min(100, Math.round((shp.distanceCoveredKm / shp.totalDistanceKm) * 100)) : 0}%`
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>{shp.currentCheckpoint}</span>
                    <span className="font-mono-numbers">{shp.distanceCoveredKm} / {shp.totalDistanceKm} km</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
