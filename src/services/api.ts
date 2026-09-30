import {
  ProductionRecord,
  StorageTank,
  TransportShipment,
  CustomerDelivery,
  CustomerDemandRecord,
  SystemAlert,
  DBStats,
  ForecastResponse,
  TraceChain,
  UserAccount
} from '../types';

const API_BASE = '/api';

export const api = {
  // Authentication & Access Control
  async login(email: string, password?: string): Promise<{ success: boolean; user: UserAccount; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to authenticate');
    return json;
  },

  async register(data: { name: string; email: string; password?: string; role?: string; department?: string }): Promise<{ success: boolean; user: UserAccount; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Registration failed');
    return json;
  },

  async getUsers(): Promise<UserAccount[]> {
    const res = await fetch(`${API_BASE}/auth/users`);
    if (!res.ok) throw new Error('Failed to fetch user directory');
    const json = await res.json();
    return json.data;
  },

  // DB & Overview
  async getOverview(): Promise<{
    stats: DBStats;
    recentProductions: ProductionRecord[];
    activeTransports: TransportShipment[];
    storageTanks: StorageTank[];
    alerts: SystemAlert[];
  }> {
    const res = await fetch(`${API_BASE}/overview`);
    if (!res.ok) throw new Error('Failed to fetch overview data');
    const data = await res.json();
    return data;
  },

  async getDbStats(): Promise<DBStats> {
    const res = await fetch(`${API_BASE}/db/stats`);
    if (!res.ok) throw new Error('Failed to fetch DB stats');
    const json = await res.json();
    return json.data;
  },

  async resetDatabase(): Promise<DBStats> {
    const res = await fetch(`${API_BASE}/db/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset database');
    const json = await res.json();
    return json.stats;
  },

  async exportDatabase(): Promise<any> {
    const res = await fetch(`${API_BASE}/db/export`);
    if (!res.ok) throw new Error('Failed to export database');
    const json = await res.json();
    return json.data;
  },

  // Production Module
  async getProductions(): Promise<ProductionRecord[]> {
    const res = await fetch(`${API_BASE}/productions`);
    if (!res.ok) throw new Error('Failed to fetch productions');
    const json = await res.json();
    return json.data;
  },

  async createProduction(data: Partial<ProductionRecord>): Promise<ProductionRecord> {
    const res = await fetch(`${API_BASE}/productions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create production batch');
    }
    const json = await res.json();
    return json.data;
  },

  async updateProduction(id: string, data: Partial<ProductionRecord>): Promise<ProductionRecord> {
    const res = await fetch(`${API_BASE}/productions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update production batch');
    const json = await res.json();
    return json.data;
  },

  async deleteProduction(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/productions/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete production batch');
    const json = await res.json();
    return json.deleted;
  },

  // Storage Module
  async getStorageTanks(): Promise<StorageTank[]> {
    const res = await fetch(`${API_BASE}/storage`);
    if (!res.ok) throw new Error('Failed to fetch storage tanks');
    const json = await res.json();
    return json.data;
  },

  async createStorageTank(data: Partial<StorageTank>): Promise<StorageTank> {
    const res = await fetch(`${API_BASE}/storage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create storage tank');
    const json = await res.json();
    return json.data;
  },

  async updateStorageTank(id: string, data: Partial<StorageTank>): Promise<StorageTank> {
    const res = await fetch(`${API_BASE}/storage/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update storage tank');
    const json = await res.json();
    return json.data;
  },

  async deleteStorageTank(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/storage/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete storage tank');
    const json = await res.json();
    return json.deleted;
  },

  // Transportation Module
  async getTransports(): Promise<TransportShipment[]> {
    const res = await fetch(`${API_BASE}/transports`);
    if (!res.ok) throw new Error('Failed to fetch shipments');
    const json = await res.json();
    return json.data;
  },

  async createTransport(data: Partial<TransportShipment>): Promise<TransportShipment> {
    const res = await fetch(`${API_BASE}/transports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to dispatch shipment');
    }
    const json = await res.json();
    return json.data;
  },

  async advanceCheckpoint(id: string, checkpointName?: string, distanceKm?: number): Promise<TransportShipment> {
    const res = await fetch(`${API_BASE}/transports/${id}/checkpoint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ checkpointName, distanceKm })
    });
    if (!res.ok) throw new Error('Failed to advance shipment checkpoint');
    const json = await res.json();
    return json.data;
  },

  async updateTransport(id: string, data: Partial<TransportShipment>): Promise<TransportShipment> {
    const res = await fetch(`${API_BASE}/transports/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update shipment');
    const json = await res.json();
    return json.data;
  },

  async deleteTransport(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/transports/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete shipment');
    const json = await res.json();
    return json.deleted;
  },

  // Delivery Module
  async getDeliveries(): Promise<CustomerDelivery[]> {
    const res = await fetch(`${API_BASE}/deliveries`);
    if (!res.ok) throw new Error('Failed to fetch deliveries');
    const json = await res.json();
    return json.data;
  },

  async createDelivery(data: Partial<CustomerDelivery>): Promise<CustomerDelivery> {
    const res = await fetch(`${API_BASE}/deliveries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create delivery');
    const json = await res.json();
    return json.data;
  },

  async verifyDelivery(id: string, receiverSignatureName: string, digitalSignOffCode?: string): Promise<CustomerDelivery> {
    const res = await fetch(`${API_BASE}/deliveries/${id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverSignatureName, digitalSignOffCode })
    });
    if (!res.ok) throw new Error('Failed to verify delivery');
    const json = await res.json();
    return json.data;
  },

  async updateDelivery(id: string, data: Partial<CustomerDelivery>): Promise<CustomerDelivery> {
    const res = await fetch(`${API_BASE}/deliveries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update delivery');
    const json = await res.json();
    return json.data;
  },

  async deleteDelivery(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/deliveries/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete delivery');
    const json = await res.json();
    return json.deleted;
  },

  // Demand Forecasting Module
  async getDemands(): Promise<CustomerDemandRecord[]> {
    const res = await fetch(`${API_BASE}/demand`);
    if (!res.ok) throw new Error('Failed to fetch customer demands');
    const json = await res.json();
    return json.data;
  },

  async createDemand(data: Partial<CustomerDemandRecord>): Promise<CustomerDemandRecord> {
    const res = await fetch(`${API_BASE}/demand`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to create demand record');
    const json = await res.json();
    return json.data;
  },

  async deleteDemand(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/demand/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete demand record');
    const json = await res.json();
    return json.deleted;
  },

  async updateDemand(id: string, data: Partial<CustomerDemandRecord>): Promise<CustomerDemandRecord> {
    const res = await fetch(`${API_BASE}/demand/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update demand record');
    const json = await res.json();
    return json.data;
  },

  // Direct MongoDB Collection API
  async getCollections(): Promise<Array<{ name: string; count: number; label: string }>> {
    const res = await fetch(`${API_BASE}/db/collections`);
    if (!res.ok) throw new Error('Failed to fetch collections');
    const json = await res.json();
    return json.collections;
  },

  async getCollectionDocs(name: string): Promise<any[]> {
    const res = await fetch(`${API_BASE}/db/collection/${name}`);
    if (!res.ok) throw new Error(`Failed to fetch documents for ${name}`);
    const json = await res.json();
    return json.data;
  },

  async insertCollectionDoc(name: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/db/collection/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Failed to insert document into ${name}`);
    const json = await res.json();
    return json.data;
  },

  async updateCollectionDoc(name: string, id: string, data: any): Promise<any> {
    const res = await fetch(`${API_BASE}/db/collection/${name}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`Failed to update document in ${name}`);
    const json = await res.json();
    return json.data;
  },

  async deleteCollectionDoc(name: string, id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/db/collection/${name}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`Failed to delete document from ${name}`);
    const json = await res.json();
    return json.deleted;
  },

  async getAiForecast(): Promise<{ provider: string; forecast: ForecastResponse }> {
    const res = await fetch(`${API_BASE}/demand/ai-forecast`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to generate AI demand forecast');
    return await res.json();
  },

  // Traceability & Chain of Custody
  async getTraceability(query: string): Promise<TraceChain> {
    const res = await fetch(`${API_BASE}/traceability/${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to trace supply chain record');
    const json = await res.json();
    return json.traceChain;
  },

  // Alerts
  async getAlerts(): Promise<SystemAlert[]> {
    const res = await fetch(`${API_BASE}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    const json = await res.json();
    return json.data;
  },

  async resolveAlert(id: string): Promise<SystemAlert> {
    const res = await fetch(`${API_BASE}/alerts/${id}/resolve`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to resolve alert');
    const json = await res.json();
    return json.data;
  }
};
