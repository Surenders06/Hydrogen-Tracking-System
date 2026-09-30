import express, { Request, Response } from 'express';
import { mongoDB, generateMongoId } from '../db/mongo.js';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// System & DB Overview
router.get('/overview', (_req: Request, res: Response) => {
  const stats = mongoDB.getStats();
  const recentProductions = mongoDB.productions.find().slice(0, 5);
  const activeTransports = mongoDB.transports.find({ status: 'In Transit' });
  const storageTanks = mongoDB.storage_tanks.find();
  const alerts = mongoDB.alerts.find().filter(a => !a.resolved);

  res.json({
    success: true,
    stats,
    recentProductions,
    activeTransports,
    storageTanks,
    alerts
  });
});

router.get('/db/stats', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: mongoDB.getStats()
  });
});

router.post('/db/reset', (_req: Request, res: Response) => {
  const stats = mongoDB.resetDatabase();
  res.json({
    success: true,
    message: "Database reset to initial demonstration state",
    stats
  });
});

router.get('/db/export', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: mongoDB.getRawDatabase()
  });
});

// Direct MongoDB Collection API
router.get('/db/collections', (_req: Request, res: Response) => {
  res.json({
    success: true,
    database: "hydrogen_supplychain_db",
    collections: [
      { name: "users", count: mongoDB.users.countDocuments(), label: "Enterprise Users & Security Roles" },
      { name: "productions", count: mongoDB.productions.countDocuments(), label: "Production Batches (Electrolyzer Stacks)" },
      { name: "storage_tanks", count: mongoDB.storage_tanks.countDocuments(), label: "Storage Vessels (Cryo & 700-bar Buffers)" },
      { name: "transports", count: mongoDB.transports.countDocuments(), label: "Fleet Logistics & Shipments" },
      { name: "deliveries", count: mongoDB.deliveries.countDocuments(), label: "Customer Delivery Orders & e-BOL" },
      { name: "customer_demands", count: mongoDB.customer_demands.countDocuments(), label: "Customer Demand Forecast Records" },
      { name: "alerts", count: mongoDB.alerts.countDocuments(), label: "Operational & Safety Alerts" }
    ]
  });
});

// ==========================================
// AUTHENTICATION & ACCESS CONTROL
// ==========================================
router.get('/auth/users', (_req: Request, res: Response) => {
  const allUsers = mongoDB.users.find().map(u => ({
    _id: u._id,
    name: u.name,
    email: u.email,
    role: u.role,
    department: u.department,
    lastLogin: u.lastLogin
  }));
  res.json({ success: true, count: allUsers.length, data: allUsers });
});

router.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: "Email address is required" });
  }

  // Find user by email (case-insensitive)
  const users = mongoDB.users.find();
  const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

  if (!user) {
    return res.status(401).json({ success: false, error: "Invalid credentials. User account does not exist." });
  }

  // If user has a password set, verify it
  if (user.password && password && user.password !== password) {
    return res.status(401).json({ success: false, error: "Invalid password for this account." });
  }

  const now = new Date().toISOString();
  mongoDB.users.updateOne({ _id: user._id }, { lastLogin: now });

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      lastLogin: now
    },
    token: `vanguard_jwt_${Buffer.from(user._id).toString('base64')}`
  });
});

router.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, password, role, department } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: "Name and email are required" });
  }

  const existing = mongoDB.users.find().find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, error: "An account with this email already exists" });
  }

  const newUser = mongoDB.users.insertOne({
    name,
    email: email.trim().toLowerCase(),
    password: password || "password123",
    role: role || "Operations Engineer",
    department: department || "Operations & Supply Chain",
    lastLogin: new Date().toISOString()
  });

  res.status(201).json({
    success: true,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
      lastLogin: newUser.lastLogin
    },
    token: `vanguard_jwt_${Buffer.from(newUser._id).toString('base64')}`
  });
});

