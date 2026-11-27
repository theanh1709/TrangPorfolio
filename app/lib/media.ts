export const mediaUrl = (key: string): string => {
  if (!key) return "";
  if (key.startsWith("http://") || key.startsWith("https://") || key.startsWith("data:")) {
    return key;
  }
  const clean = key.replace(/^\/+/, "");
  return `/media/${clean}`;
};

export const isSafeMediaKey = (key: string | undefined): key is string => {
  if (!key || key.length === 0 || key.length > 256) return false;
  if (key.includes("\0") || key.includes("\\") || key.startsWith("/")) return false;
  const segments = key.split("/");
  if (segments.some((s) => s === "" || s === "." || s === "..")) return false;
  return /^[a-z0-9/_.-]+$/i.test(key);
};

export type ByteRange = {
  offset: number;
  length: number;
  end: number;
};

export const parseRangeHeader = (
  rangeHeader: string | null,
  totalSize: number,
): ByteRange | "unsatisfiable" | null => {
  if (!rangeHeader || totalSize <= 0) return null;
  const match = /^bytes=(\d*)-(\d*)$/i.exec(rangeHeader.trim());
  if (!match) return null;

  const startStr = match[1] ?? "";
  const endStr = match[2] ?? "";

  if (!startStr && !endStr) return "unsatisfiable";

  let start = 0;
  let end = totalSize - 1;

  if (!startStr && endStr) {
    const suffixLength = Number.parseInt(endStr, 10);
    if (Number.isNaN(suffixLength) || suffixLength <= 0) return "unsatisfiable";
    start = Math.max(0, totalSize - suffixLength);
  } else {
    start = Number.parseInt(startStr, 10);
    if (Number.isNaN(start) || start < 0 || start >= totalSize) return "unsatisfiable";
    if (endStr) {
      const parsedEnd = Number.parseInt(endStr, 10);
      if (Number.isNaN(parsedEnd) || parsedEnd < start) return "unsatisfiable";
      end = Math.min(parsedEnd, totalSize - 1);
    }
  }

  return {
    offset: start,
    end,
    length: end - start + 1,
  };
};
