"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Mock Login / Emergency Bypass
        // This allows you to log in even if Supabase is connected but you haven't created a user yet.
        if (email === 'admin@nourybeauty.com' && password === 'nouryadmin123') {
            localStorage.setItem('noury_demo_mode', 'true');
            router.push('/admin/dashboard');
            return;
        }

        if (!supabase) {
            setError('Demo Mode: Please use admin@nourybeauty.com / nouryadmin123');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            localStorage.removeItem('noury_demo_mode'); // Clear bypass if real login succeeds
            router.push('/admin/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#6d1616] flex items-center justify-center p-6 font-sans text-white">
            <div className="bg-white text-black w-full max-w-md p-8 md:p-12 rounded-sm shadow-2xl flex flex-col gap-8">
                <div className="flex flex-col gap-2 items-center">
                    <h1 className="text-3xl font-serif text-[#6d1616]">Noury Admin</h1>
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">Secure Access</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email Address</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:outline-none focus:border-[#6d1616] transition-all text-sm"
                            placeholder="admin@nourybeauty.com"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Password</label>
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:outline-none focus:border-[#6d1616] transition-all text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-xs text-red-500 font-medium italic">
                            Error: {error}
                        </p>
                    )}

                    <button 
                        disabled={loading}
                        type="submit"
                        className="w-full h-14 bg-[#6d1616] text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-black transition-all duration-300 shadow-xl disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Login to Dashboard'}
                    </button>
                </form>

                <div className="flex justify-center border-t border-gray-100 pt-6">
                    <button 
                        onClick={() => router.push('/')}
                        className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                    >
                        Back to Site
                    </button>
                </div>
            </div>
        </div>
    );
}
