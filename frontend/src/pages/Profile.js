import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { MapPin, User, Edit2, Save, X, Loader2, Link2, RefreshCw, Unlink, Trophy, Zap, Target } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const levelLabels = {
  principiante: "Principiante",
  medio: "Intermedio",
  avanzado: "Avanzado"
};

const levelColors = {
  principiante: "bg-green-100 text-green-800",
  medio: "bg-orange-100 text-orange-800",
  avanzado: "bg-pink-100 text-pink-800"
};

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});
  
  // Chess linking state
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkPlatform, setLinkPlatform] = useState("chess_com");
  const [linkUsername, setLinkUsername] = useState("");
  const [linking, setLinking] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const isOwnProfile = !id || (user && user.user_id === id);
  const profileId = id || user?.user_id;

  useEffect(() => {
    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API}/users/${profileId}`, {
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditData({
          name: data.name || "",
          skill_level: data.skill_level || "",
          city: data.city || "",
          bio: data.bio || ""
        });
      } else {
        navigate("/events");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${API}/users/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        const updated = await response.json();
        setProfile(updated);
        setUser(updated);
        setEditing(false);
        toast.success("Perfil actualizado");
      } else {
        toast.error("Error al actualizar");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setSaving(false);
    }
  };

  const handleLookupChess = async () => {
    if (!linkUsername.trim()) {
      toast.error("Introduce un nombre de usuario");
      return;
    }

    setLinking(true);
    setLookupResult(null);
    try {
      const response = await fetch(`${API}/chess/lookup/${linkPlatform}/${linkUsername.trim()}`, {
        credentials: "include"
      });
      
      if (response.ok) {
        const data = await response.json();
        setLookupResult(data);
      } else {
        const error = await response.json();
        toast.error(error.detail || "Usuario no encontrado");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLinking(false);
    }
  };

  const handleLinkAccount = async () => {
    setLinking(true);
    try {
      const response = await fetch(`${API}/chess/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          platform: linkPlatform,
          username: linkUsername.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setUser(data.user);
        setLinkDialogOpen(false);
        setLinkUsername("");
        setLookupResult(null);
        toast.success(`¡Cuenta de ${linkPlatform === "chess_com" ? "Chess.com" : "Lichess"} vinculada!`);
      } else {
        const error = await response.json();
        toast.error(error.detail || "Error al vincular cuenta");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setLinking(false);
    }
  };

  const handleRefreshRatings = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`${API}/chess/refresh`, {
        method: "POST",
        credentials: "include"
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setUser(data.user);
        toast.success("Ratings actualizados");
      } else {
        const error = await response.json();
        toast.error(error.detail || "Error al actualizar ratings");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setRefreshing(false);
    }
  };

  const handleUnlinkAccount = async (platform) => {
    try {
      const response = await fetch(`${API}/chess/unlink/${platform}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        const updatedProfile = { ...profile };
        if (platform === "chess_com") {
          delete updatedProfile.chess_com_username;
          delete updatedProfile.chess_com_rating;
        } else {
          delete updatedProfile.lichess_username;
          delete updatedProfile.lichess_rating;
        }
        setProfile(updatedProfile);
        setUser(updatedProfile);
        toast.success(`Cuenta de ${platform === "chess_com" ? "Chess.com" : "Lichess"} desvinculada`);
      } else {
        toast.error("Error al desvincular");
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-100">
        <Navbar />
        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl p-8">
            <div className="flex items-center gap-6 mb-8">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) return null;

  const hasChessAccounts = profile.chess_com_username || profile.lichess_username;

  return (
    <div className="min-h-screen bg-beige-100">
      <Navbar />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/50">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24 border-4 border-mahogany-200">
                <AvatarImage src={profile.picture} alt={profile.name} />
                <AvatarFallback className="bg-mahogany-100 text-mahogany-800 text-3xl">
                  {profile.name?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-heading text-2xl font-bold text-foreground">
                  {profile.name}
                </h1>
                <p className="text-muted-foreground">{profile.email}</p>
                {profile.user_type === "club" && (
                  <Badge className="mt-2 bg-mahogany-100 text-mahogany-800">Club</Badge>
                )}
              </div>
            </div>

            {isOwnProfile && !editing && (
              <Button 
                variant="outline" 
                onClick={() => setEditing(true)}
                data-testid="edit-profile-btn"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>

          {/* Profile Content */}
          {editing ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre</Label>
                <Input
                  id="edit-name"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="bg-beige-50"
                  data-testid="edit-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nivel de juego</Label>
                  <Select
                    value={editData.skill_level || "none"}
                    onValueChange={(v) => setEditData({ ...editData, skill_level: v === "none" ? "" : v })}
                  >
                    <SelectTrigger className="bg-beige-50" data-testid="edit-level">
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
                  <Label htmlFor="edit-city">Ciudad</Label>
                  <Input
                    id="edit-city"
                    value={editData.city}
                    onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                    className="bg-beige-50"
                    data-testid="edit-city"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-bio">Biografía</Label>
                <Textarea
                  id="edit-bio"
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  placeholder="Cuéntanos sobre ti..."
                  rows={4}
                  className="bg-beige-50"
                  data-testid="edit-bio"
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleSave}
                  className="bg-mahogany-500 hover:bg-mahogany-600"
                  disabled={saving}
                  data-testid="save-profile-btn"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                  Guardar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setEditing(false)}
                  data-testid="cancel-edit-btn"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {profile.bio && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Biografía</h3>
                  <p className="text-foreground">{profile.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                {profile.skill_level && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Nivel</h3>
                    <Badge className={`${levelColors[profile.skill_level]} border-0`}>
                      {levelLabels[profile.skill_level]}
                    </Badge>
                  </div>
                )}

                {profile.city && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Ciudad</h3>
                    <div className="flex items-center gap-2 text-foreground">
                      <MapPin className="w-4 h-4 text-mahogany-500" />
                      {profile.city}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Chess Accounts Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/50 mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading text-xl font-semibold">Cuentas de Ajedrez</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Vincula tus cuentas para importar tu rating automáticamente
              </p>
            </div>
            
            {isOwnProfile && (
              <div className="flex gap-2">
                {hasChessAccounts && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleRefreshRatings}
                    disabled={refreshing}
                    data-testid="refresh-ratings-btn"
                  >
                    {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  </Button>
                )}
                <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-mahogany-500 hover:bg-mahogany-600" data-testid="link-chess-btn">
                      <Link2 className="w-4 h-4 mr-2" />
                      Vincular
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Vincular cuenta de ajedrez</DialogTitle>
                      <DialogDescription>
                        Conecta tu cuenta de Chess.com o Lichess para importar tu rating
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 mt-4">
                      <Tabs value={linkPlatform} onValueChange={(v) => { setLinkPlatform(v); setLookupResult(null); }}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="chess_com" data-testid="tab-chesscom">
                            <img src="https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png" alt="Chess.com" className="w-5 h-5 mr-2" />
                            Chess.com
                          </TabsTrigger>
                          <TabsTrigger value="lichess" data-testid="tab-lichess">
                            <img src="https://lichess1.org/assets/logo/lichess-favicon-32.png" alt="Lichess" className="w-5 h-5 mr-2" />
                            Lichess
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>

                      <div className="space-y-2">
                        <Label htmlFor="chess-username">Nombre de usuario</Label>
                        <div className="flex gap-2">
                          <Input
                            id="chess-username"
                            placeholder={linkPlatform === "chess_com" ? "ej: hikaru" : "ej: DrNykterstein"}
                            value={linkUsername}
                            onChange={(e) => { setLinkUsername(e.target.value); setLookupResult(null); }}
                            className="flex-1"
                            data-testid="chess-username-input"
                          />
                          <Button 
                            variant="outline"
                            onClick={handleLookupChess}
                            disabled={linking || !linkUsername.trim()}
                            data-testid="lookup-btn"
                          >
                            {linking ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buscar"}
                          </Button>
                        </div>
                      </div>

                      {lookupResult && (
                        <div className="bg-beige-50 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{lookupResult.username}</span>
                            <Badge className={`${levelColors[lookupResult.skill_level]} border-0`}>
                              {levelLabels[lookupResult.skill_level]}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3 text-center">
                            {lookupResult.bullet_rating && (
                              <div className="bg-white rounded-lg p-2">
                                <Zap className="w-4 h-4 mx-auto text-yellow-500 mb-1" />
                                <p className="text-xs text-muted-foreground">Bullet</p>
                                <p className="font-bold">{lookupResult.bullet_rating}</p>
                              </div>
                            )}
                            {lookupResult.blitz_rating && (
                              <div className="bg-white rounded-lg p-2">
                                <Target className="w-4 h-4 mx-auto text-orange-500 mb-1" />
                                <p className="text-xs text-muted-foreground">Blitz</p>
                                <p className="font-bold">{lookupResult.blitz_rating}</p>
                              </div>
                            )}
                            {lookupResult.rapid_rating && (
                              <div className="bg-white rounded-lg p-2">
                                <Trophy className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                                <p className="text-xs text-muted-foreground">Rapid</p>
                                <p className="font-bold">{lookupResult.rapid_rating}</p>
                              </div>
                            )}
                          </div>

                          <Button 
                            className="w-full bg-mahogany-500 hover:bg-mahogany-600"
                            onClick={handleLinkAccount}
                            disabled={linking}
                            data-testid="confirm-link-btn"
                          >
                            {linking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Link2 className="w-4 h-4 mr-2" />}
                            Vincular esta cuenta
                          </Button>
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>

          {/* Chess.com Account */}
          <div className="space-y-4">
            {profile.chess_com_username ? (
              <div className="flex items-center justify-between p-4 bg-beige-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png" 
                    alt="Chess.com" 
                    className="w-10 h-10"
                  />
                  <div>
                    <p className="font-medium">{profile.chess_com_username}</p>
                    <p className="text-sm text-muted-foreground">Chess.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-mahogany-800">{profile.chess_com_rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  {isOwnProfile && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleUnlinkAccount("chess_com")}
                      className="text-muted-foreground hover:text-destructive"
                      data-testid="unlink-chesscom-btn"
                    >
                      <Unlink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border border-dashed border-border rounded-xl">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/SamCopeland/phpmeXx6V.png" 
                    alt="Chess.com" 
                    className="w-10 h-10 opacity-50"
                  />
                  <div>
                    <p className="font-medium text-muted-foreground">Chess.com</p>
                    <p className="text-sm text-muted-foreground">No vinculada</p>
                  </div>
                </div>
              </div>
            )}

            {/* Lichess Account */}
            {profile.lichess_username ? (
              <div className="flex items-center justify-between p-4 bg-beige-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://lichess1.org/assets/logo/lichess-favicon-32.png" 
                    alt="Lichess" 
                    className="w-10 h-10"
                  />
                  <div>
                    <p className="font-medium">{profile.lichess_username}</p>
                    <p className="text-sm text-muted-foreground">Lichess</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-mahogany-800">{profile.lichess_rating}</p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  {isOwnProfile && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleUnlinkAccount("lichess")}
                      className="text-muted-foreground hover:text-destructive"
                      data-testid="unlink-lichess-btn"
                    >
                      <Unlink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 border border-dashed border-border rounded-xl">
                <div className="flex items-center gap-4">
                  <img 
                    src="https://lichess1.org/assets/logo/lichess-favicon-32.png" 
                    alt="Lichess" 
                    className="w-10 h-10 opacity-50"
                  />
                  <div>
                    <p className="font-medium text-muted-foreground">Lichess</p>
                    <p className="text-sm text-muted-foreground">No vinculada</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!hasChessAccounts && !isOwnProfile && (
            <p className="text-center text-muted-foreground py-4">
              Este usuario no ha vinculado cuentas de ajedrez
            </p>
          )}
        </div>
      </main>

      {/* Mobile nav spacer */}
      <div className="mobile-nav-spacer" />
    </div>
  );
}
