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
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { MapPin, User, Edit2, Save, X, Loader2 } from "lucide-react";

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

              {!profile.bio && !profile.skill_level && !profile.city && (
                <p className="text-muted-foreground text-center py-8">
                  {isOwnProfile 
                    ? "Tu perfil está vacío. ¡Añade información sobre ti!"
                    : "Este usuario aún no ha completado su perfil"
                  }
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile nav spacer */}
      <div className="mobile-nav-spacer" />
    </div>
  );
}
