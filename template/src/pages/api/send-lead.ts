import type { APIRoute } from "astro";

export const prerender = false;

const TURNSTILE_SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const POST: APIRoute = async ({ request, locals }) => {
  const { env } = (locals as any).runtime;

  try {
    const data = await request.json();
    const { name, email, phone, message } = data;
    const turnstileToken = data["cf-turnstile-response"];

    // Verify Turnstile token at the edge (anti-spam)
    if (turnstileToken && env.TURNSTILE_SECRET_KEY) {
      const verification = await fetch(TURNSTILE_SITEVERIFY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: turnstileToken,
        }),
      });

      const result = await verification.json() as { success: boolean };

      if (!result.success) {
        return new Response(
          JSON.stringify({ error: "Verificación de seguridad fallida" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Send lead to backend (no turnstile token — already verified)
    const response = await fetch(`${env.VENPU_API_URL}/v1/leads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": env.VENPU_API_KEY,
      },
      body: JSON.stringify({
        name,
        email,
        phone: phone || undefined,
        message: message || undefined,
        source: "web",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: result.message ?? "Error al enviar el mensaje" }),
        { status: response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
