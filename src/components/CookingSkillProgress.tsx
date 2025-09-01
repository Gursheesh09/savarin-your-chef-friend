import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, ChefHat, Target, Flame, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Skill {
  id: string;
  name: string;
  level: number;
  xp: number;
  maxXp: number;
  icon: any;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlockedAt?: Date;
  isUnlocked: boolean;
}

const initialSkills: Skill[] = [
  { id: "knife", name: "Knife Skills", level: 3, xp: 150, maxXp: 200, icon: ChefHat, color: "bg-blue-500" },
  { id: "seasoning", name: "Seasoning", level: 2, xp: 80, maxXp: 150, icon: Star, color: "bg-purple-500" },
  { id: "timing", name: "Timing", level: 4, xp: 180, maxXp: 250, icon: Target, color: "bg-green-500" },
  { id: "heat", name: "Heat Control", level: 1, xp: 40, maxXp: 100, icon: Flame, color: "bg-red-500" },
];

const achievements: Achievement[] = [
  {
    id: "first_recipe",
    title: "First Steps",
    description: "Complete your first recipe",
    icon: ChefHat,
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    id: "knife_master",
    title: "Knife Master",
    description: "Reach level 5 in Knife Skills",
    icon: Award,
    isUnlocked: false,
  },
  {
    id: "speed_cook",
    title: "Speed Cook",
    description: "Complete a recipe in under 30 minutes",
    icon: Target,
    isUnlocked: true,
    unlockedAt: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: "flavor_guru",
    title: "Flavor Guru",
    description: "Master the art of seasoning",
    icon: Star,
    isUnlocked: false,
  },
];

export const CookingSkillProgress = () => {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [userAchievements, setUserAchievements] = useState<Achievement[]>(achievements);
  const [totalLevel, setTotalLevel] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const total = skills.reduce((sum, skill) => sum + skill.level, 0);
    setTotalLevel(total);
  }, [skills]);

  const practiceSkill = (skillId: string) => {
    setSkills(prevSkills => 
      prevSkills.map(skill => {
        if (skill.id === skillId) {
          const xpGain = Math.floor(Math.random() * 30) + 10; // 10-40 XP
          let newXp = skill.xp + xpGain;
          let newLevel = skill.level;
          let newMaxXp = skill.maxXp;
          
          // Level up logic
          if (newXp >= skill.maxXp) {
            newLevel += 1;
            newXp = newXp - skill.maxXp;
            newMaxXp = skill.maxXp + 50; // Increase XP requirement
            
            toast({
              title: "Level Up! 🎉",
              description: `${skill.name} is now level ${newLevel}!`,
            });
            
            // Check for achievements
            if (skillId === "knife" && newLevel >= 5) {
              unlockAchievement("knife_master");
            }
          } else {
            toast({
              title: `+${xpGain} XP`,
              description: `Great practice with ${skill.name}!`,
            });
          }
          
          return { ...skill, level: newLevel, xp: newXp, maxXp: newMaxXp };
        }
        return skill;
      })
    );
  };

  const unlockAchievement = (achievementId: string) => {
    setUserAchievements(prev => 
      prev.map(achievement => 
        achievement.id === achievementId && !achievement.isUnlocked
          ? { ...achievement, isUnlocked: true, unlockedAt: new Date() }
          : achievement
      )
    );
    
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement) {
      toast({
        title: "Achievement Unlocked! 🏆",
        description: achievement.title,
      });
    }
  };

  const getSkillPercentage = (skill: Skill) => {
    return (skill.xp / skill.maxXp) * 100;
  };

  const unlockedAchievements = userAchievements.filter(a => a.isUnlocked);
  const lockedAchievements = userAchievements.filter(a => !a.isUnlocked);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Trophy className="w-6 h-6 text-primary" />
          Cooking Skill Progression
        </CardTitle>
        <p className="text-muted-foreground">
          Level up your culinary skills and unlock achievements
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Overall Progress */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Badge variant="default" className="text-lg px-4 py-2">
              <ChefHat className="w-4 h-4 mr-2" />
              Chef Level {totalLevel}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <Trophy className="w-4 h-4 mr-2" />
              {unlockedAchievements.length} Achievements
            </Badge>
          </div>
        </div>

        {/* Skills Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Cooking Skills</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {skills.map(skill => {
              const IconComponent = skill.icon;
              const percentage = getSkillPercentage(skill);
              
              return (
                <Card key={skill.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${skill.color} flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-semibold">{skill.name}</h4>
                          <Badge variant="secondary">Level {skill.level}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {skill.xp} / {skill.maxXp} XP
                        </div>
                      </div>
                    </div>
                    
                    <Progress value={percentage} className="h-2" />
                    
                    <Button
                      onClick={() => practiceSkill(skill.id)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Practice {skill.name}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Achievements</h3>
          
          {/* Unlocked Achievements */}
          <div className="space-y-3">
            <h4 className="font-medium text-muted-foreground">Unlocked ({unlockedAchievements.length})</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {unlockedAchievements.map(achievement => {
                const IconComponent = achievement.icon;
                return (
                  <Card key={achievement.id} className="p-4 bg-gradient-subtle border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-primary">{achievement.title}</h5>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.unlockedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Unlocked {achievement.unlockedAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground">Coming Up ({lockedAchievements.length})</h4>
              <div className="grid gap-3 md:grid-cols-2">
                {lockedAchievements.map(achievement => {
                  const IconComponent = achievement.icon;
                  return (
                    <Card key={achievement.id} className="p-4 opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-muted-foreground">{achievement.title}</h5>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};