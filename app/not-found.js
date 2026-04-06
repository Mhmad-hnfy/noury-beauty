"use client"
import React from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div dir="rtl" className="bg-pink-50 min-h-screen flex flex-col font-sans">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl w-full"
        >
          <div className="relative mb-12">
            <motion.h1 
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-[12rem] font-black text-white drop-shadow-2xl opacity-50 select-none"
            >
              404
            </motion.h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl">💄</span>
            </div>
          </div>

          <h2 className="text-4xl font-bold text-gray-800 mb-6">عذراً! الصفحة غير موجودة</h2>
          <p className="text-xl text-gray-500 mb-12 leading-relaxed">
            يبدو أنكِ تهتِ في عالم الجمال! الصفحة التي تبحثين عنها قد تكون انتقلت أو حُذفت.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              href="/" 
              className="bg-[#BB015E] text-white px-10 py-5 rounded-full font-bold text-xl shadow-xl shadow-pink-200 hover:bg-[#8F0147] transition-all transform hover:scale-105 active:scale-95"
            >
              العودة للرئيسية 🏠
            </Link>
            <Link 
              href="/categories" 
              className="bg-white text-[#BB015E] border-2 border-[#BB015E] px-10 py-5 rounded-full font-bold text-xl hover:bg-pink-50 transition-all transform hover:scale-105 active:scale-95"
            >
              تسوقي الأقسام 🛍️
            </Link>
          </div>

          <div className="mt-20 flex justify-center gap-8 opacity-30 grayscale hover:grayscale-0 transition-all">
            <span className="text-4xl">✨</span>
            <span className="text-4xl">🌸</span>
            <span className="text-4xl">💅</span>
            <span className="text-4xl">🕊️</span>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
