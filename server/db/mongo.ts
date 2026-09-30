import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  ProductionRecord,
  StorageTank,
  TransportShipment,
  CustomerDelivery,
  CustomerDemandRecord,
  SystemAlert,
  UserAccount,
  initialProductions,
  initialStorageTanks,
  initialTransports,
  initialDeliveries,
  initialDemands,
  initialAlerts,
  initialUsers
} from './seedData.js';

export function generateMongoId(): string {
  return crypto.randomBytes(12).toString('hex');
}

export interface DatabaseSchema {
  users: UserAccount[];
  productions: ProductionRecord[];
  storage_tanks: StorageTank[];
  transports: TransportShipment[];
  deliveries: CustomerDelivery[];
  customer_demands: CustomerDemandRecord[];
  alerts: SystemAlert[];
  meta: {
    initializedAt: string;
    lastUpdated: string;
    version: string;
    engine: string;
  };
}

class MongoCollection<T extends { _id: string; [key: string]: any }> {
  constructor(
    private getCollection: () => T[],
    private setCollection: (items: T[]) => void,
    private saveDb: () => void
  ) {}

  find(filter: Partial<T> = {}): T[] {
    const items = this.getCollection();
    const filterKeys = Object.keys(filter) as Array<keyof T>;
    if (filterKeys.length === 0) return [...items];

    return items.filter(item => {
      return filterKeys.every(k => {
        if (filter[k] === undefined) return true;
        return item[k] === filter[k];
      });
    });
  }

  findOne(filter: Partial<T>): T | null {
    const results = this.find(filter);
    return results.length > 0 ? results[0] : null;
  }

  insertOne(doc: Omit<T, '_id' | 'createdAt' | 'updatedAt'> & { _id?: string; createdAt?: string; updatedAt?: string }): T {
    const now = new Date().toISOString();
    const newDoc = {
      ...doc,
      _id: doc._id || generateMongoId(),
      createdAt: doc.createdAt || now,
      updatedAt: doc.updatedAt || now
    } as unknown as T;

    const items = this.getCollection();
    items.unshift(newDoc);
    this.setCollection(items);
    this.saveDb();
    return newDoc;
  }

  updateOne(filter: Partial<T>, updateData: Partial<T>): { matchedCount: number; modifiedCount: number; doc?: T } {
    const items = this.getCollection();
    const index = items.findIndex(item => {
      const filterKeys = Object.keys(filter) as Array<keyof T>;
      return filterKeys.every(k => item[k] === filter[k]);
    });

    if (index === -1) {
      return { matchedCount: 0, modifiedCount: 0 };
    }

    const current = items[index];
    const updated = {
      ...current,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    items[index] = updated;
    this.setCollection(items);
    this.saveDb();
    return { matchedCount: 1, modifiedCount: 1, doc: updated };
  }

  deleteOne(filter: Partial<T>): { deletedCount: number } {
    const items = this.getCollection();
    const initialLen = items.length;
    const filtered = items.filter(item => {
      const filterKeys = Object.keys(filter) as Array<keyof T>;
      return !filterKeys.every(k => item[k] === filter[k]);
    });

    if (filtered.length !== initialLen) {
      this.setCollection(filtered);
      this.saveDb();
      return { deletedCount: initialLen - filtered.length };
    }
    return { deletedCount: 0 };
  }

  countDocuments(filter: Partial<T> = {}): number {
    return this.find(filter).length;
  }
}

export class MongoDBDatabase {
  private dataFilePath: string;
  private state: DatabaseSchema;

  constructor() {
    const dataDir = path.resolve(process.cwd(), 'server', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.dataFilePath = path.join(dataDir, 'mongodb_store.json');
    this.state = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const raw = fs.readFileSync(this.dataFilePath, 'utf8');
        const parsed = JSON.parse(raw) as DatabaseSchema;
        if (parsed.productions && parsed.storage_tanks && parsed.transports && parsed.deliveries) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('MongoDB store corrupted or unreadable, re-initializing default seed data', e);
    }

    const defaultState: DatabaseSchema = {
      users: [...initialUsers],
      productions: [...initialProductions],
      storage_tanks: [...initialStorageTanks],
      transports: [...initialTransports],
      deliveries: [...initialDeliveries],
      customer_demands: [...initialDemands],
      alerts: [...initialAlerts],
      meta: {
        initializedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        version: "1.0.0",
        engine: "MongoDB Document Engine (MERN Stack Architecture)"
      }
    };

    this.saveToDisk(defaultState);
    return defaultState;
  }

