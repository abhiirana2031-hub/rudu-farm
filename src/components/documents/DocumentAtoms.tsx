import React from 'react';
import { BusinessProfile } from './document.types';

/**
 * Convert INR amount to words
 */
export const amountToWords = (num: number): string => {
  if (num === 0) return 'Zero Rupees Only';
  const a = [
    '',
    'One ',
    'Two ',
    'Three ',
    'Four ',
    'Five ',
    'Six ',
    'Seven ',
    'Eight ',
    'Nine ',
    'Ten ',
    'Eleven ',
    'Twelve ',
    'Thirteen ',
    'Fourteen ',
    'Fifteen ',
    'Sixteen ',
    'Seventeen ',
    'Eighteen ',
    'Nineteen ',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n: number): string => {
    if (n < 20) return a[n];
    const digit = n % 10;
    if (n < 100) return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : '');
    if (n < 1000) return inWords(Math.floor(n / 100)) + 'Hundred ' + (n % 100 === 0 ? '' : 'and ' + inWords(n % 100));
    if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + (n % 1000 !== 0 ? inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + (n % 100000 !== 0 ? inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + 'Crore ' + (n % 10000000 !== 0 ? inWords(n % 10000000) : '');
  };

  const whole = Math.floor(num);
  const fraction = Math.round((num - whole) * 100);

  let result = inWords(whole).trim() + ' Rupees';
  if (fraction > 0) {
    result += ' and ' + inWords(fraction).trim() + ' Paise';
  }
  return result + ' Only';
};

/**
 * Standard Professional ERP Document Header
 */
export const DocumentHeader: React.FC<{
  profile: BusinessProfile;
  title: string;
  docNumber: string;
  docDate: string;
  docTime?: string;
  badgeText?: string;
}> = ({ profile, title, docNumber, docDate, docTime, badgeText }) => {
  return (
    <div className="border-b-2 border-gray-900 pb-4 mb-4">
      <div className="flex justify-between items-start gap-4">
        {/* Company Identity */}
        <div className="space-y-1 max-w-md">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white font-black text-xl flex items-center justify-center border border-emerald-700 shrink-0">
              🥛
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-gray-950 uppercase">
                {profile.name}
              </h1>
              {profile.tagline && (
                <p className="text-[11px] font-semibold text-emerald-800 tracking-wide">
                  {profile.tagline}
                </p>
              )}
            </div>
          </div>

          <div className="text-[11px] text-gray-600 leading-tight pt-1">
            <p>{profile.address}</p>
            <p>
              Phone: <span className="font-semibold text-gray-800">{profile.phone}</span> • Email:{' '}
              <span className="font-semibold text-gray-800">{profile.email}</span>
            </p>
            {profile.gstin && (
              <p className="font-mono text-[10px] text-gray-700 font-bold">
                GSTIN: {profile.gstin} {profile.fssaiNumber && `• FSSAI: ${profile.fssaiNumber}`}
              </p>
            )}
          </div>
        </div>

        {/* Document Title & Meta */}
        <div className="text-right space-y-1 shrink-0">
          <div className="inline-block px-3 py-1 bg-gray-950 text-white text-xs font-black tracking-wider uppercase rounded-md">
            {title}
          </div>
          {badgeText && (
            <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest block">
              {badgeText}
            </div>
          )}
          <div className="text-[11px] text-gray-600 pt-1 font-mono">
            <p>
              Doc #: <span className="font-bold text-gray-950">{docNumber}</span>
            </p>
            <p>
              Date: <span className="font-bold text-gray-950">{docDate}</span>
              {docTime && ` ${docTime}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Party / Beneficiary Info Box
 */
export const PartyInfoBox: React.FC<{
  leftTitle: string;
  leftData: { label: string; value: React.ReactNode }[];
  rightTitle?: string;
  rightData?: { label: string; value: React.ReactNode }[];
}> = ({ leftTitle, leftData, rightTitle, rightData }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 text-xs">
      <div className="space-y-1">
        <h4 className="font-black text-[10px] uppercase text-gray-400 tracking-wider mb-1.5 border-b border-gray-200 pb-0.5">
          {leftTitle}
        </h4>
        {leftData.map((item, idx) => (
          <div key={idx} className="flex justify-between gap-2">
            <span className="text-gray-500 font-medium">{item.label}:</span>
            <span className="font-bold text-gray-900 text-right">{item.value || '—'}</span>
          </div>
        ))}
      </div>

      {rightTitle && rightData && (
        <div className="space-y-1 sm:border-l sm:border-gray-200 sm:pl-3">
          <h4 className="font-black text-[10px] uppercase text-gray-400 tracking-wider mb-1.5 border-b border-gray-200 pb-0.5">
            {rightTitle}
          </h4>
          {rightData.map((item, idx) => (
            <div key={idx} className="flex justify-between gap-2">
              <span className="text-gray-500 font-medium">{item.label}:</span>
              <span className="font-bold text-gray-900 text-right">{item.value || '—'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Signatures Block
 */
export const DocumentSignatures: React.FC<{
  sign1Title?: string;
  sign1Name?: string;
  sign2Title?: string;
  sign2Name?: string;
  sign3Title?: string;
  sign3Name?: string;
  terms?: string;
}> = ({
  sign1Title = 'Customer / Farmer Sign',
  sign1Name,
  sign2Title = 'Verified / Prepared By',
  sign2Name,
  sign3Title = 'Authorized Signatory',
  sign3Name = 'For Rudu Smart Dairy',
  terms,
}) => {
  return (
    <div className="mt-8 pt-4 border-t border-gray-300">
      {terms && (
        <div className="text-[10px] text-gray-500 mb-6 leading-relaxed">
          <span className="font-bold text-gray-700">Terms & Conditions:</span> {terms}
        </div>
      )}

      <div className="grid grid-cols-3 gap-6 text-center text-xs">
        <div className="space-y-8">
          <div className="h-9" />
          <div className="border-t border-gray-400 pt-1">
            <p className="font-bold text-gray-900">{sign1Name || 'Signature'}</p>
            <p className="text-[10px] text-gray-500">{sign1Title}</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="h-9" />
          <div className="border-t border-gray-400 pt-1">
            <p className="font-bold text-gray-900">{sign2Name || 'Staff Operator'}</p>
            <p className="text-[10px] text-gray-500">{sign2Title}</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="h-9 flex items-center justify-center font-serif italic text-xs text-emerald-950 font-bold">
            [ Seal / Verified ]
          </div>
          <div className="border-t border-gray-400 pt-1">
            <p className="font-bold text-gray-900">{sign3Name}</p>
            <p className="text-[10px] text-gray-500">{sign3Title}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
