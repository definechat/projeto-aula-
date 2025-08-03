
"use client";

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Slider } from './ui/slider';

interface AudioPlayerProps {
    src: string;
    duration?: number;
    autoplay?: boolean;
    id?: string;
    playbackDelay?: number;
}

export function AudioPlayer({ src, duration = 0, autoplay = false, id, playbackDelay = 0 }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [actualDuration, setActualDuration] = useState(duration);
    
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        
        const handleLoadedMetadata = () => {
             setActualDuration(duration > 0 ? duration : audio.duration);
        };

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handlePlaybackEnd = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            if(audio) audio.currentTime = 0;
        };
        
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handlePlaybackEnd);
        
        if (duration > 0) {
            setActualDuration(duration);
        } else if (audio.duration && isFinite(audio.duration)) {
            setActualDuration(audio.duration);
        }

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handlePlaybackEnd);
        };
    }, [src, duration]);

    useEffect(() => {
        const audio = audioRef.current;
        if (autoplay && audio) {
             const playWithDelay = () => {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        setIsPlaying(true);
                    }).catch(error => {
                        console.warn("Autoplay was prevented by the browser.", error);
                        setIsPlaying(false);
                    });
                }
             };

            if (playbackDelay > 0) {
                const timeoutId = setTimeout(playWithDelay, playbackDelay);
                return () => clearTimeout(timeoutId);
            } else {
                 playWithDelay();
            }
        }
    }, [autoplay, playbackDelay]);


    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
             const playPromise = audio.play();
             if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                }).catch(e => {
                    console.error("Error playing audio:", e)
                    setIsPlaying(false);
                });
            }
        }
    };

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds) || timeInSeconds < 0) return '0:00';
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeek = (value: number[]) => {
        const audio = audioRef.current;
        if (audio) {
            audio.currentTime = value[0];
            setCurrentTime(value[0]);
        }
    };

    const effectiveDuration = actualDuration > 0 && isFinite(actualDuration) ? actualDuration : 0;

    return (
        <div className="flex items-center gap-2 w-full">
            <audio ref={audioRef} src={src} preload="auto" id={id} playsInline />
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
