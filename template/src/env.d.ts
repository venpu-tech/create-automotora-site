/// <reference types="astro/client" />

type Runtime = import("@astrojs/cloudflare").Runtime<Env>;

interface Env {
  VENPU_API_URL: string;
  VENPU_API_KEY: string;
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
}

declare namespace App {
  interface Locals extends Runtime {}
}
