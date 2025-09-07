import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-cooking.jpg";
import { useNavigate } from "react-router-dom";
import { ChefHat, Utensils, Users, Clock } from "lucide-react";

export const Hero = () => {
  const navigate = useNavigate();

  const handleStartCooking = () => {
    navigate('/demo');
  };

  const handleMeetChef = () => {
    navigate('/ai-chef');
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Glass Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/20 backdrop-blur-xl rounded-full border border-gray-200/30"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gray-900/10 backdrop-blur-xl rounded-full border border-gray-200/30"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/30 backdrop-blur-xl rounded-full border border-gray-200/20"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Glass Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-xl text-gray-800 rounded-full mb-12 border border-gray-200/50 shadow-lg">
          <ChefHat className="w-5 h-5" />
          <span className="text-sm font-medium">Your Personal Chef</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-8 leading-tight tracking-tight">
          Learn to Cook with
          <span className="block font-medium">Confidence</span>
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
          Get step-by-step guidance, helpful tips, and build your cooking skills with our friendly chef assistant.
        </p>

        {/* Glass CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
          <Button 
            onClick={handleStartCooking}
            className="px-10 py-4 text-lg font-medium bg-gray-900 hover:bg-gray-800 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
          >
            <Utensils className="w-6 h-6 mr-3" />
            Start Cooking
          </Button>

          <Button 
            onClick={handleMeetChef}
            variant="outline"
            className="px-10 py-4 text-lg font-medium border-2 border-gray-300 text-gray-700 hover:bg-white/80 hover:border-gray-400 rounded-2xl backdrop-blur-sm transition-all duration-300"
          >
            <ChefHat className="w-6 h-6 mr-3" />
            Meet Chef Savarin
          </Button>
        </div>

        {/* Glass Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: ChefHat, title: "Expert Guidance", desc: "Step-by-step instructions from professional chefs" },
            { icon: Clock, title: "Save Time", desc: "Learn efficient techniques and avoid common mistakes" },
            { icon: Users, title: "Build Skills", desc: "Gain confidence and master new recipes" }
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group p-8 bg-white/60 backdrop-blur-xl rounded-3xl border border-gray-200/50 hover:bg-white/80 hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                <div className="p-4 bg-gray-900/5 rounded-2xl w-fit mx-auto mb-6 group-hover:bg-gray-900/10 transition-colors duration-300">
                  <IconComponent className="w-8 h-8 text-gray-700" />
                </div>
                <h3 className="text-gray-900 font-medium mb-3 text-lg">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Learn More Button */}
        <div className="mt-16">
          <Button 
            onClick={handleLearnMore}
            variant="ghost"
            className="text-gray-500 hover:text-gray-700 hover:bg-white/50 backdrop-blur-sm rounded-xl px-6 py-3 transition-all duration-300"
          >
            Learn More
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
};