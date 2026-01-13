"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, Users, Trophy, Calendar, MessageCircle, Bell, 
  Star, Target, Clock, Search, ChevronRight, Coffee,
  Building2, Sparkles, Shield, Zap, ArrowRight, Check,
  ExternalLink, Mail, User, MapPinned
} from "lucide-react";
import { config } from "@/config";

// Use config values
const BETA_SIGNUP_API = config.betaSignupApi;
const SURVEY_URL = config.surveyUrl;

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <WhatIsSection />
      <FeaturesTimeline />
      <SCEPointsSection />
      <HowItWorksSection />
      <BetaSignupSection />
      <Footer />
    </main>
  );
}

// ============ NAVBAR ============
function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#F5F0E8]/95 backdrop-blur-md border-b border-[#5c330a]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center">
            <img 
              src="https://customer-assets.emergentagent.com/job_playmate-chess/artifacts/p4fd6hj4_Presentacio%CC%81n%20app%20y%20MVP.png" 
              alt="Chess Events" 
              className="h-10 object-contain"
            />
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#que-es" className="text-[#5c330a] hover:text-[#8B5A2B] transition-colors font-medium">
              ¿Qué es?
            </a>
            <a href="#funcionalidades" className="text-[#5c330a] hover:text-[#8B5A2B] transition-colors font-medium">
              Funcionalidades
            </a>
            <a href="#sce-points" className="text-[#5c330a] hover:text-[#8B5A2B] transition-colors font-medium">
              SCE Points
            </a>
            <a 
              href="#beta" 
              className="btn-primary text-white px-6 py-2.5 rounded-full font-medium"
            >
              Únete a la Beta
            </a>
          </div>

          {/* Mobile menu button */}
          <a 
            href="#beta" 
            className="md:hidden btn-primary text-white px-4 py-2 rounded-full text-sm font-medium"
          >
            Beta
          </a>
        </div>
      </div>
    </nav>
  );
}

