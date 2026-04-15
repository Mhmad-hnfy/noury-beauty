"use client";

import React from 'react';
import { useStore } from '@/context/StoreContext';
import { supabase } from '@/lib/supabase';

export default function ReviewsManager() {
    const { reviews, isReviewsLoading, t, isRTL, deleteReview } = useStore();

    const handleDelete = async (id) => {
        if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذا التقييم؟' : 'Are you sure you want to delete this review?')) return;

        try {
            if (supabase) {
                const { error } = await supabase.from('reviews').delete().eq('id', id);
                if (error) throw error;
            }
            await deleteReview(id);
            alert(isRTL ? 'تم الحذف بنجاح' : 'Review deleted successfully');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-serif text-black">{t('admin_reviews')}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{reviews.length} {t('admin_reviews')}</p>
                </div>
                <a 
                    href="/admin/reviews/new" 
                    className="h-12 px-8 bg-[#6d1616] text-white flex items-center justify-center font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg rounded-sm w-full sm:w-auto"
                >
                    {t('admin_add_product')} {/* Reusing translation for 'Add' */}
                </a>
            </div>

            <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    {isReviewsLoading ? (
                        <div className="p-20 flex justify-center">
                            <div className="w-8 h-8 border-4 border-[#6d1616] border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : reviews.length > 0 ? (
                        <table className="w-full text-left text-sm min-w-[800px]">
                            <thead className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                <tr>
                                    <th className="px-6 py-4 w-20"></th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>Reviewer</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>Title & Content</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>Product</th>
                                    <th className={`px-6 py-4 ${isRTL ? 'text-right' : 'text-left'}`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {reviews.map(rev => (
                                    <tr key={rev.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-sm overflow-hidden border border-gray-100 flex items-center justify-center text-gray-200">
                                                {rev.image ? (
                                                    <img 
                                                        src={rev.image} 
                                                        alt="" 
                                                        className="w-full h-full object-contain"
                                                    />
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-black">{rev.name}</span>
                                                <div className="flex gap-0.5">
                                                    {[...Array(rev.stars)].map((_, i) => (
                                                        <span key={i} className="text-yellow-400 text-[10px]">★</span>
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-gray-400 uppercase font-bold">{rev.date}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-gray-800">{rev.title}</span>
                                                <span className="text-xs text-gray-500 line-clamp-2 italic">"{rev.content}"</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-200">
                                                {rev.product}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-4">
                                                <a 
                                                    href={`/admin/reviews/edit/${rev.id}`}
                                                    className="text-blue-400 hover:text-blue-700 font-bold text-[10px] uppercase tracking-widest transition-colors"
                                                >
                                                    {t('admin_edit')}
                                                </a>
                                                <button 
                                                    onClick={() => handleDelete(rev.id)}
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
                            No reviews found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
