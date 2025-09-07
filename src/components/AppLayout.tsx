import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ChefHat, 
  Home, 
  User, 
  LogOut, 
  LogIn, 
  Utensils, 
  Users, 
  Video,
  MessageCircle,
  Settings,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export const AppLayout = ({ children, showSidebar = true }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/demo', icon: Utensils, label: 'Demo' },
    { path: '/ai-chef', icon: MessageCircle, label: 'AI Chef' },
    { path: '/marco', icon: Users, label: 'Chef Marco' },
    { path: '/groq-chefs', icon: Video, label: 'GROQ Chefs' },
    { path: '/live-chef-marketplace', icon: Users, label: 'Live Marketplace' },
    { path: '/virtual-call', icon: Video, label: 'Virtual Call' },
    { path: '/cooking-sessions', icon: Utensils, label: 'Sessions' },
    { path: '/about', icon: Settings, label: 'About' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Glass Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Mobile Menu */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-900/5 backdrop-blur-sm">
                  <ChefHat className="w-6 h-6 text-gray-800" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Chef Savarin</h1>
              </div>
            </div>
            
            {/* Auth Section */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">
                      Welcome, {user?.firstName}!
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role} • {user?.skillLevel}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border-gray-200/50 hover:bg-gray-50/80 text-gray-700"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/auth')}
                    className="flex items-center gap-2 bg-white/50 backdrop-blur-sm border-gray-200/50 hover:bg-gray-50/80 text-gray-700"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Button>
                  <Button
                    onClick={() => navigate('/auth')}
                    className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Sign Up</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        {/* Sidebar */}
        {showSidebar && (
          <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 bg-white/60 backdrop-blur-xl border-r border-gray-200/50 min-h-screen">
              <div className="p-6">
                <nav className="space-y-2">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = isActivePath(item.path);
                    
                    return (
                      <Button
                        key={item.path}
                        variant="ghost"
                        onClick={() => navigate(item.path)}
                        className={`w-full justify-start gap-3 h-12 ${
                          isActive 
                            ? 'bg-gray-900/10 text-gray-900 border border-gray-200/50' 
                            : 'text-gray-600 hover:bg-white/80 hover:text-gray-900'
                        } rounded-xl transition-all duration-300`}
                      >
                        <IconComponent className="w-5 h-5" />
                        {item.label}
                      </Button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div className="md:hidden fixed inset-0 z-40">
                <div 
                  className="fixed inset-0 bg-black/20 backdrop-blur-sm"
                  onClick={() => setSidebarOpen(false)}
                />
                <aside className="fixed left-0 top-0 h-full w-64 bg-white/90 backdrop-blur-xl border-r border-gray-200/50">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gray-900/5">
                          <ChefHat className="w-6 h-6 text-gray-800" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarOpen(false)}
                        className="p-2"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    
                    <nav className="space-y-2">
                      {navigationItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = isActivePath(item.path);
                        
                        return (
                          <Button
                            key={item.path}
                            variant="ghost"
                            onClick={() => {
                              navigate(item.path);
                              setSidebarOpen(false);
                            }}
                            className={`w-full justify-start gap-3 h-12 ${
                              isActive 
                                ? 'bg-gray-900/10 text-gray-900 border border-gray-200/50' 
                                : 'text-gray-600 hover:bg-white/80 hover:text-gray-900'
                            } rounded-xl transition-all duration-300`}
                          >
                            <IconComponent className="w-5 h-5" />
                            {item.label}
                          </Button>
                        );
                      })}
                    </nav>
                  </div>
                </aside>
              </div>
            )}
          </>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${showSidebar ? 'md:ml-0' : ''}`}>
          <div className="min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
