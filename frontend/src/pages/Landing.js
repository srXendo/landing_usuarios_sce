import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Calendar, Users, Trophy, MapPin, ArrowRight, ExternalLink } from "lucide-react";

const SURVEY_URL = "https://docs.google.com/forms/d/e/1FAIpQLSeQFsCSq0LHRU47WYyAxKZjKn6UHFWJ8_cXQNDjMMa7bYhRKw/viewform?usp=dialog";

export default function Landing() {
  return (
    <div className="min-h-screen bg-beige-100">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1741926677819-c7543a44d2f2?w=1600"
            alt="Chess players"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#5c330a]/95 via-[#5c330a]/80 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Encuentra tu próxima partida de ajedrez
            </h1>
            <p className="mt-6 text-lg md:text-xl text-beige-200 leading-relaxed">
              Conecta con clubes y jugadores de tu ciudad. Descubre torneos, partidas casuales y entrenamientos cerca de ti.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/events">
                <Button size="lg" className="bg-[#8B5A2B] hover:bg-[#6B4423] text-white rounded-full px-8 py-6 font-medium shadow-lg hover:shadow-xl transition-all w-full sm:w-auto" data-testid="hero-see-events">
                  <Calendar className="w-5 h-5 mr-2" />
                  Ver Eventos
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/create">
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8 py-6 font-medium w-full sm:w-auto" data-testid="hero-create-event">
                  Crear Evento
                </Button>
              </Link>
            </div>

            <div className="mt-8">
              <a 
                href={SURVEY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-beige-200 hover:text-white transition-colors"
                data-testid="survey-link"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="underline underline-offset-4">Responder encuesta</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-mahogany-900">
              Todo lo que necesitas para jugar
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              La plataforma más completa para la comunidad de ajedrez
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#5c330a]/10 rounded-2xl flex items-center justify-center mb-6">
                <Calendar className="w-7 h-7 text-[#5c330a]" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                Eventos para todos
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Torneos, partidas casuales, clases y entrenamientos. Encuentra el evento perfecto para tu nivel.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#5c330a]/10 rounded-2xl flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-[#5c330a]" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                Clubes activos
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Únete a clubes de tu zona, conoce a otros jugadores y participa en sus actividades regulares.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-[#5c330a]/10 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7 text-[#5c330a]" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                Cerca de ti
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Filtra por ciudad y descubre eventos en Barcelona, Sabadell, Terrassa y más ciudades.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#5c330a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Trophy className="w-16 h-16 text-[#8B5A2B] mx-auto mb-6" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            ¿Listo para tu próxima partida?
          </h2>
          <p className="text-xl text-beige-200 mb-10 max-w-xl mx-auto">
            Únete a la comunidad de ajedrez más activa de Cataluña
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-white text-[#5c330a] hover:bg-beige-100 rounded-full px-10 py-6 font-medium shadow-lg" data-testid="cta-register">
              Crear cuenta gratis
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-beige-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img 
                src="https://customer-assets.emergentagent.com/job_playmate-chess/artifacts/o36rjtsy_Presentacio%CC%81n%20app%20y%20MVP.png" 
                alt="Chess Events" 
                className="h-8 object-contain"
              />
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 Chess Events. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile nav spacer */}
      <div className="mobile-nav-spacer" />
    </div>
  );
}
