import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Sections that already exist on the printed menu — offered as suggestions.
// The field is a free-text input, so admins can also create a brand-new section.
const KNOWN_SECTIONS = [
  'Mutton Starter',
  'Chicken Starter',
  'Other Starter',
  'Mutton Thali',
  'Mutton Dish',
  'Chicken Thali',
  'Chicken Dish',
  'Egg Thali',
  'Egg Dish',
  'Veg Dish',
  'Others',
  'Party Order',
];

const EMPTY = {
  name: '',
  description: '',
  price: '',
  type: 'veg',
  section: '',
  is_available: true,
};

export default function MenuForm({ initial = EMPTY, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!String(form.price).trim()) e.price = 'Price is required';
    if (!form.section.trim()) e.section = 'Section is required';
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      price: String(form.price).trim(),
      type: form.type,
      section: form.section.trim(),
      is_available: form.is_available,
    });
  }

  function set(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: '' }));
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-1.5">
        <Label htmlFor="menu-name">Item Name *</Label>
        <Input
          id="menu-name"
          placeholder="e.g. Mutton Sukkha"
          value={form.name}
          onChange={(e) => set('name', e.target.value)}
        />
        {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="menu-desc">Description</Label>
        <Textarea
          id="menu-desc"
          rows={2}
          placeholder="e.g. Mutton Sukkha, Rassa, Indrayani Rice, 2 Bhakri/Chapati"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="menu-price">Price (₹) *</Label>
          <Input
            id="menu-price"
            placeholder="e.g. 270 or 580/950"
            value={form.price}
            onChange={(e) => set('price', e.target.value)}
          />
          {errors.price ? (
            <span className="text-xs text-destructive">{errors.price}</span>
          ) : (
            <span className="text-[11px] text-muted-foreground">
              Use a slash for half/full, e.g. 580/950.
            </span>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="menu-type">Type *</Label>
          <Select value={form.type} onValueChange={(v) => set('type', v)}>
            <SelectTrigger id="menu-type" className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="veg">Veg</SelectItem>
              <SelectItem value="non-veg">Non-Veg</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="menu-section">Section *</Label>
        <Input
          id="menu-section"
          list="menu-sections"
          placeholder="e.g. Mutton Starter"
          value={form.section}
          onChange={(e) => set('section', e.target.value)}
        />
        <datalist id="menu-sections">
          {KNOWN_SECTIONS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        {errors.section && <span className="text-xs text-destructive">{errors.section}</span>}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="menu-available"
          checked={form.is_available}
          onCheckedChange={(v) => set('is_available', v === true)}
        />
        <Label htmlFor="menu-available" className="font-normal">
          Show on website
        </Label>
      </div>

      <div className="mt-1 flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save Item'}
        </Button>
      </div>
    </form>
  );
}
