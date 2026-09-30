import React, { useState } from 'react';
import { Building2, Plus, CheckCircle2, FileText, Search, ShieldCheck, Clock, Trash2, ArrowUpRight, Edit3 } from 'lucide-react';
import { CustomerDelivery, TransportShipment } from '../types';

interface DeliveryModuleProps {
  deliveries: CustomerDelivery[];
  transports: TransportShipment[];
  onCreateDelivery: (data: Partial<CustomerDelivery>) => Promise<void>;
  onUpdateDelivery: (id: string, data: Partial<CustomerDelivery>) => Promise<void>;
  onVerifyDelivery: (id: string, receiverName: string, code?: string) => Promise<void>;
  onDeleteDelivery: (id: string) => Promise<void>;
  onTraceDelivery: (orderNumber: string) => void;
}

export const DeliveryModule: React.FC<DeliveryModuleProps> = ({
  deliveries,
  transports,
  onCreateDelivery,
  onUpdateDelivery,
  onVerifyDelivery,
  onDeleteDelivery,
  onTraceDelivery
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [verifyingDelivery, setVerifyingDelivery] = useState<CustomerDelivery | null>(null);
  const [editingDelivery, setEditingDelivery] = useState<CustomerDelivery | null>(null);
  const [receiverName, setReceiverName] = useState('Arun Prakash (Ops Lead)');
  const [verifyCode, setVerifyCode] = useState('');

  const [formData, setFormData] = useState({
    customerName: 'Tata Green Steel Works',
    industry: 'Green Steel DRI Plant' as CustomerDelivery['industry'],
    facilityAddress: 'Kalinganagar Metal Industrial Zone',
    contactPerson: 'M. Senthil Nathan',
    contactEmail: 'orders@tatasteel.com',
    quantityOrderedKg: 4000,
    unitPricePerKg: 4.20,
    puritySpecification: 'ISO 14687:2019 Grade D (>= 99.98%)',
    scheduledDeliveryDate: new Date().toISOString().split('T')[0],
    shipmentId: transports[0]?.shipmentNumber || 'SHP-H2-26-0412'
  });

  const filtered = deliveries.filter(d =>
    d.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.deliveryId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedCount = deliveries.filter(d => d.status === 'Verified' || d.status === 'Delivered').length;
  const totalDeliveredKg = deliveries.reduce((s, d) => s + (d.quantityDeliveredKg || (d.status === 'Verified' ? d.quantityOrderedKg : 0)), 0);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateDelivery(formData);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create delivery order:', err);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingDelivery) return;
    try {
      await onVerifyDelivery(verifyingDelivery._id, receiverName, verifyCode);
      setVerifyingDelivery(null);
    } catch (err) {
      console.error('Failed to verify delivery:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            Customer Delivery & Offtake Management
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            Customer Orders, Delivery Schedules & Offloading Verification
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage commercial hydrogen supply agreements, schedule offloading windows, and execute digital sign-offs.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Customer Delivery Order
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Fulfilled Deliveries</span>
          <div className="text-xl font-bold text-emerald-400 font-mono-numbers mt-1">
            {completedCount} <span className="text-xs text-slate-400 font-normal">/ {deliveries.length} Orders</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">100% On-Time Schedule Delivery</span>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Total Volume Delivered</span>
          <div className="text-xl font-bold text-white font-mono-numbers mt-1">
            {totalDeliveredKg.toLocaleString()} <span className="text-xs text-slate-400 font-normal">kg H2</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Across mobility, steel & chemical clients</span>
        </div>

        <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl">
          <span className="text-xs text-slate-400 block">Digital Verification Index</span>
          <div className="text-xl font-bold text-cyan-400 font-mono-numbers mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            Electronic Bill of Lading (e-BOL)
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Paperless cryptographically signed handoff</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, order PO, or delivery ID..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900/50">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 font-semibold">Delivery & PO Number</th>
              <th className="py-3 px-4 font-semibold">Customer & Industry</th>
              <th className="py-3 px-4 font-semibold text-right">Quantity</th>
              <th className="py-3 px-4 font-semibold">Scheduled Date</th>
              <th className="py-3 px-4 font-semibold">Assigned Shipment</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Offload Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  No customer delivery orders found.
                </td>
              </tr>
            ) : (
              filtered.map((del) => {
                const isVerified = del.status === 'Verified';

                return (
                  <tr key={del._id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-semibold text-emerald-400 block">{del.deliveryId}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{del.orderNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-white block">{del.customerName}</span>
                      <span className="text-[11px] text-slate-400">{del.industry}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono-numbers text-white font-semibold">
                      {del.quantityOrderedKg.toLocaleString()} kg
                      <span className="text-[11px] text-slate-500 block font-normal">
                        ${del.unitPricePerKg.toFixed(2)}/kg
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-300 block">{del.scheduledDeliveryDate}</span>
                      <span className="text-[11px] text-slate-500">Purity: {del.puritySpecification.slice(0, 18)}...</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-slate-300 text-[11px] px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                        {del.shipmentId}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-300">
                        {del.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {isVerified ? (
                          <div className="text-right">
                            <span className="text-[11px] font-mono text-emerald-400 block flex items-center justify-end gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {del.digitalSignOffCode}
                            </span>
                            <span className="text-[10px] text-slate-500">by {del.receiverSignatureName}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setVerifyingDelivery(del);
                              setVerifyCode(`VERIFY-${Date.now().toString().slice(-6)}`);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-700/60 rounded transition-colors whitespace-nowrap"
                          >
                            Verify & Offload
                          </button>
                        )}

                        <button
                          onClick={() => setEditingDelivery({ ...del })}
                          title="Edit order details"
                          className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onTraceDelivery(del.orderNumber)}
                          title="Audit supply chain passport"
                          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDeleteDelivery(del._id)}
                          title="Delete delivery record"
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Create Delivery Order */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                Create Customer Delivery Purchase Order
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Customer / Enterprise Name</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Industrial Sector</label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Heavy Mobility / Fueling Station">Heavy Mobility / Fueling Station</option>
                    <option value="Green Steel DRI Plant">Green Steel DRI Plant</option>
                    <option value="Chemical & Ammonia Synthesis">Chemical & Ammonia Synthesis</option>
                    <option value="Semiconductor Fabrication">Semiconductor Fabrication</option>
                    <option value="Power Plant Peaking">Power Plant Peaking</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Ordered Hydrogen (kg)</label>
                  <input
                    type="number"
                    min="50"
                    required
                    value={formData.quantityOrderedKg}
                    onChange={(e) => setFormData({ ...formData, quantityOrderedKg: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Contract Price ($/kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={formData.unitPricePerKg}
                    onChange={(e) => setFormData({ ...formData, unitPricePerKg: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Scheduled Delivery Date</label>
                  <input
                    type="date"
                    required
                    value={formData.scheduledDeliveryDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDeliveryDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Purity Grade Standard</label>
                  <input
                    type="text"
                    value={formData.puritySpecification}
                    onChange={(e) => setFormData({ ...formData, puritySpecification: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Confirm Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Offloading Verification Sign-off */}
      {verifyingDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Customer Offload Sign-off
              </h3>
              <button onClick={() => setVerifyingDelivery(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1 text-slate-300">
              <p><span className="text-slate-500">Customer:</span> {verifyingDelivery.customerName}</p>
              <p><span className="text-slate-500">PO Reference:</span> {verifyingDelivery.orderNumber}</p>
              <p><span className="text-slate-500">Mass to Offload:</span> <span className="font-mono text-emerald-400 font-semibold">{verifyingDelivery.quantityOrderedKg} kg H2</span></p>
            </div>

            <form onSubmit={handleVerify} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Receiver Superintendent Name</label>
                <input
                  type="text"
                  required
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Digital Offloading Verification Code</label>
                <input
                  type="text"
                  required
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setVerifyingDelivery(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Verify & Sign Electronic BOL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Delivery Order */}
      {editingDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                Edit Delivery Order {editingDelivery.deliveryId}
              </h3>
              <button onClick={() => setEditingDelivery(null)} className="text-slate-400 hover:text-white">&times;</button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await onUpdateDelivery(editingDelivery._id, editingDelivery);
                  setEditingDelivery(null);
                } catch (err) {
                  console.error(err);
                }
              }}
              className="mt-4 space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={editingDelivery.customerName}
                    onChange={(e) => setEditingDelivery({ ...editingDelivery, customerName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Order PO Number</label>
                  <input
                    type="text"
                    required
                    value={editingDelivery.orderNumber}
                    onChange={(e) => setEditingDelivery({ ...editingDelivery, orderNumber: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Industry Sector</label>
                  <select
                    value={editingDelivery.industry}
                    onChange={(e) => setEditingDelivery({ ...editingDelivery, industry: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Heavy Mobility / Fueling Station">Heavy Mobility / Fueling Station</option>
                    <option value="Green Steel DRI Plant">Green Steel DRI Plant</option>
                    <option value="Chemical & Ammonia Synthesis">Chemical & Ammonia Synthesis</option>
                    <option value="Semiconductor Fabrication">Semiconductor Fabrication</option>
                    <option value="Power Plant Peaking">Power Plant Peaking</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={editingDelivery.status}
                    onChange={(e) => setEditingDelivery({ ...editingDelivery, status: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Arrived at Site">Arrived at Site</option>
                    <option value="Offloading">Offloading</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Verified">Verified</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Ordered Quantity (kg)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={editingDelivery.quantityOrderedKg}
                    onChange={(e) => setEditingDelivery({ ...editingDelivery, quantityOrderedKg: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Delivered Quantity (kg)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingDelivery.quantityDeliveredKg}
                    onChange={(e) => setEditingDelivery({ ...editingDelivery, quantityDeliveredKg: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Scheduled Delivery Date</label>
                  <input
                    type="date"
                    value={editingDelivery.scheduledDeliveryDate}
                    onChange={(e) => setEditingDelivery({ ...editingDelivery, scheduledDeliveryDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Unit Price ($/kg)</label>
                  <input
                    type="number"
                    step="0.05"
                    value={editingDelivery.unitPricePerKg}
                    onChange={(e) => setEditingDelivery({ ...editingDelivery, unitPricePerKg: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Digital Sign-Off Code</label>
                  <input
                    type="text"
                    value={editingDelivery.digitalSignOffCode || ''}
                    onChange={(e) => setEditingDelivery({ ...editingDelivery, digitalSignOffCode: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Receiver Signature Name</label>
                  <input
                    type="text"
                    value={editingDelivery.receiverSignatureName || ''}
                    onChange={(e) => setEditingDelivery({ ...editingDelivery, receiverSignatureName: e.target.value })}
                    className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingDelivery(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Update Order in MongoDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
