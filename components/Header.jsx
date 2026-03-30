"use client"
import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

const Header = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const { cartCount } = useCart();

    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-sm">
            <nav className="flex items-center w-full max-w-7xl mx-auto justify-between px-4 py-3 text-[#BB015E]">
                <Link href="/" className="text-2xl font-bold font-serif whitespace-nowrap">
                    Noury Beauty
                </Link>
                
                <div id="menu" className={`${mobileOpen ? 'max-md:left-0' : 'max-md:-left-full'} max-md:fixed max-md:bg-white/95 max-md:backdrop-blur max-md:top-0 transition-all duration-300 max-md:h-screen max-md:w-full max-md:z-50 max-md:justify-center flex-col md:flex-row flex items-center gap-6 text-base font-bold flex-1 md:justify-center`}>
                    <button onClick={() => setMobileOpen(false)} className="md:hidden absolute top-4 right-4 bg-gray-100 text-[#BB015E] p-2 rounded-full transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                    
                    <Link className="px-4 py-2 hover:text-[#8F0147] transition hover:bg-pink-50 rounded-full" href="/" onClick={() => setMobileOpen(false)}>الرئيسية</Link>
                    <Link className="px-4 py-2 hover:text-[#8F0147] transition hover:bg-pink-50 rounded-full" href="/products" onClick={() => setMobileOpen(false)}>المنتجات</Link>
                    <Link className="px-4 py-2 hover:text-[#8F0147] transition hover:bg-pink-50 rounded-full" href="/cart" onClick={() => setMobileOpen(false)}>السلة</Link>
                    <Link className="px-4 py-2 hover:text-[#8F0147] transition hover:bg-pink-50 rounded-full" href="#footer" onClick={() => setMobileOpen(false)}>تواصل معنا</Link>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/cart" className="relative p-2 text-[#BB015E] hover:bg-pink-50 rounded-full transition cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                        </svg>
                        <span className="absolute top-0 right-0 bg-[#BB015E] text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white">
                            {cartCount}
                        </span>
                    </Link>
                    
                    <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-[#BB015E] hover:bg-pink-50 rounded-md transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
