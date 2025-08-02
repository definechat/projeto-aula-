
import type { ChatStep } from './types';

export const chatFlow: ChatStep[] = [
  {
    id: 0.1,
    sender: 'bot',
    type: 'text',
    content: "Olá, tudo bem!",
    delay: 1500,
  },
  {
    id: 0.2,
    sender: 'bot',
    type: 'text',
    content: "Você sabia que é impossível emagrecer de vez sem antes fazer um check-up de emagrecimento?",
    delay: 2500,
  },
   {
    id: 0.3,
    sender: 'bot',
    type: 'text',
    content: "Receba o seu gratuitamente. Me diz teu nome.",
    delay: 2000,
    waitForUser: true,
  },
  {
    id: 0.4,
    sender: 'bot',
    type: 'text',
    content: "Prazer, {name}! Por último, me diz teu whatsapp pra enviar o checkup.",
    delay: 1500,
    waitForUser: true,
  },
  {
    id: 1,
    sender: 'bot',
    type: 'calculator',
    delay: 1000,
  },
  {
    id: 2,
    sender: 'bot',
    type: 'report',
    delay: 1000,
  },
  {
    id: 3,
    sender: 'bot',
    type: 'text',
    content: "Oi minha querida, seja bem vinda! 👋",
    delay: 1500,
  },
  {
    id: 4,
    sender: 'bot',
    type: 'audio',
    content: "Essa é a última vez que a senhora vai procurar algo pra emagrecer. Dessa vez vc acertou no produto e achou o que precisava pra eliminar no mínimo 10kg sem dieta e academia.",
    audioSrc: '/audio/ultima-vez.mp3',
    audioDuration: 12,
    delay: 2000,
  },
  {
    id: 5,
    sender: 'bot',
    type: 'audio',
    content: "Sendo direto com a senhora... tem muita mulher que esta nas nuvens depois de descobrir essa planta milenar sagrada, que produz um vegetal, que suga, gordura da barriga sem dietas e academia, esvazia seu intestino, acabando com prisão de ventre , tudo isso usando 1x ao dia apos o almoço ! nossas clientes depois de emagrecer, passam a viver e nao sobreviver, melhorando sua saude , auto-estima, começa a sair de casa, viajando , conhecendo praias visitando familiares , o resultados delas é tão grande, que ao ve-las os paretens nao se controlam e nos procuram dizendo oi... minha irma usou um produto de voces, e eu vou querer tambem ela emagreceu muito a familia ta chocada !",
    delay: 4000,
    audioSrc: '/audio/planta-milenar.mp3',
    audioDuration: 30,
  },
  {
    id: 6,
    sender: 'bot',
    type: 'quick-reply',
    content: "Enfim minha linda... antes de ir ao que interessa me chamo MiKE, ta ! e preciso saber quantos Kg voce ficaria feliz de emagrecer e qual parte do corpo te incomoda mais a senhora",
    audioSrc: '/audio/quantos-kg.mp3',
    audioDuration: 11,
    delay: 2000,
    waitForUser: true,
    options: [
        { text: "10kg - Barriga", value: '10_barriga' },
        { text: "15kg - Corpo todo", value: '15_corpo' },
        { text: "20kg+ - Me incomoda tudo", value: '20_tudo' }
    ]
  },
  {
    id: 7,
    sender: 'bot',
    type: 'audio',
    content: "Entendi, minha querida, veja so , 90% das nossa clientes sofriam desse mal , isso virou uma verdadeira epidemia no brasil milhoes de mulheres de 40 acima que nao conseguem se exercitar devido problema nas articulaçoes, dores, e nao conseguem fazer dietas pois tem dificuldade de permanecer, ... nessa caso elas dependiam de um produto que resolvesse sem dieta e academia , muitos nem sabe que Deus ja criou um vegetal especifico na natureza pra emagrecer e limpar o intestino acabando com prisão de vente, ! abaixo de Deus , devido os depoimentos de nossas clientes, eu te dou absoluta certeza, voce nunca mais vai precisar procurar produto para emagrecer vc encontrou o unico que resolve , te dou 100% de certeza para quem usar como indicamos !",
    audioSrc: '/audio/epidemia.mp3',
    audioDuration: 35,
    delay: 2000,
  },
  {
    id: 8,
    sender: 'bot',
    type: 'audio',
    content: "Vou te falar como ele age no corpo, e em seguida te passo o preço ta?",
    audioSrc: '/audio/como-age.mp3',
    audioDuration: 5,
    delay: 2000
  },
  {
    id: 9,
    sender: 'bot',
    type: 'text',
    content: "Vou te falar como ele age no corpo e ja passo o valor ta?",
    delay: 1000
  },
  {
    id: 10,
    sender: 'bot',
    type: 'text',
    content: "O produto elimina gordura nas fezes, inibe sua fome, desincha o excesso de agua do corpo (a famosa retenção de liquido, pois é diuretico), diminui a ansiedade e a vontade por doces, não deixa flacidez no corpo, melhora as taxas depois do uso correto! Pode ter certeza que depois de 1 mes usando a senhora se apaixona pelo produto, minhas clientes amam muito esse produto!",
    delay: 3000
  },
  {
    id: 11,
    sender: 'bot',
    type: 'text',
    content: "Vamos ao que interessa, tá?",
    delay: 1500
  },
  {
    id: 12,
    sender: 'bot',
    type: 'text',
    content: "No seu caso para o seu peso temos 3 opções de tratamentos: G, GG, XG.",
    delay: 1500,
  },
  {
    id: 13,
    sender: 'bot',
    type: 'text',
    content: "G (para eliminar de 5 a 8kg): R$129\nGG (para eliminar de 10 a 15kg): R$337\nXG (para eliminar de 15 a 25kg): R$447\n\nAceitamos PIX e Cartão parcelado.",
    delay: 2500,
  },
  {
    id: 13.5,
    sender: 'bot',
    type: 'image',
    content: "Ivani, uma de nossas clientes felizes!",
    imageSrc: '/images/ivani-antes-depois.jpg',
    delay: 2000,
  },
  {
    id: 14,
    sender: 'bot',
    type: 'quick-reply',
    content: "Me fala uma coisa, a senhora está parecida com qual dessas clientes antes de emagrecer, 1, 2 ou 3?",
    delay: 1500,
    waitForUser: true,
    options: [
        { text: "1", value: 1 },
        { text: "2", value: 2 },
        { text: "3", value: 3 }
    ],
  },
  {
    id: 15,
    sender: 'bot',
    type: 'quick-reply',
    content: "Entendi minha flor. Falar que você está 100% satisfeita com seu corpo quando usa uma roupa ou quando vê a gordura da barriga marcando na roupa, ao se olhar no espelho, se eu falar que você está feliz é mentira, né isso?",
    audioSrc: '/audio/satisfeita.mp3',
    audioDuration: 13,
    delay: 2000,
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
    content: "Me fale qual dos tratamentos a senhora mais gostou, G, GG ou XG?",
    delay: 1500,
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
    content: "Lembrando, se você tiver medo de comprar online, vou resolver agora. Sabia que um golpista nunca vende no cartão? Porque no cartão, se a senhora ligar e pedir estorno seu dinheiro volta. Por isso que falo pra senhora, sua compra é 100% garantida e segura. Se a senhora observar a idade de nossas clientes vai entender que de fato 'essa senhora tá falando a verdade', são pessoas de idade, você viu isso?",
    audioSrc: '/audio/medo-comprar.mp3',
    audioDuration: 23,
    delay: 2000,
    waitForUser: true,
    options: [
        { text: "Vi sim", value: 'vi_sim' },
        { text: "Gostei", value: 'gostei' }
    ]
  },
  {
    id: 18,
    sender: 'bot',
    type: 'quick-reply',
    content: "Então a gordura que incomoda e te afeta, você quer se livrar logo ou aguenta mais um ano com ela, podendo engordar mais?",
    audioSrc: '/audio/livrar-logo.mp3',
    audioDuration: 8,
    delay: 2000,
    waitForUser: true,
    options: [
        { text: "Quero resolver logo!", value: 'resolver_logo' },
        { text: "Não aguento mais!", value: 'nao_aguento' }
    ]
  },
  {
    id: 19,
    sender: 'bot',
    type: 'audio',
    content: "Ótimo então minha linda, aguardo a senhora me dizer qual combo você mais gostou, para separar seu produto, e também vou deixar o site. A senhora pode ver outras clientes como a senhora que hoje estão fazendo sucesso por onde passam...",
    audioSrc: '/audio/otimo.mp3',
    audioDuration: 13,
    delay: 2000,
  },
  {
    id: 20,
    sender: 'bot',
    type: 'cta',
    content: 'Clique Aqui Para Visitar Nosso Site e Comprar',
    delay: 2000,
  },
  {
    id: 21,
    sender: 'bot',
    type: 'text',
    content: "Se você tiver qualquer dessas dúvidas, vou responder agora:\n\na) Quem tem pressão alta pode tomar?\nb) Quem tem diabetes, colesterol?\nc) Toma remédios para o coração?\nd) Problemas na tireoide?\n\netc. etc. pode tomar?",
    delay: 2000
  },
  {
    id: 22,
    sender: 'bot',
    type: 'audio',
    content: "Fique tranquila! Aquelas senhoras que você viu, você acha que elas eram saudáveis? De forma alguma! Elas vieram até nós iguais a muitas de vocês, com vários problemas de saúde e ao emagrecer com o grão resolveu tudo, incluindo as taxas! E eu sei que a senhora será a próxima! Basta dizer qual tratamento a senhora escolheu. Estou aguardando aqui para terminar seu atendimento. Pressão alta? Basta continuar tomando seus remédios normalmente, nosso produto vai agir mais no seu intestino! Aguardo você falar.",
    audioSrc: '/audio/duvidas-finais.mp3',
    audioDuration: 30,
    delay: 2000,
    waitForUser: true
  }
];
