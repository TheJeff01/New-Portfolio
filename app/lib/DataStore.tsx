"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { createClient } from "@/app/lib/supabase";
import type {
    Project,
    VideoItem,
    InstagramPost,
    BlogArticle,
    Testimonial,
    Profile,
} from "@/app/types";

// ── Default fallback data (used when Supabase is unreachable) ──
import { projects as defaultProjects } from "@/app/data/projects";
import { profile as defaultProfile } from "@/app/data/profile";

interface DataStore {
    projects: Project[];
    videos: VideoItem[];
    instagram: InstagramPost[];
    blog: BlogArticle[];
    testimonials: Testimonial[];
    profile: Profile;
    loading: boolean;
    // CRUD operations
    addProject: (project: Omit<Project, "id">) => Promise<void>;
    updateProject: (id: string, data: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    addVideo: (video: Omit<VideoItem, "id">) => Promise<void>;
    updateVideo: (id: string, data: Partial<VideoItem>) => Promise<void>;
    deleteVideo: (id: string) => Promise<void>;
    addInstagramPost: (post: Omit<InstagramPost, "id">) => Promise<void>;
    updateInstagramPost: (id: string, data: Partial<InstagramPost>) => Promise<void>;
    deleteInstagramPost: (id: string) => Promise<void>;
    addBlogArticle: (article: Omit<BlogArticle, "id">) => Promise<void>;
    updateBlogArticle: (id: string, data: Partial<BlogArticle>) => Promise<void>;
    deleteBlogArticle: (id: string) => Promise<void>;
    addTestimonial: (testimonial: Omit<Testimonial, "id">) => Promise<void>;
    updateTestimonial: (id: string, data: Partial<Testimonial>) => Promise<void>;
    deleteTestimonial: (id: string) => Promise<void>;
    updateProfile: (data: Partial<Profile>) => Promise<void>;
    refreshData: () => Promise<void>;
    // Storage helpers
    uploadFile: (bucket: string, path: string, file: File, onProgress?: (progress: number) => void) => Promise<string | null>;
    deleteFile: (bucket: string, path: string) => Promise<void>;
    getPublicUrl: (bucket: string, path: string) => string;
}

const DataStoreContext = createContext<DataStore | null>(null);

export function useDataStore() {
    const ctx = useContext(DataStoreContext);
    if (!ctx) throw new Error("useDataStore must be used within DataProvider");
    return ctx;
}

// Map old Project format (camelCase) to new DB format (snake_case)
function mapProjectFromLegacy(p: Record<string, unknown>): Project {
    return {
        id: (p.id as string) || "",
        title: (p.title as string) || "",
        description: (p.description as string) || "",
        category: (p.category as Project["category"]) || "Web Dev",
        status: (p.status as Project["status"]) || "Ongoing",
        tech_stack: (p.tech_stack as string[]) || (p.techStack as string[]) || [],
        gradient: (p.gradient as string) || "from-emerald-500 to-teal-600",
        icon: (p.icon as string) || "🚀",
        long_description: (p.long_description as string) || (p.longDescription as string) || undefined,
        challenge: (p.challenge as string) || undefined,
        solution: (p.solution as string) || undefined,
        results: (p.results as string) || undefined,
        images: (p.images as string[]) || [],
        banner_url: (p.banner_url as string) || (p.bannerUrl as string) || undefined,
        live_url: (p.live_url as string) || (p.liveUrl as string) || undefined,
        repo_url: (p.repo_url as string) || (p.repoUrl as string) || undefined,
        sort_order: (p.sort_order as number) || 0,
        created_at: (p.created_at as string) || undefined,
        updated_at: (p.updated_at as string) || undefined,
    };
}

function mapProfileFromLegacy(p: Record<string, unknown>): Profile {
    return {
        id: (p.id as string) || undefined,
        name: (p.name as string) || "Dwayne",
        tagline: (p.tagline as string) || "",
        bio: (p.bio as string) || "",
        location: (p.location as string) || "",
        email: (p.email as string) || "",
        interests: (p.interests as string[]) || [],
        social_links: (p.social_links as Profile["social_links"]) || (p.socialLinks as Profile["social_links"]) || [],
    };
}

function mapBlogArticleFromLegacy(a: Record<string, unknown>): BlogArticle {
    return {
        id: (a.id as string) || "",
        title: (a.title as string) || "",
        excerpt: (a.excerpt as string) || "",
        content: (a.content as string) || "",
        date: (a.date as string) || "",
        read_time: (a.read_time as string) || (a.readTime as string) || "",
        gradient: (a.gradient as string) || "from-rose-500/20 to-pink-600/20",
        tag: (a.tag as string) || "",
        is_archived: (a.is_archived as boolean) || (a.isArchived as boolean) || false,
        sort_order: (a.sort_order as number) || 0,
        created_at: (a.created_at as string) || undefined,
        updated_at: (a.updated_at as string) || undefined,
    };
}

export function DataProvider({ children }: { children: ReactNode }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [instagram, setInstagram] = useState<InstagramPost[]>([]);
    const [blog, setBlog] = useState<BlogArticle[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [profile, setProfile] = useState<Profile>(mapProfileFromLegacy(defaultProfile as unknown as Record<string, unknown>));
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    // ── Fetch all data from Supabase ──
    const refreshData = useCallback(async () => {
        try {
            const [
                { data: projData },
                { data: vidData },
                { data: igData },
                { data: blogData },
                { data: testiData },
                { data: profileData },
            ] = await Promise.all([
                supabase.from("projects").select("*").order("sort_order", { ascending: true }),
                supabase.from("videos").select("*").order("sort_order", { ascending: true }),
                supabase.from("instagram_posts").select("*").order("sort_order", { ascending: true }),
                supabase.from("blog_articles").select("*").order("sort_order", { ascending: true }),
                supabase.from("testimonials").select("*").order("sort_order", { ascending: true }),
                supabase.from("profile").select("*").limit(1).single(),
            ]);

            if (projData) setProjects(projData.map((p) => mapProjectFromLegacy(p as unknown as Record<string, unknown>)));
            if (vidData) setVideos(vidData as VideoItem[]);
            if (igData) setInstagram(igData as InstagramPost[]);
            if (blogData) setBlog(blogData.map((a) => mapBlogArticleFromLegacy(a as unknown as Record<string, unknown>)));
            if (testiData) setTestimonials(testiData as Testimonial[]);
            if (profileData) setProfile(mapProfileFromLegacy(profileData as unknown as Record<string, unknown>));
        } catch (err) {
            console.error("Failed to fetch data from Supabase:", err);
            // Fall back to defaults
            setProjects(defaultProjects.map((p) => mapProjectFromLegacy(p as unknown as Record<string, unknown>)));
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    // ── Projects CRUD ──
    const addProject = useCallback(async (project: Omit<Project, "id">) => {
        const { data, error } = await supabase.from("projects").insert(project).select().single();
        if (error) { console.error("addProject error:", error); return; }
        setProjects((prev) => [...prev, mapProjectFromLegacy(data as unknown as Record<string, unknown>)]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
        const { error } = await supabase.from("projects").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id);
        if (error) { console.error("updateProject error:", error); return; }
        setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteProject = useCallback(async (id: string) => {
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) { console.error("deleteProject error:", error); return; }
        setProjects((prev) => prev.filter((p) => p.id !== id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Videos CRUD ──
    const addVideo = useCallback(async (video: Omit<VideoItem, "id">) => {
        const { data, error } = await supabase.from("videos").insert(video).select().single();
        if (error) { console.error("addVideo error:", error); return; }
        setVideos((prev) => [...prev, data as VideoItem]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateVideo = useCallback(async (id: string, data: Partial<VideoItem>) => {
        const { error } = await supabase.from("videos").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id);
        if (error) { console.error("updateVideo error:", error); return; }
        setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, ...data } : v)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteVideo = useCallback(async (id: string) => {
        const { error } = await supabase.from("videos").delete().eq("id", id);
        if (error) { console.error("deleteVideo error:", error); return; }
        setVideos((prev) => prev.filter((v) => v.id !== id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Instagram CRUD ──
    const addInstagramPost = useCallback(async (post: Omit<InstagramPost, "id">) => {
        const { data, error } = await supabase.from("instagram_posts").insert(post).select().single();
        if (error) { console.error("addInstagramPost error:", error); return; }
        setInstagram((prev) => [...prev, data as InstagramPost]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateInstagramPost = useCallback(async (id: string, data: Partial<InstagramPost>) => {
        const { error } = await supabase.from("instagram_posts").update(data).eq("id", id);
        if (error) { console.error("updateInstagramPost error:", error); return; }
        setInstagram((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteInstagramPost = useCallback(async (id: string) => {
        const { error } = await supabase.from("instagram_posts").delete().eq("id", id);
        if (error) { console.error("deleteInstagramPost error:", error); return; }
        setInstagram((prev) => prev.filter((p) => p.id !== id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Blog CRUD ──
    const addBlogArticle = useCallback(async (article: Omit<BlogArticle, "id">) => {
        const { data, error } = await supabase.from("blog_articles").insert(article).select().single();
        if (error) { console.error("addBlogArticle error:", error); return; }
        setBlog((prev) => [...prev, data as BlogArticle]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateBlogArticle = useCallback(async (id: string, data: Partial<BlogArticle>) => {
        const { error } = await supabase.from("blog_articles").update({ ...data, updated_at: new Date().toISOString() }).eq("id", id);
        if (error) { console.error("updateBlogArticle error:", error); return; }
        setBlog((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteBlogArticle = useCallback(async (id: string) => {
        const { error } = await supabase.from("blog_articles").delete().eq("id", id);
        if (error) { console.error("deleteBlogArticle error:", error); return; }
        setBlog((prev) => prev.filter((a) => a.id !== id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Testimonials CRUD ──
    const addTestimonial = useCallback(async (testimonial: Omit<Testimonial, "id">) => {
        const { data, error } = await supabase.from("testimonials").insert(testimonial).select().single();
        if (error) { console.error("addTestimonial error:", error); return; }
        setTestimonials((prev) => [...prev, data as Testimonial]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateTestimonial = useCallback(async (id: string, data: Partial<Testimonial>) => {
        const { error } = await supabase.from("testimonials").update(data).eq("id", id);
        if (error) { console.error("updateTestimonial error:", error); return; }
        setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteTestimonial = useCallback(async (id: string) => {
        const { error } = await supabase.from("testimonials").delete().eq("id", id);
        if (error) { console.error("deleteTestimonial error:", error); return; }
        setTestimonials((prev) => prev.filter((t) => t.id !== id));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Profile ──
    const updateProfileFn = useCallback(async (data: Partial<Profile>) => {
        // Get existing profile ID
        const profileId = profile.id;
        if (profileId) {
            const { error } = await supabase.from("profile").update({ ...data, updated_at: new Date().toISOString() }).eq("id", profileId);
            if (error) { console.error("updateProfile error:", error); return; }
        }
        setProfile((prev) => ({ ...prev, ...data }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profile.id]);

    // ── Storage helpers ──
    const uploadFile = useCallback(async (bucket: string, path: string, file: File, onProgress?: (progress: number) => void): Promise<string | null> => {
        if (onProgress) {
            return new Promise(async (resolve, reject) => {
                const { data: sessionData } = await supabase.auth.getSession();
                const session = sessionData?.session;

                const xhr = new XMLHttpRequest();
                const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucket}/${path}`;

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = Math.round((event.loaded / event.total) * 100);
                        onProgress(percentComplete);
                    }
                };

                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
                        resolve(data.publicUrl);
                    } else {
                        console.error("Upload error:", xhr.responseText);
                        resolve(null);
                    }
                };

                xhr.onerror = () => {
                    console.error("Upload error");
                    resolve(null);
                };

                xhr.open("POST", url, true);
                if (session?.access_token) {
                    xhr.setRequestHeader("Authorization", `Bearer ${session.access_token}`);
                } else {
                    xhr.setRequestHeader("Authorization", `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`);
                }

                const xCustomHeaders = {
                    "upsert": "true",
                };
                xhr.setRequestHeader("x-upsert", "true");

                const formData = new FormData();
                formData.append("key", file.name);
                formData.append("file", file);

                xhr.send(formData);
            });
        }

        const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
        if (error) { console.error("Upload error:", error); return null; }
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const deleteFile = useCallback(async (bucket: string, path: string) => {
        const { error } = await supabase.storage.from(bucket).remove([path]);
        if (error) console.error("Delete file error:", error);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getPublicUrl = useCallback((bucket: string, path: string): string => {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <DataStoreContext.Provider
            value={{
                projects,
                videos,
                instagram,
                blog,
                testimonials,
                profile,
                loading,
                addProject,
                updateProject,
                deleteProject,
                addVideo,
                updateVideo,
                deleteVideo,
                addInstagramPost,
                updateInstagramPost,
                deleteInstagramPost,
                addBlogArticle,
                updateBlogArticle,
                deleteBlogArticle,
                addTestimonial,
                updateTestimonial,
                deleteTestimonial,
                updateProfile: updateProfileFn,
                refreshData,
                uploadFile,
                deleteFile,
                getPublicUrl,
            }}
        >
            {children}
        </DataStoreContext.Provider>
    );
}
