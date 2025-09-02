import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Cylinder, Plane } from '@react-three/drei';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Video, VideoOff, Phone, PhoneOff, Volume2, VolumeX } from "lucide-react";
import * as THREE from 'three';

interface ChefAvatarProps {
  isListening: boolean;
  isSpeaking: boolean;
  isThinking: boolean;
}

function ChefAvatar({ isListening, isSpeaking, isThinking }: ChefAvatarProps) {
  const headRef = useRef<THREE.Mesh>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const hatRef = useRef<THREE.Mesh>(null);
  const eyeLeftRef = useRef<THREE.Mesh>(null);
  const eyeRightRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // Breathing animation
    const breathScale = 1 + Math.sin(t * 0.8) * 0.02;
    if (bodyRef.current) {
      bodyRef.current.scale.y = breathScale;
    }
    
    // Head slight movement
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
      headRef.current.position.y = 0.8 + Math.sin(t * 0.7) * 0.02;
    }
    
    // Speaking animation
    if (isSpeaking && mouthRef.current) {
      mouthRef.current.scale.x = 1 + Math.sin(t * 8) * 0.3;
      mouthRef.current.scale.y = 1 + Math.sin(t * 8) * 0.2;
    }
    
    // Thinking animation
    if (isThinking && headRef.current) {
      headRef.current.rotation.x = Math.sin(t * 2) * 0.05;
    }
    
    // Eye blinking
    if (eyeLeftRef.current && eyeRightRef.current) {
      const blinkTime = Math.floor(t * 0.5) % 5;
      const scale = blinkTime < 0.2 ? 0.1 : 1;
      eyeLeftRef.current.scale.y = scale;
      eyeRightRef.current.scale.y = scale;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Kitchen Background */}
      <Plane ref={null} args={[8, 6]} position={[0, 0, -3]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#1e293b" />
      </Plane>
      
      {/* Kitchen Countertop */}
      <Box args={[6, 0.2, 2]} position={[0, -1.5, -2]}>
        <meshStandardMaterial color="#6b7280" />
      </Box>
      
      {/* Chef Body */}
      <Box ref={bodyRef} args={[1.2, 1.5, 0.8]} position={[0, -0.3, 0]}>
        <meshStandardMaterial color="#f8f9fa" />
      </Box>
      
      {/* Chef Head */}
      <Sphere ref={headRef} args={[0.5]} position={[0, 0.8, 0]}>
        <meshStandardMaterial color="#fbbf24" />
      </Sphere>
      
      {/* Chef Hat */}
      <Cylinder ref={hatRef} args={[0.45, 0.35, 0.8]} position={[0, 1.5, 0]}>
        <meshStandardMaterial color="#ffffff" />
      </Cylinder>
      
      {/* Eyes */}
      <Sphere ref={eyeLeftRef} args={[0.08]} position={[-0.15, 0.9, 0.4]}>
        <meshStandardMaterial color="#1f2937" />
      </Sphere>
      <Sphere ref={eyeRightRef} args={[0.08]} position={[0.15, 0.9, 0.4]}>
        <meshStandardMaterial color="#1f2937" />
      </Sphere>
      
      {/* Glasses */}
      <group>
        <Cylinder args={[0.12, 0.12, 0.02]} position={[-0.15, 0.9, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#374151" transparent opacity={0.3} />
        </Cylinder>
        <Cylinder args={[0.12, 0.12, 0.02]} position={[0.15, 0.9, 0.45]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#374151" transparent opacity={0.3} />
        </Cylinder>
        <Box args={[0.1, 0.02, 0.02]} position={[0, 0.9, 0.45]}>
          <meshStandardMaterial color="#374151" />
        </Box>
      </group>
      
      {/* Mouth */}
      <Box ref={mouthRef} args={[0.15, 0.05, 0.02]} position={[0, 0.65, 0.4]}>
        <meshStandardMaterial color="#dc2626" />
      </Box>
      
      {/* Mustache */}
      <Box args={[0.25, 0.08, 0.02]} position={[0, 0.75, 0.4]}>
        <meshStandardMaterial color="#1f2937" />
      </Box>
      
      {/* Chef Coat Buttons */}
      <Sphere args={[0.03]} position={[0, 0.1, 0.41]}>
        <meshStandardMaterial color="#6b7280" />
      </Sphere>
      <Sphere args={[0.03]} position={[0, -0.1, 0.41]}>
        <meshStandardMaterial color="#6b7280" />
      </Sphere>
      <Sphere args={[0.03]} position={[0, -0.3, 0.41]}>
        <meshStandardMaterial color="#6b7280" />
      </Sphere>
      
      {/* Kitchen Equipment in Background */}
      <Box args={[0.5, 0.5, 0.1]} position={[-2, 1, -2.5]}>
        <meshStandardMaterial color="#059669" emissive="#022c22" />
      </Box>
      <Box args={[0.3, 0.3, 0.1]} position={[2, 0.5, -2.5]}>
        <meshStandardMaterial color="#dc2626" emissive="#450a0a" />
      </Box>
      
      {/* Cooking utensils */}
      <Cylinder args={[0.02, 0.02, 0.6]} position={[-1.5, -0.5, -1.8]} rotation={[0, 0, Math.PI / 6]}>
        <meshStandardMaterial color="#8b5cf6" />
      </Cylinder>
      
      {/* Status indicators */}
      {isListening && (
        <Sphere args={[0.05]} position={[0.7, 1.2, 0]}>
          <meshStandardMaterial color="#10b981" emissive="#064e3b" />
        </Sphere>
      )}
      
      {isSpeaking && (
        <group position={[-0.8, 0.8, 0]}>
          <Sphere args={[0.03]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#3b82f6" emissive="#1e40af" />
          </Sphere>
          <Sphere args={[0.03]} position={[0.08, 0, 0]}>
            <meshStandardMaterial color="#3b82f6" emissive="#1e40af" />
          </Sphere>
          <Sphere args={[0.03]} position={[0.16, 0, 0]}>
            <meshStandardMaterial color="#3b82f6" emissive="#1e40af" />
          </Sphere>
        </group>
      )}
      
      {isThinking && (
        <group position={[0.6, 1.8, 0]}>
          <Sphere args={[0.04]} position={[0, 0, 0]}>
            <meshStandardMaterial color="#8b5cf6" emissive="#5b21b6" />
          </Sphere>
          <Sphere args={[0.03]} position={[0.08, 0.08, 0]}>
            <meshStandardMaterial color="#8b5cf6" emissive="#5b21b6" />
          </Sphere>
          <Sphere args={[0.02]} position={[0.12, 0.16, 0]}>
            <meshStandardMaterial color="#8b5cf6" emissive="#5b21b6" />
          </Sphere>
        </group>
      )}
      
      {/* Name tag floating text */}
      <Text
        position={[0, -1.2, 1]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
      >
        Chef Marco Savarin
      </Text>
    </group>
  );
}

interface LiveChefVideoProps {
  isListening?: boolean;
  isSpeaking?: boolean;
  isThinking?: boolean;
  currentMessage?: string;
  currentTranscript?: string;
  isConnected?: boolean;
  onToggleMic?: () => void;
  onToggleVideo?: () => void;
  onEndCall?: () => void;
}

export const LiveChefVideo: React.FC<LiveChefVideoProps> = ({
  isListening = false,
  isSpeaking = false,
  isThinking = false,
  currentMessage = "",
  currentTranscript = "",
  isConnected = true,
  onToggleMic,
  onToggleVideo,
  onEndCall
}) => {
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  return (
    <Card className="relative overflow-hidden bg-black border-2 border-slate-700 shadow-2xl">
      {/* Video Call Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
            <div>
              <h3 className="text-white font-semibold">Chef Marco Savarin</h3>
              <p className="text-gray-300 text-sm">Professional Culinary Expert</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isListening && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <Mic className="w-3 h-3 mr-1" />
                Listening
              </Badge>
            )}
            {isSpeaking && (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                <Volume2 className="w-3 h-3 mr-1 animate-pulse" />
                Speaking
              </Badge>
            )}
            {isThinking && (
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                  <span className="ml-1">Thinking</span>
                </div>
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* 3D Chef Video Feed */}
      <div className="w-full h-96 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-5, -5, -5]} intensity={0.3} />
          <pointLight position={[0, 2, 2]} intensity={0.8} color="#fbbf24" />
          
          <ChefAvatar 
            isListening={isListening} 
            isSpeaking={isSpeaking} 
            isThinking={isThinking} 
          />
        </Canvas>
      </div>

      {/* Live Transcript */}
      {currentTranscript && (
        <div className="absolute bottom-20 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-green-500/30">
          <p className="text-green-400 text-sm font-medium">You: "{currentTranscript}"</p>
        </div>
      )}

      {/* Chef Message */}
      {currentMessage && (
        <div className="absolute bottom-32 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30">
          <p className="text-blue-400 text-sm font-medium">Chef Marco: {currentMessage}</p>
        </div>
      )}

      {/* Video Call Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => {
              setAudioEnabled(!audioEnabled);
              onToggleMic?.();
            }}
            className={`p-3 rounded-full transition-colors ${
              audioEnabled 
                ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => {
              setVideoEnabled(!videoEnabled);
              onToggleVideo?.();
            }}
            className={`p-3 rounded-full transition-colors ${
              videoEnabled 
                ? 'bg-slate-700 hover:bg-slate-600 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
          
          <button
            onClick={onEndCall}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Connection Quality Indicator */}
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`w-1 ${bar <= 3 ? 'bg-green-500' : 'bg-gray-600'}`}
              style={{ height: `${bar * 3 + 6}px` }}
            ></div>
          ))}
        </div>
      </div>
    </Card>
  );
};