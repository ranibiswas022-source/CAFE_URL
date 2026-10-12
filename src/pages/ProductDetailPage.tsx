// src/pages/ProductDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Minus, Plus, ShoppingCart, Tag } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = products.find(p => p.id === id) || null;
  const [imgError, setImgError] = useState(false);
  const { addItem, removeItem, getItemQuantity } = useCart();
  const qty = product ? getItemQuantity(product.id) : 0;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const related = products.filter(p => p.id !== id && p.category === product?.category).slice(0, 4);

  if (!product) {
    return (
      <main className="min-h-screen bg-bg pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">☕</div>
          <h2 className="text-white font-serif text-2xl mb-2">Product not found</h2>
          <Link to="/menu" className="btn-primary mt-4">Back to Menu</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <Link to="/menu" className="inline-flex items-center gap-2 text-textSecondary hover:text-gold
                                    transition-colors text-sm mb-8 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to Menu
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-sm aspect-square"
          >
            <img
              src={imgError ? 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80' : product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="badge bg-gold/10 text-gold border border-gold/20 uppercase text-[10px] tracking-wider">
                  {product.category}
                </span>
                {product.isPopular && (
                  <span className="badge bg-success/10 text-success border border-success/20 text-[10px]">
                    Popular
                  </span>
                )}
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-white mb-3">
                {product.name}
              </h1>
              <p className="text-textSecondary leading-relaxed">{product.description}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={16} className={s <= Math.round(product.rating) ? 'text-gold fill-gold' : 'text-border'} />
                ))}
              </div>
              <span className="text-white font-semibold">{product.rating}</span>
              <span className="text-textSecondary text-sm">({product.reviewCount} reviews)</span>
            </div>

            {/* Meta */}
            <div className="flex items-center gap-6">
              {product.preparationTime && (
                <div className="flex items-center gap-2 text-textSecondary text-sm">
                  <Clock size={14} className="text-gold" />
                  {product.preparationTime}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={14} className="text-textSecondary" />
              {product.tags.map(tag => (
                <span key={tag} className="badge bg-surface border border-border text-textSecondary text-xs px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>

            {/* Price and cart */}
            <div className="border-t border-border pt-6">
              <div className="flex items-center justify-between mb-6">
                <span className="font-serif text-4xl font-bold text-gold">₹{product.price}</span>
                {!product.isAvailable && (
                  <span className="text-red-400 text-sm">Currently unavailable</span>
                )}
              </div>
              {product.isAvailable && (
                <div className="flex items-center gap-4">
                  {qty === 0 ? (
                    <button
                      id="detail-add-cart"
                      onClick={() => addItem(product)}
                      className="btn-primary flex-1 justify-center py-4"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-3 bg-surface border border-border rounded-sm px-4 py-3">
                        <button onClick={() => removeItem(product.id)} className="text-gold hover:text-white transition-colors">
                          <Minus size={18} />
                        </button>
                        <span className="text-white font-bold text-lg w-8 text-center">{qty}</span>
                        <button onClick={() => addItem(product)} className="text-gold hover:text-white transition-colors">
                          <Plus size={18} />
                        </button>
                      </div>
                      <Link to="/cart" className="btn-outline flex-1 justify-center">
                        View Cart
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="section-title mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
