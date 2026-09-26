"use client";

import { BookOpen, Check, CircleUserRound, RotateCcw, ShieldCheck, Star, Truck } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type { Products, Review } from "@/interfaces/products";

async function fetchReviews(productId: string): Promise<Review[]> {
    const response = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
    const payload = await response.json();
    if (!response.ok) throw new Error(payload?.message ?? "Could not load reviews.");
    return payload.data ?? [];
}

export default function ProductTabs({ product }: { product: Products }) {
    const [activeTab, setActiveTab] = useState<"details" | "reviews" | "shipping">("details");
    const reviews = product.reviews ?? [];
    const tabItems = [
        { id: "details" as const, label: "Product Details", icon: BookOpen },
        { id: "reviews" as const, label: `Reviews (${reviews.length || product.ratingsQuantity})`, icon: Star },
        { id: "shipping" as const, label: "Shipping & Returns", icon: Truck },
    ];

    return (
        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" aria-label="Product information">
            <div className="flex overflow-x-auto border-b border-slate-200" role="tablist">
                {tabItems.map(({ id, label, icon: Icon }) => (
                    <button key={id} type="button" role="tab" aria-selected={activeTab === id} className={`inline-flex min-h-[72px] shrink-0 items-center gap-2.5 border-b-2 px-5 text-base font-medium transition sm:px-9 sm:text-lg ${activeTab === id ? "border-emerald-500 bg-emerald-50 text-emerald-600" : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-emerald-600"}`} onClick={() => setActiveTab(id)}>
                        <Icon size={21} strokeWidth={2.2} /> {label}
                    </button>
                ))}
            </div>

            {activeTab === "details" && (
                <div className="grid gap-5 p-5 text-sm sm:grid-cols-[1.2fr_1fr_1fr] sm:p-8" role="tabpanel">
                    <div><h3 className="mb-3 text-lg font-bold text-slate-800">About this Product</h3><p className="whitespace-pre-line text-base leading-8 text-slate-500">{product.description || "A carefully selected product made for everyday use."}</p></div>
                    <div className="rounded-lg bg-slate-50 p-5"><h3 className="mb-3 text-lg font-bold text-slate-800">Product Information</h3><InfoRow label="Category" value={product.category.name} /><InfoRow label="Brand" value={product.brand.name} /><InfoRow label="Availability" value={`${product.quantity} in stock`} /></div>
                    <div className="rounded-lg bg-slate-50 p-5"><h3 className="mb-3 text-lg font-bold text-slate-800">Key Features</h3><p className="flex items-center gap-2 text-base leading-9 text-slate-500"><CheckMark /> Premium quality product</p><p className="flex items-center gap-2 text-base leading-9 text-slate-500"><CheckMark /> 100% authentic</p><p className="flex items-center gap-2 text-base leading-9 text-slate-500"><CheckMark /> Easy returns available</p></div>
                </div>
            )}

            {activeTab === "reviews" && <Reviews productId={product._id} initialReviews={reviews} average={product.ratingsAverage} />}

            {activeTab === "shipping" && <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-8" role="tabpanel"><InfoCard icon={Truck} title="Shipping Information" items={["Free shipping on orders over 500 EGP", "Standard delivery: 3-5 business days", "Track your order in real-time"]} /><InfoCard icon={RotateCcw} title="Returns & Refunds" items={["14-day hassle-free returns", "Full refund or exchange available", "Easy online return process"]} /><div className="flex items-center gap-4 rounded-lg bg-slate-50 p-5 text-slate-500 sm:col-span-2"><ShieldCheck size={30} /><div><h3 className="font-bold text-slate-800">Buyer Protection Guarantee</h3><p className="text-sm">Get a full refund if your order does not arrive or is not as described.</p></div></div></div>}
        </section>
    );
}

function CheckMark() { return <Check className="text-emerald-600" size={16} aria-hidden="true" />; }

function Reviews({ productId, initialReviews, average }: { productId: string; initialReviews: Review[]; average: number }) {
    const { data: session, status } = useSession();
    const [reviews, setReviews] = useState(initialReviews);
    const isLoading = false;
    const [error, setError] = useState("");
    const [formOpen, setFormOpen] = useState(false);
    const [reviewText, setReviewText] = useState("");
    const [rating, setRating] = useState(5);
    const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    async function saveReview(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!reviewText.trim()) return;
        setIsSaving(true);
        setError("");
        try {
            const response = await fetch(editingReviewId ? `/api/reviews/${editingReviewId}` : "/api/reviews", {
                method: editingReviewId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, review: reviewText.trim(), rating }),
            });
            const payload = await response.json();
            if (!response.ok) throw new Error(payload?.message ?? "Could not save review.");
            const savedReview = payload?.data as Review | undefined
            setReviewText("");
            setRating(5);
            setEditingReviewId(null);
            setFormOpen(false);
            if (savedReview?._id) {
                setReviews((current) => current.some((review) => review._id === savedReview._id)
                    ? current.map((review) => review._id === savedReview._id ? savedReview : review)
                    : [savedReview, ...current]);
            } else {
                setReviews(await fetchReviews(productId));
            }
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : "Could not save review.");
        } finally {
            setIsSaving(false);
        }
    }

    async function removeReview(reviewId: string) {
        setError("");
        try {
            const response = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
            const payload = await response.json().catch(() => null);
            if (!response.ok) throw new Error(payload?.message ?? "Could not delete review.");
            setReviews((current) => current.filter((review) => review._id !== reviewId));
        } catch (deleteError) {
            setError(deleteError instanceof Error ? deleteError.message : "Could not delete review.");
        }
    }

    function startEdit(review: Review) {
        setEditingReviewId(review._id);
        setReviewText(review.review);
        setRating(review.rating);
        setFormOpen(true);
    }

    const currentAverage = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : average;
    const distribution = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: reviews.filter((review) => review.rating === rating).length,
    }));
    const totalReviews = reviews.length;

    return (
        <div className="p-5 sm:p-8" role="tabpanel">
            <div className="grid gap-6 border-b border-slate-200 pb-7 sm:grid-cols-[220px_1fr] sm:gap-9">
                <div className="grid place-content-center justify-items-center gap-3 border-b border-slate-200 pb-5 text-center sm:border-b-0 sm:border-r sm:pb-0"><strong className="text-6xl leading-none text-slate-900">{currentAverage.toFixed(1)}</strong><Stars rating={currentAverage} size={20} /><span className="text-base text-slate-500">Based on {totalReviews} reviews</span></div>
                <div className="grid content-center gap-4">{distribution.map(({ rating, count }) => <div className="grid grid-cols-[42px_1fr_48px] items-center gap-3 text-base text-slate-600" key={rating}><span className="flex items-center gap-1">{rating}<Star size={15} fill="currentColor" className="text-amber-400" /></span><div className="h-2.5 overflow-hidden rounded-full bg-slate-200"><i className="block h-full rounded-full bg-amber-400" style={{ width: `${totalReviews ? Math.max((count / totalReviews) * 100, count ? 6 : 0) : 0}%` }} /></div><b className="font-normal text-slate-500">{totalReviews ? Math.round((count / totalReviews) * 100) : 0}%</b></div>)}</div>
            </div>
            {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
            <div className="mt-6 grid gap-3">{isLoading ? <p className="py-6 text-center text-slate-500">Loading reviews…</p> : reviews.length ? reviews.map((review) => { const isOwner = review.user?._id === session?.user?.id; return <article className="border-b border-slate-200 pb-3" key={review._id}><div className="flex flex-wrap items-center gap-2 text-sm"><span className="grid size-8 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CircleUserRound size={18} /></span><strong className="text-slate-800">{review.user?.name ?? "Customer"}</strong><Stars rating={review.rating} />{isOwner && <span className="ml-auto flex gap-3"><button type="button" className="text-xs text-emerald-700 hover:underline" onClick={() => startEdit(review)}>Edit</button><button type="button" className="text-xs text-red-600 hover:underline" onClick={() => void removeReview(review._id)}>Delete</button></span>}</div><p className="mt-1 text-sm text-slate-500">{review.review}</p></article> }) : <p className="py-6 text-center text-slate-500">No reviews yet.</p>}</div>
            {status === "authenticated" ? <button type="button" onClick={() => { setEditingReviewId(null); setReviewText(""); setRating(5); setFormOpen((open) => !open); }} className="mx-auto mt-7 flex items-center gap-2 rounded-lg border border-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"><Star size={16} /> {formOpen ? "Close form" : "Add Review"}</button> : <Link href="/login" className="mx-auto mt-7 flex w-fit items-center gap-2 rounded-lg border border-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-600 transition hover:bg-emerald-50"><Star size={16} /> Sign in to review</Link>}
            {formOpen && <form onSubmit={saveReview} className="mx-auto mt-5 grid w-full max-w-xl gap-3 rounded-xl bg-slate-50 p-4"><label className="grid gap-1 text-sm font-medium text-slate-700">Rating<select value={rating} onChange={(event) => setRating(Number(event.target.value))} className="h-10 rounded-lg border border-slate-200 bg-white px-3">{[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} star{value > 1 ? "s" : ""}</option>)}</select></label><label className="grid gap-1 text-sm font-medium text-slate-700">Your review<textarea value={reviewText} onChange={(event) => setReviewText(event.target.value)} required rows={3} className="rounded-lg border border-slate-200 bg-white p-3 font-normal" placeholder="Share your experience" /></label><button type="submit" disabled={isSaving} className="h-10 rounded-lg bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60">{isSaving ? "Saving…" : editingReviewId ? "Save Changes" : "Submit Review"}</button></form>}
        </div>
    );
}

function Stars({ rating, size = 18 }: { rating: number; size?: number }) {
    return <span className="inline-flex items-center gap-0.5 text-amber-400" aria-label={`${rating} out of 5 stars`}>{[1, 2, 3, 4, 5].map((star) => <Star key={star} size={size} fill={star <= Math.round(rating) ? "currentColor" : "none"} />)}</span>;
}

function InfoCard({ icon: Icon, title, items }: { icon: typeof Truck; title: string; items: string[] }) {
    return <div className="rounded-lg bg-emerald-50 p-6"><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-full bg-emerald-600 text-white"><Icon size={22} /></span><h3 className="font-bold text-slate-800">{title}</h3></div><ul className="mt-5 grid gap-3">{items.map((item) => <li className="flex items-center gap-2 text-sm text-slate-600" key={item}><Check size={16} className="shrink-0 text-emerald-600" /><span>{item}</span></li>)}</ul></div>;
}

function InfoRow({ label, value }: { label: string; value: string }) { return <p className="flex justify-between gap-3 border-b border-slate-200 py-2 text-xs last:border-0"><span className="text-slate-400">{label}</span><span className="text-right text-slate-600">{value}</span></p>; }
