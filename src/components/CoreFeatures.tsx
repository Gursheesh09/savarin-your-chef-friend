import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Brain, Shuffle, ChefHat } from "lucide-react";

const coreFeatures = [
  {
    icon: MessageSquare,
    title: "Thoughtful Voice",
    description: "Hands-free guidance while you cook. Ask for timings, temps, and techniques; Savarin answers in a calm, chef-trained voice.",
  },
  {
    icon: Brain,
    title: "Intuitive Presence",
    description: "Understands pace and context. If you're behind, it slows; if you're ready, it advances.",
  },
  {
    icon: Shuffle,
    title: "Smart Substitutions", 
    description: "Out of shallots? No problem. Savarin suggests pro-level swaps without compromising flavor.",
  },
  {
    icon: ChefHat,
    title: "Chef Modes",
    description: "Cook in styles inspired by partner chefs—French bistro, Tuscan home, Japanese izakaya, and more.",
  },
];

export const CoreFeatures = () => {
  return (
    <section className="py-20 px-6 bg-gradient-warm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-6">
            Core Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to transform your cooking experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {coreFeatures.map((feature, index) => (
            <Card 
              key={index}
              className="bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-elevated transition-all duration-300 hover:scale-105"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-hero rounded-xl mb-4 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-charcoal">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button variant="hero" size="xl" className="mb-4">
            Begin Cooking
          </Button>
          <p className="text-sm text-muted-foreground">
            No login needed. Try a 3-minute guided recipe.
          </p>
        </div>
      </div>
    </section>
  );
};