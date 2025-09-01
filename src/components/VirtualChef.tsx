import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, ChefHat, Volume2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const VirtualChef = () => {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<string[]>([]);

  const chefResponses = [
    "Perfect! Let's start with your mise en place - that's getting all ingredients prepped and ready.",
    "Great question! For pasta, your water should be as salty as the sea - taste it to check.",
    "When sautéing garlic, listen for the gentle sizzle. If it's browning too fast, lower the heat.",
    "The secret to perfect scrambled eggs? Low heat and patience. Take them off just before they look done.",
    "For the best sear on meat, pat it completely dry first and don't move it until it releases naturally.",
    "When making a sauce, always taste and adjust. Your palate is your best cooking tool.",
    "Temperature is crucial - use a thermometer for proteins. Chicken should reach 165°F internal temp.",
    "Fresh herbs go in at the end, dried herbs go in early. This preserves their distinct flavors."
  ];

  const startVirtualChef = () => {
    setIsActive(true);
    setConversation([]);
    toast({
      title: "Chef Savarin activated!",
      description: "Your virtual sous chef is ready to help with cooking guidance.",
    });
  };

  const simulateListening = () => {
    setIsListening(true);
    toast({
      title: "Listening...",
      description: "Ask me about techniques, timing, or ingredients!",
    });

    // Simulate processing and response
    setTimeout(() => {
      const response = chefResponses[Math.floor(Math.random() * chefResponses.length)];
      setConversation(prev => [...prev, `Chef Savarin: ${response}`]);
      setIsListening(false);
      
      toast({
        title: "Chef Savarin says:",
        description: response,
      });
    }, 2000);
  };

  const endSession = () => {
    setIsActive(false);
    setIsListening(false);
    setConversation([]);
    toast({
      title: "Session ended",
      description: "Chef Savarin is always here when you need cooking help!",
    });
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
          {!isActive ? (
            <Button 
              onClick={startVirtualChef}
              size="lg"
              className="bg-gradient-hero hover:shadow-glow transition-all duration-300"
            >
              <ChefHat className="w-5 h-5 mr-2" />
              Activate Chef Savarin
            </Button>
          ) : (
            <div className="flex gap-4 items-center">
              <Button 
                onClick={simulateListening}
                disabled={isListening}
                size="lg"
                className="bg-gradient-hero hover:shadow-glow transition-all duration-300"
              >
                {isListening ? <MicOff className="w-5 h-5 mr-2 animate-pulse" /> : <Mic className="w-5 h-5 mr-2" />}
                {isListening ? "Listening..." : "Ask Chef"}
              </Button>
              
              <Button 
                onClick={endSession}
                variant="outline"
                size="lg"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                End Session
              </Button>
            </div>
          )}
        </div>

        {isActive && (
          <div className="bg-primary/10 rounded-lg p-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Chef Savarin is active</span>
            </div>
            <p>Click "Ask Chef" to get cooking advice and professional tips!</p>
          </div>
        )}

        {conversation.length > 0 && (
          <div className="mt-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-charcoal mb-4">Conversation with Chef Savarin</h3>
            <div className="space-y-3 text-left">
              {conversation.map((message, index) => (
                <div key={index} className="bg-accent/30 rounded-lg p-3 text-sm">
                  {message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};