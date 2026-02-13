// src/pages/api/og/[filename].ts
import type { APIRoute } from "astro";

// Indica que esta ruta debe manejarse en tiempo de ejecución (SSR)
export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  console.log("=== OG Image API Called ===");
  console.log("Full params object:", params);
  console.log("Request URL:", request.url);

  const { filename } = params;
  console.log(`Requested filename: ${filename}`);
  console.log(`Filename type: ${typeof filename}`);

  if (!filename) {
    console.log("ERROR: Filename is missing");
    return new Response("Filename missing", { status: 400 });
  }

  // Opcionalmente puedes validar extensión
  const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, "");
  console.log(`Original filename: ${filename}`);
  console.log(`Safe filename: ${safeFilename}`);

  // Verificar si es un archivo local (frontis-autoloa.webp) o de DigitalOcean
  let imageUrl: string;

  if (
    safeFilename === "frontis-autoloa.webp" ||
    safeFilename.includes("frontis-autoloa")
  ) {
    // Para archivos locales, construir URL local completa
    const protocol = request.url.startsWith("https:") ? "https:" : "http:";
    const host = new URL(request.url).host;
    imageUrl = `${protocol}//${host}/${safeFilename}`;
    console.log("Local file detected, using local URL:", imageUrl);
  } else {
    // Para archivos de DigitalOcean, usar la URL original
    imageUrl = `https://venpu-files.nyc3.cdn.digitaloceanspaces.com/283/${safeFilename}`;
    console.log("DigitalOcean file detected, using DO URL:", imageUrl);
  }

  console.log(`Constructed image URL: ${imageUrl}`);

  try {
    console.log("Attempting to fetch image...");
    const response = await fetch(imageUrl);
    console.log(`Fetch response status: ${response.status}`);
    console.log(`Fetch response ok: ${response.ok}`);

    if (!response.ok) {
      console.log("ERROR: Image not found or fetch failed");
      return new Response("Image not found", { status: 404 });
    }

    const buffer = await response.arrayBuffer();
    console.log(`Buffer size: ${buffer.byteLength} bytes`);

    // Detectar content-type basado en la extensión
    let contentType = "image/jpeg"; // por defecto
    if (safeFilename.toLowerCase().endsWith(".webp")) {
      contentType = "image/webp";
    } else if (safeFilename.toLowerCase().endsWith(".png")) {
      contentType = "image/png";
    } else if (safeFilename.toLowerCase().endsWith(".gif")) {
      contentType = "image/gif";
    }

    console.log("Successfully returning image with headers:", {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000",
    });

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (err) {
    console.log("CATCH ERROR:", err);
    return new Response("Error fetching image", { status: 500 });
  }
};
