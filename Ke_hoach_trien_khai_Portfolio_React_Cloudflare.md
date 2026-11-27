# Kế hoạch triển khai: Portfolio Lê Thùy Trang trên React + Cloudflare

Phiên bản: 27/11/2026. Dùng kèm:
- `Tai_lieu_ky_thuat_Portfolio_LeThuyTrang.md`: nội dung, dữ liệu, hành vi từng phần.
- `Yeu_cau_thiet_ke_UI_Portfolio_LeThuyTrang.md`: token, thành phần, bố cục, chuyển động, responsive.

File này trả lời câu hỏi **làm thế nào**: chọn công nghệ gì, khởi tạo ra sao, tổ chức code theo pattern nào, routing từng trang, lưu dữ liệu ở đâu, kiểm thử và deploy lên Cloudflare.

---

## 0. Quyết định kiến trúc

| Hạng mục | Lựa chọn | Lý do |
| --- | --- | --- |
| Framework | **React Router v7 (framework mode)**, tức Remix cũ | Mỗi URL là một trang thật, render trên server (SSR) hoặc build sẵn (prerender). Không phải SPA. Có template chính thức cho Cloudflare |
| Runtime | **Cloudflare Workers** (static assets + SSR trong cùng một Worker) | Cloudflare hiện khuyến nghị Workers cho app full-stack mới; Pages vẫn dùng được nhưng không phải hướng chính |
| Build tool | Vite + `@cloudflare/vite-plugin` | Đi kèm template, dev local chạy đúng runtime Workers |
| Ngôn ngữ | TypeScript (strict) | Type an toàn cho dữ liệu D1, binding R2, props |
| CSS | **Tailwind CSS v4** + CSS custom properties cho design token | Token nằm ở một chỗ, class gọn, responsive bằng breakpoint |
| Cơ sở dữ liệu | **Cloudflare D1** (SQLite) + **Drizzle ORM** | Lưu nội dung có cấu trúc: kinh nghiệm, dự án, kỹ năng, bài viết, tác phẩm |
| Lưu file (blob) | **Cloudflare R2** | Ảnh, video, PDF. Không mất phí băng thông ra ngoài |
| Kiểm thử | Vitest (unit), Playwright (E2E, responsive, a11y) | |
| CI/CD | GitHub + GitHub Actions (hoặc Workers Builds của Cloudflare) | Preview cho mỗi pull request, deploy khi merge vào `main` |

> **Lưu ý quan trọng về "database R2":** R2 là kho lưu **file** (object storage, kiểu S3), không phải cơ sở dữ liệu dạng bảng. Kế hoạch này dùng:
> - **D1** cho dữ liệu dạng bảng (tương đương "bảng database").
> - **R2** cho ảnh, video, PDF (tương đương "blob storage").
>
> Cả hai đều chạy trên Cloudflare và gắn vào Worker qua binding.

### 0.1 Sơ đồ tổng thể

```text
Trình duyệt
   │  GET /, /du-an/woori, /media/hero.webp …
   ▼
Cloudflare Worker (React Router v7)
   ├── Static assets (JS/CSS đã build, favicon)  ← phục vụ trực tiếp, cache CDN
   ├── Route loader (server) ──► D1 (binding DB): bảng nội dung
   └── Route /media/* ─────────► R2 (binding MEDIA): ảnh, video, PDF
```

### 0.2 Chiến lược render từng trang

| URL | Trang | Cách render |
| --- | --- | --- |
| `/` | Trang chính | Prerender lúc build (đọc D1), tự build lại khi nội dung đổi |
| `/du-an/woori` | Chi tiết Woori Bank | Prerender |
| `/du-an/com-nieu-thien-ly` | Chi tiết Cơm Niêu Thiên Lý | Prerender |
| `/du-an/phu-hung-life` | Chi tiết Phú Hưng Life | Prerender |
| `/thiet-ke/bloomsky` | (tùy chọn) Trang riêng Bloomsky | Prerender |
| `/media/*` | Ảnh, video từ R2 | Resource route, stream từ R2, cache dài hạn |
| `/sitemap.xml`, `/robots.txt` | SEO | Resource route |
| `*` | 404 | SSR, trả mã 404 |

Prerender cho tốc độ tốt nhất: HTML có sẵn trên CDN, mỗi trang vẫn là một URL thật. Nếu sau này cần nội dung đổi mà không build lại, chuyển trang đó sang SSR (đọc D1 mỗi request, cache bằng `Cache-Control`). Không cần sửa component.

---

## 1. Chuẩn bị môi trường

| Công cụ | Phiên bản tối thiểu | Ghi chú |
| --- | --- | --- |
| Node.js | 20 LTS trở lên (khuyên dùng 22 LTS) | `node -v` |
| pnpm | 9+ | `npm i -g pnpm` (có thể dùng npm, lệnh tương ứng) |
| Git | Bất kỳ bản mới | |
| Tài khoản Cloudflare | Gói Free đủ dùng để bắt đầu | Bật R2 trong dashboard (cần thêm phương thức thanh toán, có hạn mức miễn phí) |
| VS Code | Extension: ESLint, Prettier, Tailwind CSS IntelliSense | |

