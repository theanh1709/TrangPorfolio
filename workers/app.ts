import { createRequestHandler } from "react-router";

export type AppEnv = {
  DB: D1Database;
  ASSETS: Fetcher;
  MEDIA?: R2Bucket;
  SITE_URL: string;
};

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: AppEnv;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE,
);

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy":
    "default-src 'self'; img-src 'self' data: blob: https:; media-src 'self' blob: https:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; script-src 'self' 'unsafe-inline'; connect-src 'self' https:; frame-ancestors 'self'; base-uri 'self';",
};

export default {
  async fetch(request: Request, env: AppEnv, ctx: ExecutionContext): Promise<Response> {
    const response = await requestHandler(request, {
      cloudflare: { env, ctx },
    });

    const contentType = response.headers.get("Content-Type") ?? "";
    if (contentType.includes("text/html")) {
      const headers = new Headers(response.headers);
      for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
        if (!headers.has(key)) {
          headers.set(key, value);
        }
      }
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  },
} satisfies ExportedHandler<AppEnv>;
