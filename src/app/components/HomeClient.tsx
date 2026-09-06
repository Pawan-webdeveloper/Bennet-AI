"use client";

import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DitherBackground from "@/components/ui/dither-background";
import SplitText from "@/components/SplitText";
import RotatingText from "@/components/RotatingText";
import ScrollVelocity from "@/components/ScrollVelocity";
import CountUp from "@/components/CountUp";
import GradientText from "@/components/GradientText";
import ShinyText from "@/components/ShinyText";
import TextType from "@/components/TextType";
import SpotlightCard from "@/components/SpotlightCard";
import TiltedCard from "@/components/TiltedCard";
import BorderGlow from "@/components/BorderGlow";
import CurvedInput from "@/components/CurvedInput";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import BounceCards from "@/components/BounceCards";
import AnimatedList from "@/components/AnimatedList";
import MagicBento from "@/components/MagicBento";
import StarBorder from "@/components/StarBorder";
import SpecularButton from "@/components/SpecularButton";
import AccordionGallery from "@/components/AccordionGallery";
import LogoLoop from "@/components/LogoLoop";
import Magnet from "@/components/Magnet";
import FadeContent from "@/components/FadeContent";
import SplashCursor from "@/components/SplashCursor";
import Noise from "@/components/Noise";
import Particles from "@/components/Particles";
import Aurora from "@/components/Aurora";
import Beams from "@/components/Beams";

gsap.registerPlugin(ScrollTrigger);

// Katihar gradient — Ribbon Field stripes (Sea glass → Jade → Sprout).
const katihar = {
  backgroundColor: "#539255",
  backgroundImage:
    "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.045'/></svg>\"), radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0) 52%, rgba(0, 0, 0, 0.064) 100%), linear-gradient(97deg, #539255 1.56%, #539255 15.44%, #91C682 18.56%, #91C682 59.94%, #DDF0C8 61.5%, #DDF0C8 100%)",
  backgroundSize: "120px 120px, auto, auto",
  backgroundBlendMode: "overlay, normal, normal",
} as const;

// Small inline-SVG asset helpers so every visual ships with the page (no network).
const svgUri = (inner: string, w = 600, h = 420) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${inner}</svg>`
  )}`;

const katiharStep = (n: number, title: string) =>
  svgUri(
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='#539255'/><stop offset='0.55' stop-color='#91C682'/><stop offset='1' stop-color='#DDF0C8'/></linearGradient></defs><rect width='600' height='420' fill='url(#g)'/><circle cx='505' cy='78' r='175' fill='#ffffff' opacity='0.2'/><text x='42' y='305' font-family='Arial, Helvetica, sans-serif' font-size='150' font-weight='700' fill='#16220F'>0${n}</text><text x='558' y='104' text-anchor='end' font-family='Arial, Helvetica, sans-serif' font-size='40' font-weight='700' fill='#16220F'>${title}</text>`
  );

const caseImg = (c1: string, c2: string, glyph: string) =>
  svgUri(
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs><rect width='600' height='900' fill='url(#g)'/><circle cx='470' cy='150' r='230' fill='#ffffff' opacity='0.22'/><circle cx='120' cy='760' r='260' fill='#ffffff' opacity='0.14'/><text x='300' y='470' font-family='Arial, Helvetica, sans-serif' font-size='210' text-anchor='middle'>${glyph}</text>`,
    600,
    900
  );

