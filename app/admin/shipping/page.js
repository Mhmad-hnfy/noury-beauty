"use client"
import React, { useState, useEffect } from 'react';
import { db } from '../../../data/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShippingManagement() {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProvince, setCurrentProvince] = useState({ name: '', fee: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = () => {
    setProvinces(db.shipping_fees.list());
    setLoading(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!currentProvince.name || currentProvince.fee === '') return;

    if (isEditing) {
      db.shipping_fees.update(currentProvince);
    } else {
      db.shipping_fees.add(currentProvince);
    }

    fetchProvinces();
    setIsModalOpen(false);
    setCurrentProvince({ name: '', fee: '' });
    setIsEditing(false);
  };

  const handleEdit = (province) => {
    setCurrentProvince(province);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('هل أنتِ متأكدة من حذف هذه المحافظة؟')) {
      db.shipping_fees.delete(id);
      fetchProvinces();
    }
  };

  if (loading) return <div className="text-center py-20 text-[#BB015E] font-bold">جاري التحميل...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-pink-50">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">إدارة أسعار الشحن 🚚</h2>
          <p className="text-gray-500 text-sm">حددي تكلفة التوصيل لكل محافظة</p>
        </div>
        <button 
          onClick={() => { setIsEditing(false); setCurrentProvince({ name: '', fee: '' }); setIsModalOpen(true); }}
          className="bg-[#BB015E] text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-pink-100 hover:bg-[#8F0147] transition-all flex items-center gap-2"
        >
          <span>➕</span> إضافة محافظة
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-50 overflow-hidden">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-pink-50 text-gray-600 font-bold">
              <th className="p-6">المحافظة</th>
              <th className="p-6">سعر الشحن (ج.م)</th>
              <th className="p-6 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-50">
            {provinces.length > 0 ? provinces.map((item) => (
              <tr key={item.id} className="hover:bg-pink-50 transition-colors">
                <td className="p-6 font-bold text-gray-700">{item.name}</td>
                <td className="p-6">
                  <span className="bg-green-50 text-green-600 px-4 py-2 rounded-full font-bold">
                    {item.fee} ج.م
                  </span>
                </td>
                <td className="p-6">
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => handleEdit(item)}
                      className="p-3 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors"
                      title="تعديل"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                      title="حذف"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="p-20 text-center text-gray-400 font-medium">لا توجد محافظات مضافة بعد.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 border-4 border-pink-50 overflow-hidden"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <span className="bg-pink-100 p-2 rounded-xl">📍</span>
                {isEditing ? 'تعديل محافظة' : 'إضافة محافظة جديدة'}
              </h3>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 mr-2">اسم المحافظة</label>
                  <input 
                    type="text" 
                    value={currentProvince.name}
                    onChange={(e) => setCurrentProvince({...currentProvince, name: e.target.value})}
                    placeholder="مثلاً: القاهرة"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#BB015E] focus:bg-white outline-none transition-all font-bold"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 mr-2">سعر الشحن (جنيه)</label>
                  <input 
                    type="number" 
                    value={currentProvince.fee}
                    onChange={(e) => setCurrentProvince({...currentProvince, fee: parseFloat(e.target.value)})}
                    placeholder="50"
                    className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#BB015E] focus:bg-white outline-none transition-all font-bold"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit"
                    className="flex-1 bg-[#BB015E] text-white py-4 rounded-2xl font-bold hover:bg-[#8F0147] shadow-lg shadow-pink-100 transition-all"
                  >
                    {isEditing ? 'حفظ التعديلات' : 'إضافة الآن'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 rounded-2xl bg-gray-100 text-gray-500 font-bold hover:bg-gray-200 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
