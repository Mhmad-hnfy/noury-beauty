"use client"
import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import Slider from "../components/Slider";
import Categories from "../components/Categories";
import CategorySection from "../components/CategorySection";
import Footer from "../components/Footer";
import { db } from "../data/supabase";

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories(db.categories.list());
  }, []);

  return (
    <div dir="rtl" className="bg-transparent min-h-screen flex flex-col font-sans text-black selection:bg-rose selection:text-white">
      <Header/>
      
      <main className="flex-1">
        {/* 1. Premier Hero Slider */}
        <Slider/>
        
        {/* 2. Square Categories Grid */}
        <Categories/>
        
        {/* 3. Categorized Product Sections */}
        <div className="space-y-4">
           {categories.map(cat => (
             <CategorySection key={cat.id} category={cat} />
           ))}
        </div>

        
      </main>

      <Footer/>
    </div>
  );
}
