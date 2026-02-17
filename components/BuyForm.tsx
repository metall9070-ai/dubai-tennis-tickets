'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder, CreateOrderInput } from '@/app/actions/orders';

interface BuyFormProps {
  eventId: number;
  categoryId: number;
  categoryName: string;
  quantity: number;
  unitPrice: number;
  onCancel: () => void;
}

export default function BuyForm({
  eventId,
  categoryId,
  categoryName,
  quantity,
  unitPrice,
  onCancel,
}: BuyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comments: '',
  });

  const totalPrice = unitPrice * quantity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic validation
    if (!formData.name.trim() || formData.name.length < 2) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 5) {
      setError('Please enter a valid phone number');
      return;
    }

    const input: CreateOrderInput = {
      event_id: eventId,
      category_id: categoryId,
      quantity,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      comments: formData.comments.trim(),
    };

    startTransition(async () => {
      const result = await createOrder(input);

      if (result.success && result.order_id) {
        router.push(`/checkout/${result.order_id}`);
      } else {
        setError(result.error || 'Failed to create order');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Order Summary */}
      <div className="bg-[#f5f5f7] rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[#86868b]">Category</span>
          <span className="font-semibold text-[#1d1d1f]">{categoryName}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-[#86868b]">Quantity</span>
          <span className="font-semibold text-[#1d1d1f]">{quantity} tickets</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-[#d2d2d7]">
          <span className="font-semibold text-[#1d1d1f]">Total</span>
          <span className="text-xl font-bold text-[var(--color-primary)]">${totalPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* Contact Form */}
      <div>
        <label className="block text-sm font-medium text-[#1d1d1f] mb-1">Full Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          required
          minLength={2}
          className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1d1d1f] mb-1">Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          required
          className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1d1d1f] mb-1">Phone *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+971 50 123 4567"
          required
          minLength={5}
          className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1d1d1f] mb-1">Comments (optional)</label>
        <textarea
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          placeholder="Special requests..."
          rows={2}
          className="w-full px-4 py-3 border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="flex-1 py-3 bg-[#f5f5f7] text-[#1d1d1f] font-semibold rounded-xl hover:bg-[#e8e8ed] transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 py-3 bg-[var(--color-primary)] text-white font-semibold rounded-xl hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </>
          ) : (
            `Buy Now - $${totalPrice.toLocaleString()}`
          )}
        </button>
      </div>
    </form>
  );
}