Đăng nhập Cloudflare cho Wrangler (CLI của Cloudflare):

```bash
pnpm dlx wrangler login
```

---

## 2. Khởi tạo dự án

### 2.1 Tạo project từ template chính thức

```bash
pnpm create cloudflare@latest portfolio-le-thuy-trang --framework=react-router
cd portfolio-le-thuy-trang
```

Khi wizard hỏi:
- Dùng TypeScript: **Yes**.
- Dùng git: **Yes**.
- Deploy ngay: **No** (deploy sau khi cấu hình xong).

### 2.2 Kiểm tra chạy được

```bash
pnpm install
pnpm dev          # http://localhost:5173
```

### 2.3 Cài thư viện

```bash
# Giao diện và tiện ích
pnpm add clsx tailwind-merge tailwind-variants
pnpm add @fontsource/poppins @fontsource/roboto

# Cơ sở dữ liệu
pnpm add drizzle-orm
pnpm add -D drizzle-kit

# Kiểm tra dữ liệu đầu vào (loader, script import)
pnpm add zod

# CSS
pnpm add -D tailwindcss @tailwindcss/vite

# Chất lượng code
pnpm add -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-jsx-a11y prettier prettier-plugin-tailwindcss

# Kiểm thử
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
pnpm add -D @playwright/test @axe-core/playwright
pnpm exec playwright install chromium

# Script xử lý asset (chạy trên máy dev, không vào bundle)
pnpm add -D sharp tsx
```

Không cài thư viện animation. Mọi chuyển động làm bằng CSS transition/keyframes và một vài hook nhỏ, đúng yêu cầu thiết kế. Không dùng thư viện UI kit, vì thành phần đã được đặc tả riêng.

### 2.4 Bật Tailwind v4

`vite.config.ts`:

```ts
import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
```

> Giữ nguyên thứ tự plugin mà template sinh ra; chỉ chèn `tailwindcss()`.

`app/styles/app.css`:

```css
@import "tailwindcss";
@import "./tokens.css";
@import "./glass.css";
@import "./motion.css";
```

### 2.5 Cấu hình TypeScript

Trong `tsconfig.json` bật:
- `"strict": true`
- `"noUncheckedIndexedAccess": true`
- Alias `"paths": { "~/*": ["./app/*"] }`

Sinh type cho binding Cloudflare mỗi khi sửa `wrangler.jsonc`:

```bash
pnpm wrangler types
```

---

## 3. Tạo tài nguyên Cloudflare

### 3.1 D1 (cơ sở dữ liệu)

```bash
pnpm wrangler d1 create portfolio-db
```

Lệnh trả về `database_id`. Ghi vào `wrangler.jsonc`.

### 3.2 R2 (lưu file)

```bash
pnpm wrangler r2 bucket create portfolio-media
pnpm wrangler r2 bucket create portfolio-media-preview   # cho môi trường preview
```

