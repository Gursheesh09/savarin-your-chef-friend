import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, Volume2, Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CookingStep {
  id: number;
  instruction: string;
  duration?: string;
  tips: string[];
}

const sampleRecipe: CookingStep[] = [
  {
    id: 1,
    instruction: "Heat 2 tablespoons of olive oil in a large pan over medium heat",
    duration: "2 minutes",
    tips: ["Watch for shimmer in the oil", "Don't let it smoke"]
  },
  {
    id: 2,
    instruction: "Add diced onions and cook until translucent",
    duration: "3-4 minutes",
    tips: ["Stir occasionally", "Season with a pinch of salt"]
  },
  {
    id: 3,
    instruction: "Add garlic and cook for another 30 seconds until fragrant",
    duration: "30 seconds",
    tips: ["Don't burn the garlic", "Stir constantly"]
  },
  {
    id: 4,
    instruction: "Add crushed tomatoes and simmer",
    duration: "10 minutes",
    tips: ["Season with salt and pepper", "Add basil if desired"]
  }
];

export const VoiceCookingMode = () => {
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>("");
  const { toast } = useToast();

  // Voice commands simulation
  const voiceCommands = [
    "next step", "previous step", "repeat", "pause", "resume", 
    "how long", "any tips", "what's next", "start over"
  ];

  const handleVoiceToggle = () => {
    setIsVoiceModeActive(!isVoiceModeActive);
    if (!isVoiceModeActive) {
      toast({
        title: "Voice Mode Activated! 🎤",
        description: "Say commands like 'next step', 'repeat', or 'any tips'",
      });
      speakInstruction(sampleRecipe[currentStep].instruction);
    } else {
      setIsListening(false);
    }
  };

  const speakInstruction = (text: string) => {
    // DISABLED AUTO-SPEECH: No more robotic voice
    // if ('speechSynthesis' in window) {
    //   const utterance = new SpeechSynthesisUtterance(text);
    //   utterance.rate = 0.9;
    //   utterance.pitch = 1;
    //   utterance.volume = 0.8;
    //   speechSynthesis.speak(utterance);
    // }
    console.log('VoiceCookingMode speech disabled:', text);
  };

  const simulateVoiceCommand = () => {
    if (!isVoiceModeActive) return;
    
    setIsListening(true);
    
    // Simulate voice recognition delay
    setTimeout(() => {
      const randomCommand = voiceCommands[Math.floor(Math.random() * voiceCommands.length)];
      setLastCommand(randomCommand);
      handleVoiceCommand(randomCommand);
      setIsListening(false);
    }, 2000);
  };

  const handleVoiceCommand = (command: string) => {
    switch (command.toLowerCase()) {
      case "next step":
        if (currentStep < sampleRecipe.length - 1) {
          const nextStep = currentStep + 1;
          setCurrentStep(nextStep);
          speakInstruction(sampleRecipe[nextStep].instruction);
        } else {
          speakInstruction("You've completed all steps! Great job cooking!");
        }
        break;
      case "previous step":
        if (currentStep > 0) {
          const prevStep = currentStep - 1;
          setCurrentStep(prevStep);
          speakInstruction(sampleRecipe[prevStep].instruction);
        }
        break;
      case "repeat":
        speakInstruction(sampleRecipe[currentStep].instruction);
        break;
      case "any tips":
        const tips = sampleRecipe[currentStep].tips.join(". ");
        speakInstruction(`Here are some tips: ${tips}`);
        break;
      case "how long":
        const duration = sampleRecipe[currentStep].duration;
        if (duration) {
          speakInstruction(`This step should take about ${duration}`);
        } else {
          speakInstruction("No specific timing for this step");
        }
        break;
      case "what's next":
        if (currentStep < sampleRecipe.length - 1) {
          speakInstruction(`Next step: ${sampleRecipe[currentStep + 1].instruction}`);
        } else {
          speakInstruction("This is the final step!");
        }
        break;
      default:
        speakInstruction("I didn't understand that command. Try saying 'next step' or 'repeat'");
    }
  };

  const nextStep = () => {
    if (currentStep < sampleRecipe.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Volume2 className="w-6 h-6 text-primary" />
          Hands-Free Cooking Mode
        </CardTitle>
        <p className="text-muted-foreground">
          Voice-guided cooking with step-by-step instructions
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleVoiceToggle}
            variant={isVoiceModeActive ? "default" : "outline"}
            size="lg"
            className="px-8"
          >
            <Mic className="w-5 h-5 mr-2" />
            {isVoiceModeActive ? "Voice Mode ON" : "Activate Voice Mode"}
          </Button>
          
          {isVoiceModeActive && (
            <Button
              onClick={simulateVoiceCommand}
              variant="outline"
              disabled={isListening}
              className="px-6"
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 mr-2 animate-pulse" />
                  Listening...
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  Test Voice Command
                </>
              )}
            </Button>
          )}
        </div>

        {isVoiceModeActive && (
          <div className="space-y-6">
            <div className="text-center">
              <Badge variant="secondary" className="mb-2">
                Step {currentStep + 1} of {sampleRecipe.length}
              </Badge>
              {lastCommand && (
                <p className="text-sm text-muted-foreground">
                  Last command: "{lastCommand}"
                </p>
              )}
            </div>

            <Card className="p-6 bg-gradient-subtle">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Current Step:</h3>
                <p className="text-lg leading-relaxed">
                  {sampleRecipe[currentStep].instruction}
                </p>
                
                {sampleRecipe[currentStep].duration && (
                  <Badge variant="outline">
                    ⏱️ {sampleRecipe[currentStep].duration}
                  </Badge>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium text-muted-foreground">Pro Tips:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {sampleRecipe[currentStep].tips.map((tip, index) => (
                      <li key={index} className="text-muted-foreground">{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            <div className="flex justify-center gap-2">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                variant="outline"
                size="sm"
              >
                <SkipBack className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                onClick={() => speakInstruction(sampleRecipe[currentStep].instruction)}
                variant="outline"
                size="sm"
              >
                <Volume2 className="w-4 h-4" />
                Repeat
              </Button>
              
              <Button
                onClick={nextStep}
                disabled={currentStep === sampleRecipe.length - 1}
                variant="outline"
                size="sm"
              >
                Next
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-medium mb-2">Available Voice Commands:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {voiceCommands.map((command, index) => (
                  <Badge key={index} variant="secondary" className="justify-center">
                    "{command}"
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};