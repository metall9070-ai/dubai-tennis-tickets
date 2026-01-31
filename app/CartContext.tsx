'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const CART_STORAGE_KEY = 'dubai-tennis-cart';

export interface CartItem {
  id: string;
  eventTitle: string;
  categoryName: string;
  price: number;
  quantity: number;
  eventDate: string;
  eventMonth: string;
  eventDay: string;
  eventTime: string;
  venue: string;
}

interface CartContextType {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  cartTotalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('[Cart] Failed to load cart from localStorage:', e);
  }
  return [];
}

function saveCartToStorage(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('[Cart] Failed to save cart to localStorage:', e);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    const storedCart = loadCartFromStorage();
    if (storedCart.length > 0) {
      setCart(storedCart);
      console.log(`[Cart] Restored ${storedCart.length} items from localStorage`);
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes (after initial hydration)
  useEffect(() => {
    if (isHydrated) {
      saveCartToStorage(cart);
    }
  }, [cart, isHydrated]);

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, setCart, cartTotalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
