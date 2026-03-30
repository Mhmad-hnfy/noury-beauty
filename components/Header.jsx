"use client"
import React from 'react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';

const Header = () => {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const { cartCount } = useCart();

    return (
        <header className="sticky top-0 z-[100] w-full bg-white/95 backdrop-blur-md border-b border-rose/10 shadow-sm transition-all duration-300">
            <nav className="flex items-center w-full max-w-7xl mx-auto justify-between px-6 py-4">
                <div className="flex-shrink-0">
                    <Link href="/" className="group flex items-center gap-3">
                        <img src="/logo.png" alt="Noury Beauty Logo" className="h-10 md:h-14 w-auto object-contain transition-transform group-hover:scale-105" />
                    </Link>
                </div>
                
                <div id="menu" className={`${mobileOpen ? 'max-md:translate-x-0' : 'max-md:translate-x-full'} max-md:fixed max-md:bg-white max-md:top-0 right-0 transition-transform duration-500 max-md:h-screen max-md:w-[80%] max-md:z-[110] max-md:shadow-2xl flex items-center justify-center`}>
                    <button onClick={() => setMobileOpen(false)} className="md:hidden absolute top-6 right-6 p-2 text-rose hover:bg-rose/5 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                    
                    <div className="flex flex-col md:flex-row items-center gap-8 text-black font-bold uppercase tracking-widest text-sm">
                        <Link className="px-3 py-1 hover:text-rose transition-colors" href="/" onClick={() => setMobileOpen(false)}>الرئيسية</Link>
                        <Link className="px-3 py-1 hover:text-rose transition-colors" href="/products" onClick={() => setMobileOpen(false)}>المنتجات</Link>
                        <Link className="px-3 py-1 hover:text-rose transition-colors" href="/cart" onClick={() => setMobileOpen(false)}>السلة</Link>
                        <Link className="px-3 py-1 hover:text-rose transition-colors" href="#footer" onClick={() => setMobileOpen(false)}>تواصل معنا</Link>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/cart" className="relative group p-2 rounded-full hover:bg-rose/5 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                        </svg>
                        <span className="absolute -top-1 -right-1 bg-rose text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center animate-pulse border-2 border-white">
                            {cartCount}
                        </span>
                    </Link>
                    
                    <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-black hover:bg-rose/5 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
                    </button>
                </div>
            </nav>
            {mobileOpen && <div onClick={() => setMobileOpen(false)} className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[105]" />}
        </header>
    );
};

export default Header;
