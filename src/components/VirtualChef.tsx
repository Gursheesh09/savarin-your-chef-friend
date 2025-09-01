import { useState } from "react";
import { useConversation } from "@11labs/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, ChefHat, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const VirtualChef = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  
  const conversation = useConversation({
    onConnect: () => {
      setIsConnected(true);
      toast({
        title: "Chef Savarin is ready!",
        description: "Your virtual sous chef is listening and ready to help.",
      });
    },
    onDisconnect: () => {
      setIsConnected(false);
      toast({
        title: "Chef Savarin has left",
        description: "Your virtual sous chef session has ended.",
      });
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast({
        title: "Connection Error",
        description: "Unable to connect to Chef Savarin. Please try again.",
        variant: "destructive",
      });
    },
    overrides: {
      agent: {
        prompt: {
          prompt: `You are Chef Savarin, a professional sous chef assistant. You are knowledgeable about cooking techniques, ingredients, timing, and food safety. You speak in a calm, helpful manner and provide practical cooking guidance. You can help with:
          - Recipe suggestions based on mood or available ingredients
          - Cooking techniques and temperatures
          - Ingredient substitutions
          - Timing and coordination of dishes
          - Food safety tips
          - Kitchen organization
          
          Keep your responses conversational but informative. You're here to make cooking easier and more enjoyable.`,
        },
        firstMessage: "Hello! I'm Chef Savarin, your virtual sous chef. I'm here to help you with any cooking questions or guide you through recipes. What would you like to cook today?",
        language: "en",
      },
      tts: {
        voiceId: "CwhRBWXzGAHq8TQ4Fs17" // Roger - professional, calm voice
      },
    },
  });

  const startConversation = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Start conversation with agent ID (you'll need to configure this in ElevenLabs)
      await conversation.startSession({ 
        agentId: "your-agent-id" // This needs to be configured in ElevenLabs
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access to talk with Chef Savarin.",
        variant: "destructive",
      });
    }
  };

  const endConversation = async () => {
    await conversation.endSession();
  };

  return (
    <Card className="p-8 bg-gradient-subtle border-primary/20">
      <div className="text-center">
        <div className="w-24 h-24 bg-gradient-hero rounded-full mx-auto mb-6 flex items-center justify-center shadow-warm">
          <ChefHat className="w-12 h-12 text-primary-foreground" />
        </div>
        
        <h2 className="text-3xl font-bold text-charcoal mb-4">
          Meet Chef Savarin
        </h2>
        
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Your virtual sous chef is ready to assist you with recipes, cooking techniques, 
          and kitchen guidance. Just click to start talking!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
          {!isConnected ? (
            <Button 
              onClick={startConversation}
              size="lg"
              className="bg-gradient-hero hover:shadow-glow transition-all duration-300"
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Cooking Session
            </Button>
          ) : (
            <div className="flex gap-4 items-center">
              <Button 
                onClick={endConversation}
                variant="destructive"
                size="lg"
              >
                <MicOff className="w-5 h-5 mr-2" />
                End Session
              </Button>
              
              {conversation.isSpeaking && (
                <div className="flex items-center text-primary animate-pulse">
                  <Volume2 className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Chef is speaking...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {isConnected && (
          <div className="bg-primary/10 rounded-lg p-4 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Connected to Chef Savarin</span>
            </div>
            <p>Speak naturally - ask about recipes, techniques, or cooking advice!</p>
          </div>
        )}
      </div>
    </Card>
  );
};