### 3.3 `wrangler.jsonc`

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "portfolio-le-thuy-trang",
  "main": "./workers/app.ts",
  "compatibility_date": "2026-11-01",
  "compatibility_flags": ["nodejs_compat"],
  "observability": { "enabled": true },

  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "portfolio-db",
      "database_id": "<ID trả về ở bước 3.1>",
      "migrations_dir": "drizzle/migrations"
    }
  ],
  "r2_buckets": [
    {
      "binding": "MEDIA",
      "bucket_name": "portfolio-media",
      "preview_bucket_name": "portfolio-media-preview"
    }
  ],
  "vars": {
    "SITE_URL": "https://portfolio.example.com"
  },

  "env": {
    "staging": {
      "name": "portfolio-le-thuy-trang-staging",
      "vars": { "SITE_URL": "https://staging.portfolio.example.com" }
    }
  }
}
```

- `main`, `assets` và các trường khác do template sinh ra thì giữ nguyên.
- Thay `portfolio.example.com` bằng tên miền thật.
- Môi trường `staging` cần D1 và R2 riêng: tạo thêm `portfolio-db-staging` và `portfolio-media-staging`, khai báo lại trong khối `env.staging`.

---

## 4. Cấu trúc thư mục

```text
portfolio-le-thuy-trang/
├─ app/
│  ├─ root.tsx                    # <html>, <head>, font, nav, footer, ErrorBoundary
│  ├─ routes.ts                   # bảng định tuyến (config-based routing)
│  ├─ routes/
│  │  ├─ home.tsx                 # /
│  │  ├─ project.$slug.tsx        # /du-an/:slug
│  │  ├─ media.$.ts               # /media/* (resource route, R2)
│  │  ├─ sitemap[.]xml.ts         # /sitemap.xml
│  │  ├─ robots[.]txt.ts          # /robots.txt
│  │  └─ $.tsx                    # 404
│  ├─ features/                   # mỗi mục của trang = một feature
│  │  ├─ hero/
│  │  │  ├─ Hero.tsx
│  │  │  ├─ HeroName.tsx          # tên tách ký tự, chữ viền + chữ đặc
│  │  │  ├─ RoleChips.tsx
│  │  │  └─ SkillHighlights.tsx
│  │  ├─ experience/  (ExperienceSection, JobCard, EducationCards)
│  │  ├─ projects/    (ProjectsSection, ProjectCard)
│  │  ├─ capabilities/
│  │  ├─ writing/
│  │  ├─ design/      (BloomskyFeature, ChapterFilter, Filmstrip, WorkGrid)
│  │  ├─ contact/
│  │  └─ case-study/  (CaseHero, CaseToc, InfoBox, Stage, Results, BeforeAfter, NextProjects)
│  ├─ components/
│  │  ├─ ui/                      # nguyên tố dùng chung: Button, Pill, Tag, Glass, Section, Tooltip, Dialog, Gallery, Toast
│  │  └─ layout/                  # Nav, Footer, Aura (nền quầng màu)
│  ├─ hooks/                      # useReveal, useScrollSpy, usePointerLight, useTilt, useMagnetic, useCountUp, useReducedMotion
│  ├─ lib/
│  │  ├─ db/
│  │  │  ├─ schema.ts             # bảng Drizzle
│  │  │  ├─ client.ts             # getDb(env)
│  │  │  └─ repositories/         # jobs.ts, projects.ts, skills.ts, posts.ts, works.ts
│  │  ├─ media.ts                 # mediaUrl(key), quy ước key R2
│  │  ├─ seo.ts                   # meta, Open Graph, JSON-LD
│  │  └─ format.ts                # định dạng số vi-VN, ngày
│  ├─ content/                    # văn bản cố định (giới thiệu, nhãn mục) dạng TS
│  └─ styles/
│     ├─ app.css
│     ├─ tokens.css               # CSS custom properties + @theme Tailwind
│     ├─ glass.css                # .glass, ::before, ::after
│     └─ motion.css               # keyframes, .rv, reduced motion
├─ workers/app.ts                 # entry Worker (template sinh ra)
├─ drizzle/
│  ├─ migrations/                 # SQL migration sinh bởi drizzle-kit
│  └─ seed/                       # seed.sql hoặc seed.ts từ tài liệu kỹ thuật
├─ scripts/
│  ├─ prepare-assets.ts           # nén ảnh, tách nền hero, render PDF, nén video
│  └─ upload-media.ts             # đẩy thư mục assets/ lên R2
├─ assets-src/                    # file gốc (không commit file lớn, dùng Git LFS nếu cần)
├─ tests/
│  ├─ unit/
│  └─ e2e/                        # Playwright: responsive, a11y, điều hướng
├─ react-router.config.ts
├─ vite.config.ts
├─ drizzle.config.ts
├─ wrangler.jsonc
└─ playwright.config.ts
```

---

## 5. Design pattern

### 5.1 Tầng kiến trúc

| Tầng | Trách nhiệm | Quy tắc |
| --- | --- | --- |
| **Route** (`app/routes/*`) | Nhận request, gọi `loader` lấy dữ liệu, khai báo `meta`, ghép các feature | Không chứa logic giao diện chi tiết; không gọi D1 trực tiếp |
| **Repository** (`lib/db/repositories`) | Truy vấn D1 qua Drizzle, trả về object đã định kiểu | Mọi SQL nằm ở đây; route chỉ gọi hàm như `getProjects(db)` |
| **Feature** (`app/features/*`) | Một mục của trang (Hero, Experience…) | Nhận dữ liệu qua props, không tự fetch |
| **UI primitive** (`components/ui`) | Nút, pill, kính, tooltip, dialog… | Không biết gì về nội dung portfolio; chỉ nhận props |
| **Hook** (`app/hooks`) | Hành vi trình duyệt: reveal, scrollspy, tilt, đếm số | Tách logic khỏi giao diện; luôn tôn trọng reduced motion |

### 5.2 Các pattern áp dụng

1. **Container / Presentational**
   - Route là container: có loader và dữ liệu.
   - Feature và UI là presentational: chỉ render từ props.
   - Nhờ vậy test và đổi nguồn dữ liệu dễ: D1 hôm nay, CMS ngày mai.
2. **Repository pattern** cho D1.
   - Component không biết SQL.
   - Đổi ORM hay đổi schema chỉ sửa một chỗ.
3. **Compound components** cho thành phần nhiều phần:
   - `<Dialog>`, `<Dialog.Trigger>`, `<Dialog.Content>`.
   - `<Gallery>`, `<Gallery.Item>`, `<Gallery.Nav>`.
   - `<ChapterFilter>` cùng `<Filmstrip>`, chia sẻ state qua context.
4. **Variants bằng `tailwind-variants`**:
   - `button({ intent: "dark" | "ghost" | "accent" })`.
   - `pill({ tone: "glass" | "ink" | "soft" })`.
   - Không nối chuỗi class bằng tay.
5. **Custom hooks** cho mọi hành vi động:
   - `useReveal()` dùng IntersectionObserver.
   - `useScrollSpy(ids)`.
   - `usePointerLight(ref)` cập nhật `--mx/--my`.
   - `useTilt(ref)`, `useMagnetic(ref)`.
   - `useCountUp(value)`.
   - `useReducedMotion()`.
6. **Một tooltip dùng chung (singleton)**:
   - `<TooltipProvider>` ở `root.tsx` giữ một phần tử `#tip`.
   - Phần tử nào cần tooltip thì gọi `useTooltip()` hoặc bọc trong `<Tip content=…>`. Khớp yêu cầu một tooltip duy nhất.
7. **Progressive enhancement**:
   - HTML từ server phải đọc được đầy đủ khi chưa có JS: số liệu có giá trị cuối, nội dung mở rộng vẫn tồn tại trong DOM.
   - JS chỉ thêm chuyển động và tương tác.
8. **Design token là nguồn duy nhất**:
   - `tokens.css` khai báo biến CSS.
   - Khối `@theme` của Tailwind tham chiếu tới chính các biến đó.
   - Không viết mã màu trong component.

### 5.3 Quy ước code
- Component là arrow function, export có tên (không `export default`, trừ file route theo yêu cầu của React Router).
- Dùng `type`, không dùng `interface`. Không `any`.
- Tên file component theo PascalCase. Hook bắt đầu bằng `use`.
- Mỗi component một file, file không quá ~150 dòng; vượt thì tách.

---

## 6. Định tuyến (multi-page, không SPA)

### 6.1 `app/routes.ts`

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("du-an/:slug", "routes/project.$slug.tsx"),
  route("media/*", "routes/media.$.ts"),
  route("sitemap.xml", "routes/sitemap[.]xml.ts"),
  route("robots.txt", "routes/robots[.]txt.ts"),
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
```

### 6.2 `react-router.config.ts`

```ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  async prerender() {
    return [
      "/",
      "/du-an/woori",
      "/du-an/com-nieu-thien-ly",
      "/du-an/phu-hung-life",
    ];
  },
} satisfies Config;
```

- Trang có trong `prerender` được build thành HTML tĩnh.
- Trang không có trong danh sách chạy SSR trong Worker.
- Nếu muốn lấy danh sách slug từ D1 lúc build, dùng D1 qua HTTP API hoặc file seed; danh sách cố định như trên là đủ cho 3 dự án.

### 6.3 Loader đọc D1

```ts
// app/routes/project.$slug.tsx
import type { Route } from "./+types/project.$slug";
import { getDb } from "~/lib/db/client";
import { getProjectBySlug } from "~/lib/db/repositories/projects";
import { CaseStudyPage } from "~/features/case-study/CaseStudyPage";

export const loader = async ({ params, context }: Route.LoaderArgs) => {
  const db = getDb(context.cloudflare.env);
  const project = await getProjectBySlug(db, params.slug);
  if (!project) throw new Response("Không tìm thấy dự án", { status: 404 });
  return { project };
};

export const meta = ({ data }: Route.MetaArgs) => [
  { title: `${data?.project.title} · Lê Thùy Trang` },
  { name: "description", content: data?.project.summary },
];

export default function ProjectRoute({ loaderData }: Route.ComponentProps) {
  return <CaseStudyPage project={loaderData.project} />;
}
```

Tên thuộc tính để lấy binding trong `context` (ví dụ `context.cloudflare.env`) phụ thuộc file `workers/app.ts` của template. Đọc file đó và dùng đúng tên.

### 6.4 Điều hướng giữa trang
- Dùng `<Link>` của React Router: trang đích vẫn là URL thật, F5 hay chia sẻ link đều ra đúng trang. React Router tải trước dữ liệu để chuyển trang mượt.
- Nút "Xem chi tiết dự án" dùng `<Link to="/du-an/woori" target="_blank" rel="noopener">` như yêu cầu mở tab mới.
- Neo trong trang (`#kinh-nghiem`, `#du-an`…) dùng thẻ `<a href="#…">`; bật `scroll-padding-top` để không bị nav che.

### 6.5 Resource route phục vụ R2

```ts
// app/routes/media.$.ts
import type { Route } from "./+types/media.$";

export const loader = async ({ params, request, context }: Route.LoaderArgs) => {
  const key = params["*"];
  const obj = await context.cloudflare.env.MEDIA.get(key, {
    range: request.headers,
    onlyIf: request.headers,
  });
  if (!obj) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set("etag", obj.httpEtag);
  headers.set("cache-control", "public, max-age=31536000, immutable");
  if (!("body" in obj)) return new Response(null, { status: 304, headers });
  return new Response(obj.body, { headers, status: obj.range ? 206 : 200 });
};
```

- Hỗ trợ `Range` để tua video `cntl11.mp4`.
- Đặt tên file có hash (ví dụ `hero.a1b2c3.webp`) để cache vĩnh viễn an toàn.
- Cách thay thế: gắn tên miền riêng cho bucket R2 (ví dụ `media.portfolio.example.com`) và trỏ thẳng ảnh tới đó, không qua Worker.

---

## 7. Dữ liệu: D1 + Drizzle

### 7.1 Schema (`app/lib/db/schema.ts`)

| Bảng | Cột chính | Ghi chú |
| --- | --- | --- |
| `jobs` | `id`, `order`, `years`, `period`, `title`, `company`, `company_tip`, `summary`, `highlights` (JSON), `details` (JSON) | 4 vị trí |
| `education` | `id`, `order`, `school`, `degree`, `years`, `tip` | 2 dòng |
| `projects` | `id`, `slug`, `order`, `brand`, `year`, `tag`, `title`, `summary`, `accent`, `cover_key`, `wide`, `layout` (`case-study` / `work-summary`), `body` (JSON: các section) | 3 dự án |
| `project_results` | `id`, `project_id`, `order`, `value`, `prefix`, `suffix`, `decimals`, `label`, `tip` | Số liệu đếm |
| `skills` | `id`, `group` (`hero` / `capability` / `format` / `tool` / `industry`), `order`, `name`, `description`, `tip`, `icon` | Gộp các nhóm pill |
| `posts` | `id`, `order`, `title`, `category`, `published_at`, `url` | 5 bài |
| `works` | `id`, `order`, `title`, `kind`, `description`, `tone`, `featured` | Thiết kế |
| `work_images` | `id`, `work_id`, `order`, `chapter`, `caption`, `note`, `media_key`, `width`, `height` | Bloomsky 21 ảnh + 4 tác phẩm khác |

- Cột JSON lưu dạng `text`, parse bằng Zod trong repository.
- `media_key` là khóa trong R2 (ví dụ `bloomsky/p26.jpg`). Không lưu URL tuyệt đối.

### 7.2 Migration

`drizzle.config.ts`:

```ts
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: "sqlite",
  schema: "./app/lib/db/schema.ts",
  out: "./drizzle/migrations",
});
```

```bash
pnpm drizzle-kit generate                                   # sinh SQL từ schema
pnpm wrangler d1 migrations apply portfolio-db --local      # áp dụng local
pnpm wrangler d1 migrations apply portfolio-db --remote     # áp dụng production
```

### 7.3 Seed nội dung

- Chuyển nội dung trong tài liệu kỹ thuật thành `drizzle/seed/seed.sql`, hoặc viết `seed.ts` xuất ra SQL.
- Chạy seed:

```bash
pnpm wrangler d1 execute portfolio-db --local  --file=drizzle/seed/seed.sql
pnpm wrangler d1 execute portfolio-db --remote --file=drizzle/seed/seed.sql
```

- Mọi con số phải khớp nguồn:
  - Chức danh Phú Hưng Life là "Senior Content Marketing".
  - CSR ghi 1.000+ người tham dự, tỷ lệ tham gia trung bình 95%.

### 7.4 Client

```ts
// app/lib/db/client.ts
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
export const getDb = (env: Env) => drizzle(env.DB, { schema });
```

---

## 8. Asset: xử lý và đẩy lên R2

### 8.1 Quy ước khóa R2

```text
hero/portrait.<hash>.webp
cases/woori/storyboard-01.<hash>.jpg …
cases/cntl/before.<hash>.jpg, after-2.<hash>.jpg, video-11-nam.<hash>.mp4, video-11-nam-poster.<hash>.jpg
cases/phl/press-dantri.<hash>.jpg, btd-01.<hash>.jpg, web-main.<hash>.jpg …
design/bloomsky/cover.<hash>.jpg, p26.<hash>.jpg …
design/works/hoa-lo.<hash>.jpg, cake-bliss.<hash>.jpg …
```

### 8.2 `scripts/prepare-assets.ts`

Dùng `sharp`, ngoài ra gọi `ffmpeg` và `pdftoppm`.

- **Ảnh hero:** tách nền trắng (flood-fill từ mép, xóa cả vùng nền kín giữa tay và thân), làm mềm alpha, xuất WebP có alpha.
- **Ảnh nội dung:**
  - Xuất 2 kích thước (`@1x` khoảng 800px, `@2x` khoảng 1.600px) cho `srcset`.
  - Xuất 2 định dạng AVIF và WebP, kèm JPEG dự phòng.
- **Bloomsky:** render trang 4 và 21 trang chọn lọc từ PDF.
- **Video:** dùng ffmpeg theo lệnh trong tài liệu kỹ thuật, kèm poster.
- **Đầu ra:**
  - Thư mục `assets-out/`.
  - File `assets-out/manifest.json` ghi mỗi ảnh: khóa R2, kích thước, `blurhash` hoặc màu chủ đạo dùng làm placeholder.

### 8.3 Đẩy lên R2

```bash
# từng file
pnpm wrangler r2 object put portfolio-media/hero/portrait.a1b2c3.webp \
  --file=assets-out/hero/portrait.a1b2c3.webp --content-type=image/webp --remote
```

`scripts/upload-media.ts` lặp qua `manifest.json` và gọi lệnh trên, hoặc dùng API S3 của R2 với `@aws-sdk/client-s3`. Ghi `Content-Type` đúng cho từng file.

### 8.4 Component ảnh

`<Media>` nhận `mediaKey` và `sizes`, sinh `<picture>` gồm:
- `srcset` AVIF và WebP.
- `width`/`height` lấy từ manifest để không nhảy layout.
- `loading="lazy"`, trừ ảnh hero dùng `fetchpriority="high"`.
- `alt` tiếng Việt bắt buộc.

---

## 9. Giao diện và responsive

### 9.1 Token vào Tailwind (`app/styles/tokens.css`)

```css
:root {
  --bg: #EADFCF; --bg2: #F3ECE1; --paper: #FFFFFF;
  --ink: #161412; --muted: #574E44; --camel: #7A5A3A;
  --line: rgba(22,20,18,.12);
  --glass: rgba(255,255,255,.42); --glass-strong: rgba(255,255,255,.7); --edge: rgba(255,255,255,.9);
  --night: #121110; --night-ink: #F2EADD;
  --ease: cubic-bezier(.2,0,0,1);
}
.night {
  --ink: #F2EADD; --muted: #BDB2A3; --camel: #D6B48E;
  --line: rgba(242,234,221,.14);
  --glass: rgba(255,255,255,.06); --glass-strong: rgba(255,255,255,.08);
}

@theme inline {
  --color-bg: var(--bg);   --color-bg2: var(--bg2); --color-paper: var(--paper);
  --color-ink: var(--ink); --color-muted: var(--muted); --color-camel: var(--camel);
  --color-line: var(--line); --color-night: var(--night);
  --font-display: "Poppins", system-ui, sans-serif;
  --font-body: "Roboto", system-ui, sans-serif;
  --radius-card: 20px; --radius-card-lg: 32px;
  --ease-brand: var(--ease);

  --breakpoint-xs: 360px;
  --breakpoint-sm: 560px;
  --breakpoint-md: 640px;
  --breakpoint-lg: 900px;
  --breakpoint-xl: 1000px;
  --breakpoint-2xl: 1280px;
}
```

Font: import `@fontsource/poppins/{400,500,600,700}.css` và `@fontsource/roboto/{400,500,700}.css` trong `root.tsx`. Font tự host, có dấu tiếng Việt, không phụ thuộc Google Fonts.

### 9.2 Nguyên tắc responsive cho mọi thiết bị
- **Mobile-first:** viết style cho 360px trước, rồi mở rộng bằng `sm:`, `md:`, `lg:`, `xl:`.
- **Lưới:**
  - Dùng `grid` với `minmax(0,1fr)` để không tràn.
  - Số cột theo bảng điểm ngắt trong file yêu cầu UI:
    - Hero: 1 cột → 2 cột ở `xl` → 3 cột trên 1000px.
    - Năng lực: 1 → 2 → 4 cột.
- **Cỡ chữ và khoảng cách:**
  - Dùng `clamp()` như đặc tả; tên hero `clamp(34px, 9.6vw, 138px)`, `whitespace-nowrap`.
- **Thiết bị cảm ứng:**
  - Dùng `@media (hover: hover) and (pointer: fine)` để chỉ bật nghiêng thẻ, nút từ tính và đốm sáng kính trên máy có chuột.
  - Trên cảm ứng, tooltip mở bằng chạm.
- **Màn hình lớn:**
  - Container tối đa 1200px, nav tối đa 1120px. Kiểm tra trên 1920px và 2560px để không có khoảng trống vô lý.
  - Dùng `100svh` cho hero để thanh địa chỉ trên điện thoại không làm nhảy layout.
- **Safe area:** padding `env(safe-area-inset-*)` cho nav cố định trên iPhone có tai thỏ.
- **Hướng màn hình:** kiểm tra điện thoại xoay ngang (844×390) để hero không bị cắt.
- **Ảnh:** luôn có `width`/`height` hoặc `aspect-ratio`; ảnh trong lưới dùng `object-cover`, ảnh bìa Bloomsky dùng `object-contain` hoặc đúng tỉ lệ 16:9.

### 9.3 Ma trận thiết bị kiểm thử

| Nhóm | Kích thước viewport |
| --- | --- |
| Điện thoại nhỏ | 360×740 (Android), 375×667 (iPhone SE) |
| Điện thoại | 390×844 (iPhone 15), 412×915 (Pixel) |
| Điện thoại xoay ngang | 844×390 |
| Tablet | 768×1024, 820×1180 (iPad Air), 1024×1366 (iPad Pro) |
| Laptop | 1280×800, 1440×900 |
| Màn lớn | 1920×1080, 2560×1440 |
| Trình duyệt | Chrome, Safari (iOS và macOS), Firefox, Edge, Samsung Internet |

`backdrop-filter` cần tiền tố `-webkit-` cho Safari. Nếu trình duyệt không hỗ trợ, dùng nền dự phòng đục hơn qua `@supports not (backdrop-filter: blur(1px))`.

---

## 10. Chất lượng: SEO, hiệu năng, accessibility

| Hạng mục | Việc cần làm | Mục tiêu |
| --- | --- | --- |
| SEO | `meta` mỗi route: title, description, Open Graph, ảnh chia sẻ 1200×630 trong R2; `lang="vi"`; `sitemap.xml`, `robots.txt`; JSON-LD `Person` cho trang chính, `CreativeWork` cho trang dự án | Mọi trang có title và mô tả riêng |
| Hiệu năng | Prerender HTML; ảnh AVIF/WebP + `srcset`; preload font Poppins 700 và ảnh hero; JS mỗi trang tối thiểu (không thư viện animation) | Lighthouse Performance ≥ 90 trên mobile; LCP < 2,5 giây; CLS < 0,1 |
| Accessibility | Theo mục 11 file yêu cầu UI; kiểm tra tự động bằng `@axe-core/playwright` | 0 lỗi nghiêm trọng (serious/critical) |
| Bảo mật | Header `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy` đặt trong Worker; không lộ binding ra client | |

---

## 11. Kiểm thử

### 11.1 Unit (Vitest)
- `format.ts`: định dạng số vi-VN (153,4; 1.000+; 31.769).
- Repository: parse JSON bằng Zod, trả đúng kiểu.
- Hook `useCountUp`: khi bật reduced motion phải trả ngay giá trị cuối.

### 11.2 E2E (Playwright), `tests/e2e/`

| Kịch bản | Kiểm tra |
| --- | --- |
| `layout.spec.ts` | Ở mọi viewport của mục 9.3: `scrollWidth === innerWidth`; tên hero 1 dòng; thẻ chặng nghề không chồng lên vùng mặt của ảnh |
| `navigation.spec.ts` | Từ trang chính bấm "Xem chi tiết dự án" mở đúng URL ở tab mới; nút "Về portfolio" quay lại `/#du-an`; vào thẳng URL dự án (F5) vẫn ra trang |
| `interaction.spec.ts` | Tooltip mở bằng hover và bằng Tab; dialog mở/đóng bằng Esc; bộ lọc Bloomsky đổi ảnh; nút sao chép hiện toast |
| `a11y.spec.ts` | axe không có lỗi serious/critical trên 4 trang |
| `motion.spec.ts` | Với `reducedMotion: 'reduce'`, mọi phần tử hiện ngay, số liệu hiện giá trị cuối |
| `media.spec.ts` | `/media/...` trả 200 và đúng `Content-Type`; request có `Range` trả 206 |

Chạy E2E trên bản build chạy local trong môi trường Workers (`pnpm preview`), không chạy trên dev server.

---

## 12. Môi trường và deploy

### 12.1 Ba môi trường

| Môi trường | Worker | D1 | R2 | Kích hoạt |
| --- | --- | --- | --- | --- |
| Local | `pnpm dev` | D1 local (`--local`) | Bucket preview hoặc local | Trên máy dev |
| Staging | `portfolio-le-thuy-trang-staging` | `portfolio-db-staging` | `portfolio-media-staging` | Mỗi pull request / nhánh `develop` |
| Production | `portfolio-le-thuy-trang` | `portfolio-db` | `portfolio-media` | Merge vào `main` |

Khi cần dữ liệu thật lúc dev, bật `"remote": true` cho binding trong `wrangler.jsonc`: code vẫn chạy local nhưng đọc/ghi D1/R2 trên Cloudflare. Chỉ dùng với bản staging.

### 12.2 Script trong `package.json`

```json
{
  "scripts": {
    "dev": "react-router dev",
    "build": "react-router build",
    "preview": "pnpm build && vite preview",
    "typecheck": "wrangler types && react-router typegen && tsc -b",
    "lint": "eslint .",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "db:generate": "drizzle-kit generate",
    "db:migrate:local": "wrangler d1 migrations apply portfolio-db --local",
    "db:migrate:prod": "wrangler d1 migrations apply portfolio-db --remote",
    "db:seed:local": "wrangler d1 execute portfolio-db --local --file=drizzle/seed/seed.sql",
    "assets:prepare": "tsx scripts/prepare-assets.ts",
    "assets:upload": "tsx scripts/upload-media.ts",
    "deploy:staging": "pnpm build && wrangler deploy --env staging",
    "deploy": "pnpm build && wrangler deploy"
  }
}
```

Giữ các script mà template đã sinh; chỉ bổ sung những dòng còn thiếu.

### 12.3 Deploy thủ công lần đầu

```bash
# 1. Cơ sở dữ liệu
pnpm db:generate
pnpm db:migrate:prod
pnpm wrangler d1 execute portfolio-db --remote --file=drizzle/seed/seed.sql

# 2. Asset
pnpm assets:prepare
pnpm assets:upload

# 3. Ứng dụng
pnpm deploy
```

Sau lệnh cuối, Wrangler in ra URL dạng `https://portfolio-le-thuy-trang.<tài-khoản>.workers.dev`. Mở và kiểm tra.

### 12.4 Gắn tên miền
1. Thêm tên miền vào Cloudflare (đổi nameserver về Cloudflare).
2. Trong `wrangler.jsonc` thêm:
   ```jsonc
   "routes": [{ "pattern": "portfolio.example.com", "custom_domain": true }]
   ```
   Hoặc vào Dashboard → Workers & Pages → Worker → Settings → Domains & Routes.
3. `pnpm deploy` lại. Cloudflare tự cấp SSL.
4. (Tùy chọn) Gắn `media.portfolio.example.com` cho bucket R2 nếu phục vụ ảnh trực tiếp.

### 12.5 CI/CD với GitHub Actions

`.github/workflows/deploy.yml`:

```yaml
name: CI & Deploy
on:
  pull_request:
  push:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm test
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm test:e2e

  deploy-staging:
    if: github.event_name == 'pull_request'
    needs: check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy --env staging

  deploy-production:
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    needs: check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: d1 migrations apply portfolio-db --remote
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy
```

- Tạo API token trong Dashboard → My Profile → API Tokens, quyền tối thiểu: Workers Scripts (Edit), D1 (Edit), R2 (Edit), Account Settings (Read).
- Lưu token vào GitHub Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- **Cách thay thế:** kết nối repo trực tiếp trong Dashboard (Workers Builds) để Cloudflare tự build và deploy, có preview URL cho mỗi nhánh.

### 12.6 Rollback và theo dõi
- Rollback nhanh:
  ```bash
  pnpm wrangler deployments list
  pnpm wrangler rollback
  ```
- Theo dõi:
  - Bật `observability` (đã có trong `wrangler.jsonc`) để xem log và lỗi trên Dashboard.
  - Xem log trực tiếp bằng `pnpm wrangler tail`.
- Sao lưu D1:
  ```bash
  pnpm wrangler d1 export portfolio-db --remote --output=backup.sql
  ```
  Ngoài ra có thể dùng Time Travel của D1 để khôi phục về thời điểm trước.

---

## 13. Lộ trình triển khai

| Giai đoạn | Việc chính | Kết quả bàn giao | Ước lượng |
| --- | --- | --- | --- |
| 1. Nền móng | Init dự án, cài thư viện, cấu hình Tailwind/TS/ESLint, tạo D1 + R2, `wrangler.jsonc`, deploy "hello world" lên workers.dev | URL chạy được trên Cloudflare | 0,5 ngày |
| 2. Dữ liệu và asset | Schema Drizzle, migration, seed toàn bộ nội dung; script xử lý ảnh/video; upload R2; route `/media/*` | D1 và R2 có đủ dữ liệu, ảnh xem được qua `/media` | 1–1,5 ngày |
| 3. Design system | Token, `.glass`, nền `Aura`, UI primitives (Button, Pill, Tag, Section, Tooltip, Dialog, Gallery, Toast, Media), các hook chuyển động | Trang `/_ui` nội bộ (chỉ dev) hiển thị mọi thành phần và trạng thái | 1,5 ngày |
| 4. Trang chính | Nav, Hero, Kinh nghiệm, Dự án, Năng lực, Bài viết, Thiết kế (Bloomsky + Thiết kế khác), Liên hệ, Footer | `/` hoàn chỉnh trên mọi viewport | 2–3 ngày |
| 5. Trang dự án | Template case-study, layout riêng Phú Hưng Life, so sánh trước/sau, video, mục lục, thanh tiến độ | 3 trang `/du-an/*` hoàn chỉnh | 1,5–2 ngày |
| 6. Chất lượng | SEO, sitemap, OG image, CSP; Playwright đủ kịch bản mục 11; Lighthouse; sửa lỗi Safari/iOS | Checklist mục 14 đạt | 1–1,5 ngày |
| 7. Phát hành | Tên miền, CI/CD, staging, production, hướng dẫn cập nhật nội dung | Website chạy trên tên miền thật | 0,5 ngày |

Tổng ước lượng: khoảng **8–10 ngày làm việc** cho một lập trình viên.

---

## 14. Checklist nghiệm thu

- [ ] Mỗi trang có URL riêng, F5 hay mở trực tiếp đều ra đúng nội dung; xem mã nguồn trang (View Source) thấy HTML đầy đủ, không chỉ `<div id="root">`.
- [ ] Nội dung đọc từ D1; ảnh và video phục vụ từ R2 qua `/media/*` (hoặc tên miền R2), có cache dài hạn.
- [ ] Không tràn ngang và bố cục đúng ở mọi viewport của mục 9.3; tên hero 1 dòng; ảnh hero không bị che mặt; bìa Bloomsky đủ 16:9.
- [ ] Video `video-11-nam` tua được (Range 206).
- [ ] Tooltip, dialog, bộ lọc, sao chép hoạt động bằng chuột, chạm và bàn phím.
- [ ] Reduced motion: không còn chuyển động, mọi nội dung hiện ngay.
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95; axe không lỗi serious/critical.
- [ ] Nội dung xưng "tôi"; chức danh Phú Hưng Life "Senior Content Marketing"; CSR 1.000+ người tham dự, 95%.
- [ ] CI chạy đủ typecheck, lint, test, E2E; PR có staging; merge `main` tự deploy production.
- [ ] Có hướng dẫn cập nhật nội dung:
  - Sửa nội dung: sửa seed → tạo migration/seed mới → deploy.
  - Thêm ảnh: chạy `assets:prepare` → `assets:upload`.

---

## 15. Phụ lục: cập nhật nội dung về sau

| Muốn làm | Cách làm |
| --- | --- |
| Sửa câu chữ, số liệu | Sửa file seed hoặc chạy `wrangler d1 execute portfolio-db --remote --command="UPDATE …"`, rồi build lại (vì trang được prerender) |
| Thêm dự án mới | Thêm dòng vào `projects`, `project_results`, ảnh vào R2, thêm slug vào `prerender()`, deploy |
| Thêm ảnh thiết kế | Đặt file vào `assets-src/`, chạy `assets:prepare` và `assets:upload`, thêm dòng `work_images` |
| Không muốn build lại mỗi lần sửa | Bỏ trang đó khỏi `prerender()` để chạy SSR; thêm `Cache-Control: s-maxage=3600` trong `headers` của route |
| Trang quản trị (giai đoạn sau) | Thêm route `/admin` chạy SSR, bảo vệ bằng Cloudflare Access (đăng nhập bằng email, không phải tự viết auth), form ghi vào D1 và upload ảnh vào R2 |
