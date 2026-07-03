import { useState } from 'react';

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
    <form className="emp-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label>Employee Name *</label>
        <input type="text" placeholder="e.g. Ramesh Kumar" {...field('employee_name')} />
        {errors.employee_name && <span className="field-error">{errors.employee_name}</span>}
      </div>
      <div className="field">
        <label>Phone Number</label>
        <input type="tel" placeholder="e.g. 9876543210" maxLength={10} {...field('phone_number')} />
        {errors.phone_number && <span className="field-error">{errors.phone_number}</span>}
      </div>
      <div className="field">
        <label>Joining Date *</label>
        <input type="date" {...field('joining_date')} />
        {errors.joining_date && <span className="field-error">{errors.joining_date}</span>}
      </div>
      <div className="field">
        <label>Salary / Month (₹) *</label>
        <input type="number" min="1" step="100" placeholder="e.g. 12000" {...field('salary')} />
        {errors.salary && <span className="field-error">{errors.salary}</span>}
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Save Employee'}
        </button>
      </div>
    </form>
  );
}