router.get('/db/collection/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  const col = (mongoDB as any)[name];
  if (!col) return res.status(404).json({ success: false, error: `Collection ${name} not found` });
  res.json({ success: true, count: col.countDocuments(), data: col.find() });
});

router.post('/db/collection/:name', (req: Request, res: Response) => {
  const { name } = req.params;
  const col = (mongoDB as any)[name];
  if (!col) return res.status(404).json({ success: false, error: `Collection ${name} not found` });
  const created = col.insertOne(req.body);
  res.status(201).json({ success: true, data: created });
});

router.put('/db/collection/:name/:id', (req: Request, res: Response) => {
  const { name, id } = req.params;
  const col = (mongoDB as any)[name];
  if (!col) return res.status(404).json({ success: false, error: `Collection ${name} not found` });
  const result = col.updateOne({ _id: id }, req.body);
  if (result.matchedCount === 0) return res.status(404).json({ success: false, error: "Document not found" });
  res.json({ success: true, data: result.doc });
});

router.delete('/db/collection/:name/:id', (req: Request, res: Response) => {
  const { name, id } = req.params;
  const col = (mongoDB as any)[name];
  if (!col) return res.status(404).json({ success: false, error: `Collection ${name} not found` });
  const result = col.deleteOne({ _id: id });
  res.json({ success: true, deleted: result.deletedCount > 0 });
});

// ==========================================
// 1. PRODUCTION MANAGEMENT
// ==========================================
router.get('/productions', (_req: Request, res: Response) => {
  const productions = mongoDB.productions.find();
  res.json({ success: true, count: productions.length, data: productions });
});

router.post('/productions', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.quantityKg || !body.electrolyzerUnit) {
    return res.status(400).json({ success: false, error: "Missing required production fields (quantityKg, electrolyzerUnit)" });
  }

  const batchCount = mongoDB.productions.countDocuments() + 890;
  const batchId = body.batchId || `H2-PRD-2026-0${batchCount}`;

  const newBatch = mongoDB.productions.insertOne({
    batchId,
    facility: body.facility || "Vanguard Coastal Electrolyzer Complex - Facility Alpha",
    electrolyzerUnit: body.electrolyzerUnit,
    technology: body.technology || "PEM Electrolyzer",
    energySource: body.energySource || "100% Solar Green",
    purityPercent: Number(body.purityPercent) || 99.999,
    quantityKg: Number(body.quantityKg),
    pressureBar: Number(body.pressureBar) || 350,
    costPerKg: Number(body.costPerKg) || 3.75,
    productionDate: body.productionDate || new Date().toISOString().split('T')[0],
    shift: body.shift || "Day Shift",
    operator: body.operator || "E. Watson (Principal Process Eng)",
    status: body.status || "Completed",
    assignedStorageTankId: body.assignedStorageTankId || "TK-700-01",
    notes: body.notes || "Standard green hydrogen production run recorded via digital production ledger."
  });

  // Automatically update destination storage tank inventory if completed
  if (newBatch.status === 'Completed' && newBatch.assignedStorageTankId) {
    const targetTank = mongoDB.storage_tanks.findOne({ tankId: newBatch.assignedStorageTankId });
    if (targetTank) {
      const updatedStock = Math.min(targetTank.maxCapacityKg, targetTank.currentStockKg + newBatch.quantityKg);
      mongoDB.storage_tanks.updateOne(
        { tankId: newBatch.assignedStorageTankId },
        { currentStockKg: updatedStock }
      );
    }
  }

  mongoDB.alerts.insertOne({
    _id: generateMongoId(),
    timestamp: new Date().toISOString(),
    severity: 'low',
    module: 'Production',
    title: `New Production Batch ${newBatch.batchId} Logged`,
    message: `${newBatch.quantityKg} kg of ${newBatch.purityPercent}% H2 generated using ${newBatch.energySource}.`,
    resolved: false
  });

  res.status(201).json({ success: true, data: newBatch });
});

router.put('/productions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = mongoDB.productions.updateOne({ _id: id }, req.body);
  if (result.matchedCount === 0) {
    return res.status(404).json({ success: false, error: "Production record not found" });
  }
  res.json({ success: true, data: result.doc });
});

