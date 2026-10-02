import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  tags: string[];
  published?: boolean;
  category?: string;
  categories?: string[];
  sectionLabels?: Record<string, string>;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: string;
  readingMinutes: number;
};

export type Post = PostMeta & {
  content: string;
};

function ensureContentDir() {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

function parsePost(filename: string): Post {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  return {
    slug,
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    published: data.published !== false,
    category: data.category ? String(data.category) : undefined,
    categories: Array.isArray(data.categories)
      ? data.categories.map(String)
      : undefined,
    sectionLabels:
      data.sectionLabels && typeof data.sectionLabels === "object"
        ? (data.sectionLabels as Record<string, string>)
        : undefined,
    readingTime: stats.text,
    readingMinutes: Math.max(1, Math.ceil(stats.minutes)),
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  ensureContentDir();
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  return files
    .map((file) => {
      const post = parsePost(file);
      const { content: _content, ...meta } = post;
      return meta;
    })
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  ensureContentDir();
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const post = parsePost(`${slug}.md`);
  if (!post.published) return null;
  return post;
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

export function getAllTags(posts?: PostMeta[]): { tag: string; count: number }[] {
  const list = posts ?? getAllPosts();
  const counts = new Map<string, number>();

  for (const post of list) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getAdjacentPosts(slug: string): {
  prev: PostMeta | null;
  next: PostMeta | null;
} {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };

  return {
    // chronological: newer first, so "previous" is older (index + 1)
    prev: posts[index + 1] ?? null,
    next: posts[index - 1] ?? null,
  };
}

export function getRelatedPosts(slug: string, limit = 3): PostMeta[] {
  const posts = getAllPosts();
  const current = posts.find((p) => p.slug === slug);
  if (!current) return posts.filter((p) => p.slug !== slug).slice(0, limit);

  const scored = posts
    .filter((p) => p.slug !== slug)
    .map((p) => {
      const overlap = p.tags.filter((t) => current.tags.includes(t)).length;
      return { post: p, overlap };
    })
    .sort((a, b) => b.overlap - a.overlap || new Date(b.post.date).getTime() - new Date(a.post.date).getTime());

  return scored.slice(0, limit).map((s) => s.post);
}
