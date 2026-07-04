import { useState, useEffect } from 'react';
import { api } from '@/shared/services/api.js';
import { calculateSalary, formatCurrency, MONTHS, getDaysInMonth } from '../utils/salary.js';
import { generateSalaryPDF } from '../utils/pdf.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    api
      .getEmployees()
      .then((res) => setEmployees(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingEmps(false));
  }, []);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
    setResult(null);
  }

  function handleEmployeeChange(id) {
    const emp = employees.find((e) => String(e.employee_id) === String(id));
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
    setResult({
      ...calc,
      paidLeaves: Number(form.paidLeaves),
      leavesTaken: Number(form.leavesTaken),
    });
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

  const daysPreview =
    form.year && form.month ? getDaysInMonth(Number(form.year), Number(form.month)) : null;

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Calculate Salary</h2>
        <p className="text-sm text-muted-foreground">Compute monthly payroll for any employee</p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card className="gap-0 p-6">
          <form className="grid gap-4" onSubmit={handleCalculate} noValidate>
            <div className="grid gap-1.5">
              <Label>Select Employee *</Label>
              <Select
                value={form.employeeId}
                onValueChange={handleEmployeeChange}
                disabled={loadingEmps}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingEmps ? 'Loading…' : '— Select Employee —'} />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.employee_id} value={String(emp.employee_id)}>
                      {emp.employee_name} — ₹{Number(emp.salary).toLocaleString('en-IN')}/mo
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Month *</Label>
                <Select value={String(form.month)} onValueChange={(v) => setField('month', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m, i) => (
                      <SelectItem key={m} value={String(i + 1)}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label>Year *</Label>
                <Select value={String(form.year)} onValueChange={(v) => setField('year', v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {YEARS.map((y) => (
                      <SelectItem key={y} value={String(y)}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {daysPreview && (
              <div className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-[13px] text-foreground">
                {MONTHS[Number(form.month) - 1]} {form.year} has{' '}
                <strong>{daysPreview} days</strong> — Daily Rate = ₹
                {Number(selectedEmployee?.salary || 0).toLocaleString('en-IN')} ÷ {daysPreview}
              </div>
            )}

            <div className="grid gap-1.5">
              <Label htmlFor="paid-leaves">Earned Leave Days</Label>
              <span className="-mt-1 text-[11px] text-muted-foreground">
                Salary is paid for these days (default 4)
              </span>
              <Input
                id="paid-leaves"
                type="number"
                min="0"
                max="31"
                value={form.paidLeaves}
                onChange={(e) => setField('paidLeaves', e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="leaves-taken">Leaves Taken</Label>
              <span className="-mt-1 text-[11px] text-muted-foreground">
                Deducted from earned leave days
              </span>
              <Input
                id="leaves-taken"
                type="number"
                min="0"
                max="31"
                value={form.leavesTaken}
                onChange={(e) => setField('leavesTaken', e.target.value)}
              />
              <span className="text-[11px] text-muted-foreground">
                Effective days: {form.paidLeaves} − {form.leavesTaken} ={' '}
                <strong>{Number(form.paidLeaves) - Number(form.leavesTaken)}</strong>
              </span>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="advance">Advance Taken (₹)</Label>
              <span className="-mt-1 text-[11px] text-muted-foreground">
                Deducted from final salary
              </span>
              <Input
                id="advance"
                type="number"
                min="0"
                step="100"
                value={form.advance}
                onChange={(e) => setField('advance', e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full">
              Calculate Salary
            </Button>
          </form>
        </Card>

        {result && selectedEmployee && (
          <div className="overflow-hidden rounded-xl border bg-card shadow-md">
            <div className="bg-[color:var(--heading-color)] px-5 py-4 text-white">
              <div className="font-display text-lg font-bold text-primary">
                {selectedEmployee.employee_name}
              </div>
              <div className="text-[13px] text-white/70">
                {MONTHS[Number(form.month) - 1]} {form.year}
              </div>
            </div>

            <div className="flex flex-col px-5 py-4 text-[13px]">
              <Row label="Base Monthly Salary" value={formatCurrency(selectedEmployee.salary)} />
              <Row label={`Days in ${MONTHS[Number(form.month) - 1]}`} value={`${result.daysInMonth} days`} />
              <Row
                label="Daily Rate (Salary ÷ Days in Month)"
                value={`${formatCurrency(result.dailyRate)}/day`}
              />
              <Row label="Earned Leave Days" value={`${result.paidLeaves} days`} valueClass="text-[color:var(--success-color)] font-semibold" />
              <Row label="Leaves Taken" value={`− ${result.leavesTaken} days`} valueClass="text-destructive font-semibold" />
              <Row label="Effective Days" value={`${result.effectiveDays} days`} bold />
              <Row
                label={`Gross Salary (Daily Rate × ${result.effectiveDays})`}
                value={formatCurrency(result.grossSalary)}
              />
              {result.advanceDeduction > 0 && (
                <Row
                  label="Advance Deduction"
                  value={`− ${formatCurrency(result.advanceDeduction)}`}
                  valueClass="text-destructive font-semibold"
                />
              )}
            </div>

            <div className="flex items-center justify-between bg-primary px-5 py-4 font-bold text-[color:var(--heading-color)]">
              <span className="text-sm">Net Payable</span>
              <span className="text-xl">{formatCurrency(result.netSalary)}</span>
            </div>

            <Button
              variant="default"
              className="w-full rounded-none rounded-b-xl"
              onClick={handleDownloadPDF}
            >
              ⬇ Download PDF Salary Slip
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, valueClass = '', bold = false }) {
  return (
    <div
      className={`flex justify-between border-b border-dotted border-border py-2 last:border-b-0 ${
        bold ? 'font-bold text-foreground' : 'text-foreground'
      }`}
    >
      <span>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
