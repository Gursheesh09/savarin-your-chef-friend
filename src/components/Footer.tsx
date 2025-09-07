export const Footer = () => {
  return (
    <footer className="py-12 px-6 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Savarin</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Your thoughtful culinary companion for better cooking experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-gray-400">
            <a href="/about" className="hover:text-orange-400 transition-colors">
              Meet the Founder
            </a>
            <span className="hidden sm:block">•</span>
            <a href="mailto:contact@savarin.ai" className="hover:text-orange-400 transition-colors">
              contact@savarin.ai
            </a>
            <span className="hidden sm:block">•</span>
            <span>Your data stays private - we never sell your information</span>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700 text-sm text-gray-400">
            <p>© 2024 Savarin. Designed for cooks who care about quality.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};