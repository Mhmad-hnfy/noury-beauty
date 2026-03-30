import React from 'react';
import Header from '../../../components/Header';
import Products from '../../../components/Products';
import Footer from '../../../components/Footer';
import { categories } from '../../../data/data';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const category = categories.find(c => c.id === parseInt(id));
  return {
    title: `${category?.name || 'القسم'} | Noury Beauty`,
    description: `تصفحي منتجات ${category?.name || ''} الفاخرة`,
  };
}

export default async function CategoryPage({ params }) {
  const { id } = await params;
  const category = categories.find(c => c.id === parseInt(id));

  return (
    <div dir="rtl" className="bg-pink-50 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-[#BB015E] mb-2">{category?.name}</h1>
            <div className="h-1 w-20 bg-[#BB015E] rounded-full mb-10"></div>
        </div>
        <Products categoryId={id} />
      </main>
      <Footer />
    </div>
  );
}
