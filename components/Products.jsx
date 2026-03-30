"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { db } from '../data/supabase';

const Products = ({ categoryId, limit }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Fetch products from the mock DB
    const list = db.products.list();
    const filtered = categoryId 
        ? list.filter(p => p.categoryId === parseInt(categoryId)) 
        : list;
    
    setProducts(limit ? filtered.slice(0, limit) : filtered);
  }, [categoryId, limit]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto bg-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-5xl font-bold text-[#BB015E] mb-4">
          {categoryId ? 'منتجات القسم' : 'أحدث المنتجات'}
        </h2>
        <p className="text-[#BB015E]/70 text-lg">تشكيلة مميزة من أرقى المنتجات لجمالك</p>
      </motion.div>

      {products.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {products.map((product) => (
            <motion.div 
              key={product.id} 
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-pink-100 group relative"
            >
              {/* Sale Badge */}
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="absolute top-4 left-4 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full z-20 shadow-lg animate-bounce">
                    خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </div>
              )}

              <div className="relative h-72 w-full overflow-hidden bg-pink-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-[#BB015E]/20 flex items-center justify-center transition-colors px-6 text-center z-10"
                >
                   <Link 
                     href={`/checkout?productId=${product.id}`}
                     className="bg-white text-[#BB015E] font-bold py-3 px-8 rounded-full shadow-lg"
                   >
                     معاينة سريعة
                   </Link>
                </motion.div>
              </div>

              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                
                {/* Price Display with Discount */}
                <div className="flex flex-col items-center mb-5">
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-gray-300 line-through text-sm font-bold">{product.originalPrice} جنيه</span>
                    )}
                    <p className="text-[#BB015E] font-black text-2xl">
                        {product.price} <span className="text-sm">جنيه مصري</span>
                    </p>
                </div>

                <div className="flex gap-2 w-full">
                  <Link 
                    href={`/checkout?productId=${product.id}`}
                    className="flex-1 bg-[#BB015E] hover:bg-[#8F0147] text-white font-medium py-3 rounded-full transition-colors text-sm flex items-center justify-center"
                  >
                    شراء الآن
                  </Link>
                  <button 
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-white border-2 border-[#BB015E] text-[#BB015E] hover:bg-pink-50 font-medium py-3 rounded-full transition-colors text-sm"
                  >
                    أضف إلى السلة
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">لا توجد منتجات متوفرة حالياً في هذا القسم. ✨</p>
        </div>
      )}
    </section>
  );
};

export default Products;
