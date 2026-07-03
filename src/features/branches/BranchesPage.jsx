import { useState, useEffect, useCallback } from 'react';
import { api } from '@/shared/services/api.js';
import Modal from '@/shared/components/Modal.jsx';

const EMPTY_FORM = { name: '', address: '' };

export default function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editBranch, setEditBranch] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getBranches();
      setBranches(res.data || []);
    } catch (e) {
      setError(e.message || 'Failed to load branches.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  function openCreate() {
    setEditBranch(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  }

  function openEdit(branch) {
    setEditBranch(branch);
    setForm({ name: branch.name, address: branch.address || '' });
    setFormError('');
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      if (editBranch) await api.updateBranch(editBranch.id, form);
      else await api.createBranch(form);
      setShowForm(false);
      load();
    } catch (err) {
      setFormError(err.message || 'Failed to save branch.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Branches</h2>
          <p className="page-sub">Manage hotel branches / locations</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          + Add Branch
        </button>
      </div>

      {loading && (
        <div className="state-box">
          <div className="spinner" />
          <p>Loading branches…</p>
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
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b, i) => (
                <tr key={b.id}>
                  <td className="td-num">{i + 1}</td>
                  <td className="td-name">{b.name}</td>
                  <td>{b.address || '—'}</td>
                  <td>
                    <span className={`badge ${b.is_active ? 'badge-on' : 'badge-off'}`}>
                      {b.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="td-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => openEdit(b)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {branches.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="td-num"
                    style={{ textAlign: 'center', padding: '24px' }}
                  >
                    No branches yet. Add your first branch.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <Modal title={editBranch ? 'Edit Branch' : 'Add Branch'} onClose={() => setShowForm(false)}>
          <form className="emp-form" onSubmit={handleSubmit}>
            {formError && <div className="alert alert-error">{formError}</div>}

            <div className="field">
              <label htmlFor="b-name">Branch Name</label>
              <input
                id="b-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="e.g. Bhosari"
              />
            </div>

            <div className="field">
              <label htmlFor="b-address">Address</label>
              <input
                id="b-address"
                type="text"
                value={form.address}
                onChange={(e) => setField('address', e.target.value)}
                placeholder="Optional"
              />
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
                {saving ? 'Saving…' : editBranch ? 'Save Changes' : 'Create Branch'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
