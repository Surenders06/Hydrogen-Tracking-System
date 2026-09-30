import React, { useState, useEffect } from 'react';
import { X, Database, Save, Trash2, Plus, RefreshCw, Search, Code, CheckCircle2, AlertCircle, FileJson } from 'lucide-react';
import { api } from '../services/api';

interface MongoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const MongoStudioModal: React.FC<MongoStudioModalProps> = ({ isOpen, onClose, onDataChanged }) => {
  const [collections, setCollections] = useState<Array<{ name: string; count: number; label: string }>>([]);
  const [activeCollection, setActiveCollection] = useState<string>('productions');
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Editing state
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editingJsonText, setEditingJsonText] = useState<string>('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New doc state
  const [isInserting, setIsInserting] = useState(false);
  const [newDocJson, setNewDocJson] = useState<string>('{\n  "name": "New Entity"\n}');

  const loadCollections = async () => {
    try {
      const cols = await api.getCollections();
      setCollections(cols);
    } catch (e) {
      console.error(e);
    }
  };

  const loadDocuments = async (colName: string) => {
    setLoading(true);
    setEditingDocId(null);
    setIsInserting(false);
    setJsonError(null);
    try {
      const docs = await api.getCollectionDocs(colName);
      setDocuments(docs);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadCollections();
      loadDocuments(activeCollection);
    }
  }, [isOpen, activeCollection]);

  const handleStartEdit = (doc: any) => {
    setEditingDocId(doc._id);
    setEditingJsonText(JSON.stringify(doc, null, 2));
    setJsonError(null);
    setSaveSuccess(false);
  };

  const handleSaveEdit = async () => {
    setJsonError(null);
    try {
      const parsed = JSON.parse(editingJsonText);
      if (!editingDocId) return;

      await api.updateCollectionDoc(activeCollection, editingDocId, parsed);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      setEditingDocId(null);
      await loadDocuments(activeCollection);
      await loadCollections();
      onDataChanged();
    } catch (e: any) {
      setJsonError(e.message || 'Invalid JSON syntax');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Delete document ${id} from MongoDB collection '${activeCollection}'?`)) return;
    try {
      await api.deleteCollectionDoc(activeCollection, id);
      await loadDocuments(activeCollection);
      await loadCollections();
      onDataChanged();
    } catch (e) {
      console.error(e);
    }
  };

  const handleInsert = async () => {
    setJsonError(null);
    try {
      const parsed = JSON.parse(newDocJson);
      await api.insertCollectionDoc(activeCollection, parsed);
      setIsInserting(false);
      await loadDocuments(activeCollection);
      await loadCollections();
      onDataChanged();
    } catch (e: any) {
      setJsonError(e.message || 'Invalid JSON syntax');
    }
  };

  const filteredDocs = documents.filter(doc => {
    if (!searchTerm) return true;
    const str = JSON.stringify(doc).toLowerCase();
    return str.includes(searchTerm.toLowerCase());
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-950/70 border border-emerald-800 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">MongoDB Live Document Studio</h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Database: hydrogen_supplychain_db
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Direct CRUD & JSON Document Editor — Any update immediately synchronizes across the hydrogen supply chain frontend & backend.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Body: Left Collections Sidebar, Right Document Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Collection Selector Sidebar */}
          <div className="w-64 border-r border-slate-800 bg-slate-950/40 p-3 flex flex-col gap-1 overflow-y-auto shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
              Collections ({collections.length})
            </span>
            {collections.map(col => {
              const isActive = activeCollection === col.name;
              return (
                <button
                  key={col.name}
                  onClick={() => setActiveCollection(col.name)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 font-semibold border border-slate-700'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <span className="font-mono truncate">{col.name}</span>
                  <span className="font-mono text-[11px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded">
                    {col.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Documents Workspace */}
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/50">
            {/* Action Bar */}
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-800 bg-slate-950/30">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Search ${activeCollection} documents...`}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsInserting(true);
                    setEditingDocId(null);
                    setNewDocJson(JSON.stringify({
                      createdAt: new Date().toISOString(),
                      status: "Active"
                    }, null, 2));
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Insert Document
                </button>

                <button
                  onClick={() => loadDocuments(activeCollection)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Reload from MongoDB"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {jsonError && (
                <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{jsonError}</span>
                </div>
              )}

              {saveSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-lg text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>MongoDB document successfully updated and persisted to storage engine!</span>
                </div>
              )}

              {/* Insert Form */}
              {isInserting && (
                <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/50 shadow-lg space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-cyan-400">
                    <span className="flex items-center gap-1.5">
                      <Code className="w-4 h-4" />
                      Insert New Document to `db.{activeCollection}`
                    </span>
                    <button onClick={() => setIsInserting(false)} className="text-slate-400 hover:text-white">&times;</button>
                  </div>
                  <textarea
                    rows={8}
                    value={newDocJson}
                    onChange={(e) => setNewDocJson(e.target.value)}
                    className="w-full p-3 font-mono text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setIsInserting(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleInsert}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg"
                    >
                      Save to MongoDB
                    </button>
                  </div>
                </div>
              )}

              {/* List of Documents */}
              {filteredDocs.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No documents found in collection `{activeCollection}`.
                </div>
              ) : (
                filteredDocs.map((doc, idx) => {
                  const isEditing = editingDocId === doc._id;

                  return (
                    <div
                      key={doc._id || idx}
                      className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-cyan-400 font-semibold text-[11px]">
                            _id: {doc._id}
                          </span>
                          {doc.batchId && <span className="font-mono text-white text-[11px]">· {doc.batchId}</span>}
                          {doc.tankId && <span className="font-mono text-indigo-400 text-[11px]">· {doc.tankId}</span>}
                          {doc.shipmentNumber && <span className="font-mono text-amber-400 text-[11px]">· {doc.shipmentNumber}</span>}
                          {doc.deliveryId && <span className="font-mono text-emerald-400 text-[11px]">· {doc.deliveryId}</span>}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isEditing ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors"
                              >
                                <Save className="w-3 h-3" />
                                Save
                              </button>
                              <button
                                onClick={() => setEditingDocId(null)}
                                className="px-2 py-1 text-[11px] text-slate-400 hover:text-white"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleStartEdit(doc)}
                                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                              >
                                <Code className="w-3 h-3 text-cyan-400" />
                                Edit Document
                              </button>
                              <button
                                onClick={() => handleDelete(doc._id)}
                                className="p-1 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                                title="Delete Document"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Display View or Edit View */}
                      {isEditing ? (
                        <div className="mt-2.5 space-y-2">
                          <textarea
                            rows={10}
                            value={editingJsonText}
                            onChange={(e) => setEditingJsonText(e.target.value)}
                            className="w-full p-2.5 font-mono text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 leading-relaxed"
                          />
                        </div>
                      ) : (
                        <pre className="mt-2 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48 leading-snug p-2 bg-slate-950/80 rounded border border-slate-800/40">
                          {JSON.stringify(doc, null, 2)}
                        </pre>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
          <span>MongoDB Document Engine (v1.0.0) · Persistent JSON file synchronization active</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close Studio
          </button>
        </div>
      </div>
    </div>
  );
};
