"use client";

import { useState } from "react";
import Image from "next/image";
import { useDataStore } from "@/app/lib/DataStore";
import type { InstagramPost } from "@/app/types";
import { Plus, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import ConfirmModal from "@/app/admin/components/ConfirmModal";
import heic2any from "heic2any";

export default function InstagramAdmin() {
    const { instagram, addInstagramPost, deleteInstagramPost, uploadFile, deleteFile } = useDataStore();
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [itemToDelete, setItemToDelete] = useState<InstagramPost | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const remainingSlots = 8 - instagram.length;
        if (remainingSlots <= 0) {
            alert("Maximum limit of 8 images reached.");
            return;
        }

        const filesToUpload = files.slice(0, remainingSlots);
        setUploading(true);
        setUploadProgress(0);

        try {
            const progresses = new Array(filesToUpload.length).fill(0);
            const updateOverallProgress = () => {
                const total = progresses.reduce((acc, curr) => acc + curr, 0);
                setUploadProgress(Math.round(total / progresses.length));
            };

            for (let i = 0; i < filesToUpload.length; i++) {
                const file = filesToUpload[i];
                // If the file is HEIC/HEIF, convert it to JPEG first
                const extension = file.name.split(".").pop()?.toLowerCase();
                const isHeic = extension === "heic" || extension === "heif";
                let uploadFilePayload = file;
                let uploadName = file.name;

                if (isHeic) {
                    try {
                        const convertedBlob = await heic2any({
                            blob: file,
                            toType: "image/jpeg",
                            quality: 0.8,
                        });

                        // heic2any can return an array of blobs if it's an image sequence, we just grab the first
                        const finalBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                        const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));

                        uploadName = `${originalNameWithoutExt}.jpeg`;
                        uploadFilePayload = new File([finalBlob], uploadName, { type: "image/jpeg" });
                    } catch (convErr) {
                        console.error("HEIC conversion failed for", file.name, convErr);
                        continue; // Skip this file if conversion totally failed
                    }
                }

                const path = `instagram/${Date.now()}-${uploadName}`;
                const url = await uploadFile("project-images", path, uploadFilePayload, (progress) => {
                    progresses[i] = progress;
                    updateOverallProgress();
                });
                if (url) {
                    await addInstagramPost({
                        gradient: "from-gray-500 to-gray-600",
                        likes: "0",
                        caption: "",
                        image_url: url
                    });
                }
            }
        } catch (error) {
            console.error("Failed to upload instagram images", error);
        } finally {
            setUploading(false);
            setUploadProgress(0);
            // reset input
            e.target.value = "";
        }
    };

    const handleDelete = async (post: InstagramPost) => {
        // Delete from public storage first
        if (post.image_url) {
            try {
                const urlPath = new URL(post.image_url).pathname;
                const segments = urlPath.split("/");
                const pathIndex = segments.indexOf("project-images");
                if (pathIndex !== -1 && pathIndex + 1 < segments.length) {
                    const storagePath = segments.slice(pathIndex + 1).join("/");
                    await deleteFile("project-images", storagePath);
                }
            } catch (err) {
                console.error("Failed to parse or delete storage image", err);
            }
        }

        // Delete row
        await deleteInstagramPost(post.id);
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Instagram Images</h1>
                    <p className="mt-1 text-sm text-text-secondary">{instagram.length} / 8 images</p>
                </div>
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        disabled={uploading || instagram.length >= 8}
                        className="absolute inset-0 z-10 w-full h-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                    />
                    <button
                        disabled={uploading || instagram.length >= 8}
                        className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-text-inverse hover:bg-accent-hover disabled:opacity-50 relative overflow-hidden"
                    >
                        {uploading && (
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
                                <div className="h-full bg-white transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        )}
                        {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                        {uploading ? "Uploading..." : "Upload Images"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {instagram.map((post) => (
                    <div key={post.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-bg-secondary">
                        {post.image_url ? (
                            <Image src={post.image_url} alt="Instagram post" fill sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" className="object-cover" />
                        ) : (
                            <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient}`} />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                            <button onClick={() => setItemToDelete(post)} className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all scale-75 group-hover:scale-100">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {instagram.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-bg-card p-12 text-center flex flex-col items-center justify-center">
                    <ImageIcon size={32} className="mb-4 text-text-tertiary opacity-50" />
                    <p className="text-sm font-medium text-text-primary">No images uploaded</p>
                    <p className="mt-1 text-xs text-text-tertiary">Upload up to 8 images to show on your feed.</p>
                </div>
            )}

            <ConfirmModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={() => {
                    if (itemToDelete) handleDelete(itemToDelete);
                }}
                title="Delete Image"
                message="Are you sure you want to delete this Instagram image? This action cannot be undone."
            />
        </div>
    );
}
