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
        <section className="py-24 px-6 max-w-[90rem] mx-auto bg-transparent overflow-hidden animate-fade-in transition-all">
            <div className="flex flex-col items-center mb-20 gap-4">
                <span className="text-rose font-black tracking-widest text-sm uppercase">تسوقي حسب اختيارك</span>
                <h2 className="text-4xl md:text-5xl font-black text-black font-serif">الأقسام المميزة ✨</h2>
                <div className="h-2 w-32 bg-rose rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
                {categories.map((cat, index) => (
                    <motion.div 
                        key={cat.id} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10 }}
                        className="bg-white rounded-none overflow-hidden transition-all duration-500 group border border-transparent hover:border-rose/10"
                    >
                        <Link 
                            href={`/categories/${cat.id}`}
                            className="block relative aspect-square overflow-hidden bg-pink-50"
                        >
                            <img 
                                src={cat.image} 
                                alt={cat.name} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-rose/10 group-hover:bg-transparent transition-colors duration-500" />
                        </Link>
                        <div className="p-6 text-right flex flex-col gap-1">
                            <h3 className="text-4xl font-bold text-gray-900 group-hover:text-rose transition-colors duration-300 font-serif mb-4">{cat.name}</h3>
                            <Link 
                                href={`/categories/${cat.id}`}
                                className="w-full bg-[#FDF2F8] text-[#BE123C] text-center py-3.5 rounded-none font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                            >
                                <span>استكشفي القسم</span>
                                <span className="text-lg">🌸</span>
                            </Link>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Categories;
