import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { api } from '@/shared/services/api.js';
import Modal from '@/shared/components/Modal.jsx';
import MenuForm from './MenuForm.jsx';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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

// Prices are free text ("270", "580/950"); use the first number for sort/filter.
function priceNum(p) {
  const m = String(p ?? '').match(/\d+/);
  return m ? Number(m[0]) : 0;
}

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
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all | veg | non-veg
  const [visibleFilter, setVisibleFilter] = useState('all'); // all | yes | no
  const [sort, setSort] = useState('default'); // default | asc | desc
  const [maxPrice, setMaxPrice] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = useCallback(async (searchTerm) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getMenuItems(searchTerm ? { search: searchTerm } : undefined);
      setItems(res.data || []);
    } catch {
      setError('Failed to load menu items. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced fetch: runs on mount (empty search) and whenever the query changes.
  useEffect(() => {
    const t = setTimeout(() => load(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search, load]);

  const sections = useMemo(
    () => [ALL, ...Array.from(new Set(items.map((i) => i.section)))],
    [items],
  );
  const anyFilterActive =
    section !== ALL ||
    typeFilter !== 'all' ||
    visibleFilter !== 'all' ||
    sort !== 'default' ||
    maxPrice !== '';

  function resetFilters() {
    setSection(ALL);
    setTypeFilter('all');
    setVisibleFilter('all');
    setSort('default');
    setMaxPrice('');
  }

  const visible = useMemo(() => {
    let list = items;
    if (section !== ALL) list = list.filter((i) => i.section === section);
    if (typeFilter !== 'all') list = list.filter((i) => i.type === typeFilter);
    if (visibleFilter !== 'all')
      list = list.filter((i) => (visibleFilter === 'yes' ? i.is_available : !i.is_available));
    if (maxPrice !== '' && !isNaN(Number(maxPrice)))
      list = list.filter((i) => priceNum(i.price) <= Number(maxPrice));
    if (sort === 'asc') list = [...list].sort((a, b) => priceNum(a.price) - priceNum(b.price));
    else if (sort === 'desc') list = [...list].sort((a, b) => priceNum(b.price) - priceNum(a.price));
    return list;
  }, [items, section, typeFilter, visibleFilter, maxPrice, sort]);

  async function handleAdd(data) {
    setSaving(true);
    try {
      await api.createMenuItem(data);
      setShowAddModal(false);
      load(search.trim());
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
      load(search.trim());
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
      load(search.trim());
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

      {!error && (items.length > 0 || search.trim()) && (
        <div className="mb-4 flex flex-wrap items-center gap-2.5">
          {/* Search (type=text so browsers don't add a second native clear button) */}
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search name, description, section…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-8"
              aria-label="Search menu items"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <Select value={section} onValueChange={setSection}>
            <SelectTrigger size="sm" className="w-44" aria-label="Filter by section">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sections.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === ALL ? 'All sections' : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger size="sm" className="w-32" aria-label="Filter by type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="veg">Veg</SelectItem>
              <SelectItem value="non-veg">Non-Veg</SelectItem>
            </SelectContent>
          </Select>

          <Select value={visibleFilter} onValueChange={setVisibleFilter}>
            <SelectTrigger size="sm" className="w-36" aria-label="Filter by visibility">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All visibility</SelectItem>
              <SelectItem value="yes">Visible</SelectItem>
              <SelectItem value="no">Hidden</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger size="sm" className="w-40" aria-label="Sort by price">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Sort: default</SelectItem>
              <SelectItem value="asc">Price: low → high</SelectItem>
              <SelectItem value="desc">Price: high → low</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-28">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
              ₹
            </span>
            <Input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="h-8 pl-6"
              aria-label="Maximum price"
            />
          </div>

          {anyFilterActive && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              Clear filters
            </Button>
          )}
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
          <Button variant="ghost" size="sm" onClick={() => load(search.trim())}>
            Retry
          </Button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <div className="text-4xl">🍽️</div>
          {search.trim() ? (
            <p>
              No items match “{search.trim()}”.{' '}
              <button
                type="button"
                className="text-foreground underline underline-offset-2"
                onClick={() => setSearch('')}
              >
                Clear search
              </button>
            </p>
          ) : (
            <p>No menu items yet. Add your first dish to get started.</p>
          )}
        </div>
      )}

      {!loading && !error && items.length > 0 && visible.length === 0 && (
        <div className="py-10 text-center text-sm text-muted-foreground">
          No items match the current filters.{' '}
          <button
            type="button"
            className="text-foreground underline underline-offset-2"
            onClick={resetFilters}
          >
            Clear filters
          </button>
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
