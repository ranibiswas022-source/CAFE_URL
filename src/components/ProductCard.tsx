// src/components/ProductCard.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star
          key={star}
          size={12}
          className={star <= Math.round(rating) ? 'text-gold fill-gold' : 'text-border'}
        />
      ))}
    </div>
  );
}

export default function ProductCard({ product, variant: _variant = 'default' }: ProductCardProps) {
  const { addItem, removeItem, getItemQuantity } = useCart();
  const [imgError, setImgError] = useState(false);
  const qty = getItemQuantity(product.id);

  const fallbackImage = `https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80`;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="group bg-white rounded-sm overflow-hidden shadow-md hover:shadow-xl
                 transition-shadow duration-300 flex flex-col"
    >
      {/* Image */}
      <Link to={`/product/${product.id}`} className="relative overflow-hidden aspect-square block flex-shrink-0">
        <img
          src={imgError ? fallbackImage : (product.image || product.image_url || fallbackImage)}
          alt={product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.isPopular && (
          <div className="absolute top-2 left-2">
            <span className="bg-gold text-espresso text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
              Popular
            </span>
          </div>
        )}
        {product.preparationTime && (
          <div className="absolute bottom-2 right-2 glass-surface rounded-full px-2 py-1
                          flex items-center gap-1 text-[10px] text-white">
            <Clock size={10} />
            {product.preparationTime}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-serif font-bold text-espresso text-base leading-tight mb-1
                         hover:text-[#8B4513] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <StarRating rating={product.rating} />
          <span className="text-xs text-gray-500 font-medium">
            {product.rating} ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2">
          <div>
            <span className="text-espresso font-bold text-lg font-serif">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>

          {/* Cart controls */}
          {qty === 0 ? (
            <motion.button
              id={`add-to-cart-${product.id}`}
              whileTap={{ scale: 0.9 }}
              onClick={() => addItem(product)}
              className="w-8 h-8 rounded-full bg-espresso hover:bg-[#3a2018] text-white
                         flex items-center justify-center transition-all duration-200
                         shadow-md hover:shadow-lg active:scale-95"
              aria-label={`Add ${product.name} to cart`}
            >
              <Plus size={16} />
            </motion.button>
          ) : (
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => removeItem(product.id)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-espresso
                           flex items-center justify-center transition-colors duration-200"
                aria-label="Remove from cart"
              >
                <Minus size={12} />
              </motion.button>
              <motion.span
                key={qty}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="w-6 text-center font-bold text-espresso text-sm"
              >
                {qty}
              </motion.span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => addItem(product)}
                className="w-7 h-7 rounded-full bg-espresso hover:bg-[#3a2018] text-white
                           flex items-center justify-center transition-colors duration-200"
                aria-label="Add one more"
              >
                <Plus size={12} />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
