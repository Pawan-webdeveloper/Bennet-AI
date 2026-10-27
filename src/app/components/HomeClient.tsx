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

const caseImg = (c1: string, c2: string, icon: string) =>
  svgUri(
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/></linearGradient></defs><rect width='600' height='900' fill='url(#g)'/><circle cx='470' cy='150' r='230' fill='#ffffff' opacity='0.22'/><circle cx='120' cy='760' r='260' fill='#ffffff' opacity='0.14'/><circle cx='300' cy='460' r='92' fill='#ffffff' opacity='0.92'/><g transform='translate(238 398) scale(1.24)' fill='none' stroke='#2c4422' stroke-width='6' stroke-linecap='round' stroke-linejoin='round'>${icon}</g>`,
    600,
    900
  );

// Stroke icons for the use-case artwork (SVG, not emoji — design checklist)
const caseIcons: Record<string, string> = {
  cart: `<path d='M6 16 H20 L32 62 H74 L86 30 H26'/><circle cx='38' cy='78' r='7'/><circle cx='68' cy='78' r='7'/>`,
  rocket: `<path d='M50 6 C63 20 67 38 62 58 L38 58 C33 38 37 20 50 6 Z'/><circle cx='50' cy='34' r='8'/><path d='M38 58 L26 78 L42 68'/><path d='M62 58 L74 78 L58 68'/><path d='M44 70 L50 88 L56 70'/>`,
  chart: `<path d='M12 10 V88 H90'/><path d='M22 70 L44 48 L58 60 L84 28'/><path d='M72 28 H84 V40'/>`,
  headset: `<path d='M14 58 a36 36 0 0 1 72 0'/><rect x='8' y='56' width='16' height='26' rx='7'/><rect x='76' y='56' width='16' height='26' rx='7'/><path d='M88 80 v2 a10 10 0 0 1 -10 10 H64'/>`,
  building: `<path d='M22 90 V18 a4 4 0 0 1 4 -4 h48 a4 4 0 0 1 4 4 V90'/><path d='M10 90 H90'/><g fill='#2c4422' stroke='none'><rect x='34' y='28' width='9' height='9' rx='1.5'/><rect x='57' y='28' width='9' height='9' rx='1.5'/><rect x='34' y='48' width='9' height='9' rx='1.5'/><rect x='57' y='48' width='9' height='9' rx='1.5'/><rect x='34' y='68' width='9' height='9' rx='1.5'/><rect x='57' y='68' width='9' height='9' rx='1.5'/></g>`,
};

const avatar = (initials: string, bg: string) =>
  svgUri(
    `<rect width='200' height='200' rx='100' fill='${bg}'/><circle cx='100' cy='70' r='34' fill='#ffffff' opacity='0.35'/><text x='100' y='130' font-family='Arial, Helvetica, sans-serif' font-size='64' font-weight='700' fill='#ffffff' text-anchor='middle'>${initials}</text>`,
    200,
    200
  );

// ── Shared page data (module-level: static, no re-render cost) ─────────────

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
];

const integrations = [
  { name: "Shopify", mono: "Sh", desc: "Sync orders, tracking & refunds." },
  { name: "Slack", mono: "Sl", desc: "Escalations straight to your channels." },
  { name: "Zendesk", mono: "Zd", desc: "Hand off to human agents with context." },
  { name: "Intercom", mono: "Ic", desc: "Answer in-app where users already are." },
  { name: "HubSpot", mono: "Hs", desc: "Push qualified leads into your CRM." },
  { name: "Zapier", mono: "Zp", desc: "Automate across 5,000+ apps." },
  { name: "WordPress", mono: "Wp", desc: "One-snippet embed for any site." },
  { name: "WhatsApp", mono: "Wa", desc: "Support customers where they chat." },
];

const securityItems = [
  {
    icon: "M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z",
    title: "SOC 2 Type II",
    desc: "Independently audited controls for security, availability, and confidentiality.",
  },
  {
    icon: "M12 21a9.003 9.003 0 0 0 8.716-6.747M12 21a9.003 9.003 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m-18.432 0A8.959 8.959 0 0 1 3 12c0-.778.099-1.533.284-2.253",
    title: "GDPR & EU residency",
    desc: "EU data-residency options, signed DPA, and full data export on request.",
  },
  {
    icon: "M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z",
    title: "AES-256 encryption",
    desc: "Every conversation is encrypted in transit and at rest.",
  },
  {
    icon: "M3 12h4.5l2.25 6L14.25 6l2.25 6H21",
    title: "99.9% uptime SLA",
    desc: "Redundant infrastructure monitored around the clock, with a public status page.",
  },
];

const socials = [
  { label: "Bennet AI on X", href: "#", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" },
  { label: "Bennet AI on LinkedIn", href: "#", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0Z" },
  { label: "Bennet AI on GitHub", href: "#", path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
];

const footerCols = [
  {
    title: "Product",
    links: [
      ["Features", "#features"],
      ["How it works", "#how"],
      ["Live demo", "#demo"],
      ["Integrations", "#integrations"],
      ["Pricing", "#pricing"],
    ] as [string, string][],
  },
  {
    title: "Company",
    links: [
      ["About", "#"],
      ["Blog", "#"],
      ["Careers", "#"],
      ["Contact", "mailto:hello@bennet.ai"],
    ] as [string, string][],
  },
  {
    title: "Resources",
    links: [
      ["Documentation", "#"],
      ["API reference", "#"],
      ["Community", "#"],
      ["Status", "#"],
    ] as [string, string][],
  },
  {
    title: "Legal",
    links: [
      ["Privacy Policy", "#"],
      ["Terms of Service", "#"],
      ["Security", "#security"],
      ["DPA", "#"],
    ] as [string, string][],
  },
];

// Accessible SVG icon helper (skill rule: no emoji as icons)
const OutlineIcon = ({ d, className = "h-6 w-6" }: { d: string; className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

const HomeClient = ({ email }: { email: string }) => {
  const [loading, setLoading] = useState(false);
  const handleLogin = () => {
    setLoading(true);
    window.location.href = "/api/auth/login";
  };
  const First = email?.split("@")[0][0]?.toUpperCase();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [annual, setAnnual] = useState(true);
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
    "Your order #4821 is out for delivery and should arrive today by 6 PM.",
    "I've started a return for you — the prepaid label is on its way to your inbox.",
    "That's covered under our 30-day guarantee. I'll email you the next steps right away.",
  ];
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hi, I'm Bennet — ask me about orders, shipping, or refunds." },
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
        "Bennet: \"Order #4821 ships today\"",
        "Customer: \"Can I change the address?\"",
        "Bennet: \"Done — updated in 10 seconds.\"",
      ],
      note: "24/7, in your voice.",
    },
  ];

  const caseItems = [
    { image: caseImg("#539255", "#91C682", caseIcons.cart), label: "E-commerce", alt: "E-commerce support" },
    { image: caseImg("#3d6b3f", "#539255", caseIcons.rocket), label: "SaaS onboarding", alt: "SaaS onboarding" },
    { image: caseImg("#91C682", "#DDF0C8", caseIcons.chart), label: "Lead capture", alt: "Lead capture" },
    { image: caseImg("#2c4422", "#539255", caseIcons.headset), label: "Support triage", alt: "Support triage" },
    { image: caseImg("#335028", "#91C682", caseIcons.building), label: "Internal helpdesk", alt: "Internal helpdesk" },
  ];

  const plans: {
    name: string;
    price: string;
    annualPrice?: string;
    period: string;
    tagline: string;
    features: string[];
    cta: string;
    featured: boolean;
  }[] = [
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
      annualPrice: "$23",
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
      {/* Accessibility: keyboard users can skip straight to the content */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[#16220F] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

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

          <nav aria-label="Primary" className="hidden items-center gap-8 text-sm text-zinc-600 md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-[#3d6b3f]">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#BFD4AE] bg-white text-[#16220F] md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="h-5 w-5" aria-hidden="true">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
            {email ? (
              <div className="relative" ref={popupRef}>
                <button
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#16220F] font-medium text-white transition-all hover:bg-[#2c3d24] disabled:opacity-50"
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
                    className="min-h-[44px] rounded-full border border-[#BFD4AE] bg-white px-5 py-2.5 text-sm font-medium text-[#16220F] transition-all hover:bg-[#F0F6E9] disabled:opacity-50"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </Magnet>
                <Magnet magnetStrength={5} padding={24}>
                  <button
                    className="hidden min-h-[44px] rounded-full bg-[#539255] px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-[#3d6b3f] disabled:opacity-50 sm:block"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Sign Up"}
                  </button>
                </Magnet>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu panel — the desktop links are hidden below md */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-t border-[#DCE8CF] bg-white/95 backdrop-blur-xl md:hidden"
            >
              <div className="space-y-1 px-6 py-4">
                {navLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 text-base font-medium text-[#16220F] transition-colors hover:bg-[#F0F6E9]"
                  >
                    {l.label}
                  </a>
                ))}
                <div className="mt-2 flex flex-col gap-2 border-t border-[#DCE8CF] pt-3">
                  {email ? (
                    <>
                      <a
                        href="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-xl bg-[#16220F] px-3 py-3 text-center text-base font-medium text-white"
                      >
                        Dashboard
                      </a>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          handleLogOut();
                        }}
                        className="block rounded-xl border border-[#BFD4AE] bg-white px-3 py-3 text-center text-base font-medium text-[#16220F]"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      className="block w-full rounded-full bg-[#539255] px-3 py-3 text-base font-medium text-white disabled:opacity-50"
                      onClick={handleLogin}
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Get started free"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <main id="main">

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
          <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/70 to-[#F5F9EF]" />
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
                  {loading ? "Logging in..." : "Start building for free"}
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
            <p className="mb-5 text-sm text-zinc-600">
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
                    className="flex items-center gap-10 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em] text-zinc-600"
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
          <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-zinc-600">
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
                From two-person shops to global support teams — here&apos;s what happens
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

      {/* ───────────────────────── Integrations ───────────────────────── */}
      <section id="integrations" className="relative bg-[#F5F9EF] py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div data-reveal className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#539255]">
              Integrations
            </p>
            <SplitText
              text="Plays nicely with your stack."
              tag="h2"
              splitType="words"
              className="mt-4 text-4xl font-semibold tracking-tight text-[#16220F] md:text-5xl"
              textAlign="center"
              from={{ opacity: 0, y: 28 }}
            />
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-zinc-600">
              Connect Bennet to the tools you already use — orders, tickets, and leads flow both ways.
            </p>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {integrations.map((it, i) => (
              <FadeContent key={it.name} blur threshold={0.1} duration={600} delay={i * 60} className="h-full">
                <SpotlightCard
                  spotlightColor="rgba(83, 146, 85, 0.18)"
                  className="group !rounded-2xl !border-[#DCE8CF] !bg-white !p-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#539255]/15"
                >
                  <div className="relative p-6">
                    <span
                      aria-hidden="true"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#BFD4AE] bg-[#F0F6E9] text-base font-bold text-[#3d6b3f]"
                    >
                      {it.mono}
                    </span>
                    <h3 className="mt-4 font-semibold text-[#16220F]">{it.name}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-zinc-600">{it.desc}</p>
                  </div>
                </SpotlightCard>
              </FadeContent>
            ))}
          </div>
          <FadeContent blur threshold={0.1} duration={600}>
            <p className="mt-8 text-center text-sm text-zinc-600">
              Need something else? The Bennet API and Zapier connect it to 5,000+ apps.
            </p>
          </FadeContent>
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

            {/* Billing toggle — transparent annual savings (landing-pattern rule) */}
            <div className="mt-8 inline-flex items-center rounded-full border border-[#BFD4AE] bg-white p-1 text-sm font-medium shadow-sm">
              <button
                type="button"
                aria-pressed={!annual}
                onClick={() => setAnnual(false)}
                className={
                  annual
                    ? "rounded-full px-5 py-2 text-zinc-600 transition-colors"
                    : "rounded-full bg-[#539255] px-5 py-2 text-white transition-colors"
                }
              >
                Monthly
              </button>
              <button
                type="button"
                aria-pressed={annual}
                onClick={() => setAnnual(true)}
                className={
                  annual
                    ? "rounded-full bg-[#539255] px-5 py-2 text-white transition-colors"
                    : "rounded-full px-5 py-2 text-zinc-600 transition-colors"
                }
              >
                Annual · save 20%
              </button>
            </div>
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
                        <span className="text-5xl font-bold">{p.annualPrice && annual ? p.annualPrice : p.price}</span>
                        {p.period && <span className="text-sm text-zinc-500">{p.annualPrice && annual ? "/mo · billed yearly" : p.period}</span>}
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
                        <span className="text-5xl font-bold">{p.annualPrice && annual ? p.annualPrice : p.price}</span>
                        {p.period && <span className="text-sm text-zinc-500">{p.annualPrice && annual ? "/mo · billed yearly" : p.period}</span>}
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

      {/* ───────────────────────── Security & compliance ───────────────────────── */}
      <section id="security" className="relative border-y border-[#DCE8CF] bg-white/60 py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div data-reveal className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#539255]">
              Security &amp; compliance
            </p>
            <SplitText
              text="Your data stays yours."
              tag="h2"
              splitType="words"
              className="mt-4 text-4xl font-semibold tracking-tight text-[#16220F] md:text-5xl"
              textAlign="center"
              from={{ opacity: 0, y: 28 }}
            />
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-zinc-600">
              Bennet handles your customers&apos; conversations — so it&apos;s built to the standards your
              security team expects.
            </p>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {securityItems.map((item, i) => (
              <FadeContent key={item.title} blur threshold={0.12} duration={700} delay={i * 90} className="h-full">
                <div className="h-full rounded-2xl border border-[#DCE8CF] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#539255]/15">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#BFD4AE] bg-[#F0F6E9] text-[#3d6b3f]">
                    <OutlineIcon d={item.icon} />
                  </span>
                  <h3 className="mt-5 font-semibold text-[#16220F]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.desc}</p>
                </div>
              </FadeContent>
            ))}
          </div>
          <FadeContent blur threshold={0.1} duration={600}>
            <p className="mt-10 text-center text-sm text-zinc-600">
              Need our security whitepaper or a signed DPA?{' '}
              <a href="mailto:security@bennet.ai" className="font-semibold text-[#3d6b3f] underline decoration-[#91C682] underline-offset-4 transition-colors hover:text-[#16220F]">
                Email security@bennet.ai
              </a>{' '}
              — we reply within one business day.
            </p>
          </FadeContent>
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
                  aria-controls={`faq-panel-${i}`}
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
                      id={`faq-panel-${i}`}
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
                  {loading ? "Logging in..." : "Get started free"}
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

      </main>

      {/* ───────────────────────── Footer ───────────────────────── */}
      <footer className="border-t border-[#DCE8CF] bg-[#F5F9EF]">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 md:grid-cols-[1.6fr_repeat(4,1fr)]">
            <div>
              <div className="text-lg font-bold tracking-tight">
                Bennet <span className="text-[#539255]">AI</span>
              </div>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-600">
                The AI support agent that answers your customers 24/7 — trained on your content,
                controlled by you.
              </p>
              <div className="mt-5 flex items-center gap-3">
                {socials.map((s) => (
                  <Magnet key={s.label} magnetStrength={6} padding={18}>
                    <a
                      href={s.href}
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#BFD4AE] bg-white text-[#3d6b3f] transition-all hover:bg-[#F0F6E9]"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                        <path d={s.path} />
                      </svg>
                    </a>
                  </Magnet>
                ))}
              </div>
            </div>
            {footerCols.map((col) => (
              <nav key={col.title} aria-label={`Footer — ${col.title}`}>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#16220F]">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map(([label, href]) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="text-sm text-zinc-600 transition-colors hover:text-[#3d6b3f]"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#DCE8CF] pt-8 text-sm text-zinc-600 md:flex-row">
            <div>&copy; {new Date().getFullYear()} Bennet AI. All rights reserved.</div>
            <div>
              Built with <span className="font-semibold text-[#539255]">Bennet AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeClient;