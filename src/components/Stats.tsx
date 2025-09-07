const stats = [
  { number: "10K+", label: "tested recipes" },
  { number: "92%", label: "success rate" },
  { number: "25+", label: "partner chefs" },
  { number: "12+", label: "countries" }
];

export const Stats = () => {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center group"
            >
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2 group-hover:text-orange-700 transition-colors duration-300">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};