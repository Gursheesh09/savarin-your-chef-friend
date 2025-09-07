import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, GraduationCap, ChefHat, Lightbulb } from "lucide-react";

export const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Navigation Header */}
      <div className="container mx-auto px-6 py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 backdrop-blur-sm rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            My Story
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From a small city in India to Michelin-starred kitchens in New York, 
            here's why I'm building the future of cooking with AI.
          </p>
        </div>

        {/* Story Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction Card */}
          <Card className="p-8 bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-lg">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gray-900/10 rounded-full flex items-center justify-center flex-shrink-0">
                <ChefHat className="w-8 h-8 text-gray-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  I'm Gursheesh Singh Dhupar
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  A 21-year-old cook from Nashik, India. My journey started in a small city with big dreams — 
                  to learn food at the highest level and bring that knowledge back home one day.
                </p>
              </div>
            </div>
          </Card>

          {/* Journey Timeline */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Nashik Origins */}
            <Card className="p-6 bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-gray-700" />
                <h3 className="text-xl font-bold text-gray-900">Nashik Roots</h3>
              </div>
              <p className="text-gray-600">
                Growing up in this beautiful city in Maharashtra, I discovered my passion for cooking 
                and dreamed of learning from the best chefs in the world.
              </p>
            </Card>

            {/* CIA Education */}
            <Card className="p-6 bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-6 h-6 text-gray-700" />
                <h3 className="text-xl font-bold text-gray-900">CIA Graduate</h3>
              </div>
              <p className="text-gray-600">
                After finishing the Culinary Institute of America, I had the foundation I needed 
                to work in world-class kitchens.
              </p>
            </Card>

            {/* Per Se Experience */}
            <Card className="p-6 bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <ChefHat className="w-6 h-6 text-gray-700" />
                <h3 className="text-xl font-bold text-gray-900">Per Se NYC</h3>
              </div>
              <p className="text-gray-600">
                Now cooking at Per Se in New York, where every day on the line is about 
                precision, discipline, and passion. It's tough, but it's shaping me into the cook I want to be.
              </p>
            </Card>
          </div>

          {/* Vision Section */}
          <Card className="p-8 bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-lg">
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 bg-gray-900/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-8 h-8 text-gray-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  The Vision Behind AI Sous
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Out of this grind came the idea for AI Sous — a way to take the lessons of 
                  Michelin-starred kitchens and put them into the hands of home cooks everywhere.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  This is just the beginning of what I hope to build: food, technology, and ideas that inspire the world.
                </p>
              </div>
            </div>
          </Card>

          {/* Call to Action */}
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to cook with AI?
            </h3>
            <p className="text-gray-600 mb-6">
              Experience how AI can help you become a better cook.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/demo')}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                🍳 Try AI Chef Demo
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/')}
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};