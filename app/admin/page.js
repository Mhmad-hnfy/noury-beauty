"use client"
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../data/supabase';

export default function AdminDashboard() {
  const [data, setData] = useState({
    products: [],
    orders: [],
    totalSales: 0,
    newOrders: 0
  });

  useEffect(() => {
    const products = db.products.list();
    const orders = db.orders.list();
    const totalSales = orders.reduce((acc, current) => acc + parseFloat(current.total), 0);
    const newOrders = orders.filter(o => o.status === 'جديد').length;
    
    setData({ products, orders, totalSales, newOrders });
  }, []);

  const stats = [
    { title: 'إجمالي المبيعات', value: data.totalSales.toLocaleString('ar-EG'), unit: 'جنيه', icon: '💰', color: 'bg-pink-100 text-[#BB015E]' },
    { title: 'الطلبات الجديدة', value: data.newOrders, unit: 'طلب', icon: '📦', color: 'bg-blue-100 text-blue-600' },
    { title: 'المنتجات النشطة', value: data.products.length, unit: 'منتج', icon: '🛍️', color: 'bg-purple-100 text-purple-600' },
    { title: 'العملاء المستلمون', value: data.orders.filter(o => o.status === 'تم الشحن').length, unit: 'عميل', icon: '👥', color: 'bg-green-100 text-green-600' },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-8 rounded-[2rem] shadow-sm border border-pink-100 hover:shadow-lg transition-shadow"
          >
            <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center text-2xl mb-6 shadow-sm`}>
              {stat.icon}
            </div>
            <h3 className="text-gray-400 font-bold mb-2 text-sm">{stat.title}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-gray-800">{stat.value}</span>
              <span className="text-xs font-bold text-gray-400">{stat.unit}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Sales Chart Mockup - Responds to data */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-pink-100">
          <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            <span>📈</span> أداء المبيعات
          </h3>
          <div className="h-64 flex items-end gap-4 px-4">
             {/* Mock chart inspired by order count */}
             {[0.2, 0.4, 0.3, 0.6, 0.5, 0.8, 1].map((scale, i) => (
               <motion.div 
                 key={i} 
                 initial={{ height: 0 }}
                 animate={{ height: `${(scale * (data.totalSales / 50000 + 40)).toFixed(0)}%` }}
                 className="flex-1 bg-gradient-to-t from-[#BB015E] to-pink-300 rounded-t-xl"
               ></motion.div>
             ))}
          </div>
          <div className="flex justify-between mt-4 text-gray-400 text-[10px] font-bold">
            <span>السبت</span><span>الأحد</span><span>الإثنين</span><span>الثلاثاء</span><span>الأربعاء</span><span>الخميس</span><span>الجمعة</span>
          </div>
        </div>

        {/* Latest Orders */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-pink-100">
            <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                <span>🕒</span> آخر الطلبات المُستلمة
            </h3>
            <div className="space-y-4">
                {data.orders.slice(0, 4).map((order, i) => (
                    <div key={i} className="flex justify-between items-center p-4 hover:bg-pink-50 rounded-2xl transition-colors border border-transparent hover:border-pink-50">
                        <div className="flex gap-4 items-center">
                            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-lg">🌸</div>
                            <div>
                                <p className="text-gray-800 font-bold text-sm">{order.customer?.name}</p>
                                <p className="text-xs text-gray-400">{order.productName} (x{order.quantity})</p>
                            </div>
                        </div>
                        <div className="text-left">
                            <p className="text-[#BB015E] font-black text-sm">{order.total} جنيه</p>
                            <span className="text-[10px] text-gray-400 font-bold">{order.date}</span>
                        </div>
                    </div>
                ))}
                {data.orders.length === 0 && (
                    <div className="py-10 text-center text-gray-400 text-sm font-bold animate-pulse">
                        بانتظار أول طلب في متجرك الجميل... ✨
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
