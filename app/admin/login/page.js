"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { db } from '@/data/supabase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Fetch live settings
    const settings = db.settings.get();
    const storedEmail = settings.adminEmail || 'admin@noury.com';
    const storedPassword = settings.adminPassword || 'admin123';

    if (email === storedEmail && password === storedPassword) {
      localStorage.setItem('isAdmin', 'true');
      router.push('/admin');
    } else {
      alert('البيانات غير صحيحة');
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-pink-50 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-4 border-white relative"
      >
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-100 rounded-full -ml-12 -mb-12 opacity-50"></div>

        <div className="p-10 relative z-10 text-center">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl font-bold text-[#BB015E] font-serif mb-2"
          >
            Noury Beauty
          </motion.h1>
          <p className="text-gray-400 mb-8">لوحة تحكم المتجر 🎀</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-right">
              <label className="block text-sm font-bold text-gray-700 mb-2 mr-2">البريد الإلكتروني</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-full bg-pink-50 border-2 border-transparent focus:border-[#BB015E] focus:bg-white outline-none transition-all text-gray-800"
                placeholder="admin@noury.com"
              />
            </div>

            <div className="text-right">
              <label className="block text-sm font-bold text-gray-700 mb-2 mr-2">كلمة المرور</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 rounded-full bg-pink-50 border-2 border-transparent focus:border-[#BB015E] focus:bg-white outline-none transition-all text-gray-800"
                placeholder="••••••••"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full bg-[#BB015E] text-white font-bold py-4 rounded-full shadow-lg hover:shadow-pink-200 transition-all text-lg mt-4"
            >
              تسجيل الدخول
            </motion.button>
          </form>

          <p className="mt-8 text-sm text-gray-400">
            نسيتي كلمة المرور؟ تواصلب مع الدعم التقني
          </p>
        </div>
      </motion.div>
    </div>
  );
}
