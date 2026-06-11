import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { calculateSalary, formatCurrency, MONTHS, getDaysInMonth } from '../utils/salary.js';
import { generateSalaryPDF } from '../utils/pdf.js';
import logoUrl from '../assets/logo.jpg';

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

        <div className={`calc-layout ${result && selectedEmployee ? 'has-result' : ''}`}>
          <form className="calc-form" onSubmit={handleCalculate} noValidate>
            <div className="calc-grid">
              {/* Employee */}
              <div className="field span-2">
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

              {daysPreview && (
                  <div className="info-pill span-2">
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
              <div className="field span-2">
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

              <button type="submit" className="btn btn-primary btn-full span-2">
                Calculate Salary
              </button>
            </div>
          </form>

          {/* Invoice / Salary slip */}
          {result && selectedEmployee && (
              <div className="invoice">
                <div className="inv-head">
                  <div className="inv-brand">
                    <img src={logoUrl} alt="Hotel Subhedar"
                         onError={e => { e.target.style.visibility = 'hidden'; }} />
                    <div>
                      <div className="inv-title">Salary Slip</div>
                      <div className="inv-org">Hotel Subhedar</div>
                    </div>
                  </div>
                  <div className="inv-meta">
                    <span className="inv-period-pill">{MONTHS[Number(form.month) - 1]} {form.year}</span>
                    <small>Bhosari, Pimpri-Chinchwad</small>
                  </div>
                </div>

                <div className="inv-party">
                  <div className="inv-emp">
                    <span className="inv-emp-avatar">
                      {(selectedEmployee.employee_name || '?').charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <div className="inv-emp-name">{selectedEmployee.employee_name}</div>
                      <div className="inv-emp-meta">
                        {selectedEmployee.phone_number ? `📞 ${selectedEmployee.phone_number}` : 'Employee'}
                      </div>
                    </div>
                  </div>
                  <div className="inv-base">
                    <b>{formatCurrency(selectedEmployee.salary)}</b>
                    <small>Base Monthly Salary</small>
                  </div>
                </div>

                <table className="inv-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Details</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="inv-desc">Base Monthly Salary</td>
                      <td className="inv-detail">Fixed monthly pay</td>
                      <td className="inv-amt">{formatCurrency(selectedEmployee.salary)}</td>
                    </tr>
                    <tr>
                      <td className="inv-desc">Daily Rate</td>
                      <td className="inv-detail">
                        ₹{Number(selectedEmployee.salary).toLocaleString('en-IN')} ÷ {result.daysInMonth} days
                      </td>
                      <td className="inv-amt">{formatCurrency(result.dailyRate)}/day</td>
                    </tr>
                    <tr className="plus">
                      <td className="inv-desc">Earned Leave Days</td>
                      <td className="inv-detail">{result.paidLeaves} days × daily rate</td>
                      <td className="inv-amt">+ {formatCurrency(result.dailyRate * result.paidLeaves)}</td>
                    </tr>
                    <tr className="minus">
                      <td className="inv-desc">Leaves Taken</td>
                      <td className="inv-detail">{result.leavesTaken} days × daily rate</td>
                      <td className="inv-amt">− {formatCurrency(result.dailyRate * result.leavesTaken)}</td>
                    </tr>
                    <tr className="bold">
                      <td className="inv-desc">Gross Salary</td>
                      <td className="inv-detail">{result.effectiveDays} effective days</td>
                      <td className="inv-amt">{formatCurrency(result.grossSalary)}</td>
                    </tr>
                    {result.advanceDeduction > 0 && (
                        <tr className="minus">
                          <td className="inv-desc">Advance Deduction</td>
                          <td className="inv-detail">Advance taken</td>
                          <td className="inv-amt">− {formatCurrency(result.advanceDeduction)}</td>
                        </tr>
                    )}
                  </tbody>
                </table>

                <div className="inv-net">
                  <div className="inv-net-l">
                    <b>Net Payable</b>
                    <small>Amount to be paid for {MONTHS[Number(form.month) - 1]} {form.year}</small>
                  </div>
                  <span className="inv-net-amt">{formatCurrency(result.netSalary)}</span>
                </div>

                <div className="inv-actions">
                  <button className="btn btn-primary" onClick={handleDownloadPDF}>
                    ⬇ Download PDF Salary Slip
                  </button>
                </div>
              </div>
          )}
        </div>
      </div>
  );
}
