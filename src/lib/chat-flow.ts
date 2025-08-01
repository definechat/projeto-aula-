
import type { ChatStep } from './types';

export const chatFlow: ChatStep[] = [
  {
    id: 1,
    sender: 'bot',
    type: 'text',
    content: "Olá! Sou o MiKE, seu terapeuta de emagrecimento virtual. Estou aqui para te ajudar a entender melhor suas necessidades e traçar um plano para você alcançar seus objetivos.",
    delay: 1500,
  },
  {
    id: 2,
    sender: 'bot',
    type: 'text',
    content: "Para começarmos, preciso de algumas informações suas. Vamos calcular seu IMC e sua necessidade diária de hidratação.",
    delay: 2000,
  },
  {
    id: 3,
    sender: 'bot',
    type: 'calculator',
    delay: 1000,
  },
  {
    id: 4,
    sender: 'bot',
    type: 'text',
    content: 'Calculando seu relatório personalizado... Isso pode levar um momento.',
    delay: 2000,
  },
  {
    id: 5,
    sender: 'bot',
    type: 'report',
    delay: 1000,
  },
  {
    id: 6,
    sender: 'bot',
    type: 'text',
    content: "Com base no seu relatório, vejo que podemos trabalhar juntos para alcançar um resultado incrível! O GrãoKiseca foi desenvolvido exatamente para casos como o seu.",
    delay: 2000
  },
  {
    id: 7,
    sender: 'bot',
    type: 'image',
    content: "Veja o caso da Ivani, uma de nossas clientes estrela, que eliminou 20kg e transformou sua vida.",
    imageSrc: 'https://placehold.co/600x400',
    delay: 1500,
  },
  {
    id: 8,
    sender: 'bot',
    type: 'text',
    content: "O GrãoKiseca atua eliminando a gordura visceral, diminuindo a compulsão alimentar e acelerando seu metabolismo. É a solução natural que você precisa.",
    delay: 2500,
  },
  {
    id: 9,
    sender: 'bot',
    type: 'cta',
    content: "Clique aqui para conhecer os tratamentos e começar sua transformação AGORA!",
    delay: 2000
  }
];
