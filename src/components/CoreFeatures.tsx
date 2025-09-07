import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Brain, Shuffle, ChefHat } from "lucide-react";
import { useNavigate } from "react-router-dom";

const coreFeatures = [
  {
    icon: MessageSquare,
    title: "Natural Conversation",
    description: "Ask questions naturally while you cook. Get helpful answers about timing, temperature, and techniques.",
  },
  {
    icon: Brain,
    title: "Smart Assistance",
    description: "The chef understands your cooking pace and provides guidance that matches your skill level and timing.",
  },
  {
    icon: Shuffle,
    title: "Ingredient Substitutions", 
    description: "Missing an ingredient? Get smart alternatives that maintain the dish's flavor and quality.",
  },
  {
    icon: ChefHat,
    title: "Multiple Styles",
    description: "Learn different cooking styles - from simple home cooking to restaurant-quality techniques.",
  },
];

export const CoreFeatures = () => {
  const navigate = useNavigate();

  const handleStartCooking = () => {
    navigate('/demo');
  };

  return (
    <section id="core-features" className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple, effective cooking guidance that actually helps you in the kitchen
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {coreFeatures.map((feature, index) => (
            <Card 
              key={index}
              className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-xl mb-4 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center">
          <Button 
            onClick={handleStartCooking}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Try It Now
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            No account needed. Start cooking in minutes.
          </p>
        </div>
      </div>
    </section>
  );
};