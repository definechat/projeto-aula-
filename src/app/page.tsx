
"use client";

import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Phone, Video as VideoIcon, MoreVertical, Send, Smile, Paperclip } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatFlow } from '@/lib/chat-flow';
import type { Message } from '@/lib/types';
import { generateChatImages } from './actions';
import { ChatMessage } from '@/components/chat-message';
import { useToast } from '@/hooks/use-toast';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [awaitingUserResponse, setAwaitingUserResponse] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ image1DataUri: string, image2DataUri: string } | null>(null);
  const [headerStatus, setHeaderStatus] = useState('online');

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const audioSentRef = useRef<HTMLAudioElement>(null);
  const audioReceivedRef = useRef<HTMLAudioElement>(null);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp' | 'status'>) => {
    if (message.sender === 'user') {
        audioSentRef.current?.play().catch(console.error);
    } else {
        audioReceivedRef.current?.play().catch(console.error);
    }

    setMessages(prev => [...prev, {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    }]);
  };

  const handleNextStep = (stepIncrement = 1) => {
    setCurrentStep(prev => prev + stepIncrement);
  };
  
  const handleQuickReply = (option: { text: string; value: any }) => {
    if (isProcessing) return;
    addMessage({ sender: 'user', type: 'text', content: option.text });
    setAwaitingUserResponse(false);
    handleNextStep();
  };
  
  useEffect(() => {
    const step = currentStep < chatFlow.length ? chatFlow[currentStep] : null;

    if (!step) {
      setIsProcessing(false);
      setHeaderStatus('online');
      return;
    }

    if (isProcessing && !awaitingUserResponse) {
        const currentFlowStep = chatFlow[currentStep];
        if (currentFlowStep.type === 'audio') {
            setHeaderStatus('gravando áudio...');
        } else if (currentFlowStep.type === 'image-generating') {
             setHeaderStatus('digitando...');
        } else if (currentFlowStep.type !== 'quick-reply' && currentFlowStep.type !== 'cta') {
            setHeaderStatus('digitando...');
        }
    } else {
        setHeaderStatus('online');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProcessing, currentStep, awaitingUserResponse]);


  useEffect(() => {
    if (currentStep >= chatFlow.length || awaitingUserResponse) {
      if (currentStep >= chatFlow.length) setIsProcessing(false);
      return;
    }

    const step = chatFlow[currentStep];

    const runStep = async () => {
      setIsProcessing(true);
      
      if (step.delay) {
        await new Promise(resolve => setTimeout(resolve, step.delay));
      }

      // Handle audio with recording simulation
      if (step.type === 'audio') {
        // Show "gravando..." for 7 seconds, then send message
        await new Promise(resolve => setTimeout(resolve, 7000));
      }

      if (step.type === 'image-generating') {
        addMessage({ sender: 'bot', type: 'image-generating', content: step.content });
        try {
          const images = await generateChatImages();
          setGeneratedImages(images);
        } catch (error) {
          console.error(error);
          toast({
            title: "Erro na Geração de Imagem",
            description: "Não foi possível gerar as imagens. O fluxo continuará.",
            variant: "destructive"
          });
        }
        setIsProcessing(false);
        handleNextStep();
        return;
      }
      
      const messageToAdd: Omit<Message, 'id' | 'timestamp' | 'status'> = {
        sender: 'bot',
        type: step.type,
        content: step.content,
      };

      if (step.audioDuration) messageToAdd.audioDuration = step.audioDuration;
      if (step.type === 'image' && generatedImages) messageToAdd.imageSrc = generatedImages.image1DataUri;
      if (step.type === 'video' && generatedImages) messageToAdd.imageSrc = generatedImages.image2DataUri;
      if (step.type === 'quick-reply') messageToAdd.options = step.options;
      
      addMessage(messageToAdd);
      
      if (step.waitForUser) {
        setAwaitingUserResponse(true);
        setIsProcessing(false);
      } else {
         // for audio, we set isProcessing to false inside onAudioEnd
        if (step.type !== 'audio') {
            setIsProcessing(false);
            handleNextStep();
        }
      }
    };

    runStep();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, awaitingUserResponse, generatedImages]);

  const onAudioEnd = () => {
    setIsProcessing(false);
    handleNextStep();
  };

  return (
    <div className="bg-background flex justify-center items-center min-h-screen p-0 sm:p-4">
        <div className="w-full h-full sm:max-w-md sm:h-[90vh] sm:max-h-[850px] flex flex-col bg-white dark:bg-black sm:rounded-2xl shadow-2xl overflow-hidden">
            <header className="flex items-center p-3 bg-accent text-accent-foreground shadow-md z-10 flex-shrink-0">
                <Button variant="ghost" size="icon" className="text-accent-foreground hover:bg-white/10 rounded-full h-9 w-9">
                  <ArrowLeft />
                </Button>
                <Avatar className="h-10 w-10 ml-2">
                    <AvatarImage src="https://placehold.co/100x100/25D366/FFFFFF.png?text=GK" data-ai-hint="logo grain" alt="GrãoKiseca" />
                    <AvatarFallback>GK</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-grow">
                    <h1 className="font-bold text-lg font-headline">Ana - GrãoKiseca</h1>
                    <p className="text-sm opacity-80">{headerStatus}</p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                    <Button variant="ghost" size="icon" className="text-accent-foreground hover:bg-white/10 rounded-full h-9 w-9"><VideoIcon /></Button>
                    <Button variant="ghost" size="icon" className="text-accent-foreground hover:bg-white/10 rounded-full h-9 w-9"><Phone /></Button>
                    <Button variant="ghost" size="icon" className="text-accent-foreground hover:bg-white/10 rounded-full h-9 w-9"><MoreVertical /></Button>
                </div>
            </header>

            <main ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto chat-bg">
                <div className="flex flex-col gap-4">
                    {messages.map((msg) => (
                      <ChatMessage key={msg.id} message={msg} onAudioEnd={onAudioEnd} onQuickReply={handleQuickReply} />
                    ))}
                    {isProcessing && !awaitingUserResponse && currentStep < chatFlow.length && chatFlow[currentStep]?.type !== 'audio' && chatFlow[currentStep]?.type !== 'image-generating' && (
                      <ChatMessage message={{ id: 'typing', sender: 'bot', type: 'loading', timestamp: '' }} onAudioEnd={()=>{}} onQuickReply={()=>{}}/>
                    )}
                </div>
            </main>

            <footer className="p-2 sm:p-3 bg-background border-t flex-shrink-0">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full h-10 w-10"><Smile /></Button>
                    <Input 
                        type="text" 
                        placeholder="Mensagem"
                        className="flex-grow rounded-full px-4 bg-white dark:bg-gray-800"
                        disabled={true}
                    />
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full h-10 w-10"><Paperclip /></Button>
                    <Button size="icon" className="bg-accent hover:bg-accent/90 rounded-full h-10 w-10">
                        <Send />
                    </Button>
                </div>
            </footer>
        </div>
        <audio ref={audioSentRef} src="/audio/sent.mp3" preload="auto"></audio>
        <audio ref={audioReceivedRef} src="/audio/received.mp3" preload="auto"></audio>
    </div>
  );
}
