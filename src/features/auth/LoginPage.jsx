import { useState } from 'react';
import { LogIn, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import logoUrl from '@/assets/logo.png';
import { HOTEL } from '@/data/hotel.js';
import { useAuth } from './AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function LoginPage({ onSuccess, onBack }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      onSuccess?.();
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#faf3e2] via-[#f5f0e8] to-[#f8e3b0] p-5">
      <Card className="w-full max-w-md p-8">
        <button
          type="button"
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          onClick={onBack}
        >
          <ArrowLeft size={16} /> Back to site
        </button>

        <div className="flex flex-col items-center text-center">
          <img src={logoUrl} alt={HOTEL.name} className="size-16 rounded-xl object-contain" />
          <h1 className="mt-3 font-display text-2xl font-bold text-foreground">{HOTEL.name}</h1>
          <p className="text-sm text-muted-foreground">Staff Login</p>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid gap-1.5">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="username"
              required
              value={form.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={(e) => setField('password', e.target.value)}
                placeholder="••••••••"
                className="pr-10"
              />
              <button
                type="button"
                className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            <LogIn size={18} />
            {submitting ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Accounts are created by an administrator.
        </p>
      </Card>
    </div>
  );
}
