# Social Chess Events - PRD

## Problem Statement
MVP web full-stack para la comunidad de ajedrez en Cataluña. Permite a usuarios y clubes organizar y unirse a eventos de ajedrez.

## User Personas
1. **Jugadores**: Buscan eventos cerca de su ciudad, se unen a partidas y torneos
2. **Clubes**: Organizan eventos, gestionan miembros con niveles de juego

## Core Requirements
- Auth: Password simple + Google OAuth (Emergent)
- Eventos: CRUD con filtros (ciudad, fecha, nivel, tipo)
- Unirse a eventos con control de plazas
- Perfiles de usuario y club diferenciados
- Clubes pueden añadir miembros con nivel

## What's Been Implemented (Jan 2026)
- ✅ Landing page con hero y CTAs
- ✅ Listado de eventos con filtros
- ✅ Detalle de evento con botón unirse
- ✅ Crear evento (usuarios autenticados)
- ✅ Mis eventos (joined + organized)
- ✅ Auth dual: password + Google OAuth
- ✅ Perfil de usuario editable
- ✅ Listado de clubes con búsqueda
- ✅ Perfil de club con miembros y eventos
- ✅ Gestión de miembros para clubes
- ✅ 12 eventos seed en Barcelona/Sabadell/Terrassa
- ✅ 2 clubes seed con datos
- ✅ UI Playtomic-style con colores mahogany/beige
- ✅ Mobile bottom navigation
- ✅ Enlace encuesta configurable
- ✅ **Integración Chess.com** - Vincular cuenta, importar ratings
- ✅ **Integración Lichess** - Vincular cuenta, importar ratings
- ✅ **Auto-cálculo de nivel** - Basado en rating (principiante <1200, medio 1200-1800, avanzado >1800)
- ✅ **Refrescar ratings** - Actualizar ratings desde APIs
- ✅ **Desvincular cuentas** - Eliminar vinculación

## Tech Stack
- Frontend: React + Tailwind + Shadcn UI
- Backend: FastAPI + Motor (async MongoDB)
- Auth: bcrypt + Emergent Google OAuth
- Database: MongoDB
- External APIs: Chess.com Public API, Lichess API

## Prioritized Backlog
### P0 (Done)
- Core event CRUD ✅
- Auth system ✅
- User/Club profiles ✅
- Chess.com/Lichess integration ✅

### P1 (Next)
- Notificaciones de eventos
- Sistema de mensajería entre usuarios
- Mapa de eventos

### P2 (Future)
- Sistema de rankings/ELO interno
- Pagos para torneos premium
