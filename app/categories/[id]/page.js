"use client"
import React, { useEffect, useState } from 'react';
import Header from '../../../components/Header';
import Products from '../../../components/Products';
import Footer from '../../../components/Footer';
import { db } from '../../../data/supabase';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const params = useParams();
  const id = params?.id;
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const list = db.categories.list();
      const found = list.find(c => c.id === parseInt(id));
      setCategory(found);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div dir="rtl" className="bg-pink-50 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
            <div className="text-[#BB015E] font-bold animate-pulse text-xl">جاري التحميل... 🌸</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div dir="rtl" className="bg-pink-50 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-20 px-6">
        <div className="max-w-[90rem] mx-auto">
            <div className="flex flex-col items-start mb-12 gap-4">
                <h1 className="text-4xl md:text-6xl font-black text-black font-serif">
                   {category?.name || 'القسم'} ✨
                </h1>
                <div className="h-2 w-32 bg-rose rounded-full" />
            </div>
            {id && <Products categoryId={id} />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
