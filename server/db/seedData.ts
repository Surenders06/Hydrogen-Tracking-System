export interface ProductionRecord {
  _id: string;
  batchId: string;
  facility: string;
  electrolyzerUnit: string;
  technology: 'PEM Electrolyzer' | 'Alkaline Electrolyzer' | 'Solid Oxide (SOEC)' | 'AEM Electrolyzer';
  energySource: '100% Solar Green' | 'Wind Farm Green' | 'Solar-Wind Hybrid' | 'Hydroelectric';
  purityPercent: number; // e.g. 99.999
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
  billOfLadingUrl?: string;
  purityCertificateNumber: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerDemandRecord {
  _id: string;
  customerName: string;
  industry: string;
  month: string; // e.g. "2026-04"
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
  password?: string;
  role: 'Operations Engineer' | 'Fleet Dispatcher' | 'Commercial Lead' | 'System Administrator';
  department: string;
  avatarUrl?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export const initialUsers: UserAccount[] = [
  {
    _id: "660fa701a1b2c3d4e5f60071",
    name: "Dr. Eleanor Watson",
    email: "watson.engineer@vanguard-h2.com",
    password: "password123",
    role: "Operations Engineer",
    department: "Electrolysis & Chemical Process Engineering",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-09-30T00:00:00.000Z"
  },
  {
    _id: "660fa701a1b2c3d4e5f60072",
    name: "Marcus Henderson",
    email: "henderson.fleet@vanguard-h2.com",
    password: "password123",
    role: "Fleet Dispatcher",
    department: "Hazmat Logistics & Route Coordination",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-09-30T00:00:00.000Z"
  },
  {
    _id: "660fa701a1b2c3d4e5f60073",
    name: "Sophia Reynolds",
    email: "reynolds.commercial@vanguard-h2.com",
    password: "password123",
    role: "Commercial Lead",
    department: "Offtake Contracts & Demand Analytics",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-09-30T00:00:00.000Z"
  },
  {
    _id: "660fa701a1b2c3d4e5f60074",
    name: "System Administrator",
    email: "admin@vanguard-h2.com",
    password: "admin",
    role: "System Administrator",
    department: "Global Supply Chain & Cloud Infrastructure",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-09-30T00:00:00.000Z"
  }
];

export const initialProductions: ProductionRecord[] = [
  {
    _id: "660fa101a1b2c3d4e5f60001",
    batchId: "H2-PRD-2026-0891",
    facility: "Vanguard Coastal Electrolyzer Complex - Facility Alpha",
    electrolyzerUnit: "PEM Stack Unit #01",
    technology: "PEM Electrolyzer",
    energySource: "100% Solar Green",
    purityPercent: 99.9992,
    quantityKg: 2450,
    pressureBar: 350,
    costPerKg: 3.85,
    productionDate: "2026-09-28",
    shift: "Day Shift",
    operator: "E. Watson (Principal Process Eng)",
    status: "Completed",
    assignedStorageTankId: "TK-700-01",
    notes: "Nominal cell voltage 1.82V, deionized water conductivity < 0.1 uS/cm. Full batch passed gas chromatography certification.",
    createdAt: "2026-09-28T06:00:00.000Z",
    updatedAt: "2026-09-28T14:30:00.000Z"
  },
  {
    _id: "660fa101a1b2c3d4e5f60002",
    batchId: "H2-PRD-2026-0892",
    facility: "Vanguard Coastal Electrolyzer Complex - Facility Alpha",
    electrolyzerUnit: "Alkaline Multi-Cell ALK-02",
    technology: "Alkaline Electrolyzer",
    energySource: "Wind Farm Green",
    purityPercent: 99.9985,
    quantityKg: 3800,
    pressureBar: 200,
    costPerKg: 3.40,
    productionDate: "2026-09-28",
    shift: "Night Shift",
    operator: "R. Vance (Plant Operations Supervisor)",
    status: "Completed",
    assignedStorageTankId: "TK-CRYO-01",
    notes: "Liquefaction train feed completed into cryogenic liquid storage. KOH concentration stable at 30%.",
    createdAt: "2026-09-28T18:00:00.000Z",
    updatedAt: "2026-09-29T02:00:00.000Z"
  },
  {
    _id: "660fa101a1b2c3d4e5f60003",
    batchId: "H2-PRD-2026-0893",
    facility: "Vanguard Coastal Electrolyzer Complex - Facility Alpha",
    electrolyzerUnit: "PEM Stack Unit #02",
    technology: "PEM Electrolyzer",
    energySource: "Solar-Wind Hybrid",
    purityPercent: 99.9995,
    quantityKg: 1950,
    pressureBar: 350,
    costPerKg: 3.75,
    productionDate: "2026-09-29",
    shift: "Day Shift",
    operator: "K. Bradley (Senior Operations Officer)",
    status: "In Production",
    assignedStorageTankId: "TK-700-02",
    notes: "Active run currently at 78% completion target. Hydrogen generation rate 420 Nm3/hr.",
    createdAt: "2026-09-29T07:00:00.000Z",
    updatedAt: "2026-09-29T11:45:00.000Z"
  },
  {
    _id: "660fa101a1b2c3d4e5f60004",
    batchId: "H2-PRD-2026-0894",
    facility: "Vanguard Inland Satellite Facility - Terminal Beta",
    electrolyzerUnit: "AEM High-Efficiency Prototype",
    technology: "AEM Electrolyzer",
    energySource: "100% Solar Green",
    purityPercent: 99.9990,
    quantityKg: 850,
    pressureBar: 35,
    costPerKg: 3.20,
    productionDate: "2026-09-29",
    shift: "Day Shift",
    operator: "Dr. M. Chen (QA Director)",
    status: "Quality Check",
    assignedStorageTankId: "TK-BUF-01",
    notes: "Moisture analyzer and trace oxygen analyzer validation before compressor ramp-up.",
    createdAt: "2026-09-29T08:30:00.000Z",
    updatedAt: "2026-09-29T10:15:00.000Z"
  }
];

export const initialStorageTanks: StorageTank[] = [
  {
    _id: "660fa201a1b2c3d4e5f60011",
    tankId: "TK-CRYO-01",
    tankName: "Cryogenic Spherical Vessel LH2-Alpha",
    facility: "Vanguard Central Terminal - Cryo Yard",
    type: "Cryogenic Liquid H2 (-253°C)",
    maxCapacityKg: 15000,
    currentStockKg: 11450,
    pressureBar: 12.5,
    maxPressureBar: 16.0,
    temperatureCelsius: -252.8,
    boilOffRatePercentPerDay: 0.12,
    safetyReliefValveStatus: "Normal",
    status: "Operational",
    lastInspectionDate: "2026-09-15",
    location: "Zone A - Cryogenic Tank Farm",
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-09-29T09:00:00.000Z"
  },
  {
    _id: "660fa201a1b2c3d4e5f60012",
    tankId: "TK-700-01",
    tankName: "Type IV High-Pressure Bank 1",
    facility: "Vanguard Central Terminal - Loading Bay",
    type: "Type IV High Pressure (700 bar)",
    maxCapacityKg: 4500,
    currentStockKg: 3820,
    pressureBar: 685,
    maxPressureBar: 720,
    temperatureCelsius: 22.4,
    boilOffRatePercentPerDay: 0.0,
    safetyReliefValveStatus: "Normal",
    status: "Operational",
    lastInspectionDate: "2026-09-20",
    location: "Zone B - Rapid Dispense Manifold",
    createdAt: "2026-01-10T00:00:00.000Z",
    updatedAt: "2026-09-29T09:30:00.000Z"
  },
  {
    _id: "660fa201a1b2c3d4e5f60013",
    tankId: "TK-700-02",
    tankName: "Type IV High-Pressure Bank 2",
    facility: "Vanguard Central Terminal - Loading Bay",
    type: "Type IV High Pressure (700 bar)",
    maxCapacityKg: 4500,
    currentStockKg: 1980,
    pressureBar: 395,
    maxPressureBar: 720,
    temperatureCelsius: 21.8,
    boilOffRatePercentPerDay: 0.0,
    safetyReliefValveStatus: "Normal",
    status: "Operational",
    lastInspectionDate: "2026-09-22",
    location: "Zone B - High Pressure Storage",
    createdAt: "2026-02-01T00:00:00.000Z",
    updatedAt: "2026-09-29T08:15:00.000Z"
  },
  {
    _id: "660fa201a1b2c3d4e5f60014",
    tankId: "TK-BUF-01",
    tankName: "Industrial Tube Buffer Bundle A",
    facility: "Vanguard Inland Satellite Facility",
    type: "Type I Industrial Tube Buffer (250 bar)",
    maxCapacityKg: 3000,
    currentStockKg: 2450,
    pressureBar: 215,
    maxPressureBar: 250,
    temperatureCelsius: 24.1,
    boilOffRatePercentPerDay: 0.0,
    safetyReliefValveStatus: "Normal",
    status: "Operational",
    lastInspectionDate: "2026-08-30",
    location: "Zone C - Plant Buffer",
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-09-29T07:45:00.000Z"
  }
];

export const initialTransports: TransportShipment[] = [
  {
    _id: "660fa301a1b2c3d4e5f60021",
    shipmentNumber: "SHP-H2-26-0412",
    vehiclePlate: "VH-H2-4412",
    vehicleType: "Type IV Tube Trailer",
    carrierName: "Vanguard Dedicated Fleet",
    driverName: "M. Henderson",
    driverPhone: "+1 (800) 555-0142",
    originFacility: "Vanguard Central Terminal, Complex Alpha",
    destination: "Metro Heavy Mobility Depot - Fueling Station 4",
    customerName: "Metro Clean Transit Authority",
    associatedBatchId: "H2-PRD-2026-0891",
    sourceTankId: "TK-700-01",
    h2PayloadKg: 1200,
    pressureBar: 350,
    temperatureCelsius: 23.5,
    dispatchTime: "2026-09-29T07:30:00.000Z",
    estimatedArrival: "2026-09-29T10:15:00.000Z",
    currentCheckpoint: "Highway Checkpoint Milepost 42",
    checkpointsPassed: ["Dispatch Bay 3", "Outer Ring Road Exit", "Highway Milepost 42"],
    totalDistanceKm: 54,
    distanceCoveredKm: 38,
    status: "In Transit",
    gpsLocation: {
      lat: 13.0456,
      lng: 80.0892,
      address: "Industrial Freight Corridor, Sector 7"
    },
    safetyPassed: true,
    notes: "Real-time telemetry nominal: Internal tank pressure steady at 350 bar. Speed limited to 45 km/h per Hazmat H2 standard.",
    createdAt: "2026-09-29T07:15:00.000Z",
    updatedAt: "2026-09-29T08:50:00.000Z"
  },
  {
    _id: "660fa301a1b2c3d4e5f60022",
    shipmentNumber: "SHP-H2-26-0413",
    vehiclePlate: "VH-CR-9088",
    vehicleType: "Cryogenic LH2 Tanker",
    carrierName: "Vanguard Cryo Logistics",
    driverName: "S. Reynolds",
    driverPhone: "+1 (800) 555-0199",
    originFacility: "Vanguard Central Terminal, Complex Alpha",
    destination: "Coromandel Clean Chemical Complex - Gate 2",
    customerName: "Coromandel Clean Fertilizers",
    associatedBatchId: "H2-PRD-2026-0892",
    sourceTankId: "TK-CRYO-01",
    h2PayloadKg: 3200,
    pressureBar: 8.2,
    temperatureCelsius: -251.4,
    dispatchTime: "2026-09-29T06:00:00.000Z",
    estimatedArrival: "2026-09-29T09:00:00.000Z",
    actualArrival: "2026-09-29T08:45:00.000Z",
    currentCheckpoint: "Customer Offload Bay #2",
    checkpointsPassed: ["Terminal Weighbridge", "Port Industrial Link", "Interstate Express", "Customer Security Gate"],
    totalDistanceKm: 42,
    distanceCoveredKm: 42,
    status: "Arrived",
    gpsLocation: {
      lat: 13.2198,
      lng: 80.3245,
      address: "Port Industrial Logistics Zone"
    },
    safetyPassed: true,
    notes: "Offloading vapor return line connected. Nitrogen purge completed successfully.",
    createdAt: "2026-09-29T05:45:00.000Z",
    updatedAt: "2026-09-29T08:48:00.000Z"
  },
  {
    _id: "660fa301a1b2c3d4e5f60023",
    shipmentNumber: "SHP-H2-26-0414",
    vehiclePlate: "VH-TT-1102",
    vehicleType: "Type IV Tube Trailer",
    carrierName: "Vanguard Dedicated Fleet",
    driverName: "D. Kumaran",
    driverPhone: "+1 (800) 555-0211",
    originFacility: "Vanguard Central Terminal, Complex Alpha",
    destination: "Heavy Freight Logistics Hub - Haul Fleet Station",
    customerName: "Apollo Green Logistics Fleet",
    associatedBatchId: "H2-PRD-2026-0891",
    sourceTankId: "TK-700-01",
    h2PayloadKg: 1000,
    pressureBar: 350,
    temperatureCelsius: 22.9,
    dispatchTime: "2026-09-29T11:00:00.000Z",
    estimatedArrival: "2026-09-29T13:30:00.000Z",
    currentCheckpoint: "Staging Bay #1 - Pre-trip Inspection",
    checkpointsPassed: ["Pre-trip Inspection"],
    totalDistanceKm: 65,
    distanceCoveredKm: 0,
    status: "Scheduled",
    gpsLocation: {
      lat: 13.0312,
      lng: 80.1789,
      address: "Vanguard Dispatch Yard"
    },
    safetyPassed: true,
    notes: "Scheduled for afternoon dispatch to fuel zero-emission 55T haul trucks.",
    createdAt: "2026-09-29T08:00:00.000Z",
    updatedAt: "2026-09-29T08:00:00.000Z"
  }
];

export const initialDeliveries: CustomerDelivery[] = [
  {
    _id: "660fa401a1b2c3d4e5f60031",
    deliveryId: "DEL-2026-0311",
    orderNumber: "PO-HYU-88219",
    customerName: "Hyundai Clean Mobility Depot",
    industry: "Heavy Mobility / Fueling Station",
    facilityAddress: "Plot C-14, SIPCOT Industrial Park, Sriperumbudur, Tamil Nadu",
    contactPerson: "Arun Prakash (Fleet Operations Manager)",
    contactEmail: "aprakash@hyundai-mobility.in",
    quantityOrderedKg: 1200,
    quantityDeliveredKg: 1200,
    unitPricePerKg: 4.80,
    puritySpecification: "ISO 14687:2019 Grade D (Fuel Cell Grade >= 99.97%)",
    scheduledDeliveryDate: "2026-09-29",
    shipmentId: "SHP-H2-26-0412",
    status: "In Transit",
    purityCertificateNumber: "CERT-ISO-9999-0891",
    notes: "High pressure dispense directly to 350/700 bar cascade storage tanks.",
    createdAt: "2026-09-28T10:00:00.000Z",
    updatedAt: "2026-09-29T07:35:00.000Z"
  },
  {
    _id: "660fa401a1b2c3d4e5f60032",
    deliveryId: "DEL-2026-0310",
    orderNumber: "PO-CORO-49021",
    customerName: "Coromandel Clean Fertilizers",
    industry: "Chemical & Ammonia Synthesis",
    facilityAddress: "Industrial Area Gate 4, Ennore, Chennai",
    contactPerson: "Dr. N. Sundaram (Technical Director)",
    contactEmail: "nsundaram@coromandel.biz",
    quantityOrderedKg: 3200,
    quantityDeliveredKg: 3200,
    unitPricePerKg: 4.25,
    puritySpecification: "Industrial Grade >= 99.98%",
    scheduledDeliveryDate: "2026-09-29",
    actualDeliveryDate: "2026-09-29T08:55:00.000Z",
    shipmentId: "SHP-H2-26-0413",
    status: "Offloading",
    digitalSignOffCode: "VERIFY-CORO-8821",
    receiverSignatureName: "Dr. N. Sundaram",
    purityCertificateNumber: "CERT-ISO-9999-0892",
    notes: "Transfer line grounded. Offloading at 45 kg/min through cryogenic transfer pump.",
    createdAt: "2026-09-27T14:00:00.000Z",
    updatedAt: "2026-09-29T08:55:00.000Z"
  },
  {
    _id: "660fa401a1b2c3d4e5f60033",
    deliveryId: "DEL-2026-0309",
    orderNumber: "PO-JSW-77402",
    customerName: "Arcelor & JSW Green Steel DRI Facility",
    industry: "Green Steel DRI Plant",
    facilityAddress: "Metals Corridor, Salem - Chennai Highway Hub",
    contactPerson: "B. Venkatesh (Metallurgical Eng)",
    contactEmail: "bvenkat@greensteel.org",
    quantityOrderedKg: 5000,
    quantityDeliveredKg: 5000,
    unitPricePerKg: 4.10,
    puritySpecification: "DRI Reduction Grade >= 99.95%",
    scheduledDeliveryDate: "2026-09-27",
    actualDeliveryDate: "2026-09-27T16:20:00.000Z",
    shipmentId: "SHP-H2-26-0409",
    status: "Verified",
    digitalSignOffCode: "VERIFY-JSW-9904",
    receiverSignatureName: "B. Venkatesh",
    purityCertificateNumber: "CERT-ISO-9995-0888",
    notes: "Fully accepted and signed electronically. Integrated into iron ore direct reduction furnace.",
    createdAt: "2026-09-26T09:00:00.000Z",
    updatedAt: "2026-09-27T16:25:00.000Z"
  }
];

export const initialDemands: CustomerDemandRecord[] = [
  {
    _id: "660fa501a1b2c3d4e5f60041",
    customerName: "Hyundai Clean Mobility Depot",
    industry: "Heavy Mobility / Fueling Station",
    month: "2026-05",
    historicalDemandKg: 18500,
    forecastDemandKg: 21400,
    variancePercent: 15.6,
    growthFactor: 1.15,
    priorityLevel: "High",
    contractType: "Take-or-Pay Long Term",
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-29T00:00:00.000Z"
  },
  {
    _id: "660fa501a1b2c3d4e5f60042",
    customerName: "Coromandel Clean Fertilizers",
    industry: "Chemical & Ammonia Synthesis",
    month: "2026-05",
    historicalDemandKg: 35000,
    forecastDemandKg: 38200,
    variancePercent: 9.1,
    growthFactor: 1.09,
    priorityLevel: "Critical",
    contractType: "Take-or-Pay Long Term",
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-29T00:00:00.000Z"
  },
  {
    _id: "660fa501a1b2c3d4e5f60043",
    customerName: "Arcelor & JSW Green Steel DRI Facility",
    industry: "Green Steel DRI Plant",
    month: "2026-05",
    historicalDemandKg: 42000,
    forecastDemandKg: 49000,
    variancePercent: 16.6,
    growthFactor: 1.16,
    priorityLevel: "Critical",
    contractType: "Take-or-Pay Long Term",
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-29T00:00:00.000Z"
  },
  {
    _id: "660fa501a1b2c3d4e5f60044",
    customerName: "Apollo Green Logistics Fleet",
    industry: "Heavy Mobility / Fueling Station",
    month: "2026-05",
    historicalDemandKg: 9500,
    forecastDemandKg: 12800,
    variancePercent: 34.7,
    growthFactor: 1.35,
    priorityLevel: "High",
    contractType: "Fixed Monthly Quota",
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-29T00:00:00.000Z"
  },
  {
    _id: "660fa501a1b2c3d4e5f60045",
    customerName: "Semiconductor Silicon Clean Tech",
    industry: "Semiconductor Fabrication",
    month: "2026-05",
    historicalDemandKg: 5200,
    forecastDemandKg: 5600,
    variancePercent: 7.7,
    growthFactor: 1.07,
    priorityLevel: "Medium",
    contractType: "Spot Contract",
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-29T00:00:00.000Z"
  }
];

export const initialAlerts: SystemAlert[] = [
  {
    _id: "660fa601a1b2c3d4e5f60051",
    timestamp: "2026-09-29T08:50:00.000Z",
    severity: "warning",
    module: "Storage",
    title: "Storage TK-700-01 at 85% Capacity",
    message: "High pressure buffer bank is approaching maximum capacity (3,820 / 4,500 kg). Dispatch or ramp-down recommended.",
    resolved: false
  },
  {
    _id: "660fa601a1b2c3d4e5f60052",
    timestamp: "2026-09-29T08:45:00.000Z",
    severity: "low",
    module: "Transportation",
    title: "Shipment SHP-H2-26-0413 Arrived at Ennore",
    message: "Cryo tanker arrived safely at Coromandel Facility. Offload verification initiated.",
    resolved: true
  },
  {
    _id: "660fa601a1b2c3d4e5f60053",
    timestamp: "2026-09-29T07:10:00.000Z",
    severity: "low",
    module: "Production",
    title: "Batch H2-PRD-2026-0891 Passed Purity Check",
    message: "Ultra-pure 99.9992% green hydrogen certified for mobility use.",
    resolved: true
  }
];
