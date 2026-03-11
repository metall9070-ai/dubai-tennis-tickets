'use client';

import { useEffect } from 'react';
import { useCart, CART_STORAGE_KEY } from '@/app/CartContext';
import { logger } from '@/lib/logger';

interface ClearCartOnSuccessProps {
  orderStatus: string;
}

export default function ClearCartOnSuccess({ orderStatus }: ClearCartOnSuccessProps) {
  const { setCart } = useCart();

  useEffect(() => {
    // Clear cart when order is paid
    if (orderStatus === 'paid') {
      // Clear localStorage directly to prevent race condition with CartProvider hydration
      try {
        localStorage.removeItem(CART_STORAGE_KEY);
        logger.log('[ClearCartOnSuccess] Cleared cart from localStorage');
      } catch (e) {
        logger.error('[ClearCartOnSuccess] Failed to clear localStorage:', e);
      }
      // Also update React state
      setCart([]);
    }
  }, [orderStatus, setCart]);

  return null;
}
