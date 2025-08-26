const stats = [
  { number: "10K+", label: "tested recipes" },
  { number: "92%", label: "success in blind cooks" },
  { number: "25+", label: "partner chefs" },
  { number: "12+", label: "countries" }
];

export const Stats = () => {
  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              <div className="text-3xl md:text-4xl font-bold text-charcoal mb-2 group-hover:text-primary transition-colors duration-300">
                {stat.number}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};