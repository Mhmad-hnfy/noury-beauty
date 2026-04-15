"use client";

import React, { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabase';

export default function ShippingManager() {
    const { shippingRates, isShippingLoading, fetchShippingRates, t, isRTL } = useStore();
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    const [formData, setFormData] = useState({
        name_ar: '',
        name_en: '',
        price: ''
    });

    const resetForm = () => {
        setFormData({ name_ar: '', name_en: '', price: '' });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!supabase) {
                alert("Supabase not configured.");
                setLoading(false);
                return;
            }

            if (editingId) {
                const { error } = await supabase
                    .from('shipping_rates')
                    .update({
                        name_ar: formData.name_ar,
                        name_en: formData.name_en,
                        price: parseFloat(formData.price)
                    })
                    .eq('id', editingId);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('shipping_rates')
                    .insert([{
                        name_ar: formData.name_ar,
                        name_en: formData.name_en,
                        price: parseFloat(formData.price)
                    }]);
                if (error) throw error;
            }

            await fetchShippingRates();
            resetForm();
            alert(isRTL ? "تم الحفظ بنجاح" : "Saved successfully");
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (rate) => {
        setEditingId(rate.id);
        setFormData({
            name_ar: rate.name_ar,
            name_en: rate.name_en,
            price: rate.price.toString()
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm(isRTL ? 'هل أنت متأكد؟' : 'Are you sure?')) return;
        try {
            if (supabase) {
                const { error } = await supabase.from('shipping_rates').delete().eq('id', id);
                if (error) throw error;
            }
            await fetchShippingRates();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="flex flex-col gap-10">
            {/* Form Section */}
            <div className="bg-white p-8 border border-gray-100 rounded-sm shadow-sm">
                <h3 className="text-xl font-serif text-black mb-6">
                    {editingId ? (isRTL ? 'تعديل محافظة' : 'Edit Governorate') : (isRTL ? 'إضافة محافظة جديدة' : 'Add New Governorate')}
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <InputGroup 
                        label={isRTL ? "الاسم (بالعربي)" : "Name (Arabic)"} 
                        value={formData.name_ar} 
                        onChange={(v) => setFormData({...formData, name_ar: v})} 
                        placeholder="مثلاً: القاهرة" 
                        required 
                    />
                    <InputGroup 
                        label={isRTL ? "الاسم (بالإنجليزي)" : "Name (English)"} 
                        value={formData.name_en} 
                        onChange={(v) => setFormData({...formData, name_en: v})} 
                        placeholder="e.g. Cairo" 
                        required 
                    />
                    <InputGroup 
                        label={isRTL ? "سعر الشحن" : "Shipping Price"} 
                        type="number"
                        value={formData.price} 
                        onChange={(v) => setFormData({...formData, price: v})} 
                        placeholder="50" 
                        required 
                    />
                    <div className="md:col-span-3 flex gap-4 mt-4">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="bg-[#6d1616] text-white h-12 px-10 font-bold text-[10px] uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                        >
                            {loading ? t('admin_update') : (editingId ? t('admin_update') : t('admin_add_product'))}
                        </button>
                        {editingId && (
                            <button 
                                type="button"
                                onClick={resetForm}
                                className="border border-gray-200 text-gray-400 h-12 px-10 font-bold text-[10px] uppercase tracking-widest hover:text-black hover:border-black transition-all"
                            >
                                {isRTL ? 'إلغاء' : 'Cancel'}
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* List Section */}
            <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {isShippingLoading ? (
                        <div className="p-20 flex justify-center">
                            <div className="w-8 h-8 border-4 border-[#6d1616] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : shippingRates.length > 0 ? (
                        <table className="w-full text-left text-sm min-w-[600px]">
                            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                <tr>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'المحافظة' : 'Governorate'}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>{isRTL ? 'سعر الشحن' : 'Shipping Price'}</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {shippingRates.map(rate => (
                                    <tr key={rate.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-black">{isRTL ? rate.name_ar : rate.name_en}</span>
                                                <span className="text-[10px] text-gray-400">{isRTL ? rate.name_en : rate.name_ar}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-serif text-black">{rate.price} EGP</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4">
                                                <button 
                                                    onClick={() => handleEdit(rate)}
                                                    className="text-blue-400 hover:text-blue-700 font-bold text-[10px] uppercase tracking-widest transition-colors"
                                                >
                                                    {t('admin_edit')}
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(rate.id)}
                                                    className="text-red-400 hover:text-red-700 font-bold text-[10px] uppercase tracking-widest transition-colors"
                                                >
                                                    {t('admin_delete')}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-20 text-center text-gray-400 font-medium italic">
                            No shipping rates defined yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function InputGroup({ label, placeholder, type="text", value, onChange, required=false }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</label>
            <input 
                type={type}
                required={required}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:outline-none focus:border-[#6d1616] text-sm font-medium transition-all"
            />
        </div>
    );
}
