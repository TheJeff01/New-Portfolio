import { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { Project } from "@/app/types";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;

    const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    const project = data as Project;

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    const title = `${project.title} | JeffTheDev Portfolio`;
    const description = project.description || `View the ${project.title} case study on JeffTheDev.`;
    const images = project.banner_url ? [project.banner_url] : [];

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            url: `https://jeffthedev.vercel.app/projects/${id}`,
            images: images.length > 0 ? images : undefined,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: images.length > 0 ? images : undefined,
        },
    };
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
