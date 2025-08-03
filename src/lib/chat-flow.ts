
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
    id: 2.1,
    sender: 'bot',
    type: 'text',
    content: "Ótimo! Seu relatório foi gerado. Agora vamos continuar para a parte final.",
    delay: 7000 // Give user some time to see the report card
  },
  {
    id: 15,
    sender: 'bot',
    type: 'quick-reply',
    content: "Entendi minha flor, falar que você ta 100% satisfeita com seu corpo quando usa uma roupa ou quando ve a gordura barriga marcando na roupa, ao se olhar no espelho , se eu falar que vc ta feliz é mentira , né isso ?",
    audioSrc: '/audio/satisfeita.mp3',
    audioDuration: 13,
    delay: 5000,
    waitForUser: true,
    options: [
        { text: "Realmente preciso resolver essa gordura.", value: 'resolver' },
        { text: "Ando insatisfeita com meu corpo.", value: 'insatisfeita' }
    ]
  },
  {
    id: 16,
    sender: 'bot',
    type: 'quick-reply',
    content: "Me fale qual dos tratamentos a senhora mais gostou: **G, GG ou XG?**",
    delay: 4000,
    waitForUser: true,
    options: [
        { text: "G - R$129", value: 'g' },
        { text: "GG - R$337", value: 'gg' },
        { text: "XG - R$447", value: 'xg' }
    ],
  },
  {
    id: 17,
    sender: 'bot',
    type: 'quick-reply',
    content: "Lembrando, se você tiver **medo de comprar online**, vou resolver agora. Sabia que um golpista **nunca vende no cartão**? Porque no cartão, se a senhora ligar e pedir estorno, seu dinheiro volta. Por isso que falo pra senhora, sua compra é **100% garantida e segura**. Se a senhora observar a idade de nossas clientes, vai entender que 'essa senhora tá falando a verdade', são pessoas de idade, você viu isso?",
    audioSrc: '/audio/medo-comprar.mp3',
    audioDuration: 23,
    delay: 6000,
    waitForUser: true,
    options: [
        { text: "Vi sim 👍", value: 'vi_sim' },
        { text: "Gostei! ✅", value: 'gostei' }
    ]
  },
  {
    id: 18,
    sender: 'bot',
    type: 'quick-reply',
    content: "Então a gordura que incomoda e te afeta, você quer se **livrar logo** ou aguenta mais um ano com ela, podendo engordar mais?",
    audioSrc: '/audio/livrar-logo.mp3',
    audioDuration: 8,
    delay: 5000,
    waitForUser: true,
    options: [
        { text: "Quero resolver logo! 💪", value: 'resolver_logo' },
        { text: "Não aguento mais! 😩", value: 'nao_aguento' }
    ]
  },
  {
    id: 19,
    sender: 'bot',
    type: 'audio',
    content: "**Ótimo então, minha linda!** Aguardo a senhora me dizer qual combo você mais gostou, para separar seu produto, e também vou deixar o **site**. A senhora pode ver outras clientes, como a senhora, que hoje estão fazendo sucesso por onde passam...",
    audioSrc: '/audio/otimo.mp3',
    audioDuration: 13,
    delay: 6000,
  },
  {
    id: 20,
    sender: 'bot',
    type: 'cta',
    content: 'Clique Aqui Para Visitar Nosso Site e Comprar',
    delay: 3000,
  },
  {
    id: 21,
    sender: 'bot',
    type: 'text',
    content: "Se você tiver qualquer uma dessas dúvidas, vou responder agora:\n\na) Quem tem **pressão alta** pode tomar?\nb) Quem tem **diabetes ou colesterol**?\nc) Toma **remédios para o coração**?\nd) Tem problemas na **tireoide**?\n\nQualquer um desses pode tomar?",
    delay: 7000
  },
  {
    id: 22,
    sender: 'bot',
    type: 'audio',
    content: "**Fique tranquila!** Aquelas senhoras que você viu, você acha que elas eram saudáveis? De forma alguma! Elas vieram até nós com vários problemas de saúde e, ao emagrecer com o grão, **resolveram tudo**, incluindo as taxas! E eu sei que a senhora **será a próxima!** Basta dizer qual tratamento a senhora escolheu. Estou aguardando aqui para terminar seu atendimento. Pressão alta? Basta continuar tomando seus remédios normalmente, nosso produto vai agir mais no seu intestino! **Aguardo você falar.**",
    audioSrc: '/audio/duvidas-finais.mp3',
    audioDuration: 30,
    delay: 7000,
    waitForUser: true
  }
];