  private saveToDisk(state?: DatabaseSchema) {
    const toSave = state || this.state;
    toSave.meta.lastUpdated = new Date().toISOString();
    try {
      fs.writeFileSync(this.dataFilePath, JSON.stringify(toSave, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to write MongoDB store to disk:', e);
    }
  }

  get users() {
    return new MongoCollection<UserAccount>(
      () => this.state.users || (this.state.users = [...initialUsers]),
      (items) => { this.state.users = items; },
      () => this.saveToDisk()
    );
  }

  get productions() {
    return new MongoCollection<ProductionRecord>(
      () => this.state.productions,
      (items) => { this.state.productions = items; },
      () => this.saveToDisk()
    );
  }

  get storage_tanks() {
    return new MongoCollection<StorageTank>(
      () => this.state.storage_tanks,
      (items) => { this.state.storage_tanks = items; },
      () => this.saveToDisk()
    );
  }

  get transports() {
    return new MongoCollection<TransportShipment>(
      () => this.state.transports,
      (items) => { this.state.transports = items; },
      () => this.saveToDisk()
    );
  }

  get deliveries() {
    return new MongoCollection<CustomerDelivery>(
      () => this.state.deliveries,
      (items) => { this.state.deliveries = items; },
      () => this.saveToDisk()
    );
  }

  get customer_demands() {
    return new MongoCollection<CustomerDemandRecord>(
      () => this.state.customer_demands,
      (items) => { this.state.customer_demands = items; },
      () => this.saveToDisk()
    );
  }

  get alerts() {
    return new MongoCollection<SystemAlert>(
      () => this.state.alerts,
      (items) => { this.state.alerts = items; },
      () => this.saveToDisk()
    );
  }

  getStats() {
    const totalProdKg = this.state.productions.reduce((sum, p) => sum + (p.quantityKg || 0), 0);
    const totalStockKg = this.state.storage_tanks.reduce((sum, t) => sum + (t.currentStockKg || 0), 0);
    const maxCapacityKg = this.state.storage_tanks.reduce((sum, t) => sum + (t.maxCapacityKg || 0), 0);
    const activeShipments = this.state.transports.filter(t => t.status === 'In Transit' || t.status === 'Dispatched').length;
    const completedDeliveries = this.state.deliveries.filter(d => d.status === 'Delivered' || d.status === 'Verified').length;
    const pendingDeliveries = this.state.deliveries.filter(d => d.status !== 'Delivered' && d.status !== 'Verified').length;
    const totalDemandKg = this.state.customer_demands.reduce((sum, d) => sum + (d.forecastDemandKg || 0), 0);

    return {
      connected: true,
      databaseName: "hydrogen_supplychain_db",
      engine: this.state.meta.engine,
      totalProductionBatches: this.state.productions.length,
      totalProducedKg: totalProdKg,
      totalStockKg,
      maxCapacityKg,
      storageFillPercent: maxCapacityKg > 0 ? Math.round((totalStockKg / maxCapacityKg) * 100) : 0,
      activeShipments,
      completedDeliveries,
      pendingDeliveries,
      totalDemandKg,
      alertsCount: this.state.alerts.filter(a => !a.resolved).length,
      lastUpdated: this.state.meta.lastUpdated
    };
  }

  resetDatabase() {
    this.state = {
      users: [...initialUsers],
      productions: [...initialProductions],
      storage_tanks: [...initialStorageTanks],
      transports: [...initialTransports],
      deliveries: [...initialDeliveries],
      customer_demands: [...initialDemands],
      alerts: [...initialAlerts],
      meta: {
        initializedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        version: "1.0.0",
        engine: "MongoDB Document Engine (MERN Stack Architecture)"
      }
    };
    this.saveToDisk();
    return this.getStats();
  }

  getRawDatabase(): DatabaseSchema {
    return this.state;
  }
}

export const mongoDB = new MongoDBDatabase();
