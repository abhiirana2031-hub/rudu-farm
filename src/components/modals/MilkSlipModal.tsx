import React, { useState } from 'react';
import { X, Printer, Share2, CheckCircle2, QrCode, Download, Cloud } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportCollectionSlipToPDF } from '../../utils/pdfGenerator';
import { getAccessToken, getOrCreateDairyFolder, uploadFileToDrive } from '../../services/googleDriveService';

export const MilkSlipModal: React.FC = () => {
  const { selectedEntryForSlip, setSelectedEntryForSlip, currentFarmer, setIsGoogleDriveModalOpen, triggerCelebration } = useApp();
  const [isSavingToDrive, setIsSavingToDrive] = useState(false);
  const [driveSaved, setDriveSaved] = useState(false);

  if (!selectedEntryForSlip) return null;

  const entry = selectedEntryForSlip;
  const qty = typeof entry.quantity === 'number' ? entry.quantity : entry.quantityLiters;
  const qUnit = entry.quantityUnit || 'L';
  const fatVal = typeof entry.fat === 'number' ? entry.fat : entry.fatPercentage;
  const snfVal = typeof entry.snf === 'number' ? entry.snf : entry.snfPercentage;
  const rateVal = typeof entry.rate === 'number' ? entry.rate : entry.ratePerLiter;
  const rUnit = entry.rateUnit || 'L';
  const totalAmt = typeof entry.amount === 'number' ? entry.amount : entry.totalAmount;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    exportCollectionSlipToPDF(entry, currentFarmer);
  };

  const handleSaveToDrive = async () => {
    const token = await getAccessToken();
    if (!token) {
      setIsGoogleDriveModalOpen(true);
      return;
    }

    setIsSavingToDrive(true);
    try {
      const folderId = await getOrCreateDairyFolder(token);
      const fileName = `Milk_Slip_${entry.receiptId}_${entry.farmerCode}.txt`;
      const slipContent = `
========================================
             RUDU DAIRY
      Milk Collection Receipt Slip
========================================
Slip No:        ${entry.receiptId}
Date & Time:    ${entry.date} ${entry.time}
Shift:          ${entry.shift.toUpperCase()}
----------------------------------------
Farmer:         ${entry.farmerName} (${entry.farmerCode})
Location:       ${entry.village}
Center:         ${entry.centerName || 'Kheda Center #01'}
Milk Type:      ${entry.milkType.toUpperCase()}
Quantity:       ${qty.toFixed(3)} ${qUnit}
FAT %:          ${fatVal.toFixed(1)}%
SNF %:          ${snfVal.toFixed(1)}%
Rate:           ₹${rateVal.toFixed(2)} / ${rUnit}
Pricing Mode:   ${entry.pricingMode || 'MANUAL_RATE'}
Formula:        ${qty.toFixed(3)} ${qUnit} × ₹${rateVal.toFixed(2)}
----------------------------------------
TOTAL AMOUNT:   ₹${totalAmt.toFixed(2)}
Status:         ${entry.status}
Operator:       ${entry.collectedBy}
========================================
     Thank you for choosing Rudu Dairy
========================================
      `;

      await uploadFileToDrive(token, fileName, 'text/plain', slipContent, folderId);
      setDriveSaved(true);
      triggerCelebration();
      setTimeout(() => setDriveSaved(false), 4000);
    } catch (err: any) {
      alert(`Could not save to Drive: ${err.message}`);
    } finally {
      setIsSavingToDrive(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `🥛 *RUDU DAIRY - MILK COLLECTION RECEIPT* 🥛%0A` +
      `Slip No: *${entry.receiptId}*%0A` +
      `Date & Time: ${entry.date} (${entry.time})%0A` +
      `Session: *${entry.shift.toUpperCase()}*%0A` +
      `Farmer: *${entry.farmerName}* (${entry.farmerCode})%0A` +
      `Milk Type: *${entry.milkType.toUpperCase()} MILK*%0A` +
      `----------------------------------------%0A` +
      `Quantity: *${qty.toFixed(3)} ${qUnit}*%0A` +
      `FAT: *${fatVal.toFixed(1)}%* | SNF: *${snfVal.toFixed(1)}%*%0A` +
      `Rate: *₹${rateVal.toFixed(2)} / ${rUnit}*%0A` +
      `Formula: ${qty.toFixed(3)} ${qUnit} × ₹${rateVal.toFixed(2)}%0A` +
      `----------------------------------------%0A` +
      `*TOTAL AMOUNT: ₹${totalAmt.toFixed(2)}*%0A` +
      `Status: ${entry.status}%0A` +
      `Thank you for delivering pure milk!%0A` +
      `_Rudu Dairy Management System_`;

    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-gray-200 flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-4 py-3 bg-gray-900 text-white flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Rudu Dairy Collection Slip</span>
          </div>
          <button
            onClick={() => setSelectedEntryForSlip(null)}
            className="w-7 h-7 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-300 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Container */}
        <div id="printable-receipt" className="p-5 font-mono text-xs text-gray-800 space-y-3 bg-[#fafafa]">
          {/* Slip Header */}
          <div className="text-center border-b border-dashed border-gray-300 pb-3">
            <div className="font-extrabold text-base tracking-wider text-gray-950">RUDU DAIRY</div>
            <div className="text-[10px] text-gray-500 font-sans font-semibold">Milk Collection Receipt</div>
            <div className="text-[9.5px] text-gray-400 mt-0.5">Anand Hub • Helpline: 1800-RUDU-DAIRY</div>
          </div>

          {/* Receipt & Farmer Meta */}
          <div className="space-y-1 text-[11px] border-b border-dashed border-gray-300 pb-2.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Slip No:</span>
              <span className="font-bold text-gray-900">{entry.receiptId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date/Time:</span>
              <span className="font-medium">{entry.date}, {entry.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Session:</span>
              <span className="font-bold uppercase text-emerald-800">{entry.shift}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Farmer:</span>
              <span className="font-bold text-gray-900">{entry.farmerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Farmer ID:</span>
              <span className="font-bold font-mono">{entry.farmerCode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Center:</span>
              <span>{entry.centerName || 'Kheda Hub #01'}</span>
            </div>
          </div>

          {/* Test Readings Table */}
          <div className="space-y-1.5 text-[11px] border-b border-dashed border-gray-300 pb-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Milk Type:</span>
              <span className="font-bold capitalize text-gray-900">{entry.milkType} Milk</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Quantity:</span>
              <span className="font-extrabold text-xs text-gray-950 font-mono">{qty.toFixed(3)} {qUnit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">FAT:</span>
              <span className="font-bold text-gray-900">{fatVal.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">SNF:</span>
              <span className="font-bold text-gray-900">{snfVal.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Rate:</span>
              <span className="font-bold text-emerald-800 font-mono">₹{rateVal.toFixed(2)} / {rUnit}</span>
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 pt-0.5 border-t border-dotted border-gray-200">
              <span>Formula:</span>
              <span className="font-mono">{qty.toFixed(3)} × ₹{rateVal.toFixed(2)}</span>
            </div>
          </div>

          {/* Total Amount Box */}
          <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-900 tracking-wider block">
              TOTAL AMOUNT
            </span>
            <span className="text-2xl font-black text-gray-950 font-mono mt-0.5 block">
              ₹{totalAmt.toFixed(2)}
            </span>
            <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 mt-1">
              Status: {entry.status}
            </span>
          </div>

          {/* Verification Footer */}
          <div className="flex items-center justify-between pt-1 text-[9.5px] text-gray-500 font-sans">
            <div>
              <div>Operator: {entry.collectedBy}</div>
              <div className="text-gray-700 font-semibold mt-0.5">✓ Rudu Dairy Cloud Verified</div>
            </div>
            <div className="w-10 h-10 border border-gray-300 rounded p-0.5 flex items-center justify-center bg-white">
              <QrCode className="w-8 h-8 text-gray-800" />
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 grid grid-cols-4 gap-1.5">
          <button
            onClick={handleDownloadPDF}
            className="py-2.5 px-1.5 bg-gray-950 hover:bg-gray-800 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
            title="Download PDF Slip"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>PDF</span>
          </button>
          <button
            onClick={handleSaveToDrive}
            disabled={isSavingToDrive}
            className={`py-2.5 px-1.5 ${
              driveSaved ? 'bg-emerald-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
            } active:scale-95 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer`}
            title="Save to Google Drive"
          >
            <Cloud className={`w-3.5 h-3.5 ${isSavingToDrive ? 'animate-bounce' : ''}`} />
            <span>{isSavingToDrive ? 'Saving...' : driveSaved ? 'Saved!' : 'Drive'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="py-2.5 px-1.5 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-900 border border-gray-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
          <button
            onClick={handleShareWhatsApp}
            className="py-2.5 px-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
