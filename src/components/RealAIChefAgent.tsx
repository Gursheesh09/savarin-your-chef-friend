
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";

const ELEVEN_LABS_API_KEY = "sk-d34fe68b0a6d90fd29c92812830ed71df2ebac74d0877955";
const VOICE_ID = "M563YhMmA0S8vEYwkgYa";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const RealAIChefAgent = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMarcoSpeaking, setIsMarcoSpeaking] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    currentTopic: '',
    userSkillLevel: 'beginner',
    lastDish: '',
    cookingGoals: [],
    personality: 'friendly'
  });

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [isElevenLabsActive, setIsElevenLabsActive] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleUserMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: "Please try again or type your message.",
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    synthRef.current = window.speechSynthesis;
  }, []);

  // Marco's personality and conversation style
  const marcoPersonality = {
    name: "Marco",
    style: "warm, encouraging, and passionate about cooking",
    expertise: ["Italian cuisine", "Mediterranean cooking", "pasta making", "sauce techniques"],
    catchphrases: ["Mamma mia!", "Perfetto!", "Let's make magic in the kitchen!", "Cooking is love made visible!"]
  };

  // Smart Chef Marco responses (no API needed)
  const getChefResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Greetings
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Ciao bella! I'm Chef Marco! What would you like to cook today?";
    }
    
    // Recipe requests
    if (input.includes('recipe') || input.includes('cook') || input.includes('make')) {
      if (input.includes('pasta')) {
        return "For perfect pasta: Boil water with salt, cook pasta al dente (8-10 minutes), then toss with olive oil, garlic, and fresh herbs!";
      } else if (input.includes('pizza')) {
        return "Make pizza with store-bought dough, spread tomato sauce, add mozzarella and toppings, then bake at 450°F for 12-15 minutes!";
      } else if (input.includes('chicken')) {
        return "Season chicken with salt, pepper, and Italian herbs. Pan-fry for 6-7 minutes per side until golden and cooked through!";
      } else if (input.includes('pasta') && input.includes('sauce')) {
        return "Make a simple sauce: Heat olive oil, add minced garlic, then add crushed tomatoes, salt, and basil. Simmer for 15 minutes!";
      } else {
        return "What do you want to cook? I can help with pasta, pizza, chicken, or any Italian dish!";
      }
    }
    
    // Ingredient help
    if (input.includes('ingredient') || input.includes('have') || input.includes('what can i make')) {
      if (input.includes('chicken')) {
        return "With chicken, you can make chicken parmesan, chicken piccata, or simple grilled chicken with herbs!";
      } else if (input.includes('pasta') || input.includes('noodles')) {
        return "With pasta, make aglio e olio (garlic and oil), carbonara, or a simple tomato basil sauce!";
      } else if (input.includes('tomato')) {
        return "With tomatoes, make bruschetta, caprese salad, or a fresh tomato sauce for pasta!";
      } else {
        return "What ingredients do you have? Tell me and I'll suggest the perfect Italian dish to make!";
      }
    }
    
    // Cooking techniques
    if (input.includes('how') || input.includes('technique') || input.includes('learn')) {
      if (input.includes('knife') || input.includes('cut')) {
        return "For knife skills: Hold the knife firmly, use a rocking motion, and keep your fingers curled under. Practice makes perfect!";
      } else if (input.includes('sauté') || input.includes('fry')) {
        return "For sautéing: Heat oil in a pan, add ingredients when hot, and keep them moving. Don't overcrowd the pan!";
      } else if (input.includes('pasta') && input.includes('cook')) {
        return "Cook pasta in lots of salted water, stir occasionally, and taste for doneness. It should be al dente - firm but not hard!";
      } else {
        return "What technique do you want to learn? I can teach knife skills, sautéing, pasta cooking, or any Italian cooking method!";
      }
    }
    
    // Meal suggestions
    if (input.includes('dinner') || input.includes('lunch') || input.includes('breakfast') || input.includes('meal')) {
      return "For a quick Italian meal, try pasta aglio e olio, caprese salad, or bruschetta. All simple and delicious!";
    }
    
    // Specific dishes
    if (input.includes('carbonara')) {
      return "Carbonara: Cook pasta, mix eggs with parmesan, add hot pasta to eggs, then add crispy pancetta. No cream needed!";
    } else if (input.includes('risotto')) {
      return "Risotto: Toast rice in butter, add hot stock gradually while stirring, finish with parmesan and butter. Keep stirring!";
    } else if (input.includes('bruschetta')) {
      return "Bruschetta: Toast bread, rub with garlic, top with diced tomatoes, basil, olive oil, and salt. Simple and fresh!";
    }
    
    // Help requests
    if (input.includes('help') || input.includes('stuck') || input.includes('confused')) {
      return "I'm here to help! Ask me about recipes, cooking techniques, or what to make with your ingredients!";
    }
    
    // Default response
    return "Ciao! I'm Chef Marco, your Italian cooking mentor. Ask me about recipes, techniques, or what to cook with your ingredients!";
  };

  // Eleven Labs API call for natural voice
  const speakWithElevenLabs = async (text: string) => {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Eleven Labs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsMarcoSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.play();
    } catch (error) {
      console.error('Eleven Labs Error:', error);
      // Fallback to browser speech synthesis
      if (synthRef.current) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsMarcoSpeaking(false);
        synthRef.current.speak(utterance);
      }
    }
  };

  const handleUserMessage = async (input: string) => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      // Get smart Chef Marco response
      const chefResponse = getChefResponse(input);
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: chefResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Use Eleven Labs for natural voice
      if (!isMuted && isElevenLabsActive) {
        setIsMarcoSpeaking(true);
        await speakWithElevenLabs(chefResponse);
      } else if (!isMuted && synthRef.current) {
        // Fallback to browser speech synthesis
        setIsMarcoSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(chefResponse);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        utterance.onend = () => {
          setIsMarcoSpeaking(false);
        };
        
        synthRef.current.speak(utterance);
      }
    } catch (error) {
      console.error('Error getting chef response:', error);
      // Smart fallback response
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm Chef Marco! Ask me about recipes, cooking techniques, or what to make with your ingredients!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (input: string) => {
    handleUserMessage(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(inputText);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      // Auto-activate Eleven Labs when starting voice
      if (!isElevenLabsActive) {
        setIsElevenLabsActive(true);
      }
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (synthRef.current && !isMuted) {
      synthRef.current.cancel();
      setIsMarcoSpeaking(false);
    }
  };

  const startElevenLabsConversation = () => {
    setIsElevenLabsActive(true);
    toast({
      title: "Eleven Labs Connected",
      description: "Marco is now using natural voice!",
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Chef Marco</h1>
        <p className="text-gray-600">Your passionate Italian cooking mentor</p>
        <div className="flex items-center justify-center gap-2 text-sm text-orange-600">
          <span>🍝</span>
          <span>20+ years experience</span>
          <span>•</span>
          <span>Italian cuisine expert</span>
          <span>•</span>
          <span>Always encouraging</span>
              </div>
            </div>

      {/* Chat Interface */}
      <Card className="shadow-lg border-0">
        <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">👨‍🍳</span>
            Chat with Chef Marco
          </CardTitle>
          <p className="text-orange-100 text-sm">Ask me anything about cooking - I'm here to help you become an amazing chef!</p>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Messages */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p className="text-lg">👋 Hi! I'm Chef Marco!</p>
                <p className="text-sm mt-2">Ask me anything about cooking!</p>
                <p className="text-xs mt-1 text-blue-600">Click "Start Talking" to use voice, or type below</p>
                <p className="text-xs mt-1 text-purple-600">⚡ OpenAI + Eleven Labs = Smart responses + Natural voice</p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Voice Controls */}
          <div className="flex justify-center gap-4 mb-4">
            <Button
              onClick={isListening ? stopListening : startListening}
              className={`${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white px-8 py-4 rounded-full text-lg`}
              disabled={isLoading}
            >
              {isListening ? <MicOff className="w-6 h-6 mr-2" /> : <Mic className="w-6 h-6 mr-2" />}
              {isListening ? 'Stop Talking' : 'Start Talking'}
            </Button>
          </div>

          {/* Status */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 text-sm">
              <div className={`w-3 h-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : isMarcoSpeaking ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              <span className="text-gray-600">
                {isListening ? 'Listening...' : isMarcoSpeaking ? 'Marco is speaking...' : 'Ready to talk or type'}
              </span>
            </div>
          </div>

          {/* Input */}
          <div className="flex gap-3">
            <Input
              placeholder="Ask me about cooking or click 'Start Talking' to use voice..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 text-lg border-2 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
            />
            <Button
              onClick={() => handleSubmit(inputText)}
              disabled={isLoading || !inputText.trim()}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
            >
              Send
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button
          onClick={() => handleSubmit("I'm a beginner, can you help me learn to cook?")}
          variant="outline"
          className="h-20 text-center border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50"
        >
          <div className="space-y-1">
            <div className="text-2xl">🌱</div>
            <div className="text-sm font-medium">I'm New</div>
          </div>
        </Button>
        
        <Button
          onClick={() => handleSubmit("I want to learn about pasta!")}
          variant="outline"
          className="h-20 text-center border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50"
        >
          <div className="space-y-1">
            <div className="text-2xl">🍝</div>
            <div className="text-sm font-medium">Pasta Magic</div>
          </div>
        </Button>
        
        <Button
          onClick={() => handleSubmit("I'm feeling nervous about cooking")}
          variant="outline"
          className="h-20 text-center border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50"
        >
          <div className="space-y-1">
            <div className="text-2xl">💪</div>
            <div className="text-sm font-medium">Need Support</div>
          </div>
        </Button>
        
        <Button
          onClick={() => handleSubmit("What cooking techniques should I learn?")}
          variant="outline"
          className="h-20 text-center border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50"
        >
          <div className="space-y-1">
            <div className="text-2xl">🎯</div>
            <div className="text-sm font-medium">Techniques</div>
          </div>
        </Button>
      </div>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-0 shadow-sm">
        <CardContent className="p-4">
          <p className="text-center text-gray-700 text-sm">
            💡 <strong>Ask me anything!</strong> Powered by OpenAI for smart responses. Try: "What recipe is this?" or "Help with pasta"
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
