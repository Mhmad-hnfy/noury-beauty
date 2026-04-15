"use client";

import React, { useState } from 'react';
import CheckoutForm from '@/_Components/CheckoutForm';
import OrderSummary from '@/_Components/OrderSummary';

export default function CheckoutPage() {
  const [showSummary, setShowSummary] = useState(false);
  const [shippingPrice, setShippingPrice] = useState(0);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="border-b border-gray-100 py-6 md:py-10">
        <div className="max-w-7xl mx-auto px-6 flex justify-center md:justify-start">
          <h1 className="text-3xl font-serif text-black tracking-tight leading-tight cursor-pointer">
            Noury Beauty
          </h1>
        </div>
      </header>

      {/* Mobile Summary Header (Visible only on Mobile) */}
      <div className="md:hidden bg-gray-50 border-b border-gray-200 py-4 px-6 flex flex-col gap-4">
        <button 
          onClick={() => setShowSummary(!showSummary)}
          className="flex justify-between items-center w-full text-sm text-[#c19a2e] font-medium"
        >
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <span>{showSummary ? 'Hide order summary' : 'Show order summary'}</span>
            <svg 
              className={`transition-transform duration-300 ${showSummary ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </div>
          <span className="text-gray-900 font-bold">Total with Shipping</span>
        </button>

        {showSummary && (
          <div className="animate-in slide-in-from-top duration-300 origin-top overflow-hidden">
             <OrderSummary shippingPrice={shippingPrice} />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 min-h-[calc(100vh-100px)]">
        
        {/* Left: Checkout Form */}
        <div className="px-6 md:pr-12 lg:pr-24 border-r border-gray-100 order-2 md:order-1">
          <CheckoutForm onShippingChange={setShippingPrice} />
          
          <footer className="py-10 border-t border-gray-100 text-[11px] text-gray-500 uppercase tracking-widest flex flex-wrap gap-4">
            <a href="#" className="hover:text-black">Refund policy</a>
            <a href="#" className="hover:text-black">Shipping policy</a>
            <a href="#" className="hover:text-black">Privacy policy</a>
            <a href="#" className="hover:text-black">Terms of service</a>
          </footer>
        </div>

        {/* Right: Order Summary (Desktop) */}
        <div className="hidden md:block bg-gray-50 px-6 md:pl-12 lg:pl-24 h-full order-1 md:order-2">
          <OrderSummary shippingPrice={shippingPrice} />
        </div>

      </main>
    </div>
  );
}
