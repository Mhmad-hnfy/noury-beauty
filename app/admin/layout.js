"use client"
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    // Handle screen resize
    const checkScreen = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    const isAdmin = localStorage.getItem('isAdmin');
    if (isAdmin === 'true') {
      setIsAuthorized(true);
      setLoading(false);
    } else {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  // Close sidebar on path change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-pink-50 text-[#BB015E] font-bold">جاري التحقق...</div>;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const menuItems = [
    { name: 'لوحة التحكم', icon: '🏠', path: '/admin' },
    { name: 'المنتجات', icon: '🛍️', path: '/admin/products' },
    { name: 'الأقسام', icon: '📁', path: '/admin/categories' },
    { name: 'الطلبات', icon: '📦', path: '/admin/orders' },
    { name: 'أسعار الشحن', icon: '🚚', path: '/admin/shipping' },
    { name: 'الإعدادات', icon: '⚙️', path: '/admin/settings' },
  ];

  return (
    <div dir="rtl" className="flex min-h-screen bg-pink-50 font-sans relative">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-[60] flex items-center justify-between px-6">
          <h1 className="text-xl font-bold text-[#BB015E]">Noury Admin</h1>
          <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-[#BB015E] p-2"
          >
              {isSidebarOpen ? '✕' : '☰'}
          </button>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isSidebarOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/50 z-[70] backdrop-blur-sm"
            />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          x: isLargeScreen ? 0 : (isSidebarOpen ? 0 : 300) 
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed lg:sticky top-0 right-0 w-72 bg-white shadow-2xl flex flex-col border-l border-pink-100 h-screen z-[80] lg:translate-x-0"
      >
        <div className="p-8 text-center border-b border-pink-50 hidden lg:block">
          <h1 className="text-2xl font-bold text-[#BB015E] font-serif">Noury Admin</h1>
        </div>
        
        <nav className="flex-1 p-6 space-y-4 pt-20 lg:pt-6">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold ${
                pathname === item.path 
                ? 'bg-[#BB015E] text-white shadow-lg shadow-pink-200' 
                : 'text-gray-500 hover:bg-pink-50 hover:text-[#BB015E]'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6">
          <button 
            onClick={() => {
              localStorage.removeItem('isAdmin');
              router.push('/admin/login');
            }}
            className="w-full flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 py-4 rounded-2xl transition-colors"
          >
            <span>🚪</span>
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden p-6 lg:p-10 pt-24 lg:pt-10">
        <header className="hidden lg:flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            {menuItems.find(item => item.path === pathname)?.name || 'لوحة التحكم'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 font-bold">مرحباً بكِ، نوري 🌸</span>
            <div className="w-12 h-12 rounded-full bg-pink-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                <span>👩‍💼</span>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div 
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
