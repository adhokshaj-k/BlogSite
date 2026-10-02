import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-outline-variant/40 py-space-lg">
      <div className="max-w-4xl mx-auto px-margin md:px-margin-desktop flex flex-col sm:flex-row items-center justify-between gap-space-md text-center sm:text-left">
        <div className="font-label-mono text-label-mono text-on-surface-variant">
          © 2026 {siteConfig.name}. All rights reserved.
        </div>
        <div className="flex items-center gap-space-md font-label-mono text-label-mono text-on-surface-variant">
          <a
            className="hover:text-primary transition-colors"
            href={siteConfig.github}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
          <span className="text-outline-variant">·</span>
          <a
            className="hover:text-primary transition-colors"
            href={siteConfig.linkedin}
            rel="noreferrer"
            target="_blank"
          >
            LinkedIn
          </a>
          <span className="text-outline-variant">·</span>
          <a
            className="hover:text-primary transition-colors"
            href={siteConfig.tryhackme}
            rel="noreferrer"
            target="_blank"
          >
            TryHackMe
          </a>
          <span className="text-outline-variant">·</span>
          <a
            className="hover:text-primary transition-colors"
            href={siteConfig.hackthebox}
            rel="noreferrer"
            target="_blank"
          >
            Hack the Box
          </a>
        </div>
      </div>
    </footer>
  );
}
