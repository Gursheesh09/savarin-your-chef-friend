import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Heart, Globe, Mic } from "lucide-react";

interface VirtualChefAvatarProps {
  chefPersonality?: 'punjabi' | 'chinese' | 'french' | 'universal';
  isListening?: boolean;
  isSpeaking?: boolean;
  currentMessage?: string;
  mood?: 'happy' | 'encouraging' | 'focused' | 'excited';
}

export const VirtualChefAvatar = ({ 
  chefPersonality = 'universal',
  isListening = false,
  isSpeaking = false,
  currentMessage = "",
  mood = 'happy'
}: VirtualChefAvatarProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isSpeaking) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSpeaking]);

  const getChefInfo = () => {
    switch (chefPersonality) {
      case 'punjabi':
        return {
          name: "Chef Gurpreet",
          title: "ਪੰਜਾਬੀ ਰਸੋਈ ਮਾਸਟਰ",
          subtitle: "Punjabi Kitchen Master",
          avatar: "👳‍♂️",
          background: "from-orange-400 to-green-500",
          accent: "border-orange-300",
          greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! Let's cook with Punjab da pyaar!"
        };
      case 'chinese':
        return {
          name: "Chef Li Wei",
          title: "中华料理大师",
          subtitle: "Chinese Culinary Master", 
          avatar: "👩‍🍳",
          background: "from-red-500 to-yellow-500",
          accent: "border-red-300",
          greeting: "你好! Ready to master the wok with 5000 years of wisdom?"
        };
      case 'french':
        return {
          name: "Chef Marie",
          title: "Maître Cuisinier",
          subtitle: "French Culinary Master",
          avatar: "👩‍🍳",
          background: "from-blue-500 to-white",
          accent: "border-blue-300",
          greeting: "Bonjour! Let's create something magnifique together!"
        };
      default:
        return {
          name: "Chef Savarin",
          title: "Global Culinary Guide",
          subtitle: "Your Cooking Companion",
          avatar: "👨‍🍳",
          background: "from-primary to-primary-glow",
          accent: "border-primary",
          greeting: "Hello! I'm here to guide you with love and technique!"
        };
    }
  };

  const getMoodAnimation = () => {
    switch (mood) {
      case 'excited':
        return 'animate-bounce';
      case 'encouraging':
        return 'animate-pulse';
      case 'focused':
        return 'animate-none';
      default:
        return isAnimating ? 'animate-pulse' : 'animate-none';
    }
  };

  const chef = getChefInfo();

  return (
    <Card className={`p-4 border-2 ${chef.accent} bg-gradient-to-br ${chef.background} text-white relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"></div>
      </div>
      
      <div className="relative z-10">
        {/* Chef Avatar */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`text-4xl ${getMoodAnimation()}`}>
              {chef.avatar}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">{chef.name}</h3>
              <p className="text-xs text-white/80">{chef.title}</p>
              <p className="text-xs text-white/70">{chef.subtitle}</p>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="flex flex-col gap-1">
            {isListening && (
              <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                <Mic className="w-3 h-3 mr-1 animate-pulse" />
                Listening
              </Badge>
            )}
            {isSpeaking && (
              <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></div>
                  Speaking
                </div>
              </Badge>
            )}
          </div>
        </div>

        {/* Current Message */}
        {currentMessage && (
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-3">
            <div className="flex items-start gap-2">
              <ChefHat className="w-4 h-4 mt-0.5 text-white/80" />
              <p className="text-sm text-white font-medium">{currentMessage}</p>
            </div>
          </div>
        )}

        {/* Chef Personality Info */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-white/70">
            <Heart className="w-3 h-3" />
            <span>Cooking with love</span>
          </div>
          <div className="flex items-center gap-1 text-white/70">
            <Globe className="w-3 h-3" />
            <span>{chefPersonality === 'universal' ? 'World Cuisine' : chef.subtitle}</span>
          </div>
        </div>
      </div>

      {/* Breathing Animation */}
      <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-white/10 rounded-full animate-ping"></div>
      <div className="absolute -top-2 -left-2 w-12 h-12 bg-white/10 rounded-full animate-ping delay-1000"></div>
    </Card>
  );
};