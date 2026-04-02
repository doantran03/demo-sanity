import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { Test } from "../types/test";

export default async function TestPage() {
  const tests : Test[] = await client.fetch(
    `*[_type == "test"] {
      "id": _id,
      "title": title,
      "content": content[]
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
        {tests.map((test: Test) => (
          <article key={test.id} className="border p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <Link href={`/test/${test.id}`}>
              <h2 className="text-2xl font-semibold text-blue-600 hover:underline">
                {test.title}
              </h2>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}