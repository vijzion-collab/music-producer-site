"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Lenis from "lenis";
import Scene3D from "@/components/Scene3D";

const tracks = [
  { id: "1", title: "150 Whipp (feat. Tiwsted x Mal x Shade)", artist: "AVIDAN", duration: "3:45", genre: "Epic", url: "/audio/sample1.mp3" },
  { id: "2", title: "100 Capers", artist: "AVIDAN", duration: "2:58", genre: "Atmospheric", url: "/audio/sample2.mp3" },
  { id: "3", title: "100 Nights Wit U", artist: "AVIDAN", duration: "4:12", genre: "Urban", url: "/audio/sample3.mp3" },
  { id: "4", title: "100 Way Kuntry", artist: "AVIDAN", duration: "3:22", genre: "Ambient", url: "/audio/sample4.mp3" },
];

export default function Home() {
  const [currentTrack, setCurrentTrack] = useState<typeof tracks[0] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    lenisRef.current = lenis;
    const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      sections.forEach((section, i) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          setActiveSection(i);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const playTrack = (track: typeof tracks[0]) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setShowPlayer(true);
  };

  const handleProgress = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    setProgress(((e.clientX - rect.left) / rect.width) * 100);
  };

  const NavItem = ({ label, index }: { label: string; index: number }) => (
    <button
      onClick={() => lenisRef.current?.scrollTo(`section:nth-child(${index + 1})`, { offset: 0, duration: 2 })}
      className={`text-xs uppercase tracking-[0.3em] transition-colors relative ${activeSection === index ? "text-amber-400" : "text-zinc-500 hover:text-zinc-300"}`}
    >
      {label}
      {activeSection === index && <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-px bg-amber-400" />}
    </button>
  );

  const WordReveal = ({ text, delay = 0 }: { text: string; delay?: number }) => (
    <span className="inline-block overflow-hidden">
      <motion.span
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay, ease: [0.4, 0, 0.2, 1] }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </span>
  );

  return (
    <div className="relative bg-zinc-950 text-white min-h-screen">
      <Scene3D />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-amber-500/10">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold tracking-widest gold-gradient"
          >
            AVIDAN
          </motion.div>
          <div className="hidden md:flex items-center gap-12">
            {["Home", "Music", "Licensing", "About", "Contact"].map((label, i) => (
              <NavItem key={label} label={label} index={i} />
            ))}
          </div>
          <button
            onClick={() => setShowPlayer(!showPlayer)}
            className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center hover:bg-amber-500/20 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Page Sections */}
      <main>
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-8 relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-center z-10"
          >
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-4">
              <span className="inline-block"><WordReveal text="SOUND" delay={0} /></span>
              <span className="inline-block ml-4 gold-gradient"><WordReveal text="DESIGN" delay={0.1} /></span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg md:text-2xl text-zinc-400 max-w-xl mx-auto tracking-wide"
            >
              Scoring for Film, TV & Commercials
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex gap-6 justify-center"
            >
              <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold rounded-full hover:scale-105 transition shadow-lg shadow-amber-500/30">
                Explore Work
              </button>
              <button className="px-8 py-4 border border-amber-500/30 rounded-full hover:bg-amber-500/10 transition">
                Get in Touch
              </button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <div className="w-6 h-10 border-2 border-amber-500/30 rounded-full flex justify-center pt-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1.5 h-3 bg-amber-400 rounded-full"
              />
            </div>
          </motion.div>
        </section>

        {/* Music Section */}
        <section className="min-h-screen py-32 px-8 relative">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-5xl md:text-7xl font-black mb-16 tracking-tight"
            >
              <span className="text-zinc-500">Selected</span> <span className="gold-gradient">Works</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              {tracks.map((track, i) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => playTrack(track)}
                  className="group glass rounded-2xl p-6 border border-amber-500/10 hover:border-amber-500/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-400/20 flex items-center justify-center group-hover:scale-105 transition">
                      {currentTrack?.id === track.id && isPlaying ? (
                        <div className="audio-wave">
                          {[...Array(5)].map((_, j) => (
                            <motion.span
                              key={j}
                              animate={{ height: [10, 40, 10] }}
                              transition={{ duration: 0.5, repeat: Infinity, delay: j * 0.1 }}
                              style={{ background: "linear-gradient(to top, #c9a227, #ffd700)" }}
                            />
                          ))}
                        </div>
                      ) : (
                        <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{track.title}</h3>
                      <p className="text-zinc-400 text-sm mb-2">{track.artist}</p>
                      <span className="text-xs text-amber-500/70 uppercase tracking-wider">{track.genre}</span>
                    </div>
                    <div className="text-zinc-500 text-sm">{track.duration}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="min-h-screen py-32 px-8 relative">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-5xl md:text-7xl font-black mb-8">
                <WordReveal text="CRAFTING" /><br />
                <span className="gold-gradient"><WordReveal text="ATMOSPHERES" /></span>
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                With over a decade of experience composing for visual media, I create soundscapes that elevate storytelling.
                From intimate documentaries to blockbuster trailers, every project receives meticulous attention to sonic detail.
              </p>
              <div className="grid grid-cols-3 gap-8">
                {[["150+", "Projects"], ["50+", "Awards"], ["10+", "Years"]].map(([num, label]) => (
                  <div key={label} className="text-center">
                    <div className="text-4xl font-black gold-gradient">{num}</div>
                    <div className="text-xs text-zinc-500 uppercase tracking-wider mt-2">{label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-amber-500/10 to-yellow-400/10 p-8 border border-amber-500/20">
                <div className="w-full h-full rounded-2xl bg-zinc-900/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-black gold-gradient mb-4">AVIDAN</div>
                    <div className="text-zinc-500 uppercase tracking-[0.3em]">Music Composer</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Clients Section */}
        <section className="min-h-screen py-32 px-8 relative">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black mb-16"
            >
              <span className="text-zinc-500">Trusted by</span> <span className="gold-gradient">Industry Leaders</span>
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {["Netflix", "HBO", "Apple TV+", "Disney", "Amazon", "Warner Bros", "Universal", "Sony"].map((brand, i) => (
                <motion.div
                  key={brand}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-xl p-8 border border-amber-500/10 hover:border-amber-500/30 transition"
                >
                  <div className="text-2xl font-bold text-zinc-300">{brand}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="min-h-screen py-32 px-8 relative flex items-center">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-8xl font-black mb-8"
            >
              <WordReveal text="LET'S" /><br />
              <span className="gold-gradient"><WordReveal text="COLLABORATE" /></span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto"
            >
              Ready to elevate your next project with a custom score? Let's discuss your vision.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-3xl p-12 border border-amber-500/20 max-w-xl mx-auto"
            >
              <form className="space-y-6">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full bg-zinc-900/50 border border-amber-500/20 rounded-xl px-6 py-4 text-white placeholder-zinc-500 focus:border-amber-500/50 outline-none transition"
                />
                <textarea
                  placeholder="Tell me about your project..."
                  rows={4}
                  className="w-full bg-zinc-900/50 border border-amber-500/20 rounded-xl px-6 py-4 text-white placeholder-zinc-500 focus:border-amber-500/50 outline-none transition resize-none"
                />
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold rounded-xl hover:scale-105 transition shadow-lg shadow-amber-500/30">
                  Send Message
                </button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-16 flex justify-center gap-8"
            >
              {[
                { label: "Email", value: "music@avidan.com" },
                { label: "Phone", value: "+1 (555) 123-4567" }
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{label}</div>
                  <div className="text-lg text-zinc-300">{value}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Payment Integration Section */}
        <section className="py-32 px-8 relative border-t border-amber-500/10">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-black mb-12 text-center"
            >
              <span className="text-zinc-500">Secure</span> <span className="gold-gradient">Payments</span>
            </motion.h2>

            <div className="glass rounded-3xl p-12 border border-amber-500/20">
              <div className="grid md:grid-cols-3 gap-8 text-center mb-12">
                {[
                  { icon: "💳", label: "Credit Card", desc: "Visa, Mastercard, Amex" },
                  { icon: "🅿️", label: "PayPal", desc: "Fast & secure checkout" },
                  { icon: "🏦", label: "Bank Transfer", desc: "Wire & ACH payments" }
                ].map(({ icon, label, desc }) => (
                  <div key={label} className="p-6 rounded-2xl bg-zinc-900/50">
                    <div className="text-4xl mb-4">{icon}</div>
                    <div className="font-bold mb-2">{label}</div>
                    <div className="text-sm text-zinc-500">{desc}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-3 px-6 py-3 glass rounded-xl border border-amber-500/20">
                  <svg className="h-8" viewBox="0 0 50 50"><path fill="#635BFF" d="M25 50C11.2 50 0 38.8 0 25S11.2 0 25 0s25 11.2 25 25-11.2 25-25 25zm0-44C15 6 7 14 7 25s8 19 18 19c2.2 0 4-.4 5.7-1.1V30h-4.5V25h7.5v13.9c-.8.4-1.8.6-2.7.6-5.5 0-10-4.5-10-10s4.5-10 10-10c2.4 0 4.6.9 6.3 2.4L34 17.6C31.5 15.5 28.4 14.4 25 14.4z"/></svg>
                  <span className="font-medium">Stripe</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 glass rounded-xl border border-amber-500/20">
                  <svg className="h-8" viewBox="0 0 50 50"><path fill="#003087" d="M25 0C11.2 0 0 11.2 0 25s11.2 25 25 25 25-11.2 25-25S38.8 0 25 0zm-5 37.5v-25h-7.5v25h-5v-25h-7.5v-5h7.5v-7.5h5v7.5h7.5v5z"/></svg>
                  <span className="font-medium">PayPal</span>
                </div>
                <div className="flex items-center gap-3 px-6 py-3 glass rounded-xl border border-amber-500/20">
                  <svg className="h-8" viewBox="0 0 50 50"><path fill="#009CDE" d="M25 0C11.2 0 0 11.2 0 25s11.2 25 25 25 25-11.2 25-25S38.8 0 25 0zm12.5 35h-5v-5h-5v-7.5h5v-7.5h-5V12.5h7.5c5 0 10 2.5 10 10s-2.5 10-10 10h-2.5v2.5z"/></svg>
                  <span className="font-medium">Bank</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-amber-500/10 py-8 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-zinc-500">© 2024 AVIDAN. All rights reserved.</div>
          <div className="flex gap-6">
            {["Instagram", "Twitter", "LinkedIn", "YouTube"].map((social) => (
              <a key={social} href="#" className="text-sm text-zinc-500 hover:text-amber-400 transition">{social}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* Audio Player */}
      <AnimatePresence>
        {showPlayer && currentTrack && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-amber-500/20"
          >
            <audio ref={(el) => { if (el) el.src = currentTrack.url; if (isPlaying) el?.play(); }} autoPlay={isPlaying} />
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
              <div className="flex items-center gap-4">
                <button className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center hover:bg-amber-500/20 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center hover:scale-105 transition shadow-lg shadow-amber-500/30"
                >
                  {isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                  ) : (
                    <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  )}
                </button>
                <button className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center hover:bg-amber-500/20 transition">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                </button>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium truncate">{currentTrack.title}</span>
                  <span className="text-xs text-zinc-500 ml-4">{currentTrack.duration}</span>
                </div>
                <div
                  ref={progressRef}
                  onClick={handleProgress}
                  className="h-1 bg-zinc-700 rounded-full cursor-pointer group"
                >
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full relative transition-all"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-3">
                <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{currentTrack.genre}</span>
                <div className="audio-wave">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ animationDelay: `${i * 0.1}s` }} className={isPlaying ? "animate-wave" : ""} />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
        .animate-wave {
          animation: wave 0.8s ease-in-out infinite;
        }
        .audio-wave span {
          display: block;
          width: 3px;
          border-radius: 2px;
          background: linear-gradient(to top, #c9a227, #ffd700);
        }
      `}</style>
    </div>
  );
}