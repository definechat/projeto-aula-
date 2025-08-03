
"use client";

import { useState, useRef, type MouseEvent, type TouchEvent } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BeforeAfterImageProps {
  before: string;
  after: string;
  title?: string;
}

export function BeforeAfterImage({ before, after, title }: BeforeAfterImageProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return; // Only move when mouse is clicked
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    handleMove(e.touches[0].clientX);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
        {title && (
            <p 
                className="text-center text-sm p-3 bg-gray-200 dark:bg-gray-700 rounded-t-lg w-full text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ __html: title.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') }}
            />
        )}
        <div
            ref={containerRef}
            className={cn("relative w-full aspect-square overflow-hidden select-none cursor-ew-resize", title ? "rounded-b-lg" : "rounded-lg")}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            <Image
                src={before}
                alt="Before"
                width={400}
                height={400}
                className="absolute inset-0 w-full h-full object-cover"
                data-ai-hint="overweight woman"
            />
            <div
                className="absolute inset-0 w-full h-full object-cover"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                 <Image
                    src={after}
                    alt="After"
                    width={400}
                    height={400}
                    className="absolute inset-0 w-full h-full object-cover"
                    data-ai-hint="fit woman"
                />
            </div>
            <div
                className="absolute inset-y-0 bg-white/50 w-1 cursor-ew-resize"
                style={{ left: `calc(${sliderPosition}% - 2px)` }}
            >
                <div className="bg-white h-full w-0.5"></div>
            </div>
            <div
                className="absolute inset-y-0 -translate-x-1/2"
                style={{ left: `${sliderPosition}%` }}
            >
                <div className="relative h-full w-1">
                    <div className="absolute top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center">
                        <ChevronLeft className="h-4 w-4 text-gray-700" />
                        <ChevronRight className="h-4 w-4 text-gray-700" />
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
