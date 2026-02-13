#!/usr/bin/env node

/**
 * CLI Generador de Sitios Web para Automotoras
 * @venpu-tech/create-automotora-site
 *
 * Uso:
 *   node bin/create-site.js --config <config.json> [--output <directorio>]
 *   node bin/create-site.js  (modo interactivo)
 *
 * Genera un sitio web de automotora a partir del template incluido,
 * aplicando personalizaciones segun la configuracion proporcionada.
 */

import fs from "fs/promises";
import path from "path";
import { createInterface } from "readline";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, "..");
const TEMPLATE_DIR = path.join(PKG_ROOT, "template");
const EXCLUDE = new Set([
  "node_modules",
  ".astro",
  "dist",
  ".env",
  "package-lock.json",
  ".git",
  "site.config.json",
]);

// ═══════════════════════════════════════════════════════
// TAILWIND COLOR PALETTE (v4)
// ═══════════════════════════════════════════════════════
const TAILWIND_COLORS = {
  red: { 50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a" },
  orange: { 50:"#fff7ed",100:"#ffedd5",200:"#fed7aa",300:"#fdba74",400:"#fb923c",500:"#f97316",600:"#ea580c",700:"#c2410c",800:"#9a3412",900:"#7c2d12",950:"#431407" },
  amber: { 50:"#fffbeb",100:"#fef3c7",200:"#fde68a",300:"#fcd34d",400:"#fbbf24",500:"#f59e0b",600:"#d97706",700:"#b45309",800:"#92400e",900:"#78350f",950:"#451a03" },
  yellow: { 50:"#fefce8",100:"#fef9c3",200:"#fef08a",300:"#fde047",400:"#facc15",500:"#eab308",600:"#ca8a04",700:"#a16207",800:"#854d0e",900:"#713f12",950:"#422006" },
  lime: { 50:"#f7fee7",100:"#ecfccb",200:"#d9f99d",300:"#bef264",400:"#a3e635",500:"#84cc16",600:"#65a30d",700:"#4d7c0f",800:"#3f6212",900:"#365314",950:"#1a2e05" },
  green: { 50:"#f0fdf4",100:"#dcfce7",200:"#bbf7d0",300:"#86efac",400:"#4ade80",500:"#22c55e",600:"#16a34a",700:"#15803d",800:"#166534",900:"#14532d",950:"#052e16" },
  emerald: { 50:"#ecfdf5",100:"#d1fae5",200:"#a7f3d0",300:"#6ee7b7",400:"#34d399",500:"#10b981",600:"#059669",700:"#047857",800:"#065f46",900:"#064e3b",950:"#022c22" },
  teal: { 50:"#f0fdfa",100:"#ccfbf1",200:"#99f6e4",300:"#5eead4",400:"#2dd4bf",500:"#14b8a6",600:"#0d9488",700:"#0f766e",800:"#115e59",900:"#134e4a",950:"#042f2e" },
  cyan: { 50:"#ecfeff",100:"#cffafe",200:"#a5f3fc",300:"#67e8f9",400:"#22d3ee",500:"#06b6d4",600:"#0891b2",700:"#0e7490",800:"#155e75",900:"#164e63",950:"#083344" },
  sky: { 50:"#f0f9ff",100:"#e0f2fe",200:"#bae6fd",300:"#7dd3fc",400:"#38bdf8",500:"#0ea5e9",600:"#0284c7",700:"#0369a1",800:"#075985",900:"#0c4a6e",950:"#082f49" },
  blue: { 50:"#eff6ff",100:"#dbeafe",200:"#bfdbfe",300:"#93c5fd",400:"#60a5fa",500:"#3b82f6",600:"#2563eb",700:"#1d4ed8",800:"#1e40af",900:"#1e3a8a",950:"#172554" },
  indigo: { 50:"#eef2ff",100:"#e0e7ff",200:"#c7d2fe",300:"#a5b4fc",400:"#818cf8",500:"#6366f1",600:"#4f46e5",700:"#4338ca",800:"#3730a3",900:"#312e81",950:"#1e1b4b" },
  violet: { 50:"#f5f3ff",100:"#ede9fe",200:"#ddd6fe",300:"#c4b5fd",400:"#a78bfa",500:"#8b5cf6",600:"#7c3aed",700:"#6d28d9",800:"#5b21b6",900:"#4c1d95",950:"#2e1065" },
  purple: { 50:"#faf5ff",100:"#f3e8ff",200:"#e9d5ff",300:"#d8b4fe",400:"#c084fc",500:"#a855f7",600:"#9333ea",700:"#7e22ce",800:"#6b21a8",900:"#581c87",950:"#3b0764" },
  fuchsia: { 50:"#fdf4ff",100:"#fae8ff",200:"#f5d0fe",300:"#f0abfc",400:"#e879f9",500:"#d946ef",600:"#c026d3",700:"#a21caf",800:"#86198f",900:"#701a75",950:"#4a044e" },
  pink: { 50:"#fdf2f8",100:"#fce7f3",200:"#fbcfe8",300:"#f9a8d4",400:"#f472b6",500:"#ec4899",600:"#db2777",700:"#be185d",800:"#9d174d",900:"#831843",950:"#500724" },
  rose: { 50:"#fff1f2",100:"#ffe4e6",200:"#fecdd3",300:"#fda4af",400:"#fb7185",500:"#f43f5e",600:"#e11d48",700:"#be123c",800:"#9f1239",900:"#881337",950:"#4c0519" },
};

const SOURCE_COLOR = "red";

// ═══════════════════════════════════════════════════════
// ARGUMENT PARSING
// ═══════════════════════════════════════════════════════
function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--config" && args[i + 1]) {
      result.config = args[i + 1];
      i++;
    } else if (args[i] === "--output" && args[i + 1]) {
      result.output = args[i + 1];
      i++;
    } else if (args[i] === "--help" || args[i] === "-h") {
      printHelp();
      process.exit(0);
    }
  }
  return result;
}

