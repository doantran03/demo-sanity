import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { Series } from "../types/series";

export default async function SeriesPage() {
  const allSeries : Series[] = await client.fetch(
    `*[_type == "series"] {
      "id": _id,
      "title": title,
      "description": description,
      "postCount": count(posts)
    }`,
    {},
    { next: { revalidate: 0 } }
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-8 text-indigo-700">Chuỗi bài viết (Series)</h1>
      <div className="grid gap-6">
        {allSeries.map((series: Series) => (
          <div key={series.id} className="border-2 border-indigo-50 p-6 rounded-xl hover:bg-indigo-50 transition">
            <Link href={`/series/${series.id}`}>
              <h2 className="text-2xl font-bold text-gray-800 hover:text-indigo-600">
                {series.title}
              </h2>
            </Link>
            <p className="text-gray-600 mt-2">{series.description}</p>
            <div className="mt-4 inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
              {series.postCount} bài viết trong chuỗi này
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}