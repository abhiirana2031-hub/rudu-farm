"use client";

import React, { useState } from 'react';
import { DOCUMENT_TEMPLATES, DocumentTemplateMeta, PaperFormat } from '@/services/documents/templates.registry';
import { DocumentGeneratorModal } from '@/components/documents/DocumentGeneratorModal';
import {
  Printer, FileText, Receipt, CreditCard, ShoppingBag, Droplets,
  DollarSign, FileSpreadsheet, Calendar, CheckCircle2, BookOpen,
  Building2, UserCheck, PieChart, Search, Filter, History, Download, Eye, Plus
} from 'lucide-react';

export default function PrintAndDocumentsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'history'>('templates');

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'Receipt': return <Receipt size={22} color="#4E2A18" />;
      case 'FileText': return <FileText size={22} color="#2563EB" />;
      case 'CreditCard': return <CreditCard size={22} color="#16A34A" />;
      case 'ShoppingBag': return <ShoppingBag size={22} color="#D97706" />;
      case 'Droplets': return <Droplets size={22} color="#0284C7" />;
      case 'DollarSign': return <DollarSign size={22} color="#DC2626" />;
      case 'FileSpreadsheet': return <FileSpreadsheet size={22} color="#9333EA" />;
      case 'Calendar': return <Calendar size={22} color="#4E2A18" />;
      case 'CheckCircle2': return <CheckCircle2 size={22} color="#16A34A" />;
      case 'BookOpen': return <BookOpen size={22} color="#D97706" />;
      case 'Building2': return <Building2 size={22} color="#2563EB" />;
      case 'UserCheck': return <UserCheck size={22} color="#0284C7" />;
      case 'PieChart': return <PieChart size={22} color="#9333EA" />;
      default: return <FileText size={22} color="#4E2A18" />;
    }
  };

  const templatesList = Object.values(DOCUMENT_TEMPLATES);

  const filteredTemplates = templatesList.filter(tpl => {
    const matchesCat = activeCategory === 'all' || tpl.category === activeCategory;
    const matchesSearch = tpl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tpl.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Mock Generated Document History Log
  const documentHistory = [
    { docNumber: 'MILK-20260817-4829', type: 'Sale Milk Receipt', recipient: 'Ramesh Yadav (RF1024)', date: '2026-08-17 06:45 AM', format: '80mm Thermal', amount: 618.75 },
    { docNumber: 'PAY-20260817-004812', type: 'Farmer Payout Receipt', recipient: 'Ramesh Yadav (RF1024)', date: '2026-08-16 04:30 PM', format: 'A4', amount: 6500.00 },
    { docNumber: 'SUM10-20260817-001024', type: '10-Day Farmer Summary', recipient: 'Ramesh Yadav (RF1024)', date: '2026-08-16 02:15 PM', format: 'A4', amount: 8940.00 },
    { docNumber: 'SLIP-202608-00102', type: 'Salary Slip', recipient: 'Amit Kumar (EMP102)', date: '2026-08-01 10:00 AM', format: 'A4', amount: 17000.00 },
    { docNumber: 'PUR-20260817-009182', type: 'Purchase Bill', recipient: 'Kheda Feed Supplies', date: '2026-08-12 11:20 AM', format: 'A4', amount: 76750.00 },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4E2A18 0%, #7C3A21 100%)',
        borderRadius: '24px',
        padding: '32px',
        color: '#FFFFFF',
        marginBottom: '24px',
        boxShadow: '0 12px 30px rgba(78,42,24,0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', marginBottom: '10px' }}>
              <Printer size={14} /> Master Printing & ERP Document Module
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '900', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
              Print & Documents System
            </h1>
            <p style={{ fontSize: '13.5px', color: '#F5EBE1', opacity: 0.9, margin: 0, maxWidth: '600px' }}>
              Generate, preview, print, and export official commercial bills, receipts, farmer 10-day statements, and daily audit reports.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('templates')}
              style={{
                padding: '10px 20px',
                borderRadius: '30px',
                border: 'none',
                background: activeTab === 'templates' ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
                color: activeTab === 'templates' ? '#4E2A18' : '#FFFFFF',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              📄 Templates ({templatesList.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              style={{
                padding: '10px 20px',
                borderRadius: '30px',
                border: 'none',
                background: activeTab === 'history' ? '#FFFFFF' : 'rgba(255,255,255,0.15)',
                color: activeTab === 'history' ? '#4E2A18' : '#FFFFFF',
                fontWeight: '800',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <History size={15} /> Audit History
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'templates' ? (
        <>
          {/* Controls & Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
              {[
                { id: 'all', label: 'All Templates' },
                { id: 'receipts', label: 'Receipts' },
                { id: 'invoices', label: 'Invoices & Bills' },
                { id: 'statements', label: 'Farmer Statements' },
                { id: 'reports', label: 'Operations Reports' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '12.5px',
                    fontWeight: '800',
                    whiteSpace: 'nowrap',
                    border: activeCategory === cat.id ? '2px solid #4E2A18' : '1px solid #CBD5E1',
                    background: activeCategory === cat.id ? '#4E2A18' : '#FFFFFF',
                    color: activeCategory === cat.id ? '#FFFFFF' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px', fontSize: '13px', borderRadius: '30px', width: '100%' }}
              />
            </div>
          </div>

          {/* 14 Document Templates Responsive Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {filteredTemplates.map(tpl => (
              <div
                key={tpl.id}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      background: '#F8FAF9',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {getTemplateIcon(tpl.iconName)}
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {tpl.supportedFormats.map(fmt => (
                        <span key={fmt} style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          background: fmt.includes('THERMAL') ? '#FEF3C7' : '#EAF4EE',
                          color: fmt.includes('THERMAL') ? '#92400E' : '#065F46',
                          padding: '2px 7px',
                          borderRadius: '12px'
                        }}>
                          {fmt.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', fontWeight: '800', color: '#4E2A18' }}>
                    {tpl.name}
                  </h3>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#64748B', lineHeight: '1.45' }}>
                    {tpl.description}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                  <button
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    style={{
                      flex: 1,
                      background: '#4E2A18',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '30px',
                      padding: '10px 14px',
                      fontWeight: '800',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Eye size={15} /> Preview & Generate
                  </button>
                  <button
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    style={{
                      background: '#EAF4EE',
                      color: '#065F46',
                      border: '1px solid #BBF7D0',
                      borderRadius: '30px',
                      padding: '10px 14px',
                      fontWeight: '800',
                      fontSize: '12.5px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                    title="Quick Print"
                  >
                    <Printer size={15} /> Print
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Generated Documents History Table */
        <div style={{ background: '#FFFFFF', border: '1.5px solid #E2E8F0', borderRadius: '20px', padding: '20px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#4E2A18' }}>
              Generated Documents Audit History
            </h3>
            <span style={{ fontSize: '12px', color: '#64748B' }}>Showing recent official document logs</span>
          </div>

          <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '680px' }}>
              <thead>
                <tr style={{ background: '#F8FAF9', borderBottom: '2px solid #E2E8F0', textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '12px 14px' }}>Doc Number</th>
                  <th style={{ padding: '12px 14px' }}>Document Type</th>
                  <th style={{ padding: '12px 14px' }}>Recipient / Entity</th>
                  <th style={{ padding: '12px 14px' }}>Date Created</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Amount (₹)</th>
                  <th style={{ padding: '12px 14px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documentHistory.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '12px 14px', fontWeight: '900', color: '#4E2A18' }}>{item.docNumber}</td>
                    <td style={{ padding: '12px 14px', fontWeight: '700' }}>{item.type}</td>
                    <td style={{ padding: '12px 14px', color: '#334155' }}>{item.recipient}</td>
                    <td style={{ padding: '12px 14px', color: '#64748B' }}>{item.date}</td>
                    <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '900', color: '#16A34A' }}>
                      ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                        <button
                          onClick={() => setSelectedTemplateId(item.type.includes('Milk') ? 'SALE_MILK_RECEIPT' : 'GENERAL_RECEIPT')}
                          style={{ background: '#EAF4EE', color: '#4E2A18', border: '1px solid #DCC5B3', padding: '6px 12px', borderRadius: '12px', fontSize: '11.5px', fontWeight: '800', cursor: 'pointer' }}
                        >
                          <Printer size={13} /> Reprint
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Generator Modal */}
      {selectedTemplateId && (
        <DocumentGeneratorModal
          templateId={selectedTemplateId}
          onClose={() => setSelectedTemplateId(null)}
        />
      )}
    </div>
  );
}
