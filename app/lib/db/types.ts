import { z } from "zod";

export const StringArraySchema = z.array(z.string());

export const ProjectWinSchema = z.object({
  value: z.string(),
  label: z.string(),
  tipTitle: z.string(),
  tipBody: z.string(),
});

export const TocItemSchema = z.object({
  id: z.string(),
  label: z.string(),
});

export const InfoRowSchema = z.object({
  term: z.string(),
  description: z.string(),
});

export const InlineSegmentSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("text"), text: z.string() }),
  z.object({ kind: z.literal("bold"), text: z.string() }),
  z.object({
    kind: z.literal("abbr"),
    text: z.string(),
    tipTitle: z.string(),
    tipBody: z.string(),
  }),
  z.object({
    kind: z.literal("link"),
    text: z.string(),
    href: z.string(),
  }),
]);

export const RichParagraphSchema = z.array(InlineSegmentSchema);

export const FigureImageSchema = z.object({
  mediaKey: z.string(),
  alt: z.string(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export const ContentBlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("paragraph"),
    segments: RichParagraphSchema,
  }),
  z.object({
    type: z.literal("heading3"),
    kicker: z.string().optional(),
    text: z.string(),
  }),
  z.object({
    type: z.literal("heading4"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("list"),
    items: z.array(RichParagraphSchema),
  }),
  z.object({
    type: z.literal("quote"),
    quote: z.string(),
    attribution: z.string(),
  }),
  z.object({
    type: z.literal("phases"),
    autoFit: z.boolean().optional(),
    items: z.array(
      z.object({
        kicker: z.string().optional(),
        title: z.string(),
        description: z.string().optional(),
        href: z.string().optional(),
      }),
    ),
  }),
  z.object({
    type: z.literal("figure"),
    layout: z.enum(["single", "grid2", "grid3", "grid4"]),
    aspectRatio: z.string().optional(),
    images: z.array(FigureImageSchema),
    caption: z.string(),
    source: z.string().optional(),
  }),
  z.object({
    type: z.literal("tallPair"),
    columns: z.string().optional(),
    items: z.array(
      z.object({
        mediaKey: z.string(),
        alt: z.string(),
        caption: z.string(),
        source: z.string().optional(),
      }),
    ),
  }),
  z.object({
    type: z.literal("beforeAfter"),
    beforeKey: z.string(),
    beforeAlt: z.string(),
    afterKey: z.string(),
    afterAlt: z.string(),
    caption: z.string(),
    source: z.string().optional(),
  }),
  z.object({
    type: z.literal("video"),
    videoKey: z.string(),
    posterKey: z.string(),
    caption: z.string(),
    source: z.string().optional(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  z.object({
    type: z.literal("table"),
    headers: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  }),
  z.object({
    type: z.literal("stage"),
    id: z.string(),
    kicker: z.string(),
    title: z.string(),
    blocks: z.lazy((): z.ZodType<ContentBlock[]> => z.array(ContentBlockSchema)),
  }),
]);

export type InlineSegment = z.infer<typeof InlineSegmentSchema>;
export type RichParagraph = z.infer<typeof RichParagraphSchema>;
export type FigureImage = z.infer<typeof FigureImageSchema>;

export type ContentBlock =
  | { type: "paragraph"; segments: RichParagraph }
  | { type: "heading3"; kicker?: string; text: string }
  | { type: "heading4"; text: string }
  | { type: "list"; items: RichParagraph[] }
  | { type: "quote"; quote: string; attribution: string }
  | {
      type: "phases";
      autoFit?: boolean;
      items: Array<{
        kicker?: string;
        title: string;
        description?: string;
        href?: string;
      }>;
    }
  | {
      type: "figure";
      layout: "single" | "grid2" | "grid3" | "grid4";
      aspectRatio?: string;
      images: FigureImage[];
      caption: string;
      source?: string;
    }
  | {
      type: "tallPair";
      columns?: string;
      items: Array<{
        mediaKey: string;
        alt: string;
        caption: string;
        source?: string;
      }>;
    }
  | {
      type: "beforeAfter";
      beforeKey: string;
      beforeAlt: string;
      afterKey: string;
      afterAlt: string;
      caption: string;
      source?: string;
    }
  | {
      type: "video";
      videoKey: string;
      posterKey: string;
      caption: string;
      source?: string;
      width: number;
      height: number;
    }
  | {
      type: "table";
      headers: string[];
      rows: string[][];
    }
  | {
      type: "stage";
      id: string;
      kicker: string;
      title: string;
      blocks: ContentBlock[];
    };

export const CaseSectionSchema = z.object({
  id: z.string(),
  kicker: z.string().optional(),
  title: z.string(),
  tags: z.array(z.string()).optional(),
  blocks: z.array(ContentBlockSchema),
});

export const CoverConfigSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("single"),
    mediaKey: z.string(),
    alt: z.string(),
  }),
  z.object({
    kind: z.literal("triptych"),
    images: z.array(FigureImageSchema),
  }),
  z.object({
    kind: z.literal("typographic"),
    kicker: z.string(),
    headline: z.string(),
    pills: z.array(z.string()),
  }),
]);

