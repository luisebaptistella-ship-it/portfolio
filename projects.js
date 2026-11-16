/* Projects, taken from the Framer portfolio (Works collection).
   featured: true = shown in Selected work. The others open from a skill or "Next project".
   English text is Luise's; French and Portuguese are translations to review.
   Images live in assets/projects/<id>/ (cover.jpg + numbered gallery images). */
window.PROJECTS = [
  {
    id: 'bubble-brew',
    featured: true,          // shown in Selected work
    hero: 'hero.mp4',        // silent video, the first thing on its project page
    title: 'Bubble Brew',
    client: 'Bubble Brew',
    year: 2025,
    category: { en: 'Visual design', fr: 'Design visuel', pt: 'Design visual' },
    images: ['cover', 1, 2, 3, 4],
    deliverables: {
      en: ['Logo Design', 'Visual Identity', 'Product Design'],
      fr: ['Création de logo', 'Identité visuelle', 'Design produit'],
      pt: ['Criação de logo', 'Identidade visual', 'Design de produto'],
    },
    text: {
      en: [
        'Bubble Brew is a laundry café concept designed for young adults aged 20 to 30 living in large cities. The challenge was to visually communicate a business concept that combines two everyday activities, laundry and coffee, in a way that feels accessible to its target audience.',
        'The identity uses a hand drawn logo and a light color palette to create a softer and more approachable brand presence. These choices give Bubble Brew a distinct visual character while supporting the goal of presenting the concept to a young urban audience.',
      ],
      fr: [
        'Bubble Brew est un concept de café-laverie pensé pour les 20-30 ans des grandes villes. Le défi : rendre lisible et accessible un concept qui réunit deux gestes du quotidien, la lessive et le café.',
        'L’identité repose sur un logo dessiné à la main et une palette claire, pour une présence de marque plus douce et plus accueillante. Ces choix donnent à Bubble Brew un caractère visuel singulier tout en servant l’objectif : présenter le concept à un jeune public urbain.',
      ],
      pt: [
        'Bubble Brew é um conceito de café-lavanderia pensado para jovens adultos de 20 a 30 anos que vivem em grandes cidades. O desafio era comunicar visualmente um negócio que une duas atividades do dia a dia, lavar roupa e tomar café, de um jeito acessível para esse público.',
        'A identidade usa um logo desenhado à mão e uma paleta de cores clara para criar uma presença de marca mais suave e acolhedora. Essas escolhas dão à Bubble Brew um caráter visual próprio e ajudam a apresentar o conceito a um público jovem e urbano.',
      ],
    },
  },
  {
    id: 'livia-zeffa',
    featured: true,          // shown in Selected work
    hero: 'hero.mp4',        // silent video, the first thing on its project page
    title: 'Livia Zeffa',
    client: 'Livia Zeffa',
    year: 2026,
    category: { en: 'Rebranding', fr: 'Rebranding', pt: 'Rebranding' },
    images: ['cover', 2, 3, 4, 5],   // LIVIA 1–5 from "Presentation DA Livia/LIVIA PORTFOLIO" (Nov 2026)
    thumb: 'thumb.jpg',      // home tile + skill card: the red photo without the writing (cover = LIVIA 1, inside the project)
    deliverables: {
      en: ['Logo Design', 'Branding', 'Visual Identity', 'Digital Art Direction', 'Social Media Strategy'],
      fr: ['Création de logo', 'Branding', 'Identité visuelle', 'Direction artistique digitale', 'Stratégie social media'],
      pt: ['Criação de logo', 'Branding', 'Identidade visual', 'Direção de arte digital', 'Estratégia de redes sociais'],
    },
    text: {
      en: [
        'Livia Zeffa wanted a strong visual identity that matched who she is: a sertanejo singer with real presence, who puts her hometown, her audience and her fans at the center of everything. Her goal has always been to move people through music.',
        'From there, we built a digital strategy around live show videos, high-quality video content and a show schedule posted at the start of every month, inviting her audience to follow her. The visual identity was also redesigned, moving from a simple pink logo to a modern, recognizable mark that conveys the strength and passion she brings to her music.',
        'The redesign included a new visual identity, refined logo system and color palette, as well as a complete Instagram direction. Profile photography, highlights, content strategy, colors and show-related video and story assets were developed to create a more consistent brand presence across her digital communication.',
      ],
      fr: [
        'Livia Zeffa voulait une identité visuelle forte, à son image : celle d’une chanteuse de sertanejo qui a une vraie présence, et qui place sa ville natale, son public et ses fans au centre de tout. Son ambition a toujours été de toucher les gens par la musique.',
        'À partir de là, nous avons construit une stratégie digitale autour de vidéos de concerts, de contenus vidéo soignés et d’un agenda publié au début de chaque mois pour inviter son public à la suivre. L’identité visuelle a elle aussi été repensée : l’ancien logo, simple et rose, a laissé place à une marque moderne et reconnaissable, qui transmet la force et la passion de la chanteuse.',
        'La refonte comprend une nouvelle identité visuelle, un système de logo et une palette affinés, ainsi qu’une direction Instagram complète : photos de profil, highlights, stratégie de contenu, couleurs, vidéos et stories autour des concerts, pour une présence de marque plus cohérente sur l’ensemble de sa communication digitale.',
      ],
      pt: [
        'Livia Zeffa queria uma identidade visual forte, à altura de quem ela é: uma cantora sertaneja de presença marcante, que coloca sua cidade natal, seu público e seus fãs no centro de tudo. Seu propósito sempre foi tocar as pessoas por meio da música.',
        'A partir daí, criamos uma estratégia digital com vídeos dos shows, conteúdos em vídeo de alta qualidade e uma agenda publicada no início de cada mês, convidando o público a acompanhá-la. A identidade visual também foi repaginada: o antigo logo, simples e rosa, deu lugar a uma marca moderna e reconhecível, que transmite a força e a paixão da cantora.',
        'O redesign incluiu uma nova identidade visual, um sistema de logo e uma paleta de cores refinados, além de uma direção completa para o Instagram. Fotos de perfil, destaques, estratégia de conteúdo, cores, vídeos e stories dos shows foram desenvolvidos para criar uma presença de marca mais consistente em toda a comunicação digital.',
      ],
    },
  },
  {
    id: 'low-key',
    featured: true,          // shown in Selected work
    title: 'Low Key',
    client: 'Low Key',
    year: 2025,
    category: { en: 'Print', fr: 'Print', pt: 'Impresso' },
    images: ['cover', 1, 2, 4],   // 3.jpg (Em Solitude mockup) removed Nov 2026
    film: 'film.mp4',        // page-turn stop motion, plays after the cover
    thumb: 'thumb.jpg',      // home tile + skill card: the first shopping-cart photo (cover = the LOW KEY lettering one, inside the project)
    deliverables: {
      en: ['Content', 'Logo Design', 'Digital Art Direction', 'Visual Identity', 'Copywriting'],
      fr: ['Contenu', 'Création de logo', 'Direction artistique digitale', 'Identité visuelle', 'Rédaction'],
      pt: ['Conteúdo', 'Criação de logo', 'Direção de arte digital', 'Identidade visual', 'Redação'],
    },
    text: {
      en: [
        'Low Key is an independent editorial project created to explore the feelings, frustrations and experiences of being in your twenties. Designed for women and the LGBTQI+ community, the magazine combines personal reflections, advice, music playlists and film reviews with a visual language inspired by street culture and the nostalgia of physical magazines.',
        'The project deliberately moved away from minimalism. A colorful and expressive design system, combined with content created by friends and contributions from the community, turned Low Key into an open editorial space built around shared experiences and conversations.',
      ],
      fr: [
        'Low Key est un projet éditorial indépendant qui explore les sentiments, les frustrations et les expériences de la vingtaine. Pensé pour les femmes et la communauté LGBTQI+, le magazine mêle réflexions personnelles, conseils, playlists et critiques de films, avec un langage visuel inspiré de la culture de rue et de la nostalgie des magazines papier.',
        'Le projet tourne volontairement le dos au minimalisme. Un système graphique coloré et expressif, des contenus créés par des amis et des contributions de la communauté ont fait de Low Key un espace éditorial ouvert, construit autour d’expériences et de conversations partagées.',
      ],
      pt: [
        'Low Key é um projeto editorial independente criado para explorar os sentimentos, as frustrações e as experiências de ter vinte e poucos anos. Pensada para mulheres e para a comunidade LGBTQI+, a revista combina reflexões pessoais, conselhos, playlists e críticas de filmes com uma linguagem visual inspirada na cultura de rua e na nostalgia das revistas impressas.',
        'O projeto se afastou de propósito do minimalismo. Um sistema visual colorido e expressivo, somado a conteúdos criados por amigos e a contribuições da comunidade, transformou a Low Key em um espaço editorial aberto, construído em torno de experiências e conversas compartilhadas.',
      ],
    },
  },
  {
    id: 'mouv-festival',
    featured: true,          // shown in Selected work
    title: 'Mouv’ Festival',
    client: 'IA Coach',
    year: 2025,
    category: { en: 'Rebranding', fr: 'Rebranding', pt: 'Rebranding' },
    images: ['cover', 1, 2, 3, 4],
    deliverables: {
      en: ['Website Design', 'Framer Development', 'Copywriting', 'Art Direction'],
      fr: ['Design de site web', 'Développement Framer', 'Rédaction', 'Direction artistique'],
      pt: ['Design de site', 'Desenvolvimento em Framer', 'Redação', 'Direção de arte'],
    },
    text: {
      en: [
        'IA Coach is an AI powered sports coaching application introduced through a family focused sports festival. The main objective was to attract families with children and encourage them to attend the event, discover the application and connect with the concept of technology applied to sports.',
        'The visual direction combined colors associated with safety and dynamism with playful graphic elements inspired by the energy of music events. The campaign extended across social media, influencers, trusted blogs and newspapers, using multiple communication channels to build awareness and encourage attendance.',
      ],
      fr: [
        'IA Coach est une application de coaching sportif propulsée par l’IA, lancée à travers un festival de sport pensé pour les familles. L’objectif : attirer les familles avec enfants, les inciter à venir, à découvrir l’application et à adhérer à l’idée d’une technologie au service du sport.',
        'La direction visuelle associe des couleurs évoquant la sécurité et le dynamisme à des éléments graphiques ludiques, inspirés de l’énergie des événements musicaux. La campagne s’est déployée sur les réseaux sociaux, auprès d’influenceurs, de blogs de confiance et dans la presse, pour faire connaître l’événement et donner envie d’y venir.',
      ],
      pt: [
        'IA Coach é um aplicativo de treinamento esportivo com inteligência artificial, apresentado ao público em um festival de esportes voltado para famílias. O principal objetivo era atrair famílias com crianças, incentivá-las a ir ao evento, conhecer o aplicativo e se conectar com a ideia de tecnologia aplicada ao esporte.',
        'A direção visual combinou cores associadas à segurança e ao dinamismo com elementos gráficos lúdicos, inspirados na energia dos eventos de música. A campanha se estendeu pelas redes sociais, influenciadores, blogs de confiança e jornais, usando vários canais de comunicação para dar visibilidade ao evento e estimular a participação.',
      ],
    },
  },
  {
    id: 'maison-des-femmes',
    film: 'film.mp4',        // silent video, shown after the cover
    title: 'La Maison des femmes',
    client: 'La Maison des femmes Marseille Provence',
    year: '2024–25',
    category: { en: 'Social media', fr: 'Réseaux sociaux', pt: 'Redes sociais' },
    images: [],              // cover.jpg (team photo) is only the skill-page card, at the user's request (Nov 2026); the posts will be added here
    deliverables: {
      en: ['Editorial coordination', 'Content curation', 'Copywriting', 'Awareness campaigns', 'Social media'],
      fr: ['Coordination éditoriale', 'Veille et sélection', 'Rédaction', 'Campagnes de sensibilisation', 'Réseaux sociaux'],
      pt: ['Coordenação editorial', 'Curadoria de conteúdo', 'Redação', 'Campanhas de conscientização', 'Redes sociais'],
    },
    text: {
      en: [
        'In the middle of a chaotic period for women, I coordinated a monthly Instagram column for La Maison des femmes Marseille Provence, gathering good news about women’s rights from all over the world.',
        'The column showed the bright, positive side of the ongoing fight for women’s rights. It is now run by a press agency.',
        'As a volunteer in the communications team, I also created awareness campaigns, managed the editorial calendar and ran the social media accounts.',
      ],
      fr: [
        'En pleine période chaotique pour les femmes, j’ai coordonné pour La Maison des femmes Marseille Provence une rubrique Instagram mensuelle qui rassemblait les bonnes nouvelles du monde entier sur les droits des femmes.',
        'La rubrique montrait le côté lumineux et positif d’un combat qui continue. Elle est aujourd’hui coordonnée par une agence de presse.',
        'Bénévole au sein de l’équipe communication, j’ai aussi créé des campagnes de sensibilisation, géré le planning éditorial et animé les réseaux sociaux.',
      ],
      pt: [
        'Em um período caótico para as mulheres, coordenei uma coluna mensal no Instagram para La Maison des femmes Marseille Provence, reunindo boas notícias sobre os direitos das mulheres no mundo inteiro.',
        'A coluna mostrava o lado luminoso e positivo da luta pelos direitos das mulheres, que continua. Hoje, ela é conduzida por uma agência de imprensa.',
        'Como voluntária na equipe de comunicação, também criei campanhas de conscientização, gerenciei o calendário editorial e cuidei das redes sociais.',
      ],
    },
  },
  // Social Content, Nov 2026. Each one is a single video, the first thing on its page (hero.jpg is its poster).
  // On the skill page, card.mp4 loops the animation's reels part, cut from the user's black-background ("fond noir")
  // versions (cover.jpg = its poster, also shown with reduced motion). The project page's hero stays the colour film.
  // Year and texts are drafts written from the videos: to review.
  {
    id: 'mondial-relay',
    hero: 'hero.mp4',
    card: 'card.mp4',
    posts: 9,                // posts/01.jpg … 09.jpg, in a horizontal row with arrows
    title: 'Mondial Relay',
    client: 'Mondial Relay',
    year: 2026,
    category: { en: 'Social media', fr: 'Réseaux sociaux', pt: 'Redes sociais' },
    images: [],
    text: {
      en: ['Social media content for Mondial Relay: Instagram posts and carousels, stories, games and quizzes, and short street-interview videos.'],
      fr: ['Contenus social media pour Mondial Relay : posts et carrousels Instagram, stories, jeux et quiz, et vidéos courtes en micro-trottoir.'],
      pt: ['Conteúdo para as redes sociais da Mondial Relay: posts e carrosséis no Instagram, stories, jogos e quizzes, e vídeos curtos com entrevistas na rua.'],
    },
  },
  {
    id: 'innocent',
    hero: 'hero.mp4',
    card: 'card.mp4',
    posts: 13,               // two carousels: 01–07 journée de la gentillesse, 08–13 journée du micro-onde
    title: 'Innocent',
    client: 'Innocent',
    year: 2026,
    category: { en: 'Social media', fr: 'Réseaux sociaux', pt: 'Redes sociais' },
    images: [],
    text: {
      en: ['Social media content for Innocent: Instagram carousels for national days, stories and short videos filmed at the office and in the street.'],
      fr: ['Contenus social media pour Innocent : carrousels Instagram autour des journées nationales, stories et vidéos courtes tournées au bureau et dans la rue.'],
      pt: ['Conteúdo para as redes sociais da Innocent: carrosséis no Instagram sobre datas comemorativas, stories e vídeos curtos gravados no escritório e na rua.'],
    },
  },
  {
    id: 'vertbaudet',
    hero: 'hero.mp4',
    card: 'card.mp4',
    reels: 3,                // reels/01.mp4 Le Spam, 02 Le Portrait Robot, 03 Réunion Cadeaux (with sound, 01.jpg… = covers)
    title: 'Vertbaudet',
    client: 'Vertbaudet',
    year: 2026,
    category: { en: 'Social media', fr: 'Réseaux sociaux', pt: 'Redes sociais' },
    images: [],
    text: {
      en: ['Le Numéro Vertbaudet, a Christmas campaign for social media: short vertical videos around a hotline that helps find the right gift, with family video calls and group chats.'],
      fr: ['Le Numéro Vertbaudet, une campagne de Noël pour les réseaux sociaux : des vidéos verticales autour d’une ligne qui aide à trouver le bon cadeau, entre appels vidéo en famille et discussions de groupe.'],
      pt: ['Le Numéro Vertbaudet, uma campanha de Natal para as redes sociais: vídeos verticais em torno de uma central que ajuda a escolher o presente certo, com chamadas de vídeo em família e conversas em grupo.'],
    },
  },
  {
    id: 'motion-2026',
    title: 'Motion Design',
    year: 2026,
    category: { en: 'Digital animation', fr: 'Animation digitale', pt: 'Animação digital' },
    video: 'loop.mp4',
    images: ['cover'],
    text: {
      en: ['A music project created to present a curated playlist through visual experimentation with color, shape, movement and composition.'],
      fr: ['Un projet musical pensé pour présenter une playlist choisie avec soin, à travers une expérimentation visuelle sur la couleur, la forme, le mouvement et la composition.'],
      pt: ['Um projeto musical criado para apresentar uma playlist escolhida a dedo, por meio de experimentações visuais com cor, forma, movimento e composição.'],
    },
  },
  {
    id: 'bloom-n-root',
    title: 'Bloom n’Root',
    year: 2026,
    category: { en: 'Logo animation', fr: 'Animation de logo', pt: 'Animação de logo' },
    video: 'loop.mp4',
    images: ['cover'],
    text: {
      en: ['This motion design project introduces a new visual identity. The animation walks through the logo’s story, its color palette and its different variations, bringing each element to life. Animating a logo is a simple, playful way to present a new project and make a lasting first impression.'],
      fr: ['Ce projet de motion design présente une nouvelle identité visuelle. L’animation retrace l’histoire du logo, sa palette de couleurs et ses différentes déclinaisons, en donnant vie à chaque élément. Animer un logo est une façon simple et ludique de présenter un nouveau projet et de marquer les esprits dès le premier regard.'],
      pt: ['Este projeto de motion design apresenta uma nova identidade visual. A animação percorre a história do logo, sua paleta de cores e suas diferentes variações, dando vida a cada elemento. Animar um logo é uma forma simples e divertida de apresentar um novo projeto e causar uma primeira impressão marcante.'],
    },
  },
  {
    id: 'motion-366',
    title: 'Motion Design',
    client: '366',
    year: 2025,
    category: { en: 'Motion design', fr: 'Motion design', pt: 'Motion design' },
    video: 'loop.mp4',
    images: ['cover'],
    text: {
      en: ['This motion design project was created to celebrate a milestone: 366 being awarded its label. Shared on the company’s social media channels, the animation explains the importance of the certification and walks viewers through how it works in a clear and engaging way.'],
      fr: ['Ce projet de motion design a été créé pour célébrer une étape importante : l’obtention de son label par 366. Diffusée sur les réseaux sociaux de l’entreprise, l’animation explique l’importance de cette certification et en présente le fonctionnement de façon claire et engageante.'],
      pt: ['Este projeto de motion design foi criado para celebrar um marco: a conquista do selo pela 366. Publicada nas redes sociais da empresa, a animação explica a importância da certificação e mostra como ela funciona de forma clara e envolvente.'],
    },
  },
];

