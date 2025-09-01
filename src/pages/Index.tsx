import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features"; 
import { Stats } from "@/components/Stats";
import { CoreFeatures } from "@/components/CoreFeatures";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { VirtualChef } from "@/components/VirtualChef";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <section className="py-12 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <VirtualChef />
        </div>
      </section>
      <Features />
      <Stats />
      <CoreFeatures />
      <HowItWorks />
      <FAQ />
      <Footer />
    </main>
  );
};

export default Index;
