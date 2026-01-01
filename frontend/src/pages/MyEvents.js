import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { EventCard } from "@/components/EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Trophy, Users } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function MyEvents() {
  const [data, setData] = useState({ organized: [], joined: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const response = await fetch(`${API}/me/events`, {
        credentials: "include"
      });
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="text-center py-12">
      <Icon className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-beige-100">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-mahogany-900 mb-8">
          Mis Eventos
        </h1>

        <Tabs defaultValue="joined" className="w-full">
          <TabsList className="bg-white border border-border/50 p-1 rounded-xl mb-8">
            <TabsTrigger 
              value="joined" 
              className="data-[state=active]:bg-mahogany-500 data-[state=active]:text-white rounded-lg px-6"
              data-testid="tab-joined"
            >
              <Users className="w-4 h-4 mr-2" />
              Me uní ({data.joined.length})
            </TabsTrigger>
            <TabsTrigger 
              value="organized"
              className="data-[state=active]:bg-mahogany-500 data-[state=active]:text-white rounded-lg px-6"
              data-testid="tab-organized"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Organicé ({data.organized.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="joined">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden">
                    <Skeleton className="h-40 w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data.joined.length === 0 ? (
              <EmptyState 
                icon={Calendar}
                title="Aún no te has unido a ningún evento"
                description="Explora los eventos disponibles y únete a los que te interesen"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="joined-events-grid">
                {data.joined.map((event, index) => (
                  <EventCard key={event.event_id} event={event} index={index} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="organized">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden">
                    <Skeleton className="h-40 w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data.organized.length === 0 ? (
              <EmptyState 
                icon={Trophy}
                title="Aún no has organizado ningún evento"
                description="Crea tu primer evento y empieza a organizar partidas"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="organized-events-grid">
                {data.organized.map((event, index) => (
                  <EventCard key={event.event_id} event={event} index={index} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile nav spacer */}
      <div className="mobile-nav-spacer" />
    </div>
  );
}
