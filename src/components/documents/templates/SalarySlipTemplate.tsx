import React from 'react';
import { DocumentHeader } from '../shared/DocumentHeader';
import { DocumentFooter } from '../shared/DocumentFooter';
import { DocumentMeta } from '../shared/DocumentMeta';
import { SignatureSection } from '../shared/SignatureSection';
import { PaperFormat } from '@/services/documents/templates.registry';

interface SalarySlipProps {
  format?: PaperFormat;
  docData: {
    docNumber?: string;
    payPeriod?: string;
    empName?: string;
    empId?: string;
    designation?: string;
    department?: string;
    joiningDate?: string;
    bankAcc?: string;
    basicSalary?: number;
    allowances?: number;
    bonus?: number;
    overtime?: number;
    advanceDeduction?: number;
    leaveDeduction?: number;
    otherDeductions?: number;
    status?: string;
  };
  tenantInfo?: any;
}

export const SalarySlipTemplate: React.FC<SalarySlipProps> = ({
  format = 'A4',
  docData,
  tenantInfo
}) => {
  const docNumber = docData.docNumber || 'SLIP-202608-00102';
  const payPeriod = docData.payPeriod || 'August 2026';
  const empName = docData.empName || 'Amit Kumar';
  const empId = docData.empId || 'EMP102';

  const basic = docData.basicSalary || 15000;
  const allowances = docData.allowances || 2000;
  const bonus = docData.bonus || 1000;
  const overtime = docData.overtime || 0;

  const grossSalary = basic + allowances + bonus + overtime;

  const advanceDeduction = docData.advanceDeduction || 1000;
  const leaveDeduction = docData.leaveDeduction || 0;
  const otherDeductions = docData.otherDeductions || 0;

  const totalDeductions = advanceDeduction + leaveDeduction + otherDeductions;
  const netPayable = grossSalary - totalDeductions;

  return (
    <div className="document-container" style={{ padding: format === 'A5' ? '16px' : '24px' }}>
      <DocumentHeader title="EMPLOYEE SALARY SLIP" subtitle={`Pay Period: ${payPeriod}`} format={format} tenantInfo={tenantInfo} />
      <DocumentMeta docNumber={docNumber} date={new Date().toISOString().split('T')[0]} status={docData.status || 'Paid'} format={format} />

      {/* Employee Info Box */}
      <div style={{ background: '#FFFFFF', border: '1.5px solid #CBD5E1', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
        <div style={{ color: '#64748B', fontSize: '10.5px', textTransform: 'uppercase', fontWeight: '800', marginBottom: '8px' }}>Employee Master Profile</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '12.5px' }}>
          <div>
            <span style={{ color: '#64748B' }}>Employee Name:</span><br />
            <strong style={{ color: '#4E2A18', fontSize: '14px' }}>{empName}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Employee ID:</span><br />
            <strong>{empId}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Designation:</span><br />
            <strong>{docData.designation || 'Milk Collection Agent'}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Department:</span><br />
            <strong>{docData.department || 'Dairy Operations'}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Joining Date:</span><br />
            <strong>{docData.joiningDate || '2024-01-15'}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Bank Account:</span><br />
            <strong>{docData.bankAcc || 'XXXX-XXXX-4829 (SBI)'}</strong>
          </div>
        </div>
      </div>

      {/* Earnings vs Deductions Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* Earnings */}
        <div style={{ border: '1.5px solid #CBD5E1', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ background: '#16A34A', color: '#FFFFFF', padding: '10px 14px', fontWeight: '900', fontSize: '13px', textTransform: 'uppercase' }}>
            Earnings (Cr)
          </div>
          <div style={{ padding: '14px', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Basic Salary:</span>
              <strong>₹{basic.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>House / Fuel Allowance:</span>
              <strong>₹{allowances.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Performance Bonus:</span>
              <strong>₹{bonus.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
            </div>
            {overtime > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Overtime Pay:</span>
                <strong>₹{overtime.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </div>
            )}
            <div style={{ borderTop: '2px solid #E2E8F0', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontWeight: '900', color: '#16A34A', fontSize: '14px' }}>
              <span>GROSS EARNINGS:</span>
              <span>₹{grossSalary.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div style={{ border: '1.5px solid #CBD5E1', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ background: '#DC2626', color: '#FFFFFF', padding: '10px 14px', fontWeight: '900', fontSize: '13px', textTransform: 'uppercase' }}>
            Deductions (Dr)
          </div>
          <div style={{ padding: '14px', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Salary Advance Recovered:</span>
              <strong>₹{advanceDeduction.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Unpaid Leave Deduction:</span>
              <strong>₹{leaveDeduction.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
            </div>
            {otherDeductions > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Other Adjustments:</span>
                <strong>₹{otherDeductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
              </div>
            )}
            <div style={{ borderTop: '2px solid #E2E8F0', paddingTop: '8px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', fontWeight: '900', color: '#DC2626', fontSize: '14px' }}>
              <span>TOTAL DEDUCTIONS:</span>
              <span>₹{totalDeductions.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Net Payable Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #4E2A18 0%, #7C3A21 100%)',
        color: '#FFFFFF',
        borderRadius: '16px',
        padding: '18px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', opacity: 0.9, fontWeight: '700' }}>NET PAYABLE SALARY</div>
          <div style={{ fontSize: '11px', opacity: '0.8' }}>Credited to Bank Account</div>
        </div>
        <div style={{ fontSize: '26px', fontWeight: '900', color: '#FFFFFF' }}>
          ₹{netPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
      </div>

      <SignatureSection leftLabel="Employee Signature" rightLabel="Employer / Manager Signature" format={format} />
      <DocumentFooter format={format} tenantName={tenantInfo?.name} />
    </div>
  );
};
