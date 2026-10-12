// src/services/api.ts
// Live backend integration with Cafe REST API (Render)
// Base URL: https://cafe-rest-api-srja.onrender.com

import type { BackendMenuItem, Product, ApiHealthResponse } from '../types';
import { products as localFallbackProducts } from '../data/products';

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || 'https://cafe-rest-api-srja.onrender.com'
).replace(/\/$/, '');

// Generic fetch wrapper with timeout
async function apiFetch<T>(endpoint: string, options?: RequestInit, timeoutMs = 12000): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Server response error' }));
      throw new Error(errorData.message || `HTTP error ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// Map backend menu item to frontend Product model
export function mapBackendToProduct(item: BackendMenuItem): Product {
  const rating = Number(item.rating) || 4.8;
  const reviewCount = Math.floor(rating * 25 + (Number(item.id) || 1) * 9);
  const isCoffee = (item.category || '').toLowerCase().includes('coffee');

  return {
    id: String(item.id),
    name: item.name,
    description: item.description,
    price: Number(item.price),
    image: item.image_url,
    image_url: item.image_url,
    category: item.category,
    rating,
    reviewCount,
    tags: [item.category, rating >= 4.8 ? 'Chef Pick' : 'Specialty'],
    isPopular: rating >= 4.8,
    isAvailable: item.is_available ?? true,
    preparationTime: isCoffee ? '3-5 min' : '5-8 min',
  };
}

// Live Cafe API Service
export const cafeApi = {
  // GET /api/health
  async checkHealth(): Promise<ApiHealthResponse> {
    return apiFetch<ApiHealthResponse>('/api/health');
  },

  // GET /api/home (Homepage menu items)
  async getHome(): Promise<Product[]> {
    try {
      const data = await apiFetch<BackendMenuItem[]>('/api/home');
      if (Array.isArray(data) && data.length > 0) {
        return data.map(mapBackendToProduct);
      }
      return localFallbackProducts;
    } catch {
      // Graceful fallback to local products if offline or Render cold-start
      return localFallbackProducts;
    }
  },

  // GET /api/menu (Supports search and category filters)
  async getMenu(category?: string, search?: string): Promise<Product[]> {
    try {
      const params = new URLSearchParams();
      if (category && category.toLowerCase() !== 'all') {
        params.set('category', category);
      }
      if (search && search.trim()) {
        params.set('search', search.trim());
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const data = await apiFetch<BackendMenuItem[]>(`/api/menu${queryString}`);

      if (Array.isArray(data)) {
        return data.map(mapBackendToProduct);
      }
      return localFallbackProducts;
    } catch {
      let filtered = [...localFallbackProducts];
      if (category && category.toLowerCase() !== 'all') {
        filtered = filtered.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
      }
      if (search && search.trim()) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
      }
      return filtered;
    }
  },

  // GET /api/menu/categories
  async getCategories(): Promise<string[]> {
    try {
      const data = await apiFetch<string[]>('/api/menu/categories');
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return ['Hot Coffee', 'Cold Coffee', 'Bakery', 'Dessert'];
    } catch {
      return ['Hot Coffee', 'Cold Coffee', 'Bakery', 'Dessert'];
    }
  },

  // GET /api/menu/{id}
  async getMenuItemById(id: string | number): Promise<Product> {
    try {
      const item = await apiFetch<BackendMenuItem>(`/api/menu/${id}`);
      return mapBackendToProduct(item);
    } catch {
      const fallback = localFallbackProducts.find(p => p.id === String(id));
      if (fallback) return fallback;
      throw new Error(`Item ${id} not found`);
    }
  },
};

// Token management
export const tokenService = {
  get: () => localStorage.getItem('bb_token'),
  set: (token: string) => localStorage.setItem('bb_token', token),
  remove: () => localStorage.removeItem('bb_token'),
};

// Auth services (local / mock for now)
export const authService = {
  async login(email: string, password: string) {
    await new Promise(r => setTimeout(r, 400));
    if (email && password) {
      const user = { id: 'user-1', name: email.split('@')[0], email };
      tokenService.set('demo-token-123');
      return { user, token: 'demo-token-123' };
    }
    throw new Error('Invalid email or password');
  },

  async register(name: string, email: string, password: string) {
    await new Promise(r => setTimeout(r, 400));
    if (name && email && password) {
      const user = { id: 'user-1', name, email };
      tokenService.set('demo-token-123');
      return { user, token: 'demo-token-123' };
    }
    throw new Error('Please fill in all fields');
  },

  async logout() {
    tokenService.remove();
  },
};

// Product service for backward compatibility
export const productService = {
  getAll: (category?: string, search?: string) => cafeApi.getMenu(category, search),
  getById: (id: string) => cafeApi.getMenuItemById(id),
};

// Order services
export const orderService = {
  async create(orderData: unknown) {
    await new Promise(r => setTimeout(r, 600));
    const newOrder = {
      id: `#BB${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'confirmed',
      estimatedDelivery: '30-40 min',
      ...orderData as object,
      createdAt: new Date().toISOString(),
    };
    const history = JSON.parse(localStorage.getItem('bb_orders') || '[]');
    localStorage.setItem('bb_orders', JSON.stringify([newOrder, ...history]));
    return newOrder;
  },

  async getHistory() {
    return JSON.parse(localStorage.getItem('bb_orders') || '[]');
  },

  async getById(id: string) {
    const orders = JSON.parse(localStorage.getItem('bb_orders') || '[]');
    return orders.find((o: { id: string }) => o.id === id);
  },
};
