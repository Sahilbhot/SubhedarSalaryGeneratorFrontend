import { useState, useEffect } from 'react';
import { api } from '@/shared/services/api.js';
import EmployeeForm from '../components/EmployeeForm.jsx';
import Modal from '@/shared/components/Modal.jsx';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  // Fetch on mount. The synchronous setState inside load() is intentional
  // (initial loading state) — safe for a one-shot mount fetch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

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
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  function formatSalary(s) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(s);
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Employees</h2>
          <p className="page-sub">Manage your hotel staff</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Employee
        </button>
      </div>

      {loading && (
        <div className="state-box">
          <div className="spinner" />
          <p>Loading employees…</p>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-error">
          {error}
          <button className="btn btn-ghost" onClick={load}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && employees.length === 0 && (
        <div className="state-box empty">
          <div className="empty-icon">👥</div>
          <p>No employees yet. Add your first employee to get started.</p>
        </div>
      )}

      {!loading && employees.length > 0 && (
        <div className="emp-table-wrap">
          <table className="emp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Joining Date</th>
                <th>Salary/Month</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={emp.employee_id}>
                  <td className="td-num">{i + 1}</td>
                  <td className="td-name">{emp.employee_name}</td>
                  <td>{emp.phone_number || '—'}</td>
                  <td>{formatDate(emp.joining_date)}</td>
                  <td className="td-salary">{formatSalary(emp.salary)}</td>
                  <td className="td-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => setEditEmployee(emp)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setDeleteId(emp.employee_id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>
              Delete
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
