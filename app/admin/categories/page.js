"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { db } from '../../../data/supabase';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newCat, setNewCat] = useState({ name: '', image: null });

  useEffect(() => {
    setCategories(db.categories.list());
  }, []);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setNewCat(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'image/*': []},
    multiple: false 
  });

  const handleSave = () => {
    if (!newCat.name || !newCat.image) {
      alert('يرجى إكمال بيانات القسم وصورته 🌸');
      return;
    }
    const saved = db.categories.add(newCat);
    setCategories([...categories, saved]);
    setIsAdding(false);
    setNewCat({ name: '', image: null });
  };

  const handleDelete = (id) => {
    if (confirm('هل أنتِ متأكدة من حذف هذا القسم؟')) {
        db.categories.delete(id);
        setCategories(categories.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-pink-100 flex justify-between items-center">
        <div>
           <h3 className="text-xl font-bold text-gray-800">إدارة الأقسام ({categories.length}) ✨</h3>
           <p className="text-sm text-gray-400 font-bold">نظمي متجرك ووفري تجربة تصفح رائعة</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(true)}
          className="bg-[#BB015E] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-pink-200 transition-all flex items-center gap-2"
        >
          <span>➕</span> أضيفي قسماً جديداً
        </motion.button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
            {categories.map((cat) => (
                <motion.div 
                    key={cat.id}
                    layoutProps={{ duration: 0.3 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-white p-6 rounded-[2rem] shadow-sm border border-pink-100 text-center relative group"
                >
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-pink-50">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-bold text-gray-800">{cat.name}</h3>
                    <button 
                        onClick={() => handleDelete(cat.id)}
                        className="absolute top-4 left-4 bg-red-100 text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        🗑️
                    </button>
                </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* Add Category Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-8 rounded-[3rem] shadow-2xl max-w-md w-full relative border-8 border-pink-100"
            >
              <button onClick={() => setIsAdding(false)} className="absolute top-6 left-6 text-xl text-gray-400">✕</button>
              <h2 className="text-xl font-bold text-[#BB015E] mb-8 font-serif">قسم جديد 🌸</h2>
              
              <div className="space-y-6">
                <div 
                    {...getRootProps()} 
                    className={`border-4 border-dashed rounded-full w-40 h-40 mx-auto flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative ${
                        isDragActive ? 'border-[#BB015E] bg-pink-50' : 'border-pink-100'
                    }`}
                >
                    <input {...getInputProps()} />
                    {newCat.image ? (
                        <img src={newCat.image} className="w-full h-full object-cover" alt="preview" />
                    ) : (
                        <div className="text-gray-400 text-center">
                            <span className="text-3xl">🖼️</span>
                            <p className="text-[10px] font-bold mt-2">صورة القسم</p>
                        </div>
                    )}
                </div>

                <div className="text-right">
                    <label className="block text-sm font-bold text-black mb-2 mr-2">اسم القسم</label>
                    <input 
                        type="text" 
                        value={newCat.name}
                        onChange={(e) => setNewCat({...newCat, name: e.target.value})}
                        className="w-full p-4 rounded-xl bg-pink-50 focus:bg-white border-2 border-transparent focus:border-[#BB015E] outline-none transition-all text-black font-bold"
                        placeholder="مثلاً: العناية بالشعر"
                    />
                </div>

                <button 
                    onClick={handleSave}
                    className="w-full bg-[#BB015E] text-white py-4 rounded-full font-bold shadow-lg hover:shadow-pink-200 transition-all"
                >
                    حفظ القسم ✨
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
