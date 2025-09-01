import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Heart, Brain, Zap, Shield, TrendingUp, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NutritionalGoal {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  icon: any;
  color: string;
  status: 'below' | 'optimal' | 'above';
}

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  optimal: boolean;
}

interface PersonalizedRecommendation {
  type: 'recipe' | 'ingredient' | 'timing' | 'portion';
  title: string;
  description: string;
  impact: string;
  confidence: number;
}

export const AINutritionist = () => {
  const [goals, setGoals] = useState<NutritionalGoal[]>([
    { id: "protein", name: "Protein", current: 85, target: 120, unit: "g", icon: Heart, color: "bg-red-500", status: 'below' },
    { id: "fiber", name: "Fiber", current: 28, target: 35, unit: "g", icon: Shield, color: "bg-green-500", status: 'below' },
    { id: "omega3", name: "Omega-3", current: 1.2, target: 2.0, unit: "g", icon: Brain, color: "bg-blue-500", status: 'below' },
    { id: "calories", name: "Calories", current: 1850, target: 2200, unit: "cal", icon: Zap, color: "bg-yellow-500", status: 'below' },
  ]);

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    { id: "energy", name: "Energy Level", value: 78, trend: 'up', optimal: true },
    { id: "focus", name: "Mental Focus", value: 82, trend: 'up', optimal: true },
    { id: "recovery", name: "Recovery Rate", value: 65, trend: 'stable', optimal: false },
    { id: "inflammation", name: "Inflammation", value: 25, trend: 'down', optimal: true },
  ]);

  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([
    {
      type: 'recipe',
      title: 'Salmon & Quinoa Power Bowl',
      description: 'Boost your omega-3 and protein intake with this brain-healthy meal',
      impact: '+15g protein, +0.8g omega-3',
      confidence: 94
    },
    {
      type: 'timing',
      title: 'Pre-workout Snack',
      description: 'Eat a banana with almond butter 30 minutes before your 6 PM workout',
      impact: 'Improved performance by 12%',
      confidence: 87
    },
    {
      type: 'ingredient',
      title: 'Add Chia Seeds',
      description: 'Sprinkle 2 tbsp chia seeds on your morning smoothie',
      impact: '+5g fiber, +1.2g omega-3',
      confidence: 91
    },
  ]);

  const [personalData, setPersonalData] = useState({
    age: 28,
    weight: 155,
    height: 68,
    activityLevel: 'moderate',
    goals: 'muscle_gain',
    restrictions: ['gluten_free']
  });

  const { toast } = useToast();

  const analyzeNutrition = () => {
    // Simulate AI analysis
    toast({
      title: "AI Analysis Complete! 🧠",
      description: "Your nutrition profile has been updated with personalized recommendations",
    });

    // Update some metrics randomly to show dynamic analysis
    setHealthMetrics(prev => prev.map(metric => ({
      ...metric,
      value: Math.max(0, Math.min(100, metric.value + (Math.random() - 0.5) * 10)),
      trend: Math.random() > 0.5 ? 'up' : metric.trend
    })));
  };

  const optimizeRecipe = (recipeName: string) => {
    toast({
      title: "Recipe Optimized! ✨",
      description: `${recipeName} has been personalized for your nutritional goals`,
    });
  };

  const getGoalPercentage = (goal: NutritionalGoal) => {
    return Math.min(100, (goal.current / goal.target) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'below': return 'text-orange-600';
      case 'optimal': return 'text-green-600';
      case 'above': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Brain className="w-6 h-6 text-primary" />
          AI Nutritionist
        </CardTitle>
        <p className="text-muted-foreground">
          Real-time nutritional analysis with personalized health optimization
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Personal Health Dashboard */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthMetrics.map(metric => (
            <Card key={metric.id} className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">{metric.name}</h4>
                  <TrendingUp className={`w-4 h-4 ${
                    metric.trend === 'up' ? 'text-green-500' : 
                    metric.trend === 'down' ? 'text-red-500' : 'text-gray-500'
                  }`} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold">{metric.value}</span>
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <Badge variant={metric.optimal ? "default" : "secondary"} className="text-xs">
                  {metric.optimal ? "Optimal" : "Needs Attention"}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Nutritional Goals */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Today's Nutritional Goals</h3>
            <Button onClick={analyzeNutrition} variant="outline">
              <Brain className="w-4 h-4 mr-2" />
              AI Analysis
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {goals.map(goal => {
              const IconComponent = goal.icon;
              const percentage = getGoalPercentage(goal);
              
              return (
                <Card key={goal.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${goal.color} flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">{goal.name}</h4>
                          <Badge variant="outline" className={getStatusColor(goal.status)}>
                            {goal.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {goal.current} / {goal.target} {goal.unit}
                        </div>
                      </div>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Personalized Recommendations</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((rec, index) => (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="text-xs">
                      {rec.type.replace('_', ' ')}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {rec.confidence}% confident
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                    <p className="text-xs text-primary font-medium">{rec.impact}</p>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => optimizeRecipe(rec.title)}
                  >
                    <Target className="w-3 h-3 mr-2" />
                    Apply
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Health Profile */}
        <Card className="p-6 bg-gradient-subtle">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Your Health Profile
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Age:</span>
                <span className="ml-2 font-medium">{personalData.age} years</span>
              </div>
              <div>
                <span className="text-muted-foreground">Activity:</span>
                <span className="ml-2 font-medium capitalize">{personalData.activityLevel}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Goal:</span>
                <span className="ml-2 font-medium">{personalData.goals.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Restrictions:</span>
                <span className="ml-2 font-medium">{personalData.restrictions.join(', ')}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              🧬 AI analyzes your biometrics, preferences, and goals to create the perfect nutrition plan
            </p>
          </div>
        </Card>
      </CardContent>
    </Card>
  );
};