function printHelp() {
  console.log(`
  CLI Generador de Sitios Web - Automotoras
  @venpu-tech/create-automotora-site
  ==========================================

  Uso:
    node bin/create-site.js --config <config.json> [--output <directorio>]
    node bin/create-site.js  (modo interactivo)

  Opciones:
    --config <ruta>     Ruta al archivo de configuracion JSON
    --output <ruta>     Directorio donde crear el proyecto (default: ./<slug>)
    --help, -h          Mostrar esta ayuda

  Ejemplo:
    node bin/create-site.js --config examples/config.example.json
    node bin/create-site.js --config mi-cliente.json --output /ruta/destino/mi-cliente

  Colores disponibles:
    ${Object.keys(TAILWIND_COLORS).join(", ")}
`);
}

// ═══════════════════════════════════════════════════════
// CONFIG VALIDATION & DEFAULTS
// ═══════════════════════════════════════════════════════
function validateConfig(config) {
  const required = ["name", "slug", "domain"];
  const missing = required.filter((k) => !config[k]);
  if (missing.length > 0) {
    console.error(`Error: Campos obligatorios faltantes: ${missing.join(", ")}`);
    process.exit(1);
  }

  if (config.colors?.tailwind && !TAILWIND_COLORS[config.colors.tailwind]) {
    console.error(
      `Error: Color "${config.colors.tailwind}" no valido.\nDisponibles: ${Object.keys(TAILWIND_COLORS).join(", ")}`
    );
    process.exit(1);
  }

  // Defaults
  config.colors = config.colors || {};
  config.colors.tailwind = config.colors.tailwind || "red";
  config.contact = config.contact || {};
  config.contact.phones = config.contact.phones || [];
  config.contact.emails = config.contact.emails || [];
  config.contact.hours = config.contact.hours || {};
  config.social = config.social || {};
  config.whatsapp = config.whatsapp || {};
  config.emailService = config.emailService || {
    to: config.contact.emails.slice(0, 1),
    cc: [],
  };
  config.seo = config.seo || {};
  config.testimonials = config.testimonials || [];
  config.services = config.services || [];
  config.heroSlides = config.heroSlides || [];

  return config;
}

