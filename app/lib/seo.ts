import type { MetaDescriptor } from "react-router";

type SeoOptions = {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown>;
};

export const buildMeta = ({
  title,
  description,
  url,
  image,
  type = "website",
  jsonLd,
}: SeoOptions): MetaDescriptor[] => {
  const descriptors: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:type", content: type },
    { property: "og:locale", content: "vi_VN" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:url", content: url },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];

  if (image) {
    descriptors.push(
      { property: "og:image", content: image },
      { name: "twitter:image", content: image },
    );
  }

  if (jsonLd) {
    descriptors.push({ "script:ld+json": jsonLd });
  }

  return descriptors;
};
