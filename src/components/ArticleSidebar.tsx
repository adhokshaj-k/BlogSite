"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { TocItem } from "@/lib/markdown";

type Props = {
  toc: TocItem[];
  tags: string[];
  readingMinutes: number;
  title: string;
};

export function ArticleSidebar({
  toc,
  tags,
  readingMinutes,
  title,
}: Props) {
  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState(toc[0]?.id ?? "");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const docElem = document.documentElement;
      const totalHeight = docElem.scrollHeight - docElem.clientHeight;
      const scrolled = (window.scrollY / (totalHeight || 1)) * 100;
      setProgress(Math.min(100, Math.max(0, Math.round(scrolled))));

      let current = toc[0]?.id ?? "";
      for (const item of toc) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= 140) {
          current = item.id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [toc]);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      {/* Top reading progress — always visible (Stitch design) */}
      <div className="fixed top-14 left-0 right-0 z-30 h-[2px] bg-surface-container-low">
        <div
          className="h-full bg-primary transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block w-[260px] shrink-0 sticky top-20 space-y-space-lg">
        <div className="p-space-md bg-surface-container-low rounded-lg space-y-space-xs">
          <div className="flex items-center justify-between text-outline font-label-mono text-label-mono">
            <span className="uppercase tracking-wider">Scroll Readout</span>
            <span className="text-primary font-code-inline font-medium">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="font-label-mono text-label-mono text-outline pt-1">
            {readingMinutes} min read
          </div>
        </div>

        <div className="p-space-md bg-surface-container-low rounded-lg space-y-space-sm">
          <div className="flex items-center justify-between font-label-mono text-label-mono text-outline">
            <span className="uppercase tracking-wider font-semibold text-on-surface">
              On this page
            </span>
            <span className="material-symbols-outlined text-[16px]">
              menu_book
            </span>
          </div>
          <nav className="space-y-1 font-body-sm text-body-sm">
            {toc.map((item) => {
              const active = activeId === item.id;
              return (
                <a
                  key={item.id}
                  className={`toc-link block px-2.5 py-1.5 rounded transition-colors border-l-2 ${
                    active
                      ? "text-primary font-medium border-primary bg-surface-container"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container border-transparent"
                  }`}
                  href={`#${item.id}`}
                >
                  <span className="font-label-mono text-label-mono text-outline mr-1.5">
                    {String(item.index).padStart(2, "0")}
                  </span>
                  {item.text}
                </a>
              );
            })}
          </nav>
        </div>

        {tags.length > 0 && (
          <div className="p-space-md bg-surface-container-low rounded-lg space-y-2">
            <div className="font-label-mono text-label-mono text-outline uppercase tracking-wider mb-2">
              Tags
            </div>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  className="font-label-mono text-label-mono px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
                  href={`/blogs?tag=${encodeURIComponent(tag)}`}
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="p-space-md bg-surface-container-low rounded-lg space-y-2">
          <div className="font-label-mono text-label-mono text-outline uppercase tracking-wider mb-2">
            Note Actions
          </div>
          <button
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-colors text-left"
            type="button"
            onClick={copyLink}
          >
            <span className="material-symbols-outlined text-[16px] text-primary">
              link
            </span>
            <span>{copied ? "Link Copied!" : "Copy article link"}</span>
          </button>
          {/* <a
            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm transition-colors text-left"
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} by Adhokshaj Kulkarni`)}`}
            rel="noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">
              share
            </span>
            <span>Share to network</span>
          </a> */}
        </div>

        {/* <div className="p-space-md bg-surface-container-lowest rounded-lg font-label-mono text-label-mono text-outline space-y-1">
          <div className="flex items-center gap-1.5 text-on-surface-variant font-medium">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Obsidian Publish Core v1.7</span>
          </div>
          <div>
            Vault: <span className="text-on-surface">adhokshaj-cybersec</span>
          </div>
          <div>
            Encoding:{" "}
            <span className="text-on-surface">UTF-8 / Strict CommonMark</span>
          </div>
        </div> */}
      </aside>
    </>
  );
}
