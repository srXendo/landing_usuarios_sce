import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { EventFilters } from "@/components/EventFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: "",
    date_filter: "",
    skill_level: "",
    event_type: ""
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.city) params.append("city", filters.city);
      if (filters.date_filter) params.append("date_filter", filters.date_filter);
      if (filters.skill_level) params.append("skill_level", filters.skill_level);
      if (filters.event_type) params.append("event_type", filters.event_type);

      const response = await fetch(`${API}/events?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      city: "",
      date_filter: "",
      skill_level: "",
      event_type: ""
    });
  };

  return (
    <div className="min-h-screen bg-beige-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#5c330a]">
            Eventos de Ajedrez
          </h1>
          <p className="mt-2 text-muted-foreground">
            Descubre torneos, partidas casuales y entrenamientos cerca de ti
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <EventFilters 
            filters={filters} 
            setFilters={setFilters}
            onClear={clearFilters}
          />
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No hay eventos disponibles
            </h3>
            <p className="text-muted-foreground">
              Prueba a cambiar los filtros o vuelve más tarde
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="events-grid">
            {events.map((event, index) => (
              <EventCard key={event.event_id} event={event} index={index} />
            ))}
          </div>
        )}
      </main>

      {/* Mobile nav spacer */}
      <div className="mobile-nav-spacer" />
    </div>
  );
}
