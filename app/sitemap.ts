import { MetadataRoute } from 'next'
import { createClient } from "@supabase/supabase-js"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.bludevs.site';

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return [{ url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 }];
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const [{ data: blogData }, { data: projectData }] = await Promise.all([
        supabase.from('blog_articles').select('id, updated_at, created_at').eq('is_archived', false),
        supabase.from('projects').select('id, updated_at, created_at')
    ]);

    const blogs = (blogData || []).map((post: any) => ({
        url: `${baseUrl}/blog/${post.id}`,
        lastModified: new Date(post.updated_at || post.created_at || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    const projects = (projectData || []).map((project: any) => ({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: new Date(project.updated_at || project.created_at || Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        ...projects,
        ...blogs,
    ]
}
