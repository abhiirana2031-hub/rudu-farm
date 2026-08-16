"use client";
import React, { useState, useEffect } from 'react';
import {
  MessageSquare, RefreshCw, Send, CheckCircle2, AlertCircle,
  Clock, ShieldAlert, Filter, Search, FileText, Smartphone
} from 'lucide-react';
import { MASTER_SMS_TEMPLATES } from '@/services/notification/sms.templates';

export default function AdminNotificationsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'logs' | 'templates'>('logs');
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notifications/logs?tenantId=default');
      const data = await res.json();
      if (data.success && data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleRetry = async (logId: string) => {
    setRetryingId(logId);
    setActionStatus('Retrying SMS...');
    try {
      const res = await fetch('/api/admin/notifications/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: logId, tenantId: 'default' })
      });
      const data = await res.json();
      if (data.success) {
        setActionStatus('✅ SMS retried successfully!');
        fetchLogs();
      } else {
        setActionStatus(`❌ Retry failed: ${data.error}`);
      }
    } catch (err: any) {
      setActionStatus(`❌ Error: ${err.message}`);
    } finally {
      setRetryingId(null);
      setTimeout(() => setActionStatus(''), 4000);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesStatus = filterStatus === 'ALL' || log.status === filterStatus;
    const matchesSearch =
      (log.recipient && log.recipient.includes(searchTerm)) ||
      (log.type && log.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.referenceId && log.referenceId.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const templatesList = Object.values(MASTER_SMS_TEMPLATES);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={22} /> SMS Notifications & Registry
          </h1>
          <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            Centralized Fast2SMS Notification logs, DLT templates, and retry dashboard
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'var(--surface)', border: '1.5px solid var(--border)',
            padding: '8px 16px', borderRadius: '20px', fontWeight: '700',
            fontSize: '12.5px', cursor: 'pointer'
          }}
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Logs
        </button>
      </div>

      {actionStatus && (
        <div style={{
          padding: '10px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: '700',
          marginBottom: '16px',
          background: actionStatus.startsWith('✅') ? '#D1FAE5' : '#FEE2E2',
          color: actionStatus.startsWith('✅') ? '#065F46' : '#991B1B'
        }}>
          {actionStatus}
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '16px', borderBottom: '1.5px solid var(--border)', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('logs')}
          style={{
            background: 'none', border: 'none', padding: '10px 4px', fontSize: '14px', fontWeight: '800',
            color: activeTab === 'logs' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'logs' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
            cursor: 'pointer'
          }}
        >
          SMS Delivery Logs ({logs.length})
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          style={{
            background: 'none', border: 'none', padding: '10px 4px', fontSize: '14px', fontWeight: '800',
            color: activeTab === 'templates' ? 'var(--primary)' : 'var(--text-muted)',
            borderBottom: activeTab === 'templates' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
            cursor: 'pointer'
          }}
        >
          Master Template Registry ({templatesList.length})
        </button>
      </div>

      {activeTab === 'logs' ? (
        <>
          {/* Controls Bar */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '34px', height: '38px', fontSize: '13px' }}
                placeholder="Search phone, type, reference ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="form-input"
              style={{ width: '150px', height: '38px', fontSize: '12.5px', fontWeight: '700' }}
            >
              <option value="ALL">All Statuses</option>
              <option value="SENT">SENT</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="FAILED">FAILED</option>
              <option value="QUEUED">QUEUED</option>
            </select>
          </div>

          {/* Logs Table */}
          {filteredLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px 20px', background: 'var(--surface)', borderRadius: '16px', border: '1.5px solid var(--border)' }}>
              <MessageSquare size={36} style={{ opacity: 0.3, marginBottom: '10px' }} />
              <p style={{ fontWeight: '700', color: 'var(--text-muted)' }}>No matching SMS logs found.</p>
            </div>
          ) : (
            <div style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAF9', borderBottom: '1.5px solid var(--border)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 16px' }}>Recipient</th>
                    <th style={{ padding: '12px 16px' }}>Event Type</th>
                    <th style={{ padding: '12px 16px' }}>Reference</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Date/Time</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map(log => (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '800' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Smartphone size={14} color="var(--primary)" />
                          <span>{log.recipient}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontWeight: '700', background: '#F1F5F9', padding: '3px 8px', borderRadius: '6px', fontSize: '11px' }}>
                          {log.type}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontSize: '11.5px' }}>
                        {log.referenceId || '—'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          padding: '3px 8px', borderRadius: '20px', fontWeight: '800', fontSize: '10.5px',
                          background: log.status === 'SENT' || log.status === 'DELIVERED' ? '#D1FAE5' : log.status === 'FAILED' ? '#FEE2E2' : '#FEF3C7',
                          color: log.status === 'SENT' || log.status === 'DELIVERED' ? '#065F46' : log.status === 'FAILED' ? '#991B1B' : '#92400E'
                        }}>
                          {log.status}
                        </span>
                        {log.failureReason && (
                          <div style={{ fontSize: '10px', color: '#DC2626', marginTop: '2px' }}>{log.failureReason}</div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11.5px' }}>
                        {log.createdAt ? new Date(log.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        {log.status === 'FAILED' && (
                          <button
                            onClick={() => handleRetry(log.id)}
                            disabled={retryingId === log.id}
                            style={{
                              background: '#2563EB', color: 'white', border: 'none',
                              borderRadius: '6px', padding: '4px 10px', fontSize: '11px',
                              fontWeight: '700', cursor: 'pointer'
                            }}
                          >
                            {retryingId === log.id ? 'Retrying...' : 'Retry'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        /* Master Template Registry Tab */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '14px' }}>
          {templatesList.map(tpl => (
            <div key={tpl.key} style={{ background: 'var(--surface)', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', background: '#EAF4EE', color: '#065F46', padding: '2px 8px', borderRadius: '12px' }}>
                  {tpl.key}
                </span>
                <span style={{
                  fontSize: '9.5px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px',
                  background: tpl.priority === 'CRITICAL' ? '#FEE2E2' : tpl.priority === 'HIGH' ? '#FEF3C7' : '#F1F5F9',
                  color: tpl.priority === 'CRITICAL' ? '#991B1B' : tpl.priority === 'HIGH' ? '#92400E' : '#475569'
                }}>
                  {tpl.priority}
                </span>
              </div>
              <h4 style={{ margin: '4px 0', fontSize: '14px', fontWeight: '800' }}>{tpl.name}</h4>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '0 0 10px' }}>{tpl.description}</p>
              <div style={{ fontSize: '10.5px', fontFamily: 'monospace', background: '#F8FAF9', padding: '6px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                DLT Key: {tpl.dltEnvVar}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
