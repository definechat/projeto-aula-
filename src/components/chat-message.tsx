
"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, CheckCheck, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Button } from "./ui/button";
import { TypingIndicator } from './typing-indicator';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { BeforeAfterImage } from './before-after-image';
import dynamic from "next/dynamic";

const AudioPlayer = dynamic(() => import('@/components/audio-player').then(mod => mod.AudioPlayer), {
  ssr: false,
  loading: () => <div className="h-10 w-full animate-pulse rounded-lg bg-gray-300 dark:bg-gray-600" />,
});


const MessageStatus = ({ status }: { status: Message['status'] }) => {
  if (status === 'read') return <CheckCheck className="h-4 w-4 text-blue-500" />;
  if (status === 'delivered') return <CheckCheck className="h-4 w-4 text-muted-foreground" />;
  if (status === 'sent') return <Check className="h-4 w-4 text-muted-foreground" />;
  return <Clock className="h-4 w-4 text-muted-foreground" />;
};

interface ChatMessageProps {
    message: Message;
    onQuickReply: (option: { text: string; value: any }) => void;
}

export const ChatMessage = ({ message, onQuickReply }: ChatMessageProps) => {
  const { id, sender, type, content, timestamp, imageSrc: initialImageSrc, audioSrc, audioDuration, status, options, beforeImageSrc, afterImageSrc, autoplay } = message;
  const isUser = sender === 'user';
  
  const messageContainerClasses = cn(
    'flex w-full',
    isUser ? 'justify-end' : 'justify-start'
  );

  const messageBubbleClasses = cn(
    'relative w-fit max-w-[85%] sm:max-w-[75%] rounded-xl px-3 py-1.5 shadow-sm flex flex-col',
    isUser ? 'bg-teal-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none',
    { 'p-1 bg-transparent dark:bg-transparent shadow-none': (type === 'image' || type === 'video') && initialImageSrc },
    { 'p-2 bg-gray-200 dark:bg-gray-700': type === 'loading' },
    { 'bg-transparent dark:bg-transparent shadow-none w-full max-w-[85%] sm:max-w-[75%]': type === 'audio' || type === 'before-after' }
  );
  
  const TimeStamp = ({isMedia, isAudio}: {isMedia?: boolean, isAudio?: boolean}) => (
    <div className={cn("flex justify-end items-center gap-1 self-end text-xs", 
        isUser ? "text-white/80" : "text-gray-500", 
        isMedia ? "absolute bottom-1.5 right-1.5 text-white/80" : "",
        isAudio ? "mt-1" : ""
    )}>
      <span>{timestamp}</span>
      {isUser && status && <MessageStatus status={status} />}
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'loading':
        return <TypingIndicator />;
      
      case 'before-after':
        if (!beforeImageSrc || !afterImageSrc) return null;
        return (
          <BeforeAfterImage 
            before={beforeImageSrc} 
            after={afterImageSrc} 
            title={content}
          />
        );

      case 'image':
      case 'video':
        return (
          <div className="relative">
            {initialImageSrc ? (
                <img 
                    src={initialImageSrc} 
                    alt={content || 'Chat image'} 
                    className="rounded-lg object-cover w-full h-auto"
                    style={{ maxWidth: '400px', display: 'block' }}
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src='https://placehold.co/400x400.png';
                    }}
                />
            ) : (
              <div className="w-[300px] h-[300px] bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-2 pt-6 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg">
                {content && <p className="text-sm my-1 text-white">{content}</p>}
                <TimeStamp isMedia />
            </div>
          </div>
        );
      
      case 'audio':
        if (!audioSrc) return null;
        return (
          <div className={cn('w-full flex items-center gap-2 text-sm p-2 rounded-lg', isUser ? 'bg-teal-500 text-white' : 'bg-gray-200 dark:bg-gray-700')}>
            {!isUser && (
                 <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src="https://i.imgur.com/zPbvfTZ.jpeg" alt="MiKE Avatar" />
                    <AvatarFallback>M</AvatarFallback>
                </Avatar>
            )}
            <div className="flex-grow">
              <AudioPlayer src={audioSrc} duration={audioDuration} autoplay={autoplay} id={`audio-${id}`} />
              <TimeStamp isAudio={true} />
            </div>
          </div>
        );

      case 'quick-reply':
          return (
            <div className="flex flex-col items-center gap-2 my-2 w-full">
              <p className="text-center text-gray-600 dark:text-gray-300">{content}</p>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2">
                {options?.map(opt => (
                  <Button key={opt.value} variant="outline" className="bg-white dark:bg-gray-800 dark:hover:bg-gray-700 shadow-sm w-full" onClick={() => onQuickReply(opt)}>{opt.text}</Button>
                ))}
              </div>
            </div>
          );

      case 'cta':
          return (
            <div className="flex justify-center my-2">
                <Button asChild size="lg" className="bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg h-auto py-3 px-6 whitespace-normal text-center">
                    <a href="https://graokiseca.netlify.app/" target="_blank" rel="noopener noreferrer">{content}</a>
                </Button>
            </div>
          );

      default:
        return (
            <div className="flex items-end gap-2">
                <p 
                    className="text-sm md:text-base whitespace-pre-wrap mr-4"
                    dangerouslySetInnerHTML={{ __html: content?.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') || '' }}
                />
                <TimeStamp />
            </div>
        );
    }
  };
  
  if (type === 'quick-reply' || type === 'cta' || type === 'before-after') {
    return renderContent();
  }

  return (
    <div className={messageContainerClasses}>
      <div className={messageBubbleClasses}>
        {renderContent()}
      </div>
    </div>
  );
};
