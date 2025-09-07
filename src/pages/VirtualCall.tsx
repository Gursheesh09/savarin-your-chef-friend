import { ArrowLeft, ChefHat, Utensils, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import VirtualFaceTime from "@/components/VirtualFaceTime";
import { RealTimeCookingAssistant } from "@/components/RealTimeCookingAssistant";
import { RealAIChefAgent } from "@/components/RealAIChefAgent";

export const VirtualCall = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Simple Header */}
        <div className="flex items-center justify-between mb-8 pt-8">
          <Button 
            variant="ghost" 
            size="lg" 
            onClick={() => navigate("/")} 
            className="flex items-center gap-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-3 px-4 py-2 bg-orange-100 border border-orange-200 rounded-full">
            <ChefHat className="w-5 h-5 text-orange-600" />
            <span className="text-orange-700 font-medium">Virtual Cooking</span>
          </div>
        </div>

        {/* Hero Section */}
        <Card className="mb-12 border-0 shadow-sm bg-orange-50">
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 border border-orange-200 rounded-full mb-6">
              <ChefHat className="w-4 h-4 text-orange-600" />
              <span className="text-orange-700 text-sm font-medium">Interactive Cooking</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Learn to Cook{" "}
              <span className="text-orange-600">
                Together
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Get interactive cooking guidance, ask questions, and learn new techniques with our virtual cooking experience.
            </p>
            
            {/* Simple Features */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: ChefHat, title: "Expert Guidance", desc: "Professional cooking tips" },
                { icon: Utensils, title: "Interactive Help", desc: "Ask questions while cooking" },
                { icon: Users, title: "Learn Together", desc: "Step-by-step instruction" }
              ].map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="p-4 bg-white rounded-xl border border-orange-100 shadow-sm">
                    <IconComponent className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                    <h3 className="text-gray-900 font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Real AI Chef Agent - Your Working Sous Chef */}
        <div className="mb-12">
          <RealAIChefAgent />
        </div>

        {/* Real-Time Cooking Assistant */}
        <div className="mb-12">
          <RealTimeCookingAssistant />
        </div>

        {/* FaceTime Interface */}
        <VirtualFaceTime />
      </div>
    </div>
  );
};

export default VirtualCall;