/* Skills: each one gets its own page (skill.html?s=<id>) listing these projects.
   name = key in i18n.js. Intros are short starter lines to review. */
window.SKILLS = [
  {
    id: 'brand-identity',
    name: 'skill.brand',
    projects: ['bubble-brew', 'livia-zeffa'],
    intro: {
      en: 'Logos, visual identities and the systems that make a brand recognisable.',
      fr: 'Logos, identités visuelles et systèmes qui rendent une marque reconnaissable.',
      pt: 'Logos, identidades visuais e os sistemas que tornam uma marca reconhecível.',
    },
  },
  {
    id: 'art-direction',
    name: 'skill.direction',
    projects: ['low-key', 'mouv-festival'],
    intro: {
      en: 'Visual direction for magazines, campaigns and events, from the idea to the final image.',
      fr: 'Direction visuelle de magazines, campagnes et événements, de l’idée à l’image finale.',
      pt: 'Direção visual de revistas, campanhas e eventos, da ideia à imagem final.',
    },
  },
  {
    id: 'motion-design',
    name: 'skill.motion',
    projects: ['motion-2026', 'motion-366', 'bloom-n-root'],
    intro: {
      en: 'Animation as a way to tell a story: timing, rhythm and movement.',
      fr: 'L’animation pour raconter une histoire : timing, rythme et mouvement.',
      pt: 'A animação como forma de contar uma história: timing, ritmo e movimento.',
    },
  },
  {
    id: 'social-content',
    name: 'skill.social',
    projects: ['mondial-relay', 'innocent', 'vertbaudet', 'livia-zeffa', 'mouv-festival', 'maison-des-femmes'],
    intro: {
      en: 'Content and strategy for social media: formats, tone and consistency across platforms.',
      fr: 'Contenus et stratégie pour les réseaux sociaux : formats, ton et cohérence d’une plateforme à l’autre.',
      pt: 'Conteúdo e estratégia para redes sociais: formatos, tom e consistência entre as plataformas.',
    },
  },
];
