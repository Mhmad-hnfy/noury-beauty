"use client"
import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import Slider from "../components/Slider";
import Categories from "../components/Categories";
import CategorySection from "../components/CategorySection";
import Footer from "../components/Footer";
import { db } from "../data/supabase";

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories(db.categories.list());
  }, []);

  return (
    <div dir="rtl" className="bg-transparent min-h-screen flex flex-col font-sans text-black selection:bg-rose selection:text-white">
      <Header/>
      
      <main className="flex-1">
        {/* 1. Premier Hero Slider */}
        <Slider/>
        
        {/* 2. Square Categories Grid */}
        <Categories/>
        
        {/* 3. Categorized Product Sections */}
        <div className="space-y-4">
           {categories.map(cat => (
             <CategorySection key={cat.id} category={cat} />
           ))}
        </div>

        {/* 4. Newsletter or Trust Section (Optional) */}
        <section className="py-24 bg-rose/5 border-y border-rose/10 text-center px-4">
            <h2 className="text-3xl md:text-5xl font-black text-rose mb-6 font-serif">انضمي لعالم نوري ✨</h2>
            <p className="text-black font-bold text-lg mb-10 max-w-2xl mx-auto">
              اشتركي لتصلك أحدث المنتجات والخصومات الحصرية قبل الجميع.
            </p>
            <div className="flex max-w-md mx-auto gap-2">
                <input type="email" placeholder="بريدك الإلكتروني" className="flex-1 p-4 rounded-full border-2 border-rose/10 outline-none focus:border-rose bg-white text-black font-bold" />
                <button className="bg-rose text-white px-8 py-4 rounded-full font-black text-sm shadow-lg hover:shadow-rose/30 transition-all">اشتراك</button>
            </div>
        </section>
      </main>

      <Footer/>
    </div>
  );
}
