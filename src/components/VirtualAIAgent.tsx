import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, MessageSquare, Brain, Sparkles } from "lucide-react";

interface VirtualAIAgentProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  currentMessage?: string;
  isThinking?: boolean;
  currentTranscript?: string;
  agentName?: string;
  personality?: 'professional' | 'friendly' | 'enthusiastic';
}

export const VirtualAIAgent = ({ 
  isListening = false,
  isSpeaking = false,
  currentMessage = "",
  isThinking = false,
  currentTranscript = "",
  agentName = "Chef AI",
  personality = 'friendly'
}: VirtualAIAgentProps) => {
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [breathingPhase, setBreathingPhase] = useState(0);

  // Simulate audio waveform during speaking
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setWaveformData(() => 
          Array.from({ length: 12 }, () => Math.random() * 100)
        );
      }, 100);
      
      return () => clearInterval(interval);
    } else {
      setWaveformData(Array.from({ length: 12 }, () => 0));
    }
  }, [isSpeaking]);

  // Breathing animation when idle
  useEffect(() => {
    const breathingInterval = setInterval(() => {
      setBreathingPhase(prev => (prev + 1) % 60);
    }, 100);
    
    return () => clearInterval(breathingInterval);
  }, []);

  const getPersonalityColors = () => {
    switch (personality) {
      case 'professional':
        return {
          gradient: 'from-blue-500 via-purple-500 to-blue-600',
          accent: 'border-blue-300',
          glow: 'shadow-blue-500/20'
        };
      case 'enthusiastic':
        return {
          gradient: 'from-orange-500 via-red-500 to-pink-500',
          accent: 'border-orange-300',
          glow: 'shadow-orange-500/20'
        };
      default:
        return {
          gradient: 'bg-gradient-to-br from-primary via-primary-glow to-accent',
          accent: 'border-primary/30',
          glow: 'shadow-primary/20'
        };
    }
  };

  const colors = getPersonalityColors();
  const breathingScale = 1 + Math.sin(breathingPhase * 0.1) * 0.02;

  return (
    <Card className={`relative p-6 bg-card border-2 ${colors.accent} overflow-hidden ${colors.glow} shadow-2xl transition-all duration-500 ${isSpeaking ? 'scale-105' : 'scale-100'}`}>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className={`w-full h-full ${colors.gradient} ${isSpeaking ? 'animate-pulse' : ''}`}></div>
      </div>
      
      {/* Speaking Indicator Bar */}
      {isSpeaking && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary-glow to-primary overflow-hidden">
          <div className="h-full bg-white animate-pulse"></div>
        </div>
      )}
      
      <div className="relative z-10">
        {/* Avatar Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {/* 3D-style Avatar */}
            <div 
              className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 via-primary/30 to-primary/40 border-3 border-primary/30 backdrop-blur-sm overflow-hidden"
              style={{ transform: `scale(${breathingScale})` }}
            >
              {/* Face representation */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/40 to-accent/60">
                {/* Eyes */}
                <div className="absolute top-4 left-3 w-2 h-2 bg-white rounded-full opacity-90">
                  <div className={`w-1 h-1 bg-primary rounded-full m-0.5 transition-all duration-300 ${isListening ? 'animate-pulse' : ''}`}></div>
                </div>
                <div className="absolute top-4 right-3 w-2 h-2 bg-white rounded-full opacity-90">
                  <div className={`w-1 h-1 bg-primary rounded-full m-0.5 transition-all duration-300 ${isListening ? 'animate-pulse' : ''}`}></div>
                </div>
                
                {/* Mouth/Speaking indicator */}
                <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-1 bg-white/80 rounded-full transition-all duration-150 ${isSpeaking ? 'animate-pulse h-2' : ''}`}></div>
              </div>
              
              {/* Thinking particles */}
              {isThinking && (
                <>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-bounce opacity-80"></div>
                  <div className="absolute -top-2 right-2 w-1.5 h-1.5 bg-accent rounded-full animate-bounce delay-200 opacity-60"></div>
                  <div className="absolute -top-1 right-4 w-1 h-1 bg-primary-glow rounded-full animate-bounce delay-400 opacity-70"></div>
                </>
              )}
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-xl text-foreground">{agentName}</h3>
              <p className="text-sm text-muted-foreground font-medium">AI Culinary Assistant</p>
              <p className="text-xs text-muted-foreground">Always here to help you cook</p>
            </div>
          </div>
          
          {/* Status Indicators */}
          <div className="flex flex-col gap-2">
            {isThinking && (
              <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
                <Brain className="w-3 h-3 mr-1 animate-pulse" />
                Processing...
              </Badge>
            )}
            {isListening && (
              <Badge variant="secondary" className="text-xs bg-emerald-500/20 text-emerald-700 border-emerald-300/50">
                <Mic className="w-3 h-3 mr-1 animate-pulse" />
                Listening
              </Badge>
            )}
            {isSpeaking && (
              <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-700 border-blue-300/50">
                <Volume2 className="w-3 h-3 mr-1" />
                Speaking
              </Badge>
            )}
          </div>
        </div>

        {/* Audio Waveform Display */}
        {isSpeaking && (
          <div className="mb-4 p-3 bg-muted/30 rounded-lg border border-border/30">
            <div className="flex items-end justify-center gap-1 h-8">
              {waveformData.map((height, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-t from-primary to-primary-glow rounded-full w-1 transition-all duration-100"
                  style={{ height: `${Math.max(height * 0.3, 4)}px` }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Live Transcript */}
        {currentTranscript && (
          <div className="bg-emerald-500/10 backdrop-blur-sm rounded-lg p-3 mb-3 border border-emerald-300/20">
            <div className="flex items-start gap-2">
              <Mic className="w-4 h-4 mt-0.5 text-emerald-600" />
              <div>
                <p className="text-xs text-emerald-700 mb-1">You're saying:</p>
                <p className="text-sm text-foreground font-medium italic">"{currentTranscript}"</p>
              </div>
            </div>
          </div>
        )}

        {/* Current Message */}
        {currentMessage && (
          <div className="bg-primary/10 backdrop-blur-sm rounded-lg p-4 mb-4 border border-primary/20">
            <div className="flex items-start gap-3">
              <MessageSquare className={`w-5 h-5 mt-0.5 text-primary ${isSpeaking ? 'animate-pulse' : ''}`} />
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium leading-relaxed">{currentMessage}</p>
                {isSpeaking && (
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-75"></div>
                    <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-150"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Agent Status Footer */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-medium">AI-powered cooking assistance</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${isListening || isSpeaking || isThinking ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="font-medium">
              {isThinking ? 'Thinking' : isListening ? 'Ready to listen' : isSpeaking ? 'Speaking' : 'Idle'}
            </span>
          </div>
        </div>
      </div>

      {/* Ambient Background Effects */}
      <div className={`absolute -bottom-4 -right-4 w-24 h-24 bg-primary/10 rounded-full animate-ping ${isSpeaking ? 'animate-pulse' : ''}`}></div>
      <div className={`absolute -top-4 -left-4 w-20 h-20 bg-accent/10 rounded-full animate-ping delay-1000 ${isListening ? 'animate-bounce' : ''}`}></div>
      
      {/* Personality-based ambient effects */}
      {personality === 'enthusiastic' && (
        <>
          <div className="absolute top-4 right-4 text-orange-400 animate-bounce text-sm">✨</div>
          <div className="absolute bottom-6 left-6 text-pink-400 animate-bounce delay-500 text-sm">⭐</div>
        </>
      )}
    </Card>
  );
};