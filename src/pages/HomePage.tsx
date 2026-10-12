// src/pages/HomePage.tsx
// Ultra-premium, modern Cafe Home Page connected to live Cafe REST API
// Live Backend: https://cafe-rest-api-srja.onrender.com

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import {
  ArrowRight, Star, Clock, Plus, Minus, Search, X, Check,
  Sparkles, Coffee, Utensils, Heart, RefreshCw, Eye
} from 'lucide-react';
import type { Product, ApiHealthResponse } from '../types';
import { cafeApi } from '../services/api';
import { useCart } from '../context/CartContext';

// Floating coffee bean SVG decoration
function CoffeeBeanSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <ellipse cx="20" cy="20" rx="14" ry="10" fill="#4B2E20" opacity="0.8" transform="rotate(-30 20 20)" />
      <ellipse cx="20" cy="20" rx="14" ry="10" fill="none" stroke="#6B4020" strokeWidth="0.8" transform="rotate(-30 20 20)" />
      <path d="M20 12 Q24 20 20 28" stroke="#6B4020" strokeWidth="1.2" fill="none" transform="rotate(-30 20 20)" />
    </svg>
  );
}

// Background Floating Beans
function FloatingBeans() {
  const beans = [
    { x: '10%', y: '20%', size: 36, delay: 0, duration: 8 },
    { x: '85%', y: '15%', size: 30, delay: 1.2, duration: 7 },
    { x: '6%', y: '65%', size: 26, delay: 2, duration: 9 },
    { x: '92%', y: '70%', size: 34, delay: 0.5, duration: 8.5 },
    { x: '50%', y: '6%', size: 22, delay: 1.8, duration: 6.5 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {beans.map((bean, i) => (
        <motion.div
          key={i}
          className="absolute opacity-25"
          style={{ left: bean.x, top: bean.y, width: bean.size, height: bean.size }}
          animate={{
            y: [0, -18, 0],
            rotate: [0, 15, -12, 0],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: bean.duration,
            delay: bean.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <CoffeeBeanSVG className="w-full h-full" />
        </motion.div>
      ))}
    </div>
  );
}

// Scroll reveal animation wrapper
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Category icon helper
function getCategoryIcon(cat: string) {
  const lower = cat.toLowerCase();
  if (lower.includes('coffee') || lower.includes('hot') || lower.includes('cold')) {
    return <Coffee size={15} />;
  }
  if (lower.includes('dessert') || lower.includes('cake')) {
    return <Sparkles size={15} />;
  }
  return <Utensils size={15} />;
}

export default function HomePage() {
  const { addItem, removeItem, getItemQuantity } = useCart();

  // State: API Health & Live Data
  const [health, setHealth] = useState<ApiHealthResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<'checking' | 'online' | 'fallback'>('checking');
  const [categories, setCategories] = useState<string[]>(['All', 'Hot Coffee', 'Cold Coffee', 'Bakery', 'Dessert']);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isLoadingModalDetails, setIsLoadingModalDetails] = useState<boolean>(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Parallax & Hero Motion
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroImgY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 75, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 75, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX / innerWidth - 0.5);
      mouseY.set(e.clientY / innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Check Backend Health & Fetch Categories on mount
  useEffect(() => {
    let isMounted = true;

    cafeApi.checkHealth()
      .then(res => {
        if (isMounted) {
          setHealth(res);
          setHealthStatus('online');
        }
      })
      .catch(() => {
        if (isMounted) {
          setHealthStatus('fallback');
        }
      });

    cafeApi.getCategories()
      .then(cats => {
        if (isMounted && cats.length > 0) {
          setCategories(['All', ...cats]);
        }
      })
      .catch(() => {
        // Fallback default categories already set
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Products based on Category & Search
  const fetchProducts = useCallback(async (cat: string, search: string) => {
    setIsLoadingProducts(true);
    try {
      const categoryParam = cat === 'All' ? undefined : cat;
      const data = await cafeApi.getMenu(categoryParam, search);
      setProducts(data);
    } catch {
      // Fallback handled in service layer
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  // Fetch on category or search change with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(selectedCategory, searchQuery);
    }, 280);

    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, fetchProducts]);

  // Handle Quick View Modal
  const handleOpenDetailModal = async (product: Product) => {
    setSelectedProductForModal(product);
    setIsLoadingModalDetails(true);
    try {
      const freshDetail = await cafeApi.getMenuItemById(product.id);
      setSelectedProductForModal(freshDetail);
    } catch {
      // Keep existing data
    } finally {
      setIsLoadingModalDetails(false);
    }
  };

  // Add to cart with feedback toast
  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addItem(product);
    setAddedToast(product.name);
    setTimeout(() => {
      setAddedToast(prev => (prev === product.name ? null : prev));
    }, 2400);
  };

  // Featured recommendation item (pick top rated or first from backend)
  const featuredItem = products.length > 0
    ? [...products].sort((a, b) => b.rating - a.rating)[0]
    : null;

  return (
    <main className="bg-bg text-textPrimary relative min-h-screen">
      {/* Toast Notification */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-surface/95 border border-gold/40 text-white
                       px-5 py-3.5 rounded-lg shadow-2xl backdrop-blur-xl flex items-center gap-3"
          >
            <div className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold">
              <Check size={16} />
            </div>
            <div>
              <p className="text-xs text-textSecondary">Added to your order</p>
              <p className="text-sm font-semibold text-white">{addedToast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex items-center overflow-hidden pt-20 pb-16"
        style={{
          background: 'radial-gradient(ellipse at top, #141A24 0%, #080B0F 65%, #05070A 100%)',
        }}
      >
        <FloatingBeans />

        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-700/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* LEFT COLUMN: Hero Copy & Actions */}
            <motion.div style={{ opacity: heroOpacity }} className="lg:col-span-7 space-y-6 md:space-y-8">
              {/* Server Live Status Pill */}
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full
                           bg-surface/80 border border-white/10 backdrop-blur-md shadow-sm"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      healthStatus === 'online'
                        ? 'bg-emerald-400'
                        : healthStatus === 'checking'
                        ? 'bg-amber-400'
                        : 'bg-orange-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      healthStatus === 'online'
                        ? 'bg-emerald-500'
                        : healthStatus === 'checking'
                        ? 'bg-amber-500'
                        : 'bg-orange-500'
                    }`}
                  />
                </span>
                <span className="text-xs font-medium text-textSecondary">
                  {healthStatus === 'online'
                    ? `Live Backend Active • ${health?.version || 'v1.0.0'} Connected`
                    : healthStatus === 'checking'
                    ? 'Connecting to Render Backend...'
                    : 'Backend Fallback Active'}
                </span>
                <span className="text-[10px] text-gold/80 px-1.5 py-0.5 rounded bg-gold/10 font-mono">
                  REST API
                </span>
              </motion.div>

              {/* Eyebrow & Title */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-px w-8 bg-gold" />
                  <span className="text-xs uppercase tracking-[0.25em] text-gold font-semibold">
                    Artisanal Cafe & Bakery
                  </span>
                </div>
                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.08] tracking-tight">
                  <span className="text-white block">Crafted Flavors,</span>
                  <span className="text-gradient-gold block">Pure Moments.</span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-textSecondary text-base sm:text-lg leading-relaxed max-w-xl">
                Experience freshly pulled espresso, velvety lattes, and artisan French pastries.
                Every dish is crafted in real-time with authentic ingredients and brought fresh to your table.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  href="#menu-showcase"
                  id="hero-explore-menu-btn"
                  className="btn-primary px-8 py-3.5 text-sm inline-flex items-center gap-2 group shadow-lg"
                >
                  <span>Explore Menu</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>

                {featuredItem && (
                  <button
                    type="button"
                    onClick={() => handleOpenDetailModal(featuredItem)}
                    id="hero-chef-pick-btn"
                    className="btn-outline px-7 py-3.5 text-sm inline-flex items-center gap-2 group"
                  >
                    <Sparkles size={15} className="text-gold group-hover:rotate-12 transition-transform" />
                    <span>Chef&apos;s Pick: {featuredItem.name}</span>
                  </button>
                )}
              </div>

              {/* Live Metric Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/60 max-w-md">
                <div>
                  <div className="text-white font-serif font-bold text-xl md:text-2xl">4.9 ★</div>
                  <div className="text-textSecondary text-xs">Customer Rating</div>
                </div>
                <div>
                  <div className="text-white font-serif font-bold text-xl md:text-2xl">100%</div>
                  <div className="text-textSecondary text-xs">Arabica Beans</div>
                </div>
                <div>
                  <div className="text-white font-serif font-bold text-xl md:text-2xl">Under 8m</div>
                  <div className="text-textSecondary text-xs">Fast Prep Time</div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Interactive 3D Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 flex justify-center"
            >
              <motion.div
                style={{ y: heroImgY, rotateX, rotateY, transformPerspective: 1200 }}
                className="relative w-full max-w-md"
              >
                {/* Glow ring */}
                <div className="absolute inset-0 bg-gold/15 rounded-3xl blur-3xl scale-95" />

                {/* Main Visual Card */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-surface shadow-2xl">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src="/images/hero_cappuccino.jpg"
                      alt="Artisanal cappuccino with fine latte art"
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent" />
                  </div>

                  <div className="p-5 bg-surface/90 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-wider text-gold font-semibold">
                        Signature Brew
                      </span>
                      <div className="flex items-center gap-1 text-gold text-xs font-bold">
                        <Star size={13} className="fill-gold" />
                        <span>4.9 / 5.0</span>
                      </div>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white mb-1">
                      Creamy Cappuccino & Latte Art
                    </h3>
                    <p className="text-xs text-textSecondary leading-relaxed">
                      Silky textured whole milk paired with double-origin espresso.
                    </p>
                  </div>

                  {/* Floating badge top right */}
                  <div className="absolute top-4 right-4 glass-surface rounded-full px-3 py-1 text-[11px] font-medium text-white flex items-center gap-1.5 border border-white/15 shadow-md">
                    <Clock size={12} className="text-gold" />
                    <span>Fresh & Hot</span>
                  </div>
                </div>

                {/* Floating badge bottom left */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-5 -left-5 bg-surface/95 border border-gold/30 rounded-xl p-3.5 shadow-2xl flex items-center gap-3 backdrop-blur-xl"
                >
                  <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center text-gold">
                    <Coffee size={20} />
                  </div>
                  <div>
                    <div className="text-white text-xs font-bold">Freshly Brewed</div>
                    <div className="text-textSecondary text-[10px]">100% Organic Beans</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. LIVE MENU SHOWCASE & FOOD GALLERY (BACKEND CONNECTED) */}
      {/* ========================================================================= */}
      <section id="menu-showcase" className="py-20 bg-cream text-espresso relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Heading */}
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <div className="flex items-center gap-2 text-espresso/70 text-xs uppercase tracking-widest font-semibold mb-2">
                  <Sparkles size={14} className="text-amber-800" />
                  <span>Fresh from the Kitchen</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-espresso leading-tight">
                  Explore Our Menu
                </h2>
                <p className="text-espresso/70 text-sm sm:text-base mt-2 max-w-xl">
                  Loaded live from our kitchen database. Filter by category or search your favorite beverage and pastry.
                </p>
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full md:w-80">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-espresso/40" />
                <input
                  type="text"
                  id="menu-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search coffee, bakery, desserts..."
                  className="w-full pl-10 pr-9 py-2.5 bg-white border border-espresso/15 rounded-full text-sm text-espresso
                             placeholder:text-espresso/40 focus:outline-none focus:border-amber-700/60 shadow-sm transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-espresso/40 hover:text-espresso"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>
          </Reveal>

          {/* Category Filter Pills (Dynamically loaded from /api/menu/categories) */}
          <Reveal delay={0.1}>
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    id={`category-tab-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap shadow-sm ${
                      isSelected
                        ? 'bg-espresso text-cream shadow-md scale-105'
                        : 'bg-white text-espresso/80 hover:bg-white/80 hover:text-espresso border border-espresso/10'
                    }`}
                  >
                    {getCategoryIcon(cat)}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Products Grid */}
          {isLoadingProducts ? (
            /* Loading Skeletons */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-white rounded-xl overflow-hidden shadow-sm border border-espresso/5 animate-pulse">
                  <div className="aspect-[4/3] bg-espresso/10" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-espresso/15 rounded w-3/4" />
                    <div className="h-3 bg-espresso/10 rounded w-full" />
                    <div className="h-3 bg-espresso/10 rounded w-1/2" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-5 bg-espresso/15 rounded w-16" />
                      <div className="w-8 h-8 rounded-full bg-espresso/15" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 bg-white/70 rounded-2xl border border-espresso/10">
              <div className="w-16 h-16 rounded-full bg-espresso/10 flex items-center justify-center mx-auto mb-4 text-espresso/60">
                <Coffee size={28} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-espresso mb-2">No Items Found</h3>
              <p className="text-espresso/70 text-sm max-w-md mx-auto mb-6">
                We couldn&apos;t find any item matching &ldquo;{searchQuery}&rdquo; in {selectedCategory}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="btn-primary"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Food Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, idx) => {
                const qty = getItemQuantity(product.id);
                const displayPrice = `$${Number(product.price).toFixed(2)}`;

                return (
                  <Reveal key={product.id} delay={Math.min(idx * 0.05, 0.3)}>
                    <div
                      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl
                                 transition-all duration-300 border border-espresso/5 flex flex-col h-full relative"
                    >
                      {/* Product Image */}
                      <div
                        className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-espresso/5"
                        onClick={() => handleOpenDetailModal(product)}
                      >
                        <img
                          src={product.image || product.image_url}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=500';
                          }}
                        />

                        {/* Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="bg-espresso/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {product.category}
                          </span>
                        </div>

                        {/* Quick View Button on Hover */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDetailModal(product);
                          }}
                          className="absolute inset-0 bg-espresso/30 opacity-0 group-hover:opacity-100
                                     transition-opacity duration-200 flex items-center justify-center gap-2 text-white text-xs font-semibold"
                          aria-label={`View details of ${product.name}`}
                        >
                          <span className="bg-espresso/90 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-sm shadow-md">
                            <Eye size={14} />
                            Quick Details
                          </span>
                        </button>

                        {/* Rating pill */}
                        <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 text-[11px] font-bold text-espresso shadow">
                          <Star size={11} className="text-amber-500 fill-amber-500" />
                          <span>{Number(product.rating).toFixed(1)}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex flex-col flex-1">
                        <div
                          className="cursor-pointer mb-2"
                          onClick={() => handleOpenDetailModal(product)}
                        >
                          <h3 className="font-serif font-bold text-espresso text-lg leading-snug group-hover:text-amber-800 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-xs text-espresso/65 line-clamp-2 mt-1 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        {/* Price and Cart Action */}
                        <div className="flex items-center justify-between mt-auto pt-3 border-t border-espresso/5">
                          <div>
                            <span className="text-xs text-espresso/50 block font-sans">Price</span>
                            <span className="font-serif font-bold text-xl text-espresso">
                              {displayPrice}
                            </span>
                          </div>

                          {/* Cart Quantity Controls */}
                          {qty === 0 ? (
                            <motion.button
                              whileTap={{ scale: 0.92 }}
                              onClick={(e) => handleAddToCart(product, e)}
                              id={`add-btn-${product.id}`}
                              className="inline-flex items-center gap-1.5 bg-espresso hover:bg-[#341d13] text-cream
                                         px-3.5 py-2 rounded-lg text-xs font-semibold shadow-md hover:shadow-lg transition-all"
                              aria-label={`Add ${product.name} to order`}
                            >
                              <Plus size={14} />
                              <span>Add</span>
                            </motion.button>
                          ) : (
                            <div className="flex items-center gap-2 bg-espresso/5 rounded-lg p-1 border border-espresso/10">
                              <button
                                type="button"
                                onClick={() => removeItem(product.id)}
                                className="w-6 h-6 rounded-md bg-white hover:bg-espresso/10 text-espresso flex items-center justify-center transition-colors shadow-xs"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="font-bold text-espresso text-xs w-4 text-center">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => addItem(product)}
                                className="w-6 h-6 rounded-md bg-espresso hover:bg-[#341d13] text-white flex items-center justify-center transition-colors shadow-xs"
                                aria-label="Increase quantity"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SIGNATURE SPOTLIGHT (CHEF'S RECOMMENDATION) */}
      {/* ========================================================================= */}
      {featuredItem && (
        <section className="py-20 bg-surface relative overflow-hidden border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <Reveal>
              <div className="relative rounded-2xl overflow-hidden border border-gold/30 bg-gradient-to-r from-bg via-surface to-bg p-8 sm:p-12 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 space-y-5">
                    <div className="inline-flex items-center gap-2 bg-gold/15 text-gold border border-gold/30 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                      <Sparkles size={14} />
                      <span>Today&apos;s Signature Pick</span>
                    </div>

                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                      {featuredItem.name}
                    </h2>

                    <p className="text-textSecondary text-sm sm:text-base leading-relaxed max-w-xl">
                      {featuredItem.description} Sourced and made to order using premium ingredients.
                      Awarded highest satisfaction by our coffee club members.
                    </p>

                    <div className="flex items-center gap-6 pt-2">
                      <div>
                        <div className="text-xs text-textSecondary uppercase tracking-wider">Price</div>
                        <div className="text-3xl font-serif font-bold text-gradient-gold">
                          ${Number(featuredItem.price).toFixed(2)}
                        </div>
                      </div>
                      <div className="h-8 w-px bg-border" />
                      <div>
                        <div className="text-xs text-textSecondary uppercase tracking-wider">Rating</div>
                        <div className="flex items-center gap-1.5 text-white font-bold text-lg">
                          <Star size={16} className="text-gold fill-gold" />
                          <span>{Number(featuredItem.rating).toFixed(1)} / 5.0</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(featuredItem)}
                        className="btn-primary"
                      >
                        <Plus size={16} />
                        <span>Order Signature Now</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenDetailModal(featuredItem)}
                        className="btn-outline"
                      >
                        <Eye size={15} />
                        <span>View Nutrition & Details</span>
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex justify-center">
                    <div className="relative rounded-xl overflow-hidden aspect-square w-full max-w-sm border border-white/10 shadow-2xl">
                      <img
                        src={featuredItem.image || featuredItem.image_url}
                        alt={featuredItem.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-white">
                        <span>Category: {featuredItem.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 4. CRAFTSMANSHIP & BENEFITS STRIP */}
      {/* ========================================================================= */}
      <section className="py-16 bg-bg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Coffee,
                title: 'Ethically Sourced',
                desc: 'Single-origin beans handpicked from organic farms across the globe.',
              },
              {
                icon: Utensils,
                title: 'Baked Every Morning',
                desc: 'Authentic French pastry crusts baked daily at 5:00 AM.',
              },
              {
                icon: Clock,
                title: 'Swift 30m Delivery',
                desc: 'Insulated packaging preserves aroma, temperature, and crispness.',
              },
              {
                icon: Heart,
                title: 'Crafted with Passion',
                desc: 'Every drink is balanced by certified Q-grader baristas.',
              },
            ].map((item, idx) => (
              <Reveal key={item.title} delay={idx * 0.08}>
                <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-surface/50 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                    <item.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-white font-serif font-bold text-base mb-1">{item.title}</h3>
                    <p className="text-textSecondary text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. ITEM DETAIL MODAL (GET /api/menu/{id}) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedProductForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProductForModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="relative w-full max-w-2xl bg-surface border border-gold/30 rounded-2xl overflow-hidden shadow-2xl z-10 text-white"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedProductForModal(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors"
                aria-label="Close details"
              >
                <X size={16} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Modal Left: Product Image */}
                <div className="relative aspect-square md:aspect-auto h-64 md:h-full bg-bg">
                  <img
                    src={selectedProductForModal.image || selectedProductForModal.image_url}
                    alt={selectedProductForModal.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-gold text-espresso font-bold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {selectedProductForModal.category}
                    </span>
                  </div>
                </div>

                {/* Modal Right: Product Info */}
                <div className="p-6 md:p-8 flex flex-col justify-between space-y-4">
                  {isLoadingModalDetails && (
                    <div className="flex items-center gap-2 text-xs text-gold">
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Syncing fresh details from server...</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex items-center gap-1 text-gold text-xs font-bold">
                        <Star size={14} className="fill-gold" />
                        <span>{Number(selectedProductForModal.rating).toFixed(1)}</span>
                      </div>
                      <span className="text-textSecondary text-xs">
                        ({selectedProductForModal.reviewCount || 45} reviews)
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-white mb-2">
                      {selectedProductForModal.name}
                    </h3>

                    <p className="text-textSecondary text-sm leading-relaxed mb-4">
                      {selectedProductForModal.description}
                    </p>

                    <div className="space-y-2 py-3 border-y border-border text-xs text-textSecondary">
                      <div className="flex justify-between">
                        <span>Preparation Time</span>
                        <span className="text-white font-medium">{selectedProductForModal.preparationTime || '4-6 min'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Availability</span>
                        <span className="text-emerald-400 font-medium">In Stock • Fresh Today</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Backend ID</span>
                        <span className="text-white/70 font-mono">#{selectedProductForModal.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-textSecondary block">Total Price</span>
                      <span className="text-2xl font-serif font-bold text-gold">
                        ${Number(selectedProductForModal.price).toFixed(2)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        handleAddToCart(selectedProductForModal);
                        setSelectedProductForModal(null);
                      }}
                      className="btn-primary px-6 py-3 flex-1 justify-center"
                    >
                      <Plus size={16} />
                      <span>Add to Order</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. CALL TO ACTION / FOOTER TEASER */}
      {/* ========================================================================= */}
      <section className="py-20 bg-surface/50 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <Reveal>
            <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto text-gold mb-3">
              <Coffee size={24} />
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Ready to Taste the Craft?
            </h2>
            <p className="text-textSecondary text-base max-w-xl mx-auto mt-2">
              Browse our complete artisanal selection or pick up your favorite drink in under 10 minutes.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <a href="#menu-showcase" className="btn-primary px-8 py-3.5">
                Browse Full Menu
              </a>
              <button
                type="button"
                onClick={() => {
                  if (products.length > 0) handleOpenDetailModal(products[0]);
                }}
                className="btn-outline px-8 py-3.5"
              >
                Today&apos;s Special
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
