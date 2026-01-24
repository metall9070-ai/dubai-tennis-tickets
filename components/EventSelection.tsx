import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhyBuy from './WhyBuy';
import { CartItem } from '../App';

interface EventSelectionProps {
  event: any;
  onBack: () => void;
  onTournament: () => void;
  onATPTickets: () => void;
  onWTATickets: () => void;
  onPaymentDelivery?: () => void;
  onPrivacyPolicy?: () => void;
  onTermsOfService?: () => void;
  onContacts?: () => void;
  onAboutUs?: () => void;
  onCart?: () => void;
  onHome: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onCheckout: () => void;
  onFAQ?: () => void;
  onSeatingGuide?: () => void;
  onVenue?: () => void;
}

interface Category {
  id: number;
  name: string;
  price: number;
  color: string;
  seatsLeft: number;
}

const categories: Category[] = [
  { id: 1, name: "Premium Courtside", price: 1200, color: "#1e824c", seatsLeft: 14 },
  { id: 2, name: "Prime A", price: 650, color: "#2b5ce7", seatsLeft: 42 },
  { id: 3, name: "Grandstand Upper", price: 150, color: "#86868b", seatsLeft: 156 },
  { id: 4, name: "Grandstand Lower", price: 350, color: "#3d6ef5", seatsLeft: 88 },
];

