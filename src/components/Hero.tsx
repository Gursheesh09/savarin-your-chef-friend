import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-cooking.jpg";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  
  const handleBeginCooking = () => {
    navigate('/demo');
  };

  const handleJoinCookingSessions = () => {
    navigate('/cooking-sessions');
  };

  const handleTalkWithSavarin = () => {
    toast({
      title: "🚀 Revolutionary AI Chef Available!",
      description: "Experience the future of cooking with computer vision and real AI guidance.",
    });
    const featuresSection = document.getElementById('core-features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-warm overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Modern kitchen with hands cooking" 
          className="w-full h-full object-cover opacity-20"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80" />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-charcoal mb-6 leading-tight">
          Revolutionary AI chef that{" "}
          <span className="bg-gradient-hero bg-clip-text text-transparent">
            sees & guides you
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          The world's first AI sous chef with <strong>computer vision</strong> and <strong>real AI intelligence</strong>. 
          Watches your cooking, recognizes ingredients, and provides expert guidance in real-time.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button variant="hero" size="xl" className="min-w-48" onClick={handleBeginCooking}>
            🚀 Try Revolutionary AI
          </Button>
          <Button variant="warm" size="xl" className="min-w-48" onClick={handleJoinCookingSessions}>
            Join Live Sessions
          </Button>
          <Button variant="outline" size="xl" className="min-w-48" onClick={handleTalkWithSavarin}>
            Learn More
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground">
          <strong>Revolutionary Features:</strong> Computer vision • Real AI • Voice interaction • Mobile-first
        </p>
      </div>
      
      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button variant="hero" size="lg" className="shadow-elevated rounded-full" onClick={handleBeginCooking}>
          🚀 Try AI Chef
        </Button>
      </div>
    </section>
  );
};