export const NextProjectLinkSchema = z.object({
  slug: z.string(),
  title: z.string(),
});

export const ProjectBodySchema = z.object({
  breadcrumbTitle: z.string(),
  cover: CoverConfigSchema,
  overviewLead: RichParagraphSchema,
  infoTitle: z.string(),
  infoRows: z.array(InfoRowSchema),
  overviewExtraBlocks: z.array(ContentBlockSchema).optional(),
  sections: z.array(CaseSectionSchema),
  resultsNote: z.string().optional(),
  conclusion: z.array(RichParagraphSchema),
  nextProjects: z.array(NextProjectLinkSchema),
});

export const BloomskyMetaSchema = z.object({
  kicker: z.string(),
  quote: z.string(),
  coverKey: z.string(),
  coverAlt: z.string(),
  facts: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
      tipTitle: z.string(),
      tipBody: z.string(),
    }),
  ),
  swatches: z.array(
    z.object({
      hex: z.string(),
      tipTitle: z.string(),
      tipBody: z.string(),
    }),
  ),
  fonts: z.array(
    z.object({
      name: z.string(),
      italicBold: z.boolean().optional(),
      tipTitle: z.string(),
      tipBody: z.string(),
    }),
  ),
  chapters: z.array(z.string()),
});

export type ProjectWin = z.infer<typeof ProjectWinSchema>;
export type TocItem = z.infer<typeof TocItemSchema>;
export type CaseSection = z.infer<typeof CaseSectionSchema>;
export type CoverConfig = z.infer<typeof CoverConfigSchema>;
export type ProjectBody = z.infer<typeof ProjectBodySchema>;
export type BloomskyMeta = z.infer<typeof BloomskyMetaSchema>;

export type JobItem = {
  id: string;
  sortOrder: number;
  years: string;
  period: string;
  title: string;
  company: string;
  companyTipTitle: string;
  companyTipBody: string;
  summary: string;
  highlights: string[];
  details: string[];
};

export type EducationItem = {
  id: string;
  sortOrder: number;
  school: string;
  degree: string;
  years: string;
  tipTitle: string;
  tipBody: string;
};

export type ProjectResultItem = {
  id: string;
  projectId: string;
  sortOrder: number;
  value: number;
  prefix: string;
  suffix: string;
  decimals: number;
  displayText: string;
  label: string;
  tipTitle: string;
  tipBody: string;
};

export type ProjectSummaryItem = {
  id: string;
  slug: string;
  sortOrder: number;
  brand: string;
  year: string;
  tag: string;
  cardHeading: string;
  cardSummary: string;
  wide: boolean;
  wins: ProjectWin[];
};

export type ProjectDetailItem = ProjectSummaryItem & {
  title: string;
  subtitle: string;
  accent: string;
  accentBg: string;
  coverKey: string;
  layout: string;
  chips: string[];
  toc: TocItem[];
  body: ProjectBody;
  results: ProjectResultItem[];
};

export type SkillItem = {
  id: string;
  group: string;
  sortOrder: number;
  name: string;
  subtitle: string;
  tipTitle: string;
  tipBody: string;
  icon: string;
};

export type PostItem = {
  id: string;
  sortOrder: number;
  title: string;
  category: string;
  publishedAt: string;
  url: string;
};

export type WorkImageItem = {
  id: string;
  workId: string;
  sortOrder: number;
  chapter: string;
  caption: string;
  note: string;
  mediaKey: string;
  width: number;
  height: number;
};

export type WorkItem = {
  id: string;
  slug: string;
  sortOrder: number;
  title: string;
  kind: string;
  description: string;
  tone: string;
  featured: boolean;
  bloomskyMeta: BloomskyMeta | null;
  images: WorkImageItem[];
};
