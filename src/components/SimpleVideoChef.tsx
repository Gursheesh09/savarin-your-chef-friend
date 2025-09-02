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
import chefPortrait from "@/assets/chef-portrait.jpg";

const API_KEY = "sk-d34fe68b0a6d90fd29c92812830ed71df2ebac74d0877955";

export const SimpleVideoChef: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [elevenLabsKey, setElevenLabsKey] = useState("sk_15d2755552e72979fe4e50ffdbdeb76e02a472ef8ffab983");
  const [openAIKey, setOpenAIKey] = useState("");
  const [agentId, setAgentId] = useState("agent_3601k46bseqxeedaj441fqhqcrhv");
  const [userInput, setUserInput] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // ElevenLabs Live Conversation (optional)
  const conversation = useConversation({
    onConnect: () => setIsConnected(true),
    onDisconnect: () => setIsConnected(false),
    onMessage: (msg: any) => {
      const text = (msg && (msg.text || msg.message)) as string | undefined;
      if (text) setCurrentMessage(text);
    },
    onError: () => {
      toast({ title: 'Live agent error', description: 'Check Agent ID or make it public.', variant: 'destructive' });
    }
  });

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Load saved API keys
  useEffect(() => {
    try {
      const el = localStorage.getItem('elevenLabsKey');
      if (el) setElevenLabsKey(el);
      const ok = localStorage.getItem('openAIKey');
      if (ok) setOpenAIKey(ok);
      const ag = localStorage.getItem('elevenAgentId');
      if (ag) {
        const extracted = ag.match(/agent_[a-z0-9]+/i)?.[0] || '';
        if (extracted) setAgentId(extracted);
      }
      if (!ok) setShowKeyInput(true);
    } catch {}
  }, []);

  // Unlock browser audio on first interaction (fixes autoplay issues)
  const unlockAudio = async () => {
    try {
      const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return false;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') await ctx.resume();
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      return true;
    } catch {
      return false;
    }
  };

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
          'Authorization': `Bearer ${(openAIKey || API_KEY).trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-5-2025-08-07',
          messages: [
            {
              role: 'system',
              content: 'You are Chef Marco, a warm and friendly cooking companion. Be conversational, supportive, and encouraging. Keep responses very short (5-10 words max). Ask questions back. Be personal and caring, not encyclopedic. Focus on being a friend who happens to cook, not a textbook.'
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
        let errMsg = 'Request failed';
        try {
          const err = await response.json();
          errMsg = (err && (err.error?.message || err.message)) || errMsg;
        } catch {
          try { errMsg = (await response.text()).slice(0, 200); } catch {}
        }
        toast({ title: 'Conversation error', description: errMsg, variant: 'destructive' });
        const fallback = "I'm having trouble connecting right now. Please try again in a moment.";
        setCurrentMessage(fallback);
        speakMessage(fallback);
        return;
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || "I'm sorry, could you repeat that?";
      
      setCurrentMessage(aiResponse);
      speakMessage(aiResponse);
      
    } catch (error) {
      console.error('Error:', error);
      toast({ title: 'Conversation error', description: 'OpenAI request failed. Add your OpenAI API key via Add Keys.', variant: 'destructive' });
      const fallback = "I didn't catch that. Try again or type your question.";
      setCurrentMessage(fallback);
      speakMessage(fallback);
    }
  };

  // Enhanced text-to-speech with natural voice
  const speakMessage = async (message: string) => {
    if (!audioEnabled) return;
    
    setIsSpeaking(true);
    
    // Try ElevenLabs if key is provided
    if (elevenLabsKey) {
      try {
        const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/TRnaQb7q41oL7sV0w6Bu', {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': elevenLabsKey
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
          
          audioElement.crossOrigin = 'anonymous';
          audioElement.volume = 1.0;
          try {
            await audioElement.play();
          } catch (err) {
            toast({ title: 'Autoplay blocked', description: 'Tap Call or Test audio to enable sound.', variant: 'destructive' });
            setIsSpeaking(false);
          }
          return;
        } else {
          const errText = await response.text();
          toast({ title: 'Voice error', description: `ElevenLabs: ${errText}` , variant: 'destructive'});
        }
      } catch (error) {
        toast({ title: 'Voice error', description: 'Could not reach ElevenLabs.', variant: 'destructive'});
        console.log('ElevenLabs error:', error);
      }
    }
    
    // Enhanced browser speech synthesis fallback
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Clear any existing speech
      
      // Wait for voices to load
      const getVoices = () => {
        return new Promise<SpeechSynthesisVoice[]>((resolve) => {
          let voices = speechSynthesis.getVoices();
          if (voices.length > 0) {
            resolve(voices);
          } else {
            speechSynthesis.onvoiceschanged = () => {
              voices = speechSynthesis.getVoices();
              resolve(voices);
            };
          }
        });
      };
      
      const voices = await getVoices();
      
      // Select the best available voice
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Microsoft David') ||
        voice.name.includes('Google US English') ||
        voice.name.includes('Alex') ||
        (voice.lang.startsWith('en') && voice.name.includes('Male'))
      ) || voices.find(voice => voice.lang.startsWith('en')) || voices[0];
      
      const utterance = new SpeechSynthesisUtterance(message);
      if (preferredVoice) utterance.voice = preferredVoice;
      utterance.rate = 0.85;
      utterance.pitch = 0.9;
      utterance.volume = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (isConnected) {
          setTimeout(() => startListening(), 500);
        }
      };
      
      speechSynthesis.speak(utterance);
      toast({ title: 'Using fallback voice', description: 'Add your ElevenLabs key for a more natural voice.' });
    }
  };

  const startCall = async () => {
    try {
      await unlockAudio();
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      console.warn('Audio permission/unlock failed', e);
    }

    if (agentId.trim()) {
      // Live ElevenLabs agent mode 
      try {
        console.log('Starting agent session with ID:', agentId.trim());
        const result = await (conversation as any).startSession({ agentId: agentId.trim() });
        console.log('Agent session started:', result);
        // Don't set connected here - wait for onConnect callback
      } catch (err) {
        console.error('Agent start failed:', err);
        toast({ title: 'Agent failed', description: 'Check if agent is public or try clearing Agent ID field.', variant: 'destructive' });
      }
    } else {
      // Simple STT -> OpenAI -> TTS mode
      if (!openAIKey?.trim()) {
        toast({ title: 'OpenAI key needed', description: 'Add your OpenAI API key via Add Keys to enable conversation.', variant: 'destructive' });
        setShowKeyInput(true);
        return;
      }
      setIsConnected(true);
      startListening();
    }
  };

  const endCall = async () => {
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
    try { await (conversation as any).endSession?.(); } catch {}
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
                {elevenLabsKey ? (
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Natural voice</Badge>
                ) : (
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Fallback voice</Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Live Video Feed */}
          <div className="relative w-full h-[500px] bg-gray-900 flex items-center justify-center overflow-hidden">
            
            {/* Live Chef Video */}
            <div className="relative z-10">
              <div className={`relative transition-all duration-300 ${
                isSpeaking ? 'scale-105' : isListening ? 'scale-102' : 'scale-100'
              }`}>
                
                {/* Main Chef Image */}
                <div className="relative w-80 h-80 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl">
                  
                  {/* Chef Portrait */}
                  <img 
                    src={chefPortrait} 
                    alt="Chef Marco - Live"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Live Status Badge */}
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    LIVE
                  </div>
                  
                  {/* Speaking/Listening Indicators */}
                  {isSpeaking && (
                    <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-2 h-4 bg-blue-400 rounded animate-bounce"></div>
                        <div className="w-2 h-3 bg-blue-400 rounded animate-bounce delay-75"></div>
                        <div className="w-2 h-5 bg-blue-400 rounded animate-bounce delay-150"></div>
                      </div>
                    </div>
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
              </div>
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

        {/* API Key Input */}
        {showKeyInput && (
          <Card className="mb-4 p-4 bg-gray-900 border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="password"
                placeholder="ElevenLabs API key (for natural voice)"
                value={elevenLabsKey}
                onChange={(e) => setElevenLabsKey(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
              />
              <input
                type="password"
                placeholder="OpenAI API key (for conversation)"
                value={openAIKey}
                onChange={(e) => setOpenAIKey(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
              />
              <input
                type="text"
                placeholder="ElevenLabs Agent ID (for live voice conversation)"
                value={agentId}
                onChange={(e) => {
                  const v = e.target.value;
                  const extracted = v.match(/agent_[a-z0-9]+/i)?.[0] || v.trim();
                  setAgentId(extracted);
                }}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">Keys are stored locally in your browser.</span>
              <Button onClick={() => { try { localStorage.setItem('elevenLabsKey', elevenLabsKey); localStorage.setItem('openAIKey', openAIKey); localStorage.setItem('elevenAgentId', agentId); toast({ title: 'Saved', description: 'API keys saved to this browser.' }); } catch {} setShowKeyInput(false); }} className="bg-green-600">
                Save
              </Button>
            </div>
          </Card>
        )}

        {/* Simple Controls */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {!isConnected ? (
            <div className="flex flex-col items-center gap-3">
              <Button
                onClick={startCall}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-full text-lg shadow-lg"
              >
                <Phone className="w-6 h-6 mr-2" />
                Call Chef Marco
              </Button>
              
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowKeyInput(!showKeyInput)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm"
                >
                  {openAIKey && elevenLabsKey ? '✓ Keys saved' : 'Add Keys'}
                </Button>
                <Button
                  onClick={async () => { await unlockAudio(); await speakMessage("Audio test. You should hear the chef now."); }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                >
                  Test audio
                </Button>
              </div>
            </div>
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

              {/* Manual message input (fallback if mic has issues) */}
              <div className="w-full max-w-xl mx-auto mt-4 flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Type your question to Chef Marco..."
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                />
                <Button
                  onClick={() => { const text = userInput.trim(); if (text) { handleUserMessage(text); setUserInput(""); } }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Send
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};