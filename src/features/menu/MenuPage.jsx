import { useState, useEffect, useMemo } from 'react';
import { api } from '@/shared/services/api.js';
import Modal from '@/shared/components/Modal.jsx';
import MenuForm from './MenuForm.jsx';

const ALL = 'All';

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [section, setSection] = useState(ALL);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const res = await api.getMenuItems();
      setItems(res.data || []);
    } catch {
      setError('Failed to load menu items. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // One-shot mount fetch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  const sections = useMemo(
    () => [ALL, ...Array.from(new Set(items.map((i) => i.section)))],
    [items],
  );
  const visible = section === ALL ? items : items.filter((i) => i.section === section);

  async function handleAdd(data) {
    setSaving(true);
    try {
      await api.createMenuItem(data);
      setShowAddModal(false);
      load();
    } catch (e) {
      alert('Failed to add item: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(data) {
    setSaving(true);
    try {
      await api.updateMenuItem(editItem.menu_item_id, data);
      setEditItem(null);
      load();
    } catch (e) {
      alert('Failed to update item: ' + e.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteMenuItem(id);
      setDeleteId(null);
      load();
    } catch (e) {
      alert('Failed to delete item: ' + e.message);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Menu</h2>
          <p className="page-sub">Add, edit, or remove dishes shown on the website</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          + Add Item
        </button>
      </div>

      {!loading && !error && items.length > 0 && (
        <div className="menu-filter">
          <label htmlFor="section-filter">Section</label>
          <select
            id="section-filter"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          >
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading && (
        <div className="state-box">
          <div className="spinner" />
          <p>Loading menu…</p>
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

      {!loading && !error && items.length === 0 && (
        <div className="state-box empty">
          <div className="empty-icon">🍽️</div>
          <p>No menu items yet. Add your first dish to get started.</p>
        </div>
      )}

      {!loading && visible.length > 0 && (
        <div className="emp-table-wrap">
          <table className="emp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Section</th>
                <th>Type</th>
                <th>Price</th>
                <th>Visible</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item, i) => (
                <tr key={item.menu_item_id}>
                  <td className="td-num">{i + 1}</td>
                  <td className="td-name">
                    {item.name}
                    {item.description && <div className="td-desc">{item.description}</div>}
                  </td>
                  <td>{item.section}</td>
                  <td>
                    <span className={`veg-badge ${item.type === 'veg' ? 'veg' : 'nonveg'}`}>
                      <span className="veg-dot" aria-hidden="true" />
                      {item.type === 'veg' ? 'Veg' : 'Non-Veg'}
                    </span>
                  </td>
                  <td className="td-salary">₹{item.price}</td>
                  <td>{item.is_available ? 'Yes' : 'No'}</td>
                  <td className="td-actions">
                    <button className="btn btn-sm btn-outline" onClick={() => setEditItem(item)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => setDeleteId(item.menu_item_id)}
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
        <Modal title="Add Menu Item" onClose={() => setShowAddModal(false)}>
          <MenuForm onSubmit={handleAdd} onCancel={() => setShowAddModal(false)} loading={saving} />
        </Modal>
      )}

      {editItem && (
        <Modal title="Edit Menu Item" onClose={() => setEditItem(null)}>
          <MenuForm
            initial={{
              name: editItem.name,
              description: editItem.description || '',
              price: editItem.price,
              type: editItem.type,
              section: editItem.section,
              is_available: editItem.is_available,
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditItem(null)}
            loading={saving}
          />
        </Modal>
      )}

      {deleteId && (
        <Modal title="Confirm Delete" onClose={() => setDeleteId(null)}>
          <p style={{ marginBottom: '20px', color: 'var(--default-color)' }}>
            Are you sure you want to delete this menu item? This action cannot be undone.
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
