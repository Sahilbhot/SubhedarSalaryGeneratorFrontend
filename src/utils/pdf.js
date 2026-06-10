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
      ? `<img src="${logoDataUrl}" alt="Hotel Subhedar Logo" style="height:70px;object-fit:contain;border-radius:6px;" />`
      : `<div style="font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:#c2272d;">🏨</div>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Salary Slip — ${employee.employee_name} — ${monthName} ${year}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; color: #2d2417; background: #fff; padding: 40px; }
    .header { display: flex; align-items: center; gap: 20px; border-bottom: 3px solid #ffbe00; padding-bottom: 20px; margin-bottom: 24px; }
    .hotel-info { flex: 1; }
    .hotel-name { font-family: 'Playfair Display', serif; font-size: 26px; font-weight: 700; color: #c2272d; }
    .hotel-addr { font-size: 12px; color: #6b5c3e; margin-top: 4px; line-height: 1.5; }
    .slip-title { text-align: center; margin-bottom: 24px; }
    .slip-title h2 { font-family: 'Playfair Display', serif; font-size: 20px; color: #1a1208; }
    .slip-title .period { font-size: 14px; color: #6b5c3e; margin-top: 4px; }
    .section { margin-bottom: 20px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #c2272d; border-bottom: 1px solid #e8dfc8; padding-bottom: 6px; margin-bottom: 12px; }
    .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px dotted #e8dfc8; }
    .row:last-child { border-bottom: none; }
    .row .label { color: #6b5c3e; }
    .row .value { font-weight: 600; color: #2d2417; }
    .total-row { display: flex; justify-content: space-between; padding: 12px 16px; background: #ffbe00; border-radius: 6px; margin-top: 16px; }
    .total-row .label { font-size: 15px; font-weight: 700; color: #1a1208; }
    .total-row .value { font-size: 18px; font-weight: 700; color: #1a1208; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e8dfc8; display: flex; justify-content: space-between; font-size: 11px; color: #a09070; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    ${logoHtml}
    <div class="hotel-info">
      <div class="hotel-name">Hotel Subhedar</div>
      <div class="hotel-addr">
        Sheetal Baug Rd, Century Enka Colony<br/>
        Bhosari, Pimpri-Chinchwad<br/>
        Maharashtra 411039
      </div>
    </div>
  </div>

  <div class="slip-title">
    <h2>Salary Slip</h2>
    <div class="period">${monthName} ${year}</div>
  </div>

  <div class="section">
    <div class="section-title">Employee Details</div>
    <div class="row"><span class="label">Name</span><span class="value">${employee.employee_name}</span></div>
    <div class="row"><span class="label">Phone</span><span class="value">${employee.phone_number || '—'}</span></div>
    <div class="row"><span class="label">Joining Date</span><span class="value">${new Date(employee.joining_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span></div>
    <div class="row"><span class="label">Monthly Salary (Base)</span><span class="value">${formatCurrency(employee.salary)}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Salary Calculation</div>
    <div class="row"><span class="label">Days in ${monthName}</span><span class="value">${calc.daysInMonth} days</span></div>
    <div class="row"><span class="label">Daily Rate (Salary ÷ Days in Month)</span><span class="value">${formatCurrency(calc.dailyRate)}/day</span></div>
    <div class="row"><span class="label">Earned Leave Days</span><span class="value">${calc.paidLeaves} days</span></div>
    <div class="row"><span class="label">Leaves Taken</span><span class="value">− ${calc.leavesTaken} days</span></div>
    <div class="row"><span class="label">Effective Days (Earned − Taken)</span><span class="value">${calc.effectiveDays} days</span></div>
    <div class="row"><span class="label">Gross Salary (Daily Rate × ${calc.effectiveDays})</span><span class="value">${formatCurrency(calc.grossSalary)}</span></div>
    ${calc.advanceDeduction > 0 ? `<div class="row"><span class="label">Advance Deduction</span><span class="value">− ${formatCurrency(calc.advanceDeduction)}</span></div>` : ''}
  </div>

  <div class="total-row">
    <span class="label">Net Amount Payable</span>
    <span class="value">${formatCurrency(calc.netSalary)}</span>
  </div>

  <div class="footer">
    <span>Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
    <span>Hotel Subhedar, Bhosari</span>
  </div>
</body>
</html>`;

  const win = window.open('', '_blank');
  win.document.write(html);
  win.document.close();
  win.onload = () => { win.print(); };
}
