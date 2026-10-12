// src/types/index.ts
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  image_url?: string;
  category: Category;
  rating: number;
  reviewCount: number;
  tags: string[];
  isPopular?: boolean;
  isAvailable: boolean;
  preparationTime?: string;
}

export interface BackendMenuItem {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string;
  rating: number;
  is_available: boolean;
  created_at?: string;
}

export interface ApiHealthResponse {
  message: string;
  status: string;
  version: string;
}

export type Category = 'Hot Coffee' | 'Cold Coffee' | 'Bakery' | 'Dessert' | 'coffee' | 'drinks' | 'pizza' | 'snacks' | 'desserts' | string;

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  deliveryAddress: string;
  customerName: string;
  phone: string;
  notes?: string;
  createdAt: string;
  estimatedDelivery?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface CheckoutForm {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

export interface AuthForm {
  email: string;
  password: string;
  name?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
