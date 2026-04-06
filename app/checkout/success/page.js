"use client"
import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { db } from '../../../data/supabase';

export default function SuccessPage() {
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    // Get the last order from DB (local storage)
    const orders = db.orders.list();
    if (orders.length > 0) {
      const lastOrder = orders[0];
      // Update status to 'مدفوع (عربون)'
      db.orders.updateStatus(lastOrder.id, 'مدفوع (عربون)');
      setOrderDetails(lastOrder);
    }
  }, []);

  return (
    <div dir="rtl" className="bg-pink-50 min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-4 border-pink-100 max-w-xl w-full text-center"
        >
          <div className="text-8xl mb-6">💖</div>
          <h1 className="text-4xl font-black text-[#BB015E] mb-4">تم تأكيد الحجز بنجاح!</h1>
          <p className="text-gray-500 text-lg mb-8">
            شكراً لثقتك بـ **Noury Beauty**. لقد استلمنا دفعة العربون وتم تأكيد طلبك بنجاح.
          </p>

          {orderDetails && (
            <div className="bg-pink-50/50 p-6 rounded-3xl border border-pink-100 mb-8 space-y-2">
              <p className="text-sm text-gray-500">رقم الطلب:</p>
              <p className="text-2xl font-black text-black">{orderDetails.id}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
               <Link href="/" className="bg-[#BB015E] text-white px-10 py-5 rounded-full font-bold shadow-lg hover:bg-[#8F0147] transition-all text-xl">
                العودة للمتجر ✨
              </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
