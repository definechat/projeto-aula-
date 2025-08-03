
"use client";

import { useState, useEffect, useRef, type FormEvent } from 'react';
import { ArrowLeft, Phone, Video as VideoIcon, MoreVertical, Send, Smile, Paperclip } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatFlow } from '@/lib/chat-flow';
import type { Message, UserInfo } from '@/lib/types';
import { ChatMessage } from '@/components/chat-message';
import { IMCForm } from '@/components/imc-form';
import { ReportCard } from '@/components/report-card';
import { useAnalytics } from '@/lib/analytics';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [awaitingUserResponse, setAwaitingUserResponse] = useState(false);
  const [headerStatus, setHeaderStatus] = useState('online');
  const [showIMCForm, setShowIMCForm] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [leadInfo, setLeadInfo] = useState({ name: '', whatsapp: '' });
  const [inputValue, setInputValue] = useState('');
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showImage1, setShowImage1] = useState(false);
  const [showImage2, setShowImage2] = useState(false);
  const [showImage3, setShowImage3] = useState(false);
  const [showFinalAudio, setShowFinalAudio] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const { trackEvent } = useAnalytics();

  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const audioSentRef = useRef<HTMLAudioElement | null>(null);
  const audioReceivedRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
        audioSentRef.current = new Audio('/audio/sent.mp3');
        audioReceivedRef.current = new Audio('/audio/received.mp3');
    }
  }, []);

  useEffect(() => {
    if (showReport) {
      const timer = setTimeout(() => {
        setShowAudioPlayer(true);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showReport]);

  useEffect(() => {
    if (showAudioPlayer) {
      const timer = setTimeout(() => {
        setShowImage1(true);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showAudioPlayer]);

  useEffect(() => {
    if (showImage1) {
      const timer = setTimeout(() => {
        setShowImage2(true);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showImage1]);

  useEffect(() => {
    if (showImage2) {
      const timer = setTimeout(() => {
        setShowImage3(true);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showImage2]);

  useEffect(() => {
    if (showImage3) {
      const timer = setTimeout(() => {
        setShowFinalAudio(true);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showImage3]);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing, showIMCForm, showReport, showAudioPlayer, showImage1, showImage2, showImage3, showFinalAudio]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp' | 'status'>, stepId?: string) => {
    if (message.sender === 'user' && audioSentRef.current) {
      audioSentRef.current.play().catch(console.error);
    } else if (message.sender === 'bot' && audioReceivedRef.current && message.type !== 'audio') {
      audioReceivedRef.current.play().catch(console.error);
    }

    if (stepId) {
      trackEvent(stepId);
    }
    
    let finalContent = message.content;
    if (message.sender === 'bot' && message.content?.includes('{name}')) {
        finalContent = message.content.replace('{name}', leadInfo.name.split(' ')[0] || '');
    }

    const newMessage: Message = {
      ...message,
      content: finalContent,
      id: isClient ? crypto.randomUUID() : String(Math.random()),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    };

    setMessages(prev => [...prev, newMessage]);

    if(newMessage.type === 'audio' && newMessage.autoplay) {
        setTimeout(() => {
            const audioEl = document.getElementById(`audio-${newMessage.id}`) as HTMLAudioElement;
            if (audioEl) {
                audioEl.play().catch(e => console.warn("Autoplay was prevented. Waiting for user interaction.", e));
            }
        }, 100);
    }
  };

  const handleNextStep = (stepIncrement = 1) => {
    setCurrentStep(prev => prev + stepIncrement);
  };

  const handleQuickReply = (option: { text: string; value: any }, stepId?: string) => {
    if (isProcessing) return;
    addMessage({ sender: 'user', type: 'text', content: option.text }, stepId);
    setAwaitingUserResponse(false);
    handleNextStep();
  };

  const handleTextMessageSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !awaitingUserResponse) return;

    const step = chatFlow[currentStep];
    addMessage({ sender: 'user', type: 'text', content: inputValue.trim() }, `step_${step.id}`);
    
    if (step.id === 0.4) {
        setLeadInfo(prev => ({ ...prev, name: inputValue.trim() }));
        setAwaitingUserResponse(false);
        handleNextStep();
    } else if (step.id === 0.5) {
        setLeadInfo(prev => ({ ...prev, whatsapp: inputValue.trim() }));
        setAwaitingUserResponse(false);
        handleNextStep();
    }

    setInputValue('');
  };

  const handleIMCSubmit = (data: UserInfo) => {
    const step = chatFlow[currentStep];
    setUserInfo(data);
    setShowIMCForm(false);
    setAwaitingUserResponse(false); 
    addMessage({ sender: 'user', type: 'text', content: `Pronto! Meus dados: ${data.weight}kg e ${data.height}cm.` }, step.id ? `step_${step.id}` : undefined);
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
        if (step.type === 'audio') {
            setHeaderStatus('gravando áudio...');
        } else if (step.type !== 'quick-reply' && step.type !== 'cta' && step.type !== 'calculator' && step.type !== 'report') {
            setHeaderStatus('digitando...');
        }
    } else {
      setHeaderStatus('online');
    }
  }, [isProcessing, currentStep, awaitingUserResponse]);

  useEffect(() => {
    if (currentStep >= chatFlow.length || awaitingUserResponse) {
      if (currentStep >= chatFlow.length) setIsProcessing(false);
      return;
    }

    const step = chatFlow[currentStep];
    const stepId = `step_${step.id}`;

    const runStep = async () => {
      setIsProcessing(true);
      
      const delay = step.type === 'audio' ? 2000 : (step.delay || 0);
      
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      setIsProcessing(false);

      if (step.type === 'calculator') {
        trackEvent(stepId);
        setShowIMCForm(true);
        setAwaitingUserResponse(true);
        return;
      }

      if (step.type === 'report') {
        if (userInfo) {
          trackEvent(stepId);
          setShowReport(true);
          setAwaitingUserResponse(false);
          handleNextStep();
        } else {
          addMessage({ sender: 'bot', type: 'text', content: "Parece que não tenho suas informações. Vamos pular esta etapa." });
          handleNextStep();
        }
        return;
      }
      
      const messageToAdd: Omit<Message, 'id' | 'timestamp' | 'status'> = {
        sender: 'bot',
        type: step.type,
        content: step.content,
      };

      if (step.audioDuration) messageToAdd.audioDuration = step.audioDuration;
      if (step.type === 'image' && step.imageSrc) messageToAdd.imageSrc = step.imageSrc;
      if (step.type === 'before-after') {
          messageToAdd.beforeImageSrc = step.beforeImageSrc;
          messageToAdd.afterImageSrc = step.afterImageSrc;
      }
      if (step.type === 'quick-reply' && step.options) messageToAdd.options = step.options;
      if (step.audioSrc) {
        messageToAdd.audioSrc = step.audioSrc;
        const audio = new Audio(step.audioSrc);
        audioRefs.current[step.id] = audio;
      }
      if (step.autoplay) {
        messageToAdd.autoplay = step.autoplay;
      }
      
      addMessage(messageToAdd, stepId);
      
      if (step.waitForUser) {
        setAwaitingUserResponse(true);
      } else {
        handleNextStep();
      }
    };

    runStep();
  }, [currentStep, awaitingUserResponse, userInfo, leadInfo.name]);
  
  if (!isClient) {
    return null; // Or a loading spinner
  }

  return (
    <div className="bg-background flex justify-center items-center min-h-screen p-0 md:p-4">
      <div className="w-full h-screen md:h-[90vh] md:max-w-md md:max-h-[850px] flex flex-col bg-white dark:bg-black md:rounded-2xl shadow-2xl overflow-hidden">
        <header className="flex-shrink-0 flex items-center p-2 md:p-3 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-md z-10">
          <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full h-9 w-9">
            <ArrowLeft />
          </Button>
          <Avatar className="h-10 w-10 ml-2">
            <AvatarImage src="https://i.imgur.com/zPbvfTZ.jpeg" data-ai-hint="logo M" alt="MiKE" />
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
          <div className="ml-3 flex-grow">
            <h1 className="font-bold text-base md:text-lg">MiKE - Terapeuta de Emagrecimento</h1>
            <p className="text-sm opacity-80 text-teal-600 dark:text-teal-400">{headerStatus}</p>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full h-9 w-9"><VideoIcon /></Button>
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full h-9 w-9"><Phone /></Button>
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full h-9 w-9"><MoreVertical /></Button>
          </div>
        </header>

        <main ref={chatContainerRef} className="flex-grow p-4 overflow-y-auto chat-bg">
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <ChatMessage 
                key={msg.id} 
                message={msg} 
                onQuickReply={(option) => handleQuickReply(option, `step_${chatFlow[currentStep].id}`)}
              />
            ))}
            {isProcessing && !awaitingUserResponse && (
              <ChatMessage message={{ id: 'typing', sender: 'bot', type: 'loading', timestamp: '' }} onQuickReply={() => { }} />
            )}
            {showIMCForm && <IMCForm onSubmit={handleIMCSubmit} />}
            {showReport && userInfo && (
              <ReportCard userInfo={userInfo} />
            )}
            {showAudioPlayer && (
               <div className="flex w-full justify-start">
                  <div className="relative w-fit max-w-[85%] sm:max-w-[75%] rounded-xl shadow-sm flex flex-col bg-transparent dark:bg-transparent w-full">
                     <ChatMessage 
                        message={{
                          id: 'final-audio',
                          sender: 'bot',
                          type: 'audio',
                          audioSrc: 'https://jocular-hotteok-c97a2c.netlify.app/audio.mp3',
                          audioDuration: 100,
                          autoplay: true,
                          timestamp: '',
                        }}
                        onQuickReply={() => {}}
                      />
                  </div>
              </div>
            )}
             {showImage1 && (
                <ChatMessage 
                  message={{
                    id: 'final-image-1',
                    sender: 'bot',
                    type: 'image',
                    imageSrc: 'https://i.imgur.com/WGlJJYr.gif',
                    content: 'Imagem 1',
                    timestamp: ''
                  }}
                  onQuickReply={() => {}}
                />
            )}
            {showImage2 && (
               <ChatMessage 
                  message={{
                    id: 'final-image-2',
                    sender: 'bot',
                    type: 'image',
                    imageSrc: 'https://i.imgur.com/sHEZcAB.gif',
                    content: 'Imagem 2',
                    timestamp: ''
                  }}
                  onQuickReply={() => {}}
                />
            )}
            {showImage3 && (
               <ChatMessage 
                  message={{
                    id: 'final-image-3',
                    sender: 'bot',
                    type: 'image',
                    imageSrc: 'https://i.imgur.com/oxv0OYJ.gif',
                    content: 'Imagem 3',
                    timestamp: ''
                  }}
                  onQuickReply={() => {}}
                />
            )}
            {showFinalAudio && (
                 <ChatMessage 
                    message={{
                      id: 'final-audio-2',
                      sender: 'bot',
                      type: 'audio',
                      audioSrc: 'https://celebrated-halva-7d258a.netlify.app/',
                      audioDuration: 100,
                      autoplay: true,
                      timestamp: '',
                    }}
                    onQuickReply={() => {}}
                  />
            )}
          </div>
        </main>

        <footer className="flex-shrink-0 p-2 md:p-3 bg-gray-100 dark:bg-gray-900 border-t">
          <form onSubmit={handleTextMessageSubmit} className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full h-10 w-10"><Smile /></Button>
            <Input
              type="text"
              placeholder="Mensagem"
              className="flex-grow rounded-full px-4 bg-white dark:bg-gray-800"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={!awaitingUserResponse || showIMCForm || showReport}
            />
            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full h-10 w-10"><Paperclip /></Button>
            <Button type="submit" size="icon" className="bg-teal-500 hover:bg-teal-600 rounded-full h-10 w-10" disabled={!awaitingUserResponse || !inputValue.trim()}>
              <Send />
            </Button>
          </form>
        </footer>

      </div>
    </div>
  );
}
