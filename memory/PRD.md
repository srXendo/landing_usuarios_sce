# Chess Events - Landing Page PRD

## Resumen
Landing page estática en Next.js para Chess Events, una app de ajedrez presencial.

## Implementado

### Tecnología
- Next.js 16 con App Router
- TypeScript
- Tailwind CSS v4
- Framer Motion para animaciones
- Página 100% estática
- Google Analytics (configurable via env)

### Secciones de la Landing
1. **Hero** - Mensaje principal "El ajedrez vuelve al tablero real" con CTAs
2. **¿Qué es?** - 6 cards explicando funcionalidades principales
3. **Timeline de Funcionalidades** - Red social, torneos, eventos, seguimiento en vivo, gamificación
4. **SCE Points** - Explicación de los espacios colaboradores (bares, cafeterías)
5. **Cómo funciona** - 4 pasos para empezar
6. **Formulario Beta** - Captación de usuarios (Nombre*, Ciudad, Email*)
7. **Footer** - Logo, enlace a encuesta

### Configuración
Archivo `/src/config.ts` para personalizar:
- `googleFormUrl`: URL del endpoint de Google Forms para el formulario beta
- `googleFormEntries`: IDs de los campos del formulario de Google
- `surveyUrl`: URL de la encuesta de Google Forms
- `contactEmail`: Email de contacto

### Google Analytics
Archivo `.env.local`:
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: ID de medición de Google Analytics (ej: G-XXXXXXXXXX)

### Formulario Beta
- Campos: Nombre (requerido), Ciudad (opcional), Email (requerido)
- Integrado con Google Forms (submit directo)
- Google Form URL: https://docs.google.com/forms/d/e/1FAIpQLSfqJNb-rUwhBDxM21nKt7N7y1dlCkzQQX39mEmObpfIfPPzrw/formResponse
- **Nota**: El usuario reportó que no está funcionando - requiere investigación

## Colores
- Primary: #5c330a (marrón chocolate)
- Background: #F5F0E8 (beige claro)
- Accent: #8B5A2B (marrón claro)

## Logo
https://customer-assets.emergentagent.com/job_playmate-chess/artifacts/p4fd6hj4_Presentacio%CC%81n%20app%20y%20MVP.png

## URLs Importantes
- Encuesta: https://docs.google.com/forms/d/e/1FAIpQLSeQFsCSq0LHRU47WYyAxKZjKn6UHFWJ8_cXQNDjMMa7bYhRKw/viewform?usp=dialog
- Formulario Beta: https://docs.google.com/forms/d/e/1FAIpQLSfqJNb-rUwhBDxM21nKt7N7y1dlCkzQQX39mEmObpfIfPPzrw/viewform

## Para Deploy Estático
```bash
cd frontend
yarn build
# Los archivos estáticos están en .next/
```

## Arquitectura de Archivos
```
/app/frontend/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx      # Google Analytics + metadata
│   │   └── page.tsx        # Landing page completa
│   └── config.ts           # Configuración centralizada
├── .env.local              # Variables de entorno (GA_ID)
└── package.json
```

## Changelog
- **Diciembre 2025**: Añadido Google Analytics, eliminado backend vacío, limpieza de código

## Siguientes Pasos
- [ ] Investigar problema del formulario de Google Forms (usuario reportó que no funciona)
- [ ] Configurar ID de Google Analytics real (NEXT_PUBLIC_GA_MEASUREMENT_ID)
- [ ] Conectar dominio personalizado
- [ ] Optimizar imágenes con next/image
