"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

export default function QuickView({ isOpen, onClose, product }) {
    const router = useRouter();
    const { t, isRTL, addToCart } = useStore();
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(null);
    const [activeImage, setActiveImage] = useState(null);

    // Initial state setup
    useEffect(() => {
        if (product && isOpen) {
            const initialColor = product.colors?.[0] || null;
            setSelectedColor(initialColor);
            
            // If variants exist, try to find the image for the first color
            if (product.variants?.length > 0 && initialColor) {
                const variant = product.variants.find(v => v.color === initialColor);
                setActiveImage(variant?.image || product.allImages?.[0] || product.image);
            } else {
                setActiveImage(product.allImages?.[0] || product.image);
            }
            setQuantity(1);
        }
    }, [product, isOpen]);

    // SYNC: Change image when color is selected (Ultra-robust with fallback)
    useEffect(() => {
        if (!selectedColor || !product) return;

        const cleanSelected = selectedColor.trim().toLowerCase();

        // Tier 1: Try structured variants mapping
        if (product.variants && product.variants.length > 0) {
            const variant = product.variants.find(v => 
                v.color?.trim().toLowerCase() === cleanSelected
            );
            
            if (variant && variant.image) {
                setActiveImage(variant.image);
                return;
            }
        }

        // Tier 2: Fallback - Index-based matching
        // If image count matches color count, assume 1:1 mapping
        const colorIndex = product.colors?.findIndex(c => c.trim().toLowerCase() === cleanSelected);
        const imagesList = product.allImages?.length > 0 ? product.allImages : [product.image];
        
        if (colorIndex !== -1 && imagesList[colorIndex]) {
            setActiveImage(imagesList[colorIndex]);
        }
    }, [selectedColor, product]);

    // SYNC: Change color when thumbnail is clicked (if it's a variant image)
    const handleThumbnailClick = (img) => {
        setActiveImage(img);
        if (product?.variants?.length > 0) {
            const variant = product.variants.find(v => v.image === img);
            if (variant) {
                setSelectedColor(variant.color);
            }
        }
    };

    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const imagesToDisplay = product.allImages?.length > 0 ? product.allImages : [product.image];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6" dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal Container */}
            <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl animate-in fade-in zoom-in duration-300 rounded-sm">
                
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20 p-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full transition-all shadow-sm border border-gray-100 text-black`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>

                {/* Left: Image Section */}
                <div className="bg-gray-50 flex flex-col items-center justify-center bg-white border-r border-gray-50 pt-10">
                    {/* Main Image Container */}
                    <div className="w-full aspect-square relative overflow-hidden flex items-center justify-center p-6 md:p-10">
                        <img 
                            key={activeImage} 
                            src={activeImage} 
                            alt={product.title} 
                            className="max-w-full max-h-full object-contain transform scale-100 hover:scale-110 transition-transform duration-700 animate-smooth-fade"
                        />
                    </div>
                </div>

                {/* Right: Details Section */}
                <div className="p-8 md:p-12 flex flex-col gap-8 font-sans bg-white">
                    <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2 mb-2">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">{t('in_stock')}</span>
                         </div>
                        <h2 className="text-3xl md:text-4xl font-serif text-black leading-tight tracking-tight">
                            {product.title}
                        </h2>
                        <div className="flex items-center gap-4 mt-2">
                            <p className={`text-2xl md:text-3xl font-medium ${product.oldPrice ? 'text-[#f95d5d]' : 'text-black'}`}>
                                {product.price}
                            </p>
                            {product.oldPrice && (
                                <p className="text-lg text-gray-400 line-through font-light italic">
                                    {product.oldPrice}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Options (Color Selection) */}
                    <div className="flex flex-col gap-6">
                        {product.colors?.length > 0 && (
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">{t('color')}</p>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold">
                                        {product.variants?.find(v => v.color === selectedColor)?.colorName || selectedColor}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {product.colors.map((color, index) => (
                                        <button 
                                            key={index}
                                            onClick={() => setSelectedColor(color)}
                                            className={`group relative overflow-hidden w-11 h-11 rounded-full border-2 transition-all p-0.5 ${selectedColor === color ? 'border-[#6d1616] scale-110 shadow-lg' : 'border-gray-100 hover:border-gray-300'}`}
                                        >
                                            <div 
                                                className="w-full h-full rounded-full shadow-inner transition-transform duration-300 group-hover:scale-90" 
                                                style={{ backgroundColor: color }}
                                            />
                                            {selectedColor === color && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity Selector */}
                        <div className="flex flex-col gap-4">
                            <p className="text-[10px] font-bold text-black uppercase tracking-[0.2em]">{t('quantity')}</p>
                            <div className="flex items-center justify-between border border-gray-200 bg-gray-50 h-14 px-8 w-full md:w-1/2">
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="text-xl font-light hover:text-[#6d1616] transition-colors"
                                >
                                    −
                                </button>
                                <span className="text-sm font-bold tracking-widest">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="text-xl font-light hover:text-[#6d1616] transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Global Actions */}
                    <div className="flex flex-col gap-3 mt-4">
                        <button 
                            onClick={() => {
                                addToCart(product, quantity, selectedColor);
                                onClose();
                            }}
                            className="w-full bg-black text-white font-bold text-xs uppercase tracking-[0.3em] hover:bg-[#6d1616] transition-all duration-300 h-16 shadow-lg border border-transparent active:scale-[0.98]"
                        >
                            {t('add_to_cart')}
                        </button>
                        <button 
                            onClick={() => {
                                const checkoutItem = {
                                    ...product,
                                    qty: quantity,
                                    selectedColor: product.variants?.find(v => v.color === selectedColor)?.colorName || selectedColor,
                                    displayImage: activeImage
                                };
                                localStorage.setItem('noury_checkout_item', JSON.stringify(checkoutItem));
                                router.push('/checkout');
                            }}
                            className="w-full bg-[#6d1616] text-white font-bold text-xs uppercase tracking-[0.3em] hover:bg-black transition-all duration-300 h-16 border border-[#6d1616] active:scale-[0.98]"
                        >
                            {t('buy_now')}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
