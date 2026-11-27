import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { Aura } from "~/components/layout/LayoutChrome";
import { ToastProvider } from "~/components/ui/ToastProvider";
import { TooltipProvider } from "~/components/ui/TooltipProvider";
import { usePointerGlassLight, useReveal } from "~/hooks/useMotion";
import appStylesHref from "~/styles/app.css?url";
import type { Route } from "./+types/root";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
  {
    rel: "preload",
    as: "image",
    href: "/media/hero/portrait.webp",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Aura />
        <TooltipProvider>
          <ToastProvider>{children}</ToastProvider>
        </TooltipProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  useReveal();
  usePointerGlassLight();
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let status = 500;
  let title = "Đã xảy ra lỗi không mong muốn";
  let detail = "Vui lòng tải lại trang hoặc quay về trang chính.";

  if (isRouteErrorResponse(error)) {
    status = error.status;
    if (error.status === 404) {
      title = "Không tìm thấy trang bạn cần";
      detail =
        "Đường dẫn này không tồn tại hoặc đã được chuyển đi. Bạn có thể quay về trang chính để xem toàn bộ hồ sơ của tôi.";
    } else {
      detail = error.statusText || detail;
    }
  }

  return (
    <main className="pf-hero">
      <div className="wrap">
        <div
          className="glass"
          style={{ padding: "48px", borderRadius: "32px", maxWidth: "640px" }}
        >
          <p className="sec-kicker">{status}</p>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", margin: "12px 0 16px" }}>
            {title}
          </h1>
          <p className="lead" style={{ marginBottom: "24px" }}>
            {detail}
          </p>
          <Link to="/" className="pf-btn pf-btn-dark">
            Về trang portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}
