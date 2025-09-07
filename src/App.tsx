import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AppLayout } from "@/components/AppLayout";
import { VirtualCall } from "./pages/VirtualCall";
import { AIChefAgent } from "./pages/AIChefAgent";
import { SimpleMarcoChatPage } from "./pages/SimpleMarcoChat";
import { GroqChefAvatarsPage } from "./pages/GroqChefAvatars";
import { LiveChefMarketplacePage } from "./pages/LiveChefMarketplace";
import { Auth } from "./pages/Auth";
import { About } from "./pages/About";
import { Demo } from "./pages/Demo";
import { CookingSessions } from "./pages/CookingSessions";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<AppLayout><About /></AppLayout>} />
          <Route path="/demo" element={<AppLayout><Demo /></AppLayout>} />
          <Route path="/cooking-sessions" element={<AppLayout><CookingSessions /></AppLayout>} />
          <Route path="/facetime" element={<AppLayout><VirtualCall /></AppLayout>} />
          <Route path="/ai-chef" element={<AppLayout><AIChefAgent /></AppLayout>} />
          <Route path="/marco" element={<AppLayout><SimpleMarcoChatPage /></AppLayout>} />
          <Route path="/groq-chefs" element={<AppLayout><GroqChefAvatarsPage /></AppLayout>} />
          <Route path="/live-chef-marketplace" element={<AppLayout><LiveChefMarketplacePage /></AppLayout>} />
          <Route path="/auth" element={<Auth />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<AppLayout><NotFound /></AppLayout>} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
