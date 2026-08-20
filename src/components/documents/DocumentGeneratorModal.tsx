"use client";

import React, { useState, useEffect } from 'react';
import { useFarm } from '@/context/FarmContext';
import { DOCUMENT_TEMPLATES, PaperFormat, generateDocumentNumber } from '@/services/documents/templates.registry';
import { X, Printer, Download, FileText, Settings, CheckCircle2, Plus, Trash2, Edit3, Sliders, RefreshCw, User, Building, Eye } from 'lucide-react';

// Import All 14 Templates
import { GeneralReceiptTemplate } from './templates/GeneralReceiptTemplate';
import { BillPrintTemplate } from './templates/BillPrintTemplate';
import { SalarySlipTemplate } from './templates/SalarySlipTemplate';
import { PurchaseBillTemplate } from './templates/PurchaseBillTemplate';
import { SaleBillTemplate } from './templates/SaleBillTemplate';
import { SaleMilkReceiptTemplate } from './templates/SaleMilkReceiptTemplate';
import { ExpenseBillTemplate } from './templates/ExpenseBillTemplate';
import { MiscBillTemplate } from './templates/MiscBillTemplate';
import { Farmer10DaySummaryTemplate } from './templates/Farmer10DaySummaryTemplate';
import { FarmerPayoutReceiptTemplate } from './templates/FarmerPayoutReceiptTemplate';
import { FarmerLedgerTemplate } from './templates/FarmerLedgerTemplate';
import { CenterDailySummaryTemplate } from './templates/CenterDailySummaryTemplate';
import { OperatorDailySummaryTemplate } from './templates/OperatorDailySummaryTemplate';
import { MonthlyMilkReportTemplate } from './templates/MonthlyMilkReportTemplate';

interface LineItemState {
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  discount: number;
  taxPercent: number;
  amount: number;
}

interface DocumentGeneratorModalProps {
  templateId: string;
  initialData?: any;
  onClose: () => void;
}

