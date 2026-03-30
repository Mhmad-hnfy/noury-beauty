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
    <section className="py-24 px-6 max-w-7xl mx-auto border-b last:border-0 border-rose/5 animate-fade-in transition-all">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="text-right">
          <h2 className="text-4xl lg:text-5xl font-black text-black mb-4 font-serif">{category.name} ✨</h2>
          <div className="h-1.5 w-24 bg-rose rounded-full" />
        </div>
        <Link href={`/categories/${category.id}`} className="text-rose font-bold border-b-2 border-rose/20 pb-1 hover:border-rose transition-all">
          عرض كافة منتجات القسم ←
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
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

            <div className="p-5 text-center">
              <h3 className="text-base md:text-lg font-bold text-black mb-3 truncate px-2">{product.name}</h3>
              
              <div className="flex flex-col items-center mb-5 gap-1">
                {product.originalPrice && product.originalPrice > product.price && (
                    <span className="text-black/30 line-through text-xs font-bold">{product.originalPrice} جنيه</span>
                )}
                <p className="text-rose font-black text-xl">
                  {product.price} <span className="text-[10px]">جنيه مصري</span>
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Link 
                  href={`/checkout?productId=${product.id}`}
                  className="w-full bg-rose hover:bg-rose-hover text-white font-bold py-2.5 rounded-full transition-colors text-xs"
                >
                  اشتري الآن
                </Link>
                <button 
                  onClick={() => addToCart(product)}
                  className="w-full bg-white border-2 border-rose/20 text-rose hover:border-rose font-bold py-2.5 rounded-full transition-all text-xs"
                >
                  أضف للسلة
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
