"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { db } from '../data/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const { cartCount } = useCart();

    // Search Logic
    useEffect(() => {
        if (searchQuery.trim().length > 1) {
            const products = db.products.list();
            const filtered = products.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.categoryName && p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setSearchResults(filtered.slice(0, 5));
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    return (
        <header className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-xl border-b border-rose/10 transition-all duration-300">
            <nav className="flex items-center w-full max-w-7xl mx-auto justify-between px-6 py-3 md:py-5">
                
                {/* Left Side: Search & Menu */}
                <div className="flex items-center gap-4 flex-1">
                    <button onClick={() => setMobileOpen(true)} className="p-2 text-rose hover:bg-rose/5 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                    </button>
                    <button onClick={() => setSearchOpen(true)} className="p-2 text-black hover:bg-rose/5 rounded-full transition-colors group">
                        <svg className="group-hover:text-rose transition-colors" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </button>
                </div>

                {/* Center: Stylized Text Logo */}
                <div className="flex-shrink-0 flex justify-center flex-[2] md:flex-1">
                    <Link href="/" className="group flex flex-col items-center">
                        <span className="text-3xl md:text-5xl font-black text-rose tracking-tighter font-serif drop-shadow-sm group-hover:scale-105 transition-transform">
                            Noury Beauty
                        </span>
                        <div className="h-0.5 w-12 bg-rose/30 mt-1 rounded-full group-hover:w-20 transition-all" />
                    </Link>
                </div>
                
                {/* Right Side: Cart & Account */}
                <div className="flex items-center gap-4 flex-1 justify-end">
                    <button className="hidden md:block p-2 text-black hover:bg-rose/5 rounded-full transition-colors group">
                        <svg className="group-hover:text-rose transition-colors" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </button>
                    <Link href="/cart" className="relative group p-2 rounded-full hover:bg-rose/5 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                        </svg>
                        <span className="absolute -top-1 -right-1 bg-rose text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                            {cartCount}
                        </span>
                    </Link>
                </div>

                {/* Mobile Menu Sidebar - Transparent with Blur */}
                <AnimatePresence>
                    {mobileOpen && (
                        <>
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                exit={{ opacity: 0 }}
                                onClick={() => setMobileOpen(false)}
                                className="fixed inset-0 bg-black/20 backdrop-blur-md z-[105]" 
                            />
                            <motion.div 
                                initial={{ x: '100%' }} 
                                animate={{ x: 0 }} 
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed inset-y-0 right-0 w-[280px] bg-white/20 backdrop-blur-3xl z-[110] shadow-2xl border-l border-white/30 py-12 px-8 flex flex-col"
                            >
                                <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-6 p-2 text-rose hover:bg-white/50 rounded-full transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                </button>
                                
                                <div className="mt-12 space-y-6 text-right">
                                    <div className="mb-10 text-center">
                                        <span className="text-2xl font-black text-rose font-serif">Noury Beauty</span>
                                    </div>
                                    <div className="flex flex-col gap-4 text-black font-black uppercase tracking-widest text-lg">
                                        <Link className="hover:text-rose transition-colors py-2" href="/" onClick={() => setMobileOpen(false)}>الرئيسية</Link>
                                        <Link className="hover:text-rose transition-colors py-2" href="/products" onClick={() => setMobileOpen(false)}>المنتجات</Link>
                                        <Link className="hover:text-rose transition-colors py-2" href="/cart" onClick={() => setMobileOpen(false)}>السلة</Link>
                                        <Link className="hover:text-rose transition-colors py-2" href="#footer" onClick={() => setMobileOpen(false)}>تواصل معنا</Link>
                                    </div>
                                </div>
                                <div className="mt-auto pt-10 border-t border-black/10">
                                     <p className="text-center text-[10px] uppercase tracking-widest font-bold text-black/50">Luxury Beauty Store</p>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Search Modal */}
                <AnimatePresence>
                    {searchOpen && (
                        <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }} 
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-white/95 backdrop-blur-md z-[200] flex items-start justify-center pt-24 px-6"
                        >
                            <button onClick={() => setSearchOpen(false)} className="absolute top-8 right-8 p-3 text-rose hover:bg-rose/5 rounded-full transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>

                            <div className="w-full max-w-4xl text-right">
                                <h2 className="text-2xl font-black text-black mb-8 font-serif">ابحثي عن منتجاتك المفضلة ✨</h2>
                                <div className="relative mb-10">
                                    <input 
                                        autoFocus
                                        type="text" 
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="اكتبي اسم المنتج هنا..."
                                        className="w-full bg-transparent border-b-4 border-rose/20 py-4 text-3xl md:text-5xl font-bold text-black focus:border-rose outline-none transition-all placeholder:text-rose/10 text-right"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {searchResults.map(product => (
                                        <Link 
                                            key={product.id} 
                                            href={`/checkout?productId=${product.id}`}
                                            onClick={() => setSearchOpen(false)}
                                            className="flex items-center gap-4 bg-white/50 p-4 rounded-3xl border border-rose/10 hover:border-rose hover:shadow-xl transition-all group"
                                        >
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-pink-50">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-black text-lg text-black group-hover:text-rose transition-colors">{product.name}</h3>
                                                <p className="text-rose font-bold">{product.price} جنيه</p>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-rose opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0"><path d="m15 18-6-6 6-6"/></svg>
                                        </Link>
                                    ))}
                                    {searchQuery.length > 1 && searchResults.length === 0 && (
                                        <p className="col-span-2 text-center text-xl font-bold text-black/40 py-10">لا توجد نتائج مطابقة لبحثك 🌸</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </nav>
        </header>
    );
};

export default Header;
