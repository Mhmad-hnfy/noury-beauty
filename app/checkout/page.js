"use client"
import React, { useState, useEffect, Suspense } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useSearchParams } from 'next/navigation';
import { db } from '../../data/supabase';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  // Checkout Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    if (productId) {
      const list = db.products.list();
      const foundProduct = list.find(p => p.id === parseInt(productId));
      setProduct(foundProduct);
    }
  }, [productId]);

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const subtotal = product ? parseFloat(product.price) * quantity : 0;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.city) {
      alert('يرجى إكمال كافة البيانات المطلوبة 🌸');
      return;
    }

    db.orders.add({
      productName: product.name,
      productId: product.id,
      quantity,
      total: subtotal,
      customer: formData
    });

    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center animate-fade-in">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl border-4 border-pink-100 max-w-lg"
        >
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-[#BB015E] mb-4">تم استلام طلبك بنجاح!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            شكراً لثقتِ بكِ بـ **Noury Beauty**. سيقوم فريقنا بالتواصل معكِ قريباً لتأكيد الشحن.
          </p>
          <Link href="/" className="bg-[#BB015E] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-[#8F0147]">
            العودة للمتجر
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Customer Information Form */}
        <section className="space-y-8 order-2 lg:order-1">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-pink-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
               <span className="bg-pink-100 p-2 rounded-xl">📍</span> بيانات التوصيل
            </h2>
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="text-right">
                <label className="block text-sm font-bold text-black mb-2 mr-2">الاسم بالكامل</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 rounded-2xl bg-pink-50 border-2 border-transparent focus:border-[#BB015E] focus:bg-white outline-none transition-all text-black font-bold" 
                  placeholder="مثلاً: سارة محمد أحمد"
                />
              </div>
              <div className="text-right">
                <label className="block text-sm font-bold text-black mb-2 mr-2">رقم الهاتف</label>
                <input 
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full p-4 rounded-2xl bg-pink-50 border-2 border-transparent focus:border-[#BB015E] focus:bg-white outline-none transition-all text-black font-bold" 
                  placeholder="01xxxxxxxxx"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-right">
                  <label className="block text-sm font-bold text-black mb-2 mr-2">المحافظة</label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-pink-50 border-2 border-transparent focus:border-[#BB015E] focus:bg-white outline-none transition-all text-black font-bold" 
                    placeholder="القاهرة"
                  />
                </div>
                <div className="text-right">
                  <label className="block text-sm font-bold text-black mb-2 mr-2">العنوان بالتفصيل</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-pink-50 border-2 border-transparent focus:border-[#BB015E] focus:bg-white outline-none transition-all text-black font-bold" 
                    placeholder="رقم العقار، اسم الشارع، الشقة"
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-[#BB015E] hover:bg-[#8F0147] text-white font-bold py-5 rounded-full transition-all text-xl shadow-xl hover:shadow-pink-300 transform active:scale-95"
              >
                تأكيد ومتابعة الطلب
              </button>
            </form>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-pink-100">
             <h3 className="text-[#BB015E] font-bold mb-2">لماذا تشترين من Noury Beauty؟ ✨</h3>
             <p className="text-gray-500 text-sm italic leading-relaxed">
                نحن نضمن لكي منتجات أصلية 100%، وتوصيل سريع لباب المنزل مع إمكانية الدفع عند الاستلام والمعاينة قبل الدفع.
             </p>
          </div>
        </section>

        {/* Product Detail & Summary */}
        <div className="space-y-8 order-1 lg:order-2">
          {product ? (
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border-4 border-white overflow-hidden relative sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b border-pink-50 pb-4">مراجعة طلبك 🛍️</h2>
              
              <div className="space-y-6 mb-10 overflow-hidden">
                {/* Main Image Slider Area */}
                <div className="relative aspect-square w-full rounded-[2.5rem] overflow-hidden bg-pink-50 border-4 border-white shadow-inner mb-4">
                  <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeImageIndex}
                      src={product.images ? product.images[activeImageIndex] : product.image} 
                      alt={product.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover"
                    />
                  </AnimatePresence>
                </div>

                {/* Thumbnail Preview Reel */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-4 px-2 scrollbar-hide">
                    {product.images.map((img, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImageIndex === idx ? 'border-rose scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={img} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-6 items-center p-4 bg-pink-50 rounded-3xl border border-pink-100 mt-6 shadow-sm">
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-gray-800 mb-1">{product.name}</h3>
                    <div className="text-black font-black text-3xl">
                       <span className="text-sm font-medium text-black/60 mr-1">EGP</span> {product.price}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-pink-200 shadow-sm">
                     <button onClick={handleIncrease} className="text-rose font-black text-xl hover:scale-125 transition-transform">+</button>
                     <span className="font-black text-xl text-gray-700 min-w-[1.5rem] text-center">{quantity}</span>
                     <button onClick={handleDecrease} className="text-rose font-black text-xl hover:scale-125 transition-transform">-</button>
                  </div>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                <div className="flex justify-between text-lg text-gray-500">
                  <span>إجمالي السلع:</span>
                  <span>{subtotal} جنيه</span>
                </div>
                <div className="flex justify-between text-lg text-gray-500">
                  <span>الشحن:</span>
                  <span className="text-green-500 font-bold">0 جنيه (مجاني)</span>
                </div>
                <div className="h-px bg-pink-100 w-full mt-4"></div>
                <div className="flex justify-between text-3xl font-black text-[#BB015E]">
                  <span>الإجمالي الكلي:</span>
                  <span>{subtotal} جنيه</span>
                </div>
              </div>

              <p className="text-center text-gray-400 text-xs flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                خلاص ليكي حق المعاينة عند الاستلام
              </p>
            </div>
          ) : (
            <div className="animate-pulse bg-white p-20 rounded-3xl border border-pink-100 flex items-center justify-center">
                جاري تحميل تفاصيل المنتج...
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <div dir="rtl" className="bg-pink-50 min-h-screen flex flex-col font-sans">
      <Header />
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-[#BB015E]">جاري التحميل...</div>}>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </div>
  );
}
