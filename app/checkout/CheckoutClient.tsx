'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/CartContext';
import Checkout from '@/components/Checkout';

export default function CheckoutClient() {
  const router = useRouter();
  const { cart, setCart } = useCart();

  return (
    <Checkout
      cart={cart}
      setCart={setCart}
      onBack={() => router.back()}
      onHome={() => router.push('/')}
      onCart={() => router.push('/checkout')}
    />
  );
}
