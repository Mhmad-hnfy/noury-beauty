"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';

export default function NewProduct() {
    const router = useRouter();
    const { fetchProducts } = useStore();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        oldPrice: '',
    });

    const [variants, setVariants] = useState([]);

    const addVariant = () => {
        setVariants([...variants, { color: '#000000', colorName: '', imageFile: null, preview: null }]);
    };

    const updateVariant = (index, field, value) => {
        const newVariants = [...variants];
        if (field === 'imageFile') {
            newVariants[index].imageFile = value;
            newVariants[index].preview = URL.createObjectURL(value);
        } else {
            newVariants[index][field] = value;
        }
        setVariants(newVariants);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (variants.length === 0) {
            alert("Please add at least one color/variant");
            return;
        }
        setLoading(true);

        try {
            const finalVariants = [];
            const allImages = [];
            const allColors = [];

            // 1. Upload Images for each variant to Supabase Storage
            for (const v of variants) {
                let publicUrl = v.preview; // Fallback if no new file

                if (v.imageFile) {
                    const fileExt = v.imageFile.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                    
                    const { data, error: uploadError } = await supabase.storage
                        .from('products')
                        .upload(fileName, v.imageFile);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl: url } } = supabase.storage
                        .from('products')
                        .getPublicUrl(fileName);
                    
                    publicUrl = url;
                }

                finalVariants.push({
                    color: v.color,
                    colorName: v.colorName,
                    image: publicUrl
                });
                
                if (publicUrl) allImages.push(publicUrl);
                allColors.push(v.color);
            }

            // 2. Save Product record to Supabase Table
            const { error: insertError } = await supabase
                .from('products')
                .insert([{
                    title: formData.title,
                    price: parseFloat(formData.price),
                    old_price: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
                    colors: allColors,
                    images: allImages,
                    variants: finalVariants,
                    created_at: new Date().toISOString()
                }]);

            if (insertError) throw insertError;

            await fetchProducts();
            router.push('/admin/products');
        } catch (err) {
            console.error("Error:", err.message);
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl flex flex-col gap-10 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-serif text-black">Add New Product</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Variants & Image Mapping enabled</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                
                {/* Section 1: Basic Info */}
                <div className="bg-white p-10 border border-gray-100 rounded-sm shadow-sm flex flex-col gap-8">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6d1616] border-b border-gray-50 pb-4">Basic Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <InputGroup label="Product Title" value={formData.title} onChange={(v) => setFormData({...formData, title: v})} placeholder="e.g. Matte Lipstick" required />
                        <InputGroup label="Price (EGP)" type="number" value={formData.price} onChange={(v) => setFormData({...formData, price: v})} placeholder="0.00" required />
                        <InputGroup label="Old Price (Optional)" type="number" value={formData.oldPrice} onChange={(v) => setFormData({...formData, oldPrice: v})} placeholder="0.00" />
                    </div>
                </div>

                {/* Section 2: Variants (The Core) */}
                <div className="bg-white p-10 border border-gray-100 rounded-sm shadow-sm flex flex-col gap-8">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6d1616]">Product Variants (Colors & Images)</h4>
                        <button 
                            type="button" 
                            onClick={addVariant}
                            className="text-[10px] font-bold text-[#6d1616] hover:text-black transition-colors uppercase tracking-widest flex items-center gap-2"
                        >
                            <span className="text-xl">+</span> Add New Color Variant
                        </button>
                    </div>

                    <div className="flex flex-col gap-6">
                        {variants.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-50 rounded-sm bg-gray-50/30 gap-4">
                                <p className="text-gray-400 text-xs font-medium italic">No variants added yet. Click above to add your first color.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {variants.map((v, idx) => (
                                    <div key={idx} className="group relative bg-gray-50 p-6 rounded-sm border border-gray-100 flex flex-col gap-6 hover:shadow-md transition-all">
                                        <button 
                                            type="button" 
                                            onClick={() => removeVariant(idx)}
                                            className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm z-10"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                                        </button>

                                        {/* Image Upload for Variant */}
                                        <div className="relative aspect-square bg-white border border-gray-200 rounded-sm overflow-hidden group/img">
                                            {v.preview ? (
                                                <img src={v.preview} className="w-full h-full object-contain" />
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                                    <span className="text-[9px] font-bold uppercase tracking-widest">Select Image</span>
                                                </div>
                                            )}
                                            <input 
                                                type="file" 
                                                accept="image/*"
                                                onChange={(e) => updateVariant(idx, 'imageFile', e.target.files[0])}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                required={!v.preview}
                                            />
                                        </div>

                                        {/* Color & Name Inputs */}
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-4">
                                                <input 
                                                    type="color" 
                                                    value={v.color}
                                                    onChange={(e) => updateVariant(idx, 'color', e.target.value)}
                                                    className="w-12 h-12 rounded-full border-none cursor-pointer p-0"
                                                />
                                                <div className="flex-1">
                                                    <label className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Color Name</label>
                                                    <input 
                                                        type="text"
                                                        value={v.colorName}
                                                        onChange={(e) => updateVariant(idx, 'colorName', e.target.value)}
                                                        placeholder="e.g. Ruby Red"
                                                        className="w-full h-10 px-3 bg-white border border-gray-200 text-xs focus:outline-none focus:border-[#6d1616]"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Final Actions */}
                <div className="flex justify-end gap-6 max-w-4xl mx-auto w-full">
                    <button 
                        type="button"
                        onClick={() => router.back()}
                        className="h-14 px-10 border border-gray-200 text-gray-400 font-bold text-xs uppercase tracking-[0.2em] hover:text-black hover:border-black transition-all"
                    >
                        Back to List
                    </button>
                    <button 
                        disabled={loading || variants.length === 0}
                        type="submit"
                        className="h-14 px-12 bg-[#6d1616] text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-black transition-all duration-300 shadow-xl disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Complete Product Creation'}
                    </button>
                </div>

            </form>
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