// ═══════════════════════════════════════════════════════
// INTERACTIVE PROMPT
// ═══════════════════════════════════════════════════════
async function interactivePrompt() {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

  console.log("\n  Nuevo Sitio Web - Configuracion Inicial");
  console.log("  ========================================\n");

  // Identity
  console.log("--- IDENTIDAD ---");
  const name = await ask("  Nombre del negocio: ");
  const defaultSlug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  const slug = (await ask(`  Slug [${defaultSlug}]: `)) || defaultSlug;
  const domain = (await ask(`  Dominio [www.${slug}.cl]: `)) || `www.${slug}.cl`;
  const slogan = await ask("  Slogan (opcional): ");

  // Colors
  console.log("\n--- COLOR PRINCIPAL ---");
  console.log("  Disponibles: " + Object.keys(TAILWIND_COLORS).join(", "));
  const color = (await ask("  Color [red]: ")) || "red";

  // Contact
  console.log("\n--- CONTACTO ---");
  const address = await ask("  Direccion: ");
  const phonesRaw = await ask("  Telefonos (separados por coma): ");
  const phones = phonesRaw
    ? phonesRaw.split(",").map((p) => p.trim())
    : [];
  const emailsRaw = await ask("  Emails (separados por coma): ");
  const emails = emailsRaw
    ? emailsRaw.split(",").map((e) => e.trim())
    : [];
  const hoursWeek =
    (await ask("  Horario L-V [Lun - Vie: 10:00 - 19:00]: ")) ||
    "Lun - Vie: 10:00 - 19:00";
  const hoursSat =
    (await ask("  Horario Sab [Sab: 10:00 - 14:00]: ")) ||
    "Sab: 10:00 - 14:00";

  // Social
  console.log("\n--- REDES SOCIALES ---");
  const facebook = await ask("  URL Facebook: ");
  const instagram = await ask("  URL Instagram: ");
  const whatsappNum = await ask("  Numero WhatsApp (con codigo pais): ");
  const whatsappMsg =
    (await ask("  Mensaje WhatsApp [Hola, en que te podemos ayudar?]: ")) ||
    "Hola, en que te podemos ayudar?";

  // Email
  console.log("\n--- FORMULARIO DE CONTACTO ---");
  const emailTo =
    (await ask(`  Email destinatario [${emails[0] || ""}]: `)) ||
    emails[0] ||
    "";
  const emailCc = await ask("  Email CC (opcional): ");

  // Map
  const mapEmbed = await ask("\n  URL Google Maps embed (opcional): ");

  rl.close();

  return {
    name,
    slug,
    domain,
    slogan: slogan || "Tu automotora de confianza",
    colors: { tailwind: color },
    contact: {
      address,
      phones,
      emails,
      hours: { weekdays: hoursWeek, saturday: hoursSat },
      mapEmbed: mapEmbed || "",
    },
    social: { facebook, instagram },
    whatsapp: { number: whatsappNum, message: whatsappMsg },
    emailService: {
      to: emailTo ? [emailTo] : emails.slice(0, 1),
      cc: emailCc ? [emailCc] : [],
    },
    seo: {
      home: {
        title: `${name} - Compra y venta de vehiculos`,
        description: `Compra y vende vehiculos con confianza en ${name}.`,
      },
      catalog: {
        title: `Catalogo - ${name}`,
        description: `Explora el catalogo de vehiculos de ${name}.`,
      },
      contact: {
        title: `Contacto - ${name}`,
        description: `Contactanos en ${name}.`,
      },
      about: {
        title: `Nosotros - ${name}`,
        description: `Conoce mas sobre ${name}.`,
      },
    },
    testimonials: [],
    services: [],
    heroSlides: [],
  };
}

// ═══════════════════════════════════════════════════════
// COPY DIRECTORY (recursive, excluding unwanted)
// ═══════════════════════════════════════════════════════
async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    if (EXCLUDE.has(entry.name)) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

