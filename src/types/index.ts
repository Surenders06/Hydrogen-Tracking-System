export interface ProductionRecord {
  _id: string;
  batchId: string;
  facility: string;
  electrolyzerUnit: string;
  technology: 'PEM Electrolyzer' | 'Alkaline Electrolyzer' | 'Solid Oxide (SOEC)' | 'AEM Electrolyzer';
  energySource: '100% Solar Green' | 'Wind Farm Green' | 'Solar-Wind Hybrid' | 'Hydroelectric';
  purityPercent: number;
  quantityKg: number;
  pressureBar: number;
  costPerKg: number;
  productionDate: string;
  shift: 'Day Shift' | 'Night Shift';
  operator: string;
  status: 'Completed' | 'In Production' | 'Quality Check' | 'Scheduled';
  assignedStorageTankId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface StorageTank {
  _id: string;
  tankId: string;
  tankName: string;
  facility: string;
  type: 'Cryogenic Liquid H2 (-253°C)' | 'Type IV High Pressure (700 bar)' | 'Type I Industrial Tube Buffer (250 bar)' | 'Salt Cavern Buffer';
  maxCapacityKg: number;
  currentStockKg: number;
  pressureBar: number;
  maxPressureBar: number;
  temperatureCelsius: number;
  boilOffRatePercentPerDay: number;
  safetyReliefValveStatus: 'Normal' | 'Active Release' | 'Inspection Required';
  status: 'Operational' | 'Maintenance' | 'Full' | 'Low Level';
  lastInspectionDate: string;
  location: string;
  createdAt: string;
  updatedAt: string;
}

export interface TransportShipment {
  _id: string;
  shipmentNumber: string;
  vehiclePlate: string;
  vehicleType: 'Cryogenic LH2 Tanker' | 'Type IV Tube Trailer' | 'Modular Skid Trailer';
  carrierName: string;
  driverName: string;
  driverPhone: string;
  originFacility: string;
  destination: string;
  customerName: string;
  associatedBatchId: string;
  sourceTankId: string;
  h2PayloadKg: number;
  pressureBar: number;
  temperatureCelsius: number;
  dispatchTime: string;
  estimatedArrival: string;
  actualArrival?: string;
  currentCheckpoint: string;
  checkpointsPassed: string[];
  totalDistanceKm: number;
  distanceCoveredKm: number;
  status: 'Scheduled' | 'Dispatched' | 'In Transit' | 'Arrived' | 'Offloaded';
  gpsLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  safetyPassed: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDelivery {
  _id: string;
  deliveryId: string;
  orderNumber: string;
  customerName: string;
  industry: 'Heavy Mobility / Fueling Station' | 'Green Steel DRI Plant' | 'Chemical & Ammonia Synthesis' | 'Semiconductor Fabrication' | 'Power Plant Peaking';
  facilityAddress: string;
  contactPerson: string;
  contactEmail: string;
  quantityOrderedKg: number;
  quantityDeliveredKg: number;
  unitPricePerKg: number;
  puritySpecification: string;
  scheduledDeliveryDate: string;
  actualDeliveryDate?: string;
  shipmentId: string;
  status: 'Pending' | 'Dispatched' | 'In Transit' | 'Arrived at Site' | 'Offloading' | 'Delivered' | 'Verified';
  digitalSignOffCode?: string;
  receiverSignatureName?: string;
  purityCertificateNumber: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDemandRecord {
  _id: string;
  customerName: string;
  industry: string;
  month: string;
  historicalDemandKg: number;
  forecastDemandKg: number;
  variancePercent: number;
  growthFactor: number;
  priorityLevel: 'High' | 'Medium' | 'Critical';
  contractType: 'Take-or-Pay Long Term' | 'Spot Contract' | 'Fixed Monthly Quota';
  createdAt: string;
  updatedAt: string;
}

export interface SystemAlert {
  _id: string;
  timestamp: string;
  severity: 'low' | 'warning' | 'critical';
  module: 'Production' | 'Storage' | 'Transportation' | 'Delivery' | 'Demand';
  title: string;
  message: string;
  resolved: boolean;
}

export interface UserAccount {
  _id: string;
  name: string;
  email: string;
  role: 'Operations Engineer' | 'Fleet Dispatcher' | 'Commercial Lead' | 'System Administrator';
  department: string;
  avatarUrl?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBStats {
  connected: boolean;
  databaseName: string;
  engine: string;
  totalProductionBatches: number;
  totalProducedKg: number;
  totalStockKg: number;
  maxCapacityKg: number;
  storageFillPercent: number;
  activeShipments: number;
  completedDeliveries: number;
  pendingDeliveries: number;
  totalDemandKg: number;
  alertsCount: number;
  lastUpdated: string;
}

export interface ForecastResponse {
  projectedQuarterlyDemandKg: number;
  dailyElectrolyzerTargetKg: number;
  supplyGapRisk: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  storageBufferSufficiencyDays: number;
  executiveSummary: string;
  industryInsights: Array<{
    sector: string;
    trend: string;
    recommendation: string;
  }>;
  productionRecommendations: string[];
}

export interface TraceChain {
  query: string;
  timestamp: string;
  productionBatch: ProductionRecord;
  storageTank: StorageTank;
  transportationShipment: TransportShipment;
  customerDelivery: CustomerDelivery;
  certifications: {
    isoStandard: string;
    carbonIntensity: string;
    labInspector: string;
    tamperProofHash: string;
  };
}
