import React, { useState, useEffect } from 'react';
import { Navbar, ActiveModule } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { ProductionModule } from './components/ProductionModule';
import { StorageModule } from './components/StorageModule';
import { TransportationModule } from './components/TransportationModule';
import { DeliveryModule } from './components/DeliveryModule';
import { DemandForecastingModule } from './components/DemandForecastingModule';
import { TraceabilityModal } from './components/TraceabilityModal';
import { CompanyInfoModal } from './components/CompanyInfoModal';
import { MongoStudioModal } from './components/MongoStudioModal';
import { LoginPage } from './components/LoginPage';
import { api } from './services/api';
import {
  DBStats,
  ProductionRecord,
  StorageTank,
  TransportShipment,
  CustomerDelivery,
  CustomerDemandRecord,
  SystemAlert,
  ForecastResponse,
  UserAccount
} from './types';
import { Loader2, Download, AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('vanguard_h2_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeModule, setActiveModule] = useState<ActiveModule>('overview');

  // Application Data States
  const [stats, setStats] = useState<DBStats | null>(null);
  const [productions, setProductions] = useState<ProductionRecord[]>([]);
  const [storageTanks, setStorageTanks] = useState<StorageTank[]>([]);
  const [transports, setTransports] = useState<TransportShipment[]>([]);
  const [deliveries, setDeliveries] = useState<CustomerDelivery[]>([]);
  const [demands, setDemands] = useState<CustomerDemandRecord[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);

  // Forecast AI State
  const [aiForecast, setAiForecast] = useState<ForecastResponse | null>(null);
  const [forecastProvider, setForecastProvider] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Modal States
  const [isTraceabilityOpen, setIsTraceabilityOpen] = useState(false);
  const [traceQuery, setTraceQuery] = useState('H2-PRD-2026-0891');
  const [isCompanyInfoOpen, setIsCompanyInfoOpen] = useState(false);
  const [isMongoStudioOpen, setIsMongoStudioOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Global loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = async () => {
    try {
      setError(null);
      const [
        overviewRes,
        prodRes,
        storageRes,
        transRes,
        delivRes,
        demRes,
        alertRes
      ] = await Promise.all([
        api.getOverview(),
        api.getProductions(),
        api.getStorageTanks(),
        api.getTransports(),
        api.getDeliveries(),
        api.getDemands(),
        api.getAlerts()
      ]);

      setStats(overviewRes.stats);
      setProductions(prodRes);
      setStorageTanks(storageRes);
      setTransports(transRes);
      setDeliveries(delivRes);
      setDemands(demRes);
      setAlerts(alertRes);
    } catch (err: any) {
      console.error('Failed to load supply chain state:', err);
      setError(err.message || 'Error connecting to Hydrogen backend service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Handlers
  const handleResetDb = async () => {
    if (!confirm('Reset all demonstration data to default seed state?')) return;
    setIsResetting(true);
    try {
      await api.resetDatabase();
      await loadAllData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsResetting(false);
    }
  };

  const handleCreateBatch = async (data: Partial<ProductionRecord>) => {
    await api.createProduction(data);
    await loadAllData();
  };

  const handleUpdateBatch = async (id: string, data: Partial<ProductionRecord>) => {
    await api.updateProduction(id, data);
    await loadAllData();
  };

  const handleDeleteBatch = async (id: string) => {
    if (!confirm('Are you sure you want to remove this production batch?')) return;
    await api.deleteProduction(id);
    await loadAllData();
  };

  const handleCreateTank = async (data: Partial<StorageTank>) => {
    await api.createStorageTank(data);
    await loadAllData();
  };

  const handleUpdateTank = async (id: string, data: Partial<StorageTank>) => {
    await api.updateStorageTank(id, data);
    await loadAllData();
  };

  const handleDeleteTank = async (id: string) => {
    if (!confirm('Decommission this storage tank?')) return;
    await api.deleteStorageTank(id);
    await loadAllData();
  };

  const handleDispatchShipment = async (data: Partial<TransportShipment>) => {
    await api.createTransport(data);
    await loadAllData();
  };

  const handleUpdateTransport = async (id: string, data: Partial<TransportShipment>) => {
    await api.updateTransport(id, data);
    await loadAllData();
  };

  const handleAdvanceCheckpoint = async (id: string, name?: string) => {
    await api.advanceCheckpoint(id, name);
    await loadAllData();
  };

  const handleDeleteTransport = async (id: string) => {
    if (!confirm('Cancel and delete this shipment record?')) return;
    await api.deleteTransport(id);
    await loadAllData();
  };

  const handleCreateDelivery = async (data: Partial<CustomerDelivery>) => {
    await api.createDelivery(data);
    await loadAllData();
  };

  const handleUpdateDelivery = async (id: string, data: Partial<CustomerDelivery>) => {
    await api.updateDelivery(id, data);
    await loadAllData();
  };

  const handleVerifyDelivery = async (id: string, receiverName: string, code?: string) => {
    await api.verifyDelivery(id, receiverName, code);
    await loadAllData();
  };

  const handleDeleteDelivery = async (id: string) => {
    if (!confirm('Delete this delivery order?')) return;
    await api.deleteDelivery(id);
    await loadAllData();
  };

  const handleCreateDemand = async (data: Partial<CustomerDemandRecord>) => {
    await api.createDemand(data);
    await loadAllData();
  };

  const handleUpdateDemand = async (id: string, data: Partial<CustomerDemandRecord>) => {
    await api.updateDemand(id, data);
    await loadAllData();
  };

  const handleDeleteDemand = async (id: string) => {
    if (!confirm('Delete this demand record?')) return;
    await api.deleteDemand(id);
    await loadAllData();
  };

  const handleRunAiForecast = async () => {
    setLoadingAi(true);
    try {
      const res = await api.getAiForecast();
      setAiForecast(res.forecast);
      setForecastProvider(res.provider);
    } catch (err) {
      console.error('Failed to run AI forecast:', err);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleResolveAlert = async (id: string) => {
    await api.resolveAlert(id);
    await loadAllData();
  };

  const handleTraceTarget = (query: string) => {
    setTraceQuery(query);
    setIsTraceabilityOpen(true);
  };

  const handleExportData = async () => {
    try {
      const raw = await api.exportDatabase();
      const blob = new Blob([JSON.stringify(raw, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hydrogen_supplychain_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export error:', e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('vanguard_h2_user');
    localStorage.removeItem('vanguard_h2_token');
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        <p className="text-xs font-medium">Connecting to MERN Hydrogen Supply Chain System...</p>
      </div>
    );
  }

  // If not authenticated, display enterprise LoginPage
  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* 3-Zone Top Navigation */}
      <Navbar
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        onOpenTraceability={() => setIsTraceabilityOpen(true)}
        onOpenCompanyInfo={() => setIsCompanyInfoOpen(true)}
        onOpenMongoStudio={() => setIsMongoStudioOpen(true)}
        onResetDb={handleResetDb}
        currentUser={currentUser}
        onLogout={handleLogout}
        isResetting={isResetting}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={loadAllData}
              className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 rounded text-white font-medium flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry Connection
            </button>
          </div>
        )}

        {/* View Routing */}
        {activeModule === 'overview' && (
          <DashboardOverview
            stats={stats}
            productions={productions}
            storageTanks={storageTanks}
            transports={transports}
            alerts={alerts}
            onSelectModule={setActiveModule}
            onOpenTraceability={() => setIsTraceabilityOpen(true)}
            onResolveAlert={handleResolveAlert}
          />
        )}

        {activeModule === 'production' && (
          <ProductionModule
            productions={productions}
            storageTanks={storageTanks}
            onCreateBatch={handleCreateBatch}
            onUpdateBatch={handleUpdateBatch}
            onDeleteBatch={handleDeleteBatch}
            onTraceBatch={handleTraceTarget}
          />
        )}

        {activeModule === 'storage' && (
          <StorageModule
            storageTanks={storageTanks}
            onCreateTank={handleCreateTank}
            onUpdateTank={handleUpdateTank}
            onDeleteTank={handleDeleteTank}
          />
        )}

        {activeModule === 'transportation' && (
          <TransportationModule
            transports={transports}
            storageTanks={storageTanks}
            productions={productions}
            onDispatchShipment={handleDispatchShipment}
            onUpdateTransport={handleUpdateTransport}
            onAdvanceCheckpoint={handleAdvanceCheckpoint}
            onDeleteTransport={handleDeleteTransport}
            onTraceShipment={handleTraceTarget}
          />
        )}

        {activeModule === 'deliveries' && (
          <DeliveryModule
            deliveries={deliveries}
            transports={transports}
            onCreateDelivery={handleCreateDelivery}
            onUpdateDelivery={handleUpdateDelivery}
            onVerifyDelivery={handleVerifyDelivery}
            onDeleteDelivery={handleDeleteDelivery}
            onTraceDelivery={handleTraceTarget}
          />
        )}

        {activeModule === 'demand' && (
          <DemandForecastingModule
            demands={demands}
            aiForecast={aiForecast}
            forecastProvider={forecastProvider}
            loadingAi={loadingAi}
            onRunAiForecast={handleRunAiForecast}
            onCreateDemand={handleCreateDemand}
            onUpdateDemand={handleUpdateDemand}
            onDeleteDemand={handleDeleteDemand}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Vanguard Hydrogen Technologies</span>
            <span aria-hidden="true">·</span>
            <span>Commercial Supply Chain & Logistics Network</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMongoStudioOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors font-medium"
            >
              <span>MongoDB Document Studio</span>
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleExportData}
              className="text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export Supply Chain Records (JSON)
            </button>
            <span aria-hidden="true">·</span>
            <span>MERN Stack (MongoDB / Express / React / Node)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TraceabilityModal
        isOpen={isTraceabilityOpen}
        onClose={() => setIsTraceabilityOpen(false)}
        initialQuery={traceQuery}
      />

      <CompanyInfoModal
        isOpen={isCompanyInfoOpen}
        onClose={() => setIsCompanyInfoOpen(false)}
      />

      <MongoStudioModal
        isOpen={isMongoStudioOpen}
        onClose={() => setIsMongoStudioOpen(false)}
        onDataChanged={loadAllData}
      />
    </div>
  );
}