const EventSelection: React.FC<EventSelectionProps> = ({
  event, onBack, onTournament, onATPTickets, onWTATickets,
  onPaymentDelivery, onPrivacyPolicy, onTermsOfService, onContacts, onAboutUs, onCart, onHome,
  cart, setCart, onCheckout, onFAQ, onSeatingGuide, onVenue
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const openModal = (cat: Category) => {
    setSelectedCategory(cat);
    setTicketCount(1);
    setIsAdded(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePlus = () => setTicketCount(prev => Math.min(prev + 1, Math.min(4, selectedCategory?.seatsLeft || 4)));
  const handleMinus = () => setTicketCount(prev => Math.max(prev - 1, 1));

  const handleAddToCart = () => {
    if (!selectedCategory) return;
    const cartId = `${event.id}-${selectedCategory.id}`;
    
    setCart(prev => {
      const existing = prev.find(item => item.id === cartId);
      if (existing) {
        return prev.map(item => item.id === cartId ? { ...item, quantity: item.quantity + ticketCount } : item);
      }
      return [...prev, {
        id: cartId,
        eventTitle: event.title,
        categoryName: selectedCategory.name,
        price: selectedCategory.price,
        quantity: ticketCount,
        eventDate: event.date,
        eventMonth: event.month,
        eventDay: event.day,
        eventTime: event.time,
        venue: event.venue
      }];
    });
    
    setIsAdded(true);
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] flex flex-col font-sans">
      <Navbar isVisible={true} cartCount={cartTotalItems} onHome={onHome} onTournament={onTournament} onATPTickets={onATPTickets} onWTATickets={onWTATickets} onCart={onCart} onSeatingGuide={onSeatingGuide} onVenue={onVenue} onFAQ={onFAQ} />

      {/* Main Header Section */}
      <div className="pt-24 pb-8 bg-white border-b border-[#f5f5f7]">
        <div className="max-w-[1200px] mx-auto px-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-[13px] font-medium text-[#86868b] mb-8">
            <button onClick={onHome} className="hover:text-[#1d1d1f] transition-colors font-semibold">Home</button>
            <span className="text-[#d2d2d7]">/</span>
            <button onClick={onBack} className="hover:text-[#1d1d1f] transition-colors font-semibold">Tickets</button>
            <span className="text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] font-semibold">{event?.title || 'Tennis Event'}</span>
          </nav>

          {/* Event Description */}
          <div className="bg-[#f5f5f7] p-8 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-6 border border-black/5">
            <div>
              <h2 className="text-3xl font-semibold mb-1 tracking-tight text-[#1d1d1f]">{event?.title || "Dubai Duty Free Tennis Championships"}</h2>
              <p className="text-[#1e824c] font-semibold text-[17px] mb-4">{event?.venue || "Dubai Duty Free Tennis Stadium"}</p>
              <div className="flex items-center space-x-6 text-[#86868b] text-[15px] font-medium">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#1e824c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{event?.date} {event?.month}, {event?.day}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[#1e824c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{event?.time}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onBack} 
              className="text-[14px] font-semibold text-[#1e824c] hover:bg-[#1e824c]/5 transition-all px-8 py-2.5 bg-white rounded-full border border-[#d2d2d7] shadow-sm whitespace-nowrap active:scale-95"
            >
              Change Event
            </button>
          </div>
        </div>
      </div>

      {/* Main Selection Grid */}
      <div className="flex-1 max-w-[1200px] mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-12 border-b border-[#f5f5f7]">
        
        {/* Left: Venue Map */}
        <div className="lg:col-span-2 flex flex-col items-center">
          <div className="w-full mb-6 flex items-center justify-between">
            <h3 className="text-xl font-semibold tracking-tight">Select Seating Area</h3>
            <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.2em] bg-[#f5f5f7] px-3 py-1 rounded-full">Live Availability</span>
          </div>
          
          <div className="aspect-square w-full max-w-[500px] grid grid-cols-2 grid-rows-2 gap-2 p-2 bg-[#f5f5f7] rounded-[40px] overflow-hidden relative shadow-inner border border-black/5">
             {categories.map((cat) => (
               <div 
                 key={cat.id}
                 onClick={() => openModal(cat)}
                 onMouseEnter={() => setHoveredCategory(cat.id)}
                 onMouseLeave={() => setHoveredCategory(null)}
                 className={`relative cursor-pointer flex items-center justify-center text-5xl font-semibold transition-all duration-300 rounded-[28px]
                  ${hoveredCategory === cat.id ? 'brightness-110 scale-[1.01] shadow-2xl z-10' : 'brightness-100'}
                 `}
                 style={{ backgroundColor: cat.color }}
               >
                 <span className="text-white drop-shadow-md">{cat.id}</span>
                 {hoveredCategory === cat.id && (
                   <div className="absolute inset-0 border-4 border-white/40 rounded-[28px] pointer-events-none" />
                 )}
               </div>
             ))}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-24 bg-[#1e824c] border-4 border-white rounded-2xl shadow-xl flex items-center justify-center">
                <div className="w-full h-0.5 bg-white/50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
             </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div className="flex flex-col h-full">
          <h3 className="text-xl font-semibold mb-6 tracking-tight text-[#1d1d1f]">Price Categories</h3>
          <div className="flex flex-col gap-4 mb-8">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                onClick={() => openModal(cat)}
                className={`group cursor-pointer bg-white border border-[#d2d2d7] rounded-[24px] p-6 transition-all duration-400 transform
                  ${hoveredCategory === cat.id ? '-translate-y-1 shadow-2xl border-[#1e824c]/40' : 'hover:shadow-lg hover:border-[#86868b]/30'}
                `}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center font-semibold text-white shadow-md text-lg" style={{ backgroundColor: cat.color }}>
                      {cat.id}
                    </div>
                    <div>
                      <h4 className="font-semibold text-[18px] tracking-tight text-[#1d1d1f]">{cat.name}</h4>
                      {cat.seatsLeft < 30 && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-wide animate-pulse">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                          Selling Fast
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[20px] font-semibold text-[#1d1d1f]">${cat.price}</p>
                  </div>
                </div>
                {/* Urgency indicator bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${cat.seatsLeft < 20 ? 'bg-red-500' : cat.seatsLeft < 50 ? 'bg-orange-400' : 'bg-[#1e824c]'}`}
                      style={{ width: `${Math.max(5, 100 - (cat.seatsLeft / 2))}%` }}
                    ></div>
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wide whitespace-nowrap ${cat.seatsLeft < 20 ? 'text-red-500' : cat.seatsLeft < 50 ? 'text-orange-500' : 'text-[#1e824c]'}`}>
                    {cat.seatsLeft} left
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary Widget */}
          {cart.length > 0 && (
            <div className="mt-auto p-8 bg-[#1d1d1f] text-white rounded-[32px] shadow-2xl sticky bottom-4 animate-fadeIn border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[12px] font-semibold uppercase tracking-[0.2em] text-white/50">Your Cart</span>
                <span className="text-[11px] bg-white/10 px-3 py-1 rounded-full font-semibold uppercase tracking-widest">{cartTotalItems} items</span>
              </div>
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-[15px] font-normal text-white/80">Subtotal</span>
                <span className="text-3xl font-semibold">${cartTotalValue.toLocaleString()}</span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full py-4 bg-[#1e824c] text-white font-semibold rounded-2xl hover:bg-[#166d3e] transition-all transform active:scale-[0.98] text-[16px] shadow-lg shadow-[#1e824c]/20"
              >
                Go to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      <WhyBuy />
      <Footer
        onHome={onHome}
        onTournament={onTournament}
        onATPTickets={onATPTickets}
        onWTATickets={onWTATickets}
        onPaymentDelivery={onPaymentDelivery}
        onPrivacyPolicy={onPrivacyPolicy}
        onTermsOfService={onTermsOfService}
        onContacts={onContacts}
        onAboutUs={onAboutUs}
        onFAQ={onFAQ}
        onSeatingGuide={onSeatingGuide}
        onVenue={onVenue}
      />

      {/* Modal Window */}
      {isModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-fadeIn">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-[440px] max-h-[92vh] rounded-[32px] md:rounded-[42px] shadow-2xl overflow-y-auto animate-modalSlide border border-black/5">
            <div className="p-5 md:p-8">
              {!isAdded ? (
                <>
                  <div className="flex items-center justify-between mb-0.5 md:mb-1">
                    <span className="text-[14px] md:text-[15px] font-semibold text-[#86868b]">Select Quantity</span>
                    <button onClick={closeModal} className="p-1 hover:bg-[#f5f5f7] rounded-full transition-colors">
                      <svg className="w-5 h-5 text-[#d2d2d7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <h3 className="text-[22px] md:text-[28px] font-bold tracking-tight text-[#111842] mb-1.5 md:mb-4">{selectedCategory.name}</h3>
                    <div className="flex items-baseline space-x-2">
                       <span className="text-[16px] md:text-[19px] font-semibold text-[#1d1d1f]">Price:</span>
                       <span className="text-[22px] md:text-[28px] font-bold text-[#1e824c] tracking-tight">${selectedCategory.price.toLocaleString()}</span>
                       <span className="text-[14px] md:text-[17px] text-[#86868b] font-normal">/ ticket</span>
                    </div>
                  </div>

                  <div className="bg-[#f8f9fb] rounded-[20px] md:rounded-[24px] p-4 md:p-6 mb-4 md:mb-6">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <div className="flex flex-col">
                        <span className="text-[15px] md:text-[17px] font-bold text-[#111842]">Quantity</span>
                        <span className="text-[9px] md:text-[11px] text-[#86868b] font-bold uppercase tracking-[0.1em] mt-0.5">MAX 4 PER ORDER</span>
                      </div>
                      <div className="flex items-center space-x-4 md:space-x-5">
                        <button 
                          onClick={handleMinus} 
                          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full hover:bg-white/80 active:scale-90 transition-all shadow-sm border border-[#f0f0f0]"
                        >
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#1d1d1f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                        </button>
                        <span className="text-[17px] md:text-[19px] font-bold text-[#111842] tabular-nums w-4 text-center">{ticketCount}</span>
                        <button 
                          onClick={handlePlus} 
                          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full hover:bg-white/80 active:scale-90 transition-all shadow-sm border border-[#f0f0f0]"
                        >
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#1d1d1f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="border-t border-[#e2e8f0] my-3 md:my-4 opacity-50"></div>

                    <div className="flex justify-between items-center mb-4 md:mb-6">
                       <span className="text-[15px] md:text-[17px] font-semibold text-[#86868b]">Remaining Seats</span>
                       <span className="text-[15px] md:text-[17px] font-bold text-[#1e824c]">
                         {selectedCategory.seatsLeft - ticketCount} seats left
                       </span>
                    </div>

                    <div className="flex justify-between items-center">
                       <span className="text-[18px] md:text-[20px] font-bold text-[#111842]">Total</span>
                       <span className="text-[22px] md:text-[28px] font-bold text-[#111842] tracking-tight tabular-nums">${(selectedCategory.price * ticketCount).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="px-2 md:px-4 mb-5 md:mb-8">
                    <p className="text-center text-[12px] md:text-[14px] text-[#86868b] leading-relaxed italic font-medium">
                      When ordering two or more tickets, your seats will be next to each other.
                    </p>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    className="w-full py-4 md:py-5 bg-[#00a651] text-white font-bold rounded-[16px] md:rounded-[20px] shadow-lg hover:bg-[#008c44] transition-all transform active:scale-[0.98] text-[16px] md:text-[18px] flex items-center justify-center space-x-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    <span>ADD TO CART</span>
                  </button>
                </>
              ) : (
                <div className="text-center py-4 md:py-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-green-50 text-[#1e824c] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-inner">
                    <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-[24px] md:text-[28px] font-semibold text-[#1d1d1f] mb-1.5 md:mb-2 tracking-tight">Added to Cart</h3>
                  <p className="text-[14px] md:text-[15px] text-[#86868b] mb-8 md:mb-10 font-medium px-2 md:px-4">Your tickets have been successfully added to your cart.</p>
                  
                  <div className="space-y-3 md:space-y-4 px-1 md:px-2">
                    <button 
                      onClick={onCheckout}
                      className="w-full py-4 md:py-5 bg-[#1d1d1f] text-white font-semibold rounded-[20px] md:rounded-[24px] shadow-xl hover:bg-black transition-all transform active:scale-[0.98] text-[16px] md:text-[18px]"
                    >
                      Go to Checkout
                    </button>
                    <button 
                      onClick={closeModal}
                      className="w-full py-2.5 text-[#1e824c] font-semibold hover:underline transition-all text-[14px] md:text-[15px]"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlide { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-modalSlide { animation: modalSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .py-4\.5 { padding-top: 1.125rem; padding-bottom: 1.125rem; }
      `}</style>
    </div>
  );
};

export default EventSelection;