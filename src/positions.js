/**
 * Toiles — « planète en signe » : 9 astres × 12 signes = 108 combinaisons.
 *
 * Pour chaque combinaison :
 *   1. un texte rédigé (le quoi de la planète, coloré par le comment du signe) ;
 *   2. la dignité, CALCULÉE (domicile, exaltation, exil, chute, neutre) ;
 *   3. en secours, un texte assemblé automatiquement si le texte rédigé manque.
 *
 * Dépend de : src/astres.js (SIGNES, ASTRES) et src/glossaire.js (mots-clés).
 * Doit donc être chargé après eux dans index.html.
 *
 * Pour réécrire un texte : modifier la ligne voulue dans TEXTES ci-dessous.
 * Pour en faire un toi-même de zéro : vide la ligne (null) et l'assemblage prend le relais.
 */
(function (T) {
  'use strict';

  // Ordre des signes, identique à Toiles.astres.SIGNES.
  const ORDRE = ['belier', 'taureau', 'gemeaux', 'cancer', 'lion', 'vierge',
                 'balance', 'scorpion', 'sagittaire', 'capricorne', 'verseau', 'poissons'];

  // ===================== 1. Textes rédigés =====================
  //
  // Format de chaque ligne : [ texte, revers, mots-clés séparés par des virgules ]
  // Uranus et Neptune restent des années dans un signe : leur lecture concerne
  // surtout une génération, d'où la mention « (génération) ».
  //
  // Règles de rédaction (relecture v0.3, vérifiées par un test dans tests/tests.js) :
  //   - texte : « Verbe de la planète + manière du signe : précision. » — une phrase,
  //     110 caractères au plus, terminée par un point. Chaque planète garde son verbe
  //     (Soleil « Être soi… », Lune « Besoin de… », Mercure « Penser… », Vénus « Aimer… »,
  //     Mars « Agir… », Jupiter « Grandir… », Uranus « Révolution… », Neptune « Rêver… ») ;
  //   - revers : le côté excessif ou bloqué, jamais un mot déjà donné en mot-clé ;
  //   - mots-clés : exactement trois ;
  //   - apostrophe typographique ’ (et non ') partout.

  const TEXTES = {
    soleil: {
      belier:     ['Être soi en agissant : une identité pionnière, directe, qui brille en ouvrant la voie.', 'impatience, égocentrisme', 'initiative, courage, spontanéité'],
      taureau:    ['Être soi en construisant : une identité calme, sensuelle, qui brille par la constance.', 'entêtement, attachement au confort', 'stabilité, sens, persévérance'],
      gemeaux:    ['Être soi en échangeant : une identité curieuse, vive, qui brille par l’esprit.', 'dispersion, superficialité', 'curiosité, communication, adaptabilité'],
      cancer:     ['Être soi en protégeant : une identité sensible, tournée vers les siens et les racines.', 'repli, susceptibilité', 'famille, mémoire, soin'],
      lion:       ['Être soi pleinement : une identité rayonnante, généreuse, faite pour créer et être vue.', 'orgueil, besoin d’admiration', 'rayonnement, création, générosité'],
      vierge:     ['Être soi en étant utile : une identité précise, modeste, qui brille par le travail bien fait.', 'perfectionnisme, critique', 'méthode, service, discernement'],
      balance:    ['Être soi à travers l’autre : une identité diplomate, élégante, en quête d’équilibre.', 'indécision, dépendance au regard des autres', 'relation, harmonie, justice'],
      scorpion:   ['Être soi en profondeur : une identité intense, magnétique, qui se transforme par les crises.', 'jalousie, besoin de contrôle', 'intensité, transformation, vérité'],
      sagittaire: ['Être soi en élargissant : une identité enthousiaste, qui cherche le sens et l’horizon.', 'excès, dogmatisme', 'aventure, foi, sagesse'],
      capricorne: ['Être soi en bâtissant : une identité sérieuse, ambitieuse, qui brille avec le temps.', 'dureté, froideur', 'ambition, rigueur, endurance'],
      verseau:    ['Être soi en restant libre : une identité originale, tournée vers le collectif et l’avenir.', 'détachement, esprit de contradiction', 'liberté, amitié, innovation'],
      poissons:   ['Être soi en se fondant : une identité sensible, intuitive, ouverte à l’invisible.', 'fuite, confusion', 'compassion, imaginaire, intuition'],
    },
    lune: {
      belier:     ['Besoin d’agir pour se sentir bien : des émotions vives, immédiates, vite oubliées.', 'impatience, colère soudaine', 'spontanéité, élan, franchise'],
      taureau:    ['Besoin de sécurité et de confort : des émotions calmes, fidèles, apaisées par les sens.', 'possessivité, inertie', 'stabilité, douceur, fidélité'],
      gemeaux:    ['Besoin de parler et de bouger : des émotions changeantes, apaisées par l’échange.', 'nervosité, instabilité', 'dialogue, curiosité, légèreté'],
      cancer:     ['Besoin d’un nid : des émotions profondes, protectrices, très liées au foyer.', 'hypersensibilité, repli', 'tendresse, famille, intuition'],
      lion:       ['Besoin d’être aimé et reconnu : des émotions chaleureuses, généreuses, démonstratives.', 'dramatisation, fierté blessée', 'chaleur, générosité, expression'],
      vierge:     ['Besoin d’ordre et d’utilité : des émotions pudiques, apaisées en rendant service.', 'inquiétude, autocritique', 'soin, routine, discrétion'],
      balance:    ['Besoin d’harmonie et de lien : des émotions apaisées par la beauté et la vie à deux.', 'dépendance, évitement des conflits', 'douceur, partage, élégance'],
      scorpion:   ['Besoin d’intensité et de vérité : des émotions profondes, secrètes, entières.', 'jalousie, rancune', 'passion, fidélité, profondeur'],
      sagittaire: ['Besoin d’espace et de sens : des émotions optimistes, apaisées par le mouvement.', 'fuite, promesses excessives', 'optimisme, liberté, enthousiasme'],
      capricorne: ['Besoin de maîtrise : des émotions retenues, exprimées par la responsabilité.', 'froideur, solitude', 'pudeur, loyauté, sérieux'],
      verseau:    ['Besoin de liberté et d’amitié : des émotions mises à distance, partagées en groupe.', 'détachement, imprévisibilité', 'indépendance, amitié, originalité'],
      poissons:   ['Besoin de fusion et de rêve : des émotions poreuses, empathiques, sans frontières.', 'confusion, fuite', 'empathie, sensibilité, imagination'],
    },
    mercure: {
      belier:     ['Penser vite, parler franc : un esprit direct, réactif, qui tranche.', 'paroles impulsives, impatience', 'franchise, rapidité, décision'],
      taureau:    ['Penser lentement mais sûrement : un esprit concret, réfléchi, difficile à faire changer d’avis.', 'lenteur, obstination', 'bon sens, patience, concret'],
      gemeaux:    ['Penser en réseau : un esprit agile, curieux, doué pour les mots et les échanges.', 'dispersion, bavardage', 'agilité, curiosité, éloquence'],
      cancer:     ['Penser avec le cœur : un esprit intuitif, imagé, à la mémoire forte.', 'subjectivité, susceptibilité', 'mémoire, intuition, écoute'],
      lion:       ['Penser pour convaincre : un esprit créatif, assuré, qui aime briller par la parole.', 'ton autoritaire, refus de la contradiction', 'conviction, créativité, éloquence'],
      vierge:     ['Penser avec précision : un esprit analytique, méthodique, attentif au détail.', 'pinaillage, anxiété', 'analyse, méthode, précision'],
      balance:    ['Penser en pesant le pour et le contre : un esprit diplomate, nuancé, sociable.', 'indécision, complaisance', 'nuance, diplomatie, dialogue'],
      scorpion:   ['Penser en creusant : un esprit pénétrant, stratégique, qui cherche ce qui est caché.', 'soupçon, paroles blessantes', 'perspicacité, stratégie, profondeur'],
      sagittaire: ['Penser large : un esprit enthousiaste, tourné vers les idées et le sens plus que vers les détails.', 'approximation, ton de prêcheur', 'vision, enthousiasme, philosophie'],
      capricorne: ['Penser utile : un esprit structuré, réaliste, orienté vers les objectifs.', 'pessimisme, rigidité', 'rigueur, planification, réalisme'],
      verseau:    ['Penser autrement : un esprit original, logique, en avance sur son temps.', 'froideur intellectuelle, esprit de contradiction', 'originalité, logique, innovation'],
      poissons:   ['Penser en images : un esprit intuitif, poétique, qui saisit sans raisonner.', 'confusion, oublis', 'intuition, imagination, poésie'],
    },
    venus: {
      belier:     ['Aimer en conquérant : un désir direct, passionné, qui s’enflamme vite.', 'impatience, lassitude rapide', 'passion, spontanéité, audace'],
      taureau:    ['Aimer par les sens : une affection fidèle, sensuelle, qui goûte le temps long.', 'possessivité, matérialisme', 'sensualité, fidélité, plaisir'],
      gemeaux:    ['Aimer par l’esprit : une séduction légère, joueuse, nourrie de conversation.', 'inconstance, superficialité', 'légèreté, humour, échange'],
      cancer:     ['Aimer en protégeant : une affection tendre, attachée, tournée vers le foyer.', 'dépendance affective, susceptibilité', 'tendresse, attachement, douceur'],
      lion:       ['Aimer avec éclat : une affection généreuse, démonstrative, qui aime être admirée.', 'besoin d’admiration, vanité blessée', 'générosité, romantisme, éclat'],
      vierge:     ['Aimer en prenant soin : une affection discrète, attentive, qui se prouve par les gestes.', 'exigence, pudeur excessive', 'attention, fidélité, simplicité'],
      balance:    ['Aimer en harmonie : une affection élégante, raffinée, faite pour la vie à deux.', 'dépendance au couple, évitement des conflits', 'harmonie, élégance, partenariat'],
      scorpion:   ['Aimer intensément : une affection passionnée, exclusive, qui veut tout ou rien.', 'jalousie, possessivité', 'passion, intensité, loyauté'],
      sagittaire: ['Aimer en liberté : une affection enthousiaste, aventureuse, qui cherche à partager un sens.', 'peur de l’engagement, excès', 'aventure, générosité, liberté'],
      capricorne: ['Aimer avec sérieux : une affection lente à se montrer, mais solide et engagée.', 'froideur, calcul', 'engagement, loyauté, durée'],
      verseau:    ['Aimer en ami : une affection libre, originale, qui respecte l’indépendance.', 'distance, imprévisibilité', 'amitié, liberté, originalité'],
      poissons:   ['Aimer sans limites : une affection romantique, dévouée, presque inconditionnelle.', 'idéalisation, sacrifice de soi', 'romantisme, compassion, dévouement'],
    },
    mars: {
      belier:     ['Agir sans attendre : une énergie directe, courageuse, faite pour démarrer.', 'impulsivité, colère vive', 'courage, élan, initiative'],
      taureau:    ['Agir lentement mais sans lâcher : une énergie endurante, tenace, tournée vers le concret.', 'entêtement, colère lente mais forte', 'endurance, ténacité, constance'],
      gemeaux:    ['Agir par la parole et l’idée : une énergie vive, multiple, qui aime le débat.', 'dispersion, joutes verbales', 'débat, agilité, polyvalence'],
      cancer:     ['Agir pour protéger : une énergie émotive, défensive, très forte quand il s’agit des siens.', 'rancune, colère rentrée', 'protection, ténacité, instinct'],
      lion:       ['Agir avec panache : une énergie chaleureuse, fière, qui se bat pour ce qui lui tient à cœur.', 'orgueil, colère quand on se sent ignoré', 'leadership, courage, élan créatif'],
      vierge:     ['Agir avec méthode : une énergie précise, efficace, mise au service d’un travail bien fait.', 'nervosité, critique', 'efficacité, méthode, service'],
      balance:    ['Agir en cherchant l’accord : une énergie diplomate, qui hésite à affronter.', 'indécision, agressivité passive', 'diplomatie, négociation, équité'],
      scorpion:   ['Agir en profondeur : une énergie stratégique, intense, qui ne renonce jamais.', 'vengeance, contrôle', 'détermination, stratégie, intensité'],
      sagittaire: ['Agir pour une cause : une énergie enthousiaste, aventureuse, portée par un idéal.', 'excès, imprudence', 'enthousiasme, aventure, conviction'],
      capricorne: ['Agir avec discipline : une énergie maîtrisée, ambitieuse, efficace sur la durée.', 'dureté, ambition froide', 'discipline, ambition, endurance'],
      verseau:    ['Agir pour changer les choses : une énergie indépendante, rebelle, tournée vers le collectif.', 'rébellion gratuite, froideur', 'indépendance, innovation, engagement'],
      poissons:   ['Agir par intuition : une énergie fluctuante, compatissante, qui se dépense pour les autres.', 'manque de direction, fuite', 'intuition, dévouement, souplesse'],
    },
    jupiter: {
      belier:     ['Grandir en osant : une confiance pionnière, de la chance dans l’initiative.', 'témérité, impatience', 'audace, initiative, confiance'],
      taureau:    ['Grandir en accumulant : une prospérité matérielle, de la chance par la patience.', 'excès de confort, gourmandise', 'prospérité, patience, plaisir'],
      gemeaux:    ['Grandir en apprenant : de la chance par les contacts, les idées, les échanges.', 'dispersion, savoir superficiel', 'curiosité, réseau, apprentissage'],
      cancer:     ['Grandir en protégeant : une générosité familiale, de la chance par les liens du cœur.', 'surprotection, nostalgie', 'générosité, famille, bienveillance'],
      lion:       ['Grandir en rayonnant : une confiance généreuse, de la chance par la création et la joie.', 'vanité, démesure', 'générosité, création, joie'],
      vierge:     ['Grandir pas à pas : une expansion modeste, qui passe par le travail soigné, le service, la santé.', 'critique, souci excessif', 'service, méthode, amélioration'],
      balance:    ['Grandir à deux : de la chance par les associations, la diplomatie, l’art.', 'dépendance, complaisance', 'partenariat, justice, harmonie'],
      scorpion:   ['Grandir par la transformation : de la chance dans les crises et les ressources partagées.', 'excès, emprise', 'transformation, profondeur, régénération'],
      sagittaire: ['Grandir en élargissant : la foi, les voyages, les études ouvrent des portes.', 'dogmatisme, excès', 'foi, voyage, sagesse'],
      capricorne: ['Grandir avec prudence : une expansion lente, méritée, construite étape par étape.', 'pessimisme, frein', 'prudence, mérite, structure'],
      verseau:    ['Grandir ensemble : de la chance par les amis, les groupes, les idées nouvelles.', 'utopie, dispersion', 'amitié, progrès, humanisme'],
      poissons:   ['Grandir par la foi : une générosité spirituelle, de la compassion, de la chance par l’intuition.', 'naïveté, fuite', 'compassion, spiritualité, foi'],
    },
    saturne: {
      belier:     ['Apprendre à agir avec patience : l’élan est freiné, l’initiative doit mûrir.', 'frustration, impatience contenue', 'patience, maîtrise, courage'],
      taureau:    ['Construire une sécurité durable : de la rigueur avec l’argent, les biens, le corps.', 'avarice, peur du manque', 'sécurité, endurance, prudence'],
      gemeaux:    ['Structurer la pensée : apprendre avec sérieux, parler avec mesure.', 'doute, blocages de communication', 'rigueur, concentration, sérieux'],
      cancer:     ['Apprendre la sécurité intérieure : des responsabilités familiales, des émotions à structurer.', 'froideur affective, repli', 'responsabilité, famille, maturité'],
      lion:       ['Apprendre à briller sans orgueil : une créativité exigeante, une reconnaissance méritée.', 'peur du jugement, rigidité', 'autorité, discipline, mérite'],
      vierge:     ['Perfectionner : le sens du devoir, du travail précis, de la santé.', 'anxiété, perfectionnisme', 'rigueur, devoir, méthode'],
      balance:    ['Structurer les relations : des engagements sérieux, un sens aigu de la justice.', 'relations froides, peur de l’engagement', 'justice, engagement, équilibre'],
      scorpion:   ['Affronter ses peurs profondes : de l’endurance face aux crises, la maîtrise de soi.', 'contrôle, méfiance', 'endurance, maîtrise, transformation'],
      sagittaire: ['Structurer ses croyances : une sagesse acquise, un enseignement sérieux.', 'dogmatisme, désillusion', 'sagesse, éthique, enseignement'],
      capricorne: ['Bâtir pour durer : une ambition patiente, une autorité naturelle.', 'dureté, pessimisme', 'ambition, structure, persévérance'],
      verseau:    ['Structurer le collectif : des réformes, des responsabilités dans les groupes.', 'rigidité idéologique, isolement', 'réforme, responsabilité, vision'],
      poissons:   ['Donner une forme au rêve : une discipline spirituelle, des limites à poser à l’empathie.', 'angoisse diffuse, fuite', 'discipline, compassion, foi'],
    },
    uranus: {
      belier:     ['Révolution par l’action : innovations audacieuses, ruptures soudaines (génération).', 'imprudence, chocs', 'audace, esprit pionnier, rupture'],
      taureau:    ['Révolution dans la matière : bouleversements de l’argent, de la terre, des valeurs (génération).', 'instabilité financière, résistance au changement', 'argent, écologie, changement'],
      gemeaux:    ['Révolution des idées : nouvelles technologies de l’échange et du déplacement (génération).', 'agitation, dispersion', 'communication, technologie, mobilité'],
      cancer:     ['Révolution du foyer : nouvelles formes de famille et d’habitat (génération).', 'instabilité familiale', 'famille, foyer, renouveau'],
      lion:       ['Révolution de l’expression : créativité libre, rapport à l’ego bousculé (génération).', 'excentricité, autoritarisme', 'créativité, individualité, rébellion'],
      vierge:     ['Révolution du travail et de la santé : nouvelles méthodes, nouvelles techniques (génération).', 'nervosité, critique', 'santé, travail, technique'],
      balance:    ['Révolution des relations : nouvelles formes de couple et de justice (génération).', 'instabilité des liens', 'couple, justice, liberté'],
      scorpion:   ['Révolution des profondeurs : tabous qui tombent, transformations radicales (génération).', 'destruction, extrêmes', 'transformation, tabous, crise'],
      sagittaire: ['Révolution des croyances : nouvelles visions du monde, du voyage, du savoir (génération).', 'fanatisme, excès', 'vision, liberté, savoir'],
      capricorne: ['Révolution des structures : institutions et autorités remises en cause (génération).', 'effondrements, rigidité', 'réforme, institutions, autorité'],
      verseau:    ['Révolution collective : progrès, réseaux, idéaux partagés (génération).', 'utopie froide', 'progrès, réseaux, liberté'],
      poissons:   ['Révolution spirituelle : intuitions collectives, frontières qui se dissolvent (génération).', 'confusion, illusions', 'spiritualité, intuition, idéal'],
    },
    neptune: {
      belier:     ['Rêver d’un nouveau départ : un idéal d’héroïsme et de renouveau (génération).', 'illusion d’invincibilité', 'renouveau, idéal, élan'],
      taureau:    ['Rêver de beauté et de nature : la terre, l’argent, les sens idéalisés (génération).', 'illusions matérielles', 'beauté, nature, sensibilité'],
      gemeaux:    ['Rêver par les mots : un imaginaire de la communication et des médias (génération).', 'rumeurs, confusion', 'imagination, médias, poésie'],
      cancer:     ['Rêver du foyer idéal : nostalgie, patrie, famille idéalisée (génération).', 'nostalgie, fusion familiale', 'patrie, famille, compassion'],
      lion:       ['Rêver de gloire : un idéal de création, de spectacle, de héros (génération).', 'idolâtrie, illusion de grandeur', 'création, spectacle, idéal'],
      vierge:     ['Rêver de pureté et de service : un idéal de santé, de soin, de travail juste (génération).', 'anxiété diffuse, désillusion', 'service, soin, pureté'],
      balance:    ['Rêver de l’amour idéal : un idéal de paix et d’harmonie (génération).', 'couple idéalisé', 'paix, amour, harmonie'],
      scorpion:   ['Rêver des profondeurs : l’attrait du mystère, de l’occulte, de la transformation (génération).', 'excès, dépendances', 'mystère, intensité, transformation'],
      sagittaire: ['Rêver d’ailleurs : un idéal spirituel, des voyages, une quête de sens (génération).', 'fanatisme, fuite', 'spiritualité, voyage, sens'],
      capricorne: ['Rêver de structures justes : des institutions idéalisées, puis la désillusion (génération).', 'désillusion, cynisme', 'réalisme, institutions, idéal'],
      verseau:    ['Rêver d’un monde uni : un idéal collectif, des technologies, des utopies (génération).', 'utopie, dispersion', 'fraternité, réseau, humanité'],
      poissons:   ['Rêver sans limites : spiritualité, art, compassion universelle (génération).', 'confusion, évasion', 'spiritualité, art, compassion'],
    },
  };

  // ===================== 2. Dignités =====================
  //
  // Notion classique : selon le signe, une planète est plus ou moins à l'aise.
  //   domicile   : le signe qu'elle gouverne ; elle s'y exprime librement
  //   exaltation : le signe où elle donne le meilleur d'elle-même
  //   exil       : le signe opposé au domicile ; son énergie est freinée
  //   chute      : le signe opposé à l'exaltation ; elle peine à s'exprimer
  // Uranus et Neptune n'existaient pas dans l'astrologie classique : leurs
  // dignités sont modernes, et l'exaltation de Neptune est débattue.

  const DIGNITES = {
    soleil:  { domicile: ['lion'], exaltation: ['belier'], exil: ['verseau'], chute: ['balance'] },
    lune:    { domicile: ['cancer'], exaltation: ['taureau'], exil: ['capricorne'], chute: ['scorpion'] },
    mercure: { domicile: ['gemeaux', 'vierge'], exaltation: ['vierge'], exil: ['sagittaire', 'poissons'], chute: ['poissons'] },
    venus:   { domicile: ['taureau', 'balance'], exaltation: ['poissons'], exil: ['scorpion', 'belier'], chute: ['vierge'] },
    mars:    { domicile: ['belier', 'scorpion'], exaltation: ['capricorne'], exil: ['balance', 'taureau'], chute: ['cancer'] },
    jupiter: { domicile: ['sagittaire', 'poissons'], exaltation: ['cancer'], exil: ['gemeaux', 'vierge'], chute: ['capricorne'] },
    saturne: { domicile: ['capricorne', 'verseau'], exaltation: ['balance'], exil: ['cancer', 'lion'], chute: ['belier'] },
    uranus:  { domicile: ['verseau'], exaltation: ['scorpion'], exil: ['lion'], chute: ['taureau'], moderne: true },
    neptune: { domicile: ['poissons'], exaltation: ['cancer'], exil: ['vierge'], chute: ['capricorne'], moderne: true },
  };

  // La Lune et Vénus sont féminines en français : « chez elle », « exaltée ».
  const FEMININ = ['lune', 'venus'];

  // Article de chaque signe, pour écrire « le Lion », « la Balance », « les Gémeaux ».
  const ARTICLE = { vierge: 'la', balance: 'la', gemeaux: 'les', poissons: 'les' };
  /** « le Lion » / « la Balance » / « les Gémeaux » */
  const avecArticle = (cle, nom) => `${ARTICLE[cle] || 'le'} ${nom}`;
  /** « du Lion » / « de la Balance » / « des Gémeaux » */
  const duSigne = (cle, nom) => ({ le: 'du', la: 'de la', les: 'des' })[ARTICLE[cle] || 'le'] + ' ' + nom;

  /**
   * Dignité d'un astre dans un signe.
   * Renvoie { etats: ['domicile', …], libelle: 'chez lui', explication: '…' }.
   */
  function dignite(astre, signe) {
    const d = DIGNITES[astre];
    // « Le Soleil », « La Lune », mais « Mars », « Vénus » (sans article).
    const P = ({ soleil: 'Le ', lune: 'La ' }[astre] || '') + T.astres.ASTRES[astre].nom;
    const S = T.astres.SIGNES[ORDRE.indexOf(signe)];
    const f = FEMININ.includes(astre);
    const e = (masc, fem) => (f ? fem : masc);

    const etats = ['domicile', 'exaltation', 'exil', 'chute'].filter((k) => d[k].includes(signe));
    const phrases = {
      domicile:   `${P} est ${e('chez lui', 'chez elle')} en ${S.nom} : son énergie s’exprime librement, naturellement.`,
      exaltation: `${P} est ${e('exalté', 'exaltée')} en ${S.nom} : son énergie y donne le meilleur d’elle-même.`,
      exil:       `${P} est en exil en ${S.nom}, le signe opposé à son domicile : son énergie est freinée et doit s’adapter.`,
      chute:      `${P} est en chute en ${S.nom}, le signe opposé à son exaltation : son énergie peine à s’exprimer.`,
    };
    const libelles = { domicile: e('chez lui', 'chez elle'), exaltation: e('exalté', 'exaltée'), exil: 'en exil', chute: 'en chute' };
    const note = d.moderne ? ' (Attribution moderne.)' : '';

    if (etats.length) {
      return {
        etats,
        libelle: etats.map((k) => libelles[k]).join(' et '),
        explication: etats.map((k) => phrases[k]).join(' ') + note,
      };
    }

    // Neutre : on regarde si le signe partage l'élément d'un domicile (terrain familier).
    const cleAffin = d.domicile.find((s) => T.astres.SIGNES[ORDRE.indexOf(s)].element === S.element);
    if (cleAffin) {
      const A2 = T.astres.SIGNES[ORDRE.indexOf(cleAffin)];
      const sujet = avecArticle(signe, S.nom);
      return {
        etats: ['neutre'],
        libelle: 'neutre, à l’aise',
        explication: `${P} n’a ni domicile ni chute en ${S.nom} : ${e('il', 'elle')} y est neutre. Mais ${sujet} ${ARTICLE[signe] === 'les' ? 'sont' : 'est'} un signe ${/^[aeiou]/.test(S.element) ? 'd’' : 'de '}${S.element}, comme ${avecArticle(cleAffin, A2.nom)}, son domicile : un terrain naturel.${note}`,
      };
    }
    return {
      etats: ['neutre'],
      libelle: 'neutre',
      explication: `${P} n’a pas de dignité particulière en ${S.nom} : son expression dépend surtout des aspects qu’${e('il', 'elle')} reçoit.${note}`,
    };
  }

  // ===================== 3. Assemblage de secours =====================

  /** Texte construit à partir du glossaire si la combinaison n'est pas rédigée. */
  function assembler(astre, signe) {
    const g = T.glossaire;
    const P = g[astre], S = g[signe];
    const quoi = (P.motsCles || []).join(', ');
    const comment = (S.motsCles || []).join(', ');
    return {
      texte: `${T.astres.ASTRES[astre].nom} (${quoi}) s’exprime sur le mode ${duSigne(signe, S.titre.replace(/^\S+\s/, ''))} : ${comment}.`,
      revers: null,
      motsCles: [...(P.motsCles || []).slice(0, 2), ...(S.motsCles || []).slice(0, 2)],
      assemble: true,
    };
  }

  // ===================== 4. Accès =====================

  /**
   * Lecture complète d'une planète dans un signe.
   * astre : 'mars' ; signe : 'lion' (clé) ou index 0–11.
   */
  function lire(astre, signe) {
    if (typeof signe === 'number') signe = ORDRE[signe];
    const ligne = TEXTES[astre] && TEXTES[astre][signe];
    const base = ligne
      ? { texte: ligne[0], revers: ligne[1], motsCles: ligne[2].split(',').map((s) => s.trim()), assemble: false }
      : assembler(astre, signe);
    return { astre, signe, ...base, dignite: dignite(astre, signe) };
  }

  T.positions = { lire, dignite, ORDRE, TEXTES, DIGNITES };
})(globalThis.Toiles = globalThis.Toiles || {});
