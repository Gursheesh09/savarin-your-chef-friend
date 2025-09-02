import { useState, useRef } from "react";
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
  const [apiKey, setApiKey] = useState("");
  const recognitionRef = useRef<any>(null);

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
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support speech recognition.",
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

  const handleSendMessage = async (messageText: string = inputText) => {
    if (!messageText.trim()) return;
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to start chatting.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsProcessing(true);

    try {
      // Call Perplexity API for real AI conversation
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are Chef Savarin, a world-class culinary expert and virtual sous chef. You provide helpful, professional cooking advice with warmth and expertise. Keep responses concise but informative, and always maintain an encouraging, chef-like personality. Focus on practical cooking tips, techniques, and guidance.'
            },
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: messageText
            }
          ],
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "I'm having trouble understanding. Could you rephrase that?";

      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response using ElevenLabs (if API key is valid)
      try {
        await speakResponse(aiResponse);
      } catch (error) {
        console.log('TTS not available, continuing without voice');
      }

      toast({
        title: "Chef Savarin",
        description: aiResponse.slice(0, 100) + (aiResponse.length > 100 ? "..." : ""),
      });

    } catch (error) {
      console.error('AI API Error:', error);
      toast({
        title: "Connection Error",
        description: "I'm having trouble connecting. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const speakResponse = async (text: string) => {
    // This will use the ElevenLabs API key from secrets when available
    const ELEVENLABS_API_KEY = ""; // Will be replaced with proper secret handling
    if (!ELEVENLABS_API_KEY) {
      // Fallback to browser speech synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
      }
      return;
    }

    // ElevenLabs TTS (when API key is valid)
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
        }
      }),
    });

    if (response.ok) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      await audio.play();
      audio.onended = () => URL.revokeObjectURL(audioUrl);
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

      {/* API Key Input */}
      {!apiKey && (
        <div className="mb-4 p-4 bg-accent/30 rounded-lg">
          <label className="block text-sm font-medium mb-2">Enter your Perplexity API Key:</label>
          <Input
            type="password"
            placeholder="pplx-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mb-2"
          />
          <p className="text-xs text-muted-foreground">
            Get your API key from <a href="https://perplexity.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">perplexity.ai</a>
          </p>
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
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Ask Chef Savarin anything about cooking..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSendMessage()}
          disabled={isProcessing || !apiKey}
          className="flex-1"
        />
        <Button
          onClick={() => handleSendMessage()}
          disabled={isProcessing || !inputText.trim() || !apiKey}
          size="sm"
        >
          {isProcessing ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Voice Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleVoiceToggle}
          disabled={isProcessing || !apiKey}
          variant={isListening ? "destructive" : "outline"}
          className="flex items-center gap-2"
        >
          {isListening ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
          {isListening ? "Listening..." : "Voice Chat"}
        </Button>
      </div>

      {isProcessing && (
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">Chef Savarin is thinking...</p>
        </div>
      )}
    </Card>
  );
};