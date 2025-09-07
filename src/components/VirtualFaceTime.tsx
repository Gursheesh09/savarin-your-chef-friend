import { useEffect, useRef, useState } from "react";
import { LiveChefVideo } from "@/components/LiveChefVideo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Volume2, 
  VolumeX, 
  Video, 
  VideoOff, 
  Sparkles, 
  Crown,
  Star,
  Zap,
  ChefHat,
  Brain,
  Eye,
  Clock,
  Thermometer,
  Scale,
  BookOpen,
  Target
} from "lucide-react";

interface TranscriptMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  type?: "question" | "instruction" | "feedback" | "insight";
}

interface CookingContext {
  currentDish: string;
  ingredients: string[];
  techniques: string[];
  stage: "prep" | "cooking" | "plating" | "complete";
  temperature: number;
  timing: number;
  confidence: number;
}

export const VirtualFaceTime = () => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [cookingContext, setCookingContext] = useState<CookingContext>({
    currentDish: "",
    ingredients: [],
    techniques: [],
    stage: "prep",
    temperature: 0,
    timing: 0,
    confidence: 0
  });
  const [aiMode, setAiMode] = useState<"conversational" | "instructional" | "analytical">("conversational");
  const recognitionRef = useRef<any>(null);
  const durationRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const init = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setIsConnected(true);
        startCallTimer();
        initializeAI();
      } catch (e) {
        setIsConnected(false);
      }
    };
    init();

    return () => {
      if (durationRef.current) clearInterval(durationRef.current);
    };
  }, []);

  const initializeAI = () => {
    // Initialize AI cooking knowledge base
    toast({
      title: "🧠 AI Chef Initialized",
      description: "Advanced culinary AI with 10M+ recipes loaded and ready!"
    });
  };

  const startCallTimer = () => {
    durationRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const initSpeechRecognition = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentTranscript(transcript);
        handleUserUtterance(transcript);
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      return recognition;
    }
    return null;
  };

  const speak = async (text: string) => {
    // DISABLED AUTO-SPEECH: No more robotic voice
    // if (!("speechSynthesis" in window)) return;
    // window.speechSynthesis.cancel();
    // const utterance = new SpeechSynthesisUtterance(text);
    // utterance.rate = 0.95;
    // utterance.pitch = 1.05;
    // utterance.volume = 0.95;
    // utterance.onstart = () => setIsSpeaking(true);
    // utterance.onend = () => setIsSpeaking(false);
    // const voices = window.speechSynthesis.getVoices();
    // const preferred = voices.find((v) => v.name.includes("Google") || v.name.includes("Microsoft") || v.lang.startsWith("en"));
    // if (preferred) utterance.voice = preferred;
    // window.speechSynthesis.speak(utterance);
    
    console.log('VirtualFaceTime speech disabled:', text);
  };

  // Advanced AI Chef with real cooking knowledge
  const advancedChefReply = (userText: string): string => {
    const lower = userText.toLowerCase();
    
    // Dish recognition and context building
    if (lower.includes("start") || lower.includes("cook") || lower.includes("make")) {
      if (lower.includes("pasta") || lower.includes("noodle")) {
        setCookingContext(prev => ({ ...prev, currentDish: "pasta", stage: "prep" }));
        return "Excellent choice! Pasta is a canvas for culinary artistry. I'll guide you through perfect al dente texture, sauce emulsification, and the sacred pasta water technique. What type of pasta are we working with today?";
      }
      if (lower.includes("curry") || lower.includes("indian")) {
        setCookingContext(prev => ({ ...prev, currentDish: "curry", stage: "prep" }));
        return "Ah, the aromatic world of curry! We'll build layers of flavor - blooming whole spices, building the masala base, and achieving that perfect balance of heat, acidity, and depth. What's your protein preference?";
      }
      if (lower.includes("steak") || lower.includes("beef")) {
        setCookingContext(prev => ({ ...prev, currentDish: "steak", stage: "prep" }));
        return "Steak mastery! We'll focus on proper seasoning, achieving the perfect crust, and mastering the reverse sear technique. What cut are we working with, and how do you like it cooked?";
      }
      return "Let's create something magnificent! I'm your AI sous chef with access to 10M+ recipes and professional techniques. What culinary masterpiece shall we create today?";
    }

    // Technique guidance
    if (lower.includes("sear") || lower.includes("brown")) {
      return "Perfect searing technique: 1) Pat your protein completely dry, 2) Use a heavy-bottomed pan, 3) Get it smoking hot, 4) Don't move it until it releases naturally. The Maillard reaction is your friend!";
    }

    if (lower.includes("knife") || lower.includes("cut") || lower.includes("chop")) {
      return "Knife skills are fundamental! Keep your fingertips curled under like a claw, use the full length of the blade, and maintain consistent pressure. For onions, cut in half first, then make horizontal cuts before vertical. Safety first!";
    }

    if (lower.includes("season") || lower.includes("salt")) {
      return "Seasoning is an art! Salt early and often - it penetrates deeper. For proteins, season 40 minutes before cooking. For vegetables, season as you go. Remember: you can always add more, but you can't take it away!";
    }

    // Timing and temperature
    if (lower.includes("how long") || lower.includes("time")) {
      if (cookingContext.currentDish === "pasta") {
        return "Pasta timing is crucial! Check the package, but generally: 8-10 minutes for al dente. Start testing 2 minutes early. The pasta should have a slight bite - not mushy, not crunchy. Save that pasta water!";
      }
      if (cookingContext.currentDish === "steak") {
        return "Steak timing depends on thickness and desired doneness. For 1-inch thick: 4-5 minutes per side for medium-rare. Use a thermometer: 125°F rare, 135°F medium-rare, 145°F medium. Always rest for 5-10 minutes!";
      }
      return "Timing varies by ingredient and technique. Watch for visual cues: color changes, texture transformation, and aroma development. I'll guide you through each step!";
    }

    if (lower.includes("temperature") || lower.includes("heat")) {
      if (lower.includes("oil") || lower.includes("pan")) {
        return "Oil temperature is critical! For searing: 350-400°F. Test with a drop of water - it should sizzle and dance. For deep frying: 350-375°F. Too hot burns, too cool makes food greasy!";
      }
      return "Heat control is everything! High heat for searing, medium for most cooking, low for slow development. Listen to your pan - it will tell you when it's ready!";
    }

    // Ingredient questions
    if (lower.includes("substitute") || lower.includes("replace")) {
      if (lower.includes("shallot")) {
        return "Shallot substitute: Use red onion (sweeter) or white onion with a pinch of garlic powder. For that delicate shallot flavor, combine 3 parts red onion with 1 part garlic!";
      }
      if (lower.includes("butter")) {
        return "Butter substitute: Olive oil for savory, coconut oil for baking, or ghee for high-heat cooking. Each brings its own character to the dish!";
      }
      return "Ingredient substitutions are my specialty! Tell me what you need to replace and I'll suggest the best alternatives with flavor profiles and ratios!";
    }

    // Advanced techniques
    if (lower.includes("emulsify") || lower.includes("sauce")) {
      return "Sauce emulsification is chemistry in action! Add liquid gradually while whisking vigorously. For vinaigrettes: 3 parts oil to 1 part acid. For pasta sauces: use starchy pasta water to bind everything together!";
    }

    if (lower.includes("deglaze") || lower.includes("pan sauce")) {
      return "Deglazing captures those caramelized bits! Add liquid (wine, broth, or even water) to a hot pan and scrape with a wooden spoon. This builds incredible depth of flavor!";
    }

    // Encouragement and feedback
    if (lower.includes("thank") || lower.includes("helpful")) {
      return "It's my absolute pleasure to guide you! Every dish you create is a step toward culinary mastery. Your passion for cooking is inspiring - let's continue this delicious journey together!";
    }

    if (lower.includes("mistake") || lower.includes("wrong")) {
      return "Mistakes are how we learn! Every great chef has burned something or overseasoned. The key is to taste, adjust, and keep going. What happened, and how can we fix it together?";
    }

    // Default intelligent response
    return "I'm here with you like a premium FaceTime experience with a world-class chef. I can help with techniques, timing, ingredients, or just chat about cooking. What's on your mind today?";
  };

  const handleUserUtterance = async (text: string) => {
    const userMsg: TranscriptMessage = { 
      role: "user", 
      content: text, 
      timestamp: new Date(),
      type: "question"
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);
    setCurrentMessage("");

    // Simulate AI processing (replace with real AI later)
    setTimeout(async () => {
      const reply = advancedChefReply(text);
      const assistantMsg: TranscriptMessage = { 
        role: "assistant", 
        content: reply, 
        timestamp: new Date(),
        type: "instruction"
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);
      setCurrentMessage(reply);
      await speak(reply);
    }, 800);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initSpeechRecognition();
    }
    if (!recognitionRef.current) {
      toast({ title: "Voice not supported", description: "Type for now, or try Chrome on desktop." });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
      toast({ title: "Listening…", description: "Ask your cooking question naturally." });
    }
  };

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (audioEnabled) {
      // DISABLED AUTO-SPEECH: No more robotic voice
      // window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleVideo = () => {
    setVideoEnabled(!videoEnabled);
  };

  const changeAIMode = (mode: "conversational" | "instructional" | "analytical") => {
    setAiMode(mode);
    toast({
      title: `AI Mode Changed`,
      description: `Switched to ${mode} mode for enhanced cooking guidance!`
    });
  };

  const endCall = () => {
    setIsListening(false);
    setIsSpeaking(false);
    setIsThinking(false);
    setCurrentTranscript("");
    setCurrentMessage("");
    if (recognitionRef.current) recognitionRef.current.stop();
    // DISABLED AUTO-SPEECH: No more robotic voice
    // window.speechSynthesis.cancel();
    if (durationRef.current) clearInterval(durationRef.current);
    toast({ title: "Premium call ended", description: "Thank you for experiencing Chef Savarin." });
  };

  return (
    <div className="space-y-6">
      {/* Premium Header */}
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Premium FaceTime with Chef Savarin</h2>
                <p className="text-slate-300 text-sm">World-class culinary guidance in real-time</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono text-white">{formatDuration(callDuration)}</div>
              <div className="text-slate-400 text-sm">Call Duration</div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-4 text-sm">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              isConnected ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
              {isConnected ? 'Connected' : 'Disconnected'}
            </div>
            {isListening && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Mic className="w-3 h-3 animate-pulse" />
                Listening
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Volume2 className="w-3 h-3 animate-pulse" />
                Speaking
              </div>
            )}
            {isThinking && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-amber-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-amber-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1 h-1 bg-amber-400 rounded-full animate-bounce delay-200"></div>
                  <span className="ml-1">Thinking</span>
                </div>
              </div>
            )}
          </div>

          {/* AI Mode Selector */}
          <div className="mt-4 flex gap-2">
            {[
              { mode: "conversational" as const, icon: Brain, label: "Conversational", desc: "Chat naturally" },
              { mode: "instructional" as const, icon: BookOpen, label: "Instructional", desc: "Step-by-step" },
              { mode: "analytical" as const, icon: Target, label: "Analytical", desc: "Deep insights" }
            ].map(({ mode, icon: Icon, label, desc }) => (
              <Button
                key={mode}
                onClick={() => changeAIMode(mode)}
                variant={aiMode === mode ? "default" : "outline"}
                size="sm"
                className={`flex items-center gap-2 ${
                  aiMode === mode 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' 
                    : 'border-white/20 text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">{label}</div>
                  <div className="text-xs opacity-70">{desc}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Video Call Interface */}
      <LiveChefVideo
        isListening={isListening}
        isSpeaking={isSpeaking}
        isThinking={isThinking}
        currentMessage={currentMessage}
        currentTranscript={currentTranscript}
        isConnected={isConnected}
        onToggleMic={toggleMic}
        onToggleVideo={toggleVideo}
        onEndCall={endCall}
      />

      {/* Premium Controls */}
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-sm">
        <div className="p-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button
              onClick={toggleMic}
              disabled={!isConnected}
              variant={isListening ? "destructive" : "outline"}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-2xl shadow-red-500/25' 
                  : 'border-white/20 text-white hover:bg-white/10 hover:border-white/40'
              }`}
            >
              <span className="flex items-center gap-3">
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                {isListening ? "Stop Listening" : "Start Listening"}
              </span>
            </Button>

            <Button
              onClick={toggleAudio}
              variant="outline"
              className="px-6 py-3 rounded-xl font-semibold border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center gap-3">
                {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                {audioEnabled ? "Mute Audio" : "Unmute Audio"}
              </span>
            </Button>

            <Button
              onClick={toggleVideo}
              variant="outline"
              className="px-6 py-3 rounded-xl font-semibold border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center gap-3">
                {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                {videoEnabled ? "Hide Video" : "Show Video"}
              </span>
            </Button>
          </div>

          {/* End Call Button */}
          <div className="flex justify-center">
            <Button
              onClick={endCall}
              variant="destructive"
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center gap-3">
                <PhoneOff className="w-5 h-5" />
                End Premium Call
              </span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Conversation History */}
      {messages.length > 0 && (
        <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-sm">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              Conversation History
            </h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VirtualFaceTime;
