"use client";

import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import { div } from "motion/react-client";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const HomeClient = ({ email }: { email: string }) => {

  const [loading,setLoading] = useState(false)
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

  const features= [
    {
      title: "Plug-in-play",
      desc: "This chatbot can directly pluged in your website"
    },
    {
      title: "Admin Control",
      desc: "Admin can directly control the Ai responses"
    },
    {
      title: "Avaliable 24*7",
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
      <div className="min-h-screen bg-linear-to-br from-white to-zinc-50  text-zinc-900 overflow-x-hidden">
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
                      <button className="w-full text-left px-4 py-3 text-sm hover:bg-zinc-100 transition-all" onClick={()=> navigate.push('/dashboard')}>
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
                {loading? "Loging...": "Login"}
              </button>
            )}
          </div>
        </motion.div>

        <section className="pt-36 pb-28 px-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                Bennet AI <br /> Built for modern websites
              </h1>
              <p className="text-zinc-700 mt-6 text-lg">
                Bennet AI is a powerful tool that allows you to create a chatbot
                for your own website in seconds, with no code required. With
                Bennet AI, you can easily create a chatbot that can answer your
                customers' questions, provide support, and even help you
                generate leads.
              </p>
              <div className="flex items-center ">
                {email ? (
                  <button
                    className="bg-black text-white px-6 py-3 rounded-full mt-8 hover:bg-zinc-600 transition-all disabled:opacity-50 font-medium"
                    onClick={()=> navigate.push('/dashboard')}
                  >
                    Go to Dashboard
                  </button>
                ) : (
                  <button
                    className="bg-black text-white px-6 py-3 rounded-full mt-8 hover:bg-zinc-600 transition-all disabled:opacity-50 font-medium"
                    onClick={handleLogin}
                  >
                    Get Started
                  </button>
                )}

                <a href="#features" className="bg-white text-black border border-zinc-300 px-6 py-3 rounded-full mt-8 hover:bg-zinc-100 transition-all disabled:opacity-50 font-medium ml-4">
                  Learn More
                </a>
              </div>
            </motion.div>
            <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="relative"
            >
<div className="rounded-2xl border border-zinc-200 bg-white shadow-2xl p-6">
  <div className="text-sm text-zinc-500 mb-3">
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
          animate= {{ y: [0, -12, 0]}}
          transition={{ repeat: Infinity, duration: 3 }}
          className=" absolute -bottom-6 -right-6 w-14  h-14 rounded-full bg-black text-white flex items-center justify-center shadow-xl"
          
          >
            💬
          </motion.div>
  </div>

</div>
            </motion.div>
          </div>
        </section>
        <section id="features" className="py-28 px-6 bg-zinc-50 border-t border-zinc-200">
                <div className="max-w-6xl mx-auto ">
                  <motion.h2 
                  initial={{opacity: 0, y: 20}}
                  whileInView={{opacity: 1, y: 0}}
                  transition={{duration : 0.5, delay: 0.2}}
                  viewport={{once: false}}
                  className="text-3xl  font-semibold text-center "
                  >
                    Why Businesses Choose Bennet AI
                  </motion.h2>
                  <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
                    {features.map((f,index)=> (
                      <motion.div
                      key={index}
                      initial= {{opacity: 0, y: 30}}
                      whileInView={{opacity: 1, y: 0}}
                      viewport={{once: false}}
                      transition={{duration: 0.5, delay: index * 0.2}}
                      className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-xl"
                      >
                        <h1 className="text-lg font-medium">{f.title}</h1>
                        <p className="mt-3 text-zinc-600 text-sm">{f.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
        </section>
        <footer className="text-center py-10 text-sm text-zinc-600">
          &copy; {new Date().getFullYear()} Bennet AI. All Rights Reserved 
        </footer>
      </div>
    </>
  );
};

export default HomeClient;
