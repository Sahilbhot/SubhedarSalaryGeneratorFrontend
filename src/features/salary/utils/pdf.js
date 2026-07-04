import { formatCurrency, MONTHS } from './salary.js';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

async function getLogoDataUrl() {
  try {
    const response = await fetch(new URL('../../../assets/logo.jpg', import.meta.url).href);
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

  // Build the slip HTML (inline styles only — no external font fetch needed at render time)
  const slipHTML = `
    <div style="font-family:Arial,sans-serif;color:#2d2417;background:#fff;padding:40px;width:794px;box-sizing:border-box;">
      <div style="display:flex;align-items:center;gap:20px;border-bottom:3px solid #ffbe00;padding-bottom:20px;margin-bottom:24px;">
        ${logoHtml}
        <div style="flex:1;">
          <div style="font-size:26px;font-weight:700;color:#c2272d;">Hotel Subhedar</div>
          <div style="font-size:12px;color:#6b5c3e;margin-top:4px;line-height:1.5;">
            Sheetal Baug Road, Nashik-Pune Highway<br/>
            Bhosari, Pimpri Chinchwad<br/>
            Pune - 411039
          </div>
        </div>
      </div>

      <div style="text-align:center;margin-bottom:24px;">
        <div style="font-size:20px;font-weight:700;color:#1a1208;">Salary Slip</div>
        <div style="font-size:14px;color:#6b5c3e;margin-top:4px;">${monthName} ${year}</div>
      </div>

      ${section(
        'Employee Details',
        `
        ${row('Name', employee.employee_name)}
        ${row('Phone', employee.phone_number || '—')}
        ${row('Joining Date', new Date(employee.joining_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }))}
        ${row('Monthly Salary (Base)', formatCurrency(employee.salary))}
      `,
      )}

      ${section(
        'Salary Calculation',
        `
        ${row(`Days in ${monthName}`, `${calc.daysInMonth} days`)}
        ${row('Daily Rate (Salary ÷ Days in Month)', `${formatCurrency(calc.dailyRate)}/day`)}
        ${row('Earned Leave Days', `${calc.paidLeaves} days`)}
        ${row('Leaves Taken', `− ${calc.leavesTaken} days`)}
        ${row('Effective Days (Earned − Taken)', `${calc.effectiveDays} days`)}
        ${row(`Gross Salary (Daily Rate × ${calc.effectiveDays})`, formatCurrency(calc.grossSalary))}
        ${calc.advanceDeduction > 0 ? row('Advance Deduction', `− ${formatCurrency(calc.advanceDeduction)}`) : ''}
      `,
      )}

      <div style="display:flex;justify-content:space-between;padding:12px 16px;background:#ffbe00;border-radius:6px;margin-top:16px;">
        <span style="font-size:15px;font-weight:700;color:#1a1208;">Net Amount Payable</span>
        <span style="font-size:18px;font-weight:700;color:#1a1208;">${formatCurrency(calc.netSalary)}</span>
      </div>

      <div style="margin-top:40px;padding-top:16px;border-top:1px solid #e8dfc8;display:flex;justify-content:space-between;font-size:11px;color:#a09070;">
        <span>Generated on ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
        <span>Hotel Subhedar, Bhosari</span>
      </div>
    </div>
  `;

  // Mount off-screen container
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;left:-9999px;top:0;';
  container.innerHTML = slipHTML;
  document.body.appendChild(container);

  try {
    const slipEl = container.firstElementChild;

    const canvas = await html2canvas(slipEl, {
      scale: 2, // 2× for crisp text & logo
      useCORS: true, // allow cross-origin logo image
      logging: false,
      backgroundColor: '#ffffff',
    });

    const imgData = canvas.toDataURL('image/png');

    // A4 dimensions in mm
    const A4_W = 210;
    const A4_H = 297;

    // Scale canvas to A4 width, keeping aspect ratio
    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const ratio = A4_W / canvasW;
    const pdfH = Math.min(canvasH * ratio, A4_H); // cap at one A4 page

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    pdf.addImage(imgData, 'PNG', 0, 0, A4_W, pdfH);

    const filename = `Salary_Slip_${employee.employee_name.replace(/\s+/g, '_')}_${monthName}_${year}.pdf`;
    pdf.save(filename); // triggers browser download immediately
  } finally {
    document.body.removeChild(container);
  }
}

// ── helpers ──────────────────────────────────────────────────────────────────

function section(title, rowsHTML) {
  return `
    <div style="margin-bottom:20px;">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#c2272d;border-bottom:1px solid #e8dfc8;padding-bottom:6px;margin-bottom:12px;">${title}</div>
      ${rowsHTML}
    </div>
  `;
}

function row(label, value) {
  return `
    <div style="display:flex;justify-content:space-between;padding:6px 0;font-size:13px;border-bottom:1px dotted #e8dfc8;">
      <span style="color:#6b5c3e;">${label}</span>
      <span style="font-weight:600;color:#2d2417;">${value}</span>
    </div>
  `;
}
