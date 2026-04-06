"use client"
import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FailurePage() {
  return (
    <div dir="rtl" className="bg-pink-50 min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3.5rem] shadow-2xl border-4 border-red-50 max-w-xl w-full text-center"
        >
          <div className="text-8xl mb-6">❌</div>
          <h1 className="text-4xl font-black text-red-600 mb-4">حدث خطأ في الدفع!</h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed">
            عذراً، لم نتمكن من معالجة عملية الدفع. يرجى التأكد من بيانات البطاقة أو المحفظة والمحاولة مرة أخرى.
          </p>

          <div className="flex flex-col gap-4">
              <Link href="/checkout" className="bg-[#BB015E] text-white px-10 py-5 rounded-full font-bold shadow-lg hover:bg-[#8F0147] transition-all text-xl">
                إعادة المحاولة 🔄
              </Link>
               <Link href="/" className="text-gray-400 font-bold hover:text-gray-600 transition-all text-sm mt-4">
                العودة للمتجر
              </Link>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
