// src/pages/CheckoutPage.tsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Loader2, MapPin, Phone, User, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';
import type { CheckoutForm } from '../types';

type Step = 'form' | 'processing' | 'confirmed';

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('form');
  const [orderId, setOrderId] = useState('');
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [form, setForm] = useState<CheckoutForm>({
    name: '', phone: '', address: '', notes: '',
  });

  if (items.length === 0 && step === 'form') {
    navigate('/cart');
    return null;
  }

  const validate = () => {
    const errs: Partial<CheckoutForm> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone)) errs.phone = 'Valid 10-digit phone required';
    if (!form.address.trim()) errs.address = 'Delivery address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStep('processing');
    try {
      const order = await orderService.create({ ...form, items, subtotal, deliveryFee, total });
      // Save to local history
      const prev = JSON.parse(localStorage.getItem('bb_orders') || '[]');
      localStorage.setItem('bb_orders', JSON.stringify([order, ...prev]));
      setOrderId((order as { id: string }).id);
      clearCart();
      setStep('confirmed');
    } catch {
      setStep('form');
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-bg pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Link to="/cart" className="inline-flex items-center gap-2 text-textSecondary hover:text-gold text-sm mb-8 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Cart
              </Link>
              <h1 className="section-title mb-8">Checkout</h1>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
                  <div className="bg-surface border border-border rounded-sm p-6 space-y-5">
                    <h2 className="text-white font-semibold">Delivery Information</h2>

                    {/* Name */}
                    <div>
                      <label className="text-textSecondary text-sm block mb-1.5">Full Name *</label>
                      <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
                        <input
                          id="checkout-name"
                          type="text"
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Your full name"
                          className={`input-field pl-9 ${errors.name ? 'border-red-500/50' : ''}`}
                        />
                      </div>
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-textSecondary text-sm block mb-1.5">Phone Number *</label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
                        <input
                          id="checkout-phone"
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          placeholder="10-digit mobile number"
                          maxLength={10}
                          className={`input-field pl-9 ${errors.phone ? 'border-red-500/50' : ''}`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="text-textSecondary text-sm block mb-1.5">Delivery Address *</label>
                      <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-3 text-textSecondary" />
                        <textarea
                          id="checkout-address"
                          value={form.address}
                          onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                          placeholder="Full delivery address with landmark"
                          rows={3}
                          className={`input-field pl-9 resize-none ${errors.address ? 'border-red-500/50' : ''}`}
                        />
                      </div>
                      {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-textSecondary text-sm block mb-1.5">Order Notes (optional)</label>
                      <div className="relative">
                        <FileText size={16} className="absolute left-3 top-3 text-textSecondary" />
                        <textarea
                          id="checkout-notes"
                          value={form.notes}
                          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                          placeholder="Special instructions, allergies..."
                          rows={2}
                          className="input-field pl-9 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gold/5 border border-gold/20 rounded-sm p-4">
                    <p className="text-gold text-sm font-medium mb-1">⚠️ Demo Mode</p>
                    <p className="text-textSecondary text-xs">
                      No real payment is processed. This is a simulated checkout for demonstration purposes only.
                    </p>
                  </div>

                  <button type="submit" id="place-order-btn" className="btn-primary w-full justify-center py-4 text-base">
                    Place Order (Demo) — ₹{total}
                  </button>
                </form>

                {/* Order summary */}
                <div className="lg:col-span-2">
                  <div className="bg-surface border border-border rounded-sm p-5 sticky top-24">
                    <h2 className="text-white font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
                      {items.map(item => (
                        <div key={item.product.id} className="flex items-center gap-3">
                          <img src={item.product.image} alt={item.product.name}
                            className="w-10 h-10 rounded-sm object-cover flex-shrink-0"
                            onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&q=80'; }} />
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate">{item.product.name}</p>
                            <p className="text-textSecondary text-xs">×{item.quantity}</p>
                          </div>
                          <span className="text-white text-sm font-semibold flex-shrink-0">₹{item.product.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
                      <div className="flex justify-between text-textSecondary">
                        <span>Subtotal</span><span className="text-white">₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between text-textSecondary">
                        <span>Delivery</span>
                        <span className={deliveryFee === 0 ? 'text-success' : 'text-white'}>
                          {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold text-base border-t border-border pt-2">
                        <span className="text-white">Total</span>
                        <span className="text-gold font-serif">₹{total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
            >
              <Loader2 size={48} className="text-gold animate-spin" />
              <h2 className="text-white font-serif text-2xl">Processing your order...</h2>
              <p className="text-textSecondary">Just a moment</p>
            </motion.div>
          )}

          {step === 'confirmed' && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 max-w-md mx-auto"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              >
                <CheckCircle2 size={80} className="text-success" />
              </motion.div>
              <div>
                <h2 className="font-serif text-4xl text-white mb-3">Order Confirmed!</h2>
                <p className="text-textSecondary mb-1">Your order <span className="text-gold font-semibold">{orderId}</span> has been placed successfully.</p>
                <p className="text-textSecondary text-sm">Estimated delivery: <span className="text-white">35–45 minutes</span></p>
              </div>
              <div className="flex gap-4 flex-wrap justify-center">
                <Link to="/orders" className="btn-primary">Track Order</Link>
                <Link to="/menu" className="btn-outline">Order More</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
