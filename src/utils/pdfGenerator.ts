import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MilkEntry, Farmer, PayoutRecord } from '../types';

export const exportLedgerToPDF = (
  farmer: Farmer,
  entries: MilkEntry[],
  periodLabel: string = 'May 2025'
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const totalQuantity = entries.reduce((sum, e) => sum + e.quantityLiters, 0);
  const totalAmount = entries.reduce((sum, e) => sum + e.totalAmount, 0);
  const avgFat = (
    entries.reduce((sum, e) => sum + e.fatPercentage, 0) / (entries.length || 1)
  ).toFixed(2);
  const avgSnf = (
    entries.reduce((sum, e) => sum + e.snfPercentage, 0) / (entries.length || 1)
  ).toFixed(2);
  const avgRate = (totalAmount / (totalQuantity || 1)).toFixed(2);

  // --- Header Styling ---
  // Top Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 28, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('RUDU SMART DAIRY CO-OPERATIVE', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Regd No: GJ-DAIRY-2024/9882 • Anand-Kheda Milk Producer Union', 14, 18);
  doc.text('Official Milk Supply Passbook & Transaction Ledger', 14, 23);

  // Right side header info
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 196, 12, { align: 'right' });
  doc.text(`Statement Period: ${periodLabel}`, 196, 18, { align: 'right' });

  // --- Farmer Information Box ---
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 33, 182, 26, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Farmer: ${farmer.name}`, 18, 40);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Farmer Code: `, 18, 46);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${farmer.farmerCode}`, 38, 46);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Village: ${farmer.village}, ${farmer.district}`, 18, 52);
  doc.text(`Mobile: ${farmer.phone}`, 18, 57);

  doc.text(`Bank: ${farmer.bankDetails.bankName}`, 105, 40);
  doc.text(`A/C: ${farmer.bankDetails.accountNumber}`, 105, 46);
  doc.text(`IFSC: ${farmer.bankDetails.ifscCode}`, 105, 52);
  doc.text(`UPI: ${farmer.bankDetails.upiId} [KYC: ${farmer.bankDetails.kycStatus}]`, 105, 57);

  // --- Summary Metrics Cards ---
  const startY = 63;
  const cardWidth = 43;
  const cardHeight = 16;
  const gap = 3.3;

  const metrics = [
    { label: 'TOTAL MILK SUPPLIED', value: `${totalQuantity.toFixed(1)} L` },
    { label: 'TOTAL AMOUNT EARNED', value: `Rs. ${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
    { label: 'AVG FAT / SNF', value: `${avgFat}% / ${avgSnf}%` },
    { label: 'AVG RATE / LITRE', value: `Rs. ${avgRate}/L` },
  ];

  metrics.forEach((m, idx) => {
    const x = 14 + idx * (cardWidth + gap);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(x, startY, cardWidth, cardHeight, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, x + 3, startY + 5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(m.value, x + 3, startY + 12);
  });

  // --- Supply Table ---
  const tableRows = entries.map((entry) => [
    entry.receiptId,
    `${entry.date}\n(${entry.shift.toUpperCase()} - ${entry.time})`,
    entry.milkType.toUpperCase(),
    `${entry.quantityLiters.toFixed(1)} L`,
    `${entry.fatPercentage.toFixed(1)}%`,
    `${entry.snfPercentage.toFixed(1)}%`,
    `${entry.clrReading || 28}`,
    `Rs. ${entry.ratePerLiter.toFixed(2)}`,
    `Rs. ${entry.totalAmount.toFixed(2)}`,
    entry.status,
  ]);

  autoTable(doc, {
    startY: 83,
    head: [[
      'Slip No.',
      'Date & Shift',
      'Type',
      'Qty',
      'Fat %',
      'SNF %',
      'CLR',
      'Rate/L',
      'Total Amount',
      'Status'
    ]],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
      cellPadding: 2.5,
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'left' },
      1: { halign: 'left' },
      2: { halign: 'center' },
      3: { fontStyle: 'bold', halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right' },
      8: { fontStyle: 'bold', halign: 'right', textColor: [15, 23, 42] },
      9: { halign: 'center' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14, bottom: 25 },
  });

  // Get current Y position after table
  const finalY = (doc as any).lastAutoTable?.finalY || 240;

  // Signatures & Footer block
  const footerY = Math.min(finalY + 12, 265);

  // If table went near bottom, add new page for signature block
  if (footerY > 270) {
    doc.addPage();
    drawFooterBlock(doc, 20, farmer);
  } else {
    drawFooterBlock(doc, footerY, farmer);
  }

  // Save the document
  const fileName = `RuduFarm_Ledger_${farmer.farmerCode}_${periodLabel.replace(/\s+/g, '_')}.pdf`;
  doc.save(fileName);
};

const drawFooterBlock = (doc: jsPDF, y: number, farmer: Farmer) => {
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, 196, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Note: This is a computer generated passbook statement certified by Rudu Smart Dairy ERP.', 14, y + 5);
  doc.text('All measurements are taken automatically via calibrated Fat/SNF milk analyzers.', 14, y + 9);

  // Signature boxes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);

  // Farmer signature line
  doc.line(20, y + 22, 65, y + 22);
  doc.text(`Farmer Signature (${farmer.name})`, 20, y + 26);

  // Dairy In-charge signature line
  doc.line(145, y + 22, 190, y + 22);
  doc.text('Authorized Dairy In-Charge', 145, y + 26);
};

export const exportCollectionSlipToPDF = (entry: MilkEntry, farmer: Farmer) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [100, 140], // Thermal / Slip size
  });

  const qty = typeof entry.quantity === 'number' ? entry.quantity : entry.quantityLiters;
  const qUnit = entry.quantityUnit || 'L';
  const fatVal = typeof entry.fat === 'number' ? entry.fat : entry.fatPercentage;
  const snfVal = typeof entry.snf === 'number' ? entry.snf : entry.snfPercentage;
  const rateVal = typeof entry.rate === 'number' ? entry.rate : entry.ratePerLiter;
  const rUnit = entry.rateUnit || 'L';
  const totalAmt = typeof entry.amount === 'number' ? entry.amount : entry.totalAmount;

  // Top header
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 100, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('RUDU DAIRY', 50, 8, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(203, 213, 225);
  doc.text('MILK COLLECTION RECEIPT SLIP', 50, 13, { align: 'center' });

  // Slip Details
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(`Slip No: ${entry.receiptId}`, 8, 25);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Date: ${entry.date} (${entry.shift.toUpperCase()})`, 8, 30);
  doc.text(`Time: ${entry.time}`, 8, 35);

  doc.line(8, 38, 92, 38);

  doc.setFont('helvetica', 'bold');
  doc.text(`Farmer: ${entry.farmerName} (${entry.farmerCode})`, 8, 44);
  doc.setFont('helvetica', 'normal');
  doc.text(`Village: ${entry.village}`, 8, 49);
  doc.text(`Milk Type: ${entry.milkType.toUpperCase()} MILK`, 8, 54);

  doc.line(8, 57, 92, 57);

  // Quality readings
  doc.setFont('helvetica', 'normal');
  doc.text('Quantity:', 8, 64);
  doc.setFont('helvetica', 'bold');
  doc.text(`${qty.toFixed(3)} ${qUnit}`, 92, 64, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text('FAT Percentage:', 8, 70);
  doc.setFont('helvetica', 'bold');
  doc.text(`${fatVal.toFixed(1)} %`, 92, 70, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text('SNF Percentage:', 8, 76);
  doc.setFont('helvetica', 'bold');
  doc.text(`${snfVal.toFixed(1)} %`, 92, 76, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.text('Rate per Unit:', 8, 82);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rs. ${rateVal.toFixed(2)} / ${rUnit}`, 92, 82, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`Formula: ${qty.toFixed(3)} ${qUnit} x Rs. ${rateVal.toFixed(2)}`, 8, 88);
  doc.setFontSize(8);

  doc.line(8, 91, 92, 91);

  // Total Amount highlight
  doc.setFillColor(241, 245, 249);
  doc.rect(8, 94, 84, 12, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL AMOUNT:', 12, 101.5);
  doc.text(`Rs. ${totalAmt.toFixed(2)}`, 88, 101.5, { align: 'right' });

  // Footer notes
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Collected by: ${entry.collectedBy}`, 8, 115);
  doc.text('Thank you for delivering pure, fresh milk.', 50, 124, { align: 'center' });
  doc.text('Auto-verified by Rudu Dairy Smart ERP', 50, 128, { align: 'center' });

  doc.save(`Slip_${entry.receiptId}_${entry.farmerCode}.pdf`);
};

export const exportPayoutInvoiceToPDF = (payout: PayoutRecord, farmer: Farmer) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Top Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('RUDU SMART DAIRY CO-OPERATIVE', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('PAYOUT SETTLEMENT ADVICE & DISBURSEMENT RECEIPT', 14, 18);
  doc.text(`Payout Reference: ${payout.payoutId} • Txn ID: ${payout.paymentReference}`, 14, 23);

  // Farmer & Payout summary
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 35, 182, 35, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(`Beneficiary: ${farmer.name} (${farmer.farmerCode})`, 18, 43);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Village: ${farmer.village}, ${farmer.district}`, 18, 49);
  doc.text(`Settlement Cycle: ${payout.periodStart} to ${payout.periodEnd}`, 18, 55);
  doc.text(`Disbursement Date: ${payout.date} at ${payout.time}`, 18, 61);

  doc.text(`Payment Mode: ${payout.paymentMethod}`, 110, 43);
  doc.text(`Bank Name: ${farmer.bankDetails.bankName}`, 110, 49);
  doc.text(`Account No: ${farmer.bankDetails.accountNumber}`, 110, 55);
  doc.text(`UPI ID: ${farmer.bankDetails.upiId}`, 110, 61);

  // Table summary
  autoTable(doc, {
    startY: 75,
    head: [['Description', 'Volume / Units', 'Average Rate', 'Settlement Status', 'Net Payout Amount']],
    body: [
      [
        `Milk Supply Payout for ${payout.periodStart} - ${payout.periodEnd}`,
        `${payout.totalMilkSupplied} Liters`,
        `Rs. ${payout.avgRate.toFixed(2)} / L`,
        payout.status.toUpperCase(),
        `Rs. ${payout.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
      ]
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [15, 23, 42],
      cellPadding: 4,
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      4: { fontStyle: 'bold', halign: 'right' }
    }
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 120;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('This is an official financial settlement advice. Funds have been deposited directly into the registered farmer bank account.', 14, finalY + 15);

  doc.save(`Payout_${payout.payoutId}_${farmer.farmerCode}.pdf`);
};
