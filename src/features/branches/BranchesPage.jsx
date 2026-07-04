import { useState, useEffect, useCallback } from 'react';
import { api } from '@/shared/services/api.js';
import Modal from '@/shared/components/Modal.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Branches</h2>
          <p className="text-sm text-muted-foreground">Manage hotel branches / locations</p>
        </div>
        <Button onClick={openCreate}>+ Add Branch</Button>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
          <div className="size-8 animate-spin rounded-full border-[3px] border-border border-t-primary" />
          <p>Loading branches…</p>
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

      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/60">
                <TableHead className="w-10">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((b, i) => (
                <TableRow key={b.id}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-semibold text-foreground">{b.name}</TableCell>
                  <TableCell>{b.address || '—'}</TableCell>
                  <TableCell>
                    <Badge variant={b.is_active ? 'secondary' : 'outline'}>
                      {b.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(b)}>
                        Edit
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {branches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                    No branches yet. Add your first branch.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {showForm && (
        <Modal title={editBranch ? 'Edit Branch' : 'Add Branch'} onClose={() => setShowForm(false)}>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {formError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {formError}
              </div>
            )}

            <div className="grid gap-1.5">
              <Label htmlFor="b-name">Branch Name</Label>
              <Input
                id="b-name"
                required
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="e.g. Bhosari"
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="b-address">Address</Label>
              <Input
                id="b-address"
                value={form.address}
                onChange={(e) => setField('address', e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="mt-1 flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : editBranch ? 'Save Changes' : 'Create Branch'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
