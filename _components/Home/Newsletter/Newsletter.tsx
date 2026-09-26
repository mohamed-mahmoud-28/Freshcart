"use client";

import { useState } from "react";
import { Check, Download, Leaf, Mail, Send, Sparkles, Tag, Truck } from "lucide-react";
import { FaApple , FaGooglePlay  } from "react-icons/fa";
import { Input } from "@/components/ui/input";

const benefits = [
    { label: "Fresh picks weekly", icon: Leaf },
    { label: "Free delivery codes", icon: Truck },
    { label: "Members-only deals", icon: Tag },
];

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!email.trim()) return;
        setSubscribed(true);
    }

    return (
        <section className="relative overflow-hidden bg-[#f7fffc] px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12" aria-labelledby="newsletter-title">
            <div className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-[#d8fff0] opacity-60 blur-3xl" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-[#dffaf0] opacity-70 blur-3xl" aria-hidden="true" />

            <div className="relative mx-auto grid max-w-[1380px] overflow-hidden rounded-[24px] border border-[#d8f3e8] bg-white/75 shadow-[0_16px_40px_rgba(8,123,85,0.08)] backdrop-blur-sm lg:grid-cols-[1.55fr_1fr]">
                <div className="px-5 py-7 sm:px-8 sm:py-8 lg:px-12 lg:py-11">
                    <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[15px] bg-[#04b98d] text-white shadow-[0_8px_15px_rgba(4,185,141,0.22)] sm:h-14 sm:w-14">
                            <Mail size={25} strokeWidth={2.3} />
                        </span>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.04em] text-[#03a77d] sm:text-sm">Newsletter</p>
                            <p className="text-xs text-[#64748b] sm:text-sm">50,000+ subscribers</p>
                        </div>
                    </div>

                    <h2 id="newsletter-title" className="mt-6 max-w-[680px] text-[1.65rem] font-bold leading-[1.1] text-[#10213b] sm:text-[2.2rem] lg:text-[2.45rem]">
                        Get the Freshest Updates <span className="text-[#00a878]">Delivered Free</span>
                    </h2>
                    <p className="mt-3 max-w-[620px] text-sm leading-relaxed text-[#64748b] sm:text-base">
                        Weekly recipes, seasonal offers &amp; exclusive member perks.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2.5">
                        {benefits.map(({ label, icon: Icon }) => (
                            <div key={label} className="inline-flex items-center gap-2 rounded-full border border-[#d8f3e8] bg-white px-2.5 py-1.5 text-xs font-medium text-[#475569] shadow-[0_3px_8px_rgba(8,123,85,0.06)] sm:px-3 sm:text-sm">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d8faec] text-[#04aa7e]">
                                    <Icon size={13} strokeWidth={2.5} />
                                </span>
                                {label}
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                        <label htmlFor="newsletter-email" className="sr-only">Email address</label>
                        <Input
                            id="newsletter-email"
                            type="email"
                            value={email}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setEmail(event.target.value);
                                setSubscribed(false);
                            }}
                            placeholder="you@example.com"
                            required
                            className="h-12 min-w-0 flex-1 rounded-[13px] border border-[#dfe7e5] bg-white px-4 text-sm text-[#1f3047] shadow-[0_3px_8px_rgba(15,23,42,0.08)] outline-none transition placeholder:text-[#94a3b8] focus:border-[#05b888] focus:ring-4 focus:ring-[#05b888]/10"
                        />
                        <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-[13px] bg-[#04b98d] px-5 text-sm font-bold text-white shadow-[0_8px_15px_rgba(4,185,141,0.22)] transition hover:-translate-y-0.5 hover:bg-[#009e78] sm:min-w-[165px]">
                            {subscribed ? <Check size={21} /> : <Send size={20} />}
                            {subscribed ? "You're in!" : "Subscribe"}
                        </button>
                    </form>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-[#94a3b8]"><Sparkles size={13} className="text-[#e3b400]" /> Unsubscribe anytime. No spam, ever.</p>

                </div>

                <div className="m-4 flex flex-col justify-between rounded-[21px] bg-[#152235] p-5 text-white sm:m-5 sm:p-6 lg:m-7 lg:p-7">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[#00b98c]/35 bg-[#064d49] px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#00d6a4]">
                            <Download size={12} /> Mobile app
                        </span>
                        <h3 className="mt-5 text-[1.45rem] font-bold leading-tight sm:text-[1.7rem]">Shop Faster on Our App</h3>
                        <p className="mt-3 text-xs leading-relaxed text-[#aebaca] sm:text-sm">Get app-exclusive deals &amp; 15% off your first order.</p>
                    </div>

                    <div className="mt-6 space-y-2.5">
                        <div className="flex items-center gap-3 rounded-[11px] border border-white/10 bg-white/10 px-4 py-2.5 opacity-75">
                            <FaApple  size={28} fill="currentColor" />
                            <span><small className="block text-[9px] uppercase text-[#aebaca]">Coming soon</small><strong className="text-sm">App Store</strong></span>
                        </div>
                        <div className="flex items-center gap-3 rounded-[11px] border border-white/10 bg-white/10 px-4 py-2.5 opacity-75">
                            <FaGooglePlay size={19} fill="currentColor" />
                            <span><small className="block text-[9px] uppercase text-[#aebaca]">Coming soon</small><strong className="text-sm">Google Play</strong></span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center gap-2 text-xs text-[#aebaca]">
                        <span className="flex text-[#ffc400]" aria-label="4.9 out of 5 stars">★★★★★</span>
                        <span>4.9 · 100K+ downloads</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
