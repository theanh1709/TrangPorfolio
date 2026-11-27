import { describe, expect, it } from "vitest";
import { formatViNumber } from "~/lib/format";
import { isSafeMediaKey, mediaUrl, parseRangeHeader } from "~/lib/media";

describe("formatViNumber", () => {
  it("formats Vietnamese decimals and thousands separators accurately", () => {
    expect(formatViNumber(153.4, 1, "+", "%")).toBe("+153,4%");
    expect(formatViNumber(7500, 0, "", "")).toBe("7.500");
    expect(formatViNumber(31769, 0, "", "")).toBe("31.769");
    expect(formatViNumber(1000, 0, "", "+")).toBe("1.000+");
  });
});

describe("media helpers", () => {
  it("builds clean /media/ URLs", () => {
    expect(mediaUrl("hero/portrait.webp")).toBe("/media/hero/portrait.webp");
    expect(mediaUrl("/cases/cntl/cover.webp")).toBe("/media/cases/cntl/cover.webp");
    expect(mediaUrl("https://example.com/a.webp")).toBe("https://example.com/a.webp");
  });

  it("validates safe media keys and blocks path traversal", () => {
    expect(isSafeMediaKey("hero/portrait.webp")).toBe(true);
    expect(isSafeMediaKey("cases/cntl/video-11-nam.mp4")).toBe(true);
    expect(isSafeMediaKey("")).toBe(false);
    expect(isSafeMediaKey("/hero/portrait.webp")).toBe(false);
    expect(isSafeMediaKey("../wrangler.jsonc")).toBe(false);
    expect(isSafeMediaKey("cases/../../secret")).toBe(false);
    expect(isSafeMediaKey("cases\\woori\\cover.webp")).toBe(false);
  });

  it("parses HTTP Range headers accurately for 206 Partial Content", () => {
    expect(parseRangeHeader("bytes=0-1023", 5000)).toEqual({
      offset: 0,
      end: 1023,
      length: 1024,
    });
    expect(parseRangeHeader("bytes=4000-", 5000)).toEqual({
      offset: 4000,
      end: 4999,
      length: 1000,
    });
    expect(parseRangeHeader("bytes=-500", 5000)).toEqual({
      offset: 4500,
      end: 4999,
      length: 500,
    });
    expect(parseRangeHeader("bytes=6000-7000", 5000)).toBe("unsatisfiable");
    expect(parseRangeHeader(null, 5000)).toBeNull();
  });
});