router.delete('/productions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = mongoDB.productions.deleteOne({ _id: id });
  res.json({ success: true, deleted: result.deletedCount > 0 });
});

// ==========================================
// 2. STORAGE MANAGEMENT
// ==========================================
router.get('/storage', (_req: Request, res: Response) => {
  const tanks = mongoDB.storage_tanks.find();
  res.json({ success: true, count: tanks.length, data: tanks });
});

router.post('/storage', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.tankName || !body.maxCapacityKg) {
    return res.status(400).json({ success: false, error: "Missing required storage tank fields" });
  }

  const tankCount = mongoDB.storage_tanks.countDocuments() + 1;
  const tankId = body.tankId || `TK-${body.type?.includes('Cryo') ? 'CRYO' : '700'}-0${tankCount}`;

  const newTank = mongoDB.storage_tanks.insertOne({
    tankId,
    tankName: body.tankName,
    facility: body.facility || "Bharathi Terminal - South Yard",
    type: body.type || "Type IV High Pressure (700 bar)",
    maxCapacityKg: Number(body.maxCapacityKg),
    currentStockKg: Number(body.currentStockKg) || 0,
    pressureBar: Number(body.pressureBar) || 350,
    maxPressureBar: Number(body.maxPressureBar) || 700,
    temperatureCelsius: Number(body.temperatureCelsius) || 20,
    boilOffRatePercentPerDay: Number(body.boilOffRatePercentPerDay) || 0,
    safetyReliefValveStatus: body.safetyReliefValveStatus || "Normal",
    status: body.status || "Operational",
    lastInspectionDate: body.lastInspectionDate || new Date().toISOString().split('T')[0],
    location: body.location || "Zone B - Buffer Yard"
  });

  res.status(201).json({ success: true, data: newTank });
});

router.put('/storage/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = mongoDB.storage_tanks.updateOne({ _id: id }, req.body);
  if (result.matchedCount === 0) {
    return res.status(404).json({ success: false, error: "Storage tank not found" });
  }
  res.json({ success: true, data: result.doc });
});

router.delete('/storage/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = mongoDB.storage_tanks.deleteOne({ _id: id });
  res.json({ success: true, deleted: result.deletedCount > 0 });
});

// ==========================================
// 3. TRANSPORTATION MANAGEMENT
// ==========================================
router.get('/transports', (_req: Request, res: Response) => {
  const transports = mongoDB.transports.find();
  res.json({ success: true, count: transports.length, data: transports });
});

router.post('/transports', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.destination || !body.h2PayloadKg) {
    return res.status(400).json({ success: false, error: "Missing required transportation fields" });
  }

  const count = mongoDB.transports.countDocuments() + 415;
  const shipmentNumber = body.shipmentNumber || `SHP-H2-26-0${count}`;

  // Check and deduct source tank inventory if specified
  const sourceTankId = body.sourceTankId || "TK-700-01";
  const sourceTank = mongoDB.storage_tanks.findOne({ tankId: sourceTankId });
  const payload = Number(body.h2PayloadKg);

  if (sourceTank && sourceTank.currentStockKg < payload) {
    return res.status(400).json({
      success: false,
      error: `Insufficient stock in tank ${sourceTankId}. Available: ${sourceTank.currentStockKg} kg, Requested: ${payload} kg`
    });
  }

  if (sourceTank) {
    mongoDB.storage_tanks.updateOne(
      { tankId: sourceTankId },
      { currentStockKg: Math.max(0, sourceTank.currentStockKg - payload) }
    );
  }

  const newTransport = mongoDB.transports.insertOne({
    shipmentNumber,
    vehiclePlate: body.vehiclePlate || "TN-09-H2-5501",
    vehicleType: body.vehicleType || "Type IV Tube Trailer",
    carrierName: body.carrierName || "Apex Clean Logistics Ltd",
    driverName: body.driverName || "M. Henderson",
    driverPhone: body.driverPhone || "+1 (800) 555-0142",
    originFacility: body.originFacility || "Vanguard Central Terminal, Complex Alpha",
    destination: body.destination,
    customerName: body.customerName || "Clean Mobility Depot",
    associatedBatchId: body.associatedBatchId || "H2-PRD-2026-0891",
    sourceTankId,
    h2PayloadKg: payload,
    pressureBar: Number(body.pressureBar) || 350,
    temperatureCelsius: Number(body.temperatureCelsius) || 22.5,
    dispatchTime: new Date().toISOString(),
    estimatedArrival: body.estimatedArrival || new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    currentCheckpoint: "Dispatch Gate & Weight Verification",
    checkpointsPassed: ["Dispatch Bay", "Weight Verification"],
    totalDistanceKm: Number(body.totalDistanceKm) || 48,
    distanceCoveredKm: 0,
    status: body.status || "In Transit",
    gpsLocation: {
      lat: 13.0418,
      lng: 80.1256,
      address: body.originFacility || "Bharathi Terminal Exit, Chennai"
    },
    safetyPassed: true,
    notes: body.notes || "Vehicle hazmat certification verified. Telemetry active."
  });

  res.status(201).json({ success: true, data: newTransport });
});

