import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Globe, MapPin, Award, Book, Video, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CulturalTechnique {
  id: string;
  name: string;
  origin: string;
  difficulty: string;
  description: string;
  masterLevel: number;
  totalSteps: number;
  culturalSignificance: string;
  modernApplication: string;
}

interface CulturalJourney {
  country: string;
  flag: string;
  recipesLearned: number;
  techniquesmastered: number;
  culturalPoints: number;
  isUnlocked: boolean;
  specialties: string[];
}

interface AuthenticRecipe {
  name: string;
  country: string;
  authenticity: number;
  difficulty: string;
  culturalStory: string;
  techniques: string[];
  ingredients: string[];
}

export const CulturalCookingExplorer = () => {
  const [culturalTechniques, setCulturalTechniques] = useState<CulturalTechnique[]>([
    {
      id: "wok-hei",
      name: "Wok Hei",
      origin: "China",
      difficulty: "Advanced",
      description: "The elusive 'breath of the wok' - achieving the perfect smoky flavor in stir-frying",
      masterLevel: 3,
      totalSteps: 8,
      culturalSignificance: "Essential technique in Cantonese cooking, representing the chef's skill and timing",
      modernApplication: "Applicable to any high-heat cooking for enhanced flavor development"
    },
    {
      id: "mise-en-place",
      name: "Mise en Place",
      origin: "France",
      difficulty: "Beginner",
      description: "The foundation of professional cooking - organization and preparation",
      masterLevel: 6,
      totalSteps: 5,
      culturalSignificance: "Core philosophy of French culinary education and professional kitchens",
      modernApplication: "Universal principle for efficient home cooking and meal preparation"
    },
    {
      id: "tempura-technique",
      name: "Tempura Batter",
      origin: "Japan",
      difficulty: "Intermediate",
      description: "Creating the perfect light, crispy coating through temperature and timing",
      masterLevel: 2,
      totalSteps: 6,
      culturalSignificance: "Refined art form representing Japanese precision and seasonal ingredients",
      modernApplication: "Technique for creating light, crispy coatings on vegetables and proteins"
    }
  ]);

  const [culturalJourneys, setCulturalJourneys] = useState<CulturalJourney[]>([
    {
      country: "Italy",
      flag: "🇮🇹",
      recipesLearned: 12,
      techniquesmastered: 4,
      culturalPoints: 890,
      isUnlocked: true,
      specialties: ["Pasta", "Risotto", "Bread"]
    },
    {
      country: "Japan",
      flag: "🇯🇵",
      recipesLearned: 8,
      techniquesmastered: 3,
      culturalPoints: 650,
      isUnlocked: true,
      specialties: ["Sushi", "Tempura", "Miso"]
    },
    {
      country: "Mexico",
      flag: "🇲🇽",
      recipesLearned: 15,
      techniquesmastered: 5,
      culturalPoints: 1120,
      isUnlocked: true,
      specialties: ["Mole", "Nixtamal", "Salsa"]
    },
    {
      country: "India",
      flag: "🇮🇳",
      recipesLearned: 6,
      techniquesmastered: 2,
      culturalPoints: 420,
      isUnlocked: true,
      specialties: ["Spice Blending", "Tandoor"]
    },
    {
      country: "Morocco",
      flag: "🇲🇦",
      recipesLearned: 0,
      techniquesmastered: 0,
      culturalPoints: 0,
      isUnlocked: false,
      specialties: ["Tagine", "Preserved Lemons", "Ras el Hanout"]
    }
  ]);

  const [featuredRecipe, setFeaturedRecipe] = useState<AuthenticRecipe>({
    name: "Cacio e Pepe",
    country: "Italy",
    authenticity: 98,
    difficulty: "Intermediate",
    culturalStory: "A Roman pasta dish that embodies the principle of using few, high-quality ingredients. Born from the necessity of shepherds who needed portable, long-lasting ingredients.",
    techniques: ["Pasta Water Emulsion", "Cheese Tempering", "Timing Coordination"],
    ingredients: ["Pecorino Romano", "Black Pepper", "Pasta", "Salt"]
  });

  const { toast } = useToast();

  const practiceTechnique = (techniqueId: string) => {
    setCulturalTechniques(prev =>
      prev.map(technique => {
        if (technique.id === techniqueId && technique.masterLevel < technique.totalSteps) {
          const newLevel = technique.masterLevel + 1;
          
          toast({
            title: "Technique Progress! 🥢",
            description: `${technique.name} mastery: ${newLevel}/${technique.totalSteps}`,
          });
          
          return { ...technique, masterLevel: newLevel };
        }
        return technique;
      })
    );
  };

  const exploreCountry = (country: string) => {
    const journey = culturalJourneys.find(j => j.country === country);
    
    if (journey?.isUnlocked) {
      toast({
        title: `Exploring ${journey.flag} ${country}! ✈️`,
        description: `Dive into authentic ${country} cuisine and traditions`,
      });
    } else {
      toast({
        title: "Journey Locked 🔒",
        description: "Master more techniques to unlock this culinary destination",
        variant: "destructive"
      });
    }
  };

  const learnAuthenticRecipe = () => {
    toast({
      title: "Recipe Added to Journey! 📚",
      description: `${featuredRecipe.name} added to your Italian culinary collection`,
    });

    // Update Italy journey
    setCulturalJourneys(prev =>
      prev.map(journey =>
        journey.country === "Italy"
          ? { ...journey, recipesLearned: journey.recipesLearned + 1, culturalPoints: journey.culturalPoints + 50 }
          : journey
      )
    );
  };

  const getTechniqueProgress = (technique: CulturalTechnique) => {
    return (technique.masterLevel / technique.totalSteps) * 100;
  };

  const getTotalCulturalPoints = () => {
    return culturalJourneys.reduce((sum, journey) => sum + journey.culturalPoints, 0);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Globe className="w-6 h-6 text-primary" />
          Cultural Cooking Explorer
        </CardTitle>
        <p className="text-muted-foreground">
          Master authentic techniques from around the world with cultural context
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Cultural Dashboard */}
        <Card className="p-6 bg-gradient-subtle">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{getTotalCulturalPoints()}</div>
              <div className="text-sm text-muted-foreground">Cultural Points</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {culturalJourneys.filter(j => j.isUnlocked).length}
              </div>
              <div className="text-sm text-muted-foreground">Countries Explored</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {culturalJourneys.reduce((sum, j) => sum + j.recipesLearned, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Authentic Recipes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {culturalTechniques.filter(t => t.masterLevel === t.totalSteps).length}
              </div>
              <div className="text-sm text-muted-foreground">Techniques Mastered</div>
            </div>
          </div>
        </Card>

        {/* Cultural Techniques */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Master Cultural Techniques</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {culturalTechniques.map(technique => (
              <Card key={technique.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{technique.name}</h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {technique.origin}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {technique.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-sm">{technique.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Mastery Progress</span>
                      <span>{technique.masterLevel}/{technique.totalSteps}</span>
                    </div>
                    <Progress value={getTechniqueProgress(technique)} className="h-2" />
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div>
                      <strong>Cultural Significance:</strong>
                      <p className="text-muted-foreground mt-1">{technique.culturalSignificance}</p>
                    </div>
                    <div>
                      <strong>Modern Application:</strong>
                      <p className="text-muted-foreground mt-1">{technique.modernApplication}</p>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => practiceTechnique(technique.id)}
                    disabled={technique.masterLevel >= technique.totalSteps}
                  >
                    {technique.masterLevel >= technique.totalSteps ? (
                      <>
                        <Award className="w-3 h-3 mr-2" />
                        Mastered
                      </>
                    ) : (
                      <>
                        <Book className="w-3 h-3 mr-2" />
                        Practice
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Authentic Recipe */}
        <Card className="p-6 border-primary/20">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Book className="w-5 h-5 text-primary" />
                  Featured Authentic Recipe
                </h3>
                <p className="text-muted-foreground">Learn the traditional way</p>
              </div>
              <Badge variant="default" className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                {featuredRecipe.authenticity}% Authentic
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold">{featuredRecipe.name}</h4>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {featuredRecipe.country} • {featuredRecipe.difficulty}
                  </p>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm mb-2">Cultural Story</h5>
                  <p className="text-sm text-muted-foreground">{featuredRecipe.culturalStory}</p>
                </div>
                
                <Button onClick={learnAuthenticRecipe} className="w-full">
                  <Video className="w-4 h-4 mr-2" />
                  Learn Traditional Method
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-sm mb-2">Traditional Techniques</h5>
                  <div className="flex flex-wrap gap-1">
                    {featuredRecipe.techniques.map((technique, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {technique}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-sm mb-2">Authentic Ingredients</h5>
                  <div className="flex flex-wrap gap-1">
                    {featuredRecipe.ingredients.map((ingredient, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Cultural Journeys */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Culinary Journeys</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {culturalJourneys.map(journey => (
              <Card 
                key={journey.country} 
                className={`p-4 cursor-pointer transition-all ${
                  journey.isUnlocked 
                    ? 'hover:scale-105 hover:shadow-md' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => exploreCountry(journey.country)}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{journey.flag}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold">{journey.country}</h4>
                      <p className="text-xs text-muted-foreground">
                        {journey.culturalPoints} cultural points
                      </p>
                    </div>
                    {!journey.isUnlocked && (
                      <Badge variant="secondary" className="text-xs">Locked</Badge>
                    )}
                  </div>
                  
                  {journey.isUnlocked && (
                    <>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium">{journey.recipesLearned}</div>
                          <div className="text-muted-foreground">Recipes</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{journey.techniquesmastered}</div>
                          <div className="text-muted-foreground">Techniques</div>
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-xs font-medium mb-1">Specialties:</h5>
                        <div className="flex flex-wrap gap-1">
                          {journey.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};