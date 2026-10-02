"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

type Props = {
  posts: PostMeta[];
  open: boolean;
  onClose: () => void;
};

export function SearchDialog({ posts, open, onClose }: Props) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts.slice(0, 6);
    return posts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      )
      .slice(0, 10);
  }, [posts, query]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) onClose();
      }
    },
    [onClose, open],
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-surface-container-lowest/80"
      id="search-dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xl bg-surface border border-outline-variant rounded p-space-md">
        <div className="flex items-center border-b border-outline-variant/60 pb-space-sm gap-2">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            autoFocus
            className="w-full bg-transparent font-code-block text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
            placeholder="Search articles, tags, concepts..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd
            className="font-label-mono text-label-mono text-outline hover:text-on-surface cursor-pointer px-1.5 py-0.5 border border-outline-variant/60 rounded bg-surface-container-low"
            onClick={onClose}
          >
            ESC
          </kbd>
        </div>
        <div className="mt-space-md flex flex-col gap-space-xs max-h-80 overflow-y-auto">
          <div className="font-label-mono text-label-mono text-outline uppercase tracking-wider px-2 py-1">
            {query.trim() ? "Results" : "Recent Articles"}
          </div>
          {results.length === 0 ? (
            <p className="px-2 py-2 font-body-sm text-body-sm text-outline">
              No matching articles.
            </p>
          ) : (
            results.map((post, i) => (
              <Link
                key={post.slug}
                className="group flex items-center justify-between px-2 py-2 rounded hover:bg-surface-container-low transition-colors"
                href={`/blogs/${post.slug}`}
                onClick={onClose}
              >
                <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">
                  {post.title}
                </span>
                <span className="font-label-mono text-label-mono text-outline shrink-0 ml-2">
                  0x{String(i + 1).padStart(2, "0")} · {post.readingMinutes}m
                  read
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
