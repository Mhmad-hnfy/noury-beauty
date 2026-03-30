import Image from "next/image";
import Header from "../components/Header";
import Hearo from "../components/Hearo";
import Categories from "../components/Categories";
import Products from "../components/Products";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div dir="rtl" className="bg-pink-50 min-h-screen flex flex-col">
      <Header/>
      <main className="flex-1">
        <Hearo/>
        <Categories/>
        <Products/>
      </main>
      <Footer/>
    </div>
  );
}
