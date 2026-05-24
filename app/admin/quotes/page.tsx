"use client";

import { useState } from "react";
import { useDataStore } from "@/app/lib/DataStore";
import type { Quote } from "@/app/types";
import { Plus, Pencil, Trash2, X, Check, Star } from "lucide-react";
import ConfirmModal from "@/app/admin/components/ConfirmModal";

const accentOptions = [
    "from-emerald-500/10 to-teal-500/10",
    "from-violet-500/10 to-purple-500/10",
    "from-blue-500/10 to-cyan-500/10",
    "from-amber-500/10 to-orange-500/10",
    "from-pink-500/10 to-rose-500/10",
    "from-indigo-500/10 to-blue-500/10",
    "from-red-500/10 to-orange-500/10",
    "from-green-500/10 to-lime-500/10",
];

const emptyQuote: Omit<Quote, "id"> = {
    text: "",
    author: "",
    role: "",
    accent: accentOptions[0],
    featured: false,
    sort_order: 0,
};

export default function QuotesAdmin() {
    const { quotes, addQuote, updateQuote, deleteQuote } = useDataStore();
    const [editing, setEditing] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [form, setForm] = useState<Omit<Quote, "id">>(emptyQuote);
    const [itemToDelete, setItemToDelete] = useState<{ id: string; text: string } | null>(null);

    const showForm = creating || editing;

    const startCreate = () => {
        setCreating(true);
        setEditing(null);
        setForm(emptyQuote);
    };

    const startEdit = (quote: Quote) => {
        setEditing(quote.id);
        setCreating(false);
        setForm({
            text: quote.text,
            author: quote.author,
            role: quote.role,
            accent: quote.accent,
            featured: quote.featured,
            sort_order: quote.sort_order ?? 0,
        });
    };

    const handleSave = async () => {
        if (!form.text.trim() || !form.author.trim()) return;
        if (creating) {
            await addQuote(form);
        } else if (editing) {
            await updateQuote(editing, form);
        }
        setCreating(false);
        setEditing(null);
        setForm(emptyQuote);
    };

    const handleCancel = () => {
        setCreating(false);
        setEditing(null);
        setForm(emptyQuote);
    };

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Quotes</h1>
                    <p className="mt-1 text-sm text-text-secondary">{quotes.length} quotes total</p>
                </div>
                {!showForm && (
                    <button
                        onClick={startCreate}
                        className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-text-inverse transition-all hover:bg-accent-hover"
                    >
                        <Plus size={16} /> Add Quote
                    </button>
                )}
            </div>

            {/* Form */}
            {showForm && (
                <div className="mb-8 rounded-2xl border border-border bg-bg-card p-6">
                    <h2 className="mb-5 text-lg font-semibold text-text-primary">
                        {creating ? "New Quote" : "Edit Quote"}
                    </h2>
                    <div className="grid gap-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-text-secondary">Quote Text</label>
                            <textarea
                                value={form.text}
                                onChange={(e) => setForm({ ...form, text: e.target.value })}
                                rows={3}
                                className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent resize-none"
                                placeholder="Enter the quote..."
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Author</label>
                                <input
                                    value={form.author}
                                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                                    placeholder="e.g. Steve Jobs"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Author Role / Title</label>
                                <input
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                                    placeholder="e.g. Co-founder, Apple"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Card Accent Color</label>
                                <select
                                    value={form.accent}
                                    onChange={(e) => setForm({ ...form, accent: e.target.value })}
                                    className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none focus:border-accent"
                                >
                                    {accentOptions.map((a) => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-text-secondary">Sort Order</label>
                                <input
                                    type="number"
                                    value={form.sort_order ?? 0}
                                    onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                                    className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-2.5 text-sm text-text-primary outline-none transition-colors focus:border-accent"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setForm({ ...form, featured: !form.featured })}
                                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                                    form.featured
                                        ? "border-accent bg-accent/10 text-accent"
                                        : "border-border bg-bg-secondary text-text-secondary hover:border-accent/40"
                                }`}
                            >
                                <Star size={14} className={form.featured ? "fill-accent" : ""} />
                                {form.featured ? "Featured quote" : "Mark as featured"}
                            </button>
                            <p className="text-xs text-text-tertiary">Featured quotes appear larger at the top of the section.</p>
                        </div>
                    </div>
                    <div className="mt-5 flex gap-3">
                        <button
                            onClick={handleSave}
                            className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-text-inverse hover:bg-accent-hover"
                        >
                            <Check size={14} /> Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-secondary"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Quotes list */}
            <div className="space-y-3">
                {quotes.map((quote) => (
                    <div
                        key={quote.id}
                        className="flex items-start gap-4 rounded-2xl border border-border bg-bg-card p-4 transition-all hover:border-accent/10"
                    >
                        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${quote.accent} border border-border text-lg font-black text-accent`}>
                            &ldquo;
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="line-clamp-2 text-sm text-text-primary">{quote.text}</p>
                            <p className="mt-1 text-xs text-text-tertiary">
                                — {quote.author}
                                {quote.role && `, ${quote.role}`}
                                {quote.featured && (
                                    <span className="ml-2 inline-flex items-center gap-0.5 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent">
                                        <Star size={9} className="fill-accent" /> Featured
                                    </span>
                                )}
                            </p>
                        </div>
                        <div className="flex shrink-0 gap-1">
                            <button
                                onClick={() => startEdit(quote)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-bg-secondary hover:text-accent transition-colors"
                            >
                                <Pencil size={14} />
                            </button>
                            <button
                                onClick={() => setItemToDelete({ id: quote.id, text: quote.text })}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-tertiary hover:bg-red-500/10 hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
                {quotes.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-border bg-bg-card p-12 text-center">
                        <p className="text-sm text-text-tertiary">No quotes yet. Click &quot;Add Quote&quot; to get started.</p>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={() => {
                    if (itemToDelete) deleteQuote(itemToDelete.id);
                }}
                title="Delete Quote"
                message={`Are you sure you want to delete this quote by "${itemToDelete?.text.slice(0, 40)}..."? This cannot be undone.`}
            />
        </div>
    );
}
