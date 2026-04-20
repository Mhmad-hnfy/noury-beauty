"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';

export default function EditProduct() {
    const { id } = useParams();
    const router = useRouter();
    const { products, fetchProducts, isLoading } = useStore();
    
    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        oldPrice: '',
    });

    const [variants, setVariants] = useState([]);

    useEffect(() => {
        if (!isLoading) {
            const product = products.find(p => p.id === id);
            if (product) {
                setFormData({
                    title: product.title,
                    price: product.price,
                    oldPrice: product.oldPrice || product.old_price || '',
                });
                
                // Convert existing data to variants structure if needed
                if (product.variants && product.variants.length > 0) {
                    setVariants(product.variants.map(v => ({
                        ...v,
                        imageFile: null,
                        preview: v.image
                    })));
                } else if (product.colors && product.colors.length > 0) {
                    // Fallback for old products
                    setVariants(product.colors.map((c, idx) => ({
                        color: c,
                        colorName: '',
                        image: product.images?.[idx] || product.image,
                        imageFile: null,
                        preview: product.images?.[idx] || product.image
                    })));
                }
                setNotFound(false);
            } else {
                setNotFound(true);
            }
        }
    }, [id, products, isLoading]);

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
        setLoading(true);

        try {
            const finalVariants = [];
            const allImages = [];
            const allColors = [];

            // 1. Upload Images for modified variants to Supabase Storage
            for (const v of variants) {
                let publicUrl = v.preview; 

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

            // 2. Update Supabase record
            const { error: updateError } = await supabase
                .from('products')
                .update({
                    title: formData.title,
                    price: parseFloat(formData.price),
                    old_price: formData.oldPrice ? parseFloat(formData.oldPrice) : null,
                    colors: allColors,
                    images: allImages,
                    variants: finalVariants
                })
                .eq('id', id);

            if (updateError) throw updateError;

            await fetchProducts();
            router.push('/admin/products');
        } catch (err) {
            console.error("Error updating product:", err);
            alert("Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    if (notFound) return <div className="p-20 text-center">Product Not Found.</div>;
    if (isLoading) return <div className="p-20 text-center">Loading...</div>;

    return (
        <div className="max-w-6xl flex flex-col gap-10 pb-20">
            <div className="flex flex-col gap-1">
                <h3 className="text-2xl font-serif text-black">Edit Product: {formData.title}</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">Manage Variants & Color Mapping</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                <div className="bg-white p-10 border border-gray-100 rounded-sm shadow-sm flex flex-col gap-8">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6d1616] border-b border-gray-50 pb-4">Core Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <InputGroup label="Product title" value={formData.title} onChange={(v) => setFormData({...formData, title: v})} />
                        <InputGroup label="Price (EGP)" type="number" value={formData.price} onChange={(v) => setFormData({...formData, price: v})} />
                        <InputGroup label="Old Price" type="number" value={formData.oldPrice} onChange={(v) => setFormData({...formData, oldPrice: v})} />
                    </div>
                </div>

                <div className="bg-white p-10 border border-gray-100 rounded-sm shadow-sm flex flex-col gap-8">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#6d1616]">Color & Image Variants</h4>
                        <button type="button" onClick={addVariant} className="text-[10px] font-bold text-[#6d1616] flex items-center gap-2">
                             <span className="text-xl">+</span> Add Color
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {variants.map((v, idx) => (
                            <div key={idx} className="relative bg-gray-50 p-6 rounded-sm border border-gray-100 flex flex-col gap-4">
                                <button type="button" onClick={() => removeVariant(idx)} className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center text-red-500 shadow-sm z-10">×</button>
                                
                                <div className="aspect-square bg-white border border-gray-200 rounded-sm overflow-hidden relative">
                                    <img src={v.preview} className="w-full h-full object-contain" />
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => updateVariant(idx, 'imageFile', e.target.files[0])}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[8px] py-1 text-center uppercase tracking-widest font-bold">Change Image</div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input type="color" value={v.color} onChange={(e) => updateVariant(idx, 'color', e.target.value)} className="w-10 h-10 border-none cursor-pointer" />
                                    <input type="text" value={v.colorName} onChange={(e) => updateVariant(idx, 'colorName', e.target.value)} placeholder="Color Name" className="flex-1 h-10 px-3 text-xs bg-white border border-gray-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                     <button type="button" onClick={() => router.back()} className="h-14 px-8 border border-gray-200 text-gray-400 font-bold text-xs uppercase tracking-widest">Cancel</button>
                     <button type="submit" disabled={loading} className="h-14 px-12 bg-[#6d1616] text-white font-bold text-xs uppercase tracking-widest shadow-xl">{loading ? 'Saving...' : 'Update Product'}</button>
                </div>
            </form>
        </div>
    );
}

function InputGroup({ label, placeholder, type="text", value, onChange }) {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</label>
            <input 
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:outline-none focus:border-[#6d1616] text-sm font-medium"
            />
        </div>
    );
}
