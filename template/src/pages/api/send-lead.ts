import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  const { env } = (locals as any).runtime;

  try {
    const data = await request.json();

    const { name, email, phone, message } = data;
    const turnstileToken = data["cf-turnstile-response"];

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
        turnstileToken: turnstileToken || undefined,
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
