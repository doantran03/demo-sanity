import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { Post } from "../types/post";

export default async function PostsPage() {
  const posts : Post[] = await await client.fetch(
    `*[_type == "post"] {
      "id": _id,
      "title": title,
      "authorName": author->fullName,
      "content": content
    }`,
    {},
    {
        next: { revalidate: 0 }
    }
    );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8">Tất cả bài viết</h1>
      
      <div className="grid gap-6">
        {posts.map((post: Post) => (
          <article key={post.id} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <Link href={`/posts/${post.id}`}>
              <h2 className="text-2xl font-semibold text-blue-600 hover:underline">
                {post.title}
              </h2>
            </Link>
            
            <div className="flex items-center text-gray-500 text-sm mt-2">
              <span>Bởi **{post.authorName}**</span>
              <span className="mx-2">•</span>
            </div>

            <p className="mt-3 text-gray-700">
              {post.content || "Bấm vào để đọc chi tiết bài viết..."}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}