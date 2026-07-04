import { useState, useEffect, useCallback } from 'react';
import { api } from '@/shared/services/api.js';
import Modal from '@/shared/components/Modal.jsx';
import { ROLES, ROLE_LABELS, BRANCH_SCOPED_ROLES } from '@/shared/constants/roles.js';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
      branch_id: user.branch_id != null ? String(user.branch_id) : '',
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
    <div>
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Users</h2>
          <p className="text-sm text-muted-foreground">Manage staff accounts and roles</p>
        </div>
        <Button onClick={openCreate}>+ Add User</Button>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
          <div className="size-8 animate-spin rounded-full border-[3px] border-border border-t-primary" />
          <p>Loading users…</p>
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
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u, i) => (
                <TableRow key={u.id}>
                  <TableCell className="text-muted-foreground">{i + 1}</TableCell>
                  <TableCell className="font-semibold text-foreground">{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{ROLE_LABELS[u.role] || u.role}</TableCell>
                  <TableCell>
                    {u.role === ROLES.ADMIN ? 'All branches' : branchName(u.branch_id)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.is_active ? 'secondary' : 'outline'}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEdit(u)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => toggleStatus(u)}>
                        {u.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-6 text-center text-muted-foreground">
                    No users yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {showForm && (
        <Modal title={editUser ? 'Edit User' : 'Add User'} onClose={() => setShowForm(false)}>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {formError && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {formError}
              </div>
            )}

            <div className="grid gap-1.5">
              <Label htmlFor="u-name">Full Name</Label>
              <Input
                id="u-name"
                required
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="u-email">Email</Label>
              <Input
                id="u-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
              />
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="u-password">
                Password
                {editUser && (
                  <span className="font-normal text-muted-foreground"> (leave blank to keep)</span>
                )}
              </Label>
              <Input
                id="u-password"
                type="password"
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
                placeholder={editUser ? '••••••••' : 'At least 6 characters'}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="u-role">Role</Label>
                <Select value={form.role} onValueChange={(v) => setField('role', v)}>
                  <SelectTrigger id="u-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ROLES).map((r) => (
                      <SelectItem key={r} value={r}>
                        {ROLE_LABELS[r]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="u-branch">Branch {branchScoped ? '' : '(admin = all)'}</Label>
                <Select
                  value={form.branch_id}
                  onValueChange={(v) => setField('branch_id', v)}
                  disabled={!branchScoped}
                >
                  <SelectTrigger id="u-branch" className="w-full">
                    <SelectValue placeholder={branchScoped ? 'Select a branch…' : 'All branches'} />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                {saving ? 'Saving…' : editUser ? 'Save Changes' : 'Create User'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