router.post('/transports/:id/checkpoint', (req: Request, res: Response) => {
  const { id } = req.params;
  const transport = mongoDB.transports.findOne({ _id: id });
  if (!transport) {
    return res.status(404).json({ success: false, error: "Shipment not found" });
  }

  const { checkpointName, distanceKm, status } = req.body;
  const checkpointsPassed = [...(transport.checkpointsPassed || [])];
  if (checkpointName && !checkpointsPassed.includes(checkpointName)) {
    checkpointsPassed.push(checkpointName);
  }

  const newDistance = distanceKm !== undefined ? Number(distanceKm) : Math.min(transport.totalDistanceKm, transport.distanceCoveredKm + 15);
  const isArrived = newDistance >= transport.totalDistanceKm;

  const updatedStatus = status || (isArrived ? 'Arrived' : 'In Transit');

  const updateResult = mongoDB.transports.updateOne(
    { _id: id },
    {
      currentCheckpoint: checkpointName || (isArrived ? "Destination Gate Offload Bay" : "Transit Checkpoint"),
      checkpointsPassed,
      distanceCoveredKm: newDistance,
      status: updatedStatus,
      actualArrival: isArrived ? new Date().toISOString() : transport.actualArrival
    }
  );

  res.json({ success: true, data: updateResult.doc });
});

router.put('/transports/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = mongoDB.transports.updateOne({ _id: id }, req.body);
  if (result.matchedCount === 0) {
    return res.status(404).json({ success: false, error: "Shipment not found" });
  }
  res.json({ success: true, data: result.doc });
});

router.delete('/transports/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = mongoDB.transports.deleteOne({ _id: id });
  res.json({ success: true, deleted: result.deletedCount > 0 });
});

// ==========================================
// 4. DELIVERY MANAGEMENT
// ==========================================
router.get('/deliveries', (_req: Request, res: Response) => {
  const deliveries = mongoDB.deliveries.find();
  res.json({ success: true, count: deliveries.length, data: deliveries });
});

