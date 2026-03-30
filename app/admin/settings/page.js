"use client"
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../../data/supabase';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    storeName: '',
    contactEmail: '',
    shippingFee: 0,
    currency: 'جنيه مصري'
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const data = db.settings.get();
    if (data) {
        setSettings(data);
    }
    setIsLoaded(true);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    db.settings.update(settings);
    alert('تم حفظ الإعدادات بنجاح! ✨');
    // Force a small delay then refresh if needed, but alert is enough for now
  };

  if (!isLoaded) return <div className="p-20 text-center text-pink-500 font-bold">جاري تحميل الإعدادات... 🌸</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="bg-white p-6 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-xl border-4 border-pink-50">
        <h2 className="text-xl lg:text-2xl font-bold text-[#BB015E] mb-10 border-b border-pink-50 pb-4 font-serif">🎀 إعدادات المتجر العامة</h2>
        
        <form onSubmit={handleSave} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <div className="text-right">
              <label className="block text-sm font-bold text-black mb-2 mr-2">اسم المتجر</label>
              <input 
                type="text" 
                value={settings.storeName}
                onChange={(e) => setSettings({...settings, storeName: e.target.value})}
                className="w-full p-4 rounded-2xl bg-pink-50 focus:bg-white border-2 border-transparent focus:border-[#BB015E] outline-none transition-all text-black font-bold"
                placeholder="Noury Beauty"
              />
            </div>
            <div className="text-right">
              <label className="block text-sm font-bold text-black mb-2 mr-2">بريد التواصل</label>
              <input 
                type="email" 
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                className="w-full p-4 rounded-2xl bg-pink-50 focus:bg-white border-2 border-transparent focus:border-[#BB015E] outline-none transition-all text-black font-bold"
                placeholder="contact@noury.com"
              />
            </div>
            <div className="text-right">
              <label className="block text-sm font-bold text-black mb-2 mr-2">رسوم الشحن الثابتة</label>
              <input 
                type="number" 
                value={settings.shippingFee}
                onChange={(e) => setSettings({...settings, shippingFee: e.target.value})}
                className="w-full p-4 rounded-2xl bg-pink-50 focus:bg-white border-2 border-transparent focus:border-[#BB015E] outline-none transition-all text-black font-bold"
              />
            </div>
            <div className="text-right">
              <label className="block text-sm font-bold text-black mb-2 mr-2">العملة</label>
              <input 
                type="text" 
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
                className="w-full p-4 rounded-2xl bg-pink-50 focus:bg-white border-2 border-transparent focus:border-[#BB015E] outline-none transition-all text-black font-bold"
              />
            </div>
          </div>

          <div className="mt-10 p-6 bg-pink-50 rounded-3xl border border-pink-100 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-sm text-gray-400 font-bold max-w-md text-center lg:text-right">
                تأكدي من صحة البيانات أعلاه، حيث تنعكس هذه المعلومات في الفواتير ورسائل التأكيد للعملاء.
            </div>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full lg:w-auto bg-[#BB015E] text-white px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-pink-200 transition-all"
            >
                حفظ التغييرات ✨
            </motion.button>
          </div>
        </form>
      </div>

      <div className="bg-white p-8 lg:p-10 rounded-[2rem] lg:rounded-[3rem] shadow-sm border border-red-50">
          <h3 className="text-xl font-bold text-red-500 mb-4">⚠️ المنطقة الخطرة</h3>
          <p className="text-gray-400 text-sm mb-6">
              مسح كافة البيانات من الذاكرة المحلية (سيؤدي ذلك إلى حذف كافة المنتجات والطلبات التي قمتِ بإضافتها).
          </p>
          <button 
            onClick={() => {
                if(confirm('سيتم مسح كل شيء! هل أنتِ متأكدة؟')) {
                    localStorage.clear();
                    window.location.reload();
                }
            }}
            className="text-red-500 border border-red-200 px-6 py-3 rounded-full font-bold hover:bg-red-50 transition-all text-xs"
          >
              تهيئة المشروع مـن جديد
          </button>
      </div>
    </div>
  );
}
