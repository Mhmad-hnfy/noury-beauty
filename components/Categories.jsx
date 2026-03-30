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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "backOut" } }
    };

    return (
        <section className="py-12 px-4 max-w-7xl mx-auto bg-white overflow-hidden">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-[#BB015E] font-serif mb-3">تسوقي بالقسم</h2>
                <div className="h-1 w-20 bg-pink-100 mx-auto rounded-full"></div>
            </motion.div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="flex flex-wrap justify-center gap-6 md:gap-10"
            >
                {categories.map((cat) => (
                    <motion.div 
                        key={cat.id} 
                        variants={itemVariants}
                    >
                        <Link 
                            href={`/categories/${cat.id}`}
                            className="group cursor-pointer flex flex-col items-center"
                        >
                            <motion.div 
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-[6px] border-pink-50 shadow-sm group-hover:border-[#BB015E] transition-all duration-300 relative"
                            >
                                <img 
                                    src={cat.image} 
                                    alt={cat.name} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-pink-900/5 group-hover:bg-transparent transition-colors duration-300"></div>
                            </motion.div>
                            <h3 className="mt-4 text-lg md:text-xl font-bold text-gray-800 group-hover:text-[#BB015E] transition-colors">{cat.name}</h3>
                        </Link>
                    </motion.div>
                ))}
                {categories.length === 0 && (
                    <div className="text-gray-300 italic">بانتظار إضافة الأقسام من لوحة التحكم... ✨</div>
                )}
            </motion.div>
        </section>
    );
};

export default Categories;
