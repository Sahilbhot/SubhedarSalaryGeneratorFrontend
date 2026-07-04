import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const EMPTY = { employee_name: '', phone_number: '', joining_date: '', salary: '' };

export default function EmployeeForm({ initial = EMPTY, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.employee_name.trim()) e.employee_name = 'Name is required';
    if (form.phone_number && !/^\d{10}$/.test(form.phone_number.trim()))
      e.phone_number = 'Enter a valid 10-digit phone number';
    if (!form.joining_date) e.joining_date = 'Joining date is required';
    if (!form.salary || isNaN(Number(form.salary)) || Number(form.salary) <= 0)
      e.salary = 'Enter a valid salary greater than 0';
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSubmit({ ...form, salary: Number(form.salary) });
  }

  function field(name) {
    return {
      value: form[name],
      onChange: (ev) => {
        setForm((f) => ({ ...f, [name]: ev.target.value }));
        setErrors((e) => ({ ...e, [name]: '' }));
      },
    };
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="emp-name">Employee Name *</Label>
        <Input id="emp-name" placeholder="e.g. Ramesh Kumar" {...field('employee_name')} />
        {errors.employee_name && (
          <span className="text-xs text-destructive">{errors.employee_name}</span>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="emp-phone">Phone Number</Label>
        <Input
          id="emp-phone"
          type="tel"
          placeholder="e.g. 9876543210"
          maxLength={10}
          {...field('phone_number')}
        />
        {errors.phone_number && (
          <span className="text-xs text-destructive">{errors.phone_number}</span>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="emp-date">Joining Date *</Label>
        <Input id="emp-date" type="date" {...field('joining_date')} />
        {errors.joining_date && (
          <span className="text-xs text-destructive">{errors.joining_date}</span>
        )}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="emp-salary">Salary / Month (₹) *</Label>
        <Input
          id="emp-salary"
          type="number"
          min="1"
          step="100"
          placeholder="e.g. 12000"
          {...field('salary')}
        />
        {errors.salary && <span className="text-xs text-destructive">{errors.salary}</span>}
      </div>

      <div className="mt-1 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save Employee'}
        </Button>
      </div>
    </form>
  );
}
