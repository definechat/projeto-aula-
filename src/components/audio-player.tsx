"use client";

import { Play, Pause } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AudioPlayerProps {
  duration: number;
  onPlaybackEnd: () => void;
  sender: 'bot' | 'user';
  autoPlay?: boolean;
}

export function AudioPlayer({ duration, onPlaybackEnd, sender, autoPlay = true }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startPlayback = () => {
    setIsPlaying(true);
    
    intervalRef.current = setInterval(() => {
      setProgress(prev => Math.min(prev + 100 / (duration * 10), 100));
    }, 100);

    timeoutRef.current = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsPlaying(false);
      setProgress(100);
      onPlaybackEnd();
    }, duration * 1000);
  };
  
  const pausePlayback = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    let startTimeout: NodeJS.Timeout;
    if (autoPlay) {
      // Small delay before autoplaying
      startTimeout = setTimeout(startPlayback, 300);
    }
    return () => {
      clearTimeout(startTimeout);
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      pausePlayback();
    } else {
      setProgress(0);
      startPlayback();
    }
  };

  const formatTime = (seconds: number) => {
    const floorSeconds = Math.floor(seconds);
    const min = Math.floor(floorSeconds / 60);
    const sec = floorSeconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const isBot = sender === 'bot';
  const colors = isBot ? "text-muted-foreground" : "text-primary-foreground/80";
  const progressBg = isBot ? "bg-gray-300 dark:bg-gray-600" : "bg-white/40";
  const progressFg = isBot ? "bg-primary" : "bg-white";
  const buttonHover = isBot ? "hover:text-gray-900 dark:hover:text-gray-200" : "hover:text-white";

  return (
    <div className={cn("flex items-center gap-2 w-full max-w-[220px]", colors)}>
      <button onClick={togglePlay} className={cn("flex-shrink-0", buttonHover, {"text-primary": isBot})}>
        {isPlaying ? <Pause className="h-6 w-6 fill-current" /> : <Play className="h-6 w-6 fill-current" />}
      </button>
      <div className="flex-grow flex items-center gap-2">
        <div className={cn("w-full h-1 rounded-full relative", progressBg)}>
          <div className={cn("h-full rounded-full absolute", progressFg)} style={{ width: `${progress}%` }}>
             <div className={cn("absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full", progressFg)} />
          </div>
        </div>
      </div>
      <span className="text-xs w-10 tabular-nums">{formatTime(duration)}</span>
    </div>
  );
}
