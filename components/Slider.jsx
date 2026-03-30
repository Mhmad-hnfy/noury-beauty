"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    image: '/slide1.png',
    title: 'تألقي بجمال طبيعي',
    description: 'مجموعة العناية الفاخرة التي تستحقها بشرتك'
  },
  {
    id: 2,
    image: '/slide2.png',
    title: 'لمسة الأناقة الحقيقية',
    description: 'اكتشفي أرقى أنواع المكياج بألوان ساحرة'
  },
  {
    id: 3,
    image: '/slide3.png',
    title: 'سحر نوري لجمالك',
    description: 'نقدم لكِ الأفضل لتكوني دائماً في أبهى صورك'
  }
];

const Slider = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[60vh] md:h-[85vh] w-full overflow-hidden bg-transparent border-b border-rose/5">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img 
            src={slides[current].image} 
            alt={slides[current].title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <div className="max-w-4xl space-y-6">
          <motion.h2
            key={`title-${current}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-7xl font-black text-white drop-shadow-2xl leading-tight font-serif"
          >
            {slides[current].title}
          </motion.h2>
          <motion.p
            key={`desc-${current}`}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-white/90 text-lg md:text-2xl font-medium tracking-wide"
          >
            {slides[current].description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-8"
          >
            <button className="bg-rose hover:bg-rose-hover text-white px-10 py-4 rounded-full text-xl font-black shadow-2xl transition-all transform hover:scale-105 active:scale-95">
                تصفحي المجموعة ✨
            </button>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${current === i ? 'w-10 bg-rose' : 'w-2 bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Slider;