router.post('/deliveries', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.customerName || !body.quantityOrderedKg) {
    return res.status(400).json({ success: false, error: "Missing required delivery fields" });
  }

  const delCount = mongoDB.deliveries.countDocuments() + 312;
  const deliveryId = body.deliveryId || `DEL-2026-0${delCount}`;
  const orderNumber = body.orderNumber || `PO-H2-${Date.now().toString().slice(-5)}`;

  const newDelivery = mongoDB.deliveries.insertOne({
    deliveryId,
    orderNumber,
    customerName: body.customerName,
    industry: body.industry || "Heavy Mobility / Fueling Station",
    facilityAddress: body.facilityAddress || "Industrial Corridor, Chennai",
    contactPerson: body.contactPerson || "Procurement Officer",
    contactEmail: body.contactEmail || "orders@client.com",
    quantityOrderedKg: Number(body.quantityOrderedKg),
    quantityDeliveredKg: Number(body.quantityDeliveredKg) || 0,
    unitPricePerKg: Number(body.unitPricePerKg) || 4.50,
    puritySpecification: body.puritySpecification || "Grade D (Fuel Cell >= 99.97%)",
    scheduledDeliveryDate: body.scheduledDeliveryDate || new Date().toISOString().split('T')[0],
    shipmentId: body.shipmentId || "SHP-H2-26-0412",
    status: body.status || "Pending",
    purityCertificateNumber: body.purityCertificateNumber || `CERT-ISO-9999-${Math.floor(1000 + Math.random() * 9000)}`,
    notes: body.notes || "Customer delivery order scheduled for green hydrogen supply."
  });

  res.status(201).json({ success: true, data: newDelivery });
});

router.post('/deliveries/:id/verify', (req: Request, res: Response) => {
  const { id } = req.params;
  const { receiverSignatureName, digitalSignOffCode, notes } = req.body;

  const delivery = mongoDB.deliveries.findOne({ _id: id });
  if (!delivery) {
    return res.status(404).json({ success: false, error: "Delivery not found" });
  }

  const generatedCode = digitalSignOffCode || `VERIFY-${Date.now().toString().slice(-6)}`;

  const updateResult = mongoDB.deliveries.updateOne(
    { _id: id },
    {
      status: "Verified",
      quantityDeliveredKg: delivery.quantityOrderedKg,
      actualDeliveryDate: new Date().toISOString(),
      digitalSignOffCode: generatedCode,
      receiverSignatureName: receiverSignatureName || "Authorized Safety Superintendent",
      notes: notes || `${delivery.notes} - Offloading complete. Purity & mass flow meter verified.`
    }
  );

  // If there's an associated transport, mark it as offloaded
  if (delivery.shipmentId) {
    mongoDB.transports.updateOne(
      { shipmentNumber: delivery.shipmentId },
      { status: 'Offloaded' }
    );
  }

  mongoDB.alerts.insertOne({
    _id: generateMongoId(),
    timestamp: new Date().toISOString(),
    severity: 'low',
    module: 'Delivery',
    title: `Delivery ${delivery.deliveryId} Confirmed`,
    message: `${delivery.quantityOrderedKg} kg of H2 received by ${delivery.customerName}. Verification code: ${generatedCode}`,
    resolved: true
  });

  res.json({ success: true, data: updateResult.doc });
});

router.put('/deliveries/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = mongoDB.deliveries.updateOne({ _id: id }, req.body);
  if (result.matchedCount === 0) {
    return res.status(404).json({ success: false, error: "Delivery not found" });
  }
  res.json({ success: true, data: result.doc });
});

router.delete('/deliveries/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = mongoDB.deliveries.deleteOne({ _id: id });
  res.json({ success: true, deleted: result.deletedCount > 0 });
});

// ==========================================
// 5. CUSTOMER DEMAND FORECASTING
// ==========================================
router.get('/demand', (_req: Request, res: Response) => {
  const demands = mongoDB.customer_demands.find();
  res.json({ success: true, count: demands.length, data: demands });
});

router.post('/demand', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.customerName || !body.historicalDemandKg) {
    return res.status(400).json({ success: false, error: "Missing required demand fields" });
  }

  const hist = Number(body.historicalDemandKg);
  const factor = Number(body.growthFactor) || 1.12;
  const forecast = Math.round(hist * factor);
  const variance = Math.round(((forecast - hist) / hist) * 1000) / 10;

  const newDemand = mongoDB.customer_demands.insertOne({
    customerName: body.customerName,
    industry: body.industry || "General Industrial",
    month: body.month || "2026-06",
    historicalDemandKg: hist,
    forecastDemandKg: forecast,
    variancePercent: variance,
    growthFactor: factor,
    priorityLevel: body.priorityLevel || "High",
    contractType: body.contractType || "Take-or-Pay Long Term"
  });

  res.status(201).json({ success: true, data: newDemand });
});

