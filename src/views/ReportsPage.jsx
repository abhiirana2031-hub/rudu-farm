import React from 'react';
import { useFarm } from '../context/FarmContext';
import { Download, BarChart3, TrendingUp, Award, Layers } from 'lucide-react';

export const ReportsPage = () => {
  const { entries, farmers } = useFarm();

  const handleExportCSV = () => {
    const headers = ['Entry ID', 'Date', 'Shift', 'Farmer Name', 'Farmer ID', 'Quantity (L)', 'Fat %', 'SNF %', 'Rate (INR)', 'Total (INR)'];
    const rows = entries.map(e => [
      e.id,
      e.date,
      e.shift,
      `"${e.farmerName}"`,
      e.farmerId,
      e.quantity,
      e.fat,
      e.snf,
      e.rate,
      e.totalAmount
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rudu_farm_milk_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Compute quality averages
  const avgFat = (entries.reduce((acc, e) => acc + e.fat, 0) / (entries.length || 1)).toFixed(2);
  const avgSNF = (entries.reduce((acc, e) => acc + e.snf, 0) / (entries.length || 1)).toFixed(2);
  const totalVolume = entries.reduce((acc, e) => acc + e.quantity, 0);

  return (
    <div>
      <div className="section-title-bar">
        <div>
          <h2 className="section-title">Dairy Operations Analytics & Reports</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Quality trends, milk yield distributions, and financial audit reports</p>
        </div>
        <button onClick={handleExportCSV} className="btn btn-primary">
          <Download size={16} /> Export CSV Report
        </button>
      </div>

      {/* Quality Averages */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Average Fat Quality</span>
            <div className="stat-icon emerald"><Award size={20} /></div>
          </div>
          <div className="stat-value">{avgFat}%</div>
          <div className="stat-badge positive">Standard Target: 4.0%</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Average SNF Quality</span>
            <div className="stat-icon mint"><Layers size={20} /></div>
          </div>
          <div className="stat-value">{avgSNF}%</div>
          <div className="stat-badge positive">Standard Target: 8.5%</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Total Recorded Volume</span>
            <div className="stat-icon blue"><BarChart3 size={20} /></div>
          </div>
          <div className="stat-value">{totalVolume.toLocaleString()} L</div>
          <div className="stat-badge neutral">Across all centers</div>
        </div>
      </div>

      {/* Visual Chart Bars */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid var(--border)', padding: '24px', marginBottom: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '20px' }}>Village-wise Milk Volume Breakdown</h3>

        {['Kheda', 'Rampur', 'Sundarpur'].map(village => {
          const villageFarmers = farmers.filter(f => f.village === village).map(f => f.id);
          const villageVol = entries
            .filter(e => villageFarmers.includes(e.farmerId))
            .reduce((acc, e) => acc + e.quantity, 0);
          const percentage = totalVolume > 0 ? Math.round((villageVol / totalVolume) * 100) : 33;

          return (
            <div key={village} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', marginBottom: '6px' }}>
                <span>Village: {village}</span>
                <span>{villageVol} Liters ({percentage}%)</span>
              </div>
              <div style={{ background: '#E2E8F0', height: '14px', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${percentage}%`, background: '#4E2A18', height: '100%', borderRadius: '10px' }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
