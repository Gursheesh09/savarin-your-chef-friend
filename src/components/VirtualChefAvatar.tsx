import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChefHat, Heart, Globe, Mic, Volume2, MessageSquare } from "lucide-react";

interface VirtualChefAvatarProps {
  chefPersonality?: 'punjabi' | 'chinese' | 'french' | 'universal';
  isListening?: boolean;
  isSpeaking?: boolean;
  currentMessage?: string;
  mood?: 'happy' | 'encouraging' | 'focused' | 'excited';
  isThinking?: boolean;
  currentTranscript?: string;
  emotionalState?: 'neutral' | 'excited' | 'caring' | 'proud' | 'encouraging';
}

export const VirtualChefAvatar = ({ 
  chefPersonality = 'universal',
  isListening = false,
  isSpeaking = false,
  currentMessage = "",
  mood = 'happy',
  isThinking = false,
  currentTranscript = "",
  emotionalState = 'neutral'
}: VirtualChefAvatarProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [lipSyncAnimation, setLipSyncAnimation] = useState(0);
  const [eyeAnimation, setEyeAnimation] = useState('😊');

  useEffect(() => {
    if (isSpeaking) {
      setIsAnimating(true);
      // Lip sync animation
      const lipInterval = setInterval(() => {
        setLipSyncAnimation(prev => (prev + 1) % 4);
      }, 150);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
        clearInterval(lipInterval);
        setLipSyncAnimation(0);
      }, 2000);
      
      return () => {
        clearTimeout(timer);
        clearInterval(lipInterval);
      };
    }
  }, [isSpeaking]);

  // Eye animation based on emotional state
  useEffect(() => {
    const emotions = {
      'neutral': ['😊', '😄', '🙂'],
      'excited': ['🤩', '✨', '😍'],
      'caring': ['🥰', '💖', '😌'],
      'proud': ['😊', '👏', '🌟'],
      'encouraging': ['💪', '👍', '😊']
    };
    
    const currentEmotions = emotions[emotionalState];
    let index = 0;
    
    const eyeInterval = setInterval(() => {
      setEyeAnimation(currentEmotions[index % currentEmotions.length]);
      index++;
    }, 2000);
    
    return () => clearInterval(eyeInterval);
  }, [emotionalState]);

  const getChefInfo = () => {
    const lipSyncMouths = ['😊', '😮', '😯', '🙂'];
    const currentMouth = isSpeaking ? lipSyncMouths[lipSyncAnimation] : '😊';
    
    switch (chefPersonality) {
      case 'punjabi':
        return {
          name: "Chef Gurpreet",
          title: "ਪੰਜਾਬੀ ਰਸੋਈ ਮਾਸਟਰ",
          subtitle: "Punjabi Kitchen Master",
          avatar: isSpeaking ? `👳‍♂️${currentMouth}` : "👳‍♂️😊",
          background: "from-orange-400 via-yellow-500 to-green-500",
          accent: "border-orange-300",
          greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! Let's cook with Punjab da pyaar!",
          personality: "Warm, loving, and passionate about Punjabi traditions"
        };
      case 'chinese':
        return {
          name: "Chef Li Wei",
          title: "中华料理大师",
          subtitle: "Chinese Culinary Master", 
          avatar: isSpeaking ? `👩‍🍳${currentMouth}` : "👩‍🍳😊",
          background: "from-red-500 via-orange-500 to-yellow-500",
          accent: "border-red-300",
          greeting: "你好! Ready to master the wok with 5000 years of wisdom?",
          personality: "Wise, precise, and deeply rooted in Chinese culinary philosophy"
        };
      case 'french':
        return {
          name: "Chef Marie",
          title: "Maître Cuisinier",
          subtitle: "French Culinary Master",
          avatar: isSpeaking ? `👩‍🍳${currentMouth}` : "👩‍🍳😊",
          background: "from-blue-500 via-purple-500 to-pink-500",
          accent: "border-blue-300",
          greeting: "Bonjour! Let's create something magnifique together!",
          personality: "Elegant, passionate, and devoted to culinary artistry"
        };
      default:
        return {
          name: "Chef Savarin",
          title: "Global Culinary Guide",
          subtitle: "Your Cooking Companion",
          avatar: isSpeaking ? `👨‍🍳${currentMouth}` : "👨‍🍳😊",
          background: "from-primary via-secondary to-accent",
          accent: "border-primary",
          greeting: "Hello! I'm here to guide you with love and technique!",
          personality: "Caring, knowledgeable, and genuinely invested in your growth"
        };
    }
  };

  const getMoodAnimation = () => {
    if (isThinking) return 'animate-pulse';
    if (isSpeaking) return 'animate-bounce';
    if (isListening) return 'animate-pulse';
    
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
    <Card className={`p-6 border-2 ${chef.accent} bg-gradient-to-br ${chef.background} text-white relative overflow-hidden shadow-2xl ${isSpeaking ? 'scale-105' : 'scale-100'} transition-all duration-300`}>
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className={`w-full h-full bg-gradient-to-r from-transparent via-white to-transparent ${isSpeaking ? 'animate-pulse' : ''}`}></div>
      </div>
      
      {/* Audio Visualization */}
      {isSpeaking && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 overflow-hidden">
          <div className="h-full bg-white animate-pulse"></div>
        </div>
      )}
      
      <div className="relative z-10">
        {/* Enhanced Chef Avatar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`text-6xl ${getMoodAnimation()} relative`}>
              <span className="drop-shadow-lg">{chef.avatar.split('😊')[0]}</span>
              <div className="absolute -bottom-1 -right-1 text-2xl">
                {eyeAnimation}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-xl text-white drop-shadow-md">{chef.name}</h3>
              <p className="text-sm text-white/90 font-medium">{chef.title}</p>
              <p className="text-xs text-white/80">{chef.subtitle}</p>
              <p className="text-xs text-white/70 italic">{chef.personality}</p>
            </div>
          </div>
          
          {/* Enhanced Status Indicators */}
          <div className="flex flex-col gap-2">
            {isThinking && (
              <Badge variant="secondary" className="text-xs bg-purple-500/30 text-white border-purple-300/50 animate-pulse">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                  Thinking...
                </div>
              </Badge>
            )}
            {isListening && (
              <Badge variant="secondary" className="text-xs bg-green-500/30 text-white border-green-300/50">
                <Mic className="w-3 h-3 mr-1 animate-pulse" />
                I'm listening...
              </Badge>
            )}
            {isSpeaking && (
              <Badge variant="secondary" className="text-xs bg-blue-500/30 text-white border-blue-300/50">
                <Volume2 className="w-3 h-3 mr-1 animate-bounce" />
                Speaking
              </Badge>
            )}
          </div>
        </div>

        {/* Live Transcript Display */}
        {currentTranscript && (
          <div className="bg-green-500/20 backdrop-blur-sm rounded-lg p-3 mb-3 border border-green-300/30">
            <div className="flex items-start gap-2">
              <Mic className="w-4 h-4 mt-0.5 text-green-300" />
              <div>
                <p className="text-xs text-green-200 mb-1">You said:</p>
                <p className="text-sm text-white font-medium italic">"{currentTranscript}"</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Current Message */}
        {currentMessage && (
          <div className="bg-white/25 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/30">
            <div className="flex items-start gap-3">
              <MessageSquare className={`w-5 h-5 mt-0.5 text-white/90 ${isSpeaking ? 'animate-bounce' : ''}`} />
              <div className="flex-1">
                <p className="text-sm text-white font-medium leading-relaxed">{currentMessage}</p>
                {isSpeaking && (
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-75"></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce delay-150"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Chef Personality Info */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-white/80">
            <Heart className={`w-4 h-4 ${emotionalState === 'caring' ? 'animate-pulse text-pink-300' : ''}`} />
            <span className="font-medium">Cooking with genuine care</span>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Globe className="w-4 h-4" />
            <span className="font-medium">{chefPersonality === 'universal' ? 'World Cuisine Expert' : chef.subtitle}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Breathing Animations */}
      <div className={`absolute -bottom-3 -right-3 w-20 h-20 bg-white/15 rounded-full animate-ping ${isSpeaking ? 'animate-pulse' : ''}`}></div>
      <div className={`absolute -top-3 -left-3 w-16 h-16 bg-white/10 rounded-full animate-ping delay-1000 ${isListening ? 'animate-bounce' : ''}`}></div>
      
      {/* Mood-based particles */}
      {emotionalState === 'excited' && (
        <>
          <div className="absolute top-4 right-4 text-yellow-300 animate-bounce">✨</div>
          <div className="absolute bottom-6 left-6 text-yellow-300 animate-bounce delay-500">⭐</div>
        </>
      )}
      
      {emotionalState === 'caring' && (
        <>
          <div className="absolute top-6 right-6 text-pink-300 animate-pulse">💖</div>
          <div className="absolute bottom-4 left-4 text-pink-300 animate-pulse delay-700">🥰</div>
        </>
      )}
    </Card>
  );
};