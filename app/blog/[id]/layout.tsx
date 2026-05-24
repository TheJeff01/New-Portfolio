import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { BlogArticle } from "@/app/types";

// Create a simple server-side client for fetching public data
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;

    const { data: blog } = await supabase
        .from("blog")
        .select("*")
        .eq("id", id)
        .single();

    const article = blog as BlogArticle;

    if (!article) {
        return {
            title: "Article Not Found",
        };
    }

    const title = `${article.title} | JeffTheDev Blog`;
    const description = article.excerpt || `Read ${article.title} on JeffTheDev.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
            publishedTime: article.created_at || undefined,
            url: `https://jeffthedev.vercel.app/blog/${id}`,
            images: [
                {
                    url: `https://jeffthedev.vercel.app/api/og?title=${encodeURIComponent(title)}&gradient=${encodeURIComponent(article.gradient || "blue")}`,
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`https://jeffthedev.vercel.app/api/og?title=${encodeURIComponent(title)}&gradient=${encodeURIComponent(article.gradient || "blue")}`],
        },
    };
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
