import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, GraduationCap, ChefHat, Lightbulb } from "lucide-react";

export const About = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-gradient-warm">
      {/* Navigation Header */}
      <div className="container mx-auto px-6 py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-charcoal mb-6">
            My Story
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From a small city in India to Michelin-starred kitchens in New York, 
            here's why I'm building the future of cooking with AI.
          </p>
        </div>

        {/* Story Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction Card */}
          <Card className="p-8 shadow-soft">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center flex-shrink-0">
                <ChefHat className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-charcoal mb-4">
                  I'm Gursheesh Singh Dhupar
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A 21-year-old cook from Nashik, India. My journey started in a small city with big dreams — 
                  to learn food at the highest level and bring that knowledge back home one day.
                </p>
              </div>
            </div>
          </Card>

          {/* Journey Timeline */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Nashik Origins */}
            <Card className="p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-charcoal">Nashik Roots</h3>
              </div>
              <p className="text-muted-foreground">
                Growing up in this beautiful city in Maharashtra, I discovered my passion for cooking 
                and dreamed of learning from the best chefs in the world.
              </p>
            </Card>

            {/* CIA Education */}
            <Card className="p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-charcoal">CIA Graduate</h3>
              </div>
              <p className="text-muted-foreground">
                After finishing the Culinary Institute of America, I had the foundation I needed 
                to work in world-class kitchens.
              </p>
            </Card>

            {/* Per Se Experience */}
            <Card className="p-6 shadow-soft">
              <div className="flex items-center gap-3 mb-4">
                <ChefHat className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold text-charcoal">Per Se NYC</h3>
              </div>
              <p className="text-muted-foreground">
                Now cooking at Per Se in New York, where every day on the line is about 
                precision, discipline, and passion. It's tough, but it's shaping me into the cook I want to be.
              </p>
            </Card>
          </div>

          {/* Vision Section */}
          <Card className="p-8 shadow-soft bg-gradient-subtle">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-8 h-8 text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-charcoal mb-4">
                  The Vision Behind AI Sous
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Out of this grind came the idea for AI Sous — a way to take the lessons of 
                  Michelin-starred kitchens and put them into the hands of home cooks everywhere.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  This is just the beginning of what I hope to build: food, technology, and ideas that inspire the world.
                </p>
              </div>
            </div>
          </Card>

          {/* Call to Action */}
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-charcoal mb-4">
              Ready to cook with revolutionary AI?
            </h3>
            <p className="text-muted-foreground mb-6">
              Experience the future of cooking with computer vision and real AI guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => navigate('/demo')}>
                🚀 Try Revolutionary AI Chef
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};