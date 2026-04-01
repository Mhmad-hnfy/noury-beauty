"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { db } from '../data/supabase';

const CategorySection = ({ category }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const list = db.products.list();
    const filtered = list.filter(p => p.categoryId === parseInt(category.id));
    setProducts(filtered);
  }, [category.id]);

  if (products.length === 0) return null;

  return (
    <section className="py-24 px-6 max-w-[90rem] mx-auto border-b last:border-0 border-rose/5 animate-fade-in transition-all">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="text-right">
          <h2 className="text-4xl lg:text-5xl font-black text-black mb-4 font-serif">{category.name} ✨</h2>
          <div className="h-1.5 w-24 bg-rose rounded-full" />
        </div>
        <Link href={`/categories/${category.id}`} className="text-rose font-bold border-b-2 border-rose/20 pb-1 hover:border-rose transition-all">
          عرض كافة منتجات القسم ←
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
        {products.map((product) => (
          <motion.div 
            key={product.id} 
            whileHover={{ y: -5 }}
            className="bg-white rounded-[2rem] overflow-hidden transition-all duration-500 group border border-transparent hover:border-rose/10"
          >
            <Link href={`/checkout?productId=${product.id}`} className="block relative aspect-square w-full overflow-hidden bg-pink-50/50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-4 right-4 bg-rose text-white text-[10px] font-black px-3 py-1 rounded-full z-20 shadow-lg">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                )}
            </Link>

            <div className="p-6 text-right flex flex-col gap-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-rose transition-colors duration-300">{product.name}</h3>
              <p className="text-gray-400 text-xs font-medium">متوفر بخيارات متعددة</p>
              
              <div className="mt-2 flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                    <span className=" font-black text-xl">EGP {product.price}</span>
                </div>
                {product.originalPrice && product.originalPrice > product.price && (
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                       <span className="line-through">EGP {product.originalPrice}</span>
                       {/* <span className="text-rose/50">0%</span> */}
                    </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2 mt-6">
                <Link 
                  href={`/checkout?productId=${product.id}`}
                  className="w-full   text-center py-3.5 rounded-2xl font-bold hover:bg-[#fbcfe8] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>شراء الآن</span>
                  <span className="text-lg">🛍️</span>
                </Link>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-pink-50 text-rose text-center py-3.5 rounded-2xl font-bold hover:bg-pink-100 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>أضف للسلة</span>
                  <span className="text-lg">🛒</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
