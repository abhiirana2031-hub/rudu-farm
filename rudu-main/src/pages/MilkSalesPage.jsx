import React, { useState } from 'react';
import { useFarm } from '../context/FarmContext';
import { 
  TrendingUp, 
  DollarSign, 
  Layers, 
  Clock, 
  CheckCircle2, 
  Search, 
  Plus, 
  FileText,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Users,
  ChevronDown,
  ChevronUp,
  Percent,
  Activity
} from 'lucide-react';

export const MilkSalesPage = () => {
  const { milkSales, addMilkSale, entries, currentRole, employees } = useFarm();
  const [buyerName, setBuyerName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [milkType, setMilkType] = useState('Mixed');
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [notes, setNotes] = useState('');
  const [soldBy, setSoldBy] = useState('Amit Kumar');
  const [searchQuery, setSearchQuery] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('pnl'); // Default to P&L Reconciliation

  // Expandable Daily rows state
  const [expandedDate, setExpandedDate] = useState(null);

  const isAdmin = currentRole === 'admin';

  // Group and calculate P&L by Date (Helper for P&L calculations)
  const getDailyReconciliation = () => {
    const datesSet = new Set();
    entries.forEach(e => datesSet.add(e.date));
    milkSales.forEach(s => datesSet.add(s.date));

    const sortedDates = Array.from(datesSet).sort((a, b) => new Date(b) - new Date(a));

    return sortedDates.map(date => {
      const dayEntries = entries.filter(e => e.date === date);
      const intakeLiters = dayEntries.reduce((sum, e) => sum + e.quantity, 0);
      const intakeCost = dayEntries.reduce((sum, e) => sum + e.totalAmount, 0);

      const daySales = milkSales.filter(s => s.date === date);
      const salesLiters = daySales.reduce((sum, s) => sum + s.quantity, 0);
      const salesRevenue = daySales.reduce((sum, s) => sum + s.totalAmount, 0);

      const profitLoss = salesRevenue - intakeCost;
      const variance = salesLiters - intakeLiters;

      return {
        date,
        intakeLiters,
        intakeCost,
        salesLiters,
        salesRevenue,
        profitLoss,
        variance,
        intakeCount: dayEntries.length,
        salesCount: daySales.length
      };
    });
  };

  const dailyReconciliationData = getDailyReconciliation();

  // Active Date selector state for Daily Reconciliation
  const uniqueDates = dailyReconciliationData.map(d => d.date);
  const [selectedReconcileDate, setSelectedReconcileDate] = useState(
    uniqueDates.includes('2026-07-24') ? '2026-07-24' : uniqueDates[0] || new Date().toISOString().split('T')[0]
  );

  // Handle Form Submit
  const handleLogSale = (e) => {
    e.preventDefault();
    if (!buyerName || !quantity || !rate) {
      alert("Please fill in Buyer Name, Quantity, and Rate.");
      return;
    }

    const saleData = {
      buyerName,
      quantity: parseFloat(quantity),
      rate: parseFloat(rate),
      milkType,
      paymentStatus,
      notes,
      soldBy: isAdmin ? soldBy : undefined,
      date: new Date().toISOString().split('T')[0]
    };

    addMilkSale(saleData);

    // Reset Form
    setBuyerName('');
    setQuantity('');
    setRate('');
    setMilkType('Mixed');
    setPaymentStatus('Pending');
    setNotes('');

    setSuccessMsg('Sale logged successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Metrics Calculations (Sales)
  const totalVolumeSold = milkSales.reduce((acc, sale) => acc + sale.quantity, 0);
  const totalRevenue = milkSales.reduce((acc, sale) => acc + sale.totalAmount, 0);
  const totalReceived = milkSales
    .filter(sale => sale.paymentStatus === 'Paid')
    .reduce((acc, sale) => acc + sale.totalAmount, 0);
  const totalPending = milkSales
    .filter(sale => sale.paymentStatus === 'Pending')
    .reduce((acc, sale) => acc + sale.totalAmount, 0);

  // Metrics Calculations (Intake - Farmer Purchased)
  const totalVolumeIntake = entries.reduce((acc, entry) => acc + entry.quantity, 0);
  const totalIntakeCost = entries.reduce((acc, entry) => acc + entry.totalAmount, 0);

  // Net Profit & Loss Overall
  const netProfitLoss = totalRevenue - totalIntakeCost;
  const volumeVariance = totalVolumeSold - totalVolumeIntake;

  // Filter Sales list
  const filteredSales = milkSales.filter(sale => 
    sale.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.milkType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sale.notes && sale.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const calculatedTotal = (parseFloat(quantity) || 0) * (parseFloat(rate) || 0);

  // Find reconciliation for selected dropdown date
  const activeReconciliation = dailyReconciliationData.find(d => d.date === selectedReconcileDate) || {
    date: selectedReconcileDate,
    intakeLiters: 0,
    intakeCost: 0,
    salesLiters: 0,
    salesRevenue: 0,
    profitLoss: 0,
    variance: 0
  };

  // Toggle expandable ledger row
  const toggleRow = (date) => {
    setExpandedDate(prev => prev === date ? null : date);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s ease' }}>
      {/* Header Banner */}
      <div className="section-title-bar">
        <div>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={24} style={{ color: '#4E2A18' }} />
            Profit & Loss Explanation & Reconciliation
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            Audit farmer collection purchase costs against operator commercial bulk dispatches to analyze operational margins and shrinkage losses
          </p>
        </div>
      </div>

      {/* Metrics Row - Admin vs Operator */}
      {isAdmin ? (
        // Admin Profit & Loss Metrics View - Beautified with Gradients and Colored Drop Shadows
        <div className="pnl-metrics-grid">
          {/* Farmer Intake */}
          <div style={{ 
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', 
            border: '1.5px solid #FED7AA', 
            padding: '20px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 14px rgba(251, 146, 60, 0.08)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '850', color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Farmer Intake</span>
              <div style={{ background: '#FFD8A8', color: '#C2410C', padding: '8px', borderRadius: '10px' }}>
                <Layers size={18} />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '900', margin: '10px 0 2px', color: '#7C2D12' }}>
              ₹{totalIntakeCost.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#9A3412', fontWeight: '700' }}>
              Collected Volume: <span style={{ fontWeight: '800' }}>{totalVolumeIntake.toLocaleString()} L</span>
            </div>
          </div>

          {/* Operator Sales */}
          <div style={{ 
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', 
            border: '1.5px solid #BAE6FD', 
            padding: '20px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 14px rgba(56, 189, 248, 0.08)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '850', color: '#0369A1', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Operator Sales</span>
              <div style={{ background: '#7DD3FC', color: '#0369A1', padding: '8px', borderRadius: '10px' }}>
                <ShoppingBag size={18} />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '900', margin: '10px 0 2px', color: '#0C4A6E' }}>
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#075985', fontWeight: '700' }}>
              Dispatched Volume: <span style={{ fontWeight: '800' }}>{totalVolumeSold.toLocaleString()} L</span>
            </div>
          </div>

          {/* Volume Variance */}
          <div style={{ 
            background: volumeVariance < 0 ? 'linear-gradient(135deg, #FFF5F5 0%, #FEE2E2 100%)' : 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', 
            border: volumeVariance < 0 ? '1.5px solid #FCA5A5' : '1.5px solid #BBF7D0', 
            padding: '20px', 
            borderRadius: '16px', 
            boxShadow: volumeVariance < 0 ? '0 4px 14px rgba(239, 68, 68, 0.04)' : '0 4px 14px rgba(34, 197, 94, 0.04)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '850', color: volumeVariance < 0 ? '#C53030' : '#15803D', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Volume Variance</span>
              <div style={{ 
                background: volumeVariance < 0 ? '#FEB2B2' : '#A7F3D0', 
                color: volumeVariance < 0 ? '#9B2C2C' : '#064E3B', 
                padding: '8px', 
                borderRadius: '10px' 
              }}>
                {volumeVariance < 0 ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
              </div>
            </div>
            <div style={{ 
              fontSize: '26px', 
              fontWeight: '900', 
              margin: '10px 0 2px', 
              color: volumeVariance < 0 ? '#742A2A' : volumeVariance > 0 ? '#064E3B' : '#1A5F43' 
            }}>
              {volumeVariance > 0 ? '+' : ''}{volumeVariance.toFixed(1)} L
            </div>
            <div style={{ fontSize: '12px', color: volumeVariance < 0 ? '#9B2C2C' : '#16A34A', fontWeight: '700' }}>
              {volumeVariance < 0 ? 'Spillage / Shrinkage Loss' : volumeVariance > 0 ? 'Surplus Yield Gain' : 'Perfect Net Balance'}
            </div>
          </div>

          {/* Net Margin (P&L) */}
          <div style={{ 
            background: netProfitLoss >= 0 ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)' : 'linear-gradient(135deg, #FFF5F5 0%, #FEE2E2 100%)', 
            border: netProfitLoss >= 0 ? '2px solid #34D399' : '2px solid #FCA5A5', 
            padding: '20px', 
            borderRadius: '16px', 
            boxShadow: netProfitLoss >= 0 ? '0 6px 18px rgba(16, 185, 129, 0.12)' : '0 6px 18px rgba(239, 68, 68, 0.12)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '950', color: netProfitLoss >= 0 ? '#065F46' : '#9B2C2C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Overall Profit & Loss
              </span>
              <div style={{ 
                background: netProfitLoss >= 0 ? '#A7F3D0' : '#FEB2B2', 
                color: netProfitLoss >= 0 ? '#047857' : '#9B2C2C', 
                padding: '8px', 
                borderRadius: '10px' 
              }}>
                <DollarSign size={18} />
              </div>
            </div>
            <div style={{ 
              fontSize: '26px', 
              fontWeight: '950', 
              margin: '10px 0 2px', 
              color: netProfitLoss >= 0 ? '#064E3B' : '#742A2A' 
            }}>
              {netProfitLoss >= 0 ? '+' : '-'} ₹{Math.abs(netProfitLoss).toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: netProfitLoss >= 0 ? '#059669' : '#DC2626', fontWeight: '800' }}>
              {netProfitLoss >= 0 ? 'Net Margin Profit' : 'Net Deficit Loss'}
            </div>
          </div>
        </div>
      ) : (
        // Standard Operator Metrics View
        <div className="pnl-metrics-grid">
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', padding: '18px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Sold Volume</span>
              <div style={{ background: '#F0FDF4', color: '#16A34A', padding: '8px', borderRadius: '10px' }}>
                <Layers size={18} />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', margin: '8px 0 2px', color: '#4E2A18' }}>
              {totalVolumeSold.toLocaleString()} L
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>
              Aggregated bulk milk sold
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', padding: '18px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Revenue</span>
              <div style={{ background: '#FFFBEB', color: '#D97706', padding: '8px', borderRadius: '10px' }}>
                <DollarSign size={18} />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', margin: '8px 0 2px', color: '#4E2A18' }}>
              ₹{totalRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500' }}>
              Total billed value
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', padding: '18px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount Received</span>
              <div style={{ background: '#ECFDF5', color: '#059669', padding: '8px', borderRadius: '10px' }}>
                <CheckCircle2 size={18} />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', margin: '8px 0 2px', color: '#059669' }}>
              ₹{totalReceived.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
              Cleared Payments
            </div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', padding: '18px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Outstanding Balance</span>
              <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '8px', borderRadius: '10px' }}>
                <Clock size={18} />
              </div>
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', margin: '8px 0 2px', color: '#DC2626' }}>
              ₹{totalPending.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: '700' }}>
              Pending Realization
            </div>
          </div>
        </div>
      )}

      {/* Admin Tab Selectors */}
      {isAdmin && (
        <div className="pnl-tabs-container">
          <button
            onClick={() => setActiveSubTab('pnl')}
            className="pnl-tab-button"
            style={{
              color: activeSubTab === 'pnl' ? '#4E2A18' : 'var(--text-muted)',
              borderBottom: activeSubTab === 'pnl' ? '3px solid #4E2A18' : '3px solid transparent'
            }}
          >
            <TrendingUp size={15} /> P&L Reconciliation
          </button>
          <button
            onClick={() => setActiveSubTab('sales')}
            className="pnl-tab-button"
            style={{
              color: activeSubTab === 'sales' ? '#4E2A18' : 'var(--text-muted)',
              borderBottom: activeSubTab === 'sales' ? '3px solid #4E2A18' : '3px solid transparent'
            }}
          >
            <ShoppingBag size={15} /> Sales Ledger
          </button>
        </div>
      )}

      {/* Content Rendering based on Tab */}
      {(!isAdmin || activeSubTab === 'sales') ? (
        /* ==================== SALES WORKFLOW TAB ==================== */
        <div className="sales-grid-layout">
          {/* Left Column: Sell Milk Form */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', padding: '24px', borderRadius: '20px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <div style={{ background: 'var(--bg-accent)', color: '#4E2A18', padding: '10px', borderRadius: '12px' }}>
                <ShoppingBag size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#4E2A18', margin: 0 }}>Log Bulk Milk Sale</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Log dispatch to commercial buyers</p>
              </div>
            </div>

            {successMsg && (
              <div style={{ background: '#ECFDF5', color: '#047857', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', fontWeight: '700', border: '1px solid #A7F3D0' }}>
                {successMsg}
              </div>
            )}

            <form onSubmit={handleLogSale} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Operator Attribution Dropdown - Only for Admins */}
              {isAdmin && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#4E2A18', marginBottom: '6px' }}>Attribute to Operator</label>
                  <select
                    value={soldBy}
                    onChange={(e) => setSoldBy(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '14px', background: '#FFFFFF' }}
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name} ({emp.role})</option>
                    ))}
                    <option value="Admin Staff">Admin Staff</option>
                  </select>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#4E2A18', marginBottom: '6px' }}>Buyer Name / Dairy Co</label>
                <input
                  type="text"
                  placeholder="e.g. Amul Hub, Mother Dairy, Local Buyer"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '14px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#4E2A18', marginBottom: '6px' }}>Quantity (Liters)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '14px' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#4E2A18', marginBottom: '6px' }}>Rate (₹ / Liter)</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.0"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '14px' }}
                    required
                  />
                </div>
              </div>

              {calculatedTotal > 0 && (
                <div style={{ background: '#FFFDF9', border: '1px dashed #FBE5C9', padding: '10px 12px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#4E2A18', fontWeight: '800' }}>
                  <span>Calculated Total Billed:</span>
                  <span>₹{calculatedTotal.toLocaleString()}</span>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#4E2A18', marginBottom: '6px' }}>Milk Type</label>
                  <select
                    value={milkType}
                    onChange={(e) => setMilkType(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '14px', background: '#FFFFFF' }}
                  >
                    <option value="Cow">Cow Milk</option>
                    <option value="Buffalo">Buffalo Milk</option>
                    <option value="Mixed">Mixed Milk</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#4E2A18', marginBottom: '6px' }}>Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '14px', background: '#FFFFFF' }}
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '800', color: '#4E2A18', marginBottom: '6px' }}>Dispatch Notes / vehicle details</label>
                <textarea
                  placeholder="Vehicle No, Temp, Supervisor signature, Fat/SNF etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border)', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #4E2A18 0%, #046C4E 100%)',
                  marginTop: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Plus size={16} /> Log Dispatch Sale
              </button>
            </form>
          </div>

          {/* Right Column: Sales History & Log */}
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border)', padding: '24px', borderRadius: '20px', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#4E2A18', margin: 0 }}>Sales History Ledger</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>All bulk dispatches and real-time payment states</p>
              </div>
              
              {/* Search filter */}
              <div style={{ position: 'relative', width: '220px' }}>
                <input
                  type="text"
                  placeholder="Search Buyer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: '8px', border: '1.5px solid var(--border)', fontSize: '13px' }}
                />
                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </div>
            </div>

            {/* Desktop View Table */}
            <div className="desktop-sales-table" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '550px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 8px' }}>Date</th>
                    <th style={{ padding: '12px 8px' }}>Buyer Name</th>
                    <th style={{ padding: '12px 8px' }}>Milk Type</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Qty (L)</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Rate (₹/L)</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Total (₹)</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center' }}>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '36px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                        No sales matching search criteria found.
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map((sale) => (
                      <React.Fragment key={sale.id}>
                        <tr style={{ borderBottom: '1px solid var(--border)', fontSize: '13px', color: '#4E2A18', fontWeight: '600' }}>
                          <td style={{ padding: '14px 8px' }}>
                            <div>{sale.date}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{sale.timestamp}</div>
                          </td>
                          <td style={{ padding: '14px 8px', fontWeight: '800' }}>
                            <div>{sale.buyerName}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-light)', fontWeight: '500' }}>Logged by: {sale.soldBy || 'Amit Kumar'}</div>
                          </td>
                          <td style={{ padding: '14px 8px' }}>
                            <span style={{ fontSize: '11px', background: '#F3F4F6', padding: '4px 8px', borderRadius: '6px', fontWeight: '700' }}>
                              {sale.milkType}
                            </span>
                          </td>
                          <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                            {sale.quantity.toLocaleString()} L
                          </td>
                          <td style={{ padding: '14px 8px', textAlign: 'right', color: 'var(--text-muted)' }}>
                            ₹{sale.rate.toFixed(2)}
                          </td>
                          <td style={{ padding: '14px 8px', textAlign: 'right', fontWeight: '800' }}>
                            ₹{sale.totalAmount.toLocaleString()}
                          </td>
                          <td style={{ padding: '14px 8px', textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: '800',
                              background: sale.paymentStatus === 'Paid' ? '#D1FAE5' : '#FEE2E2',
                              color: sale.paymentStatus === 'Paid' ? '#065F46' : '#991B1B'
                            }}>
                              {sale.paymentStatus}
                            </span>
                          </td>
                        </tr>
                        {sale.notes && (
                          <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <td colSpan="7" style={{ padding: '4px 8px 12px 8px', fontSize: '11px', color: '#6B7280', fontStyle: 'italic', background: '#FAFAFA' }}>
                              <span style={{ fontWeight: '700', color: '#4B5563' }}>Details:</span> {sale.notes}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile View Cards */}
            <div className="mobile-sales-cards" style={{ display: 'none' }}>
              {filteredSales.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No sales matching search criteria found.
                </div>
              ) : (
                filteredSales.map((sale) => (
                  <div key={sale.id} style={{ background: '#FFFDFB', border: '1.5px solid #EFE2D5', borderRadius: '14px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontWeight: '850', fontSize: '14px', color: '#4E2A18' }}>{sale.buyerName}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sale.date} • {sale.timestamp}</div>
                      </div>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '10px',
                        fontWeight: '800',
                        background: sale.paymentStatus === 'Paid' ? '#D1FAE5' : '#FEE2E2',
                        color: sale.paymentStatus === 'Paid' ? '#065F46' : '#991B1B'
                      }}>
                        {sale.paymentStatus}
                      </span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #F1F5F9' }}>
                      <div>
                        <span style={{ fontSize: '10px', background: '#F3F4F6', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', marginRight: '6px', color: '#4E2A18' }}>{sale.milkType}</span>
                        <span style={{ fontSize: '12.5px', fontWeight: '800', color: '#4E2A18' }}>{sale.quantity.toLocaleString()} L</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: '900', color: '#4E2A18' }}>₹{sale.totalAmount.toLocaleString()}</div>
                        <div style={{ fontSize: '10px', color: 'var(--text-light)' }}>@ ₹{sale.rate}/L</div>
                      </div>
                    </div>

                    {sale.notes && (
                      <div style={{ fontSize: '11px', color: '#6B7280', fontStyle: 'italic', background: '#F9FAFB', padding: '6px 10px', borderRadius: '6px', border: '1px dashed #E2E8F0' }}>
                        {sale.notes}
                      </div>
                    )}
                    <div style={{ fontSize: '10px', color: 'var(--text-light)', textAlign: 'right' }}>
                      Logged by: {sale.soldBy || 'Amit Kumar'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ==================== PROFIT & LOSS RECONCILIATION TAB ==================== */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Today's Reconciliation Summary */}
          <div style={{ 
            background: '#FFFFFF', 
            border: '1.5px solid var(--border)', 
            borderRadius: '20px', 
            padding: '24px', 
            boxShadow: 'var(--shadow-md)' 
          }}>
            <div style={{ borderBottom: '1.5px solid var(--border)', paddingBottom: '12px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '850', color: '#4E2A18', margin: 0 }}>
                    Daily Reconciliation Statements
                  </h3>
                  <span style={{ fontSize: '11px', background: '#F5EBE1', border: '1px solid #EFE2D5', padding: '2px 8px', borderRadius: '6px', color: '#4E2A18', fontWeight: '800' }}>Active Date</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
                  Select a business day to audit collections vs dispatches
                </p>
              </div>

              {/* Date Select Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '805', color: '#4E2A18' }}>Reconcile Date:</span>
                <select
                  value={selectedReconcileDate}
                  onChange={(e) => setSelectedReconcileDate(e.target.value)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--border)',
                    background: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: '800',
                    color: '#4E2A18',
                    cursor: 'pointer'
                  }}
                >
                  {uniqueDates.map(d => (
                    <option key={d} value={d}>{d} {d === '2026-07-24' ? '(Mock Today)' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid breakdown of the day */}
            <div className="pnl-breakdown-grid">
              
              {/* Intake Column */}
              <div style={{ background: 'linear-gradient(135deg, #FFFDF6 0%, #FAF0E4 100%)', border: '1.5px solid #F0D5BD', padding: '18px', borderRadius: '14px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '850', color: '#7C2D12', textTransform: 'uppercase', marginBottom: '14px', borderBottom: '1px dashed #E5C3A6', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} /> 📥 Farmer Intake (Purchases)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#9A3412', fontWeight: '500' }}>Total Milk Quantity:</span>
                    <span style={{ fontWeight: '800', color: '#7C2D12' }}>{activeReconciliation.intakeLiters.toLocaleString()} L</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#9A3412', fontWeight: '500' }}>Total Acquisition Cost:</span>
                    <span style={{ fontWeight: '800', color: '#7C2D12' }}>₹{activeReconciliation.intakeCost.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#9A3412', fontWeight: '500' }}>Average Purchase Rate:</span>
                    <span style={{ fontWeight: '800', color: '#7C2D12' }}>
                      ₹{activeReconciliation.intakeLiters > 0 ? (activeReconciliation.intakeCost / activeReconciliation.intakeLiters).toFixed(2) : '0.00'} / L
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#9A3412', fontWeight: '500' }}>Logged Collections:</span>
                    <span style={{ fontWeight: '800', color: '#7C2D12' }}>{activeReconciliation.intakeCount} entries</span>
                  </div>
                </div>
              </div>

              {/* Sales Column */}
              <div style={{ background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)', border: '1.5px solid #BFE2F6', padding: '18px', borderRadius: '14px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '850', color: '#0369A1', textTransform: 'uppercase', marginBottom: '14px', borderBottom: '1px dashed #93C5FD', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShoppingBag size={14} /> 📤 Operator Sales (Sold)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#075985', fontWeight: '500' }}>Total Milk Sold:</span>
                    <span style={{ fontWeight: '800', color: '#0369A1' }}>{activeReconciliation.salesLiters.toLocaleString()} L</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#075985', fontWeight: '500' }}>Total Gross Revenue:</span>
                    <span style={{ fontWeight: '800', color: '#0369A1' }}>₹{activeReconciliation.salesRevenue.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#075985', fontWeight: '500' }}>Average Sales Rate:</span>
                    <span style={{ fontWeight: '800', color: '#0369A1' }}>
                      ₹{activeReconciliation.salesLiters > 0 ? (activeReconciliation.salesRevenue / activeReconciliation.salesLiters).toFixed(2) : '0.00'} / L
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#075985', fontWeight: '500' }}>Bulk Dispatches:</span>
                    <span style={{ fontWeight: '800', color: '#0369A1' }}>{activeReconciliation.salesCount} dispatches</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Reconciliation Audit Info - Upgraded with strong color panels */}
            {activeReconciliation.variance < 0 ? (
              // Warning Card Layout
              <div style={{ 
                marginTop: '20px', 
                background: 'linear-gradient(135deg, #FFF5F5 0%, #FFEBEB 100%)', 
                borderLeft: '5px solid #EF4444', 
                borderTop: '1px solid #FEE2E2',
                borderRight: '1px solid #FEE2E2',
                borderBottom: '1px solid #FEE2E2',
                padding: '16px 20px', 
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertTriangle size={18} style={{ color: '#EF4444' }} />
                  <span style={{ fontSize: '13.5px', color: '#9B2C2C', fontWeight: '800' }}>
                    Shrinkage warning: Spillage/loss of {Math.abs(activeReconciliation.variance).toFixed(1)} Liters detected (Intake &gt; Sales).
                  </span>
                </div>
                <div style={{ fontSize: '14.5px', fontWeight: '900', color: activeReconciliation.profitLoss >= 0 ? '#15803D' : '#991B1B' }}>
                  Net Margin: ₹{activeReconciliation.profitLoss.toLocaleString()}
                </div>
              </div>
            ) : (
              // Profit / Balanced Card Layout
              <div style={{ 
                marginTop: '20px', 
                background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)', 
                borderLeft: '5px solid #10B981', 
                borderTop: '1px solid #D1FAE5',
                borderRight: '1px solid #D1FAE5',
                borderBottom: '1px solid #D1FAE5',
                padding: '16px 20px', 
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} style={{ color: '#10B981' }} />
                  <span style={{ fontSize: '13.5px', color: '#064E3B', fontWeight: '800' }}>
                    {activeReconciliation.variance > 0 
                      ? `Milk balance verified: Surplus yield gain of ${activeReconciliation.variance.toFixed(1)} Liters.` 
                      : "Milk balance verified: Collected volume perfectly matches sales dispatches."
                    }
                  </span>
                </div>
                <div style={{ fontSize: '14.5px', fontWeight: '900', color: activeReconciliation.profitLoss >= 0 ? '#15803D' : '#991B1B' }}>
                  Net Margin: ₹{activeReconciliation.profitLoss.toLocaleString()}
                </div>
              </div>
            )}

            {/* Dynamic Operator Daily Breakdown for the Selected Reconcile Date */}
            <div style={{ marginTop: '24px', borderTop: '1.5px solid var(--border)', paddingTop: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Users size={16} style={{ color: '#4E2A18' }} />
                <span style={{ fontSize: '14px', fontWeight: '850', color: '#4E2A18' }}>Daily Operator-Wise Breakdown</span>
              </div>
              
              {(() => {
                const activeOps = new Set();
                entries.filter(e => e.date === selectedReconcileDate).forEach(e => activeOps.add(e.collectedBy));
                milkSales.filter(s => s.date === selectedReconcileDate).forEach(s => activeOps.add(s.soldBy));

                const opsArray = Array.from(activeOps).filter(Boolean);

                if (opsArray.length === 0) {
                  return <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic', background: 'var(--bg-subtle)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>No operator transactions logged on this day.</div>;
                }

                return (
                  <div className="operator-breakdown-cards-grid">
                    {opsArray.map(opName => {
                      const opIntakeLiters = entries.filter(e => e.date === selectedReconcileDate && e.collectedBy === opName).reduce((sum, e) => sum + e.quantity, 0);
                      const opIntakeCost = entries.filter(e => e.date === selectedReconcileDate && e.collectedBy === opName).reduce((sum, e) => sum + e.totalAmount, 0);
                      const opSalesLiters = milkSales.filter(s => s.date === selectedReconcileDate && s.soldBy === opName).reduce((sum, s) => sum + s.quantity, 0);
                      const opSalesRev = milkSales.filter(s => s.date === selectedReconcileDate && s.soldBy === opName).reduce((sum, s) => sum + s.totalAmount, 0);
                      const opVariance = opSalesLiters - opIntakeLiters;
                      const opNet = opSalesRev - opIntakeCost;

                      return (
                        <div key={opName} style={{ 
                          background: '#FFFFFF', 
                          border: '1px solid #E2E8F0', 
                          borderRadius: '16px', 
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                          overflow: 'hidden',
                          transition: 'transform 0.2s ease'
                        }}>
                          {/* Operator Card Header */}
                          <div style={{ 
                            background: 'linear-gradient(135deg, #4E2A18 0%, #2E160A 100%)', 
                            padding: '12px 16px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px' 
                          }}>
                            <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '5px', borderRadius: '50%', color: '#FFFFFF' }}>
                              <Users size={14} />
                            </div>
                            <span style={{ fontSize: '13px', fontWeight: '900', color: '#FFFFFF' }}>{opName}</span>
                          </div>
                          
                          {/* Operator Card Body */}
                          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>📥 Farmers Intake:</span>
                              <span style={{ fontWeight: '800', color: '#4E2A18' }}>
                                {opIntakeLiters > 0 ? `${opIntakeLiters.toLocaleString()} L` : '-'} 
                                <span style={{ fontWeight: '650', color: 'var(--text-light)', marginLeft: '4px' }}>{opIntakeCost > 0 ? `(₹${opIntakeCost.toLocaleString()})` : ''}</span>
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: '#0369A1', display: 'flex', alignItems: 'center', gap: '4px' }}>📤 Bulk Milk Sales:</span>
                              <span style={{ fontWeight: '800', color: '#0369A1' }}>
                                {opSalesLiters > 0 ? `${opSalesLiters.toLocaleString()} L` : '-'} 
                                <span style={{ fontWeight: '650', color: '#38BDF8', marginLeft: '4px' }}>{opSalesRev > 0 ? `(₹${opSalesRev.toLocaleString()})` : ''}</span>
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #E2E8F0', paddingTop: '8px', marginTop: '4px' }}>
                              <span style={{ color: 'var(--text-muted)' }}>Vol. Variance:</span>
                              <span style={{ 
                                fontWeight: '800', 
                                padding: '2px 8px', 
                                borderRadius: '6px', 
                                fontSize: '11px', 
                                background: opVariance < 0 ? '#FEF2F2' : opVariance > 0 ? '#F0FDF4' : '#F1F5F9',
                                color: opVariance < 0 ? '#DC2626' : opVariance > 0 ? '#16A34A' : 'var(--text-muted)'
                              }}>
                                {opVariance > 0 ? '+' : ''}{opVariance.toFixed(1)} L
                              </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: 'var(--text-muted)', fontWeight: '800' }}>Contrib. Margin:</span>
                              <span style={{ 
                                fontWeight: '900', 
                                fontSize: '14px',
                                color: opNet >= 0 ? '#10B981' : '#EF4444' 
                              }}>
                                {opNet >= 0 ? '+' : '-'} ₹{Math.abs(opNet).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Reconciliation History Table */}
          <div style={{ 
            background: '#FFFFFF', 
            border: '1.5px solid var(--border)', 
            borderRadius: '20px', 
            padding: '24px', 
            boxShadow: 'var(--shadow-md)' 
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#4E2A18', marginBottom: '4px' }}>
              Historical Daily Reconciliation Ledger
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '18px' }}>
              Click any daily summary row below to expand and view the operator-wise collection & sales breakdown details
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px 8px' }}>Date</th>
                    <th style={{ padding: '12px 8px' }}>Farmers Intake (Purchased)</th>
                    <th style={{ padding: '12px 8px' }}>Operators Sales (Sold)</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Vol. Variance</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Daily Net Profit/Loss</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center' }}>Outcome</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dailyReconciliationData.map((day) => {
                    const isProfit = day.profitLoss >= 0;
                    const isExpanded = expandedDate === day.date;
                    return (
                      <React.Fragment key={day.date}>
                        {/* Summary Row */}
                        <tr 
                          onClick={() => toggleRow(day.date)}
                          style={{ 
                            borderBottom: '1px solid var(--border)', 
                            fontSize: '13px', 
                            color: '#4E2A18', 
                            fontWeight: '600', 
                            cursor: 'pointer',
                            background: isExpanded ? '#FAF8F5' : 'transparent',
                            transition: 'background 0.2s'
                          }}
                          className="hover-row"
                        >
                          <td style={{ padding: '14px 8px', fontWeight: '800' }}>
                            {day.date} {day.date === '2026-07-24' ? <span style={{ fontSize: '10px', background: '#F5EBE1', color: '#4E2A18', padding: '2px 6px', borderRadius: '4px', marginLeft: '4px' }}>Today</span> : ''}
                          </td>
                          <td style={{ padding: '14px 8px' }}>
                            <div style={{ fontWeight: '800' }}>{day.intakeLiters.toLocaleString()} L</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Cost: ₹{day.intakeCost.toLocaleString()}</div>
                          </td>
                          <td style={{ padding: '14px 8px' }}>
                            <div style={{ fontWeight: '800' }}>{day.salesLiters.toLocaleString()} L</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Gross Revenue: ₹{day.salesRevenue.toLocaleString()}</div>
                          </td>
                          <td style={{ padding: '14px 8px', textAlign: 'right', color: day.variance < 0 ? '#DC2626' : day.variance > 0 ? '#16A34A' : '#4E2A18' }}>
                            {day.variance > 0 ? '+' : ''}{day.variance.toFixed(1)} L
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                              {day.variance < 0 ? 'Shrinkage' : day.variance > 0 ? 'Surplus' : 'Balanced'}
                            </div>
                          </td>
                          <td style={{ padding: '14px 8px', textAlign: 'right', fontWeight: '900', color: isProfit ? '#15803D' : '#B91C1C', fontSize: '14px' }}>
                            {isProfit ? '+' : '-'} ₹{Math.abs(day.profitLoss).toLocaleString()}
                          </td>
                          <td style={{ padding: '14px 8px', textAlign: 'center' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 10px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: '800',
                              background: isProfit ? '#D1FAE5' : '#FEE2E2',
                              color: isProfit ? '#065F46' : '#991B1B'
                            }}>
                              {isProfit ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                              {isProfit ? 'Profit' : 'Loss'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 8px', textAlign: 'center' }}>
                            <button style={{ background: 'none', border: 'none', color: '#4E2A18', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', fontSize: '11px', fontWeight: '800', margin: '0 auto' }}>
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              <span>{isExpanded ? 'Hide' : 'Breakdown'}</span>
                            </button>
                          </td>
                        </tr>

                        {/* Collapsible Details Row */}
                        {isExpanded && (
                          <tr style={{ background: '#FFFDFB' }}>
                            <td colSpan="7" style={{ padding: '0 0 16px 0', borderBottom: '1px solid var(--border)' }}>
                              <div style={{ 
                                padding: '16px 20px', 
                                background: '#FFFFFF', 
                                borderRadius: '16px', 
                                border: '1.5px solid #EFE2D5', 
                                margin: '8px 12px 12px 12px', 
                                boxShadow: '0 4px 14px rgba(78, 42, 24, 0.05)' 
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                                  <Users size={16} style={{ color: '#4E2A18' }} />
                                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#4E2A18' }}>
                                    Daily Operator-Wise Collection vs Dispatch Performance Detail ({day.date})
                                  </span>
                                </div>

                                {(() => {
                                  const activeOps = new Set();
                                  entries.filter(e => e.date === day.date).forEach(e => activeOps.add(e.collectedBy));
                                  milkSales.filter(s => s.date === day.date).forEach(s => activeOps.add(s.soldBy));

                                  const opsArray = Array.from(activeOps).filter(Boolean);

                                  if (opsArray.length === 0) {
                                    return <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>No operator logs on this day.</div>;
                                  }

                                  return (
                                    <div style={{ overflowX: 'auto' }}>
                                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                                        <thead>
                                          <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', fontWeight: '800', textTransform: 'uppercase', fontSize: '10px' }}>
                                            <th style={{ padding: '8px' }}>Operator</th>
                                            <th style={{ padding: '8px', textAlign: 'right' }}>Farmers Intake (L)</th>
                                            <th style={{ padding: '8px', textAlign: 'right' }}>Farmers Intake (₹)</th>
                                            <th style={{ padding: '8px', textAlign: 'right' }}>Bulk Dispatches (L)</th>
                                            <th style={{ padding: '8px', textAlign: 'right' }}>Dispatches Revenue (₹)</th>
                                            <th style={{ padding: '8px', textAlign: 'right' }}>Vol. Variance</th>
                                            <th style={{ padding: '8px', textAlign: 'right' }}>Contrib. Margin (₹)</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {opsArray.map(opName => {
                                            const opIntakeL = entries.filter(e => e.date === day.date && e.collectedBy === opName).reduce((sum, e) => sum + e.quantity, 0);
                                            const opIntakeCost = entries.filter(e => e.date === day.date && opName === e.collectedBy).reduce((sum, e) => sum + e.totalAmount, 0);
                                            const opSalesL = milkSales.filter(s => s.date === day.date && opName === s.soldBy).reduce((sum, s) => sum + s.quantity, 0);
                                            const opSalesRevenue = milkSales.filter(s => s.date === day.date && opName === s.soldBy).reduce((sum, s) => sum + s.totalAmount, 0);
                                            const opVariance = opSalesL - opIntakeL;
                                            const opNet = opSalesRevenue - opIntakeCost;

                                            return (
                                              <tr key={opName} style={{ borderBottom: '1px dashed #F1F5F9', color: '#4E2A18', fontWeight: '600' }}>
                                                <td style={{ padding: '10px 8px', fontWeight: '800' }}>👤 {opName}</td>
                                                <td style={{ padding: '10px 8px', textAlign: 'right' }}>{opIntakeL > 0 ? `${opIntakeL.toLocaleString()} L` : '-'}</td>
                                                <td style={{ padding: '10px 8px', textAlign: 'right', color: 'var(--text-muted)' }}>{opIntakeCost > 0 ? `₹${opIntakeCost.toLocaleString()}` : '-'}</td>
                                                <td style={{ padding: '10px 8px', textAlign: 'right', color: '#0369A1' }}>{opSalesL > 0 ? `${opSalesL.toLocaleString()} L` : '-'}</td>
                                                <td style={{ padding: '10px 8px', textAlign: 'right', color: '#0369A1' }}>{opSalesRevenue > 0 ? `₹${opSalesRevenue.toLocaleString()}` : '-'}</td>
                                                <td style={{ padding: '10px 8px', textAlign: 'right', color: opVariance < 0 ? '#DC2626' : opVariance > 0 ? '#16A34A' : '#4E2A18' }}>
                                                  {opVariance !== 0 ? `${opVariance > 0 ? '+' : ''}${opVariance.toFixed(1)} L` : 'Balanced'}
                                                </td>
                                                <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: '800', color: opNet >= 0 ? '#15803D' : '#B91C1C' }}>
                                                  {opNet >= 0 ? '+' : '-'} ₹{Math.abs(opNet).toLocaleString()}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  );
                                })()}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
