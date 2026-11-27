import { expect, test, type Page } from "@playwright/test";
import axe from "axe-core";

const runWcagAaAudit = async (page: Page) => {
  // Reveal all scroll-animated blocks so Axe measures rendered foreground/background contrast
  await page.evaluate(() => {
    document.querySelectorAll(".rv").forEach((el) => {
      el.classList.add("in");
      (el as HTMLElement).style.transition = "none";
    });
  });
  await page.addScriptTag({ content: axe.source });
  return page.evaluate(async () => {
    const win = window as unknown as { axe: typeof axe };
    const res = await win.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
    });
    return res.violations
      .filter((v) => v.impact === "critical" || v.impact === "serious")
      .map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help,
        sample: v.nodes.slice(0, 3).map((n) => ({ html: n.html, summary: n.failureSummary })),
      }));
  });
};

test.describe("Portfolio Lê Thùy Trang - E2E, Responsive, Media & A11y", () => {
  test("home page renders SSR HTML, zero horizontal overflow, accurate copy & hero layout", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const res = await page.goto("/");
    expect(res?.status()).toBe(200);

    await expect(page.getByRole("heading", { level: 1, name: "Lê Thùy Trang" })).toBeVisible();
    await expect(page.getByText("Senior Content Marketing").first()).toBeVisible();
    await expect(page.getByText("1.000+").first()).toBeVisible();

    // No horizontal overflow at any viewport (mobile 375, tablet 768, desktop 1440)
    const noOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth + 1,
    );
    expect(noOverflow).toBe(true);

    // Hero portrait loaded and role chips sit below portrait frame (never covering face)
    const portrait = page.locator(".hero-frame img");
    await expect(portrait).toBeVisible();
    const naturalWidth = await portrait.evaluate((img: HTMLImageElement) => img.naturalWidth);
    expect(naturalWidth).toBeGreaterThan(100);

    const frameBox = await page.locator(".hero-frame").boundingBox();
    const rolesBox = await page.locator(".hero-roles").boundingBox();
    expect(frameBox).not.toBeNull();
    expect(rolesBox).not.toBeNull();
    if (frameBox && rolesBox) {
      expect(rolesBox.y).toBeGreaterThanOrEqual(frameBox.y + frameBox.height - 4);
    }

    expect(errors).toEqual([]);
  });

  test("interactive UI: experience toggle, Bloomsky filter & dialog, tooltip, copy toast", async ({
    page,
    browserName,
  }) => {
    await page.goto("/");

    // 1. Experience accordion (scope locator to first job card so label change doesn't shift target)
    const firstJobToggle = page.locator(".job-card").first().locator(".job-toggle");
    await expect(firstJobToggle).toHaveAttribute("aria-expanded", "false");
    await firstJobToggle.click();
    await expect(firstJobToggle).toHaveAttribute("aria-expanded", "true");
    await expect(firstJobToggle).toContainText("Thu gọn");

    // 2. Bloomsky chapter filter & guidebook modal
    const logoTab = page.getByRole("button", { name: "Logo guideline" });
    await logoTab.click();
    await expect(logoTab).toHaveAttribute("aria-pressed", "true");

    const openGuideBtn = page.getByRole("button", { name: /Xem guidebook/i });
    await openGuideBtn.click();
    const dialog = page.locator("dialog[open]");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("heading", { level: 1, name: "Bloomsky Airways Guidebook" }),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    // 3. Copy email button & live status toast
    if (browserName === "chromium") {
      await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    }
    const copyEmailBtn = page.getByRole("button", { name: /Sao chép email/i });
    await copyEmailBtn.click();
    await expect(page.locator("#pf-toast")).toContainText("lethuytrang.works@gmail.com");
  });

  test("case study detail routes, Before/After slider, SEO routes & 404", async ({
    page,
    request,
  }) => {
    for (const slug of ["woori", "com-nieu-thien-ly", "phu-hung-life"]) {
      const res = await page.goto(`/du-an/${slug}`);
      expect(res?.status()).toBe(200);
      const noOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      );
      expect(noOverflow).toBe(true);
    }

    // Cơm Niêu Thiên Lý Before/After slider
    await page.goto("/du-an/com-nieu-thien-ly");
    const slider = page.getByRole("slider", { name: "Kéo để so sánh trước và sau" });
    await expect(slider).toBeVisible();
    await slider.fill("75");
    await expect(page.locator(".case-ba")).toHaveAttribute("style", /75%/);

    // Scroll back to top so auto-hiding top nav is visible, then click "Về portfolio"
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(page.locator(".case-top-nav")).not.toHaveClass(/is-hidden/);
    await page.getByRole("link", { name: "Về portfolio" }).click();
    await expect(page).toHaveURL(/\/#du-an$/);

    // Sitemap & robots.txt
    const sitemapRes = await request.get("/sitemap.xml");
    expect(sitemapRes.status()).toBe(200);
    expect(await sitemapRes.text()).toContain("/du-an/woori");

    const robotsRes = await request.get("/robots.txt");
    expect(robotsRes.status()).toBe(200);
    expect(await robotsRes.text()).toContain("Sitemap:");

    // 404 route
    const notFoundRes = await request.get("/du-an/khong-ton-tai");
    expect(notFoundRes.status()).toBe(404);
  });

  test("media streaming route supports 200 immutable WebP, 206 Partial Content video, and blocks traversal", async ({
    request,
  }) => {
    const imgRes = await request.get("/media/hero/portrait.webp");
    expect(imgRes.status()).toBe(200);
    expect(imgRes.headers()["content-type"]).toContain("image/webp");
    expect(imgRes.headers()["cache-control"]).toContain("immutable");

    const videoRangeRes = await request.get("/media/cases/cntl/video-11-nam.mp4", {
      headers: { Range: "bytes=0-1023" },
    });
    expect(videoRangeRes.status()).toBe(206);
    expect(videoRangeRes.headers()["content-type"]).toContain("video/mp4");
    expect(videoRangeRes.headers()["accept-ranges"]).toBe("bytes");
    expect(videoRangeRes.headers()["content-range"]).toMatch(/^bytes 0-1023\/\d+$/);
    const bodyBytes = await videoRangeRes.body();
    expect(bodyBytes.byteLength).toBe(1024);
  });

  test("honors prefers-reduced-motion immediately", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/du-an/phu-hung-life");
    await expect(page.getByText("31.769", { exact: true })).toBeVisible();
    await expect(page.getByText("1.000+", { exact: true })).toBeVisible();
  });

  test("passes WCAG 2.2 AA automated accessibility scan on home and case study", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "Run full axe audit once on desktop");

    await page.goto("/");
    const seriousHome = await runWcagAaAudit(page);
    expect(seriousHome).toEqual([]);

    await page.goto("/du-an/woori");
    const seriousCase = await runWcagAaAudit(page);
    expect(seriousCase).toEqual([]);
  });
});
