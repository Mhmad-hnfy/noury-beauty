"use client"
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const Hearo = () => {
  return (
    <div className="relative bg-pink-50 min-h-[100vh] flex items-center overflow-hidden">
      {/* Decorative Orbs */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
        className="absolute top-20 left-20 w-64 h-64 bg-[#BB015E] rounded-full blur-3xl opacity-20"
      ></motion.div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.1, scale: 1.2 }}
        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
        className="absolute bottom-20 right-20 w-96 h-96 bg-pink-300 rounded-full blur-3xl opacity-10"
      ></motion.div>

      <div className="max-w-7xl mx-auto px-4 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-right"
        >
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#BB015E] font-bold tracking-widest text-lg md:text-xl block mb-4"
          >
            مرحباً بكِ في عالم الجمال
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6 font-serif"
          >
            أبرزي سحر <br /> 
            <span className="text-[#BB015E] italic">جمالكِ الطبيعي</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-black text-lg md:text-xl font-bold mb-10 max-w-lg ml-auto leading-relaxed"
          >
            اكتشفي تشكيلتنا الحصرية من منتجات التجميل الفاخرة التي تمنحكِ الثقة والتألق في كل لحظة.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex gap-4 justify-end"
          >
            <Link href="/products" className="bg-[#BB015E] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#8F0147] transition-all shadow-lg hover:shadow-pink-200 transform hover:-translate-y-1 flex items-center justify-center">
              تسوقي الآن
            </Link>
            <Link href="/products" className="border-2 border-[#BB015E] text-[#BB015E] px-8 py-4 rounded-full text-lg font-bold hover:bg-pink-100 transition-all transform hover:-translate-y-1 flex items-center justify-center">
              اكتشفي المزيد
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white transform hover:rotate-2 transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop" 
              alt="Makeup Model" 
              className="w-full h-[500px] object-cover"
            />
          </div>
          {/* Floating Element */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl z-20 border border-pink-100"
          >
            <div className="flex items-center gap-4">
              <div className="bg-pink-100 p-3 rounded-2xl text-[#BB015E]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </div>
              <div>
                <p className="text-sm text-black font-bold">أكثر من</p>
                <p className="font-black text-black">+10k عميلة سعيدة</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hearo;