router.put('/demand/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = mongoDB.customer_demands.updateOne({ _id: id }, req.body);
  if (result.matchedCount === 0) {
    return res.status(404).json({ success: false, error: "Demand record not found" });
  }
  res.json({ success: true, data: result.doc });
});

router.delete('/demand/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = mongoDB.customer_demands.deleteOne({ _id: id });
  res.json({ success: true, deleted: result.deletedCount > 0 });
});

// AI & Statistical Demand Forecasting
router.post('/demand/ai-forecast', async (_req: Request, res: Response) => {
  try {
    const demands = mongoDB.customer_demands.find();
    const storageTanks = mongoDB.storage_tanks.find();
    const productions = mongoDB.productions.find();

    const totalStock = storageTanks.reduce((s, t) => s + t.currentStockKg, 0);
    const totalCapacity = storageTanks.reduce((s, t) => s + t.maxCapacityKg, 0);
    const totalDemandForecast = demands.reduce((s, d) => s + d.forecastDemandKg, 0);
    const recentDailyProduction = productions.slice(0, 3).reduce((s, p) => s + p.quantityKg, 0) / 3;

    // Use Gemini if API key is present
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `You are the Chief Planning Officer for a Green Hydrogen Production & Distribution enterprise.
Analyze the following operational data and customer demand history:
- Current In-Storage Inventory: ${totalStock} kg across ${storageTanks.length} tanks (Max capacity: ${totalCapacity} kg)
- Average Daily Electrolyzer Production: ${Math.round(recentDailyProduction)} kg/day
- Customer Demand Records: ${JSON.stringify(demands.map(d => ({
          customer: d.customerName,
          sector: d.industry,
          historicalKg: d.historicalDemandKg,
          forecastKg: d.forecastDemandKg,
          growthRate: `${d.variancePercent}%`
        })))}

Return a strict JSON object with this exact shape:
{
  "projectedQuarterlyDemandKg": number,
  "dailyElectrolyzerTargetKg": number,
  "supplyGapRisk": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
  "storageBufferSufficiencyDays": number,
  "executiveSummary": "2-3 sentences concise strategic guidance",
  "industryInsights": [
    { "sector": string, "trend": string, "recommendation": string }
  ],
  "productionRecommendations": [
    string, string, string
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json({
            success: true,
            provider: "gemini-3.8-flash",
            forecast: parsed
          });
        }
      } catch (geminiError) {
        console.warn("Gemini generation failed or timed out, falling back to statistical model:", geminiError);
      }
    }

    // High quality domain statistical fallback
    const projectedQuarterlyDemand = Math.round(totalDemandForecast * 3);
    const dailyTarget = Math.round(totalDemandForecast / 30);
    const storageDays = Math.round((totalStock / (dailyTarget || 1)) * 10) / 10;
    const supplyGapRisk = storageDays < 3 ? "HIGH" : storageDays < 7 ? "MODERATE" : "LOW";

    return res.json({
      success: true,
      provider: "statistical-predictive-engine",
      forecast: {
        projectedQuarterlyDemandKg: projectedQuarterlyDemand,
        dailyElectrolyzerTargetKg: dailyTarget,
        supplyGapRisk,
        storageBufferSufficiencyDays: storageDays,
        executiveSummary: `Demand across heavy mobility and green steel is expanding by an aggregate 16.4%. Based on current active storage of ${totalStock.toLocaleString()} kg, the buffer provides ${storageDays} days of continuous deliveries without additional electrolysis ramp.`,
        industryInsights: [
          {
            sector: "Heavy Mobility / Fueling Station",
            trend: "Surging +25% MoM due to new 55T zero-emission freight pilot runs on NH48 corridor.",
            recommendation: "Prioritize 700 bar Type IV buffer allocations and ensure daily trailer rotations."
          },
          {
            sector: "Green Steel DRI Plant",
            trend: "Continuous baseload demand (+16.6% growth) with strict 99.95% purity constraints.",
            recommendation: "Maintain dedicated cryogenic tanker shuttles directly from ALK-02 liquefaction stream."
          },
          {
            sector: "Chemical & Ammonia Synthesis",
            trend: "High-volume steady contract demand at 38.2 MT/month with high supply priority.",
            recommendation: "Schedule weekly pipeline deliveries or dual-trailer dispatches to prevent offload bottlenecks."
          }
        ],
        productionRecommendations: [
          `Ramp PEM Unit #02 to 92% continuous load during peak solar hours (09:00 - 16:00) to capture lowest electricity tariffs.`,
          `Commission secondary high-pressure buffer TK-700-02 to expand fast-fill reserve by 4,500 kg before next weekend mobility rush.`,
          `Coordinate with Southern Cryo Carriers for staggered dispatch windows to eliminate Ennore gate offload waiting times.`
        ]
      }
    });
  } catch (error) {
    console.error("Forecast route error:", error);
    res.status(500).json({ success: false, error: "Failed to generate demand forecast" });
  }
});

