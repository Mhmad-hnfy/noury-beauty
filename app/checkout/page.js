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
  const [provinces, setProvinces] = useState([]);
  const [settings, setSettings] = useState({});
  const [placedOrderDetails, setPlacedOrderDetails] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    phone2: '',
    address: '',
    province: '',
    shippingFee: 0,
    paymentMethod: 'paymob_wallet',
    walletNumber: '',
    paymentProof: '',
    selectedImage: ''
  });

  useEffect(() => {
    if (productId) {
      const list = db.products.list();
      const foundProduct = list.find(p => p.id === parseInt(productId));
      setProduct(foundProduct);
      if (foundProduct) {
        setFormData(prev => ({ ...prev, selectedImage: foundProduct.image }));
      }
    }
    setProvinces(db.shipping_fees.list());
    setSettings(db.settings.get());
  }, [productId]);

  const handleProvinceChange = (e) => {
    const provinceName = e.target.value;
    const province = provinces.find(p => p.name === provinceName);
    const fee = province ? province.fee : 0;
    setFormData({ ...formData, province: provinceName, shippingFee: fee });
  };

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const subtotal = product ? parseFloat(product.price) * quantity : 0;
  const total = subtotal + formData.shippingFee;
  const depositAmount = Math.round(total * 0.3);

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.province) {
      alert('يرجى إكمال كافة البيانات المطلوبة 🌸');
      return;
    }

    if (formData.paymentMethod === 'instapay' && !formData.paymentProof) {
      alert('يرجى إدخال كود التحويل أو رقم العملية لثبوت دفع العربون 🌸');
      return;
    }

    if (formData.paymentMethod === 'paymob_wallet' && !formData.walletNumber) {
      alert('يرجى إدخال رقم موبايل المحفظة 🌸');
      return;
    }

    setIsProcessing(true);

    const orderData = {
      productName: product.name,
      productId: product.id,
      quantity,
      subtotal,
      shippingFee: formData.shippingFee,
      total: total,
      depositAmount: depositAmount,
      paymentProof: formData.paymentProof || (formData.paymentMethod === 'paymob_wallet' ? 'PAYMOB-PENDING' : 'N/A'),
      paymentMethod: formData.paymentMethod,
      selectedImage: formData.selectedImage,
      customer: formData,
      walletNumber: formData.walletNumber,
      paymentStatus: 'pending'
    };

    // Save order locally first
    const newOrder = db.orders.add(orderData);
    setPlacedOrderDetails(newOrder);

    // If Paymob is selected, initiate payment
    if (formData.paymentMethod === 'paymob_wallet') {
      try {
        const response = await fetch('/api/paymob/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: depositAmount,
            billingData: formData,
            walletNumber: formData.walletNumber
          }),
        });

        const data = await response.json();
        if (data.error) {
          console.error('Paymob Error Detail:', data.error);
          throw new Error(data.error);
        }

        // Redirect to Paymob (using the redirection URL from API)
        if (data.redirectionUrl) {
          window.location.href = data.redirectionUrl;
        } else {
          // Fallback if direct pay failed
          window.location.href = `https://accept.paymob.com/api/acceptance/payments/pay?payment_token=${data.paymentKey}`;
        }
        return; // Don't set orderPlaced yet, we wait for callback
      } catch (err) {
        console.error('Payment Initiation Failed:', err);
        alert(`عذراً، حدث خطأ أثناء الاتصال ببوابة الدفع (${err.message}). يرجى المحاولة لاحقاً. 🌸`);
        setIsProcessing(false);
        return;
      }
    }

    setOrderPlaced(true);
    setIsProcessing(false);
  };

  if (orderPlaced && placedOrderDetails) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 animate-fade-in">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 lg:p-12 rounded-[3rem] shadow-2xl border-4 border-pink-100 max-w-2xl w-full"
        >
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-[#BB015E] mb-2">تم استلام طلبك بنجاح!</h2>
            <p className="text-gray-500">فاتورة الطلب رقم: <span className="font-bold text-black">{placedOrderDetails.id}</span></p>
          </div>

          <div className="space-y-6 border-y border-pink-50 py-8 my-8">
            <div className="flex flex-col md:flex-row gap-6 items-center border-b border-pink-50 pb-6 mb-6">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-pink-50 shadow-sm flex-shrink-0">
                <img src={placedOrderDetails.selectedImage} className="w-full h-full object-cover" />
              </div>
              <div className="text-center md:text-right">
                <h4 className="text-xl font-black text-gray-800">{placedOrderDetails.productName}</h4>
                <p className="text-[#BB015E] font-bold">الكمية: {placedOrderDetails.quantity}</p>
                <p className="text-gray-400 text-xs">تم اختيار هذا اللون/الموديل خصيصاً ✨</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-bold">العنوان:</span>
              <span>{placedOrderDetails.customer.province}، {placedOrderDetails.customer.address}</span>
            </div>
            <div className="flex justify-between items-center text-gray-700">
              <span className="font-bold">أرقام التواصل:</span>
              <div className="text-left font-sans">
                <div>{placedOrderDetails.customer.phone}</div>
                {placedOrderDetails.customer.phone2 && <div>{placedOrderDetails.customer.phone2}</div>}
              </div>
            </div>
            
            <div className="pt-4 border-t border-pink-50 space-y-3">
              <div className="flex justify-between text-gray-500">
                <span>إجمالي السلع:</span>
                <span>{placedOrderDetails.subtotal} ج.م</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>مصاريف الشحن:</span>
                <span>{placedOrderDetails.shippingFee} ج.م</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-black pt-2">
                <span>الإجمالي الكلي:</span>
                <span>{placedOrderDetails.total} ج.م</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-green-600 bg-green-50 p-3 rounded-2xl border border-green-100">
                <span>العربون المدفوع (30%):</span>
                <span>{placedOrderDetails.depositAmount} ج.م</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#BB015E]">
                <span>المتبقي عند الاستلام:</span>
                <span>{placedOrderDetails.total - placedOrderDetails.depositAmount} ج.م</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-6">
            <p className="text-gray-500 text-sm leading-relaxed">
              تم تسجيل الطلب وإثبات العربون بكود: <span className="font-bold text-black">{placedOrderDetails.paymentProof}</span>. سيقوم فريقنا بالتواصل معكِ قريباً لتأكيد الشحن.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.print()}
                className="bg-white border-2 border-[#BB015E] text-[#BB015E] px-8 py-4 rounded-full font-bold hover:bg-pink-50 transition-all flex items-center justify-center gap-2"
              >
                <span>🖨️</span> طباعة الفاتورة
              </button>
              <Link href="/" className="bg-[#BB015E] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-[#8F0147] transition-all flex items-center justify-center">
                العودة للمتجر
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Customer Information Form */}
        <section className="space-y-8 order-2 lg:order-1">
          <div className="bg-white p-6 lg:p-10 rounded-[2.5rem] shadow-sm border border-pink-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
               <span className="bg-pink-100 p-2 rounded-xl">📍</span> بيانات التوصل
            </h2>
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <div className="text-right">
                <label className="block text-sm font-bold text-black mb-2 mr-2">الاسم بالكامل</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-4 rounded-2xl bg-pink-50 border-2 border-transparent focus:border-[#BB015E] focus:bg-white outline-none transition-all text-black font-bold" 
                  placeholder="مثلاً: سارة محمد أحمد"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-right">
                  <label className="block text-sm font-bold text-black mb-2 mr-2">رقم الهاتف (أساسي)</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-pink-50 border-2 border-transparent focus:border-[#BB015E] focus:bg-white outline-none transition-all text-black font-bold font-sans" 
                    placeholder="01xxxxxxxxx"
                  />
                </div>
                <div className="text-right">
                  <label className="block text-sm font-bold text-black mb-2 mr-2">رقم هاتف ثانٍ (اختياري)</label>
                  <input 
                    type="tel" 
                    value={formData.phone2}
                    onChange={(e) => setFormData({...formData, phone2: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-pink-50 border-2 border-transparent focus:border-[#BB015E] focus:bg-white outline-none transition-all text-black font-bold font-sans" 
                    placeholder="01xxxxxxxxx"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-right">
                  <label className="block text-sm font-bold text-black mb-2 mr-2">المحافظة</label>
                  <select 
                    required
                    value={formData.province}
                    onChange={handleProvinceChange}
                    className="w-full p-4 rounded-2xl bg-pink-50 border-2 border-transparent focus:border-[#BB015E] focus:bg-white outline-none transition-all text-black font-bold appearance-none cursor-pointer"
                  >
                    <option value="">اختر المحافظة</option>
                    {provinces.map(p => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="text-right">
                  <label className="block text-sm font-bold text-black mb-2 mr-2">العنوان بالتفصيل</label>
                  <input 
                    type="text" 
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full p-4 rounded-2xl bg-pink-50 border-2 border-transparent focus:border-[#BB015E] focus:bg-white outline-none transition-all text-black font-bold" 
                    placeholder="رقم العقار، اسم الشارع، الشقة"
                  />
                </div>
              </div>

              {/* Payment Section (Deposit) */}
              <div className="bg-pink-50/50 p-6 lg:p-8 rounded-[2rem] border-2 border-pink-100 mt-8 space-y-6">
                <h3 className="text-xl font-bold text-[#BB015E] flex items-center gap-2">
                  <span>💳</span> تأكيد حجز الطلب (عربون 30%)
                </h3>
                <p className="text-sm text-gray-600 bg-white p-4 rounded-2xl border border-pink-100 leading-relaxed">
                  نظراً لخصوصية منتجاتنا وطلبات الشحن، يرجى تحويل عربون بقيمة <span className="text-[#BB015E] font-black text-lg">30%</span> من إجمالي الطلب لتأكيد الحجز.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col items-center gap-3 ${formData.paymentMethod === 'paymob_wallet' ? 'border-[#BB015E] bg-white shadow-xl scale-105' : 'border-pink-100 bg-pink-50/30'}`} onClick={() => setFormData({...formData, paymentMethod: 'paymob_wallet'})}>
                    <div className="text-5xl">📱</div>
                    <div className="text-center">
                        <div className="font-black text-lg">محفظة إلكترونية</div>
                        <div className="text-[10px] text-gray-400 mt-1">فودافون كاش، اتصالات، إلخ (Paymob)</div>
                    </div>
                  </div>
                  
                  <div className={`p-6 rounded-[2rem] border-2 transition-all cursor-pointer flex flex-col items-center gap-3 ${formData.paymentMethod === 'instapay' ? 'border-[#BB015E] bg-white shadow-xl scale-105' : 'border-pink-100 bg-pink-50/30'}`} onClick={() => setFormData({...formData, paymentMethod: 'instapay'})}>
                    <div className="text-5xl">⚡</div>
                    <div className="text-center">
                        <div className="font-black text-lg">إنستا باي</div>
                        <div className="text-[11px] font-sans text-[#BB015E] mt-1 font-bold">{settings.instaPay}</div>
                    </div>
                  </div>
                </div>

                {formData.paymentMethod === 'instapay' && (
                  <div className="text-right">
                    <label className="block text-sm font-bold text-black mb-2 mr-2">كود التحويل / رقم العملية</label>
                    <input 
                      type="text" 
                      required
                      value={formData.paymentProof}
                      onChange={(e) => setFormData({...formData, paymentProof: e.target.value})}
                      className="w-full p-4 rounded-2xl bg-white border-2 border-transparent focus:border-[#BB015E] outline-none transition-all text-black font-bold" 
                      placeholder="أدخلي كود التأكيد هنا..."
                    />
                    <p className="text-[10px] text-gray-400 mt-2 mr-2 italic">يرجى تحويل العربون أولاً للرقم أعلاه ثم إدخال رقم العملية.</p>
                  </div>
                )}
                
                {formData.paymentMethod === 'paymob_wallet' && (
                   <div className="space-y-4">
                     <div className="text-right">
                        <label className="block text-sm font-bold text-black mb-2 mr-2">رقم موبايل المحفظة</label>
                        <input 
                          type="tel" 
                          required
                          value={formData.walletNumber}
                          onChange={(e) => setFormData({...formData, walletNumber: e.target.value})}
                          className="w-full p-4 rounded-2xl bg-white border-2 border-transparent focus:border-[#BB015E] outline-none transition-all text-black font-bold font-sans" 
                          placeholder="01xxxxxxxxx"
                        />
                        <p className="text-[10px] text-gray-400 mt-2 mr-2 italic">يرجى إدخال رقم الموبايل المسجل عليه المحفظة (فودافون كاش، إلخ).</p>
                     </div>
                     <p className="text-[10px] text-green-600 font-bold bg-green-50 p-3 rounded-xl border border-green-100 text-center">
                        سيتم تحويلك لصفحة تأكيد الدفع فور الضغط على الزر أدناه ✨
                     </p>
                   </div>
                )}
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className={`w-full ${isProcessing ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#BB015E] hover:bg-[#8F0147]'} text-white font-bold py-5 rounded-full transition-all text-xl shadow-xl hover:shadow-pink-300 transform active:scale-95 flex items-center justify-center gap-2`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    جاري معالجة الدفع...
                  </>
                ) : (
                  'تأكيد وبدأ التوصيل 🌸'
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Product Detail & Summary */}
        <div className="space-y-8 order-1 lg:order-2">
          {product ? (
            <div className="bg-white p-6 lg:p-10 rounded-[3rem] shadow-xl border-4 border-white overflow-hidden relative sticky top-24">
              <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b border-pink-50 pb-4">مراجعة طلبك 🛍️</h2>
              
              <div className="space-y-6 mb-10">
                {/* Main Product Image Detail (Dynamic) */}
                <div className="flex flex-col gap-6">
                  <div className="w-full aspect-square rounded-[3rem] overflow-hidden border-4 border-pink-50 shadow-inner bg-pink-50 relative group">
                    <img 
                      src={formData.selectedImage || (product.images ? product.images[0] : product.image)} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white shadow-sm text-[10px] font-bold text-[#BB015E]">
                      ✨ المعاينة المختارة
                    </div>
                  </div>

                  {/* Image Selector Reel */}
                  {product.images && product.images.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-gray-400 mr-2">اختاري اللون / الشكل المفضل لديكِ: 🎨</p>
                      <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
                        {product.images.map((img, idx) => (
                          <button 
                            key={idx}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, selectedImage: img }));
                              setActiveImageIndex(idx);
                            }}
                            className={`relative w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all flex-shrink-0 shadow-sm transform hover:scale-105 active:scale-95 ${
                              formData.selectedImage === img ? 'border-[#BB015E] ring-4 ring-pink-100 scale-110' : 'border-white opacity-60'
                            }`}
                          >
                            <img src={img} className="w-full h-full object-cover" />
                            {formData.selectedImage === img && (
                              <div className="absolute inset-0 bg-[#BB015E]/10 flex items-center justify-center">
                                <span className="bg-white text-[#BB015E] rounded-full w-5 h-5 flex items-center justify-center text-[10px]">✓</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 items-center bg-pink-50 p-6 rounded-[2.5rem] border border-pink-100">
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-gray-800">{product.name}</h3>
                      <div className="text-sm font-bold text-gray-400">{product.price} ج.م</div>
                    </div>
                    <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-pink-200 shadow-sm">
                       <button type="button" onClick={handleDecrease} className="text-[#BB015E] font-black text-xl hover:scale-125 transition-transform">-</button>
                       <span className="font-black text-xl text-gray-700 min-w-[1.5rem] text-center">{quantity}</span>
                       <button type="button" onClick={handleIncrease} className="text-[#BB015E] font-black text-xl hover:scale-125 transition-transform">+</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm text-gray-500 font-bold">
                  <span>إجمالي السلع:</span>
                  <span>{subtotal} ج.م</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 font-bold">
                  <span>الشحن ({formData.province || 'لم تحدد'}):</span>
                  <span>{formData.shippingFee} ج.م</span>
                </div>
                <div className="h-px bg-pink-100 w-full mt-2"></div>
                <div className="flex justify-between text-xl font-black text-black">
                  <span>الإجمالي الكلي:</span>
                  <span>{total} ج.م</span>
                </div>
                
                <div className="mt-6 p-4 rounded-3xl bg-yellow-50 border border-yellow-100 space-y-3">
                  <div className="flex justify-between text-yellow-700 font-bold">
                    <span>العربون المطلوب (30%):</span>
                    <span>{depositAmount} ج.م</span>
                  </div>
                  <div className="flex justify-between text-[#BB015E] font-black text-lg pt-2 border-t border-yellow-200/50">
                    <span>الباقي عند الاستلام:</span>
                    <span>{total - depositAmount} ج.م</span>
                  </div>
                </div>
              </div>

              <p className="text-center text-gray-400 text-[10px] flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
                خلاص ليكي حق المعاينة عند الاستلام لضمان الجودة
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
