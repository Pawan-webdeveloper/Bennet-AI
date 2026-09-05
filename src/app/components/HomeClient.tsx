"use client";

import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DitherBackground from "@/components/ui/dither-background";

gsap.registerPlugin(ScrollTrigger);

// Katihar gradient — Ribbon Field stripes (Sea glass → Jade → Sprout).
// Provided ready-to-use CSS from 21st.dev, applied to cards & the CTA band.
const katihar = {
  backgroundColor: "#539255",
  backgroundImage:
    "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.045'/></svg>\"), radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 52%, rgba(0, 0, 0, 0.064) 100%), linear-gradient(97deg, #539255 1.56%, #539255 15.44%, #91C682 18.56%, #91C682 59.94%, #DDF0C8 61.5%, #DDF0C8 100%)",
  backgroundSize: "120px 120px, auto, auto",
  backgroundBlendMode: "overlay, normal, normal",
} as const;

const HomeClient = ({ email }: { email: string }) => {
  const [loading, setLoading] = useState(false);
  const handleLogin = () => {
    setLoading(true);
    window.location.href = "/api/auth/login";
  };
  const First = email?.split("@")[0][0]?.toUpperCase();
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const features = [
    {
      title: "Plug-in-play",
      desc: "Drop one snippet into your site and the chatbot is live — no code, no build step.",
    },
    {
      title: "Admin Control",
      desc: "Admins review and steer every AI response, so the answers always match your voice.",
    },
    {
      title: "Available 24/7",
      desc: "It never sleeps — your customers get instant, accurate answers around the clock.",
    },
  ];

  const handleLogOut = async () => {
    try {
      await axios.get("api/auth/logout");
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useRouter();

  // GSAP scroll effects: hero entrance, parallax dither, section reveals,
  // product-shot entrance, and the infinite marquee rail.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // 1. Hero copy entrance
      gsap.from("[data-hero-copy] > *", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
      });

      // 2. Dither background drifts slower than the page (parallax)
      gsap.to("[data-hero-bg]", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 3. Product shot peeks in on load, then parallaxes up as you scroll
      gsap.from("[data-product-shot]", {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.5,
      });
      gsap.to("[data-product-shot]", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // 4. Reveal-on-scroll for every section block marked data-reveal
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 48,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // 5. Infinite marquee rail
      const track = document.querySelector<HTMLElement>("[data-marquee-track]");
      if (track) {
        const tween = gsap.to(track, {
          xPercent: -50,
          ease: "none",
          duration: 22,
          repeat: -1,
        });
        return () => {
          tween.kill();
        };
      }
    },
    { scope: rootRef }
  );

  const marqueeItems = [
    "No code required",
    "Answers in seconds",
    "Admin-controlled AI",
    "24/7 support",
    "Lead generation",
    "One-snippet embed",
  ];

  return (
    <div ref={rootRef} className="min-h-screen bg-[#F5F9EF] text-[#16220F]">
      {/* ───────────────────────── Navbar ───────────────────────── */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 z-50 w-full border-b border-[#DCE8CF] bg-white/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="text-lg font-bold tracking-tight">
            Bennet <span className="text-[#539255]">AI</span>
          </div>

          <div className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
            <a
              href="#features"
              className="transition-colors hover:text-[#3d6b3f]"
            >
              Features
            </a>
            <a
              href="#how"
              className="transition-colors hover:text-[#3d6b3f]"
            >
              How it works
            </a>
            <a
              href="#cta"
              className="transition-colors hover:text-[#3d6b3f]"
            >
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-3">
            {email ? (
              <div className="relative" ref={popupRef}>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#16220F] font-medium text-white transition-all hover:bg-[#2c3d24] disabled:opacity-50"
                  onClick={() => setOpen(!open)}
                >
                  {First}
                </button>
                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-3 w-44 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
                    >
                      <button
                        className="w-full px-4 py-3 text-left text-sm text-zinc-900 transition-all hover:bg-zinc-100"
                        onClick={() => navigate.push("/dashboard")}
                      >
                        Dashboard
                      </button>
                      <button
                        className="w-full px-4 py-3 text-left text-sm text-red-500 transition-all hover:bg-zinc-100"
                        onClick={handleLogOut}
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button
                  className="rounded-full border border-[#BFD4AE] bg-white px-5 py-2 text-sm font-medium text-[#16220F] transition-all hover:bg-[#F0F6E9] disabled:opacity-50"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Loging..." : "Login"}
                </button>
                <button
                  className="hidden rounded-full bg-[#539255] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#3d6b3f] disabled:opacity-50 sm:block"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Loging..." : "Sign Up"}
                </button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section
        data-hero
        className="relative flex min-h-screen flex-col overflow-hidden bg-[#F5F9EF]"
      >
        {/* Dithered photo background (animated canvas, light theme) */}
        <div data-hero-bg className="absolute inset-0 will-change-transform">
          <DitherBackground
            src="/hero-bg.png"
            className="h-full w-full"
            brightness={1.05}
            cellSize={2}
            invert
          />
          {/* Soft light blend so copy stays readable & melts into the page */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/25 to-[#F5F9EF]" />
        </div>

        {/* Hero copy */}
        <div
          data-hero-copy
          className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 pt-28 pb-16 text-center"
        >
          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-[#16220F] md:text-7xl">
            Instant answers.
            <br />
            Zero support tickets.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 md:text-xl">
            Bennet AI plugs a chatbot into your website in minutes — trained on
            your content, controlled by you, and always on.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            {email ? (
              <button
                className="rounded-full bg-[#539255] px-7 py-3.5 text-base font-medium text-white shadow-lg shadow-[#539255]/25 transition-all hover:bg-[#3d6b3f] disabled:opacity-50"
                onClick={() => navigate.push("/dashboard")}
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                className="rounded-full bg-[#539255] px-7 py-3.5 text-base font-medium text-white shadow-lg shadow-[#539255]/25 transition-all hover:bg-[#3d6b3f] disabled:opacity-50"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Loging..." : "Start building for free"}
              </button>
            )}
            <a
              href="#features"
              className="rounded-full border border-[#BFD4AE] bg-white px-7 py-3.5 text-base font-medium text-[#16220F] transition-all hover:bg-[#F0F6E9]"
            >
              Learn more
            </a>
          </div>

          {/* Trusted-by + marquee rail */}
          <div className="mt-16 w-full max-w-3xl">
            <p className="mb-5 text-sm text-zinc-500">
              Trusted by founders and support teams worldwide
            </p>
            <div
              className="relative overflow-hidden"
              style={{
                maskImage:
                  "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
              }}
            >
              <div data-marquee-track className="flex w-max items-center gap-10">
                {[...marqueeItems, ...marqueeItems].map((item, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-10 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500"
                  >
                    {item}
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#91C682]" />
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product shot peeking from the bottom edge, like the reference */}
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pb-0">
          <div
            data-product-shot
            className="translate-y-6 rounded-t-2xl border border-b-0 border-[#DCE8CF] bg-white p-6 text-zinc-900 shadow-2xl shadow-[#3d6b3f]/10 md:p-8"
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-zinc-400">
                Bennet AI — Live Chat Preview
              </span>
            </div>
            <div className="space-y-4">
              <div className="w-fit rounded-lg bg-[#F0F4EA] px-4 py-2 text-sm">
                Do you offer cash on delivery?
              </div>
              <div className="ml-auto w-fit rounded-lg bg-[#16220F] px-4 py-2 text-sm text-white">
                Yes, we do offer cash on delivery in most areas.
              </div>
              <div className="w-fit rounded-lg bg-[#F0F4EA] px-4 py-2 text-sm">
                Can I track my order in real time?
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Features ───────────────────────── */}
      <section id="features" className="relative bg-[#F5F9EF] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div data-reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#539255]">
              Why Bennet AI
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-[#16220F] md:text-5xl">
              Everything support needs. Nothing it doesn&apos;t.
            </h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {features.map((f, index) => (
              <div
                key={index}
                data-reveal
                className="group relative overflow-hidden rounded-2xl border border-[#DCE8CF] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#539255]/15 active:scale-[0.98]"
                style={katihar}
              >
                {/* Frosted overlay — lifts on hover/click to reveal the gradient */}
                <div className="absolute inset-0 bg-white/92 transition-opacity duration-300 group-hover:bg-white/60 group-active:bg-white/35" />
                <div className="relative p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#539255]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-4 text-xl font-semibold text-[#16220F]">
                    {f.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-zinc-600">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── How it works ───────────────────────── */}
      <section id="how" className="relative bg-[#F5F9EF] pb-28">
        <div className="mx-auto max-w-7xl px-6">
          <div data-reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#539255]">
              How it works
            </p>
            <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-[#16220F] md:text-5xl">
              From zero to live in three steps.
            </h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                t: "Create",
                d: "Build your Bennet AI chatbot in seconds — no code, no setup, no technical skills required.",
              },
              {
                t: "Embed",
                d: "Plug it into your website with a single snippet. It goes live the moment it's added.",
              },
              {
                t: "Support",
                d: "It answers your customers 24/7 while your team keeps full control over every response.",
              },
            ].map((s, i) => (
              <div
                key={i}
                data-reveal
                className="group relative overflow-hidden rounded-2xl border border-[#DCE8CF] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#539255]/15 active:scale-[0.98]"
                style={katihar}
              >
                <div className="absolute inset-0 bg-white/92 transition-opacity duration-300 group-hover:bg-white/60 group-active:bg-white/35" />
                <div className="relative p-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#539255] font-semibold text-white">
                    {i + 1}
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-[#16220F]">
                    {s.t}
                  </h3>
                  <p className="mt-3 leading-relaxed text-zinc-600">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA band (full Katihar gradient) ───────────────────────── */}
      <section id="cta" className="relative bg-[#F5F9EF] pb-28">
        <div className="mx-auto max-w-5xl px-6">
          <div
            data-reveal
            className="relative overflow-hidden rounded-3xl px-8 py-16 text-center shadow-xl shadow-[#539255]/20 md:px-16"
            style={katihar}
          >
            <div className="relative">
              <h2 className="text-4xl font-semibold tracking-tight text-[#16220F] md:text-5xl">
                Ready to begin?
              </h2>
              <p className="mx-auto mt-4 max-w-xl font-medium text-[#24331b]">
                Take control of your customer support. Give every visitor
                instant, accurate answers — around the clock.
              </p>
              <div className="mt-8">
                {email ? (
                  <button
                    className="rounded-full bg-white px-8 py-3.5 text-base font-medium text-[#16220F] shadow-md transition-all hover:bg-[#F0F6E9]"
                    onClick={() => navigate.push("/dashboard")}
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <button
                    className="rounded-full bg-white px-8 py-3.5 text-base font-medium text-[#16220F] shadow-md transition-all hover:bg-[#F0F6E9] disabled:opacity-50"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? "Loging..." : "Get started free"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Footer ───────────────────────── */}
      <footer className="border-t border-[#DCE8CF] bg-[#F5F9EF] py-10 text-center text-sm text-zinc-500">
        &copy; {new Date().getFullYear()} Bennet AI. All Rights Reserved
      </footer>
    </div>
  );
};

export default HomeClient;