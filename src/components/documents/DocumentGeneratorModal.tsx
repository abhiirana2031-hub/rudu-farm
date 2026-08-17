"use client";

import React, { useState, useEffect } from 'react';
import { useFarm } from '@/context/FarmContext';
import { DOCUMENT_TEMPLATES, PaperFormat, generateDocumentNumber } from '@/services/documents/templates.registry';
import { X, Printer, Download, Share2, FileText, Settings, CheckCircle2, ChevronRight } from 'lucide-react';

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
  const { farmers, employees, collectionCenters, entries, payouts, currentUser } = useFarm();
  const templateMeta = DOCUMENT_TEMPLATES[templateId] || DOCUMENT_TEMPLATES['GENERAL_RECEIPT'];

  const [paperFormat, setPaperFormat] = useState<PaperFormat>(templateMeta.defaultFormat);
  const [docNumber, setDocNumber] = useState('');
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || 'RF1024');
  const [selectedOperatorId, setSelectedOperatorId] = useState(employees[0]?.id || 'EMP102');
  const [startDate, setStartDate] = useState('2026-08-01');
  const [endDate, setEndDate] = useState('2026-08-10');
  const [customNotes, setCustomNotes] = useState('');
  const [customAmount, setCustomAmount] = useState('5000');
  const [customTitle, setCustomTitle] = useState('');

  useEffect(() => {
    setDocNumber(generateDocumentNumber(templateMeta.prefix));
  }, [templateId]);

  const selectedFarmer = (farmers || []).find((f: any) => f.id === selectedFarmerId) || farmers[0];
  const selectedOperator = (employees || []).find((e: any) => e.id === selectedOperatorId) || employees[0];

  // Dynamic Data Binding based on template type
  const docData: any = {
    docNumber: docNumber,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    shift: 'Morning',
    receivedFrom: selectedFarmer ? `${selectedFarmer.name} (${selectedFarmer.id})` : 'Ramesh Yadav',
    farmerName: selectedFarmer?.name || 'Ramesh Yadav',
    farmerId: selectedFarmer?.id || 'RF1024',
    farmerPhone: selectedFarmer?.phone || '+91 98765 43210',
    village: selectedFarmer?.village || 'Kheda',
    empName: selectedOperator?.name || 'Amit Kumar',
    empId: selectedOperator?.id || 'EMP102',
    designation: selectedOperator?.role || 'Milk Collection Agent',
    centerName: collectionCenters[0]?.name || 'Rudu Main Center',
    amount: parseFloat(customAmount) || 5000,
    amountPaid: parseFloat(customAmount) || 5000,
    notes: customNotes || 'Processed via Rudu Farm ERP Central Document System',
    startDate: startDate,
    endDate: endDate,
    ...initialData
  };

  const handlePrint = () => {
    window.print();
  };

  const renderTemplateComponent = () => {
    switch (templateId) {
      case 'GENERAL_RECEIPT': return <GeneralReceiptTemplate format={paperFormat} docData={docData} />;
      case 'BILL_PRINT': return <BillPrintTemplate format={paperFormat} docData={docData} />;
      case 'SALARY_SLIP': return <SalarySlipTemplate format={paperFormat} docData={docData} />;
      case 'PURCHASE_BILL': return <PurchaseBillTemplate format={paperFormat} docData={docData} />;
      case 'SALE_BILL': return <SaleBillTemplate format={paperFormat} docData={docData} />;
      case 'SALE_MILK_RECEIPT': return <SaleMilkReceiptTemplate format={paperFormat} docData={docData} />;
      case 'EXPENSE_BILL': return <ExpenseBillTemplate format={paperFormat} docData={docData} />;
      case 'MISC_BILL': return <MiscBillTemplate format={paperFormat} docData={docData} />;
      case 'FARMER_10DAY_SUMMARY': return <Farmer10DaySummaryTemplate format={paperFormat} docData={docData} />;
      case 'FARMER_PAYOUT_RECEIPT': return <FarmerPayoutReceiptTemplate format={paperFormat} docData={docData} />;
      case 'FARMER_LEDGER': return <FarmerLedgerTemplate format={paperFormat} docData={docData} />;
      case 'CENTER_DAILY_SUMMARY': return <CenterDailySummaryTemplate format={paperFormat} docData={docData} />;
      case 'OPERATOR_DAILY_SUMMARY': return <OperatorDailySummaryTemplate format={paperFormat} docData={docData} />;
      case 'MONTHLY_MILK_REPORT': return <MonthlyMilkReportTemplate format={paperFormat} docData={docData} />;
      default: return <GeneralReceiptTemplate format={paperFormat} docData={docData} />;
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 2000, background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)' }}>
      <div className="modal-content non-printable" style={{
        maxWidth: '1240px',
        width: '96%',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.35)'
      }}>
        {/* Header Bar */}
        <div style={{
          background: 'linear-gradient(135deg, #4E2A18 0%, #7C3A21 100%)',
          color: '#FFFFFF',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <FileText size={22} color="#F5EBE1" />
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800' }}>
                {templateMeta.name}
              </h3>
              <span style={{ fontSize: '11.5px', color: '#F5EBE1', opacity: 0.85 }}>
                Doc #: {docNumber}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={handlePrint} className="btn" style={{ background: '#FFFFFF', color: '#4E2A18', fontWeight: '800', fontSize: '13px', borderRadius: '30px', padding: '8px 18px', border: 'none' }}>
              <Printer size={15} /> Print Document
            </button>
            <button onClick={handlePrint} className="btn" style={{ background: '#EAF4EE', color: '#065F46', fontWeight: '800', fontSize: '13px', borderRadius: '30px', padding: '8px 16px', border: 'none' }}>
              <Download size={15} /> Download PDF
            </button>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#FFFFFF', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Main Body Split View */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Left Panel: Configuration & Input Selector */}
          <div style={{
            width: '380px',
            background: '#F8FAF9',
            borderRight: '1.5px solid #CBD5E1',
            padding: '20px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ fontWeight: '800', fontSize: '13.5px', color: '#4E2A18', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Settings size={16} /> Document Configuration
            </div>

            {/* Paper Format Selector */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '6px' }}>
                Paper Format Size
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {templateMeta.supportedFormats.map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setPaperFormat(fmt)}
                    style={{
                      padding: '8px',
                      fontSize: '11.5px',
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

            {/* Farmer Selector */}
            {(templateId.includes('FARMER') || templateId === 'SALE_MILK_RECEIPT' || templateId === 'GENERAL_RECEIPT') && (
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Select Farmer / Supplier
                </label>
                <select
                  value={selectedFarmerId}
                  onChange={e => setSelectedFarmerId(e.target.value)}
                  className="form-input"
                  style={{ width: '100%', fontSize: '13px' }}
                >
                  {farmers.map((f: any) => (
                    <option key={f.id} value={f.id}>{f.name} ({f.id}) - {f.village}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Date Range Controls */}
            {(templateId.includes('SUMMARY') || templateId.includes('LEDGER') || templateId.includes('REPORT')) && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569' }}>From Date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="form-input" style={{ fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '800', color: '#475569' }}>To Date</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="form-input" style={{ fontSize: '12px' }} />
                </div>
              </div>
            )}

            {/* Custom Amount */}
            {(templateId === 'GENERAL_RECEIPT' || templateId === 'EXPENSE_BILL' || templateId === 'FARMER_PAYOUT_RECEIPT') && (
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Document Amount (₹)
                </label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={e => setCustomAmount(e.target.value)}
                  className="form-input"
                  style={{ fontSize: '14px', fontWeight: '800', color: '#4E2A18' }}
                />
              </div>
            )}

            {/* Custom Notes */}
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: '800', color: '#475569', display: 'block', marginBottom: '4px' }}>
                Custom Notes / Remarks
              </label>
              <textarea
                value={customNotes}
                onChange={e => setCustomNotes(e.target.value)}
                placeholder="Enter any additional instructions or note..."
                rows={3}
                className="form-input"
                style={{ fontSize: '12px', resize: 'vertical' }}
              />
            </div>

            <div style={{ background: '#EAF4EE', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '12px', fontSize: '11.5px', color: '#065F46', marginTop: 'auto' }}>
              <CheckCircle2 size={15} style={{ marginBottom: '4px' }} />
              <b>Auto-Data Binding Active:</b> Values are synced directly from your database records.
            </div>
          </div>

          {/* Right Panel: Live Document Preview Container */}
          <div style={{ flex: 1, background: '#64748B', padding: '30px', overflowY: 'auto', display: 'flex', justifyContent: 'center' }}>
            <div style={{
              background: '#FFFFFF',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
              borderRadius: '4px',
              minHeight: '600px',
              width: paperFormat === 'A4' ? '210mm' : paperFormat === 'A5' ? '148mm' : paperFormat === 'THERMAL_80MM' ? '80mm' : '58mm',
              transition: 'all 0.2s ease-in-out'
            }}>
              {renderTemplateComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
