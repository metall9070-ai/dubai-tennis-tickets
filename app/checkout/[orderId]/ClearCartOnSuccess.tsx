'use client';

import { useEffect } from 'react';
import { useCart } from '@/app/CartContext';

interface ClearCartOnSuccessProps {
  orderStatus: string;
}

export default function ClearCartOnSuccess({ orderStatus }: ClearCartOnSuccessProps) {
  const { setCart } = useCart();

  useEffect(() => {
    // Clear cart when order is paid
    if (orderStatus === 'paid') {
      setCart([]);
    }
  }, [orderStatus, setCart]);

  return null;
}
