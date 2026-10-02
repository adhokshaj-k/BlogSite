import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogsClient } from "@/components/BlogsClient";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = {
  title: "All Articles",
  description:
    "A searchable collection of technical notes, vulnerability breakdowns, and engineering writeups.",
  alternates: {
    canonical: "/blogs",
  },
};

export default function BlogsPage() {
  const posts = getAllPosts();
  const tags = getAllTags(posts);

  return (
    <div className="flex flex-col w-full">
      <Suspense fallback={null}>
        <BlogsClient posts={posts} tags={tags} />
      </Suspense>
    </div>
  );
}