// ═══════════════════════════════════════════════════════
// COLOR REPLACEMENT UTILITIES
// ═══════════════════════════════════════════════════════
function getColorReplacements(targetColor) {
  if (targetColor === SOURCE_COLOR) return { classes: {}, hexes: {} };

  const src = TAILWIND_COLORS[SOURCE_COLOR];
  const tgt = TAILWIND_COLORS[targetColor];

  const hexes = {};
  const classes = {};

  for (const shade of Object.keys(src)) {
    hexes[src[shade]] = tgt[shade];
    classes[`red-${shade}`] = `${targetColor}-${shade}`;
  }

  // Extra hardcoded hex in global.css
  hexes["#ff3c00"] = tgt[600];

  return { classes, hexes };
}

function applyColorReplacements(content, colorReplacements) {
  let result = content;

  for (const [oldHex, newHex] of Object.entries(colorReplacements.hexes)) {
    result = result.replaceAll(oldHex, newHex);
    result = result.replaceAll(oldHex.toUpperCase(), newHex.toUpperCase());
  }

  for (const [oldClass, newClass] of Object.entries(colorReplacements.classes)) {
    result = result.replaceAll(oldClass, newClass);
  }

  return result;
}

// ═══════════════════════════════════════════════════════
// FILE HELPERS
// ═══════════════════════════════════════════════════════
async function readFile(filePath) {
  return fs.readFile(filePath, "utf-8");
}

async function writeFile(filePath, content) {
  await fs.writeFile(filePath, content, "utf-8");
}

async function transformFile(filePath, fn) {
  const content = await readFile(filePath);
  const result = fn(content);
  await writeFile(filePath, result);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════
// FILE TRANSFORMATIONS
// ═══════════════════════════════════════════════════════

async function transformPackageJson(dir, config) {
  await transformFile(path.join(dir, "package.json"), (content) => {
    const pkg = JSON.parse(content);
    pkg.name = config.slug;
    return JSON.stringify(pkg, null, 2) + "\n";
  });
}

async function transformLayout(dir, config) {
  await transformFile(
    path.join(dir, "src", "layouts", "Layout.astro"),
    (content) => {
      // Production domain
      content = content.replace(
        "'https://www.autoloa.cl'",
        `'https://${config.domain}'`
      );
      // Remove debug console.logs
      content = content
        .split("\n")
        .filter((line) => !line.trim().startsWith("console.log("))
        .join("\n");
      return content;
    }
  );
}

async function transformNavbar(dir, config) {
  await transformFile(
    path.join(dir, "src", "components", "navbar", "Navbar.astro"),
    (content) => {
      content = content.replace("/logowildars.webp", "/logo.webp");
      content = content.replace("Wildcars Logo", `${config.name} Logo`);

      if (config.social.facebook) {
        content = content.replace(
          /href:\s*"https:\/\/web\.facebook\.com\/[^"]*"/,
          `href: "${config.social.facebook}"`
        );
      }
      if (config.social.instagram) {
        content = content.replace(
          /href:\s*"https:\/\/www\.instagram\.com\/[^"]*"/,
          `href: "${config.social.instagram}"`
        );
      }
      return content;
    }
  );
}

