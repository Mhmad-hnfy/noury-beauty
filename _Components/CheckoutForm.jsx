"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const InputField = ({ label, placeholder, type = "text", value, onChange, required = false }) => (
  <div className={`flex flex-col gap-1.5 w-full`}>
    <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{label}</label>
    <input 
      type={type} 
      required={required}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-[#c19a2e] focus:ring-1 focus:ring-[#c19a2e] transition-all text-sm"
    />
  </div>
);

export default function CheckoutForm({ onShippingChange }) {
  const { t, isRTL, shippingRates, cart, clearCart } = useStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    identity: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    governorate: '',
    postalCode: '',
    phone: '',
    phone2: '',
    paymentMethod: 'instapay'
  });

  const handleGovernateChange = (val) => {
    setFormData({...formData, governorate: val});
    const selectedRate = shippingRates.find(r => r.name_ar === val || r.name_en === val);
    if (onShippingChange) {
        onShippingChange(selectedRate ? selectedRate.price : 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        let itemsToOrder = [];
        const singleItem = JSON.parse(localStorage.getItem('noury_checkout_item')) || null;
        
        if (singleItem) {
          itemsToOrder = [singleItem];
        } else if (cart && cart.length > 0) {
          itemsToOrder = cart;
        }

        if (itemsToOrder.length === 0) throw new Error("No products in checkout. Please select a product first.");

        // Get shipping price for total calculation
        const rate = shippingRates.find(r => r.name_ar === formData.governorate || r.name_en === formData.governorate);
        const shippingPrice = rate ? rate.price : 0;
        
        const subtotal = itemsToOrder.reduce((total, item) => {
          const price = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
          return total + (price * item.qty);
        }, 0);
        
        const finalTotal = subtotal + shippingPrice;

        if (!supabase) {
            console.log("Order details (Demo Mode):", {
                customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
                customer_phone: `${formData.phone} / ${formData.phone2}`,
                total_amount: finalTotal,
                shipping_address: `${formData.address}, ${formData.governorate}`
            });
        } else {
            const { error } = await supabase
                .from('orders')
                .insert([{
                    customer_name: `${formData.firstName} ${formData.lastName}`.trim(),
                    customer_email: formData.identity,
                    total_amount: finalTotal,
                    status: 'pending',
                    items: itemsToOrder,
                    customer_phone: `${formData.phone} / ${formData.phone2}`,
                    governorate: formData.governorate,
                    payment_method: formData.paymentMethod,
                    shipping_address: `${formData.address}, ${formData.apartment}, ${formData.city}, ${formData.governorate}`
                }]);

            if (error) throw error;
            
            localStorage.removeItem('noury_checkout_item');
            clearCart();
            alert(isRTL ? "تم ثبت طلبك بنجاح!" : "Order placed successfully!");
            router.push('/');
        }
    } catch (err) {
        alert("Error placing order: " + err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10 py-10" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Contact Section */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-end">
          <h2 className="text-xl font-medium text-gray-900">{t('checkout_contact')}</h2>
          {!supabase && (
            <span className="text-[10px] bg-yellow-100 text-yellow-700 font-bold px-2 py-1 rounded-sm uppercase tracking-widest">
                Demo Mode (No DB)
            </span>
          )}
        </div>
        <InputField 
            label={isRTL ? "البريد الإلكتروني (اختياري)" : "Email Address (Optional)"} 
            placeholder={isRTL ? "البريد الإلكتروني" : "Email Address"} 
            value={formData.identity}
            onChange={(v) => setFormData({...formData, identity: v})}
        />
      </section>

      {/* Delivery Section */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-medium text-gray-900">{t('checkout_delivery')}</h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField 
                label={isRTL ? "الاسم الأول" : "First name"} 
                placeholder={isRTL ? "الاسم الأول" : "First name"} 
                value={formData.firstName}
                onChange={(v) => setFormData({...formData, firstName: v})}
                required
            />
            <InputField 
                label={isRTL ? "اسم العائلة" : "Last name"} 
                placeholder={isRTL ? "اسم العائلة" : "Last name"} 
                value={formData.lastName}
                onChange={(v) => setFormData({...formData, lastName: v})}
                required
            />
          </div>
          
          {/* Governorate Selection */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                {isRTL ? "المحافظة" : "Governorate"}
            </label>
            <select 
                required
                value={formData.governorate}
                onChange={(e) => handleGovernateChange(e.target.value)}
                className="w-full h-12 px-4 border border-gray-200 rounded-md focus:outline-none focus:border-[#c19a2e] focus:ring-1 focus:ring-[#c19a2e] transition-all text-sm bg-white"
            >
                <option value="">{isRTL ? "اختر المحافظة" : "Select Governorate"}</option>
                {shippingRates.map(rate => (
                    <option key={rate.id} value={isRTL ? rate.name_ar : rate.name_en}>
                        {isRTL ? rate.name_ar : rate.name_en} (+{rate.price} EGP)
                    </option>
                ))}
            </select>
          </div>

          <InputField 
            label={isRTL ? "العنوان" : "Address"} 
            placeholder={isRTL ? "العنوان بالتفصيل" : "Address"} 
            value={formData.address}
            onChange={(v) => setFormData({...formData, address: v})}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField 
                label={isRTL ? "رقم الهاتف الأول" : "Primary Phone Number"} 
                placeholder="01xxxxxxxxx" 
                value={formData.phone}
                onChange={(v) => setFormData({...formData, phone: v})}
                required
            />
            <InputField 
                label={isRTL ? "رقم الهاتف الثاني (إجباري)" : "Secondary Phone Number (Required)"} 
                placeholder="01xxxxxxxxx" 
                value={formData.phone2}
                onChange={(v) => setFormData({...formData, phone2: v})}
                required
            />
          </div>
        </div>
      </section>

      {/* Shipping Method Section */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-medium text-gray-900">{t('checkout_shipping')}</h2>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md flex justify-between items-center text-sm">
          <span className="text-gray-600">{isRTL ? "شحن قياسي حسب المنطقة" : "Standard Shipping by Region"}</span>
          <span className="font-semibold text-gray-900">
             {shippingRates.find(r => r.name_ar === formData.governorate || r.name_en === formData.governorate)?.price || 0} EGP
          </span>
        </div>
      </section>

      {/* Payment Section */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl font-medium text-gray-900">{t('checkout_payment')}</h2>
        <div className="border border-gray-200 rounded-md overflow-hidden">
          <div className="p-4 flex items-center gap-3 border-b border-gray-200 bg-gray-50">
            <input 
                type="radio" name="payment" id="p1" className="w-4 h-4 accent-[#c19a2e]" 
                checked={formData.paymentMethod === 'instapay'}
                onChange={() => setFormData({...formData, paymentMethod: 'instapay'})}
            />
            <label htmlFor="p1" className="text-sm font-medium flex-1 cursor-pointer">
               {isRTL ? "انستا باي / فودافون كاش" : "Instapay / Vodafone Cash"}
            </label>
          </div>
          <div className="p-4 flex items-center gap-3">
            <input 
                type="radio" name="payment" id="p2" className="w-4 h-4 accent-[#c19a2e]" 
                checked={formData.paymentMethod === 'cod'}
                onChange={() => setFormData({...formData, paymentMethod: 'cod'})}
            />
            <label htmlFor="p2" className="text-sm font-medium flex-1 cursor-pointer">
              {isRTL ? "الدفع عند الاستلام" : "Cash on Delivery (COD)"}
            </label>
          </div>
        </div>
      </section>

      <button 
        type="submit"
        disabled={loading}
        className="w-full h-16 bg-[#1a1a1a] text-white font-bold text-sm uppercase tracking-[0.2em] rounded-md hover:opacity-90 transition-opacity mt-4 disabled:opacity-50"
      >
        {loading ? (isRTL ? "جاري المعالجة..." : "Processing...") : t('complete_order')}
      </button>
    </form>
  );
}
