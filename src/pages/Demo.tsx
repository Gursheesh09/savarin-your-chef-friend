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
        "Sear salmon skin-side up, 3 minutes",
        "Flip, add lemon slices and dill",
        "Transfer to oven for 8-10 minutes",
        "Rest for 2 minutes before serving"
      ],
      cookTime: "18 mins", 
      difficulty: "Medium"
    },
    quick: {
      name: "Stir-Fried Vegetables",
      ingredients: ["mixed vegetables", "2 tbsp soy sauce", "1 tbsp sesame oil", "2 cloves garlic", "1 tsp ginger"],
      steps: [
        "Heat oil in wok over high heat",
        "Add garlic and ginger, stir 30 seconds",
        "Add hard vegetables first (carrots, broccoli)",
        "Stir-fry 2-3 minutes",
        "Add softer vegetables (peppers, snap peas)",
        "Add soy sauce, toss everything together",
        "Serve immediately while crisp"
      ],
      cookTime: "8 mins",
      difficulty: "Easy"
    }
  };

  const handleMoodSubmit = () => {
    const mood = currentMood.toLowerCase();
    let selectedRecipe: Recipe;

    if (mood.includes('comfort') || mood.includes('cozy') || mood.includes('warm')) {
      selectedRecipe = recipes.comfort;
    } else if (mood.includes('light') || mood.includes('healthy') || mood.includes('fresh')) {
      selectedRecipe = recipes.light;
    } else if (mood.includes('quick') || mood.includes('fast') || mood.includes('busy')) {
      selectedRecipe = recipes.quick;
    } else {
      selectedRecipe = recipes.comfort; // default
    }

    setCurrentRecipe(selectedRecipe);
    setCurrentStep(0);
    toast({
      title: "Recipe matched!",
      description: `Based on your mood, I've selected: ${selectedRecipe.name}`,
    });
  };

  const handleVoiceCommand = (transcript: string) => {
    console.log('Voice command received:', transcript);
    
    const responses: Record<string, string> = {
      'next step': "Moving to the next step!",
      'previous step': "Going back to the previous step!",
      'repeat': currentRecipe ? currentRecipe.steps[currentStep] : "Please select a recipe first",
      'help': "You can say: 'next step', 'previous step', 'repeat', 'how long', or ask about techniques",
      'how long': currentRecipe ? `This recipe takes ${currentRecipe.cookTime} total` : "Please select a recipe first",
      'what temperature': "For this step, use medium heat. Adjust as needed based on your stove.",
      'is it ready': "Look for the visual and aromatic cues mentioned in the current step",
      'substitute': "You can substitute most herbs with dried versions using 1/3 the amount"
    };

    // Handle navigation commands
    if (transcript.includes('next') && currentRecipe && currentStep < currentRecipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      speakText("Moving to the next step");
      return;
    }
    
    if (transcript.includes('previous') && currentStep > 0) {
      setCurrentStep(currentStep - 1);
      speakText("Going back to the previous step");
      return;
    }

    // Find matching response
    const matchedKey = Object.keys(responses).find(key => 
      transcript.includes(key.replace(' ', '')) || transcript.includes(key)
    );
    
    const response = matchedKey ? responses[matchedKey] : 
      "I didn't catch that. Try saying 'help' to see what I can do, or ask about cooking techniques!";
    
    speakText(response);
    toast({
      title: "Savarin says:",
      description: response,
    });
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceToggle = () => {
    if (!recognition) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support speech recognition. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
      toast({
        title: "Voice mode activated",
        description: "Listening... Try saying 'help' to see what I can do!",
      });
    }
  };

  const nextStep = () => {
    if (currentRecipe && currentStep < currentRecipe.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

    return (
      <SimpleVideoChef />
    );
};