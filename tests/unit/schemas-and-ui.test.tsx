import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TooltipProvider } from "~/components/ui/TooltipProvider";
import { ExperienceSection } from "~/features/experience/ExperienceSection";
import { BloomskyMetaSchema } from "~/lib/db/types";

describe("ExperienceSection & Zod Schemas", () => {
  it("toggles job details drawer and updates aria-expanded", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes("reduce"),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    render(
      <TooltipProvider>
        <ExperienceSection
          jobs={[
            {
              id: "job-phl",
              sortOrder: 1,
              years: "2025–2026",
              period: "Th4/2025 – Th3/2026",
              title: "Senior Content Marketing",
              company: "Phú Hưng Life",
              companyTipTitle: "Phú Hưng Life",
              companyTipBody: "Bảo hiểm nhân thọ",
              summary: "Giữ giọng nói thương hiệu",
              highlights: ["Tăng 30% tương tác tổng"],
              details: ["Đồng tổ chức chuỗi CSR giáo dục tài chính"],
            },
          ]}
          education={[
            {
              id: "edu-1",
              sortOrder: 1,
              school: "Học viện Báo chí và Tuyên truyền",
              degree: "Cử nhân Quan hệ công chúng",
              years: "2017–2021",
              tipTitle: "PR",
              tipBody: "Nền tảng PR",
            },
          ]}
        />
      </TooltipProvider>,
    );

    const toggleBtn = screen.getByRole("button", { name: /Xem toàn bộ trách nhiệm/i });
    expect(toggleBtn).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute("aria-expanded", "true");
    expect(toggleBtn).toHaveTextContent("Thu gọn");
  });

  it("validates BloomskyMetaSchema strictly", () => {
    const parsed = BloomskyMetaSchema.parse({
      kicker: "Đồ án nhận diện thương hiệu, Arena Multimedia, 2024",
      quote: "“To the joyful you and beyond!”",
      coverKey: "design/bloomsky/cover.webp",
      coverAlt: "Bìa guidebook Bloomsky Airways",
      facts: [
        {
          value: "136",
          label: "trang guidebook",
          tipTitle: "136 trang",
          tipBody: "Chi tiết",
        },
      ],
      swatches: [
        { hex: "#133F52", tipTitle: "Xanh", tipBody: "HEX #133F52" },
      ],
      fonts: [
        { name: "Proxima Nova", italicBold: true, tipTitle: "Font", tipBody: "Logo" },
      ],
      chapters: ["Tất cả", "Logo guideline"],
    });
    expect(parsed.facts[0]?.value).toBe("136");
  });
});
