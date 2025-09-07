import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features"; 
import { Stats } from "@/components/Stats";
import { CoreFeatures } from "@/components/CoreFeatures";
import { HowItWorks } from "@/components/HowItWorks";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChefHat, Utensils, Users, Crown, Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <AppLayout showSidebar={false}>
      <Hero />
      
      {/* Glass CTA Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 to-white/30"></div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-xl rounded-full mb-8 border border-gray-200/50 shadow-lg">
            <Crown className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-800">NEW: Live Chef Marketplace</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-light text-gray-900 mb-8 tracking-tight">
            The Future of{" "}
            <span className="font-medium">
              Culinary Education
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed">
            Learn to cook with real professional chefs from around the world in live, interactive video sessions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button 
              size="lg" 
              onClick={() => navigate('/live-chef-marketplace')}
              className="px-10 py-4 text-lg font-medium bg-gray-900 text-white hover:bg-gray-800 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105"
            >
              <ChefHat className="w-6 h-6 mr-3" />
              Experience Live Chef Marketplace
            </Button>
            
            <Button 
              size="lg" 
              onClick={() => navigate('/demo')}
              variant="outline"
              className="px-10 py-4 text-lg font-medium border-2 border-gray-300 text-gray-700 hover:bg-white/80 hover:border-gray-400 rounded-2xl backdrop-blur-sm transition-all duration-300"
            >
              <Utensils className="w-6 h-6 mr-3" />
              Try AI Chef Demo
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <ChefHat className="w-4 h-4" />
              Live video sessions
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Global chef network
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Premium experience
            </div>
          </div>
        </div>
      </section>
      
      {/* Glass Options Section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50/80 to-white/40"></div>
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6 tracking-tight">
              Ready to Start Your Culinary Journey?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your path and begin learning today
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group">
              <Button 
                size="lg" 
                onClick={() => navigate('/live-chef-marketplace')}
                className="w-full h-24 bg-white/60 backdrop-blur-xl border border-gray-200/50 text-gray-800 hover:bg-white/80 hover:shadow-2xl rounded-2xl transition-all duration-500 transform hover:scale-105 flex flex-col items-center justify-center gap-2"
              >
                <ChefHat className="w-6 h-6" />
                <span className="font-medium">Live Chef Marketplace</span>
              </Button>
            </div>
            
            <div className="group">
              <Button 
                size="lg" 
                onClick={() => navigate('/demo')}
                className="w-full h-24 bg-white/60 backdrop-blur-xl border border-gray-200/50 text-gray-800 hover:bg-white/80 hover:shadow-2xl rounded-2xl transition-all duration-500 transform hover:scale-105 flex flex-col items-center justify-center gap-2"
              >
                <Utensils className="w-6 h-6" />
                <span className="font-medium">Try the Demo</span>
              </Button>
            </div>
            
            <div className="group">
              <Button 
                size="lg" 
                onClick={() => navigate('/groq-chefs')}
                className="w-full h-24 bg-white/60 backdrop-blur-xl border border-gray-200/50 text-gray-800 hover:bg-white/80 hover:shadow-2xl rounded-2xl transition-all duration-500 transform hover:scale-105 flex flex-col items-center justify-center gap-2"
              >
                <Users className="w-6 h-6" />
                <span className="font-medium">GROQ Chef Avatars</span>
              </Button>
            </div>
            
            <div className="group">
              <Button 
                size="lg" 
                onClick={() => navigate('/marco')}
                className="w-full h-24 bg-white/60 backdrop-blur-xl border border-gray-200/50 text-gray-800 hover:bg-white/80 hover:shadow-2xl rounded-2xl transition-all duration-500 transform hover:scale-105 flex flex-col items-center justify-center gap-2"
              >
                <Users className="w-6 h-6" />
                <span className="font-medium">Talk to Chef Marco</span>
              </Button>
            </div>
            
            <div className="group">
              <Button 
                size="lg" 
                onClick={() => navigate('/ai-chef')}
                className="w-full h-24 bg-white/60 backdrop-blur-xl border border-gray-200/50 text-gray-800 hover:bg-white/80 hover:shadow-2xl rounded-2xl transition-all duration-500 transform hover:scale-105 flex flex-col items-center justify-center gap-2"
              >
                <Users className="w-6 h-6" />
                <span className="font-medium">Chat with AI Chef</span>
              </Button>
            </div>
            
            <div className="group">
              <Button 
                size="lg" 
                onClick={() => navigate('/virtual-call')}
                className="w-full h-24 bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 text-white hover:bg-gray-800 hover:shadow-2xl rounded-2xl transition-all duration-500 transform hover:scale-105 flex flex-col items-center justify-center gap-2"
              >
                <Users className="w-6 h-6" />
                <span className="font-medium">Virtual Call</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Features />
      <CoreFeatures />
      <Stats />
      <HowItWorks />
      <FAQ />
      <Footer />
    </AppLayout>
  );
};

export default Index;