async function transformFooter(dir, config) {
  await transformFile(
    path.join(dir, "src", "components", "footer", "Footer.astro"),
    (content) => {
      // Social links
      if (config.social.facebook) {
        content = content.replace(
          /href:\s*"https:\/\/web\.facebook\.com\/[^"]*"/,
          `href: "${config.social.facebook}"`
        );
      }
      if (config.social.instagram) {
        content = content.replace(
          /href:\s*"https:\/\/www\.instagram\.com\/[^"]*"/,
          `href: "${config.social.instagram}"`
        );
      }

      // Contact info array
      if (
        config.contact.address ||
        config.contact.phones.length ||
        config.contact.emails.length
      ) {
        const entries = [];

        if (config.contact.address) {
          const mapLink = config.contact.mapEmbed || "#";
          entries.push(`    {
        type: "Direccion",
        value: "${config.contact.address}",
        icon: "fas fa-map-marker-alt",
        link: "${mapLink}",
        isExternal: true
    }`);
        }

        for (const phone of config.contact.phones) {
          const clean = phone.replace(/\s/g, "");
          entries.push(`    {
        type: "Telefono",
        value: "${phone}",
        icon: "fas fa-phone",
        link: "tel:${clean}",
        isExternal: false
    }`);
        }

        for (const email of config.contact.emails) {
          entries.push(`    {
        type: "Correo",
        value: "${email}",
        icon: "fas fa-envelope",
        link: "mailto:${email}",
        isExternal: false
    }`);
        }

        const newContactInfo = `const contactInfo = [\n${entries.join(",\n")}\n];`;
        content = content.replace(
          /const contactInfo = \[[\s\S]*?\];/,
          newContactInfo
        );
      }

      // Brand name
      content = content.replaceAll('Wildcars - Automotora', config.name);
      content = content.replaceAll(">Wildcars<", `>${config.name}<`);

      // Copyright
      const year = new Date().getFullYear();
      content = content.replace(
        /© \d{4} .+?\. Todos los derechos reservados\./,
        `\u00A9 ${year} ${config.name}. Todos los derechos reservados.`
      );

      return content;
    }
  );
}

async function transformHamburger(dir, config) {
  await transformFile(
    path.join(dir, "src", "components", "hamburger-menu", "Hamburger.astro"),
    (content) => {
      content = content.replace(">Wild Cars<", `>${config.name}<`);
      return content;
    }
  );
}

async function transformHero(dir, config) {
  await transformFile(
    path.join(dir, "src", "components", "hero-slider", "Hero.tsx"),
    (content) => {
      if (config.heroSlides && config.heroSlides.length > 0) {
        const defaultAlts = [
          "Interior moderno de automovil",
          "Automovil de lujo en carretera",
          "Concesionario de automoviles",
          "Auto electrico cargando",
          "Llaves de automovil",
        ];

        const slides = config.heroSlides.map(
          (slide, i) => `  {
    src: slide0${i + 1}.src,
    alt: "${slide.alt || defaultAlts[i] || "Vehiculo"}",
    title: "${slide.title}",
    subtitle: "${slide.subtitle}",
  }`
        );

        content = content.replace(
          /const slideImages: SlideData\[\] = \[[\s\S]*?\];/,
          `const slideImages: SlideData[] = [\n${slides.join(",\n")}\n];`
        );
      } else {
        content = content.replaceAll("En Wild Cars", `En ${config.name}`);
      }
      return content;
    }
  );
}

