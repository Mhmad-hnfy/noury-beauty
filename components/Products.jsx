"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { db } from '../data/supabase';

const Products = ({ categoryId, limit }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const list = db.products.list();
    const filtered = categoryId 
        ? list.filter(p => p.categoryId === parseInt(categoryId)) 
        : list;
    
    setProducts(limit ? filtered.slice(0, limit) : filtered);
  }, [categoryId, limit]);

  return (
    <section className="py-24 px-6 max-w-[90rem] mx-auto bg-transparent animate-fade-in transition-all">
      <div className="flex flex-col items-center mb-16 gap-4">
          <span className="text-rose font-black tracking-widest text-sm uppercase">اكتشفي الآن</span>
          <h2 className="text-4xl md:text-5xl font-black text-black font-serif text-center">
            {categoryId ? 'منتجات القسم ✨' : 'أحدث المنتجات المميزة 💄'}
          </h2>
          <div className="h-2 w-32 bg-rose rounded-full" />
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
          {products.map((product) => (
            <motion.div 
              key={product.id} 
              whileHover={{ y: -10 }}
              className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-rose/5 group"
            >
              <Link href={`/checkout?productId=${product.id}`} className="block relative h-80 w-full overflow-hidden bg-pink-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-6 right-6 bg-rose text-site-light text-xs font-black px-4 py-1.5 rounded-full z-20 shadow-lg">
                        خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                )}
              </Link>

              <div className="p-5 text-right flex flex-col">
                <h3 className="text-lg md:text-xl font-medium text-black mb-1 truncate font-sans">{product.name}</h3>
                {/* <p className="text-gray-400 text-xs mb-3">متوفر بخيارات متعددة</p> */}
                
                <div className="flex flex-col items-start mb-6 gap-0.5">
                    <p className="text-black font-bold text-xl md:text-2xl">
                        <span className="text-xs font-medium text-black/60 mr-1">EGP</span> {product.price}
                    </p>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <div className="flex items-center gap-2">
                           <span className="text-gray-300 line-through text-sm">EGP {product.originalPrice}</span>
                           <span className="text-rose text-[10px] font-bold">0%</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                  <Link 
                    href={`/checkout?productId=${product.id}`}
                    className="w-full bg-pink-50 text-rose hover:bg-pink-100 font-black py-4 rounded-full transition-all shadow-md text-sm flex items-center justify-center"
                  >
                    شراء الآن 🛍️
                  </Link>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-white border-2 border-pink-100 text-rose hover:bg-rose hover:text-white font-black py-4 rounded-full transition-all text-sm"
                  >
                    أضف للسلة 🛒
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/30 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-rose/10">
          <p className="text-black/50 text-xl font-bold">لا توجد منتجات متوفرة حالياً في هذا القسم. 🌸</p>
        </div>
      )}
    </section>
  );
};

export default Products;
