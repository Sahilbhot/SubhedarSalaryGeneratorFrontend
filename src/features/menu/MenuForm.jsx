import { useState } from 'react';

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

  function field(name) {
    return {
      value: form[name],
      onChange: (ev) => {
        setForm((f) => ({ ...f, [name]: ev.target.value }));
        setErrors((e) => ({ ...e, [name]: '' }));
      },
    };
  }

  return (
    <form className="emp-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label>Item Name *</label>
        <input type="text" placeholder="e.g. Mutton Sukkha" {...field('name')} />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="field">
        <label>Description</label>
        <textarea
          rows={2}
          placeholder="e.g. Mutton Sukkha, Rassa, Indrayani Rice, 2 Bhakri/Chapati"
          {...field('description')}
        />
      </div>

      <div className="field">
        <label>Price (₹) *</label>
        <input type="text" placeholder="e.g. 270 or 580/950" {...field('price')} />
        {errors.price && <span className="field-error">{errors.price}</span>}
        <span className="field-hint">Use a slash for half/full prices, e.g. 580/950.</span>
      </div>

      <div className="field">
        <label>Type *</label>
        <select {...field('type')}>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
        </select>
      </div>

      <div className="field">
        <label>Section *</label>
        <input
          type="text"
          list="menu-sections"
          placeholder="e.g. Mutton Starter"
          {...field('section')}
        />
        <datalist id="menu-sections">
          {KNOWN_SECTIONS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
        {errors.section && <span className="field-error">{errors.section}</span>}
      </div>

      <div className="field field-checkbox">
        <label>
          <input
            type="checkbox"
            checked={form.is_available}
            onChange={(ev) => setForm((f) => ({ ...f, is_available: ev.target.checked }))}
          />
          Show on website
        </label>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Save Item'}
        </button>
      </div>
    </form>
  );
}