async function transformTestimonials(dir, config) {
  if (!config.testimonials || config.testimonials.length === 0) return;

  await transformFile(
    path.join(dir, "src", "components", "testimonials", "Testimonials.astro"),
    (content) => {
      const entries = config.testimonials.map((t) => {
        const initials = t.name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .substring(0, 2)
          .toUpperCase();
        const escaped = t.text.replace(/"/g, '\\"').replace(/`/g, "\\`");
        return `    {
        name: "${t.name}",
        description: "${escaped}",
        rating: ${t.rating || 5},
        avatar: "${initials}"
    }`;
      });

      content = content.replace(
        /const testimonials: Testimonial\[\] = \[[\s\S]*?\];/,
        `const testimonials: Testimonial[] = [\n${entries.join(",\n")}\n];`
      );
      return content;
    }
  );
}

async function transformServices(dir, config) {
  if (!config.services || config.services.length === 0) return;

  await transformFile(
    path.join(dir, "src", "components", "service-cars", "Services.astro"),
    (content) => {
      const entries = config.services.map(
        (s, i) => `  {
    img: '${s.image || `/image-service-0${i + 1}.webp`}',
    title: '${s.title}',
    desc: '${s.description}'
  }`
      );

      content = content.replace(
        /const services = \[[\s\S]*?\];/,
        `const services = [\n${entries.join(",\n")}\n];`
      );
      return content;
    }
  );
}

async function transformContactPage(dir, config) {
  await transformFile(
    path.join(dir, "src", "pages", "contacto.astro"),
    (content) => {
      // SEO meta
      if (config.seo.contact) {
        content = content.replace(
          /title="Contacto[^"]*"/,
          `title="${config.seo.contact.title}"`
        );
        content = content.replace(
          /description="Estamos aqu[^"]*"/,
          `description="${config.seo.contact.description}"`
        );
      }

      // Phones - replace known values
      const oldPhones = [
        "+56 9 4073 1529",
        "+56 9 7373 4208",
        "+56 9 4207 9452",
      ];
      oldPhones.forEach((old, i) => {
        if (config.contact.phones[i]) {
          content = content.replaceAll(old, config.contact.phones[i]);
        }
      });

      // Emails - replace known values
      const oldEmails = [
        "linaarevalo.copayapu@gmail.com",
        "estefaniacortes.copayapu@gmail.com",
        "paolagalan.copayapu@gmail.com",
      ];
      oldEmails.forEach((old, i) => {
        if (config.contact.emails[i]) {
          content = content.replaceAll(old, config.contact.emails[i]);
        }
      });

      // Address
      if (config.contact.address) {
        content = content.replace(
          "Avda. Balmaceda N\u00B04415, La Serena.",
          config.contact.address
        );
      }

      // Business hours
      if (config.contact.hours?.weekdays && config.contact.hours?.saturday) {
        content = content.replace(
          "Lun - Vie: 10:00 - 19:00<br>S\u00E1b: 10:00 - 14:00",
          `${config.contact.hours.weekdays}<br>${config.contact.hours.saturday}`
        );
      }

      // Google Maps embed
      if (config.contact.mapEmbed) {
        content = content.replace(
          /src="https:\/\/www\.google\.com\/maps\/embed[^"]*"/,
          `src="${config.contact.mapEmbed}"`
        );
      }

      return content;
    }
  );
}

async function transformNosotros(dir, config) {
  await transformFile(
    path.join(dir, "src", "pages", "nosotros.astro"),
    (content) => {
      // SEO
      if (config.seo.about) {
        content = content.replace(
          /title="Nosotros - [^"]*"/,
          `title="${config.seo.about.title}"`
        );
        content = content.replace(
          /description="Conoce m[^"]*"/,
          `description="${config.seo.about.description}"`
        );
      }

      // Company name replacements (order matters - most specific first)
      content = content.replaceAll("Automotriz Copayapu", config.name);
      content = content.replaceAll("Copayapu Automotriz", config.name);
      content = content.replaceAll("Wildcars", config.name);
      content = content.replaceAll("Wild Cars", config.name);

      // Slogan
      if (config.slogan) {
        content = content.replace(
          "Bienvenido a la experiencia Wildcars. Donde los buenos autos encuentran buenos dueños.",
          config.slogan
        );
      }

      // About text (replaces the main paragraph if provided)
      if (config.aboutText) {
        content = content.replace(
          /En <strong>[^<]*<\/strong>[^<]*trabajamos con transparencia[\s\S]*?calidad\./,
          config.aboutText
        );
      }

      return content;
    }
  );
}

async function transformIndex(dir, config) {
  await transformFile(
    path.join(dir, "src", "pages", "index.astro"),
    (content) => {
      if (config.seo.home) {
        content = content.replace(
          /title="Automotriz Copayapu[^"]*"/,
          `title="${config.seo.home.title}"`
        );
        content = content.replace(
          /description="Compra y vende[^"]*"/,
          `description="${config.seo.home.description}"`
        );
      }
      return content;
    }
  );
}

async function transformCatalogo(dir, config) {
  await transformFile(
    path.join(dir, "src", "pages", "catalogo.astro"),
    (content) => {
      if (config.seo.catalog) {
        content = content.replace(
          /title="Cat[^"]*"/,
          `title="${config.seo.catalog.title}"`
        );
        content = content.replace(
          /description="Cat[^"]*"/,
          `description="${config.seo.catalog.description}"`
        );
      }
      return content;
    }
  );
}

