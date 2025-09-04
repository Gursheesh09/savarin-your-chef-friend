import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, MicOff, ChefHat, Send, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const ConversationalChef = () => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Check for microphone access on component mount
  useEffect(() => {
    checkMicrophoneAccess();
  }, []);

  const checkMicrophoneAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsConnected(true);
      toast({
        title: "Microphone Ready 🎤",
        description: "Voice chat is ready to use!",
      });
    } catch (error) {
      console.error('Microphone access denied:', error);
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access for voice chat to work.",
        variant: "destructive",
      });
    }
  };

  // Initialize speech recognition
  const initSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Speech recognition error",
          description: "Please try typing your message instead.",
          variant: "destructive",
        });
      };
      
      return recognition;
    }
    return null;
  };

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initSpeechRecognition();
    }

    if (!recognitionRef.current) {
      // If voice isn't supported, keep chat running with text input
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support speech recognition. You can still chat by typing.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
      toast({
        title: "Listening...",
        description: "Ask Chef Savarin anything about cooking!",
      });
    }
  };

  const startConversation = async () => {
    if (!isConnected) {
      await checkMicrophoneAccess();
      return;
    }

    if (conversationStarted) {
      toast({
        title: "Voice Chat Active",
        description: "Voice conversation is already running. Speak naturally!",
      });
      return;
    }

    setConversationStarted(true);
    setIsProcessing(true);

    // Add initial message
    const welcomeMessage: Message = {
      role: 'assistant',
      content: "Hello! I'm Chef Savarin, your AI culinary assistant. I can help you with recipes, cooking techniques, ingredient substitutions, and any cooking questions you have. What would you like to cook today?",
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);
    
    // Speak welcome message
    await speakResponse(welcomeMessage.content);
    setIsProcessing(false);

    toast({
      title: "Voice Chat Started! 🎤",
      description: "Say anything about cooking - I'm listening!",
    });

    // Start listening for voice input
    handleVoiceToggle();
  };

  const handleSendMessage = async (messageText: string = inputText) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);

    // Simulate AI chef response (replace with actual ElevenLabs conversation when configured)
    const responses = [
      "Great question! For that technique, I recommend starting with medium heat and watching for the visual cues I mentioned.",
      "That's a classic cooking challenge! Here's my professional tip: always taste as you go and adjust seasonings gradually.",
      "Perfect! That ingredient works beautifully in this context. Let me guide you through the proper preparation method.",
      "Excellent choice! That cooking method will give you the best results. Here's exactly how to execute it perfectly.",
      "I love that you're thinking about flavor balance! Here's how to achieve that perfect taste profile you're looking for."
    ];

    // Simulate processing delay
    setTimeout(async () => {
      const aiResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response
      await speakResponse(aiResponse);
      setIsProcessing(false);

      toast({
        title: "Chef Savarin",
        description: aiResponse.slice(0, 100) + (aiResponse.length > 100 ? "..." : ""),
      });
    }, 1500);
  };

  const speakResponse = async (text: string) => {
    // Use browser speech synthesis for now (ElevenLabs integration ready when needed)
    if ('speechSynthesis' in window) {
      // Stop any currently speaking synthesis
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.9;
      
      // Make it sound more chef-like
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang.startsWith('en')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="p-6 bg-gradient-subtle border-primary/20">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-hero rounded-full mx-auto mb-4 flex items-center justify-center shadow-warm">
          <ChefHat className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-charcoal mb-2">Chef Savarin AI</h2>
        <p className="text-muted-foreground text-sm">Your intelligent culinary companion</p>
      </div>

      {/* Start Voice Chat */}
      {!conversationStarted && (
        <div className="mb-6 text-center">
          <Button
            onClick={startConversation}
            disabled={!isConnected}
            size="lg"
            className="px-8 py-4 text-lg font-semibold"
          >
            <Mic className="w-6 h-6 mr-3" />
            Start Voice Chat with Chef Savarin
          </Button>
          {!isConnected && (
            <p className="text-sm text-muted-foreground mt-2">
              🎤 Please allow microphone access in your browser prompt to start.
            </p>
          )}
        </div>
      )}

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
                  {message.role === 'assistant' && (
                    <ChefHat className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p>{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      {conversationStarted && (
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Ask Chef Savarin anything about cooking..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isProcessing && handleSendMessage()}
            disabled={isProcessing}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={isProcessing || !inputText.trim()}
            size="sm"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}

      {/* Voice Button */}
      {conversationStarted && (
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleVoiceToggle}
            disabled={isProcessing}
            variant={isListening ? "destructive" : "outline"}
            className="flex items-center gap-2"
          >
            {isListening ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
            {isListening ? "Stop Listening" : "Voice Chat"}
          </Button>
          
          <Button
            onClick={() => {
              setConversationStarted(false);
              setMessages([]);
              setIsListening(false);
              if (recognitionRef.current) {
                recognitionRef.current.stop();
              }
              window.speechSynthesis.cancel();
            }}
            variant="outline"
            size="sm"
          >
            End Chat
          </Button>
        </div>
      )}

      {isProcessing && (
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">Chef Savarin is thinking...</p>
        </div>
      )}
    </Card>
  );
};