"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';

export default function AdminSettings() {
    const { t, isRTL } = useStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        if (!supabase) return;
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase.auth.updateUser({ email });
            if (error) throw error;
            setMessage({ type: 'success', text: isRTL ? 'تم إرسال طلب التحديث! يرجى التحقق من بريدك الجديد.' : 'Email update request sent! Please check your new email.' });
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (!supabase) return;
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            setMessage({ type: 'success', text: isRTL ? 'تم تحديث كلمة المرور بنجاح!' : 'Password updated successfully!' });
            setPassword('');
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl flex flex-col gap-8 md:gap-12 animate-in slide-in-from-bottom-4 duration-500">
            <div className={`flex flex-col gap-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <h3 className="text-xl md:text-2xl font-serif text-black">{t('admin_account_settings')}</h3>
                <p className="text-[10px] md:text-xs text-gray-400 font-medium">{t('admin_credentials_desc')}</p>
            </div>

            {message.text && (
                <div className={`p-4 rounded-sm text-[10px] md:text-xs font-bold uppercase tracking-widest animate-in fade-in zoom-in-95 duration-300 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 gap-8 md:gap-10">
                
                {/* Email Update */}
                <form onSubmit={handleUpdateEmail} className="bg-white p-6 md:p-8 border border-gray-100 rounded-sm shadow-sm flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-xs md:text-sm font-bold text-black uppercase tracking-wider">{t('admin_change_email')}</h4>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t('admin_new_email')}</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(v) => setEmail(v.target.value)}
                            placeholder="admin@nourybeauty.com"
                            className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:outline-none focus:border-[#6d1616] text-sm font-medium transition-all"
                        />
                    </div>

                    <button 
                        disabled={loading || !email}
                        type="submit"
                        className="w-full h-12 bg-[#6d1616] text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? '...' : t('admin_update')}
                    </button>
                </form>

                {/* Password Update */}
                <form onSubmit={handleUpdatePassword} className="bg-white p-6 md:p-8 border border-gray-100 rounded-sm shadow-sm flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-xs md:text-sm font-bold text-black uppercase tracking-wider">{t('admin_change_password')}</h4>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{t('admin_new_password')}</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(v) => setPassword(v.target.value)}
                            placeholder="••••••••"
                            className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:outline-none focus:border-[#6d1616] text-sm font-medium transition-all"
                        />
                    </div>

                    <button 
                        disabled={loading || !password}
                        type="submit"
                        className="w-full h-12 bg-[#6d1616] text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? '...' : t('admin_update')}
                    </button>
                </form>

            </div>
        </div>
    );
}
