import { Link } from "react-router";
import type { Route } from "./+types/$";

export const loader = () => {
  throw new Response("Không tìm thấy trang", { status: 404 });
};

export const meta: Route.MetaFunction = () => [
  { title: "404 Không tìm thấy trang · Lê Thùy Trang" },
];

export default function NotFoundRoute() {
  return (
    <main className="pf-hero">
      <div className="wrap">
        <div className="glass" style={{ padding: "48px", borderRadius: "32px", maxWidth: "640px" }}>
          <p className="sec-kicker">404</p>
          <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", margin: "12px 0 16px" }}>
            Không tìm thấy trang bạn cần
          </h1>
          <p className="lead" style={{ marginBottom: "24px" }}>
            Đường dẫn này không tồn tại hoặc đã được chuyển đi. Bạn có thể quay về trang chính để xem toàn bộ hồ sơ của tôi.
          </p>
          <Link to="/" className="pf-btn pf-btn-dark">
            Về trang portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}
