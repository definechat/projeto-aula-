
"use client";

import { useState, useEffect, useRef, type FormEvent } from 'react';
import { ArrowLeft, Phone, Video as VideoIcon, MoreVertical, Send, Smile, Paperclip, Download, User, Weight, Ruler } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { chatFlow } from '@/lib/chat-flow';
import type { Message, UserInfo } from '@/lib/types';
import { ChatMessage } from '@/components/chat-message';
import { IMCForm } from '@/components/imc-form';
import { ReportCard } from '@/components/report-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import html2canvas from 'html2canvas';
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
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [leadInfo, setLeadInfo] = useState({ name: '', whatsapp: '' });
  const [inputValue, setInputValue] = useState('');

  const { trackEvent } = useAnalytics();

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const reportCardRef = useRef<HTMLDivElement>(null);
  
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const audioSentRef = useRef<HTMLAudioElement | null>(null);
  const audioReceivedRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // We need to create audio elements in useEffect to ensure they exist on the client-side
    audioSentRef.current = new Audio('/audio/sent.mp3');
    audioReceivedRef.current = new Audio('/audio/received.mp3');
  }, []);


  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing, showIMCForm, showReport]);

  const addMessage = (message: Omit<Message, 'id' | 'timestamp' | 'status'>, stepId?: string) => {
    if (message.sender === 'user' && audioSentRef.current) {
      audioSentRef.current.play().catch(console.error);
    } else if (message.sender === 'bot' && audioReceivedRef.current) {
      audioReceivedRef.current.play().catch(console.error);
    }

    if (stepId) {
      trackEvent(stepId);
    }
    
    let finalContent = message.content;
    if (message.sender === 'bot' && message.content?.includes('{name}')) {
        finalContent = message.content.replace('{name}', leadInfo.name.split(' ')[0] || '');
    }


    setMessages(prev => [...prev, {
      ...message,
      content: finalContent,
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    }]);
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
    
    if (step.id === 0.35) { // Capturing name
        setLeadInfo(prev => ({ ...prev, name: inputValue.trim() }));
    } else if (step.id === 0.4) { // Capturing whatsapp
        setLeadInfo(prev => ({ ...prev, whatsapp: inputValue.trim() }));
    }


    setInputValue('');
    setAwaitingUserResponse(false);
    handleNextStep();
  };


  const handleIMCSubmit = (data: UserInfo) => {
    const step = chatFlow[currentStep];
    setUserInfo(data);
    setShowIMCForm(false);
    setAwaitingUserResponse(false); 
    addMessage({ sender: 'user', type: 'text', content: `Pronto! Meus dados: ${data.weight}kg e ${data.height}cm.` }, step.id ? `step_${step.id}` : undefined);
    handleNextStep();
  };
  
  const handleDownloadReport = async () => {
    if (!reportCardRef.current) return;
    const step = chatFlow[currentStep];
    try {
        const canvas = await html2canvas(reportCardRef.current, { scale: 2 });
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.download = `relatorio-graokiseca-${leadInfo.name.split(' ')[0].toLowerCase()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setShowLeadModal(false);
        setShowReport(false);
        addMessage({ sender: 'bot', type: 'text', content: "Ótimo! Seu relatório foi baixado. Agora vamos continuar para a parte final." }, step.id ? `step_${step.id}` : undefined);
        setAwaitingUserResponse(false);
        handleNextStep(); 
    } catch (error) {
        console.error("Erro ao gerar a imagem do relatório:", error);
        setShowReport(false);
        addMessage({ sender: 'bot', type: 'text', content: "Tive um problema ao gerar seu relatório. Vamos continuar mesmo assim." }, step.id ? `step_${step.id}` : undefined);
        setAwaitingUserResponse(false);
        handleNextStep();
    }
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
          setAwaitingUserResponse(true);
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
      if (step.type === 'quick-reply' && step.options) messageToAdd.options = step.options;
      if (step.audioSrc) {
        messageToAdd.audioSrc = step.audioSrc;
        const audio = new Audio(step.audioSrc);
        audioRefs.current[step.id] = audio;
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

  const getAudioRef = (id: string | number) => {
    return audioRefs.current[id];
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
                getAudioRef={getAudioRef}
              />
            ))}
            {isProcessing && !awaitingUserResponse && (
              <ChatMessage message={{ id: 'typing', sender: 'bot', type: 'loading', timestamp: '' }} onQuickReply={() => { }} getAudioRef={getAudioRef} />
            )}
            {showIMCForm && <IMCForm onSubmit={handleIMCSubmit} />}
            {showReport && userInfo && (
              <>
                <ReportCard ref={reportCardRef} userInfo={userInfo} />
                <div className="flex justify-center my-2">
                  <Button onClick={() => setShowLeadModal(true)} size="lg" className="bg-green-500 hover:bg-green-600 text-white font-bold shadow-lg">
                    <Download className="mr-2 h-5 w-5" />
                    Baixar Relatório e Continuar
                  </Button>
                </div>
              </>
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

        <Dialog open={showLeadModal} onOpenChange={setShowLeadModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quase lá! Baixe seu check-up gratuito.</DialogTitle>
              <DialogDescription>
                Por favor, preencha seus dados para receber seu check-up. Ele será seu guia inicial nesta jornada de transformação!
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <User className="h-5 w-5 text-gray-500" />
                    <Input
                        id="name"
                        placeholder="Seu primeiro nome"
                        value={leadInfo.name}
                        onChange={(e) => setLeadInfo({ ...leadInfo, name: e.target.value })}
                        className="col-span-3"
                    />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <Input
                        id="whatsapp"
                        placeholder="Seu WhatsApp com DDD"
                        value={leadInfo.whatsapp}
                        onChange={(e) => setLeadInfo({ ...leadInfo, whatsapp: e.target.value })}
                        className="col-span-3"
                    />
                </div>
            </div>
             <Button onClick={handleDownloadReport} disabled={!leadInfo.name || !leadInfo.whatsapp}>
                <Download className="mr-2 h-4 w-4" />
                Baixar e Continuar
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
