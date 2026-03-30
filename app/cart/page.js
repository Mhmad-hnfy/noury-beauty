"use client"
import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useCart } from '../../context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, addToCart, decreaseFromCart } = useCart();

  const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);

  return (
    <div dir="rtl" className="bg-pink-50 min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-16">
        <h1 className="text-4xl font-bold text-[#BB015E] mb-10 text-center">سلة المشتريات</h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="flex-1 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100 flex items-center gap-6">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-pink-50">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                    <p className="text-[#BB015E] font-black text-lg">{item.price} جنيه</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-3 bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
                        <button onClick={() => addToCart(item)} className="text-[#BB015E] font-bold text-xl">+</button>
                        <span className="font-bold text-gray-700">{item.quantity}</span>
                        <button onClick={() => decreaseFromCart(item.id)} className="text-[#BB015E] font-bold text-xl">-</button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="text-red-400 text-sm hover:underline"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:w-96 bg-white p-8 rounded-3xl shadow-xl h-fit border-2 border-pink-100 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">ملخص الطلب</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-lg text-gray-600">
                  <span>المجموع الفرعي:</span>
                  <span>{total} جنيه</span>
                </div>
                <div className="flex justify-between text-lg text-gray-600">
                  <span>الشحن:</span>
                  <span className="text-green-500 font-bold">مجاني</span>
                </div>
                <div className="h-px bg-pink-100 w-full"></div>
                <div className="flex justify-between text-2xl font-black text-[#BB015E]">
                  <span>الإجمالي:</span>
                  <span>{total} جنيه</span>
                </div>
              </div>
              <Link
                href="/checkout"
                className="w-full bg-[#BB015E] hover:bg-[#8F0147] text-white text-center block font-bold py-4 rounded-full transition-all shadow-lg hover:shadow-pink-200"
              >
                إتمام الطلب
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-pink-100 max-w-2xl mx-auto">
            <div className="mb-6 opacity-20 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-400 mb-4">سلتك فارغة حالياً</h2>
            <Link 
              href="/products" 
              className="text-[#BB015E] font-bold underline"
            >
              ابدئي التسوق الآن
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
