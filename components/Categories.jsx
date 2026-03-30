"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { db } from '../data/supabase';

const Categories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        setCategories(db.categories.list());
    }, []);

    return (
        <section className="py-20 px-6 max-w-7xl mx-auto bg-white overflow-hidden animate-fade-in transition-all">
            <div className="flex flex-col items-center mb-16 gap-4">
                <span className="text-rose font-black tracking-widest text-sm uppercase">تسوقي حسب اختيارك</span>
                <h2 className="text-4xl md:text-5xl font-black text-black font-serif">الأقسام المميزة ✨</h2>
                <div className="h-2 w-32 bg-rose rounded-full" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8">
                {categories.map((cat, index) => (
                    <motion.div 
                        key={cat.id} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Link 
                            href={`/categories/${cat.id}`}
                            className="group cursor-pointer flex flex-col items-center"
                        >
                            <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="w-full aspect-square rounded-[3rem] overflow-hidden border-4 border-rose/5 shadow-sm group-hover:border-rose/20 transition-all duration-500 relative"
                            >
                                <img 
                                    src={cat.image} 
                                    alt={cat.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-rose/10 group-hover:bg-transparent transition-colors duration-500"></div>
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-white/90 backdrop-blur-md text-rose text-xs font-black px-6 py-2 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        استكشفي
                                    </span>
                                </div>
                            </motion.div>
                            <h3 className="mt-6 text-lg md:text-xl font-black text-black group-hover:text-rose transition-colors font-serif">{cat.name}</h3>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Categories;
