
"use client";

import Image from "next/image";
import { Check, CheckCheck, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/types';
import { Button } from "./ui/button";
import { TypingIndicator } from './typing-indicator';
import { AudioPlayer } from "@/components/audio-player";

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
  const { sender, type, content, timestamp, imageSrc, audioSrc, audioDuration, status, options } = message;
  const isUser = sender === 'user';

  const messageContainerClasses = cn(
    'flex w-full',
    isUser ? 'justify-end' : 'justify-start'
  );

  const messageBubbleClasses = cn(
    'relative w-fit max-w-[85%] sm:max-w-[75%] rounded-xl px-3 py-1.5 shadow-sm flex flex-col',
    isUser ? 'bg-teal-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none',
    { 'p-1 bg-transparent dark:bg-transparent shadow-none': (type === 'image' || type === 'video') && imageSrc },
    { 'p-2 bg-gray-200 dark:bg-gray-700': type === 'loading' },
    { 'bg-transparent dark:bg-transparent shadow-none w-full max-w-[85%] sm:max-w-[75%]': type === 'audio' }
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
      
      case 'image':
      case 'video':
        return (
          <div className="relative">
            {imageSrc ? (
              <Image src={imageSrc} alt={content || 'Chat image'} width={400} height={400} className="rounded-lg object-cover" data-ai-hint="happy woman" />
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
        return (
          <div className={cn('w-full flex items-center gap-2 text-sm p-2 rounded-lg', isUser ? 'bg-teal-500 text-white' : 'bg-gray-200 dark:bg-gray-700')}>
            {!isUser && <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>}
            <div className="flex-grow">
              <AudioPlayer src={audioSrc} duration={audioDuration} />
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
                <p className="text-sm whitespace-pre-wrap mr-4">{content}</p>
                <TimeStamp />
            </div>
        );
    }
  };
  
  if (type === 'quick-reply' || type === 'cta') {
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
