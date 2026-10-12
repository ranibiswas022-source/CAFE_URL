// src/pages/CartPage.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, itemCount, subtotal, deliveryFee, total, updateQuantity, removeItem } = useCart();

  if (itemCount === 0) {
    return (
      <main className="min-h-screen bg-bg pt-24 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <ShoppingBag size={64} className="text-border mx-auto mb-6" />
          <h2 className="font-serif text-3xl text-white mb-3">Your cart is empty</h2>
          <p className="text-textSecondary mb-8">Add some delicious items from our menu to get started!</p>
          <Link to="/menu" className="btn-primary">Browse Menu</Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg pt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title mb-8">
            Your Cart <span className="text-gold text-2xl font-sans font-normal">({itemCount} items)</span>
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-surface border border-border rounded-sm p-4 flex gap-4"
                >
                  <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-sm object-cover"
                      onError={e => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&q=80'; }}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.id}`}>
                      <h3 className="text-white font-semibold hover:text-gold transition-colors line-clamp-1">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-textSecondary text-xs mt-0.5 capitalize">{item.product.category}</p>
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity */}
                      <div className="flex items-center gap-2 bg-bg border border-border rounded-sm">
                        <button
                          id={`cart-dec-${item.product.id}`}
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-textSecondary hover:text-gold transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-8 text-center text-white font-medium text-sm">{item.quantity}</span>
                        <button
                          id={`cart-inc-${item.product.id}`}
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-textSecondary hover:text-gold transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-bold font-serif">₹{item.product.price * item.quantity}</span>
                        <button
                          id={`cart-remove-${item.product.id}`}
                          onClick={() => removeItem(item.product.id)}
                          className="text-textSecondary hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <Link to="/menu" className="btn-ghost flex items-center gap-2 mt-4">
              ← Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-surface border border-border rounded-sm p-6 sticky top-24">
              <h2 className="text-white font-semibold text-lg mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-textSecondary">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="text-white">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-textSecondary">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-success font-medium' : 'text-white'}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <div className="flex items-center gap-1.5 bg-gold/5 border border-gold/15 rounded-sm p-2.5">
                    <Tag size={12} className="text-gold flex-shrink-0" />
                    <p className="text-gold text-xs">Add ₹{999 - subtotal} more for free delivery!</p>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-gold font-bold text-xl font-serif">₹{total}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                id="proceed-checkout-btn"
                className="btn-primary w-full justify-center py-4"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </Link>

              <div className="mt-4 text-center">
                <p className="text-textSecondary text-xs">🔒 Secure checkout — Demo mode active</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
