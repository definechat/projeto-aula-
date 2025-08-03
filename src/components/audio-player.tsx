
"use client";

import { useState, useRef, useEffect, type RefObject } from 'react';
import { Play, Pause } from 'lucide-react';
import { Slider } from './ui/slider';

interface AudioPlayerProps {
    src: string;
    duration?: number;
    audioRef: RefObject<HTMLAudioElement | null>;
}

export function AudioPlayer({ src, duration = 0, audioRef }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // Ensure src is set before playing
            if(audioRef.current.src !== src) {
                audioRef.current.src = src;
            }
            audioRef.current.play().catch(console.error);
        }
    };
    
    useEffect(() => {
        const audio = audioRef.current;

        const handlePlaying = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleTimeUpdate = () => setCurrentTime(audio?.currentTime || 0);
        const handlePlaybackEnd = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            if(audio) audio.currentTime = 0;
        };
        
        if (audio) {
            audio.addEventListener('play', handlePlaying);
            audio.addEventListener('playing', handlePlaying);
            audio.addEventListener('pause', handlePause);
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('ended', handlePlaybackEnd);

            // Set initial state
            setIsPlaying(!audio.paused);
            setCurrentTime(audio.currentTime);

            // Clean up listeners
            return () => {
                audio.removeEventListener('play', handlePlaying);
                audio.removeEventListener('playing', handlePlaying);
                audio.removeEventListener('pause', handlePause);
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('ended', handlePlaybackEnd);
            };
        }
    }, [audioRef, src]);


    const formatTime = (timeInSeconds: number) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeek = (value: number[]) => {
        if (audioRef.current) {
            audioRef.current.currentTime = value[0];
            setCurrentTime(value[0]);
        }
    };

    const effectiveDuration = duration > 0 ? duration : (audioRef.current?.duration || 0);

    return (
        <div className="flex items-center gap-2 w-full">
            <button onClick={togglePlay} className="flex-shrink-0">
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            <div className="flex-grow flex items-center gap-2">
                <Slider
                    value={[currentTime]}
                    max={effectiveDuration}
                    step={1}
                    onValueChange={handleSeek}
                    className="w-full"
                />
                <span className="text-xs w-12 text-right">{formatTime(effectiveDuration - currentTime)}</span>
            </div>
            {/* Audio element is now managed by the parent component via audioRef */}
        </div>
    );
}
