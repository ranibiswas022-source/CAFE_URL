// src/pages/ContactPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, Loader2, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setSent(true);
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-bg pt-24">
      <section className="bg-surface border-b border-border py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="eyebrow">Get in Touch</p>
            <h1 className="section-title">Contact <span className="text-gradient-gold">Us</span></h1>
            <p className="text-textSecondary mt-3">We'd love to hear from you. Reach out for orders, feedback, or just to say hi.</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div>
              <h2 className="text-white font-serif text-2xl font-bold mb-6">Visit Us</h2>
              {[
                { icon: MapPin, title: 'Address', content: '123 Café Street, Green Park\nNew Delhi — 110016' },
                { icon: Phone, title: 'Phone', content: '+91 12345 67890' },
                { icon: Mail, title: 'Email', content: 'hello@beanandbrew.com' },
              ].map(({ icon: Icon, title, content }) => (
                <div key={title} className="flex gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm mb-0.5">{title}</div>
                    <div className="text-textSecondary text-sm whitespace-pre-line">{content}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface border border-border rounded-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-gold" />
                <h3 className="text-white font-semibold">Opening Hours</h3>
              </div>
              {[
                { day: 'Monday – Friday', time: '7:00 AM – 10:00 PM' },
                { day: 'Saturday', time: '8:00 AM – 11:00 PM' },
                { day: 'Sunday', time: '9:00 AM – 9:00 PM' },
              ].map(({ day, time }) => (
                <div key={day} className="flex justify-between py-2 border-b border-border last:border-0">
                  <span className="text-textSecondary text-sm">{day}</span>
                  <span className="text-white text-sm font-medium">{time}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-16">
                <CheckCircle2 size={64} className="text-success" />
                <h3 className="font-serif text-2xl text-white">Message Sent!</h3>
                <p className="text-textSecondary">We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="btn-outline mt-2">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} id="contact-form" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-textSecondary text-sm block mb-1.5">Name</label>
                    <input id="contact-name" type="text" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name" required className="input-field" />
                  </div>
                  <div>
                    <label className="text-textSecondary text-sm block mb-1.5">Email</label>
                    <input id="contact-email" type="email" value={form.email}
                      onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com" required className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="text-textSecondary text-sm block mb-1.5">Subject</label>
                  <input id="contact-subject" type="text" value={form.subject}
                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                    placeholder="How can we help?" className="input-field" />
                </div>
                <div>
                  <label className="text-textSecondary text-sm block mb-1.5">Message</label>
                  <textarea id="contact-message" value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us more..." rows={6} required
                    className="input-field resize-none" />
                </div>
                <button type="submit" id="contact-submit" disabled={isLoading}
                  className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
                  {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
