import Link from "next/link";
import { ArticleListItem } from "@/components/ArticleListItem";
import { AboutSection } from "@/components/AboutSection";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  const posts = getAllPosts();
  const latest = posts.slice(0, siteConfig.latestCount);

  return (
    <div className="flex flex-col w-full">
      <div className="w-full max-w-[700px] mx-auto px-margin md:px-margin-desktop py-space-xl flex flex-col gap-space-xl">
        {/* <header className="flex flex-col gap-space-sm pt-space-md">
          <div className="flex items-baseline justify-between gap-space-md">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
              {siteConfig.name}
            </h1>
            <span className="font-label-mono text-label-mono text-on-surface-variant/80 uppercase">
              0x00 · Index
            </span>
          </div>
          <p className="font-body-lg text-body-lg text-on-surface-variant font-normal leading-relaxed">
            {siteConfig.description}
          </p>
          <div className="flex items-center gap-space-xs font-label-mono text-label-mono text-outline pt-space-xs">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary/70" />
            <span>{siteConfig.tagline}</span>
          </div>
        </header> */}

        <section className="flex flex-col">
          <div className="flex items-baseline justify-between pb-space-md">
            <div className="flex items-center gap-space-sm">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Latest
              </h2>
              <span className="font-label-mono text-label-mono text-outline px-1.5 py-0.5 rounded bg-surface-container-high">
                {latest.length} posts
              </span>
            </div>
            <span className="font-label-mono text-label-mono text-outline">
              Sorted by date
            </span>
          </div>

          <div className="flex flex-col">
            {latest.map((post, i) => (
              <div key={post.slug}>
                <ArticleListItem post={post} variant="home" />
                {i < latest.length - 1 && (
                  <div className="w-full h-px bg-surface-container-high my-space-xs" />
                )}
              </div>
            ))}
          </div>

          <div className="pt-space-lg flex justify-start">
            <Link
              className="inline-flex items-center gap-space-xs font-label-mono text-label-mono text-primary hover:text-primary/80 transition-colors"
              href="/blogs"
            >
              <span>View all articles</span>
              <span className="font-body-md">→</span>
            </Link>
          </div>
        </section>

        <div className="p-space-md bg-surface-container-low flex flex-col gap-space-xs">
          <div className="font-label-mono text-label-mono text-outline uppercase tracking-wider">
            Research Focus · 2026
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            
          </p>
        </div>

        <AboutSection variant="home" />
      </div>
    </div>
  );
}
