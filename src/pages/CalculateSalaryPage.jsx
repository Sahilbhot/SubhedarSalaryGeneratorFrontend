import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { calculateSalary, formatCurrency, MONTHS, getDaysInMonth } from '../utils/salary.js';
import { generateSalaryPDF } from '../utils/pdf.js';

const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth() + 1;
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i);

export default function CalculateSalaryPage() {
  const [employees, setEmployees] = useState([]);
  const [loadingEmps, setLoadingEmps] = useState(true);

  const [form, setForm] = useState({
    employeeId: '',
    month: currentMonth,
    year: currentYear,
    paidLeaves: 4,
    leavesTaken: 0,
    advance: 0,
  });

  const [result, setResult] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    api.getEmployees()
        .then(res => setEmployees(res.data || []))
        .catch(() => {})
        .finally(() => setLoadingEmps(false));
  }, []);

  function setField(name, value) {
    setForm(f => ({ ...f, [name]: value }));
    setResult(null);
  }

  function handleEmployeeChange(id) {
    const emp = employees.find(e => String(e.employee_id) === String(id));
    setSelectedEmployee(emp || null);
    setField('employeeId', id);
  }

  function handleCalculate(ev) {
    ev.preventDefault();
    if (!form.employeeId || !selectedEmployee) {
      alert('Please select an employee');
      return;
    }
    const calc = calculateSalary({
      monthlySalary: Number(selectedEmployee.salary),
      year: Number(form.year),
      month: Number(form.month),
      paidLeaves: Number(form.paidLeaves),
      leavesTaken: Number(form.leavesTaken),
      advance: Number(form.advance),
    });
    setResult({ ...calc, paidLeaves: Number(form.paidLeaves), leavesTaken: Number(form.leavesTaken) });
  }

  async function handleDownloadPDF() {
    if (!result || !selectedEmployee) return;
    await generateSalaryPDF({
      employee: selectedEmployee,
      calc: result,
      month: Number(form.month),
      year: Number(form.year),
    });
  }

  const daysPreview = form.year && form.month
      ? getDaysInMonth(Number(form.year), Number(form.month))
      : null;

  return (
      <div className="page">
        <div className="page-header">
          <div>
            <h2>Calculate Salary</h2>
            <p className="page-sub">Compute monthly payroll for any employee</p>
          </div>
        </div>

        <div className="calc-layout">
          <form className="calc-form" onSubmit={handleCalculate} noValidate>
            {/* Employee */}
            <div className="field">
              <label>Select Employee *</label>
              <select
                  value={form.employeeId}
                  onChange={e => handleEmployeeChange(e.target.value)}
                  disabled={loadingEmps}
              >
                <option value="">{loadingEmps ? 'Loading…' : '— Select Employee —'}</option>
                {employees.map(emp => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      {emp.employee_name} — ₹{Number(emp.salary).toLocaleString('en-IN')}/mo
                    </option>
                ))}
              </select>
            </div>

            {/* Month + Year */}
            <div className="field-row">
              <div className="field">
                <label>Month *</label>
                <select value={form.month} onChange={e => setField('month', e.target.value)}>
                  {MONTHS.map((m, i) => (
                      <option key={m} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Year *</label>
                <select value={form.year} onChange={e => setField('year', e.target.value)}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {daysPreview && (
                <div className="info-pill">
                  {MONTHS[Number(form.month) - 1]} {form.year} has <strong>{daysPreview} days</strong>
                  {' '}— Daily Rate = ₹{Number(selectedEmployee?.salary || 0).toLocaleString('en-IN')} ÷ {daysPreview}
                </div>
            )}

            {/* Earned (Paid) Leaves */}
            <div className="field">
              <label>
                Earned Leave Days
                <span className="field-hint">Salary is paid for these days (default 4)</span>
              </label>
              <input
                  type="number" min="0" max="31"
                  value={form.paidLeaves}
                  onChange={e => setField('paidLeaves', e.target.value)}
              />
            </div>

            {/* Leaves Taken */}
            <div className="field">
              <label>
                Leaves Taken
                <span className="field-hint">Deducted from earned leave days</span>
              </label>
              <input
                  type="number" min="0" max="31"
                  value={form.leavesTaken}
                  onChange={e => setField('leavesTaken', e.target.value)}
              />
              <span className="field-hint">
              Effective days: {form.paidLeaves} − {form.leavesTaken} = <strong>{Number(form.paidLeaves) - Number(form.leavesTaken)}</strong>
            </span>
            </div>

            {/* Advance */}
            <div className="field">
              <label>
                Advance Taken (₹)
                <span className="field-hint">Deducted from final salary</span>
              </label>
              <input
                  type="number" min="0" step="100"
                  value={form.advance}
                  onChange={e => setField('advance', e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Calculate Salary
            </button>
          </form>

          {/* Result */}
          {result && selectedEmployee && (
              <div className="result-card">
                <div className="result-header">
                  <div className="result-emp">{selectedEmployee.employee_name}</div>
                  <div className="result-period">
                    {MONTHS[Number(form.month) - 1]} {form.year}
                  </div>
                </div>

                <div className="result-rows">
                  <div className="result-row">
                    <span>Base Monthly Salary</span>
                    <span>{formatCurrency(selectedEmployee.salary)}</span>
                  </div>
                  <div className="result-row">
                    <span>Days in {MONTHS[Number(form.month) - 1]}</span>
                    <span>{result.daysInMonth} days</span>
                  </div>
                  <div className="result-row">
                    <span>Daily Rate (Salary ÷ Days in Month)</span>
                    <span>{formatCurrency(result.dailyRate)}/day</span>
                  </div>
                  <div className="result-row plus">
                    <span>Earned Leave Days</span>
                    <span>{result.paidLeaves} days</span>
                  </div>
                  <div className="result-row minus">
                    <span>Leaves Taken</span>
                    <span>− {result.leavesTaken} days</span>
                  </div>
                  <div className="result-row bold">
                    <span>Effective Days</span>
                    <span>{result.effectiveDays} days</span>
                  </div>
                  <div className="result-row">
                    <span>Gross Salary (Daily Rate × {result.effectiveDays})</span>
                    <span>{formatCurrency(result.grossSalary)}</span>
                  </div>
                  {result.advanceDeduction > 0 && (
                      <div className="result-row minus">
                        <span>Advance Deduction</span>
                        <span>− {formatCurrency(result.advanceDeduction)}</span>
                      </div>
                  )}
                </div>

                <div className="result-net">
                  <span>Net Payable</span>
                  <span>{formatCurrency(result.netSalary)}</span>
                </div>

                <button className="btn btn-primary btn-full" onClick={handleDownloadPDF}>
                  ⬇ Download PDF Salary Slip
                </button>
              </div>
          )}
        </div>
      </div>
  );
}
