/**
 * Salary Calculation Formula:
 * Daily Rate = (Monthly Salary × 12) ÷ 365
 * Monthly Salary = Daily Rate × (Days in Month + Extra Paid Leave Days - Leaves Taken)
 * Final = Monthly Salary - Advance
 */

export function getDaysInMonth(year, month) {
  // month is 1-based
  return new Date(year, month, 0).getDate();
}

export function calculateSalary({ monthlySalary, year, month, paidLeaves, leavesTaken, advance }) {
  const daysInMonth = getDaysInMonth(year, month);

  // Daily rate based on annual average
  const dailyRate = (monthlySalary * 12) / 365;

  // Effective working days = calendar days + paid leaves - leaves taken
  const effectiveDays = daysInMonth + paidLeaves - leavesTaken;

  // Gross salary for this month
  const grossSalary = dailyRate * effectiveDays;

  // Deduct advance
  const netSalary = grossSalary - advance;

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
