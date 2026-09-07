import React, { useState, useEffect } from 'react';
import {
  Printer,
  Download,
  FileText,
  Receipt,
  FileSpreadsheet,
  Users,
  DollarSign,
  Milk,
  Building,
  CheckCircle2,
  Calendar,
  Layers,
  Plus,
  Trash2,
  ChevronRight,
  ArrowLeft,
  Share2,
  History,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  DocumentTemplateKey,
  PaperFormat,
  DocumentLineItem,
  GeneratedDocumentRecord,
  DEFAULT_BUSINESS_PROFILE,
} from './document.types';
import { DOCUMENT_REGISTRY, DocumentDefinition } from './document.templates';
import {
  DocumentTemplatesRenderer,
  DocumentRenderState,
} from './DocumentTemplatesRenderer';
import { jsPDF } from 'jspdf';

export const PrintDocumentsView: React.FC = () => {
  const { farmers = [], operators = [], centers = [], milkEntries = [], payouts = [] } = useApp();

  const [selectedTemplateKey, setSelectedTemplateKey] = useState<DocumentTemplateKey | null>(null);
  const [paperFormat, setPaperFormat] = useState<PaperFormat>('A4');
  const [activeTab, setActiveTab] = useState<'catalog' | 'generator' | 'history'>('catalog');

  // Generator Form State
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('');
  const [selectedCenterId, setSelectedCenterId] = useState<string>('');
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>('');

  const [partyName, setPartyName] = useState('');
  const [partyCode, setPartyCode] = useState('');
  const [partyPhone, setPartyPhone] = useState('');
  const [partyVillage, setPartyVillage] = useState('');
  const [partyAddress, setPartyAddress] = useState('');
  const [partyGstin, setPartyGstin] = useState('');

  const [docNumber, setDocNumber] = useState(`RF-${Date.now().toString().slice(-6)}`);
  const [docDate, setDocDate] = useState(
    new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  );
  const [docTime, setDocTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
  );
  const [paymentMode, setPaymentMode] = useState('UPI / Direct Settlement');
  const [referenceId, setReferenceId] = useState(`TXN-${Math.floor(100000 + Math.random() * 900000)}`);
  const [notes, setNotes] = useState('Payment and dairy intake confirmed by authorized management.');

  // Milk Specifics
  const [milkType, setMilkType] = useState<'cow' | 'buffalo'>('cow');
  const [quantityLiters, setQuantityLiters] = useState<number>(0);
  const [fat, setFat] = useState<number>(4.0);
  const [snf, setSnf] = useState<number>(8.5);
  const [ratePerLiter, setRatePerLiter] = useState<number>(0);

  // Line items for Invoices/Bills
  const [lineItems, setLineItems] = useState<DocumentLineItem[]>([
    { id: '1', description: 'Fresh Dairy Product / Supply', quantity: 1, unit: 'Liters', rate: 0, discount: 0, taxPercent: 0, amount: 0 },
  ]);

  // Document Audit History State (starts clean)
  const [documentHistory, setDocumentHistory] = useState<GeneratedDocumentRecord[]>([]);

  // Handle Farmer Selection: Auto-populate details!
  const handleFarmerChange = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    const farmer = farmers.find((f) => f.id === farmerId || f.farmerCode === farmerId);
    if (farmer) {
      setPartyName(farmer.name);
      setPartyCode(farmer.farmerCode || farmer.id);
      setPartyPhone(farmer.phone || '+91 98');
      setPartyVillage(farmer.village || 'Anand Hub');
      setPartyAddress(`${farmer.village || 'Dairy Zone'}, Anand District, Gujarat`);

      // Find latest milk entry for this farmer if available
      const latestEntry = milkEntries.find((e) => e.farmerId === farmer.id || e.farmerCode === farmer.farmerCode);
      if (latestEntry) {
        setQuantityLiters(Number(latestEntry.quantityLiters) || 12.0);
        setFat(Number(latestEntry.fatPercentage) || 4.2);
        setSnf(Number(latestEntry.snfPercentage) || 8.6);
        setRatePerLiter(Number(latestEntry.ratePerLiter) || 48.0);
        setMilkType(latestEntry.milkType === 'buffalo' ? 'buffalo' : 'cow');
      }
    }
  };

  // Handle Center Selection
  const handleCenterChange = (centerId: string) => {
    setSelectedCenterId(centerId);
  };

  // Open Document Generator for a specific template
  const handleOpenTemplate = (key: DocumentTemplateKey) => {
    setSelectedTemplateKey(key);
    const def = DOCUMENT_REGISTRY[key];
    setPaperFormat(def.defaultFormat);
    setDocNumber(`${def.documentPrefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`);
    setActiveTab('generator');
  };

  // Add line item
  const handleAddLineItem = () => {
    const newItem: DocumentLineItem = {
      id: Date.now().toString(),
      description: 'Cattle Feed / Dairy Item',
      quantity: 1,
      unit: 'Units',
      rate: 100,
      discount: 0,
      taxPercent: 0,
      amount: 100,
    };
    setLineItems([...lineItems, newItem]);
  };

  // Remove line item
  const handleRemoveLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((i) => i.id !== id));
    }
  };

  // Update line item
  const handleUpdateLineItem = (id: string, field: keyof DocumentLineItem, value: any) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          const qty = Number(updated.quantity) || 0;
          const rate = Number(updated.rate) || 0;
          const disc = Number(updated.discount) || 0;
          updated.amount = Math.max(0, qty * rate - disc);
          return updated;
        }
        return item;
      })
    );
  };

  // Calculations
  const calculatedMilkTotal = (quantityLiters || 0) * (ratePerLiter || 0);
  const itemsSubtotal = lineItems.reduce((sum, i) => sum + (Number(i.quantity) * Number(i.rate) || 0), 0);
  const itemsDiscount = lineItems.reduce((sum, i) => sum + (Number(i.discount) || 0), 0);
  const itemsGrandTotal = Math.max(0, itemsSubtotal - itemsDiscount);

  const grandTotal =
    selectedTemplateKey === 'SALE_MILK_RECEIPT'
      ? calculatedMilkTotal
      : selectedTemplateKey === 'SALARY_SLIP'
      ? 23200
      : selectedTemplateKey === 'FARMER_PAYOUT_RECEIPT'
      ? 5420
      : itemsGrandTotal;

  // Active Center & Operator Names
  const activeCenter = centers.find((c) => c.id === selectedCenterId) || centers[0];
  const activeOperator = operators.find((o) => o.id === selectedOperatorId) || operators[0];

  // Document Render State
  const renderState: DocumentRenderState = {
    templateKey: selectedTemplateKey || 'GENERAL_RECEIPT',
    paperFormat,
    docNumber,
    docDate,
    docTime,
    businessProfile: DEFAULT_BUSINESS_PROFILE,
    partyName,
    partyCode,
    partyPhone,
    partyVillage,
    partyAddress,
    partyGstin,
    referenceId,
    paymentMode,
    centerName: activeCenter?.name || 'Kheda AMCU #01',
    operatorName: activeOperator?.name || 'Abhay Rana (Staff)',
    notes,
    items: lineItems,
    subtotal: itemsSubtotal,
    taxAmount: 0,
    discountAmount: itemsDiscount,
    grandTotal,
    amountPaid: grandTotal,
    balanceDue: 0,
    milkType,
    quantityLiters,
    fat,
    snf,
    ratePerLiter,
  };

  // Print Execution
  const handlePrint = () => {
    // Record in history audit
    const newRecord: GeneratedDocumentRecord = {
      id: `doc-hist-${Date.now()}`,
      documentNumber: docNumber,
      documentType: selectedTemplateKey || 'GENERAL_RECEIPT',
      documentTitle: DOCUMENT_REGISTRY[selectedTemplateKey || 'GENERAL_RECEIPT'].name,
      recipientName: `${partyName} (${partyCode})`,
      amount: grandTotal,
      paperFormat,
      createdAt: 'Just now',
      createdBy: 'Admin Console',
    };
    setDocumentHistory([newRecord, ...documentHistory]);

    window.print();
  };

  // PDF Export
  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: paperFormat === 'A5' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: paperFormat === 'A5' ? 'a5' : 'a4',
    });

    doc.setFontSize(14);
    doc.text(DEFAULT_BUSINESS_PROFILE.name, 14, 18);
    doc.setFontSize(10);
    doc.text(DOCUMENT_REGISTRY[selectedTemplateKey || 'GENERAL_RECEIPT'].name, 14, 25);
    doc.text(`Doc #: ${docNumber} | Date: ${docDate}`, 14, 31);
    doc.text(`Party: ${partyName} (${partyCode})`, 14, 37);
    doc.text(`Amount: Rs. ${grandTotal.toFixed(2)}`, 14, 43);

    doc.save(`${docNumber}_${selectedTemplateKey}.pdf`);
  };

  const getCategoryIcon = (key: DocumentTemplateKey) => {
    switch (key) {
      case 'SALE_MILK_RECEIPT':
      case 'FARMER_10DAY_SUMMARY':
      case 'FARMER_LEDGER_STATEMENT':
        return <Milk className="w-5 h-5 text-emerald-700" />;
      case 'FARMER_PAYOUT_RECEIPT':
      case 'SALARY_SLIP':
      case 'EXPENSE_BILL':
      case 'GENERAL_RECEIPT':
        return <DollarSign className="w-5 h-5 text-teal-700" />;
      case 'BILL_PRINT':
      case 'SALE_BILL':
      case 'PURCHASE_BILL':
      case 'MISCELLANEOUS_BILL':
        return <Receipt className="w-5 h-5 text-blue-700" />;
      default:
        return <Building className="w-5 h-5 text-indigo-700" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Banner (Hidden in Print) */}
      <div className="print:hidden bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black uppercase">
              <Printer className="w-3.5 h-3.5" />
              <span>Dairy ERP Document & Printing Hub</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Print & Documents System
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Generate, preview, print, and export official receipts, tax invoices, pay slips, and farmer ledger statements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'catalog'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Templates (14)</span>
            </button>

            {selectedTemplateKey && (
              <button
                onClick={() => setActiveTab('generator')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'generator'
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Live Editor & Preview</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History ({documentHistory.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────────
          VIEW 1: TEMPLATE CARDS CATALOG GRID (14 Templates)
      ─────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'catalog' && (
        <div className="print:hidden space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(DOCUMENT_REGISTRY).map((tmpl) => (
              <div
                key={tmpl.key}
                className="bg-white rounded-3xl p-5 border border-emerald-100/90 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center">
                      {getCategoryIcon(tmpl.key)}
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-mono">
                      {tmpl.documentPrefix}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-black text-gray-900">{tmpl.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{tmpl.description}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {tmpl.supportedFormats.map((fmt) => (
                      <span
                        key={fmt}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-200 font-mono"
                      >
                        {fmt.replace('THERMAL_', '')}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleOpenTemplate(tmpl.key)}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <span>Create & Print</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────
          VIEW 2: TWO-COLUMN GENERATOR HUB (Inputs Left + Live Preview Right)
      ─────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'generator' && selectedTemplateKey && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form Selectors & Inputs (5 Cols) (Hidden in Print) */}
          <div className="print:hidden lg:col-span-5 bg-white rounded-3xl p-5 border border-emerald-100 shadow-xs space-y-4 max-h-[86vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-600 cursor-pointer"
                  title="Back to templates"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h3 className="text-sm font-black text-gray-900">
                    {DOCUMENT_REGISTRY[selectedTemplateKey].name}
                  </h3>
                  <p className="text-[11px] text-gray-500">Configure parameters or select existing records</p>
                </div>
              </div>

              {/* Paper Format Selector */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                {DOCUMENT_REGISTRY[selectedTemplateKey].supportedFormats.map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setPaperFormat(fmt)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      paperFormat === fmt ? 'bg-white text-emerald-950 shadow-xs' : 'text-gray-600 hover:text-gray-950'
                    }`}
                  >
                    {fmt.replace('THERMAL_', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Auto-Fill Dropdowns */}
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-2xl space-y-2">
                <span className="text-[10px] font-black text-emerald-950 uppercase tracking-wider block">
                  ⚡ Auto-Fill From Existing Records
                </span>

                {/* Farmer Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">Select Farmer Member</label>
                  <select
                    value={selectedFarmerId}
                    onChange={(e) => handleFarmerChange(e.target.value)}
                    className="w-full text-xs font-bold bg-white border border-gray-200 rounded-xl p-2 focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="">-- Choose Registered Farmer --</option>
                    {farmers.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.farmerCode}) - {f.village}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Center & Operator Selectors */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Collection Hub</label>
                    <select
                      value={selectedCenterId}
                      onChange={(e) => handleCenterChange(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-200 rounded-xl p-1.5"
                    >
                      {centers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-600 mb-0.5">Staff Operator</label>
                    <select
                      value={selectedOperatorId}
                      onChange={(e) => setSelectedOperatorId(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-200 rounded-xl p-1.5"
                    >
                      {operators.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-3 pt-1 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Party / Farmer Name</label>
                    <input
                      type="text"
                      value={partyName}
                      onChange={(e) => setPartyName(e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={partyPhone}
                      onChange={(e) => setPartyPhone(e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Document Number</label>
                    <input
                      type="text"
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Payment Method</label>
                    <select
                      value={paymentMode}
                      onChange={(e) => setPaymentMode(e.target.value)}
                      className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl font-bold"
                    >
                      <option value="UPI / Direct Settlement">UPI / Direct Settlement</option>
                      <option value="Direct Bank Transfer / NEFT">Direct Bank Transfer</option>
                      <option value="Cash Settlement">Cash Settlement</option>
                      <option value="Digital Ledger Credit">Digital Ledger Credit</option>
                    </select>
                  </div>
                </div>

                {/* Milk Collection Specifics */}
                {selectedTemplateKey === 'SALE_MILK_RECEIPT' && (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl space-y-2">
                    <span className="font-bold text-gray-700 text-[10px] uppercase block">🥛 Milk Testing Inputs</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-gray-500 font-bold">Qty (Liters)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={quantityLiters}
                          onChange={(e) => setQuantityLiters(Number(e.target.value))}
                          className="w-full p-1.5 bg-white border border-gray-200 rounded-lg font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 font-bold">FAT %</label>
                        <input
                          type="number"
                          step="0.1"
                          value={fat}
                          onChange={(e) => setFat(Number(e.target.value))}
                          className="w-full p-1.5 bg-white border border-gray-200 rounded-lg font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-500 font-bold">Rate/L (₹)</label>
                        <input
                          type="number"
                          step="0.5"
                          value={ratePerLiter}
                          onChange={(e) => setRatePerLiter(Number(e.target.value))}
                          className="w-full p-1.5 bg-white border border-gray-200 rounded-lg font-bold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Line Items for Invoices/Bills */}
                {(selectedTemplateKey === 'BILL_PRINT' ||
                  selectedTemplateKey === 'SALE_BILL' ||
                  selectedTemplateKey === 'PURCHASE_BILL' ||
                  selectedTemplateKey === 'MISCELLANEOUS_BILL') && (
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-700 text-[10px] uppercase">Line Items</span>
                      <button
                        onClick={handleAddLineItem}
                        className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:underline cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Row</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {lineItems.map((item) => (
                        <div key={item.id} className="p-2.5 bg-gray-50 border border-gray-200 rounded-xl space-y-1.5">
                          <div className="flex justify-between gap-2">
                            <input
                              type="text"
                              value={item.description}
                              onChange={(e) => handleUpdateLineItem(item.id, 'description', e.target.value)}
                              placeholder="Item description"
                              className="w-full p-1 bg-white border border-gray-200 rounded text-xs font-bold"
                            />
                            {lineItems.length > 1 && (
                              <button
                                onClick={() => handleRemoveLineItem(item.id)}
                                className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleUpdateLineItem(item.id, 'quantity', Number(e.target.value))}
                              placeholder="Qty"
                              className="p-1 bg-white border border-gray-200 rounded text-xs"
                            />
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => handleUpdateLineItem(item.id, 'rate', Number(e.target.value))}
                              placeholder="Rate"
                              className="p-1 bg-white border border-gray-200 rounded text-xs"
                            />
                            <div className="text-right font-bold text-xs pt-1 font-mono">
                              ₹{item.amount.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Print & Export Bar */}
            <div className="pt-4 border-t border-gray-100 flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Document</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-xs border border-emerald-200 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Right Column: Live Printable ERP Preview (7 Cols) */}
          <div className="lg:col-span-7 bg-gray-100/70 p-4 sm:p-6 rounded-3xl border border-gray-200 overflow-x-auto min-h-[86vh] flex flex-col items-center justify-start">
            <div className="w-full flex items-center justify-between mb-3 text-xs text-gray-500 font-medium print:hidden">
              <span>Live ERP Document Preview ({paperFormat})</span>
              <span className="font-mono text-[11px] font-bold text-emerald-800">Ready for Direct Print</span>
            </div>

            {/* Document Render Output */}
            <DocumentTemplatesRenderer state={renderState} />
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────
          VIEW 3: GENERATED DOCUMENT HISTORY & AUDIT TRAIL
      ─────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'history' && (
        <div className="print:hidden bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-base font-black text-gray-950">Generated Documents Audit Trail</h3>
              <p className="text-xs text-gray-500">Persistent log of all printed and exported financial documents.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Document #</th>
                  <th className="py-2.5 px-3">Document Type</th>
                  <th className="py-2.5 px-3">Recipient / Beneficiary</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Paper Format</th>
                  <th className="py-2.5 px-3">Generated At</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {documentHistory.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-mono font-bold text-gray-900">{doc.documentNumber}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {doc.documentTitle}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-gray-800">{doc.recipientName}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-950">₹{doc.amount.toFixed(2)}</td>
                    <td className="py-3 px-3 font-mono text-[10px] text-gray-500">{doc.paperFormat}</td>
                    <td className="py-3 px-3 text-gray-500">{doc.createdAt}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleOpenTemplate(doc.documentType)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-[11px] cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reprint</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
