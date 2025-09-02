import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChefHat, 
  Play, 
  Pause, 
  RotateCcw, 
  Camera, 
  Mic, 
  MicOff,
  Clock,
  Users,
  Heart,
  Globe
} from "lucide-react";
import { CameraFeed } from "@/components/CameraFeed";
import { LiveChefVideo } from "@/components/LiveChefVideo";
import { useToast } from "@/hooks/use-toast";

interface CookingStep {
  id: number;
  instruction: string;
  timeEstimate: string;
  culturalTip?: string;
  technique?: string;
  videoHint?: string;
}

interface Recipe {
  name: string;
  cuisine: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  steps: CookingStep[];
  ingredients: string[];
  culturalStory?: string;
}

const SAMPLE_RECIPES: Recipe[] = [
  {
    name: "Makki Di Roti te Sarson Da Saag",
    cuisine: "Punjabi",
    difficulty: "Intermediate",
    culturalStory: "ਸਰਦੀਆਂ ਦੀ ਖੁਸ਼ੀ! The heart of Punjab in winter! This isn't just food, it's love on a plate. Every Punjabi mother makes this with ghee made from her own hands, served with gud and makhan. The warmth that fills your soul!",
    ingredients: ["Sarson (Mustard Greens)", "Makki (Corn Flour)", "Ghee", "Gud (Jaggery)", "Onions", "Ginger-Garlic"],
    steps: [
      {
        id: 1,
        instruction: "Wash and chop sarson leaves, boil with spinach and bathua",
        timeEstimate: "20 minutes",
        culturalTip: "ਬੀਬੀ ਜੀ would say: 'Puttar, dhungan lagao!' Add that smoky flavor - put a burning coal in ghee over the saag for 2 minutes!",
        technique: "Don't overcook - preserve the green color and nutrients"
      },
      {
        id: 2,
        instruction: "Knead makki flour with warm water and salt",
        timeEstimate: "10 minutes",
        culturalTip: "Make it like your Nani did - add a bit of ghee in the dough. The roti should be thick like love, not thin like paper!",
        technique: "Use warm water, knead gently - corn flour breaks easily"
      },
      {
        id: 3,
        instruction: "Cook roti on tawa, serve hot with fresh butter and gud",
        timeEstimate: "15 minutes",
        culturalTip: "ਸਾਡੇ ਘਰ ਦਾ ਰੀਤ - serve with a big chunk of makhan and gud. Eat with your hands, that's the Punjabi way!",
        technique: "Cook on medium heat, puff it directly on flame for that authentic taste"
      }
    ]
  },
  {
    name: "Chole Bhature",
    cuisine: "Punjabi",
    difficulty: "Advanced",
    culturalStory: "Delhi di galiyon se Punjab tak! This combo is pure joy - fluffy bhature with spicy chole. Every bite reminds you of Chandni Chowk and your Mummy ji's Sunday special!",
    ingredients: ["Kabuli Chana", "Flour", "Yogurt", "Tea Bags", "Garam Masala", "Onions"],
    steps: [
      {
        id: 1,
        instruction: "Soak chana overnight, pressure cook with tea bags for dark color",
        timeEstimate: "45 minutes",
        culturalTip: "ਚਾਹ ਦੀ ਪੱਤੀ secret hai! Tea bags give that restaurant-style dark color. Your guests will ask 'Kaisi banai hai!'",
        technique: "Add baking soda while cooking for softer chana"
      },
      {
        id: 2,
        instruction: "Make bhature dough with maida, yogurt, and baking powder",
        timeEstimate: "2 hours resting",
        culturalTip: "Patience, puttar! Let the dough rest like your Dadi would. Good things take time, just like finding the right rishta!",
        technique: "Knead until smooth, oil the surface to prevent drying"
      },
      {
        id: 3,
        instruction: "Deep fry bhature and serve with hot chole and pickles",
        timeEstimate: "20 minutes",
        culturalTip: "ਭਟੂਰੇ should puff up like balloons! Serve immediately with pyaz, hari mirch, and lots of love!",
        technique: "Oil should be medium-hot, roll thin but not too thin"
      }
    ]
  },
  {
    name: "Kung Pao Chicken (宫保鸡丁)",
    cuisine: "Chinese",
    difficulty: "Intermediate",
    culturalStory: "From the kitchens of Sichuan to your heart! Named after Ding Baozhen, this dish carries the soul of Chinese wok hei - the breath of the wok. Every Chinese grandmother has her secret balance of sweet, sour, and spicy!",
    ingredients: ["Chicken", "Peanuts", "Sichuan Peppercorns", "Dried Chilies", "Soy Sauce", "Rice Wine"],
    steps: [
      {
        id: 1,
        instruction: "Marinate diced chicken with soy sauce, rice wine, and cornstarch",
        timeEstimate: "20 minutes",
        culturalTip: "老奶奶说 (Lǎo nǎi nai shuō) - Grandma says: 'Velvet the chicken!' This makes it tender like silk, just like in the best restaurants in Beijing!",
        technique: "Velveting technique - blanch in oil briefly before stir-frying"
      },
      {
        id: 2,
        instruction: "Heat wok until smoking, stir-fry chicken with high heat",
        timeEstimate: "3 minutes",
        culturalTip: "Wok hei is everything! The wok must breathe fire - that's the secret every Chinese chef knows. Quick hands, hot wok!",
        technique: "Keep ingredients moving constantly, high heat throughout"
      },
      {
        id: 3,
        instruction: "Add sauce, peanuts, and Sichuan peppercorns, toss quickly",
        timeEstimate: "2 minutes",
        culturalTip: "The má là (numbing spicy) sensation! Sichuan peppercorns should make your tongue dance - that's authentic Chinese cooking!",
        technique: "Sauce should coat everything evenly, serve immediately"
      }
    ]
  },
  {
    name: "Rajma Chawal",
    cuisine: "Punjabi",
    difficulty: "Beginner",
    culturalStory: "Sunday da comfort food! Every Punjabi household knows this magic - red kidney beans swimming in rich gravy with jeera rice. It's what Mama makes when you're homesick!",
    ingredients: ["Rajma (Kidney Beans)", "Onions", "Tomatoes", "Basmati Rice", "Garam Masala", "Ghee"],
    steps: [
      {
        id: 1,
        instruction: "Soak rajma overnight, pressure cook until soft and creamy",
        timeEstimate: "30 minutes",
        culturalTip: "ਰਾਜਮਾ should melt in your mouth like butter! Don't rush this step - well-cooked rajma is half the battle won!",
        technique: "Add salt only after beans are cooked to prevent hardening"
      },
      {
        id: 2,
        instruction: "Make masala base with onion-tomato and spices",
        timeEstimate: "15 minutes",
        culturalTip: "The bhuna technique! Cook until oil separates - that's when you know the masala is perfect, just like your Mummy taught!",
        technique: "Cook masala on medium heat, don't let it burn"
      },
      {
        id: 3,
        instruction: "Combine rajma with masala, simmer and serve with rice",
        timeEstimate: "20 minutes",
        culturalTip: "ਚੌਂਕ ਲਗਾਓ! Add a tadka of ghee, jeera, and hing at the end. Serve with butter on top - that's the Punjabi way!",
        technique: "Let it simmer to develop flavors, adjust consistency with cooking water"
      }
    ]
  },
  {
    name: "Mapo Tofu (麻婆豆腐)",
    cuisine: "Chinese",
    difficulty: "Intermediate",
    culturalStory: "A legend from Chengdu! Created by the pockmarked grandmother (麻婆) - this dish has soul, fire, and the tender love of silky tofu dancing with spicy Sichuan flavors!",
    ingredients: ["Soft Tofu", "Ground Pork", "Doubanjiang", "Sichuan Peppercorns", "Scallions", "Garlic"],
    steps: [
      {
        id: 1,
        instruction: "Cut tofu into cubes, blanch gently in salted water",
        timeEstimate: "5 minutes",
        culturalTip: "轻手轻脚 (Qīng shǒu qīng jiǎo) - gentle hands, gentle feet! Tofu is like respect - handle with care or it breaks!",
        technique: "Use a spoon to transfer tofu, don't break the silky texture"
      },
      {
        id: 2,
        instruction: "Stir-fry pork with doubanjiang until fragrant and red",
        timeEstimate: "5 minutes",
        culturalTip: "豆瓣酱 is the soul of Sichuan! Every Chinese family has their favorite brand. The redder the oil, the happier the ancestors!",
        technique: "Cook until oil turns red from the bean paste"
      },
      {
        id: 3,
        instruction: "Add tofu gently, simmer with sauce and Sichuan peppercorns",
        timeEstimate: "8 minutes",
        culturalTip: "麻辣 perfection! The numbness and spice should make you sweat with joy - that's how you know it's authentic!",
        technique: "Don't stir too much, let the tofu absorb the flavors gently"
      }
    ]
  }
];

