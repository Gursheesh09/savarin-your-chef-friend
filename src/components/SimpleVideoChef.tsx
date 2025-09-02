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
import chefPortrait from "@/assets/chef-portrait.jpg";

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

  // Enhanced text-to-speech with natural voice
  const speakMessage = async (message: string) => {
    if (!audioEnabled) return;
    
    setIsSpeaking(true);
    
    try {
      // Try ElevenLabs API directly
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/TX3LPaxmHKxFdv7VOQHJ', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': 'sk_d34fe68b0a6d90fd29c92812830ed71df2ebac74d0877955'
        },
        body: JSON.stringify({
          text: message,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.85,
            style: 0.1,
            use_speaker_boost: true
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);
        
        audioElement.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          if (isConnected) {
            setTimeout(() => startListening(), 500);
          }
        };
        
        await audioElement.play();
        return;
      }
    } catch (error) {
      console.log('ElevenLabs not available, using browser TTS');
    }
    
    // Fallback to enhanced browser speech synthesis
    if ('speechSynthesis' in window) {
      // Get available voices
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') ||
        voice.lang === 'en-US'
      ) || voices[0];
      
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.voice = preferredVoice;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
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
          
          {/* Live Video Feed */}
          <div className="relative w-full h-[500px] bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center overflow-hidden">
            
            {/* Video Call Background with Subtle Animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900/20 animate-pulse"></div>
            
            {/* Live Chef Video */}
            <div className="relative z-10">
              <div className={`relative transition-all duration-300 ${
                isSpeaking ? 'scale-105' : isListening ? 'scale-102' : 'scale-100'
              }`}>
                
                {/* Main Chef Image with Live Effects */}
                <div className="relative w-80 h-80 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl">
                  
                  {/* Live Video Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-gray-100 animate-pulse"></div>
                  
                  {/* Chef Portrait with Animations */}
                  <img 
                    src={chefPortrait} 
                    alt="Chef Marco - Live"
                    className={`relative w-full h-full object-cover transition-all duration-200 ${
                      isSpeaking ? 'scale-105 brightness-110' : 
                      isListening ? 'scale-102 brightness-105' : 
                      'scale-100 brightness-100'
                    }`}
                    style={{
                      transform: `translateY(${isSpeaking ? '-2px' : isListening ? '-1px' : '0px'})`,
                      filter: `hue-rotate(${isSpeaking ? '10deg' : '0deg'}) saturate(${isSpeaking ? '1.1' : '1'})`
                    }}
                  />
                  
                  {/* Breathing Animation Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 animate-pulse opacity-50"></div>
                  
                  {/* Live Video Scan Lines */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse opacity-20"></div>
                  
                  {/* Dynamic Facial Expressions */}
                  {isSpeaking && (
                    <div className="absolute inset-0 bg-gradient-radial from-blue-400/20 via-transparent to-transparent animate-pulse"></div>
                  )}
                  
                  {isListening && (
                    <div className="absolute inset-0 bg-gradient-radial from-green-400/20 via-transparent to-transparent animate-ping"></div>
                  )}
                  
                  {/* Video Call Connection Effects */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse delay-75"></div>
                  </div>
                  
                  {/* Live Status Badge */}
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold animate-pulse">
                    LIVE
                  </div>
                  
                  {/* Speaking/Listening Indicators */}
                  {isSpeaking && (
                    <>
                      <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                        <div className="flex items-center justify-center gap-1">
                          <div className="w-2 h-4 bg-blue-400 rounded animate-bounce"></div>
                          <div className="w-2 h-3 bg-blue-400 rounded animate-bounce delay-75"></div>
                          <div className="w-2 h-5 bg-blue-400 rounded animate-bounce delay-150"></div>
                          <div className="w-2 h-2 bg-blue-400 rounded animate-bounce delay-200"></div>
                          <div className="w-2 h-4 bg-blue-400 rounded animate-bounce delay-300"></div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {isListening && (
                    <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                        <span className="text-white text-xs font-medium">Listening...</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Video Call Frame Effects */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-2xl blur-sm animate-pulse"></div>
                
                {/* Connection Quality Bars */}
                <div className="absolute -top-8 right-0 flex gap-1">
                  <div className="w-1 h-3 bg-green-400 rounded animate-pulse"></div>
                  <div className="w-1 h-4 bg-green-400 rounded animate-pulse delay-75"></div>
                  <div className="w-1 h-5 bg-green-400 rounded animate-pulse delay-150"></div>
                  <div className="w-1 h-6 bg-green-400 rounded animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
            
            {/* Professional Kitchen Background with Motion */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-24 h-20 bg-gradient-to-br from-gray-600 to-gray-700 rounded shadow-lg animate-pulse"></div>
              <div className="absolute top-16 right-12 w-20 h-16 bg-gradient-to-br from-gray-600 to-gray-700 rounded shadow-lg animate-pulse delay-300"></div>
              <div className="absolute bottom-20 left-16 w-18 h-14 bg-gradient-to-br from-gray-600 to-gray-700 rounded shadow-lg animate-pulse delay-500"></div>
              <div className="absolute bottom-24 right-20 w-16 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded shadow-lg animate-pulse delay-700"></div>
            </div>
            
            {/* Ambient Video Call Lighting */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-blue-900/10 animate-pulse opacity-60"></div>
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