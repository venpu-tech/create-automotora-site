# CLAUDE.md

Este archivo es la guia para agentes de IA que utilicen esta herramienta para generar sitios web de automotoras.

## Que es esto

CLI que genera sitios web completos para automotoras chilenas a partir de un template Astro + React + TailwindCSS. Toma un archivo `config.json` con los datos del cliente y produce un proyecto listo para desplegar en Vercel.

## Comando principal

```bash
node bin/create-site.js --config <archivo.json> [--output <directorio>]
```

Si no se pasa `--output`, el proyecto se crea en `./<slug>` dentro del directorio actual.

## Flujo de trabajo para el agente

### 1. Clonar este repositorio

```bash
git clone https://github.com/venpu-tech/create-automotora-site.git
cd create-automotora-site
```

### 2. Crear el config.json del cliente

Crear un archivo JSON con la configuracion. Ver `examples/config.example.json` como referencia.

**Campos obligatorios:**

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `name` | string | Nombre del negocio. Ej: "Automotriz Los Andes" |
| `slug` | string | Identificador URL-safe. Ej: "automotriz-los-andes" |
| `domain` | string | Dominio de produccion. Ej: "www.automotrizlosandes.cl" |

**Campos opcionales pero recomendados:**

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| `slogan` | string | Frase del negocio para la pagina "nosotros" |
| `aboutText` | string | HTML del texto "acerca de". Puede incluir `<strong>` |
| `colors.tailwind` | string | Nombre del color Tailwind para el tema. Ver colores disponibles abajo |
| `contact.address` | string | Direccion fisica del negocio |
| `contact.phones` | string[] | Numeros de telefono |
| `contact.emails` | string[] | Correos electronicos |
| `contact.hours.weekdays` | string | Horario dias de semana. Ej: "Lun - Vie: 10:00 - 19:00" |
| `contact.hours.saturday` | string | Horario sabado. Ej: "Sab: 10:00 - 14:00" |
| `contact.mapEmbed` | string | URL completa del iframe de Google Maps embed |
| `social.facebook` | string | URL de la pagina de Facebook |
| `social.instagram` | string | URL del perfil de Instagram |
| `whatsapp.number` | string | Numero de WhatsApp con codigo pais. Ej: "+56912345678" |
| `whatsapp.message` | string | Mensaje predeterminado de WhatsApp |
| `emailService.to` | string[] | Emails destinatarios del formulario de contacto |
| `emailService.cc` | string[] | Emails en copia |
| `seo.home` | {title, description} | Meta tags de la pagina principal |
| `seo.catalog` | {title, description} | Meta tags de la pagina de catalogo |
| `seo.contact` | {title, description} | Meta tags de la pagina de contacto |
| `seo.about` | {title, description} | Meta tags de la pagina nosotros |
| `testimonials` | array | Testimonios de clientes. Cada uno: `{name, text, rating}` |
| `services` | array | Servicios ofrecidos. Cada uno: `{title, description, image}` |
| `heroSlides` | array | Textos del hero slider. Cada uno: `{title, subtitle}`. Maximo 5 |

### 3. Generar contenido creativo

Como agente, genera contenido original y relevante para el cliente:

**Testimonios** — Crear 3 testimonios realistas con nombres chilenos, texto natural y ratings de 4-5. El texto debe sonar autentico, no generico.

**SEO** — Escribir titulos (max 60 chars) y descripciones (max 160 chars) optimizados para busqueda local. Incluir la ciudad y tipo de vehiculos si aplica.

**Hero slides** — 5 slides con titulos impactantes y subtitulos que refuercen la propuesta de valor del cliente.

**Servicios** — 3 servicios con titulo corto y descripcion de 1 linea. Adaptar al tipo de negocio (4x4, premium, economico, etc).

**Slogan** — Una frase memorable que represente al negocio.

**About text** — Parrafo con HTML (`<strong>` para el nombre del negocio) que cuente la historia/propuesta de valor. 2-3 oraciones.

### 4. Ejecutar el CLI

```bash
node bin/create-site.js --config mi-cliente.json
```

### 5. Post-generacion

Despues de generar el sitio, el agente debe:

1. **Imagenes** — Reemplazar las imagenes placeholder:
   - `public/logo.webp` — Logo del negocio
   - `src/assets/slide-01.jpg` a `slide-05.jpg` — Fotos del hero slider
   - `public/image-service-01.webp` a `03` — Imagenes de servicios
   - `public/frontis*.webp` — Fotos del local (usadas en OG images)

2. **Variables de entorno** — Configurar en `.env`:
   - `PUBLIC_TOKEN` — Token Bearer de la API venpu.cl para datos de vehiculos
   - `RESEND_API_KEY` — API key de Resend.com para emails
   - `PUBLIC_HCAPTCHA_SITE_KEY` — Site key de hCaptcha

3. **Verificar** — Ejecutar `npm install && npm run dev` y revisar en localhost:4321

4. **Desplegar** — Push a un repo y conectar con Vercel. El proyecto ya incluye `vercel.json`.

## Colores disponibles

Los siguientes nombres de color se pueden usar en `colors.tailwind`:

```
red, orange, amber, yellow, lime, green, emerald, teal,
cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose
```

El color por defecto del template es `red`. Si se elige otro color, el CLI reemplaza automaticamente todas las clases Tailwind (`red-500` -> `blue-500`) y valores hex en todo el proyecto.

## Estructura del proyecto generado

```
<slug>/
├── src/
│   ├── pages/            # index, catalogo, contacto, nosotros, 404, vehiculos/[name]
│   │   └── api/          # send-email.ts (formulario contacto)
│   ├── components/       # Navbar, Footer, Hero, Catalogo, etc.
│   ├── layouts/          # Layout.astro (shell principal)
│   ├── lib/              # fetchSliders.ts (cliente API venpu.cl)
│   ├── types/            # vehicule.ts
│   ├── helpers/          # formatHelpers.ts, stringHelpers.ts
│   ├── styles/           # global.css
│   └── assets/           # Imagenes, logos de marcas
├── public/               # Assets estaticos (logo, fotos)
├── site.config.json      # Config usada para generar el sitio
├── .env                  # Variables de entorno (por configurar)
├── astro.config.mjs
├── vercel.json
└── package.json
```

## Stack tecnologico del sitio generado

- **Astro 5** — Framework SSR con output: "server"
- **React 19** — Componentes interactivos (catalogo, sliders, formularios)
- **TailwindCSS 4** — Estilos via @tailwindcss/vite
- **Swiper** — Carruseles del hero y vehiculos destacados
- **Resend** — Envio de emails del formulario de contacto
- **hCaptcha** — Proteccion anti-spam
- **API venpu.cl** — Datos de vehiculos (stock, destacados, detalle)
- **Vercel** — Despliegue con adaptador SSR

## Limitaciones actuales

- El template base soporta 1 sucursal. Para multi-sucursal, usar el proyecto `doble-traccion` como referencia.
- Las imagenes del hero slider (`slide-01.jpg` a `slide-05.jpg`) deben reemplazarse manualmente o con IA generativa.
- El CLI reemplaza textos conocidos del template. Si wildcars cambia, actualizar `template/`.
