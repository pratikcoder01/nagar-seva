import { Navbar } from "@/ui/components/Navbar";
import { Hero } from "@/ui/sections/Hero";
import { Stats } from "@/ui/sections/Stats";
import { HowItWorks } from "@/ui/sections/HowItWorks";
import { Footer } from "@/ui/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
