import { useState, useEffect } from 'react';
import { api } from '@/shared/services/api.js';
import EmployeeForm from '../components/EmployeeForm.jsx';
import Modal from '@/shared/components/Modal.jsx';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Employees</h2>
          <p className="text-sm text-muted-foreground">Manage your hotel staff</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>+ Add Employee</Button>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
          <div className="size-8 animate-spin rounded-full border-[3px] border-border border-t-primary" />
          <p>Loading employees…</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex items-center justify-between gap-3 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
          <Button variant="ghost" size="sm" onClick={load}>
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && employees.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <div className="text-4xl">👥</div>
          <p>No employees yet. Add your first employee to get started.</p>
        </div>
      )}

      {!loading && employees.length > 0 && (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/60">
                <TableHead className="w-10">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Salary/Month</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((emp, i) => (
                <TableRow key={emp.employee_id}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {emp.employee_name}
                  </TableCell>
                  <TableCell>{emp.phone_number || '—'}</TableCell>
                  <TableCell>{formatDate(emp.joining_date)}</TableCell>
                  <TableCell className="font-semibold text-[color:var(--secondary-color)]">
                    {formatSalary(emp.salary)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditEmployee(emp)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(emp.employee_id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
          <p className="mb-5 text-sm text-muted-foreground">
            Are you sure you want to delete this employee? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteId)}>
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
