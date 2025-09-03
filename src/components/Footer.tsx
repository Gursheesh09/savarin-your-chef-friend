export const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-charcoal text-charcoal-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Savarin</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Your thoughtful culinary companion for better cooking experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-muted-foreground">
            <a href="/about" className="hover:text-primary transition-colors">
              Meet the Founder
            </a>
            <span className="hidden sm:block">•</span>
            <a href="mailto:contact@savarin.ai" className="hover:text-primary transition-colors">
              contact@savarin.ai
            </a>
            <span className="hidden sm:block">•</span>
            <span>Your data stays private - we never sell your information</span>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border/20 text-sm text-muted-foreground">
            <p>© 2024 Savarin. Designed for cooks who care about quality.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};