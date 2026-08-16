import React from 'react';
import { LayoutGrid, List } from 'lucide-react';

export const ViewToggle = ({ viewMode, setViewMode }) => {
  return (
    <div style={{ display: 'flex', background: '#F8FAF9', borderRadius: '12px', padding: '4px', border: '1px solid var(--border)' }}>
      <button
        onClick={() => setViewMode('card')}
        style={{
          padding: '6px 12px',
          borderRadius: '8px',
          border: 'none',
          background: viewMode === 'card' ? '#FFFFFF' : 'transparent',
          color: viewMode === 'card' ? 'var(--primary)' : 'var(--text-muted)',
          boxShadow: viewMode === 'card' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: '700',
          fontSize: '13px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        title="Card View"
      >
        <LayoutGrid size={16} />
        <span className="hide-on-mobile">Cards</span>
      </button>
      <button
        onClick={() => setViewMode('table')}
        style={{
          padding: '6px 12px',
          borderRadius: '8px',
          border: 'none',
          background: viewMode === 'table' ? '#FFFFFF' : 'transparent',
          color: viewMode === 'table' ? 'var(--primary)' : 'var(--text-muted)',
          boxShadow: viewMode === 'table' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: '700',
          fontSize: '13px',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        title="Table View"
      >
        <List size={16} />
        <span className="hide-on-mobile">Table</span>
      </button>
    </div>
  );
};