// ============ HERO SECTION ============
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%235c330a' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-[#5c330a]/10 text-[#5c330a] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Próximamente disponible
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#5c330a] leading-tight mb-6">
              El ajedrez vuelve <br />
              <span className="text-[#8B5A2B]">al tablero real</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-[#5c330a]/80 mb-8 leading-relaxed max-w-xl">
              Conecta con jugadores, descubre torneos presenciales y encuentra espacios donde jugar. 
              La comunidad de ajedrez que llevabas esperando.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#beta"
                className="btn-primary text-white px-8 py-4 rounded-full font-semibold text-lg inline-flex items-center justify-center gap-2"
              >
                Accede a la Beta
                <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="#que-es"
                className="border-2 border-[#5c330a] text-[#5c330a] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#5c330a]/5 transition-colors inline-flex items-center justify-center"
              >
                Descubre más
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-[#5c330a]/10">
              <div>
                <p className="text-3xl font-bold text-[#5c330a]">600M+</p>
                <p className="text-sm text-[#5c330a]/60">Jugadores en el mundo</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#5c330a]">∞</p>
                <p className="text-sm text-[#5c330a]/60">Partidas por jugar</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#5c330a]">1</p>
                <p className="text-sm text-[#5c330a]/60">Comunidad</p>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Chess Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&q=80"
                  alt="Jugadores de ajedrez"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#5c330a]/60 via-transparent to-transparent" />
              </div>

              {/* Floating Cards */}
              <motion.div 
                className="absolute -left-8 top-20 bg-white rounded-2xl p-4 shadow-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#5c330a]/10 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-[#5c330a]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#5c330a]">Torneo Blitz</p>
                    <p className="text-sm text-[#5c330a]/60">16 participantes</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="absolute -right-4 bottom-32 bg-white rounded-2xl p-4 shadow-xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#5c330a]">3 eventos</p>
                    <p className="text-sm text-[#5c330a]/60">cerca de ti</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-[#5c330a]/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-[#5c330a]/50 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}

// ============ WHAT IS SECTION ============
function WhatIsSection() {
  return (
    <section id="que-es" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#5c330a] mb-6">
            ¿Qué es Chess Events?
          </h2>
          <p className="text-lg text-[#5c330a]/70 leading-relaxed">
            Una app diseñada para conectar a <strong>jugadores, clubes y organizadores</strong> de ajedrez 
            en el mundo real. Gestiona torneos, descubre partidas y encuentra tu comunidad local.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Search,
              title: "Descubre eventos",
              description: "Encuentra torneos, partidas casuales y eventos cerca de ti con filtros por ubicación, nivel y tipo de juego."
            },
            {
              icon: Calendar,
              title: "Inscripción sencilla",
              description: "Sistema estilo Playtomic: apúntate en segundos, gestiona listas de espera y recibe confirmaciones automáticas."
            },
            {
              icon: Users,
              title: "Conecta con jugadores",
              description: "Perfiles de usuario, chat integrado y sistema de amigos para encontrar rivales de tu nivel."
            },
            {
              icon: Trophy,
              title: "Organiza torneos",
              description: "Herramientas completas para organizadores: emparejamientos, horarios, mesas y seguimiento en tiempo real."
            },
            {
              icon: Bell,
              title: "Notificaciones",
              description: "Mantente al día con alertas de inscripciones, próximas partidas y cambios de horario."
            },
            {
              icon: Star,
              title: "Gamificación",
              description: "Logros, medallas e insignias que premian tu participación y progreso en la comunidad."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="feature-card bg-[#F5F0E8] rounded-2xl p-6 border border-[#5c330a]/10"
            >
              <div className="w-14 h-14 bg-[#5c330a]/10 rounded-2xl flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-[#5c330a]" />
              </div>
              <h3 className="text-xl font-semibold text-[#5c330a] mb-2">{feature.title}</h3>
              <p className="text-[#5c330a]/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ FEATURES TIMELINE ============
function FeaturesTimeline() {
  const features = [
    {
      icon: Users,
      title: "Red Social de Ajedrez",
      description: "Busca jugadores por ELO, país o nombre. Envía solicitudes de amistad, chatea y crea tu perfil público con tu historial y logros.",
      color: "bg-blue-500"
    },
    {
      icon: Trophy,
      title: "Torneos y Partidas",
      description: "Crea torneos físicos con sistemas suizo, round robin o eliminación. Gestiona inscripciones, emparejamientos y resultados en tiempo real.",
      color: "bg-amber-500"
    },
    {
      icon: Calendar,
      title: "Eventos Presenciales",
      description: "Organiza eventos con múltiples torneos, itinerarios detallados y actividades. Filtra por zona, edad, nivel o tipo de juego.",
      color: "bg-green-500"
    },
    {
      icon: Target,
      title: "Seguimiento en Vivo",
      description: "Rankings actualizados automáticamente, visualización del progreso y notificaciones instantáneas de resultados y cambios.",
      color: "bg-purple-500"
    },
    {
      icon: Star,
      title: "Logros y Recompensas",
      description: "Sistema de medallas por hitos: partidas ganadas, subidas de ELO, eventos completados. Insignias como 'Maestro en Aperturas' o 'Campeón de Finales'.",
      color: "bg-pink-500"
    }
  ];

  return (
    <section id="funcionalidades" className="py-24 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#5c330a] mb-6">
            Todo lo que necesitas
          </h2>
          <p className="text-lg text-[#5c330a]/70">
            Una plataforma completa para convertir el ajedrez en una experiencia más social, accesible y organizada.
          </p>
        </motion.div>

        <div className="relative">
          {/* Timeline line - hidden on mobile */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#5c330a] to-[#8B5A2B] -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-24">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                  <div className={`bg-white rounded-2xl p-8 shadow-lg border border-[#5c330a]/10 ${
                    index % 2 === 0 ? 'lg:mr-12' : 'lg:ml-12'
                  }`}>
                    <div className={`flex items-center gap-4 mb-4 ${
                      index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                    }`}>
                      <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-[#5c330a]">{feature.title}</h3>
                    </div>
                    <p className="text-[#5c330a]/70 text-lg leading-relaxed">{feature.description}</p>
                  </div>
                </div>

                {/* Timeline dot - hidden on mobile */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-4 border-[#5c330a] rounded-full z-10" />

                {/* Empty space for alternating layout */}
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============ SCE POINTS SECTION ============
function SCEPointsSection() {
  return (
    <section id="sce-points" className="py-24 bg-[#5c330a] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Coffee className="w-4 h-4" />
              Nueva funcionalidad
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              SCE Points
            </h2>
            
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Espacios colaboradores donde el ajedrez cobra vida: bares, cafeterías, 
              centros culturales y locales que se convierten en puntos de encuentro 
              para la comunidad ajedrecista.
            </p>

            <div className="space-y-4">
              {[
                { icon: Building2, text: "Locales ganan visibilidad y atraen nuevos clientes" },
                { icon: MapPin, text: "Jugadores descubren espacios sociales donde jugar" },
                { icon: Calendar, text: "Organiza partidas y eventos en lugares reales" },
                { icon: Sparkles, text: "Promociones exclusivas para la comunidad" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <p className="text-lg text-white/90">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&q=80"
                alt="Café con ajedrez"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#5c330a] via-transparent to-transparent" />
            </div>

            {/* Floating badge */}
            <motion.div 
              className="absolute -bottom-6 -left-6 bg-white text-[#5c330a] rounded-2xl p-4 shadow-xl"
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#5c330a]/10 rounded-xl flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-[#5c330a]" />
                </div>
                <div>
                  <p className="font-bold">+50 SCE Points</p>
                  <p className="text-sm text-[#5c330a]/60">en Barcelona</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============ HOW IT WORKS ============
function HowItWorksSection() {
  const steps = [
    { number: "01", title: "Crea tu perfil", description: "Regístrate como jugador o club, añade tu ELO y preferencias" },
    { number: "02", title: "Descubre eventos", description: "Filtra torneos y partidas por ubicación, nivel y tipo" },
    { number: "03", title: "Inscríbete", description: "Un clic para apuntarte, con confirmación inmediata" },
    { number: "04", title: "Juega y conecta", description: "Asiste a eventos, conoce jugadores y gana logros" }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#5c330a] mb-6">
            Así de fácil
          </h2>
          <p className="text-lg text-[#5c330a]/70">
            En cuatro pasos estarás jugando partidas reales con otros jugadores de tu zona.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="text-center"
            >
              <div className="relative inline-block mb-6">
                <span className="text-7xl font-bold text-[#5c330a]/10">{step.number}</span>
                {index < steps.length - 1 && (
                  <ChevronRight className="hidden lg:block absolute top-1/2 -right-12 w-8 h-8 text-[#5c330a]/30 -translate-y-1/2" />
                )}
              </div>
              <h3 className="text-xl font-bold text-[#5c330a] mb-2">{step.title}</h3>
              <p className="text-[#5c330a]/70">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ BETA SIGNUP SECTION ============
function BetaSignupSection() {
  const [formData, setFormData] = useState({ name: "", city: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      setErrorMsg("El email es obligatorio");
      setStatus("error");
      return;
    }

    // Check if API is configured
    if (BETA_SIGNUP_API.includes("YOUR_FORM_ID") || !BETA_SIGNUP_API) {
      // For demo purposes, show success even without backend
      console.log("Beta signup (demo mode):", formData);
      setStatus("success");
      setFormData({ name: "", city: "", email: "" });
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch(BETA_SIGNUP_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", city: "", email: "" });
      } else {
        throw new Error("Error al enviar");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Ha ocurrido un error. Inténtalo de nuevo.");
    }
  };

  return (
    <section id="beta" className="py-24 bg-[#F5F0E8]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#5c330a]/10"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#5c330a]/10 text-[#5c330a] px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Acceso anticipado
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-[#5c330a] mb-4">
              ¿Quieres ser de los primeros?
            </h2>
            <p className="text-lg text-[#5c330a]/70 max-w-xl mx-auto">
              Únete a la versión beta de Chess Events y ayúdanos a crear la mejor plataforma 
              para la comunidad de ajedrez. <strong>Plazas limitadas.</strong>
            </p>
          </div>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-[#5c330a] mb-2">¡Estás dentro!</h3>
              <p className="text-[#5c330a]/70">
                Te avisaremos cuando la beta esté lista. Mientras tanto, ¡prepara tus piezas!
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#5c330a] mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-3 rounded-xl border border-[#5c330a]/20 bg-[#F5F0E8] focus:outline-none focus:ring-2 focus:ring-[#5c330a] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#5c330a] mb-2">
                    <MapPinned className="w-4 h-4 inline mr-2" />
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Tu ciudad"
                    className="w-full px-4 py-3 rounded-xl border border-[#5c330a]/20 bg-[#F5F0E8] focus:outline-none focus:ring-2 focus:ring-[#5c330a] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#5c330a] mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-[#5c330a]/20 bg-[#F5F0E8] focus:outline-none focus:ring-2 focus:ring-[#5c330a] focus:border-transparent transition-all"
                />
              </div>

              {status === "error" && errorMsg && (
                <p className="text-red-500 text-sm text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full btn-primary text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === "loading" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Quiero acceso a la Beta
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-[#5c330a]/50">
                Al registrarte aceptas recibir comunicaciones sobre Chess Events. 
                Sin spam, lo prometemos.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// ============ FOOTER ============
function Footer() {
  return (
    <footer className="py-12 bg-[#5c330a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img 
              src="https://customer-assets.emergentagent.com/job_playmate-chess/artifacts/p4fd6hj4_Presentacio%CC%81n%20app%20y%20MVP.png" 
              alt="Chess Events" 
              className="h-10 brightness-0 invert"
            />
          </div>

          <div className="flex items-center gap-6">
            <a 
              href={SURVEY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Responder encuesta
            </a>
            <a href="#beta" className="text-white/80 hover:text-white transition-colors">
              Únete a la Beta
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          © 2025 Chess Events. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
