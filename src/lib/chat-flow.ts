import type { ChatStep } from './types';

export const chatFlow: ChatStep[] = [
  // ETAPA 1
  {
    id: 1,
    sender: 'bot',
    type: 'audio',
    content: "Olá, meu amigo/minha amiga! Satisfação em falar com você. Meu nome é Emerson, sou terapeuta de emagrecimento, especialista em plantas medicinais. Represento o produto mais poderoso do mundo, com mais de uma década de existência e 5 mil depoimentos! Se você precisa emagrecer com urgência, sem passar fome e sem se matar na academia, está no lugar certo! Mas, preciso que me diga: está com tempo para me ouvir agora, ou podemos agendar depois? É coisa rápida, tá?",
    audioDuration: 20, 
    delay: 1500,
  },
  {
    id: 2,
    sender: 'bot',
    type: 'quick-reply',
    content: "A senhora está com um tempinho agora? É coisa rápida, tá?",
    options: [
      { text: "Sim, posso falar.", value: "sim" },
      { text: "Não, estou ocupada.", value: "nao" },
    ],
    waitForUser: true,
    delay: 1000,
  },
  // ETAPA 2
  {
    id: 3,
    sender: 'bot',
    type: 'audio',
    content: "Ótimo! Agora, para eu te ajudar de verdade, me diga: Quantos quilos você precisa eliminar? E qual a parte do corpo que a gordura mais te incomoda?",
    audioDuration: 9,
    delay: 1500,
  },
  {
    id: 4,
    sender: 'bot',
    type: 'quick-reply',
    content: "Qual a parte do corpo que a gordura mais te incomoda?",
    options: [
      { text: "A barriga", value: "barriga" },
      { text: "Outra área", value: "outra" },
    ],
    waitForUser: true,
    delay: 1000,
  },
  // ETAPA 3
  {
    id: 5,
    sender: 'bot',
    type: 'audio',
    content: "Eu te entendo… A gordura na barriga é o que mais incomoda e o que mais mata. Ela fica dentro de você, pode causar infarto, derrame, AVC. Sei que é uma palavra que não gosto de falar, mas temos que nos cuidar! A gordura não sai só se olhando no espelho e reclamando. Pelo contrário, depois dos 25 anos, ela aumenta sozinha! Temos que fazer alguma coisa, não é?",
    audioDuration: 20,
    delay: 1500,
  },
  {
    id: 6,
    sender: 'bot',
    type: 'quick-reply',
    content: "E me diz uma coisa: você já usou algum produto pra emagrecer? E se usou, emagreceu ou foi só dinheiro jogado fora?",
    options: [
      { text: "Já usei e não funcionou.", value: "nao_funcionou" },
      { text: "Nunca usei nada.", value: "nunca_usei" },
    ],
    waitForUser: true,
    delay: 1500,
  },
  // ETAPA 4
  {
    id: 7,
    sender: 'bot',
    type: 'audio',
    content: "Eu entendo sua frustração, mas lhe digo uma coisa: seu discurso muda a partir de hoje! Daqui a 2 ou 3 meses, você vai falar: 'Eu já usei muito produto que não funcionou, mas um dia conheci o tal do GrãoKiseca… o negócio é poderoso, eu fiquei chocado e sequei mesmo!' Você ficaria feliz eliminando 10 ou 20 quilos nesse tempo?",
    audioDuration: 19,
    delay: 1500,
  },
  {
    id: 8,
    sender: 'bot',
    type: 'quick-reply',
    content: "Ficaria feliz eliminando 10 ou 20 quilos nesse tempo?",
    options: [
      { text: "Com certeza! É o meu sonho.", value: "sim_sonho" },
    ],
    waitForUser: true,
    delay: 1000,
  },
  // ETAPA 5
  {
    id: 9,
    sender: 'bot',
    type: 'audio',
    content: "E eu sei que muitas pessoas não têm tempo de treinar. Às vezes, são donas de casa, cuidam de marido e filhos, e pra treinar é mais difícil. Por isso, Deus nos deu esse milagre da natureza! O GrãoKiseca é o único produto do mundo que emagrece sem dietas e exercícios. Eu tenho certeza que você vai amar, e sua história vai mudar! Tome posse, porque vai acontecer! Mas você precisa usar do jeito que o especialista vai te ensinar.",
    audioDuration: 25,
    delay: 1500,
  },
  {
    id: 10,
    sender: 'bot',
    type: 'image-generating',
    content: 'Só um momento, estou buscando uma foto para te mostrar...',
    delay: 1500,
  },
  {
    id: 11,
    sender: 'bot',
    type: 'image',
    content: "Aqui a Ivani, cliente estrela que eliminou 20kg!",
    delay: 1000,
  },
  {
    id: 12,
    sender: 'bot',
    type: 'video',
    content: "Aqui um depoimento em vídeo, de uma de nossas clientes.",
    delay: 1500,
  },
  {
    id: 13,
    sender: 'bot',
    type: 'video',
    content: "E aqui mais uma prova de que funciona de verdade! Assista!",
    delay: 1500,
  },
  // ETAPA 6
  {
    id: 14,
    sender: 'bot',
    type: 'audio',
    content: "O GrãoKiseca tira a sua fome e a compulsão alimentar. Ele elimina 3 tipos de gordura: a visceral, a abdominal e a do alimento! Ele é um diurético, então não se assuste se perder 2kg na primeira semana, isso é líquido. Mas a gordura vai sair após 1 mês. E se a senhora tem compulsão noturna, saiba que o grão é um ansiolítico natural tão poderoso que várias clientes relatam ter deixado até o remédio para depressão de lado!",
    audioDuration: 28,
    delay: 1500,
  },
  {
    id: 15,
    sender: 'bot',
    type: 'text',
    content: "Agora, vou lhe explicar por que você vai emagrecer dessa vez!",
    delay: 2000,
  },
  // ETAPA 7
  {
    id: 16,
    sender: 'bot',
    type: 'audio',
    content: "Eu vou passar os valores agora, sem enrolação. O GrãoKiseca deveria custar R$1000 e ainda seria barato. Sabe quanto custa uma bariátrica? Só de exame, gasta-se R$1000! E o total pode chegar a R$60 mil. Vou te mostrar o depoimento de uma cliente que desistiu da bariátrica depois de conhecer o GrãoKiseca.",
    audioDuration: 21,
    delay: 1500,
  },
  {
    id: 17,
    sender: 'bot',
    type: 'video',
    content: "Veja o depoimento de uma cliente que desistiu da bariátrica.",
    delay: 1500,
  },
  {
    id: 18,
    sender: 'bot',
    type: 'text',
    content: "Estou te enviando os valores agora!",
    delay: 1000,
  },
  // ETAPA 8
  {
    id: 19,
    sender: 'bot',
    type: 'audio',
    content: "Temos 3 tratamentos! O de 1 pote para 1 mês de uso, que elimina de 5kg a 10kg, por R$229. O de 3 meses, onde você compra 2 e leva 3, para eliminar de 10kg a 20kg, por apenas R$329. E o nosso programa intensivo completo, para quem precisa eliminar mais de 30kg, que inclui 6 potes, ligações semanais com o especialista, livros digitais e audios de reprogramação mental! Tudo isso por apenas R$697! Aceitamos cartão em até 12x, PIX e boleto a vista!",
    audioDuration: 30,
    delay: 1500,
  },
  {
    id: 20,
    sender: 'bot',
    type: 'quick-reply',
    content: "Qual tratamento você gostaria de iniciar, meu amigo/minha amiga?",
    options: [
      { text: "1 pote - R$229", value: "1_pote" },
      { text: "3 potes - R$329", value: "3_potes" },
      { text: "6 potes - R$697", value: "6_potes" },
    ],
    waitForUser: true,
    delay: 2000,
  },
  // ETAPA 9 (CTA Final)
  {
    id: 21,
    sender: 'bot',
    type: 'cta',
    content: "COMPRAR AGORA E TRANSFORMAR MINHA VIDA!",
    delay: 2000,
  },
];
