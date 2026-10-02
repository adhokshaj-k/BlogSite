"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchDialog } from "./SearchDialog";
import type { PostMeta } from "@/lib/posts";

type Props = {
  posts: PostMeta[];
};

export function Header({ posts }: Props) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isHome = pathname === "/";
  const isBlogs = pathname.startsWith("/blogs");

  const navClass = (active: boolean) =>
    active
      ? "transition-colors text-primary font-medium border-b border-primary pb-0.5"
      : "font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface border-b border-outline-variant/40">
        <div className="h-14 max-w-4xl mx-auto px-margin md:px-margin-desktop flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <Link
              className="flex items-center gap-1.5 text-on-surface hover:text-primary transition-colors"
              href="/"
            >
              <span className="font-code-block text-body-md font-medium tracking-tight text-on-surface">
                Adhokshaj
              </span>
              <span className="inline-block w-1.5 h-3.5 bg-primary animate-pulse" />
            </Link>
          </div>
          <div className="flex items-center gap-space-md">
            <nav className="hidden sm:flex items-center gap-space-lg">
              <Link className={navClass(isHome)} href="/">
                Home
              </Link>
              <Link className={navClass(isBlogs)} href="/blogs">
                Blogs
              </Link>
              <Link
                className={navClass(false)}
                href={isHome ? "#about" : "/#about"}
              >
                About
              </Link>
            </nav>
            <div className="flex items-center gap-space-sm pl-space-sm border-l border-outline-variant/40">
              <button
                aria-label="Search"
                className="flex items-center gap-space-xs px-2 py-1 border border-outline-variant/60 rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:border-outline transition-colors text-left"
                type="button"
                onClick={() => setSearchOpen(true)}
              >
                <span className="material-symbols-outlined text-[16px]">
                  search
                </span>
                <span className="hidden md:inline font-label-mono text-label-mono text-on-surface-variant">
                  ⌘K
                </span>
              </button>
              <ThemeToggle />
              {/* <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">
                  person
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </header>
      <SearchDialog
        open={searchOpen}
        posts={posts}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
