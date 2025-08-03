
"use client";

import { useState, useRef, useEffect, type RefObject } from 'react';
import { Play, Pause } from 'lucide-react';
import { Slider } from './ui/slider';

interface AudioPlayerProps {
    src: string;
    duration?: number;
}

export function AudioPlayer({ src, duration = 0 }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [actualDuration, setActualDuration] = useState(duration);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Create audio element only on client-side
        audioRef.current = new Audio(src);
        audioRef.current.preload = 'metadata';

        const audio = audioRef.current;

        const handleLoadedMetadata = () => {
            if (audio) {
                // Use provided duration if it's > 0, otherwise use the audio's actual duration
                setActualDuration(duration > 0 ? duration : audio.duration);
            }
        };

        const handleTimeUpdate = () => setCurrentTime(audio?.currentTime || 0);
        const handlePlaybackEnd = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            if(audio) audio.currentTime = 0;
        };
        
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handlePlaybackEnd);
        
        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handlePlaybackEnd);
            audio.pause();
            audioRef.current = null;
        };
    }, [src, duration]);


    const togglePlay = () => {
        if (!audioRef.current) return;
        const audio = audioRef.current;

        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(e => console.error("Error playing audio:", e));
        }
        setIsPlaying(!isPlaying);
    };

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';
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

    const effectiveDuration = actualDuration || 0;

    return (
        <div className="flex items-center gap-2 w-full">
            <button onClick={togglePlay} className="flex-shrink-0">
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </button>
            <div className="flex-grow flex items-center gap-2">
                <Slider
                    value={[currentTime]}
                    max={effectiveDuration}
                    step={0.1}
                    onValueChange={handleSeek}
                    className="w-full"
                />
                <span className="text-xs w-12 text-right">{formatTime(effectiveDuration > currentTime ? effectiveDuration - currentTime : 0)}</span>
            </div>
        </div>
    );
}
