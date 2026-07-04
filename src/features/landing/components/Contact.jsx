import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Camera, Send } from 'lucide-react';
import { HOTEL, HOURS } from '@/data/hotel.js';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  function handleSubmit(e) {
    e.preventDefault();
    // No message backend — compose an email the guest can send from their client.
    const subject = encodeURIComponent(`Enquiry from ${form.name || 'Guest'} — ${HOTEL.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\n\n${form.message}`,
    );
    window.location.href = `mailto:${HOTEL.email}?subject=${subject}&body=${body}`;
  }

  return (
    <section id="contact" className="lp-section lp-section--tint">
      <div className="lp-container">
        <div className="lp-section-head">
          <span className="lp-eyebrow">Contact Us</span>
          <h2 className="lp-heading">Visit us or drop a message</h2>
          <p>We'd love to serve you. Reach out for reservations, party orders, or directions.</p>
        </div>

        <div className="lp-contact-grid">
          <div className="lp-contact-info">
            <div className="lp-info-row">
              <div className="lp-info-icon">
                <MapPin />
              </div>
              <div>
                <h5>Address</h5>
                <p>
                  {HOTEL.address.line1}, {HOTEL.address.line2}, {HOTEL.address.city}
                </p>
              </div>
            </div>
            <div className="lp-info-row">
              <div className="lp-info-icon">
                <Phone />
              </div>
              <div>
                <h5>Phone</h5>
                <a href={`tel:+${HOTEL.phoneRaw}`}>{HOTEL.phone}</a>
              </div>
            </div>
            <div className="lp-info-row">
              <div className="lp-info-icon">
                <Mail />
              </div>
              <div>
                <h5>Email</h5>
                <a href={`mailto:${HOTEL.email}`}>{HOTEL.email}</a>
              </div>
            </div>
            <div className="lp-info-row">
              <div className="lp-info-icon">
                <Clock />
              </div>
              <div>
                <h5>Opening Hours</h5>
                {HOURS.map((h) => (
                  <p key={h.time}>{h.time}</p>
                ))}
              </div>
            </div>
            <div className="lp-info-row">
              <div className="lp-info-icon">
                <Camera />
              </div>
              <div>
                <h5>Instagram</h5>
                <a href={HOTEL.instagramUrl} target="_blank" rel="noreferrer">
                  {HOTEL.instagram}
                </a>
              </div>
            </div>
          </div>

          <form className="lp-form" onSubmit={handleSubmit}>
            <div className="field">
              <Label htmlFor="c-name">Your Name</Label>
              <Input
                id="c-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
                placeholder="e.g. Rahul Patil"
              />
            </div>
            <div className="field-row">
              <div className="field">
                <Label htmlFor="c-phone">Phone</Label>
                <Input
                  id="c-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  placeholder="+91…"
                />
              </div>
              <div className="field">
                <Label htmlFor="c-email">Email</Label>
                <Input
                  id="c-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  placeholder="you@email.com"
                />
              </div>
            </div>
            <div className="field">
              <Label htmlFor="c-msg">Message</Label>
              <Textarea
                id="c-msg"
                required
                value={form.message}
                onChange={(e) => setField('message', e.target.value)}
                placeholder="Table for 4 this Saturday evening…"
              />
            </div>
            <button type="submit" className="lp-btn lp-btn--red lp-btn--full">
              <Send />
              Send Message
            </button>
          </form>
        </div>

        <div className="lp-map">
          <iframe
            src={HOTEL.mapsEmbedUrl}
            title={`${HOTEL.name} location on Google Maps`}
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </section>
  );
}
