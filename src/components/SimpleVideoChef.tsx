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
import { useConversation } from "@11labs/react";
import chefPortrait from "@/assets/chef-marco.png";

const API_KEY = process.env.REACT_APP_ELEVEN_LABS_API_KEY || "";

export const SimpleVideoChef: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();
  
  // ElevenLabs conversation
  const conversation = useConversation({
    onConnect: () => {
      setIsConnected(true);
      setCurrentMessage("Great—your camera is on locally. I'm Chef Marco and I'll guide you step by step. What ingredients do you have ready?");
    },
    onDisconnect: () => setIsConnected(false),
    onMessage: (msg: any) => {
      const text = (msg && (msg.text || msg.message)) as string | undefined;
      if (text) setCurrentMessage(text);
    }
  });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240 }, 
        audio: true 
      });
      setCameraStream(stream);
      setShowCamera(true);
      return stream;
    } catch (e) {
      console.warn('Camera access failed', e);
      setCurrentMessage("I couldn't access your camera. Please allow camera/mic permissions, or I'll still guide you without video. What ingredients do you have?");
      return null;
    }
  };

  const startCall = async () => {
    const stream = await startCamera();
    if (stream) {
      try {
        await (conversation as any).startSession({ 
          agentId: "agent_3601k46bseqxeedaj441fqhqcrhv" 
        });
      } catch (err) {
        console.error('Connection failed:', err);
        setCurrentMessage("Perfect! I'm Chef Marco, your personal cooking instructor. Let's create something delicious together. What ingredients are you working with today?");
        setIsConnected(true);
      }
    }
  };

  const endCall = async () => {
    setIsConnected(false);
    setShowCamera(false);
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    try { await (conversation as any).endSession?.(); } catch {}
  };

  // DISABLED AUTO-SPEECH: No more robotic voice
  // Speak Chef Marco's responses using browser TTS as a fallback
  // useEffect(() => {
  //   if (!currentMessage) return;
  //   if ('speechSynthesis' in window) {
  //     window.speechSynthesis.cancel();
  //     const u = new SpeechSynthesisUtterance(currentMessage);
  //     u.rate = 0.95;
  //     u.pitch = 1.02;
  //     u.volume = 0.9;
  //     window.speechSynthesis.speak(u);
  //   }
  // }, [currentMessage]);

  const testVoice = () => {
    try {
      // DISABLED AUTO-SPEECH: No more robotic voice
      // if ('speechSynthesis' in window) {
      //   window.speechSynthesis.cancel();
      //   const u = new SpeechSynthesisUtterance("Hi, I'm Chef Marco. If you can hear me, voice is working.");
      //   u.rate = 0.95;
      //   u.pitch = 1.02;
      //   u.volume = 1;
      //   window.speechSynthesis.speak(u);
      // } else {
      //   toast({ title: "Voice not available", description: "Your browser doesn't support speech output.", variant: "destructive" });
      // }
      console.log('SimpleVideoChef testVoice disabled - no speech output');
    } catch (e) {
      toast({ title: "Playback blocked", description: "Click anywhere and try Test Voice again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <style>{`
        @keyframes gentle-bob {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-2px) rotate(0.5deg); }
          50% { transform: translateY(-1px) rotate(0deg); }
          75% { transform: translateY(-3px) rotate(-0.5deg); }
        }
        @keyframes breathing {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes chef-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
        }
      `}</style>
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Chef Marco */}
        <Card className="bg-black border border-gray-800">
          <div className="p-6 text-center">
            <div 
              className={`relative w-48 h-48 mx-auto mb-4 rounded-2xl overflow-hidden transition-all duration-500 ${
                isConnected ? 'shadow-lg shadow-blue-500/50' : 'shadow-lg shadow-gray-500/30'
              }`}
              style={{
                animation: isConnected ? 'chef-glow 2s ease-in-out infinite' : ''
              }}
            >
              <img
                src="/lovable-uploads/e0cbdf41-4b73-4670-9266-ec0136411c15.png"
                alt="Chef Marco"
                className={`w-full h-full object-cover transition-all duration-1000 ${
                  isSpeaking ? 'scale-105 animate-pulse' : 'scale-100'
                } hover:scale-110 cursor-pointer`}
                style={{
                  animation: isConnected ? 
                    'gentle-bob 3s ease-in-out infinite, breathing 4s ease-in-out infinite' : 
                    'breathing 4s ease-in-out infinite'
                }}
              />
              {isConnected && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                  LIVE
                </div>
              )}
              {isSpeaking && (
                <div className="absolute bottom-2 left-2 right-2 bg-black/50 rounded p-1">
                  <div className="flex justify-center gap-1">
                    <div className="w-2 h-4 bg-blue-400 rounded animate-bounce"></div>
                    <div className="w-2 h-3 bg-blue-400 rounded animate-bounce delay-75"></div>
                    <div className="w-2 h-5 bg-blue-400 rounded animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Chef Marco</h3>
            {currentMessage && (
              <p className="text-gray-300 text-sm mb-4">"{currentMessage}"</p>
            )}
          </div>
        </Card>

        {/* Your Kitchen */}
        <Card className="bg-black border border-gray-800">
          <div className="p-6">
            <h3 className="text-white text-xl font-bold mb-4 text-center">Your Kitchen</h3>
            {showCamera && cameraStream ? (
              <video 
                ref={(video) => {
                  if (video && cameraStream) video.srcObject = cameraStream;
                }}
                autoPlay 
                muted
                className="w-full h-64 object-cover rounded-2xl bg-gray-800"
              />
            ) : (
              <div className="w-full h-64 bg-gray-800 rounded-2xl flex items-center justify-center">
                <p className="text-gray-400">Camera will show here</p>
              </div>
            )}
          </div>
        </Card>

        {/* Simple Controls */}
        <div className="lg:col-span-2 flex justify-center gap-4 flex-wrap">
          {!isConnected ? (
            <Button
              onClick={startCall}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-full text-lg"
            >
              <Phone className="w-6 h-6 mr-2" />
              Start Cooking with Marco
            </Button>
          ) : (
            <Button
              onClick={endCall}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-full text-lg"
            >
              <PhoneOff className="w-6 h-6 mr-2" />
              End Session
            </Button>
          )}

          <Button onClick={testVoice} variant="outline">
            Test Voice
          </Button>
        </div>
      </div>
    </div>
  );
};