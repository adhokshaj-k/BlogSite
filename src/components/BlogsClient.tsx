"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { PostMeta } from "@/lib/posts";
import { ArticleListItem } from "./ArticleListItem";
import { AboutSection } from "./AboutSection";

type Props = {
  posts: PostMeta[];
  tags: { tag: string; count: number }[];
};

export function BlogsClient({ posts, tags }: Props) {
  const searchParams = useSearchParams();
  const initialTag = searchParams.get("tag");
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState(
    initialTag && tags.some((t) => t.tag === initialTag) ? initialTag : "All",
  );
  const [sortDescending, setSortDescending] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = posts.filter((p) => {
      const matchesSearch =
        q === "" ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q));

      const matchesTag =
        activeTag === "All" ||
        p.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase());

      return matchesSearch && matchesTag;
    });

    list = [...list].sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return sortDescending ? db - da : da - db;
    });

    return list;
  }, [posts, query, activeTag, sortDescending]);

  function resetAllFilters() {
    setQuery("");
    setActiveTag("All");
  }

  return (
    <div className="w-full max-w-[720px] mx-auto px-margin md:px-0 py-space-xl">
      <header className="flex flex-col gap-space-sm mb-space-xl">
        {/* <div className="flex items-center gap-space-xs font-label-mono text-label-mono text-outline uppercase tracking-wider">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
          <span>Obsidian Vault · Index /blogs</span>
        </div> */}
        <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
          All Articles
        </h1>
        {/* <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[640px]">
          A searchable collection of technical notes, vulnerability breakdowns,
          and engineering writeups exported directly from my Obsidian vault.
        </p> */}
        <div className="flex items-center gap-space-sm pt-space-xs font-label-mono text-label-mono text-outline">
          <span className="text-primary font-medium">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </span>
          <span className="text-outline-variant">·</span>
          <span>{tags.length} categorized tags</span>
        </div>
      </header>

      <section
        aria-label="Article Filters"
        className="flex flex-col gap-space-md mb-space-xl"
      >
        <div className="relative w-full flex items-center bg-surface-container-low rounded">
          <span className="material-symbols-outlined text-outline absolute left-3 text-[18px] pointer-events-none select-none">
            search
          </span>
          <input
            className="w-full pl-10 pr-10 py-2.5 bg-transparent font-code-block text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container transition-colors rounded"
            placeholder="Filter articles by title, tag, or topic..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query.length > 0 && (
            <button
              aria-label="Clear search"
              className="absolute right-3 text-outline hover:text-on-surface p-0.5 rounded transition-colors"
              type="button"
              onClick={() => setQuery("")}
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div
            aria-label="Filter by tag"
            className="flex flex-wrap items-center gap-1.5"
            role="radiogroup"
          >
            <button
              aria-checked={activeTag === "All"}
              className={`tag-pill px-2.5 py-1 rounded font-label-mono text-label-mono transition-colors ${
                activeTag === "All"
                  ? "bg-secondary-container text-on-surface"
                  : "bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              }`}
              type="button"
              onClick={() => setActiveTag("All")}
            >
              All ({posts.length})
            </button>
            {tags.map(({ tag, count }) => (
              <button
                key={tag}
                aria-checked={activeTag === tag}
                className={`tag-pill px-2.5 py-1 rounded font-label-mono text-label-mono transition-colors ${
                  activeTag === tag
                    ? "bg-secondary-container text-on-surface"
                    : "bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                }`}
                type="button"
                onClick={() => setActiveTag(tag)}
              >
                {tag} ({count})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto font-label-mono text-label-mono">
            <span className="text-outline text-[11px] uppercase tracking-wider">
              Sort:
            </span>
            <button
              aria-label="Toggle sort order"
              className="flex items-center gap-1 px-2 py-1 rounded bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors"
              type="button"
              onClick={() => setSortDescending((v) => !v)}
            >
              <span>{sortDescending ? "Newest first" : "Oldest first"}</span>
              <span className="material-symbols-outlined text-[14px] text-outline">
                {sortDescending ? "arrow_downward" : "arrow_upward"}
              </span>
            </button>
          </div>
        </div>
      </section>

      <main
        aria-label="Articles list"
        className="flex flex-col gap-space-xl"
        role="feed"
      >
        {filtered.map((post) => (
          <ArticleListItem key={post.slug} post={post} variant="archive" />
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-space-xl text-center">
            <span className="material-symbols-outlined text-[32px] text-outline mb-2">
              find_in_page
            </span>
            <div className="font-headline-md text-headline-md text-on-surface mb-1">
              No matching articles found
            </div>
            <p className="font-body-sm text-body-sm text-outline max-w-sm">
              No writeup matched the selected query. Try clearing the search term
              or switching the tag filter.
            </p>
            <button
              className="mt-space-md font-label-mono text-label-mono px-3 py-1.5 rounded bg-surface-container text-primary hover:bg-surface-container-high transition-colors"
              type="button"
              onClick={resetAllFilters}
            >
              Reset all filters
            </button>
          </div>
        )}
      </main>

      <AboutSection variant="blogs" />
    </div>
  );
}
