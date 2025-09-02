import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, ChefHat, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'chef';
  content: string;
  timestamp: Date;
}

export const VirtualChef = () => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  const getChefResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Recipe-specific responses
    if (message.includes('butter chicken') || message.includes('chicken makhani')) {
      return "Ah, butter chicken! 🍛 Marinate chicken in yogurt, garam masala, and ginger-garlic paste for 30 min. Cook chicken in butter, then simmer in a rich tomato-cream sauce with onions, garlic, ginger, and spices. The secret? A touch of kasuri methi (dried fenugreek) at the end! Serve with basmati rice and naan.";
    }
    
    if (message.includes('carbonara')) {
      return "Classic carbonara! 🍝 Cook guanciale until crispy, toss hot pasta with egg yolk-parmesan mixture off heat, add pasta water gradually while tossing. No cream needed - just eggs, cheese, pepper, and technique!";
    }
    
    if (message.includes('risotto')) {
      return "Perfect risotto requires patience! 🍚 Toast arborio rice, add warm stock one ladle at a time, stirring constantly. It takes about 18-20 minutes. Finish with butter and parmesan for that creamy 'all'onda' texture.";
    }
    
    if (message.includes('beef wellington')) {
      return "Beef Wellington is a showstopper! 🥩 Sear the tenderloin, coat with mushroom duxelles and pâté, wrap in puff pastry. The key is keeping the pastry crisp - rest the beef before wrapping and use egg wash for that golden finish.";
    }
    
    if (message.includes('chocolate cake') || message.includes('brownie')) {
      return "For rich chocolate desserts! 🍫 Use good quality cocoa powder, don't overmix the batter, and slightly underbake for fudgy texture. Adding coffee enhances the chocolate flavor without making it taste like coffee.";
    }
    
    if (message.includes('steak')) {
      return "Perfect steak technique! 🥩 Bring to room temp, season generously with salt 40 min before cooking. High heat, flip once, use a thermometer: 125°F rare, 135°F medium-rare. Rest for 5-10 minutes before slicing.";
    }
    
    if (message.includes('curry') && !message.includes('butter')) {
      return "Great curry starts with the base! 🍛 Bloom your whole spices in oil first, then add aromatics like onion, ginger, garlic. Build layers with ground spices, tomatoes, and coconut milk or broth. Let it simmer to develop deep flavors.";
    }
    
    // Cooking technique questions
    if (message.includes('sear') || message.includes('searing')) {
      return "For perfect searing, make sure your protein is completely dry and the pan is hot. Don't move it until it releases naturally - that's when you know it's ready to flip!";
    }
    
    if (message.includes('pasta') && !message.includes('carbonara')) {
      return "Pasta water should be as salty as the sea! Save some starchy pasta water before draining - it's liquid gold for making silky sauces that cling perfectly.";
    }
    
    if (message.includes('garlic')) {
      return "Ah, garlic! Slice it thin, keep the heat medium, and listen for that gentle sizzle. If it starts browning too fast, lower the heat immediately. Burnt garlic is bitter garlic!";
    }
    
    if (message.includes('sauce')) {
      return "The secret to great sauces is patience and tasting. Build flavors layer by layer, and always taste and adjust. Your palate is your best tool in the kitchen!";
    }
    
    if (message.includes('egg')) {
      return "Low and slow for scrambled eggs - take them off the heat just before they look done. They'll finish cooking with residual heat and stay creamy.";
    }
    
    if (message.includes('season') || message.includes('salt')) {
      return "Season throughout the cooking process, not just at the end. Each layer of seasoning builds depth of flavor. And remember - you can always add more, but you can't take it away!";
    }
    
    if (message.includes('knife') || message.includes('cutting') || message.includes('chop')) {
      return "A sharp knife is a safe knife! Keep your fingertips curled under like a claw, and let the knife rock through the cuts. Consistent cuts mean even cooking.";
    }
    
    if (message.includes('temperature') || message.includes('heat')) {
      return "Use a thermometer for proteins - chicken should reach 165°F internal temp. For stovetops, medium heat is your friend for most cooking. High heat is for searing only!";
    }
    
    if (message.includes('onion')) {
      return "Crying from onions? Chill them first, or breathe through your mouth while cutting. For caramelized onions, be patient - true caramelization takes 20-30 minutes of slow cooking.";
    }
    
    if (message.includes('bread') || message.includes('baking')) {
      return "Baking is science! Measure by weight when possible, and don't open the oven door too early - you'll let out the heat and deflate your bread.";
    }
    
    if (message.includes('help') || message.includes('what') || message.includes('how')) {
      return "I'm here to help with any cooking questions! Ask me about techniques, ingredients, timing, or troubleshooting. What are you cooking today?";
    }
    
    if (message.includes('thank')) {
      return "You're very welcome! Cooking is about practice and passion. Keep experimenting, keep tasting, and most importantly - have fun in the kitchen!";
    }
    
    // Default responses based on cooking context
    const responses = [
      "That's a great question! In my experience, the key is to trust your senses - sight, smell, and taste will guide you better than any timer.",
      "Ah, let me share a chef's secret with you! The best dishes come from understanding your ingredients and treating them with respect.",
      "I love your curiosity! Cooking is all about building confidence through practice. What specific technique would you like to master?",
      "Excellence in cooking comes from attention to detail and tasting as you go. Tell me more about what you're working on!",
      "That reminds me of when I was learning in the kitchen - every mistake is a lesson. What cooking challenge can I help you with today?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Get chef response
    const chefResponse = getChefResponse(inputText);
    
    const chefMessage: Message = {
      role: 'chef',
      content: chefResponse,
      timestamp: new Date()
    };

    setTimeout(() => {
      setMessages(prev => [...prev, chefMessage]);
      
      // Speak the response
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(chefResponse);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
      }
      
      toast({
        title: "Chef Savarin",
        description: chefResponse.slice(0, 80) + "...",
      });
    }, 800);

    setInputText("");
  };

  const handleVoiceToggle = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setTimeout(() => handleSendMessage(), 100);
      };
      
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice not available",
          description: "Try typing your question instead!",
        });
      };
      
      setIsListening(true);
      recognition.start();
      
      toast({
        title: "Listening...",
        description: "Ask Chef Savarin your cooking question!",
      });
    } else {
      toast({
        title: "Voice not supported",
        description: "Try typing your question instead!",
      });
    }
  };

  return (
    <Card className="p-6 bg-gradient-subtle border-primary/20">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-hero rounded-full mx-auto mb-4 flex items-center justify-center shadow-warm">
          <ChefHat className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Chef Savarin</h2>
        <p className="text-muted-foreground text-sm">Your virtual cooking companion - teaching with love like family! 👨‍🍳</p>
      </div>

      {/* Chat Messages */}
      {messages.length > 0 && (
        <div className="mb-4 max-h-64 overflow-y-auto space-y-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-4'
                    : 'bg-accent/50 text-foreground mr-4'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.role === 'chef' && (
                    <ChefHat className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p>{message.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {messages.length === 0 && (
        <div className="mb-4 p-4 bg-accent/30 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-2">
            👋 Hi! I'm Chef Savarin, your cooking companion.
          </p>
          <p className="text-xs text-muted-foreground">
            Ask me about cooking techniques, ingredients, or any kitchen questions!
          </p>
        </div>
      )}

      {/* Input Area */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Ask about cooking techniques, recipes, or ingredients..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1"
        />
        <Button onClick={handleSendMessage} disabled={!inputText.trim()} size="sm">
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Voice Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleVoiceToggle}
          disabled={isListening}
          variant={isListening ? "destructive" : "outline"}
          className="flex items-center gap-2"
        >
          {isListening ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
          {isListening ? "Listening..." : "Ask with Voice"}
        </Button>
      </div>
    </Card>
  );
};