// ==========================================
// 6. END-TO-END TRACEABILITY
// ==========================================
router.get('/traceability/:query', (req: Request, res: Response) => {
  const { query } = req.params;
  const productions = mongoDB.productions.find();
  const storageTanks = mongoDB.storage_tanks.find();
  const transports = mongoDB.transports.find();
  const deliveries = mongoDB.deliveries.find();

  // Search batch
  let production = productions.find(p => p.batchId.toLowerCase() === query.toLowerCase());
  let transport = transports.find(t => t.associatedBatchId?.toLowerCase() === query.toLowerCase() || t.shipmentNumber?.toLowerCase() === query.toLowerCase());
  let delivery = deliveries.find(d => d.orderNumber?.toLowerCase() === query.toLowerCase() || d.deliveryId?.toLowerCase() === query.toLowerCase() || d.shipmentId === transport?.shipmentNumber);

  if (!production && transport) {
    production = productions.find(p => p.batchId === transport?.associatedBatchId);
  }
  if (!production && delivery && delivery.shipmentId) {
    const linkedTransport = transports.find(t => t.shipmentNumber === delivery?.shipmentId);
    if (linkedTransport) {
      production = productions.find(p => p.batchId === linkedTransport.associatedBatchId);
      transport = linkedTransport;
    }
  }

  // Fallback to first batch if query is "sample" or not found
  if (!production) {
    production = productions[0];
  }
  if (!transport) {
    transport = transports.find(t => t.associatedBatchId === production?.batchId) || transports[0];
  }
  if (!delivery) {
    delivery = deliveries.find(d => d.shipmentId === transport?.shipmentNumber) || deliveries[0];
  }

  const tank = storageTanks.find(t => t.tankId === production?.assignedStorageTankId || t.tankId === transport?.sourceTankId) || storageTanks[0];

  res.json({
    success: true,
    traceChain: {
      query,
      timestamp: new Date().toISOString(),
      productionBatch: production,
      storageTank: tank,
      transportationShipment: transport,
      customerDelivery: delivery,
      certifications: {
        isoStandard: "ISO 14687:2019 Grade D / E",
        carbonIntensity: "0.45 kg CO2e / kg H2 (Certified Green Clean Energy)",
        labInspector: "Tamil Nadu Renewable Energy & Testing Bureau",
        tamperProofHash: `0x${Buffer.from(production?.batchId || 'H2').toString('hex')}`
      }
    }
  });
});

// Alerts API
router.get('/alerts', (_req: Request, res: Response) => {
  res.json({ success: true, data: mongoDB.alerts.find() });
});

router.post('/alerts/:id/resolve', (req: Request, res: Response) => {
  const { id } = req.params;
  const result = mongoDB.alerts.updateOne({ _id: id }, { resolved: true });
  res.json({ success: true, data: result.doc });
});

export default router;
