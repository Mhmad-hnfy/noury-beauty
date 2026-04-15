import Hero from "@/_Components/Hero";
import Prof from "@/_Components/Prof";
import Footer from "@/_Components/Footer";
import Hedar from "@/_Components/Hedar";
export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hedar />
      <Hero /> 
      <Prof />
      <Footer />
    </main>
  );
}
