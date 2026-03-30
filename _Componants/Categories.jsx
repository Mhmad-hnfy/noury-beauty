"use client"
import React from 'react';
import Link from 'next/link';
import { categories } from '../_Data/data';

const Categories = () => {
  return (
    <section className="py-8 px-4 max-w-7xl mx-auto bg-white">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-bold text-[#BB015E] font-serif mb-2">تسوقي بالقسم</h2>
        <p className="text-[#BB015E]/70 text-base">اختاري ما يناسب جمالك عبر أقسامنا المتنوعة</p>
      </div>

      <div className="flex flex-wrap justify-center gap-4 md:gap-8">
        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            href={`/categories/${cat.id}`}
            className="group cursor-pointer flex flex-col items-center"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-[3px] border-pink-100 shadow group-hover:border-[#BB015E] transition-all duration-300 relative">
              <img 
                src={cat.image} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-pink-900/10 group-hover:bg-transparent transition-colors duration-300"></div>
            </div>
            <h3 className="mt-3 text-base md:text-lg font-bold text-gray-800 group-hover:text-[#BB015E] transition-colors">{cat.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
