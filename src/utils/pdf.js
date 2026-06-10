/**
 * PDF generation using html2pdf.js for automatic download.
 * No new tab opened, no print dialog — pure client-side PDF blob download.
 */

import { formatCurrency, MONTHS } from './salary.js';

async function getLogoDataUrl() {
  try {
    const response = await fetch(new URL('../assets/logo.jpg', import.meta.url).href);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateSalaryPDF({ employee, calc, month, year }) {
  const monthName = MONTHS[month - 1];
  const logoDataUrl = await getLogoDataUrl();

  const logoHtml = logoDataUrl
      ? `<img src="${logoDataUrl}" alt="Hotel Subhedar" style="height:64px;object-fit:contain;border-radius:8px;" />`
      : `<div style="width:64px;height:64px;background:#ffbe00;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:28px;">🏨</div>`;

  const advanceRow = calc.advanceDeduction > 0
      ? `<tr>
        <td style="padding:8px 0;color:#6b5c3e;font-size:13px;border-bottom:1px dotted #e8dfc8;">Advance Deduction</td>
        <td style="padding:8px 0;text-align:right;color:#dc2626;font-weight:600;font-size:13px;border-bottom:1px dotted #e8dfc8;">− ${formatCurrency(calc.advanceDeduction)}</td>
      </tr>`
      : '';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Salary Slip — ${employee.employee_name} — ${monthName} ${year}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
  <style>
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Inter',sans-serif;color:#2d2417;background:#fff;padding:36px;font-size:14px;}
    .header{display:flex;align-items:center;gap:18px;padding-bottom:20px;margin-bottom:20px;border-bottom:2.5px solid #ffbe00;}
    .hotel-name{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:#c2272d;margin-bottom:4px;}
    .hotel-addr{font-size:12px;color:#6b5c3e;line-height:1.6;}
    .title-block{text-align:center;margin-bottom:24px;}
    .title-block h2{font-family:'Playfair Display',serif;font-size:18px;color:#1a1208;}
    .title-block .period{font-size:13px;color:#6b5c3e;margin-top:3px;}
    .section{margin-bottom:20px;}
    .section-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#c2272d;padding-bottom:6px;margin-bottom:10px;border-bottom:1px solid #e8dfc8;}
    table{width:100%;border-collapse:collapse;}
    td{padding:7px 0;font-size:13px;}
    td:last-child{text-align:right;font-weight:600;color:#2d2417;}
    td:first-child{color:#6b5c3e;}
    tr:not(:last-child) td{border-bottom:1px dotted #e8dfc8;}
    .net-row{display:flex;justify-content:space-between;align-items:center;background:#ffbe00;border-radius:8px;padding:14px 18px;margin-top:16px;}
    .net-row .netlabel{font-size:14px;font-weight:700;color:#1a1208;}
    .net-row .netval{font-size:20px;font-weight:700;color:#1a1208;}
    .footer{margin-top:36px;padding-top:14px;border-top:1px solid #e8dfc8;display:flex;justify-content:space-between;font-size:11px;color:#a09070;}
    .formula-note{background:#faf8f4;border:1px solid #e8dfc8;border-radius:6px;padding:10px 14px;margin-bottom:20px;font-size:11px;color:#6b5c3e;line-height:1.7;}
    .formula-note strong{color:#2d2417;}
  </style>
</head>
<body>
  <div class="header">
    ${logoHtml}
    <div>
      <div class="hotel-name">Hotel Subhedar</div>
      <div class="hotel-addr">Sheetal Baug Rd, Century Enka Colony<br/>Bhosari, Pimpri-Chinchwad, MH 411039</div>
    </div>
  </div>

  <div class="title-block">
    <h2>Salary Slip</h2>
    <div class="period">${monthName} ${year}</div>
  </div>

  <div class="section">
    <div class="section-label">Employee Details</div>
    <table>
      <tr><td>Name</td><td>${employee.employee_name}</td></tr>
      <tr><td>Phone</td><td>${employee.phone_number || '—'}</td></tr>
      <tr><td>Joining Date</td><td>${new Date(employee.joining_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td></tr>
      <tr><td>Base Monthly Salary</td><td>${formatCurrency(employee.salary)}</td></tr>
    </table>
  </div>

  <div class="formula-note">
    <strong>Formula:</strong> Gross = Monthly Salary + (Daily Rate × Earned Leaves) − (Daily Rate × Leaves Taken) &nbsp;|&nbsp; Net = Gross − Advance
  </div>

  <div class="section">
    <div class="section-label">Salary Calculation</div>
    <table>
      <tr><td>Days in ${monthName}</td><td>${calc.daysInMonth} days</td></tr>
      <tr><td>Daily Rate (₹${Number(employee.salary).toLocaleString('en-IN')} ÷ ${calc.daysInMonth})</td><td>${formatCurrency(calc.dailyRate)}/day</td></tr>
      <tr><td>Earned Leave Days (+ added to salary)</td><td style="color:#16a34a;">+ ${calc.paidLeaves} days</td></tr>
      <tr><td>Leaves Taken (− deducted from earned)</td><td style="color:#dc2626;">− ${calc.leavesTaken} days</td></tr>
      <tr><td>Effective Extra Days (${calc.paidLeaves} − ${calc.leavesTaken})</td><td>${calc.paidLeaves - calc.leavesTaken} days</td></tr>
      <tr><td>Gross Salary</td><td>${formatCurrency(calc.grossSalary)}</td></tr>
      ${advanceRow}
    </table>
  </div>

  <div class="net-row">
    <span class="netlabel">Net Amount Payable</span>
    <span class="netval">${formatCurrency(calc.netSalary)}</span>
  </div>

  <div class="footer">
    <span>Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
    <span>Hotel Subhedar — Bhosari, Pimpri-Chinchwad</span>
  </div>
</body>
</html>`;

  // ── Automatic download via html2pdf.js (no new tab, no print dialog) ──
  await loadHtml2Pdf();

  const container = document.createElement('div');
  container.innerHTML = html;
  // We need to extract just the body content for html2pdf
  const bodyContent = container.querySelector('body') || container;

  const filename = `Salary_Slip_${employee.employee_name.replace(/\s+/g, '_')}_${monthName}_${year}.pdf`;

  await window.html2pdf()
      .set({
        margin: 0,
        filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(html, 'string')
      .save();
}

function loadHtml2Pdf() {
  if (window.html2pdf) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load html2pdf.js'));
    document.head.appendChild(script);
  });
}
