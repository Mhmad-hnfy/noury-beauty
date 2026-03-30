"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../../data/supabase';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(db.orders.list());
  }, []);

  const handleUpdateStatus = (id, status) => {
    db.orders.updateStatus(id, status);
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleDelete = (id) => {
    if (confirm('هل أنتِ متأكدة من حذف هذا الطلب؟')) {
        db.orders.delete(id);
        setOrders(orders.filter(o => o.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 lg:p-8 rounded-3xl shadow-sm border border-pink-100 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div>
           <h3 className="text-xl font-bold text-black">قائمة الطلبات ({orders.length}) ✨</h3>
           <p className="text-sm text-black/60 font-bold">تتبعي مبيعاتك وتواصلي مع عميلاتك</p>
        </div>
        <div className="flex gap-4">
            <div className="bg-blue-50 text-blue-600 px-6 py-2 rounded-full font-bold text-xs">
                {orders.filter(o => o.status === 'انتظار').length} في الانتظار
            </div>
            <div className="bg-green-50 text-green-600 px-6 py-2 rounded-full font-bold text-xs">
                {orders.filter(o => o.status === 'تم الشحن').length} تم الشحن
            </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] lg:rounded-[2.5rem] shadow-sm border border-pink-100 overflow-x-auto">
        <table className="w-full text-right border-collapse min-w-[800px]">
            <thead className="bg-pink-50 text-[#BB015E]">
                <tr>
                    <th className="p-4 lg:p-6 font-bold text-sm">بيانات العميلة</th>
                    <th className="p-4 lg:p-6 font-bold text-sm">المنتج</th>
                    <th className="p-4 lg:p-6 font-bold text-sm">الإجمالي</th>
                    <th className="p-4 lg:p-6 font-bold text-sm">التاريخ</th>
                    <th className="p-4 lg:p-6 font-bold text-sm">الحالة</th>
                    <th className="p-4 lg:p-6 font-bold text-sm">الإجراءات</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-pink-50 text-xs">
                <AnimatePresence>
                    {orders.map((order) => (
                        <motion.tr 
                            key={order.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="hover:bg-pink-50/50 transition-colors group"
                        >
                            <td className="p-4 lg:p-6">
                                <div className="font-bold text-black text-sm mb-1">{order.customer?.name}</div>
                                <div className="text-[#BB015E] font-bold mb-1">{order.customer?.phone}</div>
                                <div className="text-[10px] text-black/70 font-bold">{order.customer?.city || 'غير محدد'}، {order.customer?.address || 'بدون عنوان'}</div>
                            </td>
                            <td className="p-4 lg:p-6">
                                <div className="font-bold text-black">{order.productName || 'منتج غير معروف'}</div>
                                <div className="text-black/80 font-bold">الكمية: {order.quantity}</div>
                            </td>
                            <td className="p-4 lg:p-6 font-black text-gray-800 text-sm">{order.total} جنيه</td>
                            <td className="p-4 lg:p-6 text-gray-400 text-[10px]">{order.date}</td>
                            <td className="p-4 lg:p-6">
                                <span className={`px-4 py-2 rounded-xl font-bold text-[10px] ${
                                    order.status === 'انتظار' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                }`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="p-4 lg:p-6">
                                <div className="flex gap-2">
                                    {order.status === 'انتظار' ? (
                                        <button 
                                            onClick={() => handleUpdateStatus(order.id, 'تم الشحن')}
                                            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition-colors"
                                            title="تعليم كـ تم الشحن"
                                        >
                                            ✅
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => handleUpdateStatus(order.id, 'انتظار')}
                                            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                                            title="تعليم كـ في الانتظار"
                                        >
                                            ⏳
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDelete(order.id)}
                                        className="bg-red-100 text-red-500 p-2 rounded-lg hover:bg-red-200 transition-colors"
                                        title="حذف الطلب"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </td>
                        </motion.tr>
                    ))}
                </AnimatePresence>
            </tbody>
        </table>
        {orders.length === 0 && (
            <div className="p-20 text-center text-gray-400 font-bold animate-pulse">
                لا توجد طلبات حتى الآن. استمري في الإبداع! ✨🛍️
            </div>
        )}
      </div>
    </div>
  );
}