async function transformSendEmail(dir, config) {
  await transformFile(
    path.join(dir, "src", "pages", "api", "send-email.ts"),
    (content) => {
      if (config.emailService.to?.length > 0) {
        content = content.replace(
          /to: \["[^"]*"\]/,
          `to: ${JSON.stringify(config.emailService.to)}`
        );
      }

      if (config.emailService.cc?.length > 0) {
        content = content.replace(
          /cc: \[.*?\],?.*$/m,
          `cc: ${JSON.stringify(config.emailService.cc)},`
        );
      } else {
        content = content.replace(/\s*cc: \[.*?\],?.*$/m, "");
      }

      return content;
    }
  );
}

async function transformWhatsapp(dir, config) {
  if (!config.whatsapp.number) return;

  await transformFile(
    path.join(dir, "src", "components", "whatsapp-button", "Whatsapp.astro"),
    (content) => {
      content = content.replace(
        /const whatsappNumber = '[^']*'/,
        `const whatsappNumber = '${config.whatsapp.number}'`
      );
      if (config.whatsapp.message) {
        content = content.replace(
          /const defaultMessage = '[^']*'/,
          `const defaultMessage = '${config.whatsapp.message}'`
        );
      }
      return content;
    }
  );
}

// ═══════════════════════════════════════════════════════
// GLOBAL COLOR REPLACEMENT (all text files)
// ═══════════════════════════════════════════════════════
async function applyGlobalColors(dir, colorReplacements) {
  if (Object.keys(colorReplacements.hexes).length === 0) return;

  const textExts = new Set([
    ".astro", ".tsx", ".ts", ".jsx", ".js", ".css", ".html",
  ]);

  async function walk(dirPath) {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (EXCLUDE.has(entry.name)) continue;
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (textExts.has(ext)) {
          const content = await readFile(fullPath);
          const transformed = applyColorReplacements(content, colorReplacements);
          if (transformed !== content) {
            await writeFile(fullPath, transformed);
          }
        }
      }
    }
  }

  await walk(dir);
}

// ═══════════════════════════════════════════════════════
// ENV FILE
// ═══════════════════════════════════════════════════════
async function createEnvFile(dir, turnstileKeys) {
  let content = `VENPU_API_URL="https://api.venpu.cl"\nVENPU_API_KEY=""\nRESEND_API_KEY=""\n`;
  if (turnstileKeys) {
    content += `PUBLIC_TURNSTILE_SITE_KEY="${turnstileKeys.sitekey}"\nTURNSTILE_SECRET_KEY="${turnstileKeys.secret}"\n`;
  } else {
    content += `PUBLIC_TURNSTILE_SITE_KEY=""\nTURNSTILE_SECRET_KEY=""\n`;
  }
  await writeFile(path.join(dir, ".env"), content);
}

