import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features"; 
import { Stats } from "@/components/Stats";
import { CoreFeatures } from "@/components/CoreFeatures";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { VirtualChef } from "@/components/VirtualChef";
import { FoodRecognition } from "@/components/FoodRecognition";
import { VoiceCookingMode } from "@/components/VoiceCookingMode";
import { SmartShoppingList } from "@/components/SmartShoppingList";
import { CookingSkillProgress } from "@/components/CookingSkillProgress";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      
      {/* AI Food Recognition */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <FoodRecognition />
        </div>
      </section>
      
      {/* Voice Cooking Mode */}
      <section className="py-20 px-6 bg-gradient-subtle">
        <div className="max-w-6xl mx-auto">
          <VoiceCookingMode />
        </div>
      </section>
      
      {/* Virtual Chef */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-4xl mx-auto">
          <VirtualChef />
        </div>
      </section>
      
      <Features />
      <Stats />
      
      {/* Smart Shopping List */}
      <section className="py-20 px-6 bg-gradient-subtle">
        <div className="max-w-6xl mx-auto">
          <SmartShoppingList />
        </div>
      </section>
      
      <CoreFeatures />
      
      {/* Skill Progression */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <CookingSkillProgress />
        </div>
      </section>
      
      <HowItWorks />
      <FAQ />
      <Footer />
    </main>
  );
};

export default Index;
