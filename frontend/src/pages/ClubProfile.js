import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { MapPin, Users, Calendar, ArrowLeft, UserPlus, Trash2, Loader2 } from "lucide-react";

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

export default function ClubProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingMember, setAddingMember] = useState(false);
  const [memberForm, setMemberForm] = useState({ user_email: "", skill_level: "medio" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const isOwner = user?.user_id === id;

  useEffect(() => {
    fetchClub();
  }, [id]);

  const fetchClub = async () => {
    try {
      const response = await fetch(`${API}/clubs/${id}`, {
        credentials: "include"
      });
      if (response.ok) {
        const data = await response.json();
        setClub(data);
      } else {
        navigate("/clubs");
      }
    } catch (error) {
      console.error("Error fetching club:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!memberForm.user_email) {
      toast.error("Introduce el email del usuario");
      return;
    }

    setAddingMember(true);
    try {
      const response = await fetch(`${API}/clubs/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(memberForm)
      });

      if (response.ok) {
        toast.success("Miembro añadido");
        setDialogOpen(false);
        setMemberForm({ user_email: "", skill_level: "medio" });
        fetchClub();
      } else {
        const data = await response.json();
        toast.error(data.detail || "Error al añadir miembro");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const response = await fetch(`${API}/clubs/members/${memberId}`, {
        method: "DELETE",
        credentials: "include"
      });

      if (response.ok) {
        toast.success("Miembro eliminado");
        fetchClub();
      } else {
        toast.error("Error al eliminar miembro");
      }
    } catch (error) {
      toast.error("Error de conexión");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-beige-100">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-48 w-full rounded-2xl mb-6" />
          <div className="grid md:grid-cols-3 gap-6">
            <Skeleton className="h-64 md:col-span-2" />
            <Skeleton className="h-64" />
          </div>
        </main>
      </div>
    );
  }

  if (!club) return null;

  return (
    <div className="min-h-screen bg-beige-100">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate("/clubs")}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a clubes
        </Button>

        {/* Club Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/50 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-[#5c330a]/20">
              <AvatarImage src={club.picture} alt={club.name} />
              <AvatarFallback className="bg-[#5c330a]/10 text-[#5c330a] text-3xl">
                {club.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                    {club.name}
                  </h1>
                  {club.city && (
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {club.city}
                    </div>
                  )}
                </div>
                <Badge className="bg-[#5c330a]/10 text-[#5c330a]">Club</Badge>
              </div>

              {club.bio && (
                <p className="mt-4 text-muted-foreground">{club.bio}</p>
              )}

              <div className="flex gap-6 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#5c330a]">{club.member_count}</p>
                  <p className="text-sm text-muted-foreground">Miembros</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#5c330a]">{club.event_count}</p>
                  <p className="text-sm text-muted-foreground">Eventos</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Events */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-semibold">Próximos Eventos</h2>
            </div>
            
            {club.events && club.events.length > 0 ? (
              <div className="grid gap-6">
                {club.events.slice(0, 4).map((event, index) => (
                  <EventCard key={event.event_id} event={event} index={index} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center border border-border/50">
                <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">Este club no tiene eventos próximos</p>
              </div>
            )}
          </div>

          {/* Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-semibold">Miembros</h2>
              
              {isOwner && (
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-[#5c330a] hover:bg-[#4A2908]" data-testid="add-member-btn">
                      <UserPlus className="w-4 h-4 mr-1" />
                      Añadir
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Añadir Miembro</DialogTitle>
                      <DialogDescription>
                        Introduce el email del usuario que quieres añadir al club
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddMember} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="member-email">Email del usuario</Label>
                        <Input
                          id="member-email"
                          type="email"
                          placeholder="usuario@email.com"
                          value={memberForm.user_email}
                          onChange={(e) => setMemberForm({ ...memberForm, user_email: e.target.value })}
                          data-testid="member-email-input"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nivel de juego</Label>
                        <Select
                          value={memberForm.skill_level}
                          onValueChange={(v) => setMemberForm({ ...memberForm, skill_level: v })}
                        >
                          <SelectTrigger data-testid="member-level-select">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="principiante">Principiante</SelectItem>
                            <SelectItem value="medio">Intermedio</SelectItem>
                            <SelectItem value="avanzado">Avanzado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-[#5c330a] hover:bg-[#4A2908]"
                        disabled={addingMember}
                        data-testid="submit-member-btn"
                      >
                        {addingMember ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Añadir Miembro
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="bg-white rounded-2xl p-4 border border-border/50 space-y-3">
              {club.members && club.members.length > 0 ? (
                club.members.map((member) => (
                  <div 
                    key={member.member_id} 
                    className="flex items-center justify-between p-3 bg-beige-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-[#5c330a]/10 text-[#5c330a]">
                          {member.user_name?.charAt(0)?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{member.user_name}</p>
                        <Badge className={`${levelColors[member.skill_level]} border-0 text-xs`}>
                          {levelLabels[member.skill_level]}
                        </Badge>
                      </div>
                    </div>
                    
                    {isOwner && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemoveMember(member.member_id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 text-muted-foreground/50 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Sin miembros aún</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile nav spacer */}
      <div className="mobile-nav-spacer" />
    </div>
  );
}
