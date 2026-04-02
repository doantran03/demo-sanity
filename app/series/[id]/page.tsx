// app/series/[id]/page.tsx
import { Series } from "@/app/types/series";
import { client } from "@/sanity/lib/client";
import Link from "next/link";
import { notFound } from "next/navigation";

interface SeriesDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function SeriesDetailPage({ params }: SeriesDetailPageProps) {
  const { id } = await params;

  const series : Series = await client.fetch(
    `*[_type == "series" && _id == $id][0] {
      "id": _id,
      "title": title,
      "description": description,
      "posts": posts[]-> {
        "id": _id,
        "title": title,
        "authorName": author->name
      }
    }`,
    { id },
    { next: { revalidate: 0 } }
  );

  if (!series) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <div className="mb-12 border-b pb-8">
        <Link href="/series" className="text-indigo-600 text-sm font-medium hover:underline">
          ← Quay lại tất cả Series
        </Link>
        <h1 className="text-5xl font-black text-gray-900 mt-4">{series.title}</h1>
        <p className="text-xl text-gray-600 mt-4 italic">{series.description}</p>
      </div>

      <h3 className="text-lg font-bold uppercase tracking-widest text-gray-400 mb-6">
        Danh sách bài viết trong series
      </h3>

      <div className="space-y-4">
        {series.posts && series.posts.length > 0 ? (
          series.posts.map((post: { id: string; title: string; authorName: string }, index: number) => (
            <div key={post.id} className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow-sm hover:border-indigo-300">
              <span className="text-3xl font-black text-gray-200">{index + 1}</span>
              <div className="flex-1">
                <Link href={`/posts/${post.id}`}>
                  <h4 className="text-xl font-bold text-gray-800 hover:text-indigo-600 transition">
                    {post.title}
                  </h4>
                </Link>
                <p className="text-sm text-gray-500">Tác giả: {post.authorName}</p>
              </div>
              <Link href={`/posts/${post.id}`} className="text-gray-400 hover:text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Series này hiện chưa có bài viết nào.</p>
        )}
      </div>
    </div>
  );
}