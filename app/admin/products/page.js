"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { db } from '../../../data/supabase';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    categoryId: 1,
    image: null
  });

  useEffect(() => {
    setProducts(db.products.list());
    setCategories(db.categories.list());
  }, []);

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: {'image/*': []},
    multiple: false 
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({ name: '', price: '', originalPrice: '', categoryId: 1, image: null });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice || '',
        categoryId: product.categoryId || 1,
        image: product.image
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.image) {
      alert('يرجى إكمال البيانات الأساسية وصورة المنتج 🌸');
      return;
    }

    const payload = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        categoryId: parseInt(formData.categoryId)
    };

    if (editingProduct) {
        // Update
        const updated = { ...payload, id: editingProduct.id };
        db.products.update(updated);
        setProducts(products.map(p => p.id === editingProduct.id ? updated : p));
        alert('تم تعديل المنتج بنجاح! ✨');
    } else {
        // Add
        const saved = db.products.add(payload);
        setProducts([saved, ...products]);
        alert('تم إضافة المنتج بنجاح! ✨');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('هل أنتِ متأكدة من حذف هذا المنتج؟')) {
        db.products.delete(id);
        setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Add Button */}
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-pink-100">
        <div>
          <h3 className="text-xl font-bold text-gray-800">إدارة المنتجات ({products.length})</h3>
          <p className="text-sm text-gray-400 font-bold">تحكمي في المخزون والأسعار والخصومات</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenAdd}
          className="bg-[#BB015E] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-pink-200 transition-all flex items-center gap-2"
        >
          <span>➕</span> أضيفي منتجاً جديداً
        </motion.button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-pink-100 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse min-w-[700px]">
                <thead className="bg-pink-50 text-[#BB015E]">
                    <tr>
                        <th className="p-6 font-bold text-sm">المنتج</th>
                        <th className="p-6 font-bold text-sm">السعر الحالي</th>
                        <th className="p-6 font-bold text-sm">السعر الأصلي</th>
                        <th className="p-6 font-bold text-sm">الحالة</th>
                        <th className="p-6 font-bold text-sm">الإجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-pink-50 text-sm">
                    <AnimatePresence>
                        {products.map((product) => (
                            <motion.tr 
                                key={product.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="hover:bg-pink-50/50 transition-colors group"
                            >
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-pink-100 bg-pink-50">
                                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-bold text-gray-800">{product.name}</span>
                                    </div>
                                </td>
                                <td className="p-6 font-black text-[#BB015E]">{product.price} جنيه</td>
                                <td className="p-6 text-gray-400 font-bold">
                                    {product.originalPrice ? `${product.originalPrice} جنيه` : '-'}
                                </td>
                                <td className="p-6">
                                    <span className={`px-4 py-1 rounded-full text-[10px] font-bold ring-4 ring-white ${
                                        product.originalPrice > product.price ? 'bg-pink-100 text-pink-600' : 'bg-green-100 text-green-600'
                                    }`}>
                                        {product.originalPrice > product.price ? 'خصم نشط' : 'سعر عادي'}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleOpenEdit(product)}
                                            className="p-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                            title="تعديل"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id)}
                                            className="p-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                            title="حذف"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </AnimatePresence>
                </tbody>
            </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white p-8 rounded-[3rem] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border-8 border-pink-50"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 left-6 text-2xl text-gray-400 hover:text-gray-600">✕</button>
              <h2 className="text-2xl font-bold text-[#BB015E] mb-8 font-serif">
                {editingProduct ? 'تعديل المنتج ✨' : 'إضافة منتج جديد ✨'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Side: Image Upload */}
                <div className="space-y-4">
                    <label className="block text-sm font-bold text-gray-400 mr-2">صورة المنتج</label>
                    <div 
                        {...getRootProps()} 
                        className={`border-4 border-dashed rounded-[2rem] p-8 text-center cursor-pointer transition-all h-64 flex flex-col items-center justify-center overflow-hidden relative ${
                             isDragActive ? 'border-[#BB015E] bg-pink-50' : 'border-pink-100 hover:border-pink-300'
                        }`}
                    >
                        <input {...getInputProps()} />
                        {formData.image ? (
                            <img src={formData.image} className="absolute inset-0 w-full h-full object-cover" alt="preview" />
                        ) : (
                            <>
                                <div className="text-4xl mb-4">📸</div>
                                <p className="text-gray-400 text-sm font-bold">اسحبي الصورة هنا <br/> أو اضغطي للاختيار</p>
                            </>
                        )}
                    </div>
                </div>

                {/* Right Side: Details */}
                <div className="space-y-4">
                    <div className="text-right">
                        <label className="block text-sm font-bold text-gray-400 mb-2 mr-2">اسم المنتج</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full p-4 rounded-2xl bg-pink-50 border-none outline-none focus:ring-2 focus:ring-[#BB015E]" 
                            placeholder="مثلاً: ليب جلوس وردي" 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-right">
                            <label className="block text-sm font-bold text-gray-400 mb-2 mr-2">السعر الحالي</label>
                            <input 
                                type="number" 
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                className="w-full p-4 rounded-2xl bg-pink-50 border-none outline-none focus:ring-2 focus:ring-[#BB015E]" 
                                placeholder="450" 
                            />
                        </div>
                        <div className="text-right">
                            <label className="block text-sm font-bold text-gray-400 mb-2 mr-2">السعر قبل الخصم</label>
                            <input 
                                type="number" 
                                value={formData.originalPrice}
                                onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                                className="w-full p-4 rounded-2xl bg-pink-50 border-none outline-none focus:ring-2 focus:ring-[#BB015E]" 
                                placeholder="600" 
                            />
                        </div>
                    </div>
                    <div className="text-right">
                        <label className="block text-sm font-bold text-gray-400 mb-2 mr-2">القسم</label>
                        <select 
                            value={formData.categoryId}
                            onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                            className="w-full p-4 rounded-2xl bg-pink-50 border-none outline-none focus:ring-2 focus:ring-[#BB015E]"
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className="w-full bg-[#BB015E] text-white py-5 rounded-full font-bold shadow-xl hover:shadow-pink-300 transition-all mt-10 text-lg"
              >
                 {editingProduct ? 'تعديل وحفظ التغييرات ✨' : 'حفظ المنتج ونشره بالموقع ✨'}
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
