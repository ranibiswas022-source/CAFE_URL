// src/pages/MenuPage.tsx
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';
import type { Category } from '../types';

export default function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const filtered = useMemo(() => {
    let result = [...products];
    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory as Category);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some(t => t.includes(q))
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    const params: Record<string, string> = {};
    if (catId !== 'all') params.category = catId;
    if (searchQuery) params.search = searchQuery;
    setSearchParams(params, { replace: true });
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    const params: Record<string, string> = {};
    if (activeCategory !== 'all') params.category = activeCategory;
    if (val.trim()) params.search = val.trim();
    setSearchParams(params, { replace: true });
  };

  const clearAllFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSearchParams({}, { replace: true });
  };

  return (
    <main className="min-h-screen bg-bg pt-24">
      {/* Page header */}
      <div className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="eyebrow">Our Menu</p>
            <h1 className="section-title mb-2">
              Explore Our <span className="text-gradient-gold">Full Menu</span>
            </h1>
            <p className="text-textSecondary text-sm">
              {filtered.length} items available · Fresh daily
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" />
            <input
              id="menu-search"
              type="text"
              value={searchQuery}
              onChange={e => handleSearchChange(e.target.value)}
              placeholder="Search coffee, pizza, snacks..."
              className="input-field pl-9 pr-9"
            />
            {searchQuery && (
              <button onClick={() => handleSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-textSecondary hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <SlidersHorizontal size={14} className="text-textSecondary flex-shrink-0" />
            {categories.map(cat => (
              <button
                key={cat.id}
                id={`filter-${cat.id}`}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'bg-gold text-espresso shadow-gold'
                    : 'bg-surface border border-border text-textSecondary hover:border-gold/40 hover:text-white'
                }`}
              >
                {cat.label}
                <span className="ml-1 opacity-60">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4">☕</div>
              <h3 className="text-white font-serif text-xl mb-2">No items found</h3>
              <p className="text-textSecondary text-sm">Try adjusting your search or filters</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 btn-outline text-sm"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
