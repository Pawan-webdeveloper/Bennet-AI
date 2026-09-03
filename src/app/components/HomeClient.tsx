"use client";

import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";

const HomeClient = ({ email }: { email: string }) => {

  const [loading, setLoading] = useState(false)
  const handleLogin = () => {
    setLoading(true)
    window.location.href = "/api/auth/login";
  };
  const First = email?.split("@")[0][0]?.toUpperCase();
  const [open, setOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
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
      desc: "This chatbot can directly plugged in your website"
    },
    {
      title: "Admin Control",
      desc: "Admin can directly control the AI responses"
    },
    {
      title: "Available 24/7",
      desc: "This chatbot is available always"
    }
  ]
  const handleLogOut = async () => {
    try {
      const result = await axios.get("api/auth/logout")
      window.location.href = "/";
    } catch (error) {
      console.log(error)
    }
  }
  const navigate = useRouter()
  return (
    <>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed bg-white/70 top-0 left-0 border-b border-zinc-900 z-50 backdrop-blur-xl w-full"
      >
        <div className="flex items-center justify-between px-6 max-w-7xl mx-auto h-16">
          <div className="font-bold tracking-light text-lg">
            Bennet <span className="text-zinc-400">AI</span>
          </div>
          {email ? (
            <div className="relative" ref={popupRef}>
              <button
                className="bg-black text-white px-4 py-2 w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-600 transition-all disabled:opacity-50 font-medium"
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
                    className="absolute right-0 mt-3 w-44  bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden"
                  >
                    <button className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-100 transition-all" onClick={() => navigate.push('/dashboard')}>
                      Dashboard
                    </button>
                    <button className="w-full text-left text-red-500 px-4 py-3 text-sm hover:bg-zinc-100 transition-all" onClick={handleLogOut}>
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              className="bg-black text-white px-4 py-2 rounded-full hover:bg-zinc-600 transition-all disabled:opacity-50 font-medium"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Loging..." : "Login"}
            </button>
          )}
        </div>
      </motion.div>

      <FlowArt aria-label="Bennet AI presentation">
        <FlowSection aria-label="Qui nous sommes" style={{ backgroundColor: '#fd5200', color: '#fff' }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em]">01 — Who we are</p>
          <hr className="my-[2vw] border-t border-black" />
          <div>
            <h1
              className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
            >
              Answers
              <br />
              24/7
              <br />
              No Code
            </h1>
          </div>
          <hr className="my-[2vw] border-t border-black" />
          <div className="mt-auto flex flex-col items-start gap-[2vw]">
            <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
              Bennet AI is a powerful tool that allows you to create a chatbot
              for your own website in seconds, with no code required. With
              Bennet AI, you can easily create a chatbot that can answer your
              customers&apos; questions, provide support, and even help you
              generate leads.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {email ? (
                <button
                  className="bg-black text-white px-6 py-3 rounded-full hover:bg-zinc-600 transition-all disabled:opacity-50 font-medium"
                  onClick={() => navigate.push('/dashboard')}
                >
                  Go to Dashboard
                </button>
              ) : (
                <button
                  className="bg-black text-white px-6 py-3 rounded-full hover:bg-zinc-600 transition-all disabled:opacity-50 font-medium"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Loging..." : "Get Started"}
                </button>
              )}

              <a href="#features" className="bg-white text-black border border-zinc-300 px-6 py-3 rounded-full hover:bg-zinc-100 transition-all font-medium">
                Learn More
              </a>
            </div>
          </div>
        </FlowSection>

        <FlowSection aria-label="La démonstration" style={{ backgroundColor: '#000', color: '#fff' }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em]">02 — See it in action</p>
          <hr className="my-[2vw] border-t border-white/60" />
          <div>
            <h2
              className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
            >
              Support
              <br />
              On
              <br />
              Autopilot
            </h2>
          </div>
          <hr className="my-[2vw] border-t border-white/60" />
          <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
            Plug Bennet AI into your website and watch it answer your
            customers&apos; questions instantly — available around the clock,
            never asleep, never late.
          </p>
          <div className="mt-auto flex justify-center">
            <div className="w-full max-w-xl">
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-900 shadow-2xl">
                <div className="mb-3 text-sm text-zinc-500">
                  Live Chat Preview
                </div>
                <div className="space-y-4">
                  <div className="bg-zinc-100 rounded-lg px-4 py-2 text-sm w-fit">
                    Do you offer cash on delivery?
                  </div>
                  <div className="bg-black text-white ml-auto w-fit rounded-lg px-4 py-2 text-sm ">
                    Yes, we do offer cash on delivery in most areas.
                  </div>
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center shadow-xl"
                  >
                    💬
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </FlowSection>

        <FlowSection aria-label="Pourquoi Bennet AI" style={{ backgroundColor: '#F5F0E8', color: '#000' }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em]">03 — Why Bennet AI</p>
          <hr className="my-[2vw] border-t border-black/60" />
          <div>
            <h2
              className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
            >
              No Code.
              <br />
              No Hassle.
              <br />
              All Answers.
            </h2>
          </div>
          <hr className="my-[2vw] border-t border-black/60" />
          <div id="features" className="flex flex-wrap gap-[3vw]">
            {features.map((f, index) => (
              <div key={index} className="min-w-[180px] flex-1">
                <p className="mb-2 text-sm font-bold uppercase tracking-wider">
                  {String(index + 1).padStart(2, "0")} — {f.title}
                </p>
                <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </FlowSection>

        <FlowSection aria-label="Comment ça marche" style={{ backgroundColor: '#1A3DE8', color: '#fff' }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em]">04 — How it works</p>
          <hr className="my-[2vw] border-t border-white/50" />
          <div>
            <h2
              className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
            >
              From
              <br />
              Zero
              <br />
              To Live
            </h2>
          </div>
          <hr className="my-[2vw] border-t border-white/50" />
          <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
            Three steps. Zero complexity. Your chatbot is up and answering
            visitors the moment you finish.
          </p>
          <hr className="my-[2vw] border-t border-white/50" />
          <div className="flex flex-wrap gap-[3vw]">
            <div className="min-w-[180px] flex-1">
              <p className="mb-2 text-sm font-bold uppercase tracking-wider">01 — Create</p>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Build your Bennet AI chatbot in seconds — no code, no setup,
                no technical skills required.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <p className="mb-2 text-sm font-bold uppercase tracking-wider">02 — Embed</p>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                Plug it directly into your website with a single snippet. It
                goes live the moment it&apos;s added.
              </p>
            </div>
            <div className="min-w-[180px] flex-1">
              <p className="mb-2 text-sm font-bold uppercase tracking-wider">03 — Support</p>
              <p className="text-[clamp(0.85rem,1.3vw,1.05rem)] leading-relaxed opacity-75">
                It answers your customers 24/7 while your team keeps full
                control over every response.
              </p>
            </div>
          </div>
        </FlowSection>

        <FlowSection aria-label="Nous rejoindre" style={{ backgroundColor: '#000', color: '#fff' }}>
          <p className="text-xs font-bold uppercase tracking-[0.2em]">05 — Join us</p>
          <hr className="my-[2vw] border-t border-white/60" />
          <div>
            <h2
              className="text-[clamp(3.5rem,12vw,14rem)] font-bold leading-[0.85] uppercase tracking-tight"
            >
              Ready
              <br />
              To
              <br />
              Begin?
            </h2>
          </div>
          <hr className="my-[2vw] border-t border-white/60" />
          <div className="mt-auto flex flex-col items-start gap-[2vw]">
            <p className="max-w-[50ch] text-[clamp(1rem,2.5vw,2rem)] font-normal leading-relaxed">
              Take control of your customer support. Join now and give every
              visitor instant, accurate answers — around the clock.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {email ? (
                <button
                  className="bg-black text-white px-6 py-3 rounded-full border border-white/30 hover:bg-zinc-600 transition-all disabled:opacity-50 font-medium"
                  onClick={() => navigate.push('/dashboard')}
                >
                  Go to Dashboard
                </button>
              ) : (
                <button
                  className="bg-black text-white px-6 py-3 rounded-full border border-white/30 hover:bg-zinc-600 transition-all disabled:opacity-50 font-medium"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Loging..." : "Get Started"}
                </button>
              )}
            </div>
          </div>
          <footer className="text-center text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Bennet AI. All Rights Reserved
          </footer>
        </FlowSection>
      </FlowArt>
    </>
  );
};

export default HomeClient;