import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import { visit } from "unist-util-visit";
import type { Root, Element, ElementContent } from "hast";
import type { Plugin } from "unified";
import { slugify } from "./format";

export type TocItem = {
  id: string;
  text: string;
  level: number;
  index: number;
};

/** Convert Obsidian callouts to HTML before parsing */
function preprocessCallouts(markdown: string): string {
  const lines = markdown.split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const calloutStart = line.match(/^>\s*\[!(\w+)\]\s*(.*)$/i);

    if (!calloutStart) {
      out.push(line);
      i += 1;
      continue;
    }

    const type = calloutStart[1].toLowerCase();
    const titleRest = calloutStart[2]?.trim() ?? "";
    const bodyLines: string[] = [];
    i += 1;

    while (i < lines.length && lines[i].startsWith(">")) {
      bodyLines.push(lines[i].replace(/^>\s?/, ""));
      i += 1;
    }

    const title = `[!${type.toUpperCase()}]${titleRest ? ` ${titleRest}` : ""}`;
    const body = bodyLines.join("\n").trim();

    out.push(
      `<div class="callout" data-type="${type}"><div class="callout-title">${escapeHtml(title)}</div><div class="callout-body">\n\n${body}\n\n</div></div>`,
    );
    out.push("");
  }

  return out.join("\n");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getText(node: ElementContent): string {
  if (node.type === "text") return node.value;
  if (node.type === "element") {
    return node.children.map(getText).join("");
  }
  return "";
}

const remarkWikilinks: Plugin = () => {
  return (tree) => {
    visit(
      tree,
      "text",
      (
        node: { value: string },
        index: number | undefined,
        parent: { children: unknown[] } | undefined,
      ) => {
        if (!parent || typeof index !== "number") return;
        const value = node.value;
        if (!value.includes("[[")) return;

        const parts: unknown[] = [];
        const regex = /\[\[([^\]]+)\]\]/g;
        let last = 0;
        let match: RegExpExecArray | null;

        while ((match = regex.exec(value)) !== null) {
          if (match.index > last) {
            parts.push({ type: "text", value: value.slice(last, match.index) });
          }
          const target = match[1];
          const [label, alias] = target.includes("|")
            ? target.split("|")
            : [target, target];
          parts.push({
            type: "link",
            url: `/blogs/${slugify(label.trim())}`,
            data: {
              hProperties: { className: ["wikilink"] },
            },
            children: [{ type: "text", value: `[[${alias.trim()}]]` }],
          });
          last = match.index + match[0].length;
        }

        if (last < value.length) {
          parts.push({ type: "text", value: value.slice(last) });
        }

        if (parts.length) {
          parent.children.splice(index, 1, ...parts);
        }
      },
    );
  };
};

const rehypeWrapTables: Plugin = () => {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      const el = node as Element;
      if (el.tagName !== "table" || !parent || typeof index !== "number") return;
      const wrapper: Element = {
        type: "element",
        tagName: "div",
        properties: { className: ["table-wrapper"] },
        children: [el],
      };
      (parent as Element).children[index] = wrapper;
    });
  };
};

function rehypeExtractToc(toc: TocItem[]): Plugin {
  return () => {
    return (tree) => {
      let index = 0;
      visit(tree, "element", (node) => {
        const el = node as Element;
        if (!["h2", "h3"].includes(el.tagName)) return;
        const id = String(el.properties?.id ?? "");
        const text = el.children.map(getText).join("").trim();
        if (!id || !text) return;
        index += 1;
        toc.push({
          id,
          text,
          level: el.tagName === "h2" ? 2 : 3,
          index,
        });
      });
    };
  };
}

const rehypeCodeBlockChrome: Plugin = () => {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      const el = node as Element;
      if (el.tagName !== "pre" || !parent || typeof index !== "number") return;
      const parentEl = parent as Element;
      if (
        parentEl.tagName === "div" &&
        Array.isArray(parentEl.properties?.className) &&
        (parentEl.properties?.className as string[]).includes(
          "code-block-wrapper",
        )
      ) {
        return;
      }

      const lang = (el.properties?.["data-language"] as string) || "code";

      const header: Element = {
        type: "element",
        tagName: "div",
        properties: { className: ["code-block-header"] },
        children: [
          {
            type: "element",
            tagName: "span",
            properties: { className: ["text-on-surface-variant"] },
            children: [{ type: "text", value: String(lang) }],
          },
        ],
      };

      const wrapper: Element = {
        type: "element",
        tagName: "div",
        properties: { className: ["code-block-wrapper"] },
        children: [header, el],
      };

      parentEl.children[index] = wrapper;
    });
  };
};

export async function renderMarkdown(markdown: string): Promise<{
  html: string;
  toc: TocItem[];
}> {
  const toc: TocItem[] = [];
  const prepared = preprocessCallouts(markdown);

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkWikilinks)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: {
        dark: "github-dark-dimmed",
        light: "github-light",
      },
      keepBackground: false,
    })
    .use(rehypeWrapTables)
    .use(rehypeCodeBlockChrome)
    .use(rehypeExtractToc(toc))
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(prepared);

  return {
    html: String(file),
    toc,
  };
}
