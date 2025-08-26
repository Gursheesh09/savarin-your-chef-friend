import { Mic, Heart, RefreshCw } from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Thoughtful Voice",
    description: "Hands-free guidance while you cook. Ask for timings, temps, and techniques; Savarin answers in a calm, chef-trained voice."
  },
  {
    icon: Heart,
    title: "Mood-Based Cooking", 
    description: "Tell it how you feel: light, comforting, high-protein, date-night. It shapes the menu to match."
  },
  {
    icon: RefreshCw,
    title: "Smart Substitutions",
    description: "Out of shallots? No problem. Savarin suggests pro-level swaps without compromising flavor."
  }
];

export const Features = () => {
  return (
    <section className="py-20 px-6 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center group hover:scale-105 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-gradient-hero rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-warm group-hover:shadow-glow transition-all duration-300">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};