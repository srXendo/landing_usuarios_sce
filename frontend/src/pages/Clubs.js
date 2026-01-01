import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Users, Calendar } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Clubs() {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [citySearch, setCitySearch] = useState("");

  useEffect(() => {
    fetchClubs();
  }, [citySearch]);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (citySearch) params.append("city", citySearch);

      const response = await fetch(`${API}/clubs?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setClubs(data);
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-mahogany-900">
            Clubes de Ajedrez
          </h1>
          <p className="mt-2 text-muted-foreground">
            Encuentra clubes cerca de ti y únete a su comunidad
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-border/50 p-4 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por ciudad..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="pl-10 bg-beige-50 border-border"
                data-testid="club-city-search"
              />
            </div>
          </div>
        </div>

        {/* Clubs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : clubs.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No hay clubes disponibles
            </h3>
            <p className="text-muted-foreground">
              {citySearch ? "No encontramos clubes en esa ciudad" : "Pronto habrá clubes disponibles"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="clubs-grid">
            {clubs.map((club, index) => (
              <Link 
                key={club.user_id} 
                to={`/clubs/${club.user_id}`}
                className={`group block opacity-0 animate-fade-in stagger-${(index % 4) + 1}`}
                data-testid={`club-card-${club.user_id}`}
              >
                <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-border/50 card-hover">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16 border-2 border-mahogany-200">
                      <AvatarImage src={club.picture} alt={club.name} />
                      <AvatarFallback className="bg-mahogany-100 text-mahogany-800 text-xl">
                        {club.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-mahogany-800 transition-colors">
                        {club.name}
                      </h3>
                      {club.city && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {club.city}
                        </div>
                      )}
                    </div>
                  </div>

                  {club.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {club.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{club.member_count} miembros</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{club.event_count} eventos</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Mobile nav spacer */}
      <div className="mobile-nav-spacer" />
    </div>
  );
}