export const DocumentGeneratorModal: React.FC<DocumentGeneratorModalProps> = ({
  templateId,
  initialData,
  onClose
}) => {
  const { farmers, employees, collectionCenters } = useFarm();
  const templateMeta = DOCUMENT_TEMPLATES[templateId] || DOCUMENT_TEMPLATES['GENERAL_RECEIPT'];

  const [editorMode, setEditorMode] = useState<'auto' | 'custom'>('custom');
  const [mobileActiveTab, setMobileActiveTab] = useState<'editor' | 'preview'>('editor');
  const [paperFormat, setPaperFormat] = useState<PaperFormat>(templateMeta.defaultFormat);
  const [docNumber, setDocNumber] = useState('');

  // Selector state
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || 'RF1024');
  const [selectedOperatorId, setSelectedOperatorId] = useState(employees[0]?.id || 'EMP102');

  // Business Profile Editable State
  const [businessName, setBusinessName] = useState('RUDU DAIRY & LIVESTOCK FARM');
  const [businessAddress, setBusinessAddress] = useState('Village Road, Main Collection Hub, Sector 4, Kheda');
  const [businessPhone, setBusinessPhone] = useState('+91 8859171700');
  const [businessGstin, setBusinessGstin] = useState('07AAAAA0000A1Z5');

  // Recipient / Customer Editable State
  const [customerName, setCustomerName] = useState('Ramesh Yadav');
  const [customerPhone, setCustomerPhone] = useState('+91 98765 43210');
  const [customerAddress, setCustomerAddress] = useState('Kheda Village');
  const [farmerIdCode, setFarmerIdCode] = useState('RF1024');

  // Financial & Date Controls
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [docTime, setDocTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-10');
  const [paymentMode, setPaymentMode] = useState('Direct Bank Transfer (UPI)');
  const [transactionId, setTransactionId] = useState('TXN-884920194');
  const [customAmount, setCustomAmount] = useState('5000');
  const [amountPaid, setAmountPaid] = useState('5000');
  const [customNotes, setCustomNotes] = useState('Processed via Rudu Farm ERP Central Document System');

  // Milk Specific Editable State
  const [milkType, setMilkType] = useState('Cow Milk');
  const [milkQuantity, setMilkQuantity] = useState(12.5);
  const [milkFat, setMilkFat] = useState(4.2);
  const [milkSnf, setMilkSnf] = useState(8.6);
  const [milkRate, setMilkRate] = useState(49.50);
  const [milkShift, setMilkShift] = useState('Morning');

  // Multi-Line Items State for Bills & Invoices
  const [items, setItems] = useState<LineItemState[]>([
    { description: 'Fresh Whole Cow Milk (Chilled)', quantity: 150, unit: 'Liters', rate: 52, discount: 0, taxPercent: 0, amount: 7800 },
    { description: 'Pure A2 Desi Buffalo Ghee', quantity: 5, unit: 'Kg', rate: 1200, discount: 100, taxPercent: 5, amount: 5900 },
    { description: 'Fresh Organic Paneer', quantity: 10, unit: 'Kg', rate: 380, discount: 0, taxPercent: 0, amount: 3800 }
  ]);

  useEffect(() => {
    setDocNumber(generateDocumentNumber(templateMeta.prefix));
  }, [templateId]);

  // Sync selected farmer data into editable fields when farmer changes in auto mode
  useEffect(() => {
    const f = (farmers || []).find((farmer: any) => farmer.id === selectedFarmerId);
    if (f) {
      setCustomerName(f.name);
      setCustomerPhone(f.phone || '');
      setCustomerAddress(f.village || '');
      setFarmerIdCode(f.id);
    }
  }, [selectedFarmerId, farmers]);

  const selectedOperator = (employees || []).find((e: any) => e.id === selectedOperatorId) || employees[0];

  // Item Handlers
  const handleItemChange = (index: number, field: keyof LineItemState, val: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: val };
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    const disc = Number(item.discount) || 0;
    item.amount = Math.max(0, (qty * rate) - disc);
    updated[index] = item;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: 'New Product Item', quantity: 1, unit: 'Pcs', rate: 100, discount: 0, taxPercent: 0, amount: 100 }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () => items.reduce((sum, i) => sum + i.amount, 0);

  // Consolidated Document Data Object
  const docData = {
    documentNumber: docNumber,
    date: docDate,
    time: docTime,
    startDate,
    endDate,
    recipient: {
      name: customerName,
      code: farmerIdCode,
      phone: customerPhone,
      address: customerAddress,
      village: customerAddress
    },
    milkDetails: {
      type: milkType,
      quantity: milkQuantity,
      fat: milkFat,
      snf: milkSnf,
      rate: milkRate,
      shift: milkShift,
      totalAmount: Math.round(milkQuantity * milkRate)
    },
    items,
    totals: {
      subtotal: items.length > 0 ? calculateSubtotal() : parseFloat(customAmount) || 0,
      discount: 0,
      tax: 0,
      totalAmount: items.length > 0 ? calculateSubtotal() : parseFloat(customAmount) || 0,
      paidAmount: parseFloat(amountPaid) || 0,
      dueAmount: Math.max(0, (items.length > 0 ? calculateSubtotal() : parseFloat(customAmount) || 0) - (parseFloat(amountPaid) || 0))
    },
    payment: {
      mode: paymentMode,
      transactionId,
      status: (parseFloat(amountPaid) || 0) >= (parseFloat(customAmount) || 0) ? 'PAID' : 'PARTIAL'
    },
    operator: {
      name: selectedOperator?.name || 'Operator (EMP102)',
      id: selectedOperator?.id || 'EMP102'
    },
    remarks: customNotes
  };

  const tenantInfo = {
    name: businessName,
    address: businessAddress,
    phone: businessPhone,
    gstin: businessGstin
  };

  const handlePrint = () => {
    window.print();
  };

  const renderTemplateComponent = () => {
    switch (templateId) {
      case 'GENERAL_RECEIPT': return <GeneralReceiptTemplate format={paperFormat} docData={docData} tenantInfo={tenantInfo} />;
      case 'BILL_PRINT': return <BillPrintTemplate format={paperFormat} docData={docData} tenantInfo={tenantInfo} />;
      case 'SALARY_SLIP': return <SalarySlipTemplate format={paperFormat} docData={docData as any} tenantInfo={tenantInfo} />;
      case 'PURCHASE_BILL': return <PurchaseBillTemplate format={paperFormat} docData={docData} tenantInfo={tenantInfo} />;
      case 'SALE_BILL': return <SaleBillTemplate format={paperFormat} docData={docData} tenantInfo={tenantInfo} />;
      case 'SALE_MILK_RECEIPT': return <SaleMilkReceiptTemplate format={paperFormat} docData={docData} tenantInfo={tenantInfo} />;
      case 'EXPENSE_BILL': return <ExpenseBillTemplate format={paperFormat} docData={docData} tenantInfo={tenantInfo} />;
      case 'MISC_BILL': return <MiscBillTemplate format={paperFormat} docData={docData} tenantInfo={tenantInfo} />;
      case 'FARMER_10DAY_SUMMARY': return <Farmer10DaySummaryTemplate format={paperFormat} docData={docData} tenantInfo={tenantInfo} />;
      case 'FARMER_PAYOUT_RECEIPT': return <FarmerPayoutReceiptTemplate format={paperFormat} docData={docData} tenantInfo={tenantInfo} />;
      case 'FARMER_LEDGER': return <FarmerLedgerTemplate format={paperFormat} docData={docData} tenantInfo={tenantInfo} />;
      case 'CENTER_DAILY_SUMMARY': return <CenterDailySummaryTemplate format={paperFormat} docData={docData} tenantInfo={tenantInfo} />;
      case 'OPERATOR_DAILY_SUMMARY': return <OperatorDailySummaryTemplate format={paperFormat} docData={docData} tenantInfo={tenantInfo} />;
      case 'MONTHLY_MILK_REPORT': return <MonthlyMilkReportTemplate format={paperFormat} docData={docData as any} tenantInfo={tenantInfo} />;
      default: return <GeneralReceiptTemplate format={paperFormat} docData={docData} tenantInfo={tenantInfo} />;
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 2000, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)', padding: '8px' }}>
      <div className="modal-content non-printable" style={{
        maxWidth: '1360px',
        width: '100%',
        height: '95vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)',
        background: '#FFFFFF'
      }}>
        {/* Top Header Controls Bar */}
        <div style={{
          background: 'linear-gradient(135deg, #4E2A18 0%, #7C3A21 100%)',
          color: '#FFFFFF',
          padding: '12px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={22} color="#F5EBE1" />
            <div>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>
                {templateMeta.name}
              </h3>
              <span style={{ fontSize: '11px', color: '#F5EBE1', opacity: 0.85 }}>
                Doc #: <b>{docNumber}</b>
              </span>
            </div>
          </div>

          {/* Mobile Screen Editor vs Live Preview Tab Switcher */}
          <div className="md:hidden" style={{ display: 'flex', background: 'rgba(255,255,255,0.15)', padding: '3px', borderRadius: '20px', gap: '2px' }}>
            <button
              onClick={() => setMobileActiveTab('editor')}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '11.5px',
                fontWeight: '800',
                background: mobileActiveTab === 'editor' ? '#FFFFFF' : 'transparent',
                color: mobileActiveTab === 'editor' ? '#4E2A18' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Edit3 size={13} /> Edit Form
            </button>
            <button
              onClick={() => setMobileActiveTab('preview')}
              style={{
                padding: '5px 12px',
                borderRadius: '16px',
                border: 'none',
                fontSize: '11.5px',
                fontWeight: '800',
                background: mobileActiveTab === 'preview' ? '#FFFFFF' : 'transparent',
                color: mobileActiveTab === 'preview' ? '#4E2A18' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <Eye size={13} /> Live Preview
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={handlePrint} className="btn" style={{ background: '#FFFFFF', color: '#4E2A18', fontWeight: '800', fontSize: '12px', borderRadius: '30px', padding: '6px 14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Printer size={14} /> <span className="hidden sm:inline">Print</span>
            </button>
            <button onClick={handlePrint} className="btn" style={{ background: '#EAF4EE', color: '#065F46', fontWeight: '800', fontSize: '12px', borderRadius: '30px', padding: '6px 14px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Download size={14} /> <span className="hidden sm:inline">PDF</span>
            </button>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFFFFF', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Body Split View */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden', flexDirection: 'row' }}>
          {/* Left Panel: Professional Billing Editor */}
          <div 
            className={`w-full md:w-[420px] lg:w-[460px] ${mobileActiveTab === 'editor' ? 'block' : 'hidden md:block'}`}
            style={{
              background: '#F8FAF9',
              borderRight: '1.5px solid #CBD5E1',
              padding: '16px',
              overflowY: 'auto',
              display: mobileActiveTab === 'editor' ? 'flex' : undefined,
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            {/* Editor Mode Selector */}
            <div style={{ background: '#FFFFFF', padding: '5px', borderRadius: '12px', border: '1px solid #CBD5E1', display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setEditorMode('custom')}
                style={{
                  flex: 1,
                  padding: '7px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  fontWeight: '800',
                  border: 'none',
                  background: editorMode === 'custom' ? '#4E2A18' : 'transparent',
                  color: editorMode === 'custom' ? '#FFFFFF' : '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <Edit3 size={13} /> Professional Editor
              </button>
              <button
                onClick={() => setEditorMode('auto')}
                style={{
                  flex: 1,
                  padding: '7px',
                  borderRadius: '8px',
                  fontSize: '11.5px',
                  fontWeight: '800',
                  border: 'none',
                  background: editorMode === 'auto' ? '#4E2A18' : 'transparent',
                  color: editorMode === 'auto' ? '#FFFFFF' : '#475569',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px'
                }}
              >
                <RefreshCw size={13} /> Database Sync
              </button>
            </div>

            {/* Paper Size Selector */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px' }}>
                Paper Layout Size
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {templateMeta.supportedFormats.map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setPaperFormat(fmt)}
                    style={{
                      padding: '7px',
                      fontSize: '11px',
                      fontWeight: '800',
                      borderRadius: '8px',
                      border: paperFormat === fmt ? '2px solid #4E2A18' : '1px solid #CBD5E1',
                      background: paperFormat === fmt ? '#4E2A18' : '#FFFFFF',
                      color: paperFormat === fmt ? '#FFFFFF' : '#334155',
                      cursor: 'pointer'
                    }}
                  >
                    {fmt.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Auto Mode: Database Record Selector */}
            {editorMode === 'auto' && (
              <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '12px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Select Farmer / Entity from Database
                </label>
                <select
                  value={selectedFarmerId}
                  onChange={e => setSelectedFarmerId(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '12.5px' }}
                >
                  {farmers.map((f: any) => (
                    <option key={f.id} value={f.id}>{f.name} ({f.id}) - {f.village}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Business Profile Details Section */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '12px' }}>
              <div style={{ fontWeight: '800', fontSize: '12px', color: '#4E2A18', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building size={14} /> Business Header Info
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Business Name</label>
                  <input type="text" value={businessName} onChange={e => setBusinessName(e.target.value)} className="form-input" style={{ fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Address</label>
                  <input type="text" value={businessAddress} onChange={e => setBusinessAddress(e.target.value)} className="form-input" style={{ fontSize: '12px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Phone</label>
                    <input type="text" value={businessPhone} onChange={e => setBusinessPhone(e.target.value)} className="form-input" style={{ fontSize: '12px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>GSTIN</label>
                    <input type="text" value={businessGstin} onChange={e => setBusinessGstin(e.target.value)} className="form-input" style={{ fontSize: '12px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Customer / Farmer Profile Details Section */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '12px' }}>
              <div style={{ fontWeight: '800', fontSize: '12px', color: '#4E2A18', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} /> Recipient / Customer Details
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Name</label>
                    <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="form-input" style={{ fontSize: '12px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>ID / Code</label>
                    <input type="text" value={farmerIdCode} onChange={e => setFarmerIdCode(e.target.value)} className="form-input" style={{ fontSize: '12px' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Phone</label>
                    <input type="text" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="form-input" style={{ fontSize: '12px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Village / Address</label>
                    <input type="text" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="form-input" style={{ fontSize: '12px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Milk Specific Controls */}
            {(templateId === 'SALE_MILK_RECEIPT' || templateId === 'FARMER_10DAY_SUMMARY') && (
              <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '12px' }}>
                <div style={{ fontWeight: '800', fontSize: '12px', color: '#4E2A18', marginBottom: '8px' }}>
                  🥛 Milk Collection Metrics
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Milk Type</label>
                    <select value={milkType} onChange={e => setMilkType(e.target.value)} className="form-input" style={{ fontSize: '12px' }}>
                      <option value="Cow Milk">Cow Milk</option>
                      <option value="Buffalo Milk">Buffalo Milk</option>
                      <option value="Mixed Milk">Mixed Milk</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Quantity (Liters)</label>
                    <input type="number" value={milkQuantity} onChange={e => setMilkQuantity(parseFloat(e.target.value) || 0)} className="form-input" style={{ fontSize: '12px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>FAT %</label>
                    <input type="number" step="0.1" value={milkFat} onChange={e => setMilkFat(parseFloat(e.target.value) || 0)} className="form-input" style={{ fontSize: '12px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>SNF %</label>
                    <input type="number" step="0.1" value={milkSnf} onChange={e => setMilkSnf(parseFloat(e.target.value) || 0)} className="form-input" style={{ fontSize: '12px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Rate per Litre (₹)</label>
                    <input type="number" value={milkRate} onChange={e => setMilkRate(parseFloat(e.target.value) || 0)} className="form-input" style={{ fontSize: '12px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Shift</label>
                    <select value={milkShift} onChange={e => setMilkShift(e.target.value)} className="form-input" style={{ fontSize: '12px' }}>
                      <option value="Morning">Morning</option>
                      <option value="Evening">Evening</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Multi-Line Items Table Manager (for Bills & Invoices) */}
            {(templateId.includes('BILL') || templateId === 'GENERAL_RECEIPT' || templateId === 'MISC_BILL') && (
              <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '800', fontSize: '12px', color: '#4E2A18' }}>
                    🛒 Line Items Table Editor
                  </div>
                  <button onClick={handleAddItem} style={{ background: '#EAF4EE', color: '#065F46', border: '1px solid #BBF7D0', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Plus size={12} /> Add Item
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {items.map((item, idx) => (
                    <div key={idx} style={{ background: '#F8FAF9', border: '1px solid #E2E8F0', padding: '8px', borderRadius: '8px', fontSize: '11px' }}>
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                        <input
                          type="text"
                          value={item.description}
                          onChange={e => handleItemChange(idx, 'description', e.target.value)}
                          placeholder="Item Description"
                          className="form-input"
                          style={{ flex: 1, fontSize: '11.5px', padding: '4px 8px' }}
                        />
                        <button onClick={() => handleRemoveItem(idx)} style={{ background: '#FEF2F2', color: '#DC2626', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                        <div>
                          <label style={{ fontSize: '9px', color: '#64748B' }}>Qty</label>
                          <input type="number" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)} className="form-input" style={{ fontSize: '11px', padding: '2px 4px' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '9px', color: '#64748B' }}>Rate (₹)</label>
                          <input type="number" value={item.rate} onChange={e => handleItemChange(idx, 'rate', parseFloat(e.target.value) || 0)} className="form-input" style={{ fontSize: '11px', padding: '2px 4px' }} />
                        </div>
                        <div>
                          <label style={{ fontSize: '9px', color: '#64748B' }}>Total (₹)</label>
                          <input type="number" value={item.amount} readOnly className="form-input" style={{ fontSize: '11px', padding: '2px 4px', fontWeight: '800', background: '#E2E8F0' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Financial Totals & Payment Info */}
            <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '12px' }}>
              <div style={{ fontWeight: '800', fontSize: '12px', color: '#4E2A18', marginBottom: '8px' }}>
                💳 Financials & Payment Terms
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Doc Amount (₹)</label>
                  <input type="number" value={customAmount} onChange={e => setCustomAmount(e.target.value)} className="form-input" style={{ fontSize: '12px', fontWeight: '800' }} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Amount Paid (₹)</label>
                  <input type="number" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} className="form-input" style={{ fontSize: '12px', fontWeight: '800' }} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Payment Mode</label>
                  <input type="text" value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="form-input" style={{ fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '700', color: '#64748B' }}>Txn Ref #</label>
                  <input type="text" value={transactionId} onChange={e => setTransactionId(e.target.value)} className="form-input" style={{ fontSize: '12px' }} />
                </div>
              </div>
            </div>

            {/* Remarks / Terms */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                Custom Notes & Remarks
              </label>
              <textarea
                value={customNotes}
                onChange={e => setCustomNotes(e.target.value)}
                rows={2}
                className="form-input"
                style={{ fontSize: '12px', resize: 'vertical' }}
              />
            </div>

            <div style={{ background: '#EAF4EE', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '10px', fontSize: '11px', color: '#065F46' }}>
              <CheckCircle2 size={13} style={{ marginBottom: '2px' }} />
              <b>Live Billing Editor Active:</b> Any change updates the live preview instantly.
            </div>
          </div>

          {/* Right Panel: Live Document Preview Container (Fully Responsive & Scrollable on Mobile) */}
          <div 
            className={`flex-1 ${mobileActiveTab === 'preview' ? 'block' : 'hidden md:block'}`}
            style={{ 
              background: '#475569', 
              padding: '16px 8px', 
              overflowY: 'auto', 
              overflowX: 'auto',
              width: '100%'
            }}
          >
            <div 
              className="preview-touch-scroll-wrapper" 
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
                overflowX: 'auto',
                WebkitOverflowScrolling: 'touch',
                paddingBottom: '30px'
              }}
            >
              <div style={{
                background: '#FFFFFF',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
                borderRadius: '4px',
                minHeight: '500px',
                width: paperFormat === 'A4' ? '210mm' : paperFormat === 'A5' ? '148mm' : paperFormat === 'THERMAL_80MM' ? '80mm' : '58mm',
                maxWidth: paperFormat === 'THERMAL_80MM' || paperFormat === 'THERMAL_58MM' ? '100%' : undefined,
                transition: 'all 0.2s ease-in-out',
                margin: '0 auto'
              }}>
                {renderTemplateComponent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