const avatar = (initials: string, bg: string) =>
  svgUri(
    `<rect width='200' height='200' rx='100' fill='${bg}'/><circle cx='100' cy='70' r='34' fill='#ffffff' opacity='0.35'/><text x='100' y='130' font-family='Arial, Helvetica, sans-serif' font-size='64' font-weight='700' fill='#ffffff' text-anchor='middle'>${initials}</text>`,
    200,
    200
  );

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

  // ── Live demo state ─────────────────────────────────────────────
  const botReplies = [
    "Yes, we do offer cash on delivery in most areas — happy to confirm your pin code!",
    "Your order #4821 is out for delivery and should arrive today by 6 PM. 📦",
    "I've started a return for you — the prepaid label is on its way to your inbox.",
    "That's covered under our 30-day guarantee. I'll email you the next steps right away.",
  ];
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hi, I'm Bennet 👋 Ask me about orders, shipping, or refunds." },
  ]);
  const [replyIndex, setReplyIndex] = useState(0);
  const [botTyping, setBotTyping] = useState(false);

  const askBennet = (q: string) => {
    if (!q.trim() || botTyping) return;
    setChatMessages((m) => [...m, { role: "user", text: q.trim() }]);
    setBotTyping(true);
    setTimeout(() => {
      setChatMessages((m) => [
        ...m,
        { role: "bot", text: botReplies[replyIndex % botReplies.length] },
      ]);
      setReplyIndex((i) => i + 1);
      setBotTyping(false);
    }, 950);
  };

  // ── FAQ state ────────────────────────────────────────────────────
  const [openFaq, setOpenFaq] = useState<number>(0);
  const faqs = [
    {
      q: "How long does setup actually take?",
      a: "Under two minutes. Paste one snippet into your site and Bennet is live — trained on your content from the moment it starts.",
    },
    {
      q: "Do I need to know how to code?",
      a: "No. If you can copy and paste a line of code, you can ship Bennet. The embed snippet works on any website, store, or app.",
    },
    {
      q: "How does admin control work?",
      a: "Every response is written by the AI but steered by you. Approve answers, add overrides, and review the conversation log from a simple dashboard.",
    },
    {
      q: "What happens when Bennet doesn't know the answer?",
      a: "It says so honestly, captures the question, and routes it to your team — so nothing slips through the cracks.",
    },
    {
      q: "Can I match its look and tone to my brand?",
      a: "Yes. Colors, avatar, name, personality, and language are all configurable — Bennet sounds like you, not a generic bot.",
    },
    {
      q: "Is my data used to train public models?",
      a: "Never. Your conversations stay yours. Enterprise plans add SSO, audit logs, and full data-residency control.",
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

      // 4. Reveal-on-scroll for section heading blocks marked data-reveal
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

  const brands = [
    "Shopify",
    "Notion",
    "Figma",
    "Linear",
    "Vercel",
    "Stripe",
    "Zapier",
    "Loom",
  ].map((b) => ({
    node: (
      <span className="text-xl font-bold tracking-tight text-zinc-400 transition-colors hover:text-zinc-700">
        {b}
      </span>
    ),
    title: b,
  }));

  const stats = [
    { to: 10000, sep: ",", suffix: "+", label: "Conversations answered" },
    { to: 4.9, sep: "", suffix: "/5", label: "Average rating" },
    { to: 99.9, sep: "", suffix: "%", label: "Uptime, all year" },
    { to: 2, sep: "", suffix: " min", label: "Average setup time" },
  ];

  const testimonials = [
    "Bennet answers 80% of our tickets before we even wake up. Setup took one coffee.",
    "Our CSAT went from 3.9 to 4.8 in the first month. The admin controls are magic.",
    "I plugged it in on a Friday and by Monday our response time was under a minute.",
    "The lead-gen mode quietly turned support chats into $9k of new pipeline.",
    "It sounds like us. Every answer reads like it came from our best support agent.",
  ];

  const avatarImages = [
    avatar("AK", "#3d6b3f"),
    avatar("JM", "#539255"),
    avatar("RS", "#91C682"),
    avatar("TL", "#335028"),
    avatar("NP", "#6fa86a"),
  ];

  const steps = [
    { n: 1, t: "Create", d: "Build your Bennet AI chatbot in seconds — no code, no setup, no technical skills required." },
    { n: 2, t: "Embed", d: "Plug it into your website with a single snippet. It goes live the moment it's added." },
    { n: 3, t: "Support", d: "It answers your customers 24/7 while your team keeps full control over every response." },
  ];

  const tourCards = [
    {
      title: "01 · Embed",
      lines: [
        "<!-- Bennet AI · one line, done -->",
        '<script src="https://cdn.bennet.ai/chat.js"',
        '        data-key="pk_live_9x2kQ4" async></script>',
      ],
      note: "Works on any site, store, or app.",
    },
    {
      title: "02 · Train & control",
      lines: [
        "• Trained on your docs, FAQs & past tickets",
        "• Approve answers, add overrides",
        "• Set tone, language & guardrails",
      ],
      note: "You stay in the driver's seat.",
    },
    {
      title: "03 · Watch it work",
      lines: [
        "Customer: \"Where is my order?\"",
        "Bennet: \"Order #4821 ships today 🚚\"",
        "Customer: \"Can I change the address?\"",
        "Bennet: \"Done — updated in 10 seconds.\"",
      ],
      note: "24/7, in your voice.",
    },
  ];

  const caseItems = [
    { image: caseImg("#539255", "#91C682", "🛒"), label: "E-commerce", alt: "E-commerce support" },
    { image: caseImg("#3d6b3f", "#539255", "🚀"), label: "SaaS onboarding", alt: "SaaS onboarding" },
    { image: caseImg("#91C682", "#DDF0C8", "📈"), label: "Lead capture", alt: "Lead capture" },
    { image: caseImg("#2c4422", "#539255", "🎧"), label: "Support triage", alt: "Support triage" },
    { image: caseImg("#335028", "#91C682", "🏢"), label: "Internal helpdesk", alt: "Internal helpdesk" },
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      tagline: "Try Bennet on one page.",
      features: ["1 chatbot", "100 conversations / month", "Core answers", "Community support"],
      cta: "Start free",
      featured: false,
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      tagline: "For teams that live in their inbox.",
      features: ["Unlimited chatbots", "Unlimited conversations", "Admin control & lead gen", "Analytics dashboard", "Priority support"],
      cta: "Start 14-day trial",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      tagline: "For scale, compliance and SLAs.",
      features: ["SSO & audit logs", "99.9% SLA", "Dedicated success manager", "Custom models & training"],
      cta: "Talk to sales",
      featured: false,
    },
  ];

  const lastBotIndex = (() => {
    let idx = -1;
    chatMessages.forEach((m, i) => {
      if (m.role === "bot") idx = i;
    });
    return idx;
  })();

  return (
    <div ref={rootRef} className="min-h-screen bg-[#F5F9EF] text-[#16220F]">
      {/* ───────── Global atmosphere: fluid cursor + film grain ───────── */}
      <SplashCursor
        TRANSPARENT
        RAINBOW_MODE={false}
        COLOR="#539255"
        DYE_RESOLUTION={1024}
        SPLAT_FORCE={4500}
        VELOCITY_DISSIPATION={1.8}
      />
      <div className="pointer-events-none fixed inset-0 z-[45] opacity-25 mix-blend-multiply">
        <Noise patternAlpha={12} />
      </div>

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
            <a href="#features" className="transition-colors hover:text-[#3d6b3f]">
              Features
            </a>
            <a href="#how" className="transition-colors hover:text-[#3d6b3f]">
              How it works
            </a>
            <a href="#pricing" className="transition-colors hover:text-[#3d6b3f]">
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
                <Magnet magnetStrength={5} padding={24}>
                  <button
                    className="rounded-full border border-[#BFD4AE] bg-white px-5 py-2 text-sm font-medium text-[#16220F] transition-all hover:bg-[#F0F6E9] disabled:opacity-50"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? "Loging..." : "Login"}
                  </button>
                </Magnet>
                <Magnet magnetStrength={5} padding={24}>
                  <button
                    className="hidden rounded-full bg-[#539255] px-5 py-2 text-sm font-medium text-white transition-all hover:bg-[#3d6b3f] disabled:opacity-50 sm:block"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? "Loging..." : "Sign Up"}
                  </button>
                </Magnet>
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
            <RotatingText
              texts={["Zero support tickets.", "Full customer delight.", "No more busy work."]}
              auto
              loop
              rotationInterval={2600}
              transition={{ type: "spring", damping: 26, stiffness: 240 }}
              mainClassName="inline-block text-[#539255]"
              splitLevelClassName="overflow-hidden"
            />
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 md:text-xl">
            Bennet AI plugs a chatbot into your website in minutes — trained on
            your content, controlled by you, and always on.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Magnet magnetStrength={4} padding={40}>
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
            </Magnet>
            <Magnet magnetStrength={4} padding={40}>
              <a
                href="#features"
                className="rounded-full border border-[#BFD4AE] bg-white px-7 py-3.5 text-base font-medium text-[#16220F] transition-all hover:bg-[#F0F6E9]"
              >
                Learn more
              </a>
            </Magnet>
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

      {/* ───────────────────────── Trusted-by band (LogoLoop) ───────────────────────── */}
      <section className="relative border-y border-[#DCE8CF] bg-white/60 py-14">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Powering support for teams at
          </p>
          <div className="mt-9">
            <LogoLoop
              logos={brands}
              speed={26}
              pauseOnHover
              scaleOnHover
              fadeOut
              fadeOutColor="#F5F9EF"
              logoHeight={32}
              gap={56}
            />
          </div>
        </div>
      </section>

      {/* ───────────────────────── Velocity marquee band ───────────────────────── */}
      <section className="relative overflow-hidden bg-[#F5F9EF] py-20">
        <ScrollVelocity
          texts={["Answers 24/7", "No code", "Trained on your content"]}
          velocity={2.5}
          numCopies={4}
          className="text-4xl font-bold uppercase tracking-tight text-[#16220F] md:text-7xl"
        />
      </section>

      {/* ───────────────────────── Features ───────────────────────── */}
      <section id="features" className="relative bg-[#F5F9EF] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div data-reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#539255]">
              Why Bennet AI
            </p>
            <SplitText
              text="Everything support needs. Nothing it doesn't."
              tag="h2"
              splitType="words"
              className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-[#16220F] md:text-5xl"
              textAlign="left"
              from={{ opacity: 0, y: 28 }}
            />
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {features.map((f, index) => (
              <FadeContent key={index} blur threshold={0.12} duration={700} className="h-full">
                <SpotlightCard
                  spotlightColor="rgba(83, 146, 85, 0.22)"
                  className="group !rounded-2xl !border-[#DCE8CF] !bg-transparent !p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#539255]/15 active:scale-[0.98]"
                >
                  <div className="absolute inset-0" style={katihar} />
                  <div className="absolute inset-0 bg-white/92 transition-opacity duration-300 group-hover:bg-white/60 group-active:bg-white/35" />
                  <div className="relative p-8">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#539255]">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-4 text-xl font-semibold text-[#16220F]">{f.title}</h3>
                    <p className="mt-3 leading-relaxed text-zinc-600">{f.desc}</p>
                  </div>
                </SpotlightCard>
              </FadeContent>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── Live demo (BorderGlow + TextType + CurvedInput) ───────────────────────── */}
      <section id="demo" className="relative overflow-hidden bg-[#F5F9EF] py-28">
        <div className="absolute inset-0 opacity-70">
          <Aurora
            colorStops={["#DDF0C8", "#91C682", "#DDF0C8"]}
            amplitude={1.1}
            blend={0.6}
            lightMode
            speed={0.8}
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-6">
          <div data-reveal className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#539255]">
              Live preview
            </p>
            <SplitText
              text="See Bennet answer, in real time."
              tag="h2"
              splitType="words"
              className="mt-4 text-4xl font-semibold tracking-tight text-[#16220F] md:text-5xl"
              textAlign="center"
              from={{ opacity: 0, y: 28 }}
            />
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-zinc-600">
              Type a question below — this is the same engine your customers will talk to.
            </p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl items-start gap-8 lg:grid-cols-[1fr_1.2fr]">
            {/* Copy + question input */}
            <FadeContent blur threshold={0.1} duration={700}>
              <div className="rounded-2xl border border-[#DCE8CF] bg-white/80 p-8 backdrop-blur">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#BFD4AE] bg-[#F0F6E9] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#3d6b3f]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#539255]" />
                  <ShinyText text="Powered by Bennet AI" speed={3} color="#3d6b3f" shineColor="#539255" />
                </span>
                <h3 className="mt-5 text-2xl font-semibold text-[#16220F]">
                  Ask it anything.
                </h3>
                <p className="mt-3 leading-relaxed text-zinc-600">
                  Orders, refunds, shipping, hours — Bennet answers in your voice,
                  with your data. No scripts to write, no flows to map.
                </p>
                <div className="mt-8">
                  <CurvedInput
                    theme="light"
                    placeholder="e.g. Where is my order?"
                    buttonText="Ask"
                    bend={26}
                    width="100%"
                    height={64}
                    onSubmit={askBennet}
                  />
                </div>
              </div>
            </FadeContent>

            {/* Chat window */}
            <FadeContent blur threshold={0.1} duration={700} delay={120}>
              <BorderGlow
                colors={["#539255", "#91C682", "#DDF0C8"]}
                backgroundColor="#ffffff"
                glowColor="120 45 42"
                borderRadius={24}
                animated
                className="!p-0"
              >
                <div className="flex h-[420px] flex-col">
                  <div className="flex items-center justify-between border-b border-[#DCE8CF] px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-2.5 w-2.5 rounded-full bg-red-400" />
                      <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      <span className="flex h-2.5 w-2.5 rounded-full bg-green-400" />
                    </div>
                    <span className="text-xs font-medium text-zinc-400">bennet.ai/chat</span>
                  </div>
                  <div className="flex-1 space-y-4 overflow-y-auto p-5">
                    {chatMessages.map((m, i) => {
                      const isLastBot = i === lastBotIndex;
                      const showTyping = m.role === "bot" && isLastBot && !botTyping;
                      return (
                        <div
                          key={i}
                          className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={
                              m.role === "user"
                                ? "max-w-[80%] rounded-2xl rounded-br-sm bg-[#16220F] px-4 py-2.5 text-sm text-white"
                                : "max-w-[80%] rounded-2xl rounded-bl-sm bg-[#F0F4EA] px-4 py-2.5 text-sm text-zinc-800"
                            }
                          >
                            {showTyping ? (
                              <TextType
                                key={`bot-${i}`}
                                text={m.text}
                                typingSpeed={24}
                                loop={false}
                                startOnVisible
                                showCursor
                              />
                            ) : (
                              m.text
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {botTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-[#F0F4EA] px-4 py-3">
                          {[0, 1, 2].map((d) => (
                            <motion.span
                              key={d}
                              className="h-1.5 w-1.5 rounded-full bg-[#539255]"
                              animate={{ y: [0, -4, 0] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </BorderGlow>
            </FadeContent>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Stats band (CountUp on Katihar) ───────────────────────── */}
      <section className="relative overflow-hidden py-24" style={katihar}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <FadeContent key={i} blur threshold={0.15} duration={700} delay={i * 90}>
                <div className="text-center">
                  <div className="text-5xl font-bold tracking-tight text-[#16220F] md:text-6xl">
                    <CountUp to={s.to} duration={2.2} separator={s.sep} />
                    {s.suffix}
                  </div>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#24331b]">
                    {s.label}
                  </p>
                </div>
              </FadeContent>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── How it works (TiltedCard) ───────────────────────── */}
      <section id="how" className="relative bg-[#F5F9EF] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div data-reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#539255]">
              How it works
            </p>
            <SplitText
              text="From zero to live in three steps."
              tag="h2"
              splitType="words"
              className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-[#16220F] md:text-5xl"
              textAlign="left"
              from={{ opacity: 0, y: 28 }}
            />
          </div>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <FadeContent key={i} blur threshold={0.12} duration={700} delay={i * 90}>
                <TiltedCard
                  imageSrc={katiharStep(s.n, s.t)}
                  altText={s.t}
                  containerHeight="320px"
                  containerWidth="100%"
                  imageHeight="320px"
                  imageWidth="100%"
                  rotateAmplitude={9}
                  scaleOnHover={1.03}
                  showMobileWarning={false}
                  showTooltip={false}
                />
                <p className="mt-4 text-center leading-relaxed text-zinc-600">{s.d}</p>
              </FadeContent>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── Product tour (ScrollStack) ───────────────────────── */}
      <section id="tour" className="relative overflow-hidden bg-[#F5F9EF] py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div data-reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#539255]">
              Product tour
            </p>
            <SplitText
              text="Watch it come together."
              tag="h2"
              splitType="words"
              className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-[#16220F] md:text-5xl"
              textAlign="left"
              from={{ opacity: 0, y: 28 }}
            />
          </div>
        </div>
        <div className="mx-auto max-w-4xl px-6">
          <ScrollStack useWindowScroll itemDistance={110} rotationAmount={2} baseScale={0.88}>
            {tourCards.map((c, i) => (
              <ScrollStackItem
                key={i}
                itemClassName="!h-72 !rounded-3xl border border-[#DCE8CF] !bg-white shadow-xl shadow-[#3d6b3f]/8"
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#539255]">
                  {c.title}
                </p>
                <div className="mt-6 space-y-3 font-mono text-sm text-zinc-700">
                  {c.lines.map((l, j) => (
                    <p key={j} className={l.trim().startsWith("<!--") ? "text-zinc-400" : l.includes('"') ? "text-[#3d6b3f]" : ""}>
                      {l}
                    </p>
                  ))}
                </div>
                <p className="mt-6 text-sm text-zinc-500">{c.note}</p>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </section>

      {/* ───────────────────────── Use cases (AccordionGallery) ───────────────────────── */}
      <section className="relative bg-[#F5F9EF] pb-28">
        <div className="mx-auto max-w-7xl px-6">
          <div data-reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#539255]">
              Where Bennet works
            </p>
            <SplitText
              text="One bot, every conversation."
              tag="h2"
              splitType="words"
              className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-[#16220F] md:text-5xl"
              textAlign="left"
              from={{ opacity: 0, y: 28 }}
            />
          </div>
          <FadeContent blur threshold={0.1} duration={800} className="mt-14">
            <AccordionGallery
              items={caseItems}
              orientation="horizontal"
              height={460}
              gap={10}
              radius={18}
              expandRatio={0.52}
              trigger="hover"
              accentColor="#539255"
              textColor="#ffffff"
              overlayColor="#16220F"
              grayscale={false}
            />
          </FadeContent>
        </div>
      </section>

      {/* ───────────────────────── Testimonials (BounceCards + AnimatedList + Particles) ───────────────────────── */}
      <section className="relative overflow-hidden bg-[#F5F9EF] py-28">
        <div className="absolute inset-0 opacity-70">
          <Particles
            particleCount={55}
            particleColors={["#539255", "#91C682", "#DDF0C8", "#3d6b3f"]}
            particleSpread={6}
            particleBaseSize={2}
            speed={0.35}
            alphaParticles
            className="h-full w-full"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div data-reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#539255]">
                Testimonials
              </p>
              <SplitText
                text="Teams ship support on Bennet."
                tag="h2"
                splitType="words"
                className="mt-4 text-4xl font-semibold tracking-tight text-[#16220F] md:text-5xl"
                textAlign="left"
                from={{ opacity: 0, y: 28 }}
              />
              <p className="mt-5 max-w-md leading-relaxed text-zinc-600">
                From two-person shops to global support teams — here's what happens
                when the busywork disappears.
              </p>
              <div className="mt-10">
                <BounceCards
                  images={avatarImages}
                  containerWidth={560}
                  containerHeight={210}
                  animationDelay={0.3}
                  animationStagger={0.08}
                  transformStyles={[
                    "rotate(9deg) translate(-140px)",
                    "rotate(4deg) translate(-70px)",
                    "rotate(-3deg)",
                    "rotate(-8deg) translate(70px)",
                    "rotate(-4deg) translate(140px)",
                  ]}
                />
                <div className="mt-6 text-sm font-semibold text-[#3d6b3f]">
                  <GradientText
                    colors={["#539255", "#3d6b3f", "#91C682"]}
                    animationSpeed={6}
                    showBorder={false}
                  >
                    2,000+ teams · 4.9/5 average rating
                  </GradientText>
                </div>
              </div>
            </div>
            <FadeContent blur threshold={0.1} duration={800}>
              <AnimatedList
                items={testimonials}
                showGradients={false}
                enableArrowNavigation={false}
                displayScrollbar={false}
                className="!w-full"
                itemClassName="!bg-white !rounded-2xl border border-[#DCE8CF] shadow-sm hover:!bg-[#F0F6E9] [&_p]:!text-[#16220F] [&_p]:!leading-relaxed"
              />
            </FadeContent>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Everything included (MagicBento) ───────────────────────── */}
      <section id="included" className="relative bg-[#F5F9EF] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div data-reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#539255]">
              Everything included
            </p>
            <SplitText
              text="One platform. Every channel."
              tag="h2"
              splitType="words"
              className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-[#16220F] md:text-5xl"
              textAlign="left"
              from={{ opacity: 0, y: 28 }}
            />
          </div>
          <div className="mt-14 overflow-hidden rounded-3xl">
            <MagicBento
              glowColor="83, 146, 85"
              enableStars
              enableSpotlight
              enableBorderGlow
              enableMagnetism
              enableTilt={false}
              textAutoHide
              clickEffect
            />
          </div>
        </div>
      </section>

      {/* ───────────────────────── Pricing (TiltedCard → SpotlightCard + StarBorder + SpecularButton) ───────────────────────── */}
      <section id="pricing" className="relative bg-[#F5F9EF] pb-28">
        <div className="mx-auto max-w-7xl px-6">
          <div data-reveal className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#539255]">
              Pricing
            </p>
            <SplitText
              text="Start free. Scale when you're ready."
              tag="h2"
              splitType="words"
              className="mt-4 text-4xl font-semibold tracking-tight text-[#16220F] md:text-5xl"
              textAlign="center"
              from={{ opacity: 0, y: 28 }}
            />
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-zinc-600">
              Every plan includes the core chatbot. Upgrade for control, scale, and support.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {plans.map((p, i) => (
              <FadeContent key={p.name} blur threshold={0.1} duration={700} delay={i * 90} className="h-full">
                {p.featured ? (
                  <StarBorder
                    as="div"
                    className="h-full w-full rounded-3xl"
                    color="#539255"
                    speed="7s"
                    backgroundColor="rgba(255, 255, 255, 0.55)"
                    textColor="#16220F"
                    borderColor="#BFD4AE"
                  >
                    <div className="relative">
                      <span className="absolute -top-1 right-2 rounded-full bg-[#539255] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                        Most popular
                      </span>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3d6b3f]">
                        {p.name}
                      </p>
                      <div className="mt-3 flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-bold">{p.price}</span>
                        {p.period && <span className="text-sm text-zinc-500">{p.period}</span>}
                      </div>
                      <p className="mt-2 text-sm text-zinc-500">{p.tagline}</p>
                      <ul className="mx-auto mt-6 max-w-[240px] space-y-2 text-left text-sm text-zinc-700">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <span className="mt-0.5 text-[#539255]">✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8 flex justify-center">
                        <SpecularButton
                          size="md"
                          tint="#539255"
                          baseColor="#16220F"
                          textColor="#ffffff"
                          intensity={1}
                          onClick={handleLogin}
                        >
                          {p.cta}
                        </SpecularButton>
                      </div>
                    </div>
                  </StarBorder>
                ) : (
                  <SpotlightCard
                    spotlightColor="rgba(83, 146, 85, 0.2)"
                    className="group !rounded-3xl !border-[#DCE8CF] !bg-transparent !p-0 h-full shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#539255]/15"
                  >
                    <div className="absolute inset-0" style={katihar} />
                    <div className="absolute inset-0 bg-white/92 transition-opacity duration-300 group-hover:bg-white/70" />
                    <div className="relative flex h-full flex-col p-8 text-center">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#3d6b3f]">
                        {p.name}
                      </p>
                      <div className="mt-3 flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-bold">{p.price}</span>
                        {p.period && <span className="text-sm text-zinc-500">{p.period}</span>}
                      </div>
                      <p className="mt-2 text-sm text-zinc-500">{p.tagline}</p>
                      <ul className="mx-auto mt-6 max-w-[240px] flex-1 space-y-2 text-left text-sm text-zinc-700">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-start gap-2">
                            <span className="mt-0.5 text-[#539255]">✓</span>
                            {f}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-8 flex justify-center">
                        <Magnet magnetStrength={4} padding={32}>
                          <button
                            className="rounded-full border border-[#BFD4AE] bg-white px-7 py-2.5 text-sm font-medium text-[#16220F] transition-all hover:bg-[#F0F6E9] disabled:opacity-50"
                            onClick={handleLogin}
                            disabled={loading}
                          >
                            {p.cta}
                          </button>
                        </Magnet>
                      </div>
                    </div>
                  </SpotlightCard>
                )}
              </FadeContent>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── FAQ ───────────────────────── */}
      <section id="faq" className="relative bg-[#F5F9EF] pb-28">
        <div className="mx-auto max-w-3xl px-6">
          <div data-reveal className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#539255]">
              FAQ
            </p>
            <SplitText
              text="Questions, answered."
              tag="h2"
              splitType="words"
              className="mt-4 text-4xl font-semibold tracking-tight text-[#16220F] md:text-5xl"
              textAlign="center"
              from={{ opacity: 0, y: 28 }}
            />
          </div>
          <div className="mt-14 space-y-4">
            {faqs.map((f, i) => (
              <SpotlightCard
                key={i}
                spotlightColor="rgba(83, 146, 85, 0.16)"
                className="!rounded-2xl !border-[#DCE8CF] !bg-white !p-0 shadow-sm"
              >
                <button
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  aria-expanded={openFaq === i}
                >
                  <span className="font-semibold text-[#16220F]">{f.q}</span>
                  <motion.span
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#F0F6E9] text-lg font-medium text-[#3d6b3f]"
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 leading-relaxed text-zinc-600">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA band (Beams + GradientText + Magnet) ───────────────────────── */}
      <section id="cta" className="relative overflow-hidden py-28">
        <div className="absolute inset-0" style={katihar} />
        <div className="absolute inset-0 opacity-50">
          <Beams />
        </div>
        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <div className="inline-block rounded-full bg-white/40 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#24331b] backdrop-blur">
            <ShinyText text="Free to start · No credit card" speed={3} color="#24331b" shineColor="#ffffff" />
          </div>
          <div
            role="heading"
            aria-level={2}
            className="mt-6 text-4xl font-semibold tracking-tight md:text-6xl"
          >
            <GradientText
              colors={["#16220F", "#3d6b3f", "#16220F"]}
              animationSpeed={6}
              showBorder={false}
            >
              Ready to begin?
            </GradientText>
          </div>
          <p className="mx-auto mt-4 max-w-xl text-lg font-medium text-[#24331b]">
            Take control of your customer support. Give every visitor instant,
            accurate answers — around the clock.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Magnet magnetStrength={4} padding={40}>
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
            </Magnet>
            <Magnet magnetStrength={4} padding={40}>
              <a
                href="#demo"
                className="rounded-full border border-[#16220F]/25 bg-white/40 px-8 py-3.5 text-base font-medium text-[#16220F] backdrop-blur transition-all hover:bg-white/70"
              >
                See it live
              </a>
            </Magnet>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Footer ───────────────────────── */}
      <footer className="border-t border-[#DCE8CF] bg-[#F5F9EF] py-12">
        <FadeContent threshold={0.05} duration={700}>
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
            <div className="text-sm text-zinc-500">
              &copy; {new Date().getFullYear()} Bennet AI. All Rights Reserved
            </div>
            <div className="flex items-center gap-3">
              {["𝕏", "in", "gh"].map((label, i) => (
                <Magnet key={i} magnetStrength={6} padding={18}>
                  <a
                    href="#"
                    aria-label={`Social link ${i + 1}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#BFD4AE] bg-white text-sm font-semibold text-[#3d6b3f] transition-all hover:bg-[#F0F6E9]"
                  >
                    {label}
                  </a>
                </Magnet>
              ))}
            </div>
            <div className="text-sm text-zinc-500">
              Built with <span className="font-semibold text-[#539255]">Bennet AI</span>
            </div>
          </div>
        </FadeContent>
      </footer>
    </div>
  );
};

export default HomeClient;