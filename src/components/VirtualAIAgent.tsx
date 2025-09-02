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
            {/* Realistic Chef Avatar */}
            <div 
              className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-primary/30 bg-gradient-to-br from-slate-800 to-slate-900"
              style={{ transform: `scale(${breathingScale})` }}
            >
              {/* Chef Image Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-slate-800/90 to-slate-900/95">
                {/* Chef Hat */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-white rounded-t-full border border-gray-200"></div>
                
                {/* Chef Face */}
                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full border border-amber-300">
                  {/* Eyes */}
                  <div className="absolute top-2 left-1 w-1 h-1 bg-slate-700 rounded-full"></div>
                  <div className="absolute top-2 right-1 w-1 h-1 bg-slate-700 rounded-full"></div>
                  {/* Glasses */}
                  <div className="absolute top-1.5 left-0.5 w-5 h-3 border border-slate-600 rounded-lg opacity-60"></div>
                  {/* Mouth */}
                  <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 bg-slate-600 rounded-full transition-all duration-150 ${isSpeaking ? 'animate-pulse h-1' : ''}`}></div>
                </div>
                
                {/* Chef Coat */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-white rounded-t-lg border-t border-l border-r border-gray-200">
                  {/* Buttons */}
                  <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                  <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 bg-gray-400 rounded-full"></div>
                </div>
                
                {/* Kitchen Tech Background */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1 left-1 w-3 h-2 bg-cyan-400 rounded border border-cyan-300 animate-pulse"></div>
                  <div className="absolute top-4 right-1 w-2 h-2 bg-green-400 rounded border border-green-300"></div>
                  <div className="absolute bottom-2 left-0 w-4 h-1 bg-blue-400 rounded animate-pulse delay-300"></div>
                  <div className="absolute bottom-1 right-0 w-2 h-1 bg-orange-400 rounded animate-pulse delay-700"></div>
                </div>
              </div>
              
              {/* Speaking Indicator */}
              {isSpeaking && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce delay-200"></div>
                </div>
              )}
              
              {/* Listening Indicator */}
              {isListening && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-80">
                  <Mic className="w-2 h-2 text-white m-0.5" />
                </div>
              )}
              
              {/* Thinking particles */}
              {isThinking && (
                <>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-bounce opacity-80"></div>
                  <div className="absolute -top-2 right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200 opacity-60"></div>
                  <div className="absolute -top-1 right-4 w-1 h-1 bg-cyan-400 rounded-full animate-bounce delay-400 opacity-70"></div>
                </>
              )}
            </div>
            
            <div className="space-y-1">
              <h3 className="font-bold text-xl text-foreground">{agentName}</h3>
              <p className="text-sm text-muted-foreground font-medium">Professional Culinary AI</p>
              <p className="text-xs text-muted-foreground">Real chef, real expertise, AI-powered</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Live & Ready</span>
              </div>
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