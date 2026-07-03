import { useState, useEffect, useCallback } from 'react';
import { api } from '@/shared/services/api.js';
import Modal from '@/shared/components/Modal.jsx';
import { ROLES, ROLE_LABELS, BRANCH_SCOPED_ROLES } from '@/shared/constants/roles.js';

const EMPTY_FORM = { name: '', email: '', password: '', role: ROLES.STAFF, branch_id: '' };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [usersRes, branchesRes] = await Promise.all([api.getUsers(), api.getBranches()]);
      setUsers(usersRes.data || []);
      setBranches(branchesRes.data || []);
    } catch (e) {
      setError(e.message || 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const branchName = (id) => branches.find((b) => b.id === id)?.name || '—';
  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  function openCreate() {
    setEditUser(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(user) {
    setEditUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      branch_id: user.branch_id ?? '',
    });
    setFormError('');
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    const branchScoped = BRANCH_SCOPED_ROLES.includes(form.role);
    if (branchScoped && !form.branch_id) {
      setFormError(`Please select a branch for the ${ROLE_LABELS[form.role]} role.`);
      return;
    }
    if (!editUser && form.password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
      branch_id: branchScoped ? Number(form.branch_id) : null,
    };
    if (form.password) payload.password = form.password;

    setSaving(true);
    try {
      if (editUser) await api.updateUser(editUser.id, payload);
      else await api.createUser(payload);
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.message || 'Failed to save user.');
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(user) {
    try {
      await api.setUserStatus(user.id, !user.is_active);
      load();
    } catch (e) {
      alert('Failed to update status: ' + e.message);
    }
  }

  const branchScoped = BRANCH_SCOPED_ROLES.includes(form.role);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Users</h2>
          <p className="page-sub">Manage staff accounts and roles</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add User
        </button>
      </div>

      {loading && (
        <div className="state-box">
          <div className="spinner" />
          <p>Loading users…</p>
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

      {!loading && !error && (
        <div className="emp-table-wrap">
          <table className="emp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Branch</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id}>
                  <td className="td-num">{i + 1}</td>
                  <td className="td-name">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{ROLE_LABELS[u.role] || u.role}</td>
                  <td>{u.role === ROLES.ADMIN ? 'All branches' : branchName(u.branch_id)}</td>
                  <td>
                    <span className={`badge ${u.is_active ? 'badge-on' : 'badge-off'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="td-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(u)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-ghost" onClick={() => toggleStatus(u)}>
                      {u.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="td-num"
                    style={{ textAlign: 'center', padding: '24px' }}
                  >
                    No users yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <Modal title={editUser ? 'Edit User' : 'Add User'} onClose={() => setShowForm(false)}>
          <form className="emp-form" onSubmit={handleSubmit}>
            {formError && <div className="alert alert-error">{formError}</div>}

            <div className="field">
              <label htmlFor="u-name">Full Name</label>
              <input
                id="u-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="u-email">Email</label>
              <input
                id="u-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="u-password">
                Password
                {editUser && <span className="field-hint"> (leave blank to keep current)</span>}
              </label>
              <input
                id="u-password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
                placeholder={editUser ? '••••••••' : 'At least 6 characters'}
              />
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="u-role">Role</label>
                <select
                  id="u-role"
                  value={form.role}
                  onChange={(e) => setField('role', e.target.value)}
                >
                  {Object.values(ROLES).map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="u-branch">Branch {branchScoped ? '' : '(admin = all)'}</label>
                <select
                  id="u-branch"
                  value={form.branch_id}
                  onChange={(e) => setField('branch_id', e.target.value)}
                  disabled={!branchScoped}
                >
                  <option value="">{branchScoped ? 'Select a branch…' : 'All branches'}</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : editUser ? 'Save Changes' : 'Create User'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
