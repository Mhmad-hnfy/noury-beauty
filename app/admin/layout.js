"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/context/StoreContext';

export default function AdminLayout({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const { language, toggleLanguage, t, isRTL } = useStore();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
                setLoading(false);
            } else {
                const isDemo = localStorage.getItem('noury_demo_mode') === 'true';
                if (!isDemo && pathname !== '/admin/login') {
                    router.push('/admin/login');
                }
                setLoading(false);
            }
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session?.user && localStorage.getItem('noury_demo_mode') !== 'true' && pathname !== '/admin/login') {
                router.push('/admin/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [pathname, router]);

    const handleLogout = async () => {
        localStorage.removeItem('noury_demo_mode');
        await supabase.auth.signOut();
        router.push('/admin/login');
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-[#6d1616] border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (pathname === '/admin/login') {
        return <div dir={isRTL ? 'rtl' : 'ltr'}>{children}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
            
            {/* Sidebar Overlay (Mobile) */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-[100] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 ${isRTL ? 'right-0' : 'left-0'} w-64 bg-[#6d1616] text-white flex flex-col shrink-0 z-[110] transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : (isRTL ? 'translate-x-[100%]' : '-translate-x-[100%]')} lg:translate-x-0 shadow-2xl lg:shadow-none`}>
                <div className="p-8 border-b border-white/10 flex flex-col gap-2 relative">
                    <h1 className="text-xl font-serif tracking-tight">Noury Admin</h1>
                    <p className="text-[9px] uppercase tracking-[0.3em] opacity-40">Control Panel</p>
                    
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden absolute top-8 right-4 text-white/50 hover:text-white"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                </div>

                <nav className="flex-1 py-8 px-4 flex flex-col gap-2 text-[11px]">
                    <SidebarLink href="/admin/dashboard" label={t('admin_dashboard')} pathname={pathname} isRTL={isRTL} />
                    <SidebarLink href="/admin/products" label={t('admin_products')} pathname={pathname} isRTL={isRTL} />
                    <SidebarLink href="/admin/reviews" label={t('admin_reviews')} pathname={pathname} isRTL={isRTL} />
                    <SidebarLink href="/admin/shipping" label={t('admin_shipping')} pathname={pathname} isRTL={isRTL} />
                    <SidebarLink href="/admin/orders" label={t('admin_orders')} pathname={pathname} isRTL={isRTL} />
                    <SidebarLink href="/admin/settings" label={t('admin_settings')} pathname={pathname} isRTL={isRTL} />
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button 
                        onClick={handleLogout}
                        className="w-full h-12 flex items-center px-4 rounded-md hover:bg-white/10 transition-colors text-[10px] font-bold uppercase tracking-widest gap-3"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        {t('admin_logout')}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-gray-500 hover:text-black"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                        </button>
                        <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#6d1616]">
                            {pathname.includes('/edit/') ? t('admin_edit') : 
                             pathname.includes('/new') ? t('admin_new') : 
                             t('admin_' + pathname.split('/').pop())}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8">
                        <div className="flex items-center gap-1">
                            <button onClick={() => toggleLanguage('en')} className={`text-[10px] font-bold px-2 py-1 rounded-sm ${language === 'en' ? 'bg-[#6d1616] text-white' : 'text-gray-400 hover:text-black'}`}>EN</button>
                            <button onClick={() => toggleLanguage('ar')} className={`text-[10px] font-bold px-2 py-1 rounded-sm ${language === 'ar' ? 'bg-[#6d1616] text-white' : 'text-gray-400 hover:text-black'}`}>AR</button>
                        </div>
                        <div className="hidden sm:flex items-center gap-4">
                            <span className="text-[10px] text-gray-400 font-medium">{user?.email}</span>
                            <div className="w-8 h-8 bg-[#6d1616]/5 rounded-full flex items-center justify-center text-[10px] font-bold text-[#6d1616]">NB</div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-gray-50/50">
                    {children}
                </div>
            </main>
        </div>
    );
}

function SidebarLink({ href, label, pathname, isRTL }) {
    const isActive = pathname === href;
    return (
        <a 
            href={href}
            className={`h-11 flex items-center px-4 rounded-md transition-all font-bold uppercase tracking-widest ${isRTL ? 'text-right' : 'text-left'} ${isActive ? 'bg-white text-[#6d1616] shadow-lg scale-[1.02]' : 'hover:bg-white/5 text-white/70'}`}
        >
            {label}
        </a>
    );
}
