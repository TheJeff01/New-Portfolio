"use client";

import { useState } from "react";
import { useDataStore } from "@/app/lib/DataStore";
import type { VideoItem } from "@/app/types";
import { Plus, Pencil, Trash2, Check, Play } from "lucide-react";
import ConfirmModal from "@/app/admin/components/ConfirmModal";

const gradientOptions = [
    "from-violet-600 to-indigo-800", "from-rose-600 to-pink-800",
    "from-cyan-600 to-blue-800", "from-amber-600 to-orange-800",
    "from-emerald-600 to-green-800", "from-red-600 to-rose-800",
];

const emptyVideo: Omit<VideoItem, "id"> = {
    title: "", views: "0", likes: "0", gradient: gradientOptions[0], tag: "", duration: "0:00", orientation: "landscape"
};

export default function VideosAdmin() {
    const { videos, addVideo, updateVideo, deleteVideo, uploadFile } = useDataStore();
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState(emptyVideo);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [itemToDelete, setItemToDelete] = useState<{ id: string, title?: string } | null>(null);

    const startCreate = () => { setCreating(true); setEditing(null); setForm(emptyVideo); };
    const startEdit = (v: VideoItem) => { setEditing(v.id); setCreating(false); setForm(v); };
    const handleCancel = () => { setCreating(false); setEditing(null); setForm(emptyVideo); };

    const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);
        try {
            // Calculate video duration locally before upload
            const videoUrlObj = URL.createObjectURL(file);
            const videoElement = document.createElement('video');
            videoElement.src = videoUrlObj;

            videoElement.addEventListener('loadedmetadata', async () => {
                const totalSeconds = Math.round(videoElement.duration);
                const minutes = Math.floor(totalSeconds / 60);
                const seconds = totalSeconds % 60;
                const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

                URL.revokeObjectURL(videoUrlObj);

                // Now upload to Supabase
                const path = `showcase/${Date.now()}-${file.name}`;
                const url = await uploadFile("videos", path, file, (progress) => {
                    setUploadProgress(progress);
                });

                if (url) {
                    setForm(prev => ({ ...prev, video_url: url, duration: formattedDuration }));
                }
                setIsUploading(false);
                setUploadProgress(0);
            });

            videoElement.addEventListener('error', () => {
                console.error("Error loading video metadata locally.");
                URL.revokeObjectURL(videoUrlObj);
                setIsUploading(false);
            });

        } catch (error) {
            console.error("Upload failed", error);
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleSave = async () => {
        if (!form.title.trim()) return;
        if (creating) await addVideo(form);
        else if (editing) await updateVideo(editing, form);
        handleCancel();
    };

    const showForm = creating || editing;

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Videos</h1>
                    <p className="mt-1 text-sm text-text-secondary">{videos.length} videos total</p>
                </div>
                {!showForm && (
                    <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-text-inverse hover:bg-accent-hover">
                        <Plus size={16} /> Add Video
                    </button>
                )}
            </div>

            {showForm && (
                <div className="mb-8 rounded-2xl border border-border bg-bg-card p-6">
                    <h2 className="mb-5 text-lg font-semibold text-text-primary">{creating ? "New Video" : "Edit Video"}</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Video File</label>
                            <div className="flex items-center gap-4">
                                {form.video_url && (
                                    <div className="h-16 w-32 relative overflow-hidden rounded-lg bg-black border border-border">
                                        <video src={form.video_url} className="h-full w-full object-cover opacity-70" muted />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Play size={16} className="text-white drop-shadow-md" />
                                        </div>
                                    </div>
                                )}
                                <div className="flex-1 text-sm flex flex-col gap-2">
                                    <input type="file" accept="video/mp4,video/x-m4v,video/*" onChange={handleVideoUpload} disabled={isUploading} className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-full file:border-0 file:bg-bg-secondary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-bg-card-hover" />
                                    {isUploading && (
                                        <div className="w-full bg-bg-secondary rounded-full h-1.5 overflow-hidden">
                                            <div className="bg-accent h-1.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Title</label>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent" placeholder="Video title" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Tag</label>
                            <input value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent" placeholder="Cinematic, Product, etc." />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Orientation</label>
                            <select value={form.orientation || "landscape"} onChange={(e) => setForm({ ...form, orientation: e.target.value as "portrait" | "landscape" })} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent">
                                <option value="landscape">Landscape</option>
                                <option value="portrait">Portrait</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Duration (Auto-filled on upload)</label>
                            <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent" placeholder="0:45" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Views</label>
                            <input value={form.views} onChange={(e) => setForm({ ...form, views: e.target.value })} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent" placeholder="12.4K" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Likes</label>
                            <input value={form.likes} onChange={(e) => setForm({ ...form, likes: e.target.value })} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent" placeholder="1.8K" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Gradient</label>
                            <div className="flex flex-wrap gap-2">
                                {gradientOptions.map((g) => (
                                    <button key={g} onClick={() => setForm({ ...form, gradient: g })} className={`h-8 w-16 rounded-lg bg-gradient-to-br ${g} transition-all ${form.gradient === g ? "ring-2 ring-accent ring-offset-2 ring-offset-bg-card" : "opacity-60 hover:opacity-100"}`} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex gap-3">
                        <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-text-inverse hover:bg-accent-hover"><Check size={14} /> Save</button>
                        <button onClick={handleCancel} className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary">Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-flow-row-dense">
                {videos.map((video) => {
                    const isPortrait = video.orientation === "portrait";
                    return (
                        <div
                            key={video.id}
                            className={`group relative flex flex-col rounded-2xl border border-border bg-bg-card overflow-hidden transition-all hover:border-accent/10 ${isPortrait
                                ? "md:col-span-1 lg:col-span-1 row-span-2 min-h-[400px]"
                                : "md:col-span-1 lg:col-span-2 row-span-1 min-h-[220px]"
                                }`}
                        >
                            {/* Video thumbnail */}
                            <div className={`relative flex flex-1 items-center justify-center ${!video.video_url ? `bg-gradient-to-br ${video.gradient}` : 'bg-black'} h-full w-full`}>
                                {video.video_url && (
                                    <video src={video.video_url} className="absolute inset-0 h-full w-full object-cover" muted autoPlay loop playsInline />
                                )}
                                {!video.video_url && (
                                    <Play size={24} className="text-white/60 z-10" />
                                )}

                                <span className="absolute bottom-3 right-3 rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-mono text-white z-20">
                                    {video.duration}
                                </span>
                                <span className="absolute left-3 top-3 rounded-full bg-white/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm z-20">
                                    {video.tag}
                                </span>

                                {/* Gradient overlay for text if portrait or fallback shadow for video readability */}
                                {isPortrait ? (
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 z-10 pointer-events-none" />
                                ) : video.video_url && (
                                    <div className="absolute inset-0 bg-black/10 transition-opacity duration-300 group-hover:bg-black/20 z-10 pointer-events-none" />
                                )}
                            </div>

                            {/* Info */}
                            <div className={`flex items-center gap-3 p-4 ${isPortrait ? 'absolute bottom-0 left-0 right-0 z-20' : ''}`}>
                                <div className="flex-1 min-w-0">
                                    <p className={`truncate text-sm font-semibold ${isPortrait ? 'text-white' : 'text-text-primary'}`}>{video.title}</p>
                                    <p className={`text-xs ${isPortrait ? 'text-white/80' : 'text-text-tertiary'}`}>{video.views} views · {video.likes} likes</p>
                                </div>
                                <div className="flex shrink-0 gap-1 z-30">
                                    <button onClick={() => startEdit(video)} className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${isPortrait ? 'text-white/80 hover:bg-white/20 hover:text-white' : 'text-text-tertiary hover:bg-bg-secondary hover:text-accent'}`}><Pencil size={14} /></button>
                                    <button onClick={() => setItemToDelete({ id: video.id, title: video.title })} className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${isPortrait ? 'text-white/80 hover:bg-red-500/30 hover:text-red-300' : 'text-text-tertiary hover:bg-red-500/10 hover:text-red-400'}`}><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            {videos.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-bg-card p-12 text-center">
                    <p className="text-sm text-text-tertiary">No videos yet.</p>
                </div>
            )}

            <ConfirmModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={() => {
                    if (itemToDelete) deleteVideo(itemToDelete.id);
                }}
                title="Delete Video"
                message={`Are you sure you want to delete "${itemToDelete?.title}"? This action cannot be undone.`}
            />
        </div>
    );
}
