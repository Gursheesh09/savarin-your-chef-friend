import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Phone, 
  PhoneOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_KEY = "sk-d34fe68b0a6d90fd29c92812830ed71df2ebac74d0877955";

export const SimpleVideoChef: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Simple speech recognition
  const startListening = useCallback(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            setCurrentTranscript(event.results[i][0].transcript);
          }
        }
        
        if (finalTranscript.trim()) {
          handleUserMessage(finalTranscript.trim());
          setCurrentTranscript('');
        }
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
        setCurrentTranscript("");
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        setCurrentTranscript("");
      };
      
      recognitionRef.current.start();
    }
  }, []);

  // Handle user messages with real AI
  const handleUserMessage = async (message: string) => {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are Chef Marco, a friendly professional chef. Keep responses short (1-2 sentences), helpful, and conversational. Focus on cooking advice and encouragement.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 100,
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "I'm sorry, could you repeat that?";
      
      setCurrentMessage(aiResponse);
      speakMessage(aiResponse);
      
    } catch (error) {
      console.error('Error:', error);
      const fallback = "I'm here to help you cook! What would you like to learn today?";
      setCurrentMessage(fallback);
      speakMessage(fallback);
    }
  };

  // Text-to-speech
  const speakMessage = (message: string) => {
    if (!audioEnabled) return;
    
    // Use ElevenLabs if possible, fallback to browser speech
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        // Auto-restart listening
        if (isConnected) {
          setTimeout(() => startListening(), 500);
        }
      };
      
      speechSynthesis.speak(utterance);
    }
  };

  const startCall = () => {
    setIsConnected(true);
    const welcome = "Hi! I'm Chef Marco. I'm here to help you cook amazing food. What would you like to make today?";
    setCurrentMessage(welcome);
    speakMessage(welcome);
  };

  const endCall = () => {
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    setCurrentMessage("");
    setCurrentTranscript("");
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        
        {/* Video Call Interface */}
        <Card className="relative overflow-hidden bg-black border border-gray-800 shadow-2xl">
          
          {/* Call Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                <div>
                  <h3 className="font-bold text-xl">Chef Marco</h3>
                  <p className="text-sm text-gray-300">Professional Chef</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {isListening && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <Mic className="w-3 h-3 mr-1" />
                    Listening
                  </Badge>
                )}
                {isSpeaking && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <Volume2 className="w-3 h-3 mr-1" />
                    Speaking
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Chef Video Feed */}
          <div className="relative w-full h-[500px] bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
            
            {/* Professional Chef Photo Placeholder */}
            <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
              <div className="w-full h-full bg-gradient-to-b from-amber-100 to-amber-200 flex items-center justify-center">
                {/* Simple, clean chef representation */}
                <div className="relative w-full h-full">
                  {/* Face */}
                  <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full shadow-lg"></div>
                  
                  {/* Chef Hat */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-white rounded-t-full shadow-md"></div>
                  
                  {/* Eyes */}
                  <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 flex gap-4">
                    <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-700 rounded-full"></div>
                  </div>
                  
                  {/* Mouth */}
                  <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 transition-all duration-200 ${
                    isSpeaking ? 'w-4 h-3 bg-red-600 rounded-full animate-pulse' : 'w-3 h-1 bg-red-500 rounded'
                  }`}></div>
                  
                  {/* Chef Coat */}
                  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-40 h-24 bg-white rounded-t-lg shadow-md">
                    <div className="flex flex-col items-center pt-2 gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Speaking Animation */}
              {isSpeaking && (
                <div className="absolute inset-0 border-4 border-blue-400 rounded-full animate-pulse"></div>
              )}
              
              {/* Listening Animation */}
              {isListening && (
                <div className="absolute inset-0 border-4 border-green-400 rounded-full animate-ping"></div>
              )}
            </div>
            
            {/* Kitchen Background Elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-16 h-12 bg-blue-500 rounded shadow-lg"></div>
              <div className="absolute top-10 right-10 w-16 h-12 bg-green-500 rounded shadow-lg"></div>
              <div className="absolute bottom-20 left-20 w-12 h-8 bg-orange-500 rounded shadow-lg"></div>
              <div className="absolute bottom-20 right-20 w-12 h-8 bg-purple-500 rounded shadow-lg"></div>
            </div>
          </div>
          
          {/* Live Captions */}
          {currentTranscript && (
            <div className="absolute bottom-20 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-3 border border-green-500/30">
              <p className="text-green-400 text-sm">You: "{currentTranscript}"</p>
            </div>
          )}
          
          {currentMessage && (
            <div className="absolute bottom-32 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30">
              <p className="text-white font-medium">Chef Marco: {currentMessage}</p>
              {isSpeaking && (
                <div className="flex items-center gap-1 mt-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-150"></div>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Simple Controls */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {!isConnected ? (
            <Button
              onClick={startCall}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg"
            >
              <Phone className="w-6 h-6 mr-2" />
              Call Chef Marco
            </Button>
          ) : (
            <>
              <Button
                onClick={isListening ? () => recognitionRef.current?.stop() : startListening}
                className={`p-4 rounded-full transition-all shadow-lg ${
                  isListening 
                    ? 'bg-red-500 hover:bg-red-600 scale-110' 
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </Button>
              
              <Button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-4 rounded-full shadow-lg ${
                  audioEnabled 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'bg-gray-600 hover:bg-gray-700'
                } text-white`}
              >
                {audioEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
              </Button>
              
              <Button
                onClick={endCall}
                className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg"
              >
                <PhoneOff className="w-6 h-6" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};