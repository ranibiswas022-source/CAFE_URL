// src/pages/OrdersPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle2, Truck, XCircle, ChefHat } from 'lucide-react';
import { orderService } from '../services/api';
import type { Order, OrderStatus } from '../types';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  pending: { label: 'Pending', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: CheckCircle2 },
  preparing: { label: 'Preparing', color: 'text-gold bg-gold/10 border-gold/20', icon: ChefHat },
  out_for_delivery: { label: 'Out for Delivery', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: Truck },
  delivered: { label: 'Delivered', color: 'text-success bg-success/10 border-success/20', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: XCircle },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService.getHistory().then(data => {
      setOrders(data as Order[]);
      setIsLoading(false);
    }).catch(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-bg pt-24 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title mb-8">Order History</h1>
        </motion.div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={64} className="text-border mx-auto mb-6" />
            <h2 className="font-serif text-2xl text-white mb-3">No orders yet</h2>
            <p className="text-textSecondary mb-8">Start ordering your favorite items!</p>
            <Link to="/menu" className="btn-primary">Browse Menu</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const status = (order.status || 'confirmed') as OrderStatus;
              const cfg = statusConfig[status] || statusConfig.confirmed;
              const StatusIcon = cfg.icon;
              return (
                <motion.div
                  key={order.id || i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-surface border border-border rounded-sm p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-white font-bold font-serif text-lg">{order.id}</h3>
                      <p className="text-textSecondary text-sm mt-0.5">
                        {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : 'Recent order'}
                      </p>
                    </div>
                    <span className={`badge border px-3 py-1 text-xs font-medium flex items-center gap-1.5 ${cfg.color}`}>
                      <StatusIcon size={12} />
                      {cfg.label}
                    </span>
                  </div>

                  {order.items?.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <div className="space-y-2 mb-4">
                        {order.items.slice(0, 3).map((item, j) => (
                          <div key={j} className="flex justify-between text-sm">
                            <span className="text-textSecondary">{item.product.name} × {item.quantity}</span>
                            <span className="text-white">₹{item.product.price * item.quantity}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-textSecondary text-xs">+{order.items.length - 3} more items</p>
                        )}
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span className="text-textSecondary">Total</span>
                        <span className="text-gold font-serif text-lg">₹{order.total}</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