// ═══════════════════════════════════════════════════════
// CLOUDFLARE TURNSTILE WIDGET CREATION
// ═══════════════════════════════════════════════════════
async function createTurnstileWidget(config) {
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;

  if (!apiToken || !accountId) {
    console.log("    (Omitido: CLOUDFLARE_API_TOKEN o CLOUDFLARE_ACCOUNT_ID no disponibles)");
    return null;
  }

  const domain = config.domain.replace(/^www\./, "");
  const domains = [domain, `www.${domain}`, `${config.slug}.pages.dev`];

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/challenges/widgets`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: config.name,
          domains,
          mode: "managed",
          bot_fight_mode: false,
        }),
      }
    );

    const json = await res.json();
    if (!json.success) {
      console.log(`    Error creando widget: ${JSON.stringify(json.errors)}`);
      return null;
    }

    console.log(`    Widget creado: ${json.result.sitekey}`);
    console.log(`    Dominios: ${domains.join(", ")}`);
    return {
      sitekey: json.result.sitekey,
      secret: json.result.secret,
    };
  } catch (err) {
    console.log(`    Error de red: ${err.message}`);
    return null;
  }
}

// ═══════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════
function printSummary(config) {
  const notes = [];

  if (!config.testimonials?.length) {
    notes.push(
      "- Testimonios: sin datos, editar src/components/testimonials/Testimonials.astro"
    );
  }
  if (!config.heroSlides?.length) {
    notes.push(
      "- Hero slider: textos por defecto, editar src/components/hero-slider/Hero.tsx"
    );
  }
  if (!config.services?.length) {
    notes.push(
      "- Servicios: valores por defecto, editar src/components/service-cars/Services.astro"
    );
  }

  console.log(`
  ==========================================
  Sitio creado exitosamente!
  ==========================================

  Proyecto:   ${config.name}
  Directorio: ${config.slug}/
  Dominio:    ${config.domain}
  Color:      ${config.colors.tailwind}

  Proximos pasos:
    cd ${config.slug}
    npm install
    # Configurar variables en .env (VENPU_API_KEY, RESEND_API_KEY)
    npm run dev

  Imagenes por reemplazar:
    public/logo.webp              Logo principal (navbar + footer)
    src/assets/slide-01..05.jpg   Imagenes del hero slider
    public/image-service-0*.webp  Imagenes de servicios
    public/frontis*.webp          Fotos del local / OG images
${notes.length > 0 ? "\n  Pendiente de personalizar:\n  " + notes.join("\n  ") : ""}
  Configuracion guardada en: ${config.slug}/site.config.json
  `);
}

// ═══════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════
async function main() {
  const args = parseArgs();

  // Verify template exists
  if (!(await fileExists(TEMPLATE_DIR))) {
    console.error(
      `Error: No se encontro el template en ${TEMPLATE_DIR}\nAsegurate de que el proyecto wildcars existe.`
    );
    process.exit(1);
  }

  let config;
  if (args.config) {
    const configPath = path.resolve(args.config);
    if (!(await fileExists(configPath))) {
      console.error(`Error: No se encontro el archivo ${configPath}`);
      process.exit(1);
    }
    const raw = await fs.readFile(configPath, "utf-8");
    config = JSON.parse(raw);
  } else {
    config = await interactivePrompt();
  }

  config = validateConfig(config);

  const destDir = args.output
    ? path.resolve(args.output)
    : path.resolve(process.cwd(), config.slug);

  if (await fileExists(destDir)) {
    console.error(`\nError: El directorio "${config.slug}" ya existe.`);
    process.exit(1);
  }

  console.log(`\n  Creando sitio "${config.name}" en ${config.slug}/...\n`);

  // Step 1: Copy template
  console.log("  [1/6] Copiando template...");
  await copyDir(TEMPLATE_DIR, destDir);

  // Step 2: Apply file-specific transformations
  console.log("  [2/6] Personalizando archivos...");
  await transformPackageJson(destDir, config);
  await transformLayout(destDir, config);
  await transformNavbar(destDir, config);
  await transformFooter(destDir, config);
  await transformHamburger(destDir, config);
  await transformHero(destDir, config);
  await transformTestimonials(destDir, config);
  await transformServices(destDir, config);
  await transformContactPage(destDir, config);
  await transformNosotros(destDir, config);
  await transformIndex(destDir, config);
  await transformCatalogo(destDir, config);
  await transformSendEmail(destDir, config);
  await transformWhatsapp(destDir, config);

  // Step 3: Apply color theme globally
  console.log("  [3/6] Aplicando esquema de colores...");
  const colorReplacements = getColorReplacements(config.colors.tailwind);
  await applyGlobalColors(destDir, colorReplacements);

  // Step 4: Create Turnstile widget (if Cloudflare credentials available)
  console.log("  [4/6] Creando widget Cloudflare Turnstile...");
  const turnstileKeys = await createTurnstileWidget(config);

  // Step 5: Create .env
  console.log("  [5/6] Creando .env...");
  await createEnvFile(destDir, turnstileKeys);

  // Step 6: Save config reference
  console.log("  [6/6] Guardando configuracion...");
  await writeFile(
    path.join(destDir, "site.config.json"),
    JSON.stringify(config, null, 2)
  );

  printSummary(config);
}

main().catch((err) => {
  console.error("\nError:", err.message);
  process.exit(1);
});
