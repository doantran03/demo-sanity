import { Test } from "@/app/types/test";
import { client } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import PortableText from "@/app/components/PortableText";
interface TestDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TestDetailPage({ params }: TestDetailPageProps) {
  const { id } = await params;

  const test: Test | null = await client.fetch(
    `*[_type == "test" && _id == $id][0] {
      "id": _id,
      "title": title,
      content
    }`,
    { id },
    { next: { revalidate: 0 } } 
  );

  if (!test) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto py-16 px-4">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-black mb-4 text-gray-900 leading-tight">
          {test.title}
        </h1>
        <div className="h-1.5 w-24 bg-blue-600 mx-auto rounded-full mt-4"></div>
      </header>
      
      <section>
        <PortableText value={test.content} />
      </section>

      <footer className="mt-16 pt-8 border-t border-gray-100 text-gray-400">
        <p className="text-xs uppercase tracking-widest font-mono">
          ID bài viết: {test.id}
        </p>
      </footer>
    </article>
  );
}