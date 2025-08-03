
import type { ChatStep } from './types';

export const chatFlow: ChatStep[] = [
  {
    id: 0.1,
    sender: 'bot',
    type: 'text',
    content: "Olá, tudo bem? 👋",
    delay: 1000,
  },
  {
    id: 0.2,
    sender: 'bot',
    type: 'text',
    content: "Você sabia que é **impossível emagrecer de vez** sem antes fazer um **check-up de emagrecimento?**",
    delay: 2000,
  },
   {
    id: 0.25,
    sender: 'bot',
    type: 'image',
    content: '',
    imageSrc: "https://i.imgur.com/4Fr9DGu.gif",
    delay: 2000,
  },
   {
    id: 0.3,
    sender: 'bot',
    type: 'text',
    content: "Receba o seu **gratuitamente!** 🎁",
    delay: 1500,
  },
  {
    id: 0.35,
    sender: 'bot',
    type: 'audio',
    audioSrc: 'https://ephemeral-kangaroo-523a27.netlify.app/audio-boas-vindas.mp3',
    audioDuration: 29,
    delay: 7000,
    autoplay: true,
  },
  {
    id: 0.4,
    sender: 'bot',
    type: 'text',
    content: "Para começar, me diga seu primeiro nome.",
    delay: 1000,
    waitForUser: true,
  },
  {
    id: 0.5,
    sender: 'bot',
    type: 'text',
    content: "Prazer, {name}! Por último, me diz teu **whatsapp com DDD** pra eu te enviar o checkup.",
    delay: 2000,
    waitForUser: true,
  },
  {
    id: 0.6,
    sender: 'bot',
    type: 'audio',
    audioSrc: 'https://graceful-valkyrie-a05732.netlify.app/audio.mp3',
    audioDuration: 45,
    delay: 7000,
    autoplay: true,
  },
  {
    id: 1,
    sender: 'bot',
    type: 'calculator',
    delay: 12000,
  },
  {
    id: 2,
    sender: 'bot',
    type: 'report',
    delay: 2000,
  },
  {
    id: 3,
    sender: 'bot',
    type: 'audio',
    audioSrc: 'https://jocular-hotteok-c97a2c.netlify.app/audio.mp3',
    audioDuration: 100, // Duration in seconds (1 min 40 sec)
    delay: 7000,
    autoplay: true,
  }
];
