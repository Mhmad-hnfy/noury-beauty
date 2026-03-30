import Header from '../../components/Header';
import Products from '../../components/Products';
import Footer from '../../components/Footer';

export const metadata = {
  title: 'كل المنتجات | Noury Beauty',
  description: 'تصفحي جميع منتجاتنا الفاخرة',
};

export default function AllProductsPage() {
  return (
    <div dir="rtl" className="bg-pink-50 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Products />
      </main>
      <Footer />
    </div>
  );
}
