import { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api.js';
import EmployeeForm from '../components/EmployeeForm.jsx';
import Modal from '../components/Modal.jsx';

const svg = (d) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const IC = {
  users:  svg(<><path d="M17 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>),
  wallet: svg(<><path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2" /><path d="M21 12H3M16 12a2 2 0 1 0 0 0" /></>),
  trend:  svg(<><path d="M22 7l-8.5 8.5-5-5L2 17" /><path d="M16 7h6v6" /></>),
  search: svg(<><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>),
  plus:   svg(<><path d="M12 5v14M5 12h14" /></>),
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [query, setQuery] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api.getEmployees();
      setEmployees(res.data || []);
    } catch {
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  async function handleAdd(data) {
    setSaving(true);
    try {
      await api.createEmployee(data);
      setShowAddModal(false);
      load();
    } catch (e) {
      alert('Failed to add employee: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(data) {
    setSaving(true);
    try {
      await api.updateEmployee(editEmployee.employee_id, data);
      setEditEmployee(null);
      load();
    } catch (e) {
      alert('Failed to update employee: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteEmployee(id);
      setDeleteId(null);
      load();
    } catch (e) {
      alert('Failed to delete employee: ' + e.message);
    }
  }

  function formatDate(d) {
    return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function formatSalary(s) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(s);
  }

  const stats = useMemo(() => {
    const total = employees.reduce((sum, e) => sum + Number(e.salary || 0), 0);
    return {
      count: employees.length,
      payroll: total,
      avg: employees.length ? Math.round(total / employees.length) : 0,
    };
  }, [employees]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(e =>
      e.employee_name?.toLowerCase().includes(q) ||
      (e.phone_number || '').includes(q)
    );
  }, [employees, query]);

  return (
    <div className="page page-full">
      <div className="page-header">
        <div>
          <h2>Employees</h2>
          <p className="page-sub">Manage your hotel staff &amp; their salaries</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          {IC.plus} Add Employee
        </button>
      </div>

      {!loading && !error && employees.length > 0 && (
        <div className="stat-row">
          <div className="stat-card">
            <div className="stat-ic s-red">{IC.users}</div>
            <div>
              <div className="stat-val">{stats.count}</div>
              <div className="stat-label">Total Employees</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-ic s-gold">{IC.wallet}</div>
            <div>
              <div className="stat-val">{formatSalary(stats.payroll)}</div>
              <div className="stat-label">Monthly Payroll</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-ic s-green">{IC.trend}</div>
            <div>
              <div className="stat-val">{formatSalary(stats.avg)}</div>
              <div className="stat-label">Average Salary</div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="state-box">
          <div className="spinner" />
          <p>Loading employees…</p>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-error">
          {error}
          <button className="btn btn-ghost" onClick={load}>Retry</button>
        </div>
      )}

      {!loading && !error && employees.length === 0 && (
        <div className="state-box empty">
          <div className="empty-icon">👥</div>
          <p>No employees yet. Add your first employee to get started.</p>
        </div>
      )}

      {!loading && employees.length > 0 && (
        <>
          <div className="emp-toolbar">
            <div className="search-box">
              {IC.search}
              <input
                type="text"
                placeholder="Search by name or phone…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <span className="toolbar-count">
              {filtered.length} of {employees.length} {employees.length === 1 ? 'employee' : 'employees'}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="state-box empty">
              <div className="empty-icon">🔍</div>
              <p>No employees match “{query}”.</p>
            </div>
          ) : (
            <div className="emp-table-wrap">
              <table className="emp-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Joining Date</th>
                    <th>Salary/Month</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp, i) => (
                    <tr key={emp.employee_id}>
                      <td className="td-num">{i + 1}</td>
                      <td>
                        <div className="emp-namecell">
                          <span className="emp-avatar">{(emp.employee_name || '?').charAt(0).toUpperCase()}</span>
                          <span className="td-name">{emp.employee_name}</span>
                        </div>
                      </td>
                      <td>{emp.phone_number || '—'}</td>
                      <td>{formatDate(emp.joining_date)}</td>
                      <td className="td-salary">{formatSalary(emp.salary)}</td>
                      <td className="td-actions">
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => setEditEmployee(emp)}
                        >Edit</button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => setDeleteId(emp.employee_id)}
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showAddModal && (
        <Modal title="Add Employee" onClose={() => setShowAddModal(false)}>
          <EmployeeForm
            onSubmit={handleAdd}
            onCancel={() => setShowAddModal(false)}
            loading={saving}
          />
        </Modal>
      )}

      {editEmployee && (
        <Modal title="Edit Employee" onClose={() => setEditEmployee(null)}>
          <EmployeeForm
            initial={{
              employee_name: editEmployee.employee_name,
              phone_number: editEmployee.phone_number || '',
              joining_date: editEmployee.joining_date?.split('T')[0] || '',
              salary: String(editEmployee.salary),
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditEmployee(null)}
            loading={saving}
          />
        </Modal>
      )}

      {deleteId && (
        <Modal title="Confirm Delete" onClose={() => setDeleteId(null)}>
          <p style={{ marginBottom: '20px', color: 'var(--default-color)' }}>
            Are you sure you want to delete this employee? This action cannot be undone.
          </p>
          <div className="form-actions">
            <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
            <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
