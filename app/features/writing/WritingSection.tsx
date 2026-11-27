import type { CSSProperties } from "react";
import { ArrowUpRightIcon, SectionHeader } from "~/components/ui/Primitives";
import { SITE_CONTENT } from "~/content/site";
import type { PostItem } from "~/lib/db/types";

export const WritingSection = ({ posts }: { posts: PostItem[] }) => {
  const sec = SITE_CONTENT.sections.writing;

  return (
    <section
      className="band band-white"
      id="bai-viet"
      aria-labelledby="heading-bai-viet"
    >
      <div className="wrap">
        <SectionHeader
          id="heading-bai-viet"
          kicker={sec.kicker}
          title={sec.title}
          lead={sec.lead}
        />

        <div className="posts-list">
          {posts.map((post, idx) => (
            <a
              key={post.id}
              className="post-row rv"
              style={{ "--d": `${idx * 60}ms` } as CSSProperties}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <b>{post.title}</b>
              <span className="post-cat">{post.category}</span>
              <time>{post.publishedAt}</time>
              <ArrowUpRightIcon />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
