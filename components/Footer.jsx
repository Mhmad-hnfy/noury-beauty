import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-transparent border-t border-rose/10 pt-16 pb-8 text-black mt-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-right">
        
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-1">
          <h2 className="text-3xl font-bold font-serif text-[#f43f5e] mb-4">Noury Beauty</h2>
          <p className="text-sm leading-relaxed text-black font-bold">
            وجهتك الأولى لأحدث وأرقى مستحضرات التجميل. نؤمن بأن كل امرأة تستحق التألق وإبراز جمالها الطبيعي بمنتجات أصلية ذات جودة عالية.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold text-[#BB015E] mb-4">روابط سريعة</h3>
          <ul className="space-y-3 text-sm font-medium">
            <li><a href="#" className="hover:text-[#BB015E] transition-colors">الرئيسية</a></li>
            <li><a href="#" className="hover:text-[#BB015E] transition-colors">عن المتجر</a></li>
            <li><a href="#" className="hover:text-[#BB015E] transition-colors">تسوقي المنتجات</a></li>
            <li><a href="#" className="hover:text-[#BB015E] transition-colors">أحدث العروض</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-xl font-bold text-[#BB015E] mb-4">خدمة العملاء</h3>
          <ul className="space-y-3 text-sm font-medium">
            <li><a href="#" className="hover:text-[#BB015E] transition-colors">تتبع الطلب</a></li>
            <li><a href="#" className="hover:text-[#BB015E] transition-colors">سياسة الاسترجاع والاستبدال</a></li>
            <li><a href="#" className="hover:text-[#BB015E] transition-colors">الشحن والتوصيل</a></li>
            <li><a href="#" className="hover:text-[#BB015E] transition-colors">الأسئلة الشائعة</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-bold text-[#BB015E] mb-4">تواصل معنا</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2 justify-end">
              <span>contact@nourybeauty.com</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BB015E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
            </li>
            <li className="flex items-center gap-2 justify-end">
              <span style={{direction: 'ltr'}}>+20 123 456 7890</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#BB015E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </li>
          </ul>

          <div className="flex gap-4 mt-6 justify-end">
            <a href="#" className="bg-pink-100 p-2 rounded-full text-[#BB015E] hover:bg-[#BB015E] hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="bg-pink-100 p-2 rounded-full text-[#BB015E] hover:bg-[#BB015E] hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-pink-200 pt-8 mt-8 text-center text-sm font-medium">
        <p>© 2026 Noury Beauty. جميع الحقوق محفوظة.</p>
      </div>
    </footer>
  );
};

export default Footer;
