import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features"; 
import { Stats } from "@/components/Stats";
import { CoreFeatures } from "@/components/CoreFeatures";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const Index = () => {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen">
      <Hero />
      <section className="py-6">
        <div className="container mx-auto px-4 text-center">
          <Button size="lg" onClick={() => navigate('/demo')}>
            🚀 Experience Revolutionary AI Chef
          </Button>
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
