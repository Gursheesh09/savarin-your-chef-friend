import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, MicOff, ChefHat, Clock, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CookingSession } from "@/components/CookingSession";
import { ConversationalChef } from "@/components/ConversationalChef";
import { useNavigate } from "react-router-dom";
import { SimpleVideoChef } from "@/components/SimpleVideoChef";

// Extend Window interface for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionEvent extends Event {
  results: any;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface Recipe {
  name: string;
  ingredients: string[];
  steps: string[];
  cookTime: string;
  difficulty: string;
}

export const Demo = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [currentMood, setCurrentMood] = useState("");
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice recognition error",
          description: "Please try again or check your microphone settings.",
          variant: "destructive",
        });
      };
      
      setRecognition(recognitionInstance);
    }
  }, []);

  const recipes: Record<string, Recipe> = {
    comfort: {
      name: "Creamy Garlic Pasta",
      ingredients: ["400g pasta", "4 cloves garlic", "200ml cream", "50g parmesan", "2 tbsp olive oil", "salt & pepper"],
      steps: [
        "Boil salted water for pasta",
        "Slice garlic thinly - don't rush this",
        "Heat olive oil in large pan over medium heat", 
        "Add garlic, cook until fragrant (30 seconds)",
        "Add cream, simmer gently for 2 minutes",
        "Add cooked pasta with pasta water",
        "Toss with parmesan and seasoning"
      ],
      cookTime: "15 mins",
      difficulty: "Easy"
    },
    light: {
      name: "Lemon Herb Salmon",
      ingredients: ["2 salmon fillets", "1 lemon", "fresh dill", "2 tbsp olive oil", "salt & pepper"],
      steps: [
        "Preheat oven to 400°F (200°C)",
        "Pat salmon dry, season both sides",
        "Heat olive oil in oven-safe pan",
        "Sear salmon skin-side down for 2 minutes",
        "Flip, add lemon slices and dill",
        "Transfer to oven, bake 8-10 minutes",
        "Rest 5 minutes before serving"
      ],
      cookTime: "20 mins",
      difficulty: "Easy"
    },
    quick: {
      name: "5-Minute Quesadilla",
      ingredients: ["2 tortillas", "1 cup shredded cheese", "1/4 cup beans", "2 tbsp salsa", "1 tbsp oil"],
      steps: [
        "Heat oil in pan over medium heat",
        "Place one tortilla in pan",
        "Sprinkle half the cheese",
        "Add beans and salsa",
        "Top with second tortilla",
        "Cook 2-3 minutes each side until golden",
        "Cut and serve hot"
      ],
      cookTime: "5 mins",
      difficulty: "Easy"
    }
  };

  const handleVoiceCommand = (command: string) => {
    if (command.includes('comfort') || command.includes('cozy')) {
      setCurrentMood('comfort');
      setCurrentRecipe(recipes.comfort);
    } else if (command.includes('light') || command.includes('healthy')) {
      setCurrentMood('light');
      setCurrentRecipe(recipes.light);
    } else if (command.includes('quick') || command.includes('fast')) {
      setCurrentMood('quick');
      setCurrentRecipe(recipes.quick);
    } else if (command.includes('next') || command.includes('step')) {
      if (currentRecipe && currentStep < currentRecipe.steps.length - 1) {
        setCurrentStep(currentStep + 1);
    toast({
          title: "Next step!",
          description: `Step ${currentStep + 2}: ${currentRecipe.steps[currentStep + 1]}`,
        });
      }
    } else if (command.includes('repeat') || command.includes('again')) {
    toast({
        title: "Repeating step",
        description: currentRecipe ? currentRecipe.steps[currentStep] : "No recipe loaded",
      });
    }
  };

  const toggleVoiceMode = () => {
    setIsVoiceMode(!isVoiceMode);
    if (!isVoiceMode) {
      toast({
        title: "Voice mode enabled",
        description: "You can now speak commands like 'next step' or 'repeat'",
      });
    }
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Speak your cooking mood or command",
      });
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleMoodSelection = (mood: string) => {
    setCurrentMood(mood);
    setCurrentRecipe(recipes[mood as keyof typeof recipes]);
    setCurrentStep(0);
    toast({
      title: "Recipe selected!",
      description: `Let's make ${recipes[mood as keyof typeof recipes].name}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">AI Chef Demo</h1>
            <p className="text-gray-600">Experience how AI can help you cook better</p>
          </div>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-900 hover:bg-white/50 backdrop-blur-sm rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Mood Selection */}
        {!currentRecipe && (
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What's your cooking mood today?</h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card 
                className="bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-2xl hover:bg-white/80 transition-all duration-500 transform hover:scale-105 cursor-pointer"
                onClick={() => handleMoodSelection('comfort')}
              >
                <CardContent className="p-6 text-center">
                  <ChefHat className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Comfort Food</h3>
                  <p className="text-gray-600">Warm, hearty dishes for cozy days</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-2xl hover:bg-white/80 transition-all duration-500 transform hover:scale-105 cursor-pointer"
                onClick={() => handleMoodSelection('light')}
              >
                <CardContent className="p-6 text-center">
                  <Clock className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Light & Fresh</h3>
                  <p className="text-gray-600">Healthy, vibrant meals</p>
                </CardContent>
              </Card>

              <Card 
                className="bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-2xl hover:bg-white/80 transition-all duration-500 transform hover:scale-105 cursor-pointer"
                onClick={() => handleMoodSelection('quick')}
              >
                <CardContent className="p-6 text-center">
                  <Mic className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick & Easy</h3>
                  <p className="text-gray-600">Fast meals for busy days</p>
                </CardContent>
              </Card>
        </div>
        </div>
        )}

        {/* Voice Controls */}
        <div className="mb-8">
          <Card className="bg-white/60 backdrop-blur-xl border border-gray-200/50 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice Commands</h3>
                  <p className="text-gray-600">Try saying: "comfort food", "next step", or "repeat"</p>
        </div>
                <div className="flex gap-2">
                  <Button
                    onClick={toggleVoiceMode}
                    variant={isVoiceMode ? "default" : "outline"}
                    className={isVoiceMode ? "bg-gray-900 hover:bg-gray-800" : "border-gray-300 bg-white/50 backdrop-blur-sm"}
                  >
                    {isVoiceMode ? "Voice On" : "Voice Off"}
                  </Button>
                  {isVoiceMode && (
                    <Button
                      onClick={isListening ? stopListening : startListening}
                      className={isListening ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-900 hover:bg-gray-800"}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      {isListening ? "Stop" : "Listen"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recipe Display */}
        {currentRecipe && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recipe Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{currentRecipe.name}</h2>
                  <Badge className="bg-orange-100 text-orange-700">{currentRecipe.difficulty}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                        {currentRecipe.cookTime}
                    </div>
                  <div className="flex items-center gap-1">
                    <ChefHat className="w-4 h-4" />
                    {currentRecipe.steps.length} steps
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Ingredients */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Ingredients</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {currentRecipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="text-sm text-gray-600">• {ingredient}</div>
                      ))}
                    </div>
                  </div>

            {/* Current Step */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Step {currentStep + 1} of {currentRecipe.steps.length}
                    </h3>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <p className="text-gray-800">{currentRecipe.steps[currentStep]}</p>
                    </div>
                  </div>

                  {/* Step Navigation */}
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      disabled={currentStep === 0}
                      variant="outline"
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(Math.min(currentRecipe.steps.length - 1, currentStep + 1))}
                      disabled={currentStep === currentRecipe.steps.length - 1}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Chef Interface */}
            <div className="space-y-6">
              <ConversationalChef />
              <SimpleVideoChef />
            </div>
          </div>
        )}

            {/* Reset Button */}
        {currentRecipe && (
          <div className="text-center mt-8">
              <Button 
                onClick={() => {
                  setCurrentRecipe(null);
                setCurrentStep(0);
                  setCurrentMood("");
                }}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
              Start Over
              </Button>
          </div>
        )}
      </div>
    </div>
  );
};