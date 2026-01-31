'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const CART_STORAGE_KEY = 'dubai-tennis-cart';
const CART_VERSION_KEY = 'dubai-tennis-cart-version';
const CURRENT_CART_VERSION = 3; // Increment when cart format changes (v3: clear sessionStorage too)

// CRITICAL: Clear old sessionStorage IMMEDIATELY at module load time
// This runs before any React components mount, ensuring EventClient
// doesn't read stale event data from sessionStorage
if (typeof window !== 'undefined') {
  try {
    const storedVersion = localStorage.getItem(CART_VERSION_KEY);
    const version = storedVersion ? parseInt(storedVersion, 10) : 0;
    if (version !== CURRENT_CART_VERSION) {
      console.log(`[Cart] Module init: Version mismatch (${version} -> ${CURRENT_CART_VERSION}). Clearing sessionStorage immediately.`);
      sessionStorage.removeItem('selectedEvent');
      // Also clear cart and update version
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.setItem(CART_VERSION_KEY, String(CURRENT_CART_VERSION));
    }
  } catch (e) {
    console.error('[Cart] Module init: Failed to check/clear storage:', e);
  }
}

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

/**
 * Validate cart item format.
 * New format: "eventId-categoryId" where both are numeric (e.g., "14-2")
 * Old format: "eventId-categorySlug" (e.g., "14-grandstand") - INVALID
 */
function isValidCartItem(item: CartItem): boolean {
  if (!item.id || typeof item.id !== 'string') return false;
  const parts = item.id.split('-');
  if (parts.length < 2) return false;
  const eventId = parseInt(parts[0], 10);
  const categoryId = parseInt(parts[1], 10);
  // Both must be valid numbers
  return !isNaN(eventId) && !isNaN(categoryId);
}

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    // Version check is already done at module load time (above)
    // Just load and validate cart items
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        // Filter out invalid items (old format)
        const validItems = parsed.filter(isValidCartItem);
        if (validItems.length !== parsed.length) {
          console.log(`[Cart] Filtered out ${parsed.length - validItems.length} invalid items`);
        }
        return validItems;
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
    localStorage.setItem(CART_VERSION_KEY, String(CURRENT_CART_VERSION));
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
