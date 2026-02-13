# create-automotora-site

CLI para generar sitios web de automotoras a partir de un template Astro + React + TailwindCSS.

## Uso rapido

```bash
git clone https://github.com/venpu-tech/create-automotora-site.git
cd create-automotora-site

# Con archivo de configuracion
node bin/create-site.js --config examples/config.example.json

# Modo interactivo
node bin/create-site.js
```

## Opciones

| Flag | Descripcion |
|------|-------------|
| `--config <ruta>` | Ruta al JSON de configuracion del cliente |
| `--output <ruta>` | Directorio destino (default: `./<slug>`) |
| `--help` | Mostrar ayuda |

## Config JSON

Ver `examples/config.example.json` para la referencia completa. Campos obligatorios:

```json
{
  "name": "Nombre del Negocio",
  "slug": "nombre-del-negocio",
  "domain": "www.nombrenegocio.cl"
}
```

Campos opcionales: `slogan`, `colors`, `contact`, `social`, `whatsapp`, `emailService`, `seo`, `testimonials`, `services`, `heroSlides`.

### Colores disponibles

```
red, orange, amber, yellow, lime, green, emerald, teal,
cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose
```

## Post-generacion

1. `cd <slug> && npm install`
2. Configurar `.env` con `PUBLIC_TOKEN`, `RESEND_API_KEY`, `PUBLIC_HCAPTCHA_SITE_KEY`
3. Reemplazar imagenes placeholder (logo, hero slides, servicios)
4. `npm run dev` para desarrollo en localhost:4321
5. Deploy a Vercel

## Para agentes de IA

Ver `CLAUDE.md` para instrucciones detalladas de uso por agentes.
