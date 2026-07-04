import { useState, useEffect, useMemo } from 'react';
import { api } from '@/shared/services/api.js';
import Modal from '@/shared/components/Modal.jsx';
import MenuForm from './MenuForm.jsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ALL = 'All';

function VegBadge({ type }) {
  const veg = type === 'veg';
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold ${
        veg ? 'text-[#1a7f37]' : 'text-[#c2272d]'
      }`}
    >
      <span className="relative inline-block size-3 rounded-[3px] border-[1.5px] border-current">
        <span className="absolute inset-[2px] rounded-full bg-current" />
      </span>
      {veg ? 'Veg' : 'Non-Veg'}
    </span>
  );
}

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
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Menu</h2>
          <p className="text-sm text-muted-foreground">
            Add, edit, or remove dishes shown on the website
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>+ Add Item</Button>
      </div>

      {!loading && !error && items.length > 0 && (
        <div className="mb-4 flex items-center gap-2.5">
          <Label htmlFor="section-filter" className="text-muted-foreground">
            Section
          </Label>
          <Select value={section} onValueChange={setSection}>
            <SelectTrigger id="section-filter" size="sm" className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sections.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
          <div className="size-8 animate-spin rounded-full border-[3px] border-border border-t-primary" />
          <p>Loading menu…</p>
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

      {!loading && !error && items.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <div className="text-4xl">🍽️</div>
          <p>No menu items yet. Add your first dish to get started.</p>
        </div>
      )}

      {!loading && visible.length > 0 && (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/60">
                <TableHead className="w-10">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Visible</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((item, i) => (
                <TableRow key={item.menu_item_id}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="max-w-80 whitespace-normal">
                    <div className="font-semibold text-foreground">{item.name}</div>
                    {item.description && (
                      <div className="mt-0.5 text-xs text-muted-foreground">{item.description}</div>
                    )}
                  </TableCell>
                  <TableCell>{item.section}</TableCell>
                  <TableCell>
                    <VegBadge type={item.type} />
                  </TableCell>
                  <TableCell className="font-semibold text-[color:var(--secondary-color)]">
                    ₹{item.price}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.is_available ? 'secondary' : 'outline'}>
                      {item.is_available ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditItem(item)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(item.menu_item_id)}
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
          <p className="mb-5 text-sm text-muted-foreground">
            Are you sure you want to delete this menu item? This action cannot be undone.
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
