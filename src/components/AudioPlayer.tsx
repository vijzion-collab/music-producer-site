"use client";

import { createContext, useContext, useState, ReactNode, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  genre: string;
  cover: string;
  url: string;
}

interface AudioPlayerContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  queue: Track[];
  play: (track?: Track) => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  setProgress: (p: number) => void;
  setVolume: (v: number) => void;
  addToQueue: (track: Track) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export function AudioPlayerProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [queue, setQueue] = useState<Track[]>([]);

  const play = (track?: Track) => {
    if (track) setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pause = () => setIsPlaying(false);
  const next = () => {
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    const nextTrack = queue[idx + 1] || queue[0];
    setCurrentTrack(nextTrack);
  };
  const prev = () => {
    if (!currentTrack || queue.length === 0) return;
    const idx = queue.findIndex(t => t.id === currentTrack.id);
    const prevTrack = queue[idx - 1] || queue[queue.length - 1];
    setCurrentTrack(prevTrack);
  };

  const addToQueue = (track: Track) => setQueue(q => [...q, track]);

  return (
    <AudioPlayerContext.Provider value={{
      currentTrack, isPlaying, progress, volume, queue,
      play, pause, next, prev, setProgress, setVolume, addToQueue
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

export function GlobalAudioPlayer() {
  const { currentTrack, isPlaying, progress, volume, setProgress, pause, next, prev } = useAudioPlayer();
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!currentTrack) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = currentTrack.url;
    if (isPlaying) audio.play().catch(() => {});
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.play().catch(() => {});
    else audioRef.current.pause();
  }, [isPlaying]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const p = (e.clientX - rect.left) / rect.width;
    if (audioRef.current.duration) {
      audioRef.current.currentTime = p * audioRef.current.duration;
      setProgress(p * 100);
    }
  };

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-amber-500/20">
      <audio ref={audioRef} onTimeUpdate={() => setProgress((audioRef.current?.currentTime || 0) / (audioRef.current?.duration || 1) * 100)} />
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
        <div className="flex items-center gap-4">
          <button onClick={prev} className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center hover:bg-amber-500/20 transition">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
          </button>
          <button onClick={() => isPlaying ? pause() : audioRef.current?.play()} className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center hover:scale-105 transition shadow-lg shadow-amber-500/30">
            {isPlaying ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
          <button onClick={next} className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center hover:bg-amber-500/20 transition">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium truncate">{currentTrack.title}</span>
            <span className="text-xs text-zinc-500 ml-4">{currentTrack.duration}</span>
          </div>
          <div ref={progressRef} onClick={handleProgressClick} className="h-1 bg-zinc-700 rounded-full cursor-pointer group">
            <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full relative" style={{ width: `${progress}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition" />
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs text-zinc-500 uppercase tracking-wider font-medium">{currentTrack.genre}</span>
          <div className="audio-wave">
            {[...Array(5)].map((_, i) => <span key={i} className={isPlaying ? "animate-wave" : ""} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AudioPlayerMini({ track, isActive }: { track: { title: string; artist: string; duration: string }; isActive: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0.5 }}
      animate={{ scale: isActive ? 1 : 0.95, opacity: isActive ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-xl p-4 border border-amber-500/20"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/30 to-yellow-400/30 flex items-center justify-center">
          <div className="audio-visualizer">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="audio-visualizer-bar" style={{ height: isActive ? `${Math.random() * 40 + 20}px` : '4px' }} />
            ))}
          </div>
        </div>
        <div>
          <p className="font-semibold text-sm">{track.title}</p>
          <p className="text-xs text-zinc-400">{track.artist}</p>
        </div>
        <div className="ml-auto text-xs text-zinc-500">{track.duration}</div>
      </div>
    </motion.div>
  );
}