"use client";

import React, { useState } from 'react'
import { useStore } from '@/context/StoreContext';

function Footer() {
  const { t, isRTL, language, toggleLanguage } = useStore();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  return (
    <footer className="bg-[#6d1616] text-white py-16 px-6 md:px-20 font-sans relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-20 mb-20">
          
          {/* Logo Section */}
          <div className="flex-1 min-w-[200px]">
            <h2 className="text-4xl md:text-5xl font-serif tracking-tighter leading-none mb-2">
              N B
            </h2>
            <p className="text-[10px] tracking-[0.4em] uppercase opacity-80 whitespace-nowrap">
              NOURY BEAUTY
            </p>
          </div>

          {/* Column 1: Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold tracking-tight">{t('quick_links')}</h3>
            <ul className="flex flex-col gap-3 text-sm opacity-90">
              <li><a href="#" className="hover:opacity-60 transition-opacity">Search</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Products</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">About Us</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Contact</a></li>
            </ul>
          </div>

          {/* Column 2: Policies */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold tracking-tight">{t('policies')}</h3>
            <ul className="flex flex-col gap-3 text-sm opacity-90">
              <li><a href="#" className="hover:opacity-60 transition-opacity">Privacy Policy</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Refund Policy</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Shipping Policy</a></li>
              <li><a href="#" className="hover:opacity-60 transition-opacity">Terms of Service</a></li>
            </ul>
          </div>

          {/* Column 3: Socials */}
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold tracking-tight">{t('keep_touch')}</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:opacity-60 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="hover:opacity-60 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19.589 6.686a4.944 4.944 0 0 1-1.104-.139 5.093 5.093 0 0 1-.92-.352 4.922 4.922 0 0 1-1.464-1.284 4.93 4.93 0 0 1-.896-1.896A5 5 0 0 1 15 2h-4v12a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3c.27 0 .524.037.766.105V7.056A4.995 4.995 0 0 0 3 14c0 2.761 2.239 5 5 5s5-2.239 5-5V8.82c1.238 1.05 2.822 1.68 4.562 1.68h.027V6.686h-.027z"/></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-6 text-[13px] opacity-90">
          <div className={`flex flex-wrap items-center gap-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <span>&copy; 2024, Noury Beauty</span>
            <span className="mx-1">|</span>
            <span>All rights reserved. </span>
            <a href="https://www.facebook.com/mohamed.hanafy.10004" target="_blank" rel="noopener noreferrer">Developed by Mohamed Hanafy</a>
          </div>

          <div className="flex items-center gap-10 relative">
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-2 hover:opacity-60 transition-opacity"
              >
                <span>{language === 'en' ? 'English' : 'العربية'}</span>
                <svg className={`w-3 h-3 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
              </button>
              
              {isLangDropdownOpen && (
                <div className="absolute bottom-full mb-2 right-0 bg-white text-black py-2 rounded shadow-lg min-w-[100px] z-50">
                  <button onClick={() => { toggleLanguage('en'); setIsLangDropdownOpen(false); }} className="w-full text-left px-4 py-1 hover:bg-gray-100 text-xs">English</button>
                  <button onClick={() => { toggleLanguage('ar'); setIsLangDropdownOpen(false); }} className="w-full text-left px-4 py-1 hover:bg-gray-100 text-xs">العربية</button>
                </div>
              )}
            </div>

            {/* Spacer for desktop layout */}
            <div className="hidden md:block w-[50px]" />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer;