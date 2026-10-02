import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { formatDate } from "@/lib/format";

type Props = {
  post: PostMeta;
  variant?: "home" | "archive";
};

export function ArticleListItem({ post, variant = "home" }: Props) {
  if (variant === "archive") {
    return (
      <article
        className="article-row group flex flex-col md:grid md:grid-cols-[140px_1fr] gap-space-xs md:gap-space-lg cursor-pointer pb-space-lg hover:opacity-100 transition-opacity"
        data-date={post.date}
        data-summary={post.description}
        data-tags={post.tags.join(",")}
        data-title={post.title}
      >
        <div className="font-label-mono text-label-mono text-outline pt-1 shrink-0 select-none">
          {formatDate(post.date, "upper")}
        </div>
        <div className="flex flex-col gap-1.5 min-w-0">
          <Link
            className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors tracking-tight"
            href={`/blogs/${post.slug}`}
          >
            {post.title}
          </Link>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {post.description}
          </p>
          <div className="flex items-center gap-space-xs font-label-mono text-label-mono text-outline pt-1 flex-wrap">
            {post.tags.slice(0, 2).map((tag, i) => (
              <span key={tag} className="contents">
                {i > 0 && <span className="text-outline-variant">·</span>}
                <span className="text-on-surface-variant">{tag}</span>
              </span>
            ))}
            <span className="text-outline-variant">·</span>
            <span>{post.readingMinutes} min read</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group py-space-lg flex flex-col gap-space-xs">
      <div className="flex items-baseline justify-between gap-space-md">
        <Link
          className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors"
          href={`/blogs/${post.slug}`}
        >
          {post.title}
        </Link>
        <span className="font-label-mono text-label-mono text-outline whitespace-nowrap hidden sm:inline">
          {formatDate(post.date)}
        </span>
      </div>
      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
        {post.description}
      </p>
      <div className="flex items-center gap-space-sm pt-space-xs font-label-mono text-label-mono text-outline flex-wrap">
        {post.tags.slice(0, 2).map((tag, i) => (
          <span key={tag} className="contents">
            {i > 0 && <span>·</span>}
            <span className="text-on-surface-variant/90">{tag}</span>
          </span>
        ))}
        <span>·</span>
        <span>{post.readingMinutes} min read</span>
        <span className="sm:hidden">·</span>
        <span className="sm:hidden">{formatDate(post.date)}</span>
      </div>
    </article>
  );
}
