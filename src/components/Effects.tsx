"use client";

import { useState, useEffect, useRef, createContext, useContext, ReactNode } from "react";
import gsap from "gsap";

interface AudioPlayerContextType {
  currentTrack: { title: string; artist: string; duration: string } | null;
  isPlaying: boolean;
  play: () => void;
  pause: () => void;
  setTrack: (track: { title: string; artist: string; duration: string }) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<{ title: string; artist: string; duration: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <AudioPlayerContext.Provider value={{
      currentTrack,
      isPlaying,
      play: () => setIsPlaying(true),
      pause: () => setIsPlaying(false),
      setTrack: (track) => { setCurrentTrack(track); setIsPlaying(true); }
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
}

export function AnimatedText({ children, className = "", delay = 0 }: { children: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const words = ref.current.querySelectorAll(".word");
    gsap.fromTo(words,
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, delay, ease: "power3.out" }
    );
  }, [delay]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children.split(" ").map((word, i) => (
        <span key={i} className="word inline-block mr-2">{word}</span>
      ))}
    </span>
  );
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = async () => {
      const Lenis = (await import("lenis")).default;
      const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      const raf = (time: number) => { lenis.raf(time); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
      return lenis;
    };
    lenis();
  }, []);

  return <>{children}</>;
}

export function MagneticButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const btn = ref.current;

    const move = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: "power2.out" });
    };

    const leave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });

    btn.addEventListener("mousemove", move);
    btn.addEventListener("mouseleave", leave);

    return () => {
      btn.removeEventListener("mousemove", move);
      btn.removeEventListener("mouseleave", leave);
    };
  }, []);

  return <div ref={ref} className={`inline-block cursor-pointer ${className}`}>{children}</div>;
}

export function AudioVisualizer({ isPlaying, className = "" }: { isPlaying: boolean; className?: string }) {
  const [bars, setBars] = useState<number[]>(Array(32).fill(10));

  useEffect(() => {
    if (!isPlaying) { setBars(Array(32).fill(10)); return; }
    const interval = setInterval(() => {
      setBars(Array(32).fill(0).map(() => Math.random() * 50 + 10));
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className={`flex items-end gap-[2px] h-12 ${className}`}>
      {bars.map((height, i) => (
        <div key={i} className="w-[3px] bg-gradient-to-t from-amber-500 to-yellow-400 rounded-sm transition-all duration-75"
          style={{ height: `${height}px`, animationDelay: `${i * 0.02}s` }} />
      ))}
    </div>
  );
}

export function PageTransition({ children, isActive }: { children: ReactNode; isActive: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, { opacity: isActive ? 1 : 0, y: isActive ? 0 : 30, duration: 0.8, ease: "power3.out" });
  }, [isActive]);

  return <div ref={ref} className="absolute inset-0 opacity-0">{children}</div>;
}

export function ParallaxImage({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const handleMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;
      gsap.to(ref.current, { x, y, duration: 1, ease: "power2.out" });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover scale-110" />
    </div>
  );
}

export function GlowCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
      <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-2xl border border-amber-500/20 p-8">
        {children}
      </div>
    </div>
  );
}

export function FloatingParticle({ x, y, size }: { x: number; y: number; size: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: y - 100,
      x: x + 50,
      opacity: 0,
      duration: Math.random() * 3 + 2,
      ease: "power1.out",
      repeat: -1,
      yoyo: true,
      delay: Math.random() * 2
    });
  }, [x, y]);

  return <div ref={ref} className="absolute w-1 h-1 bg-amber-400/50 rounded-full" style={{ left: x, top: y, width: size, height: size }} />;
}