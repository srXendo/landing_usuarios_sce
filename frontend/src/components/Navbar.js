import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, Home, Users, Plus, User, LogOut, Menu } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2" data-testid="logo-link">
                <img 
                  src="https://customer-assets.emergentagent.com/job_playmate-chess/artifacts/o36rjtsy_Presentacio%CC%81n%20app%20y%20MVP.png" 
                  alt="Chess Events" 
                  className="h-10 object-contain"
                />
              </Link>
              
              <div className="flex items-center gap-1">
                <Link to="/events">
                  <Button 
                    variant={isActive("/events") ? "secondary" : "ghost"} 
                    className="font-medium"
                    data-testid="nav-events"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Eventos
                  </Button>
                </Link>
                <Link to="/clubs">
                  <Button 
                    variant={isActive("/clubs") ? "secondary" : "ghost"} 
                    className="font-medium"
                    data-testid="nav-clubs"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Clubes
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link to="/create">
                    <Button className="bg-[#5c330a] hover:bg-[#4A2908] text-white rounded-full" data-testid="create-event-btn">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Evento
                    </Button>
                  </Link>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-testid="user-menu-trigger">
                        <Avatar className="h-10 w-10 border-2 border-mahogany-200">
                          <AvatarImage src={user.picture} alt={user.name} />
                          <AvatarFallback className="bg-mahogany-100 text-mahogany-800">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-2 py-1.5">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/me")} data-testid="menu-my-events">
                        <Calendar className="w-4 h-4 mr-2" />
                        Mis Eventos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/profile")} data-testid="menu-profile">
                        <User className="w-4 h-4 mr-2" />
                        Mi Perfil
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="text-destructive" data-testid="menu-logout">
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link to="/auth">
                  <Button className="bg-[#5c330a] hover:bg-[#4A2908] text-white rounded-full px-6" data-testid="login-btn">
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-2 flex justify-around items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden">
        <Link to="/" className={`flex flex-col items-center p-2 rounded-lg ${isActive("/") ? "text-[#5c330a] bg-[#5c330a]/10" : "text-muted-foreground"}`}>
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Inicio</span>
        </Link>
        <Link to="/events" className={`flex flex-col items-center p-2 rounded-lg ${isActive("/events") ? "text-[#5c330a] bg-[#5c330a]/10" : "text-muted-foreground"}`}>
          <Calendar className="w-5 h-5" />
          <span className="text-xs mt-1">Eventos</span>
        </Link>
        {user && (
          <Link to="/create" className="flex flex-col items-center p-2">
            <div className="bg-[#5c330a] text-white rounded-full p-3 -mt-6 shadow-lg">
              <Plus className="w-5 h-5" />
            </div>
          </Link>
        )}
        <Link to="/clubs" className={`flex flex-col items-center p-2 rounded-lg ${isActive("/clubs") ? "text-[#5c330a] bg-[#5c330a]/10" : "text-muted-foreground"}`}>
          <Users className="w-5 h-5" />
          <span className="text-xs mt-1">Clubes</span>
        </Link>
        <Link to={user ? "/profile" : "/auth"} className={`flex flex-col items-center p-2 rounded-lg ${isActive("/profile") || isActive("/auth") ? "text-[#5c330a] bg-[#5c330a]/10" : "text-muted-foreground"}`}>
          <User className="w-5 h-5" />
          <span className="text-xs mt-1">{user ? "Perfil" : "Entrar"}</span>
        </Link>
      </nav>
    </>
  );
}
