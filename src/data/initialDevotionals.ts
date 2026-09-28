import { Devotional } from '../types';

export const INITIAL_DEVOTIONALS: Devotional[] = [
  {
    id: 'dev-today',
    title: 'A Cruz: O Poder da Reconciliação e Esperança',
    date: '2026-09-28',
    formattedDate: 'Hoje, 28 de Setembro',
    passageRef: 'Romanos 5:8',
    verseText: 'Mas Deus prova o seu amor para conosco, em que Cristo morreu por nós, sendo nós ainda pecadores.',
    author: 'Pastor Billy Graham',
    authorRole: 'Evangelista & Pregador da Palavra',
    authorAvatar: '/billy-graham-avatar.jpg',
    durationSeconds: 194, // 3m 14s
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/morning_birds.ogg',
    audioSizeFormatted: '1.4 MB',
    audioFormat: 'opus',
    optimizedViaCloud: true,
    cloudCdnUrl: 'https://cdn.palavraviva.cloud/audio/2026-09-28-billy-graham-cruz.opus',
    compressionRatio: '-68% otimizado via R2 CDN',
    githubCommitHash: '8f7a23c',
    reflectionText: 'Quando olhamos para as tempestades da vida moderna, com todas as incertezas políticas, ansiedades e pressões emocionais, a Bíblia nos aponta para um ponto fixo na história humana: a Cruz do Calvário. Pastor Billy Graham costumava proclamar aos estádios lotados: "Não há problema humano grande demais que a graça de Deus não possa curar". O amor divino não é um conceito abstrato ou uma filosofia distante; é uma pessoa viva que estendeu Seus braços na cruz para nos abraçar e perdoar. Hoje, pare por alguns instantes, respire fundo e entregue seus fardos nas mãos daquele que venceu o mundo.',
    prayerText: 'Senhor Todo-Poderoso, hoje coloco todas as minhas preocupações aos Teus pés. Que o Teu infinito amor renove minhas forças e me dê a paz que excede todo o entendimento. Em nome de Jesus, Amém.',
    tags: ['Salvação', 'Esperança', 'Graça', 'Billy Graham'],
    likesCount: 142,
    sharesCount: 68,
    listensCount: 890,
    isBillyGrahamSpecial: true,
    coverImage: '/billy-graham.jpg'
  },
  {
    id: 'dev-yesterday',
    title: 'Paz em Meio à Tempestade Diária',
    date: '2026-09-27',
    formattedDate: 'Ontem, 27 de Setembro',
    passageRef: 'Filipenses 4:6-7',
    verseText: 'Não andeis ansiosos de coisa alguma; em tudo, porém, sejam conhecidas as vossas petições diante de Deus pela oração e pela súplica com ações de graças.',
    author: 'Equipe Pastoral Palavra Viva',
    authorRole: 'Devocional Diário',
    authorAvatar: '/billy-graham-avatar.jpg',
    durationSeconds: 156, // 2m 36s
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg',
    audioSizeFormatted: '1.1 MB',
    audioFormat: 'webm',
    optimizedViaCloud: true,
    cloudCdnUrl: 'https://cdn.palavraviva.cloud/audio/2026-09-27-paz-tempestade.opus',
    compressionRatio: '-62% via Cloudflare CDN',
    githubCommitHash: '3e198ba',
    reflectionText: 'A ansiedade tenta nos convencer de que precisamos carregar o peso do amanhã antes mesmo que ele chegue. Mas Jesus nos ensinou a viver um dia de cada vez. A paz de Deus não é a ausência de conflitos no exterior, mas a certeza inabalável da presença Dele no interior do nosso coração. Transforme suas preocupações em orações e testemunhe a transformação da sua mente.',
    prayerText: 'Pai Celeste, afasta do meu coração o medo do futuro. Ensina-me a descansar na Tua fidelidade e a confiar que cada passo do meu dia já foi preparado por Ti. Amém.',
    tags: ['Paz', 'Ansiedade', 'Confiança', 'Oração'],
    likesCount: 98,
    sharesCount: 45,
    listensCount: 630,
    coverImage: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'dev-billy-special-1',
    title: 'A Fé que Não se Abala com as Notícias',
    date: '2026-09-26',
    formattedDate: '26 de Setembro',
    passageRef: 'Hebreus 11:1',
    verseText: 'Ora, a fé é o firme fundamento das coisas que se esperam, e a prova das coisas que se não veem.',
    author: 'Pastor Billy Graham',
    authorRole: 'Cruzada Evangelística Histórica',
    authorAvatar: '/billy-graham-avatar.jpg',
    durationSeconds: 220, // 3m 40s
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/gentle_stream_in_forest.ogg',
    audioSizeFormatted: '1.6 MB',
    audioFormat: 'opus',
    optimizedViaCloud: true,
    cloudCdnUrl: 'https://cdn.palavraviva.cloud/audio/billy-graham-fe-inabalavel.opus',
    compressionRatio: '-71% Cloud Optimized',
    githubCommitHash: 'c45b789',
    reflectionText: 'Como Billy Graham reiterava com convicção: "Fé não é a crença de que Deus fará o que você quer; é a crença de que Deus fará o que é certo". Mesmo quando as circunstâncias ao nosso redor parecem caóticas, a Palavra de Deus permanece para sempre. Permaneça firme na promessa.',
    prayerText: 'Senhor, aumenta a minha fé quando os ventos contrários soprarem. Que meus olhos estejam fixos em Jesus, autor e consumador da nossa fé. Amém.',
    tags: ['Fé', 'Perseverança', 'Billy Graham', 'Força'],
    likesCount: 215,
    sharesCount: 112,
    listensCount: 1420,
    isBillyGrahamSpecial: true,
    coverImage: '/billy-graham.jpg'
  },
  {
    id: 'dev-billy-special-2',
    title: 'O Poder Transformador da Oração Silenciosa',
    date: '2026-09-25',
    formattedDate: '25 de Setembro',
    passageRef: 'Salmos 46:10',
    verseText: 'Aquietai-vos e sabei que eu sou Deus; sou exaltado entre as nações, sou exaltado na terra.',
    author: 'Pastor Billy Graham',
    authorRole: 'Mensagem Pastoral',
    authorAvatar: '/billy-graham-avatar.jpg',
    durationSeconds: 180, // 3m
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/soft_wind_chimes.ogg',
    audioSizeFormatted: '1.3 MB',
    audioFormat: 'opus',
    optimizedViaCloud: true,
    cloudCdnUrl: 'https://cdn.palavraviva.cloud/audio/oracao-silenciosa.opus',
    compressionRatio: '-65% Cloud Optimized',
    githubCommitHash: '91a2fc3',
    reflectionText: 'O mundo moderno nos bombardeia com barulho constante, notificações e pressões. Na quietude e no silêncio diante do Criador, encontramos clareza e restauração. Billy Graham dizia que os maiores homens e mulheres de Deus foram aqueles que aprenderam a ajoelhar e ouvir antes de agir.',
    prayerText: 'Deus de bondade, acalma meus pensamentos e aquieta meu espírito. Que Tua voz suave guie minhas decisões hoje. Amém.',
    tags: ['Oração', 'Quietude', 'Salmos', 'Sabedoria'],
    likesCount: 178,
    sharesCount: 94,
    listensCount: 1150,
    isBillyGrahamSpecial: true,
    coverImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80'
  }
];

export const BILLY_GRAHAM_QUOTES = [
  {
    quote: "A salvação é gratuita, mas nos custa tudo o que somos e tudo o que temos.",
    context: "Cruzada de Nova York, 1957"
  },
  {
    quote: "Meu lar é no Céu. Eu estou apenas viajando por este mundo.",
    context: "Mensagem sobre a Eternidade"
  },
  {
    quote: "Deus nunca nos prometeu uma vida livre de tempestades, mas nos prometeu um Salvador presente no meio de cada uma delas.",
    context: "Palavra de Consolo"
  },
  {
    quote: "A oração é a chave da manhã e o ferrolho da noite.",
    context: "Reflexão sobre a Vida Devocional"
  }
];
