/**
 * Salary Calculation Formula:
 *
 * Daily Rate    = Monthly Salary ÷ Days in Month
 * Gross Salary  = Monthly Salary + (Daily Rate × Earned Leave Days) − (Daily Rate × Leaves Taken)
 *               = Monthly Salary + Daily Rate × (Earned Leave Days − Leaves Taken)
 * Net Salary    = Gross Salary − Advance
 *
 * Example:
 *   Monthly = ₹12,000, Days in Month = 30, Earned Leaves = 4, Taken = 1, Advance = 500
 *   Daily Rate   = 12000 ÷ 30 = ₹400/day
 *   Gross        = 12000 + 400×4 − 400×1 = 12000 + 1600 − 400 = ₹13,200
 *   Net          = 13200 − 500 = ₹12,700
 */

export function getDaysInMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export function calculateSalary({ monthlySalary, year, month, paidLeaves, leavesTaken, advance }) {
  const daysInMonth = getDaysInMonth(year, month);

  // Daily rate based on actual days in the month
  const dailyRate = monthlySalary / daysInMonth;

  // Gross = Base + (Daily Rate × Earned Leave Days) − (Daily Rate × Leaves Taken)
  const grossSalary = monthlySalary + dailyRate * paidLeaves - dailyRate * leavesTaken;

  // Net = Gross − Advance
  const netSalary = grossSalary - advance;

  // Effective days = base days + earned leaves − leaves taken (for display purposes)
  const effectiveDays = daysInMonth + paidLeaves - leavesTaken;

  return {
    daysInMonth,
    dailyRate: parseFloat(dailyRate.toFixed(4)),
    effectiveDays,
    grossSalary: parseFloat(grossSalary.toFixed(2)),
    advanceDeduction: advance,
    netSalary: parseFloat(netSalary.toFixed(2)),
  };
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
