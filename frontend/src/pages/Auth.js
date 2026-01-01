import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User, Users, MapPin, ArrowLeft } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Auth() {
  const navigate = useNavigate();
  const { user, setUser, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    name: "",
    user_type: "user",
    skill_level: "",
    city: ""
  });

  useEffect(() => {
    if (user) {
      navigate("/events");
    }
  }, [user, navigate]);

  const handleGoogleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/events';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error("Por favor, completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData)
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        toast.success("¡Bienvenido de nuevo!");
        navigate("/events");
      } else {
        const data = await response.json();
        toast.error(data.detail || "Error al iniciar sesión");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerData.email || !registerData.password || !registerData.name) {
      toast.error("Por favor, completa los campos obligatorios");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(registerData)
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        toast.success("¡Cuenta creada con éxito!");
        navigate("/events");
      } else {
        const data = await response.json();
        toast.error(data.detail || "Error al crear cuenta");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-100 flex">
      {/* Left side - Image (hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img 
          src="https://images.unsplash.com/photo-1617740102894-b860db2b2012?w=1200"
          alt="Chess"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#5c330a]/90 to-[#5c330a]/50" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center">
            <img 
              src="https://customer-assets.emergentagent.com/job_playmate-chess/artifacts/o36rjtsy_Presentacio%CC%81n%20app%20y%20MVP.png" 
              alt="Chess Events" 
              className="h-20 mx-auto mb-6 brightness-0 invert"
            />
            <p className="text-xl text-beige-200">
              La comunidad de ajedrez más activa de Cataluña
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link 
            to="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>

          <div className="lg:hidden text-center mb-8">
            <img 
              src="https://customer-assets.emergentagent.com/job_playmate-chess/artifacts/o36rjtsy_Presentacio%CC%81n%20app%20y%20MVP.png" 
              alt="Chess Events" 
              className="h-12 mx-auto"
            />
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/50">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" data-testid="tab-login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register" data-testid="tab-register">Crear Cuenta</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="pl-10 bg-beige-50"
                        data-testid="login-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Contraseña</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="pl-10 bg-beige-50"
                        data-testid="login-password"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#5c330a] hover:bg-[#4A2908] text-white rounded-full py-5"
                    disabled={loading}
                    data-testid="login-submit"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Iniciar Sesión"}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-muted-foreground">o continuar con</span>
                  </div>
                </div>

                <Button 
                  type="button"
                  variant="outline"
                  className="w-full rounded-full py-5"
                  onClick={handleGoogleLogin}
                  data-testid="google-login"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </Button>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nombre *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-name"
                        placeholder="Tu nombre o nombre del club"
                        value={registerData.name}
                        onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                        className="pl-10 bg-beige-50"
                        data-testid="register-name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="tu@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="pl-10 bg-beige-50"
                        data-testid="register-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Contraseña *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Mínimo 6 caracteres"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="pl-10 bg-beige-50"
                        data-testid="register-password"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de cuenta *</Label>
                    <Select
                      value={registerData.user_type}
                      onValueChange={(v) => setRegisterData({ ...registerData, user_type: v })}
                    >
                      <SelectTrigger className="bg-beige-50" data-testid="register-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Jugador
                          </div>
                        </SelectItem>
                        <SelectItem value="club">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Club
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nivel de juego</Label>
                      <Select
                        value={registerData.skill_level || "none"}
                        onValueChange={(v) => setRegisterData({ ...registerData, skill_level: v === "none" ? "" : v })}
                      >
                        <SelectTrigger className="bg-beige-50" data-testid="register-level">
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No especificar</SelectItem>
                          <SelectItem value="principiante">Principiante</SelectItem>
                          <SelectItem value="medio">Intermedio</SelectItem>
                          <SelectItem value="avanzado">Avanzado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-city">Ciudad</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="register-city"
                          placeholder="Tu ciudad"
                          value={registerData.city}
                          onChange={(e) => setRegisterData({ ...registerData, city: e.target.value })}
                          className="pl-10 bg-beige-50"
                          data-testid="register-city"
                        />
                      </div>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-[#5c330a] hover:bg-[#4A2908] text-white rounded-full py-5"
                    disabled={loading}
                    data-testid="register-submit"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear Cuenta"}
                  </Button>
                </form>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-muted-foreground">o continuar con</span>
                  </div>
                </div>

                <Button 
                  type="button"
                  variant="outline"
                  className="w-full rounded-full py-5"
                  onClick={handleGoogleLogin}
                  data-testid="google-register"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continuar con Google
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
