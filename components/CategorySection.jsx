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
            whileHover={{ y: -10 }}
            className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-rose/5 group"
          >
            <Link href={`/checkout?productId=${product.id}`} className="block relative h-60 w-full overflow-hidden bg-pink-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-4 right-4 bg-rose text-white text-[10px] font-black px-3 py-1 rounded-full z-20 shadow-lg">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </div>
                )}
            </Link>

            <div className="p-5 text-right flex flex-col">
              <h3 className="text-lg md:text-xl font-medium text-black mb-1 truncate font-sans">{product.name}</h3>
              <p className="text-gray-400 text-xs mb-3">متوفر بخيارات متعددة</p>
              
              <div className="flex flex-col items-start mb-6 gap-0.5 mt-auto">
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
                  className="w-full bg-pink-50 hover:bg-pink-100 text-rose font-black py-4 rounded-full transition-all text-sm shadow-md flex items-center justify-center"
                >
                  اشتري الآن 🛍️
                </Link>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-white border-2 border-pink-100 text-rose hover:bg-rose hover:text-white font-black py-4 rounded-full transition-all text-sm flex items-center justify-center"
                >
                  أضف للسلة 🛒
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
