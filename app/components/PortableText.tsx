import Image from "next/image";
import { PortableText as PortableTextComponent, PortableTextComponents } from "@portabletext/react";
import { PortableTextBlock } from "@portabletext/types";
import { urlFor } from "@/sanity/lib/image";

interface SanityImage {
  asset: {
    _ref: string;
    _type: "reference";
  };
  alt?: string;
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage }) => {
      if (!value?.asset?._ref) return null;

      return (
        <div className="my-10 relative w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || "Hình ảnh bài viết"}
            width={1200}
            height={700}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="w-full h-auto object-cover"
          />
          {value.alt && (
            <span className="block text-center text-gray-500 italic mt-3 text-sm font-medium">
              {value.alt}
            </span>
          )}
        </div>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href || "";
      const rel = !href.startsWith("/") ? "noreferrer noopener" : undefined;
      return (
        <a href={href} rel={rel} className="text-blue-600 underline hover:text-blue-800 transition-colors">
          {children}
        </a>
      );
    },
  },
  block: {
    h2: ({ children }) => <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-800">{children}</h2>,
    h3: ({ children }) => <h3 className="text-2xl font-semibold mt-8 mb-3 text-gray-800">{children}</h3>,
    normal: ({ children }) => <p className="mb-5 leading-relaxed text-gray-700">{children}</p>,
  },
};

interface PortableTextProps {
  value: PortableTextBlock[];
}

export default function PortableText({ value }: PortableTextProps) {
  if (!value) return null;

  return (
    <div className="prose prose-blue lg:prose-xl max-w-none">
      <PortableTextComponent value={value} components={components} />
    </div>
  );
}