"use client";

import { useState } from "react";
import Image from "next/image";
import { useDataStore } from "@/app/lib/DataStore";
import type { Project, ProjectCategory, ProjectStatus } from "@/app/types";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import ConfirmModal from "@/app/admin/components/ConfirmModal";

const categoryOptions: ProjectCategory[] = ["UI/UX", "Web Dev", "Mobile Apps", "IoT/Hardware"];
const statusOptions: ProjectStatus[] = ["Completed", "Ongoing"];
const gradientOptions = [
    "from-emerald-500 to-teal-600",
    "from-green-500 to-lime-600",
    "from-red-500 to-orange-600",
    "from-violet-500 to-purple-600",
    "from-pink-500 to-rose-600",
    "from-amber-500 to-yellow-600",
    "from-cyan-500 to-blue-600",
    "from-indigo-500 to-blue-600",
];

const emptyProject: Omit<Project, "id"> = {
    title: "",
    description: "",
    category: "Web Dev",
    status: "Ongoing",
    tech_stack: [],
    gradient: gradientOptions[0],
    icon: "🚀",
    images: [],
};

export default function ProjectsAdmin() {
    const { projects, addProject, updateProject, deleteProject, uploadFile } = useDataStore();
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState(emptyProject);
    const [techInput, setTechInput] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadingType, setUploadingType] = useState<"banner" | "gallery" | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ id: string, title: string } | null>(null);

    const startCreate = () => {
        setCreating(true);
        setEditing(null);
        setForm(emptyProject);
        setTechInput("");
    };

    const startEdit = (project: Project) => {
        setEditing(project.id);
        setCreating(false);
        setForm(project);
        setTechInput("");
    };

    const handleSave = async () => {
        if (!form.title.trim()) return;
        if (creating) {
            await addProject(form);
        } else if (editing) {
            await updateProject(editing, form);
        }
        setCreating(false);
        setEditing(null);
        setForm(emptyProject);
    };

    const handleCancel = () => {
        setCreating(false);
        setEditing(null);
        setForm(emptyProject);
    };

    const addTech = () => {
        if (!techInput.trim()) return;
        setForm({ ...form, tech_stack: [...form.tech_stack, techInput.trim()] });
        setTechInput("");
    };

    const removeTech = (index: number) => {
        setForm({ ...form, tech_stack: form.tech_stack.filter((_, i) => i !== index) });
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadingType("banner");
        setUploadProgress(0);
        try {
            const path = `project-banners/${Date.now()}-${file.name}`;
            const url = await uploadFile("project-images", path, file, (progress) => {
                setUploadProgress(progress);
            });
            if (url) {
                setForm({ ...form, banner_url: url });
            }
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setIsUploading(false);
            setUploadingType(null);
            setUploadProgress(0);
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const currentImages = form.images || [];
        if (currentImages.length + files.length > 5) {
            alert("Maximum 5 gallery images allowed.");
            return;
        }

        setIsUploading(true);
        setUploadingType("gallery");

        // Track progress for each file
        const progresses = new Array(files.length).fill(0);
        const updateOverallProgress = () => {
            const total = progresses.reduce((acc, curr) => acc + curr, 0);
            setUploadProgress(Math.round(total / progresses.length));
        };

        try {
            const uploadPromises = files.map((file, index) => {
                const path = `project-gallery/${Date.now()}-${file.name}`;
                return uploadFile("project-images", path, file, (progress) => {
                    progresses[index] = progress;
                    updateOverallProgress();
                });
            });

            const results = await Promise.all(uploadPromises);
            const uploadedUrls = results.filter((url): url is string => url !== null);

            if (uploadedUrls.length > 0) {
                setForm({ ...form, images: [...currentImages, ...uploadedUrls] });
            }
        } catch (error) {
            console.error("Gallery upload failed", error);
        } finally {
            setIsUploading(false);
            setUploadingType(null);
            setUploadProgress(0);
        }
    };

    const removeGalleryImage = (index: number) => {
        const currentImages = form.images || [];
        setForm({ ...form, images: currentImages.filter((_, i) => i !== index) });
    };

    const showForm = creating || editing;

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
                    <p className="mt-1 text-sm text-text-secondary">{projects.length} projects total</p>
                </div>
                {!showForm && (
                    <button onClick={startCreate} className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-hover">
                        <Plus size={16} /> Add Project
                    </button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <div className="mb-8 rounded-2xl border border-border bg-bg-card p-6">
                    <h2 className="mb-5 text-lg font-semibold text-text-primary">{creating ? "New Project" : "Edit Project"}</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Title</label>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent" placeholder="Project title" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Description</label>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent resize-none" placeholder="Brief description" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Category</label>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProjectCategory })} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent">
                                {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent">
                                {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Icon (emoji)</label>
                            <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent" placeholder="🚀" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Gradient</label>
                            <select value={form.gradient} onChange={(e) => setForm({ ...form, gradient: e.target.value })} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent">
                                {gradientOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Banner Image</label>
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-4">
                                    {form.banner_url && (
                                        <Image src={form.banner_url} alt="Banner Preview" width={128} height={64} className="h-16 w-32 object-cover rounded-lg border border-border" />
                                    )}
                                    <div className="flex-1 text-sm">
                                        <input type="file" accept="image/*" onChange={handleBannerUpload} disabled={isUploading} className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-full file:border-0 file:bg-bg-secondary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-bg-card-hover" />
                                    </div>
                                </div>
                                {isUploading && uploadingType === "banner" && (
                                    <div className="w-full bg-bg-secondary rounded-full h-1.5 mt-2 overflow-hidden">
                                        <div className="bg-accent h-1.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-medium text-text-secondary">Gallery Images (Max 5)</label>
                                <span className="text-xs text-text-tertiary">{(form.images || []).length} / 5</span>
                            </div>
                            <div className="space-y-3">
                                {form.images && form.images.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {form.images.map((imgUrl, idx) => (
                                            <div key={idx} className="relative group">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={imgUrl} alt="Gallery Preview" className="h-16 w-24 object-cover rounded-lg border border-border" />
                                                <button onClick={() => removeGalleryImage(idx)} className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"><X size={10} /></button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {(form.images || []).length < 5 && (
                                    <div className="flex-1 text-sm">
                                        <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={isUploading} className="block w-full text-sm text-text-secondary file:mr-4 file:rounded-full file:border-0 file:bg-bg-secondary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-accent hover:file:bg-bg-card-hover" />
                                    </div>
                                )}
                                {isUploading && uploadingType === "gallery" && (
                                    <div className="w-full bg-bg-secondary rounded-full h-1.5 mt-2 overflow-hidden">
                                        <div className="bg-accent h-1.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                                    </div>
                                )}
                                {isUploading && !uploadingType && <p className="mt-1 text-xs text-text-tertiary focus:outline-none">Uploading asset(s)...</p>}
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Tech Stack</label>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {form.tech_stack.map((tech, i) => (
                                    <span key={i} className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-secondary px-2 py-0.5 text-xs text-text-secondary">
                                        {tech}
                                        <button onClick={() => removeTech(i)} className="text-text-tertiary hover:text-red-400"><X size={10} /></button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())} className="flex-1 rounded-xl border border-border bg-bg-secondary px-4 py-2 text-sm text-text-primary outline-none focus:border-accent" placeholder="Add technology..." />
                                <button onClick={addTech} className="rounded-xl border border-border bg-bg-secondary px-3 py-2 text-sm text-text-secondary hover:text-accent transition-colors">Add</button>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="sm:col-span-2 pt-2">
                            <h3 className="text-sm font-semibold text-text-primary border-t border-border pt-4">Case Study Details <span className="text-text-tertiary font-normal">(optional)</span></h3>
                            <p className="text-xs text-text-tertiary mt-0.5">These fields populate the full project detail page.</p>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Long Description</label>
                            <textarea value={form.long_description || ""} onChange={(e) => setForm({ ...form, long_description: e.target.value })} rows={4} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent resize-none" placeholder="Detailed overview of the project..." />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">The Challenge</label>
                            <textarea value={form.challenge || ""} onChange={(e) => setForm({ ...form, challenge: e.target.value })} rows={3} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent resize-none" placeholder="What problem did this project solve?" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">The Solution</label>
                            <textarea value={form.solution || ""} onChange={(e) => setForm({ ...form, solution: e.target.value })} rows={3} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent resize-none" placeholder="How did you approach and solve it?" />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Results & Impact</label>
                            <textarea value={form.results || ""} onChange={(e) => setForm({ ...form, results: e.target.value })} rows={3} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent resize-none" placeholder="What were the measurable outcomes?" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Live URL</label>
                            <input value={form.live_url || ""} onChange={(e) => setForm({ ...form, live_url: e.target.value })} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent" placeholder="https://..." />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Repo URL</label>
                            <input value={form.repo_url || ""} onChange={(e) => setForm({ ...form, repo_url: e.target.value })} className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent" placeholder="https://github.com/..." />
                        </div>
                    </div>
                    <div className="mt-5 flex gap-3">
                        <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-text-inverse hover:bg-accent-hover"><Check size={14} /> Save</button>
                        <button onClick={handleCancel} className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary">Cancel</button>
                    </div>
                </div>
            )}

            {/* Projects list */}
            <div className="space-y-3">
                {projects.map((project) => (
                    <div key={project.id} className="flex items-center gap-4 rounded-2xl border border-border bg-bg-card p-4 transition-all hover:border-accent/10">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${project.gradient} text-xl shrink-0`}>
                            {project.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="truncate font-semibold text-text-primary">{project.title}</p>
                            <p className="truncate text-xs text-text-tertiary">{project.category} · {project.tech_stack.slice(0, 3).join(", ")}</p>
                        </div>
                        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${project.status === "Completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                            {project.status}
                        </span>
                        <div className="flex shrink-0 gap-1">
                            <button onClick={() => startEdit(project)} className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-bg-secondary hover:text-accent transition-colors"><Pencil size={14} /></button>
                            <button onClick={() => setItemToDelete({ id: project.id, title: project.title })} className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-red-500/10 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-border bg-bg-card p-12 text-center">
                        <p className="text-sm text-text-tertiary">No projects yet. Click &quot;Add Project&quot; to get started.</p>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={() => {
                    if (itemToDelete) deleteProject(itemToDelete.id);
                }}
                title="Delete Project"
                message={`Are you sure you want to delete "${itemToDelete?.title}"? This action cannot be undone.`}
            />
        </div>
    );
}
