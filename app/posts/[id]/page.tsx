import { Post } from "@/app/types/post";
import { client } from "@/sanity/lib/client";
import { PortableText } from "next-sanity";
import { notFound } from "next/navigation";

interface PostDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params;

  const post: Post | null = await client.fetch(
    `*[_type == "post" && _id == $id][0] {
      "id": _id,
      "title": title,
      "authorName": author->fullName,
      "content": content
    }`,
    { id },
    { next: { revalidate: 0 } }
  );

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-16 px-4">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold mb-4">{post.title}</h1>
        <div className="flex items-center gap-2 text-gray-600">
          <span className="font-medium">Tác giả: {post.authorName}</span>
        </div>
      </header>

      {/* Render nội dung bài viết */}
      <div className="prose lg:prose-xl">
        {typeof post.content === "string" ? (
          <p>{post.content}</p>
        ) : (
          <PortableText value={post.content} />
        )}
      </div>

      <footer className="mt-12 pt-8 border-t">
        <p className="text-sm text-gray-500 italic">
          ID bài viết: {post.id}
        </p>
      </footer>
    </article>
  );
}