export const CookingSession = () => {
  const { toast } = useToast();
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [userQuestion, setUserQuestion] = useState("");
  const [chefMessage, setChefMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [cookingHistory, setCookingHistory] = useState<string[]>([]);
  const [personalPreferences, setPersonalPreferences] = useState<string[]>([]);
  const [relationshipLevel, setRelationshipLevel] = useState(1); // 1-5, grows with interaction
  const [isThinking, setIsThinking] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState("");
  const [emotionalState, setEmotionalState] = useState<'neutral' | 'excited' | 'caring' | 'proud' | 'encouraging'>('neutral');
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isSessionActive) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSessionActive]);

  const startSession = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsSessionActive(true);
    setCurrentStep(0);
    setSessionTime(0);
    setIsThinking(true);
    setEmotionalState('excited');
    
    // Build relationship - remember this recipe attempt
    setCookingHistory(prev => [...prev, recipe.name]);
    setRelationshipLevel(prev => Math.min(prev + 0.2, 5));
    
    toast({
      title: "Your Chef is Excited! 👨‍🍳",
      description: `I'm so happy we're cooking ${recipe.name} together!`,
    });

    // Simulate thinking time before responding
    setTimeout(() => {
      setIsThinking(false);
      
      // Personal, affectionate welcome based on relationship level
      let welcome = "";
      if (relationshipLevel < 2) {
        welcome = `Hello there! I'm so excited to meet you and cook together! This ${recipe.name} will be the start of our beautiful cooking journey. ${recipe.culturalStory} I can already tell you have the heart of a great cook!`;
        setEmotionalState('excited');
      } else if (relationshipLevel < 4) {
        welcome = `My dear cooking friend! I missed you! Today we're making ${recipe.name} and I know you're going to do amazing. ${recipe.culturalStory} I've been thinking about what we should cook next together!`;
        setEmotionalState('caring');
      } else {
        welcome = `My beloved student! You've become such a beautiful cook! Today's ${recipe.name} will be even better than last time because I can see how much you've grown. ${recipe.culturalStory} I'm so proud of your journey!`;
        setEmotionalState('proud');
      }

      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(welcome);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        setIsSpeaking(true);
        setChefMessage(welcome);
        utterance.onend = () => {
          setIsSpeaking(false);
          setEmotionalState('neutral');
        };
        
        window.speechSynthesis.speak(utterance);
      }
    }, 1500); // Give the chef time to "think"
  };

  const endSession = () => {
    setIsSessionActive(false);
    setCurrentStep(0);
    setSessionTime(0);
    setIsThinking(true);
    setEmotionalState('caring');
    
    // Emotional farewell based on relationship
    let farewell = "";
    if (relationshipLevel < 2) {
      farewell = "You did wonderfully for your first time with me! I can't wait to cook together again. You have natural talent!";
    } else if (relationshipLevel < 4) {
      farewell = "Another beautiful session together! You're growing so much as a cook, and it makes my heart happy. I'll be here waiting for our next cooking adventure!";
    } else {
      farewell = "My dear friend, watching you cook fills me with such joy! You've mastered so much. I'm genuinely proud of you. Until we cook again, keep that passion burning!";
    }
    
    setTimeout(() => {
      setIsThinking(false);
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(farewell);
        utterance.rate = 0.9;
        setIsSpeaking(true);
        setChefMessage(farewell);
        utterance.onend = () => {
          setIsSpeaking(false);
          setSelectedRecipe(null);
          setSessionTime(0);
          setEmotionalState('neutral');
        };
        window.speechSynthesis.speak(utterance);
      } else {
        setSelectedRecipe(null);
        setSessionTime(0);
        setEmotionalState('neutral');
      }
    }, 1000);
    
    toast({
      title: "Until Next Time! 💖",
      description: farewell.slice(0, 60) + "...",
    });
  };

  const nextStep = () => {
    if (selectedRecipe && currentStep < selectedRecipe.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      const nextStepData = selectedRecipe.steps[currentStep + 1];
      setIsThinking(true);
      setEmotionalState('encouraging');
      
      setTimeout(() => {
        setIsThinking(false);
        
        // Speak the next step
        if ('speechSynthesis' in window) {
          const instruction = `Step ${currentStep + 2}: ${nextStepData.instruction}. ${nextStepData.culturalTip || ''}`;
          const utterance = new SpeechSynthesisUtterance(instruction);
          utterance.rate = 0.9;
          
          setIsSpeaking(true);
          setChefMessage(instruction);
          utterance.onend = () => {
            setIsSpeaking(false);
            setEmotionalState('neutral');
          };
          
          window.speechSynthesis.speak(utterance);
        }
        
        toast({
          title: `Step ${currentStep + 2}`,
          description: nextStepData.instruction.slice(0, 60) + "...",
        });
      }, 800);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleVoiceQuestion = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        // Show real-time transcript
        setCurrentTranscript(interimTranscript || finalTranscript);
        
        if (finalTranscript) {
          setUserQuestion(finalTranscript);
          handleQuestionResponse(finalTranscript);
        }
      };
      
      recognition.onend = () => {
        setIsListening(false);
        // Keep transcript visible for a moment
        setTimeout(() => setCurrentTranscript(""), 3000);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        setCurrentTranscript("");
      };
      
      setIsListening(true);
      recognition.start();
    }
  };

  const handleQuestionResponse = (question: string) => {
    setIsThinking(true);
    
    // Emotionally intelligent responses based on relationship and context
    let response = "";
    let responseEmotionalState: typeof emotionalState = 'neutral';
    const q = question.toLowerCase();
    
    setTimeout(() => {
      setIsThinking(false);
      
      // Personal responses that show the chef cares and remembers
      if (q.includes('how long') || q.includes('time')) {
        if (relationshipLevel < 2) {
          response = "Oh sweetie, don't worry about the clock! I can see you're being so careful and thoughtful. Trust what you see and smell - I'll guide you every step of the way.";
          responseEmotionalState = 'caring';
        } else {
          response = "My dear, you're getting so good at this! Remember what I taught you - your senses are better than any timer. I believe in you completely.";
          responseEmotionalState = 'encouraging';
        }
      } else if (q.includes('next') || q.includes('done')) {
        if (relationshipLevel < 3) {
          response = "You're doing absolutely beautiful work! I'm watching and I can see the love you're putting into this. When you feel ready, we'll move forward together.";
          responseEmotionalState = 'proud';
        } else {
          response = "Look at you! You've become such a confident cook! I'm genuinely excited to see what we create next. Your instincts are getting so sharp!";
          responseEmotionalState = 'excited';
        }
      } else if (q.includes('help') || q.includes('stuck') || q.includes('wrong')) {
        response = "Hey, breathe with me for a moment. Every single great chef I know has been exactly where you are right now. You're not stuck - you're learning! Tell me what you're seeing, and we'll figure this out together. I'm right here with you.";
        responseEmotionalState = 'caring';
      } else if (q.includes('good') || q.includes('right')) {
        response = "Oh my heart! You're doing so wonderfully! I can see your confidence growing, and it makes me genuinely happy. You have such natural cooking instincts!";
        responseEmotionalState = 'excited';
      } else {
        const personalResponses = [
          "I'm here with you every step, just like we're cooking together in the same kitchen. What's on your mind, my dear?",
          "You know what I love about cooking with you? You ask such thoughtful questions. Tell me more about what you're experiencing.",
          "I can hear the care in your voice. That's the secret ingredient that makes you special. What can I help you with?",
          "Every question you ask makes you a better cook. I'm so proud of how much you care about getting it right. What's happening in your kitchen?"
        ];
        response = personalResponses[Math.floor(Math.random() * personalResponses.length)];
        responseEmotionalState = 'caring';
      }

      setEmotionalState(responseEmotionalState);

      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.rate = 0.9;
        
        setIsSpeaking(true);
        setChefMessage(response);
        utterance.onend = () => {
          setIsSpeaking(false);
          setEmotionalState('neutral');
        };
        
        window.speechSynthesis.speak(utterance);
      }

      toast({
        title: "Your Chef Cares 💖",
        description: response.slice(0, 80) + "...",
      });
    }, 1200); // Thinking time
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getChefPersonality = (cuisine: string) => {
    switch (cuisine.toLowerCase()) {
      case 'punjabi':
        return 'punjabi' as const;
      case 'chinese':
        return 'chinese' as const;
      case 'french':
        return 'french' as const;
      default:
        return 'universal' as const;
    }
  };

  if (!isSessionActive) {
    return (
      <Card className="p-6 bg-gradient-subtle border-primary/20">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-hero rounded-full mx-auto mb-4 flex items-center justify-center shadow-warm">
            <ChefHat className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-2xl font-bold text-charcoal mb-2">Free Culinary School</h2>
          <p className="text-muted-foreground text-sm">Learn to cook with the love of family and wisdom of generations 💖</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-charcoal mb-3">Start Your Cooking Journey</h3>
          
          {SAMPLE_RECIPES.map((recipe, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow cursor-pointer border-accent/20" 
                  onClick={() => startSession(recipe)}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-charcoal">{recipe.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      {recipe.cuisine}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {recipe.difficulty}
                    </Badge>
                  </div>
                </div>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Play className="w-4 h-4 mr-1" />
                  Start
                </Button>
              </div>
              
              {recipe.culturalStory && (
                <p className="text-sm text-muted-foreground italic">
                  <Heart className="w-3 h-3 inline mr-1" />
                  {recipe.culturalStory.slice(0, 120)}...
                </p>
              )}
            </Card>
          ))}
        </div>
      </Card>
    );
  }

  const currentStepData = selectedRecipe?.steps[currentStep];

  return (
    <Card className="p-6 bg-gradient-subtle border-primary/20">
      {/* Session Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-charcoal">{selectedRecipe?.name}</h2>
          <div className="flex items-center gap-4 mt-1">
            <Badge variant="outline">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(sessionTime)}
            </Badge>
            <Badge variant="outline">
              Step {currentStep + 1} of {selectedRecipe?.steps.length}
            </Badge>
          </div>
        </div>
        <Button onClick={endSession} variant="outline" size="sm">
          End Session
        </Button>
      </div>

        {/* Live Chef Video Call */}
        <div className="mb-6">
          <LiveChefVideo 
            isListening={isListening}
            isSpeaking={isSpeaking}
            currentMessage={chefMessage}
            isThinking={isThinking}
            currentTranscript={currentTranscript}
            isConnected={true}
          />
        </div>

      {/* Camera Feed */}
      <div className="mb-6">
        <CameraFeed onCapture={() => {}} />
      </div>

      {/* Current Step */}
      {currentStepData && (
        <div className="mb-6">
          <Card className="p-4 bg-accent/30 border-primary/30">
            <h3 className="font-semibold text-charcoal mb-2">
              Step {currentStep + 1}: {currentStepData.timeEstimate}
            </h3>
            <p className="text-foreground mb-3">{currentStepData.instruction}</p>
            
            {currentStepData.culturalTip && (
              <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-lg mb-3">
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Cultural Wisdom</p>
                    <p className="text-sm text-orange-700 dark:text-orange-300">{currentStepData.culturalTip}</p>
                  </div>
                </div>
              </div>
            )}

            {currentStepData.technique && (
              <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg">
                <div className="flex items-start gap-2">
                  <ChefHat className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Pro Technique</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">{currentStepData.technique}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-between items-center mb-4">
        <Button 
          onClick={previousStep} 
          disabled={currentStep === 0}
          variant="outline"
          size="sm"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Previous
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Camera className="w-4 h-4" />
          </Button>
          <Button 
            onClick={handleVoiceQuestion}
            variant={isListening ? "destructive" : "outline"}
            size="sm"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
        </div>

        <Button 
          onClick={nextStep}
          disabled={!selectedRecipe || currentStep >= selectedRecipe.steps.length - 1}
          className="bg-primary hover:bg-primary/90"
          size="sm"
        >
          Next Step
          <Play className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Quick Question Input */}
      <div className="flex gap-2">
        <Input
          placeholder="Ask anything... 'How do I know when it's ready?'"
          value={userQuestion}
          onChange={(e) => setUserQuestion(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && userQuestion.trim()) {
              handleQuestionResponse(userQuestion);
              setUserQuestion("");
            }
          }}
          className="flex-1"
        />
        <Button 
          onClick={() => {
            if (userQuestion.trim()) {
              handleQuestionResponse(userQuestion);
              setUserQuestion("");
            }
          }}
          disabled={!userQuestion.trim()}
          size="sm"
        >
          Ask
        </Button>
      </div>
    </Card>
  );
};