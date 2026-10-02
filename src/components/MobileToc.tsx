"use client";

import { useState } from "react";
import type { TocItem } from "@/lib/markdown";

type Props = {
  toc: TocItem[];
};

export function MobileToc({ toc }: Props) {
  const [open, setOpen] = useState(false);

  if (toc.length === 0) return null;

  return (
    <div className="lg:hidden mb-space-lg">
      <button
        className="w-full flex items-center justify-between p-space-md bg-surface-container-low rounded-lg font-label-mono text-label-mono text-on-surface"
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="uppercase tracking-wider">On this page</span>
        <span className="material-symbols-outlined text-[18px]">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>
      {open && (
        <nav className="mt-space-sm p-space-md bg-surface-container-low rounded-lg space-y-1">
          {toc.map((item) => (
            <a
              key={item.id}
              className="block px-2.5 py-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-body-sm text-body-sm border-l-2 border-transparent"
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
            >
              <span className="font-label-mono text-label-mono text-outline mr-1.5">
                {String(item.index).padStart(2, "0")}
              </span>
              {item.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  );
}
