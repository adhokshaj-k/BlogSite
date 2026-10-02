import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAdjacentPosts,
  getAllSlugs,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/posts";
import { renderMarkdown } from "@/lib/markdown";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/site";
import { MarkdownContent } from "@/components/MarkdownContent";
import { ArticleSidebar } from "@/components/ArticleSidebar";
import { MobileToc } from "@/components/MobileToc";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not found" };

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blogs/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { html, toc } = await renderMarkdown(post.content);
  const { prev, next } = getAdjacentPosts(slug);
  const related = getRelatedPosts(slug, 3);
  const categories = post.categories ?? post.tags.slice(0, 2);

  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full">
        <div className="absolute inset-0 h-96 pointer-events-none bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

        <div className="max-w-6xl mx-auto px-margin md:px-margin-desktop py-space-xl">
          <div className="flex flex-col lg:flex-row items-start justify-center gap-12 relative">
            <article className="w-full max-w-[720px] shrink min-w-0">
              <header className="space-y-space-md pb-space-lg">
                <div className="flex items-center gap-space-xs font-label-mono text-label-mono text-outline flex-wrap">
                  {categories.map((cat, i) => (
                    <span key={cat} className="contents">
                      {i > 0 && <span className="text-outline-variant">/</span>}
                      <span
                        className={
                          i === 0
                            ? "text-primary font-medium tracking-normal"
                            : i === categories.length - 1
                              ? "text-on-surface-variant"
                              : undefined
                        }
                      >
                        {cat}
                      </span>
                    </span>
                  ))}
                </div>

                <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-tight">
                  {post.title}
                </h1>

                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  {post.description}
                </p>

                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-space-xs text-outline font-label-mono text-label-mono">
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[15px] text-primary">
                      calendar_today
                    </span>
                    <span>{formatDate(post.date)}</span>
                  </div>
                  <span className="text-outline-variant">•</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px]">
                      timer
                    </span>
                    <span>{post.readingMinutes} min read</span>
                  </div>
                </div>

                <div className="w-full h-px bg-surface-container-high my-space-md" />
              </header>

              <MobileToc toc={toc} />

              <MarkdownContent html={html} />

              <footer className="mt-space-xl pt-space-lg space-y-space-lg">
                <div className="w-full h-px bg-surface-container-high" />

                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-label-mono text-label-mono text-outline uppercase tracking-wider mr-1">
                    Tags:
                  </span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      className="font-label-mono text-label-mono px-2 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
                      href={`/blogs?tag=${encodeURIComponent(tag)}`}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  {prev ? (
                    <Link
                      className="group p-space-md bg-surface-container-low hover:bg-surface-container rounded-lg transition-colors flex flex-col justify-between"
                      href={`/blogs/${prev.slug}`}
                    >
                      <span className="font-label-mono text-label-mono text-outline flex items-center gap-1 group-hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[15px]">
                          arrow_back
                        </span>
                        <span>Previous Entry</span>
                      </span>
                      <span className="font-body-md text-body-md text-on-surface font-medium mt-2 group-hover:text-primary transition-colors">
                        {prev.title}
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {next ? (
                    <Link
                      className="group p-space-md bg-surface-container-low hover:bg-surface-container rounded-lg transition-colors flex flex-col justify-between text-left sm:text-right"
                      href={`/blogs/${next.slug}`}
                    >
                      <span className="font-label-mono text-label-mono text-outline flex items-center justify-start sm:justify-end gap-1 group-hover:text-primary transition-colors">
                        <span>Next Entry</span>
                        <span className="material-symbols-outlined text-[15px]">
                          arrow_forward
                        </span>
                      </span>
                      <span className="font-body-md text-body-md text-on-surface font-medium mt-2 group-hover:text-primary transition-colors">
                        {next.title}
                      </span>
                    </Link>
                  ) : null}
                </div>

                {related.length > 0 && (
                  <div className="bg-surface-container-low p-space-md rounded-lg space-y-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-label-mono text-label-mono text-outline uppercase tracking-wider">
                        Related Notes from Vault
                      </span>
                      <Link
                        className="font-label-mono text-label-mono text-primary hover:underline"
                        href="/blogs"
                      >
                        Explore all →
                      </Link>
                    </div>
                    <ul className="divide-y divide-surface-container space-y-1">
                      {related.map((r, i) => (
                        <li
                          key={r.slug}
                          className={`pt-2 ${i === 0 ? "first:pt-0" : ""}`}
                        >
                          <Link
                            className="flex items-center justify-between py-1 group"
                            href={`/blogs/${r.slug}`}
                          >
                            <span className="font-body-sm text-body-sm text-on-surface group-hover:text-primary transition-colors">
                              {r.title}
                            </span>
                            <span className="font-label-mono text-label-mono text-outline shrink-0 ml-2">
                              {r.readingMinutes}m read
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-space-md bg-surface-container-low rounded-lg flex flex-col sm:flex-row items-center sm:items-start gap-space-md">
                  <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-code-block text-body-lg font-semibold">
                    AK
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <span className="font-body-md text-body-md font-medium text-on-surface">
                        {siteConfig.name}
                      </span>
                      <span className="font-label-mono text-label-mono px-1.5 py-0.5 rounded bg-surface-container text-tertiary">

                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      MCA student interested in offensive
                      security, systems architecture, Linux internals, and
                      automation. Learning by engineering tools and tearing
                      protocols apart.
                    </p>
                    <div className="pt-1 flex items-center justify-center sm:justify-start gap-3 font-label-mono text-label-mono text-primary">
                      <a
                        className="hover:underline"
                        href={siteConfig.github}
                        rel="noreferrer"
                        target="_blank"
                      >
                        GitHub
                      </a>
                      <span className="text-outline-variant">•</span>
                      <a
                        className="hover:underline"
                        href={siteConfig.linkedin}
                        rel="noreferrer"
                        target="_blank"
                      >
                        LinkedIn
                      </a>
                      <span className="text-outline-variant">•</span>
                      <a
                        className="text-primary hover:underline underline-offset-4 transition-colors"
                        href={siteConfig.tryhackme}
                        rel="noreferrer"
                        target="_blank"
                      >
                        TryHackMe
                      </a>
                      <span className="text-outline-variant">·</span>
                      <a
                        className="text-primary hover:underline underline-offset-4 transition-colors"
                        href={siteConfig.hackthebox}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Hack the Box
                      </a>
                    </div>
                  </div>
                </div>
              </footer>
            </article>

            <ArticleSidebar
              readingMinutes={post.readingMinutes}
              tags={post.tags}
              title={post.title}
              toc={toc}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
