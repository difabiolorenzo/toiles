/**
 * Toiles — glossaire.
 *
 * Un seul endroit pour définir chaque terme : nombres, planètes, signes, aspects,
 * éléments, modes, symboles (℞…), notions de numérologie.
 * Il sert :
 *   - aux infobulles des termes dans la page (attribut data-glossaire="cle") ;
 *   - aux fiches complètes (src/fiches.js assemble, src/app.js affiche) ;
 *   - au sens des nombres de la vue Aujourd'hui (Toiles.numerologie.interpreter lit ici).
 *
 * Format d'une entrée :
 *   categorie : 'nombre' | 'astre' | 'signe' | 'aspect' | 'notion' (sert au filtre des fiches)
 *   titre     : nom affiché (avec son symbole s'il en a un)
 *   court     : définition en une phrase
 *   detail    : (optionnel) une ou deux phrases de plus
 *   motsCles  : (optionnel) liste de mots-clés à retenir
 * Pour les nombres, astres, signes et aspects, en plus :
 *   lumiere   : le côté positif, quand l'énergie est bien vécue
 *   ombre     : le revers, quand elle est excessive ou bloquée
 *   domaines  : une phrase pour chacun des 6 domaines de Toiles
 *               (essence, amour, travail, finances, sante, spiritualite)
 * Pour les signes : maitres = clés des planètes qui gouvernent le signe
 *   (doit correspondre aux domiciles de src/positions.js ; un test le vérifie).
 * Pour les nombres : mot = le mot-clé affiché à côté du nombre dans la vue Aujourd'hui.
 *
 * Fichier .js (pas .json) : en double-clic (file://), le navigateur interdit fetch().
 * Tu peux ajouter ou réécrire des entrées librement ; la clé (à gauche) ne doit
 * pas changer, c'est elle que le code utilise.
 */
(function (T) {
  'use strict';

  T.glossaire = {
    // =====================================================================
    //  NOMBRES (numérologie pythagoricienne)
    //  Clé : "nombre" + valeur (nombre1 … nombre9, nombre11, nombre22, nombre33).
    //  Ces textes étaient dans src/numerologie.js (SENS) jusqu'à la v0.2.
    // =====================================================================
    nombre1: {
      categorie: 'nombre', titre: '1 — Initiative', mot: 'Initiative',
      court: 'Le nombre des commencements : affirmation, élan, volonté propre.',
      lumiere: 'Courage, autonomie, esprit pionnier.',
      ombre: 'Égoïsme, impatience, autoritarisme.',
      motsCles: ['départ', 'volonté', 'indépendance'],
      domaines: {
        essence: 'Commencement, affirmation, élan.',
        amour: 'Oser exprimer ses désirs, prendre les devants.',
        travail: 'Lancer un projet, décider seul·e.',
        finances: 'Investir dans du neuf, avec prudence.',
        sante: 'Énergie haute, attention à l’impatience.',
        spiritualite: 'Retrouver sa volonté propre.',
      },
    },
    nombre2: {
      categorie: 'nombre', titre: '2 — Coopération', mot: 'Coopération',
      court: 'Le nombre de l’autre : accueil, écoute, association.',
      lumiere: 'Écoute, tact, sens de la collaboration.',
      ombre: 'Dépendance, indécision, hypersensibilité.',
      motsCles: ['écoute', 'patience', 'partenariat'],
      domaines: {
        essence: 'Accueil, écoute, dualité.',
        amour: 'Tendresse, compromis, sensibilité accrue.',
        travail: 'Travail d’équipe, diplomatie, patience.',
        finances: 'Associations, éviter les décisions seules.',
        sante: 'Émotions à ménager, besoin de calme.',
        spiritualite: 'Intuition, réceptivité.',
      },
    },
    nombre3: {
      categorie: 'nombre', titre: '3 — Expression', mot: 'Expression',
      court: 'Le nombre de la création : parole, joie, sociabilité.',
      lumiere: 'Joie, créativité, aisance à communiquer.',
      ombre: 'Dispersion, superficialité, bavardage.',
      motsCles: ['créer', 'communiquer', 'partager'],
      domaines: {
        essence: 'Créativité, communication, joie.',
        amour: 'Légèreté, séduction, sorties.',
        travail: 'Communiquer, présenter, créer.',
        finances: 'Dépenses plaisir à surveiller.',
        sante: 'Vitalité, attention à la dispersion.',
        spiritualite: 'Créer comme prière.',
      },
    },
    nombre4: {
      categorie: 'nombre', titre: '4 — Construction', mot: 'Construction',
      court: 'Le nombre des fondations : travail, ordre, stabilité.',
      lumiere: 'Fiabilité, persévérance, sens pratique.',
      ombre: 'Rigidité, routine pesante, entêtement.',
      motsCles: ['bâtir', 'organiser', 'durer'],
      domaines: {
        essence: 'Structure, effort, stabilité.',
        amour: 'Engagement, fiabilité, routine.',
        travail: 'Organisation, méthode, fondations.',
        finances: 'Épargne, budget, consolidation.',
        sante: 'Corps, ossature, discipline d’hygiène.',
        spiritualite: 'Ancrage, rituels réguliers.',
      },
    },
    nombre5: {
      categorie: 'nombre', titre: '5 — Changement', mot: 'Changement',
      court: 'Le nombre du mouvement : liberté, expérience, imprévu.',
      lumiere: 'Curiosité, adaptabilité, goût de la liberté.',
      ombre: 'Instabilité, excès, fuite de l’engagement.',
      motsCles: ['bouger', 'expérimenter', 's’adapter'],
      domaines: {
        essence: 'Mouvement, liberté, expérience.',
        amour: 'Nouveauté, rencontres, besoin d’air.',
        travail: 'Adaptation, voyages, imprévus.',
        finances: 'Fluctuations, opportunités rapides.',
        sante: 'Nerveux, besoin de mouvement.',
        spiritualite: 'Lâcher-prise par l’expérience.',
      },
    },
    nombre6: {
      categorie: 'nombre', titre: '6 — Harmonie', mot: 'Harmonie',
      court: 'Le nombre du foyer : responsabilité, choix du cœur, beauté.',
      lumiere: 'Dévouement, sens des responsabilités, harmonie.',
      ombre: 'Possessivité, perfectionnisme, ingérence.',
      motsCles: ['foyer', 'responsabilité', 'choix'],
      domaines: {
        essence: 'Responsabilité, foyer, beauté.',
        amour: 'Famille, engagement, soin de l’autre.',
        travail: 'Service, conseil, esthétique.',
        finances: 'Dépenses pour le foyer.',
        sante: 'Équilibre, cœur, gorge.',
        spiritualite: 'Amour comme service.',
      },
    },
    nombre7: {
      categorie: 'nombre', titre: '7 — Introspection', mot: 'Introspection',
      court: 'Le nombre de la vie intérieure : analyse, retrait, sagesse.',
      lumiere: 'Profondeur, discernement, vie intérieure.',
      ombre: 'Isolement, méfiance, froideur.',
      motsCles: ['réfléchir', 'étudier', 'se retirer'],
      domaines: {
        essence: 'Analyse, retrait, sagesse.',
        amour: 'Besoin de solitude, liens profonds.',
        travail: 'Recherche, étude, expertise.',
        finances: 'Réflexion avant d’agir.',
        sante: 'Repos, mental à apaiser.',
        spiritualite: 'Méditation, quête de sens.',
      },
    },
    nombre8: {
      categorie: 'nombre', titre: '8 — Pouvoir', mot: 'Pouvoir',
      court: 'Le nombre de la réalisation matérielle : ambition, gestion, justice.',
      lumiere: 'Efficacité, ambition, sens de la justice.',
      ombre: 'Matérialisme, domination, surmenage.',
      motsCles: ['réussir', 'gérer', 'récolter'],
      domaines: {
        essence: 'Accomplissement, matière, justice.',
        amour: 'Rapports de force à équilibrer.',
        travail: 'Ambition, gestion, résultats.',
        finances: 'Période forte : gains et responsabilités.',
        sante: 'Endurance, risque de surmenage.',
        spiritualite: 'Juste usage du pouvoir.',
      },
    },
    nombre9: {
      categorie: 'nombre', titre: '9 — Accomplissement', mot: 'Accomplissement',
      court: 'Le nombre des fins de cycle : bilan, compassion, transmission.',
      lumiere: 'Générosité, compassion, ouverture au monde.',
      ombre: 'Dispersion émotionnelle, sacrifice, nostalgie.',
      motsCles: ['terminer', 'pardonner', 'transmettre'],
      domaines: {
        essence: 'Fin de cycle, compassion, bilan.',
        amour: 'Pardon, clôture, ouverture universelle.',
        travail: 'Terminer, transmettre.',
        finances: 'Désencombrer, donner.',
        sante: 'Élimination, purification.',
        spiritualite: 'Détachement, altruisme.',
      },
    },
    nombre11: {
      categorie: 'nombre', titre: '11 — Inspiration', mot: 'Inspiration', vibreAussi: 2,
      court: 'Maître-nombre de l’intuition et de l’illumination ; il vibre aussi en 2.',
      lumiere: 'Intuition, inspiration, idéal élevé.',
      ombre: 'Nervosité, exaltation, sentiment d’être incompris.',
      motsCles: ['intuition', 'inspirer', 'idéal'],
      domaines: {
        essence: 'Maître-nombre : intuition, illumination (vibre aussi en 2).',
        amour: 'Liens d’âme, hypersensibilité.',
        travail: 'Inspirer, guider, innover.',
        finances: 'Idéalisme à ancrer.',
        sante: 'Système nerveux sollicité.',
        spiritualite: 'Canal, révélations.',
      },
    },
    nombre22: {
      categorie: 'nombre', titre: '22 — Bâtisseur', mot: 'Bâtisseur', vibreAussi: 4,
      court: 'Maître-nombre des grandes réalisations concrètes ; il vibre aussi en 4.',
      lumiere: 'Vision concrète, grande capacité de réalisation.',
      ombre: 'Pression excessive, ambition écrasante, peur de l’échec.',
      motsCles: ['vision', 'réaliser', 'envergure'],
      domaines: {
        essence: 'Maître-nombre : réaliser de grandes œuvres (vibre aussi en 4).',
        amour: 'Construire à deux sur le long terme.',
        travail: 'Projets d’envergure, vision concrète.',
        finances: 'Bâtir un patrimoine.',
        sante: 'Pression forte, besoin d’ancrage.',
        spiritualite: 'Incarner l’idéal.',
      },
    },
    nombre33: {
      categorie: 'nombre', titre: '33 — Maître guérisseur', mot: 'Maître guérisseur', vibreAussi: 6,
      court: 'Maître-nombre de l’amour inconditionnel ; il vibre aussi en 6.',
      lumiere: 'Amour inconditionnel, guérison, transmission.',
      ombre: 'Oubli de soi, sacrifice, culpabilité.',
      motsCles: ['soigner', 'enseigner', 'compassion'],
      domaines: {
        essence: 'Maître-nombre : amour inconditionnel (vibre aussi en 6).',
        amour: 'Dévouement, attention au sacrifice.',
        travail: 'Enseigner, soigner.',
        finances: 'Générosité à équilibrer.',
        sante: 'Prendre soin de soi aussi.',
        spiritualite: 'Compassion universelle.',
      },
    },

    // =====================================================================
    //  NOTIONS (ciel et numérologie)
    // =====================================================================
    retrograde: {
      categorie: 'notion',
      titre: '℞ Rétrograde',
      court: 'Vue de la Terre, la planète semble reculer dans le zodiaque.',
      detail: 'C’est une illusion d’optique : la Terre « dépasse » la planète sur son orbite, comme une voiture plus lente semble reculer quand on la double. Le Soleil et la Lune ne sont jamais rétrogrades.',
      // Ce que ça fait, en général. Affiché sous « Ce que ça fait ».
      effet: 'Les thèmes de la planète ralentissent et se tournent vers l’intérieur. C’est un mauvais moment pour lancer du neuf dans son domaine, un bon moment pour tout ce qui commence par « re- » : revoir, relire, réparer, renégocier, retrouver. Les sujets du passé ont tendance à revenir pour être terminés.',
      conseil: 'Finaliser et corriger plutôt que commencer. Les décisions prises pendant la rétrogradation sont souvent revues après.',
      motsCles: ['revoir', 'reprendre', 'intérioriser', 'retards'],
      // Effet propre à chaque planète (affiché quand on clique le ℞ d'une ligne précise,
      // et dans la fiche de la planète).
      // Les planètes lentes (Jupiter → Neptune) sont rétrogrades près de 40 % du temps :
      // leur effet est un fond collectif, moins ressenti au jour le jour que Mercure, Vénus ou Mars.
      parAstre: {
        mercure: 'Environ 3 fois par an, 3 semaines. Malentendus, retards, pannes techniques, messages perdus. Relire avant de signer, sauvegarder ses fichiers ; idéal pour réviser, corriger, recontacter quelqu’un.',
        venus:   'Tous les 18 mois environ, 6 semaines. Les relations et les valeurs sont remises en question, d’anciens amours peuvent revenir. Éviter les gros achats plaisir et les changements de look radicaux ; bon pour faire le point sur ce que l’on aime vraiment.',
        mars:    'Tous les 2 ans environ, 2 mois et demi. L’énergie et l’élan sont moins disponibles, la colère a tendance à rentrer. Revoir sa stratégie plutôt que forcer ; éviter de lancer des conflits ou des projets physiques exigeants.',
        jupiter: 'Environ 4 mois par an. La croissance se fait à l’intérieur : revoir ses croyances, ses projets d’expansion, ce qui donne du sens.',
        saturne: 'Environ 4 mois et demi par an. Revoir ses structures, ses engagements et ses responsabilités ; les leçons non apprises reviennent.',
        uranus:  'Environ 5 mois par an. Les envies de changement mûrissent en dedans avant d’éclater ; prises de conscience plutôt que ruptures.',
        neptune: 'Environ 5 mois par an. Les illusions se dissipent : plus de lucidité sur ce que l’on idéalisait.',
      },
    },
    degre: {
      categorie: 'notion',
      titre: 'Degré dans le signe',
      court: 'Chaque signe couvre 30° du zodiaque ; le degré dit où se trouve la planète dans ce signe, de 0° à 29,9°.',
      detail: 'Vers 0°, la planète vient d’entrer dans le signe ; vers 29°, elle s’apprête à en sortir.',
    },
    orbe: {
      categorie: 'notion',
      titre: 'Orbe',
      court: 'La marge tolérée autour de l’angle exact d’un aspect.',
      detail: 'Un carré exact vaut 90° ; avec un orbe de 7°, tout écart entre 83° et 97° compte. Plus l’écart est petit, plus l’aspect est fort.',
    },
    phase: {
      categorie: 'notion',
      titre: 'Phase lunaire',
      court: 'L’aspect de la Lune selon l’angle qui la sépare du Soleil, en 8 étapes de la nouvelle à la pleine lune et retour.',
      detail: 'Lune croissante : temps de lancer et de construire. Lune décroissante : temps de récolter, trier, lâcher.',
    },
    transit: {
      categorie: 'notion',
      titre: 'Transit planétaire',
      court: 'Le passage d’une planète en mouvement dans le ciel actuel sur une position du thème natal.',
      detail: 'Le transit révèle comment la météo collective du jour résonne intimement avec votre potentiel de naissance. Les planètes lentes (Jupiter à Neptune) marquent les cycles majeurs ; les rapides et la Lune apportent des touches ponctuelles.',
      motsCles: ['activation', 'résonance', 'cycles', 'évolution'],
    },
    themeNatal: {
      categorie: 'notion',
      titre: 'Thème natal',
      court: 'La carte du ciel au moment précis de votre naissance.',
      detail: 'Il représente votre potentiel de départ, vos ressources et vos apprentissages de fond. C’est la référence fixe sur laquelle viennent résonner les transits quotidiens.',
      motsCles: ['carte de naissance', 'potentiel', 'fondation'],
    },

    // =====================================================================
    //  ASTRES
    // =====================================================================
    soleil: {
      categorie: 'astre', titre: '☉ Soleil',
      court: 'L’identité, la vitalité, ce qui rayonne ; environ un mois par signe.',
      lumiere: 'Confiance, rayonnement, sens de soi.',
      ombre: 'Orgueil, égocentrisme, besoin d’être vu.',
      motsCles: ['moi', 'volonté', 'vitalité'],
      domaines: {
        essence: 'Ce que l’on est au fond, ce qui donne envie de se lever.',
        amour: 'Ce que l’on offre de soi dans le couple ; la fierté du lien.',
        travail: 'La vocation, le désir de réaliser quelque chose qui nous ressemble.',
        finances: 'La confiance pour se valoriser et demander son dû.',
        sante: 'La vitalité générale, le cœur, l’énergie de fond.',
        spiritualite: 'Devenir pleinement soi-même.',
      },
    },
    lune: {
      categorie: 'astre', titre: '☽ Lune',
      court: 'Les émotions, les besoins, l’humeur ; change de signe tous les 2 jours et demi.',
      lumiere: 'Sensibilité, intuition, capacité à prendre soin.',
      ombre: 'Humeur changeante, dépendance, repli.',
      motsCles: ['ressenti', 'besoins', 'intimité'],
      domaines: {
        essence: 'Les besoins profonds et la manière de se sentir en sécurité.',
        amour: 'Le besoin de tendresse, de proximité, de foyer.',
        travail: 'Le climat dans lequel on travaille bien ; le rapport au public.',
        finances: 'Le besoin de sécurité matérielle, les dépenses émotionnelles.',
        sante: 'Le sommeil, la digestion, les cycles.',
        spiritualite: 'L’écoute de l’intuition et des rêves.',
      },
    },
    mercure: {
      categorie: 'astre', titre: '☿ Mercure',
      court: 'La pensée, la parole, les échanges et les déplacements.',
      lumiere: 'Curiosité, clarté, sens de l’échange.',
      ombre: 'Nervosité, dispersion, ruse.',
      motsCles: ['communiquer', 'apprendre', 'relier'],
      domaines: {
        essence: 'La manière de penser, d’apprendre et de relier les choses.',
        amour: 'Le dialogue, l’humour, la complicité intellectuelle.',
        travail: 'Communication, contrats, études, déplacements.',
        finances: 'Négociations, commerce, paperasse.',
        sante: 'Le système nerveux, la respiration, les mains.',
        spiritualite: 'Comprendre, mettre des mots sur l’expérience.',
      },
    },
    venus: {
      categorie: 'astre', titre: '♀ Vénus',
      court: 'L’amour, le plaisir, la beauté, ce que l’on valorise (y compris l’argent).',
      lumiere: 'Douceur, sens du beau, art de relier.',
      ombre: 'Complaisance, paresse, dépendance au plaisir.',
      motsCles: ['aimer', 'apprécier', 'harmoniser'],
      domaines: {
        essence: 'Ce que l’on aime et ce qui nous rend aimable.',
        amour: 'La séduction, l’affection, l’harmonie du couple.',
        travail: 'Le relationnel, l’esthétique, le goût du travail agréable.',
        finances: 'Le rapport à l’argent et au plaisir de dépenser.',
        sante: 'Le bien-être, la gorge, les reins, l’équilibre.',
        spiritualite: 'L’amour et la beauté comme chemin.',
      },
    },
    mars: {
      categorie: 'astre', titre: '♂ Mars',
      court: 'L’action, le désir, le courage, la colère.',
      lumiere: 'Courage, franchise, énergie d’entreprendre.',
      ombre: 'Colère, impulsivité, agressivité.',
      motsCles: ['agir', 'oser', 'trancher'],
      domaines: {
        essence: 'La force d’agir et de s’affirmer.',
        amour: 'Le désir, la passion, la manière de conquérir.',
        travail: 'L’initiative, la compétition, la capacité à trancher.',
        finances: 'L’audace de prendre des risques, les dépenses impulsives.',
        sante: 'Les muscles, l’énergie physique, l’inflammation.',
        spiritualite: 'Le combat juste, la discipline de la volonté.',
      },
    },
    jupiter: {
      categorie: 'astre', titre: '♃ Jupiter',
      court: 'L’expansion, la confiance, la chance ; reste environ un an par signe.',
      lumiere: 'Confiance, générosité, optimisme.',
      ombre: 'Excès, arrogance, promesses non tenues.',
      motsCles: ['grandir', 'croire', 'élargir'],
      domaines: {
        essence: 'Ce qui nous fait grandir et donne du sens.',
        amour: 'La générosité, la bienveillance, les projets partagés.',
        travail: 'Les opportunités, la promotion, l’enseignement.',
        finances: 'La prospérité, mais aussi la tentation de dépenser trop.',
        sante: 'Le foie, les excès de table, la vitalité optimiste.',
        spiritualite: 'La foi, la philosophie, la quête de sens.',
      },
    },
    saturne: {
      categorie: 'astre', titre: '♄ Saturne',
      court: 'La structure, les limites, le temps et l’effort ; environ 2 ans et demi par signe.',
      lumiere: 'Rigueur, patience, maturité.',
      ombre: 'Peur, rigidité, pessimisme.',
      motsCles: ['structurer', 'durer', 'assumer'],
      domaines: {
        essence: 'Les limites, les responsabilités et ce qui se construit avec le temps.',
        amour: 'L’engagement, la fidélité, parfois la distance.',
        travail: 'La carrière sur la durée, l’autorité, le sens du devoir.',
        finances: 'L’épargne, la prudence, les dettes à régler.',
        sante: 'Les os, les dents, la peau ; la fatigue chronique.',
        spiritualite: 'La discipline intérieure et les leçons de vie.',
      },
    },
    uranus: {
      categorie: 'astre', titre: '♅ Uranus',
      court: 'Le changement soudain, la liberté, l’innovation ; environ 7 ans par signe.',
      lumiere: 'Originalité, liberté, intuition fulgurante.',
      ombre: 'Instabilité, rébellion gratuite, imprévisibilité.',
      motsCles: ['libérer', 'innover', 'surprendre'],
      domaines: {
        essence: 'Le besoin d’être unique et de briser les routines.',
        amour: 'Les coups de foudre, le besoin d’espace, les relations atypiques.',
        travail: 'L’innovation, la technologie, les changements soudains.',
        finances: 'Les gains et les pertes imprévus.',
        sante: 'Le système nerveux, le stress, les accidents.',
        spiritualite: 'Les prises de conscience soudaines, l’éveil.',
      },
    },
    neptune: {
      categorie: 'astre', titre: '♆ Neptune',
      court: 'Le rêve, l’intuition, la dissolution des frontières ; environ 14 ans par signe.',
      lumiere: 'Imagination, compassion, inspiration.',
      ombre: 'Illusion, confusion, fuite.',
      motsCles: ['rêver', 'ressentir', 'dissoudre'],
      domaines: {
        essence: 'Le rêve, l’idéal et la dissolution des frontières.',
        amour: 'L’amour idéalisé, la fusion, le romantisme.',
        travail: 'Les métiers artistiques, du soin ou de l’image ; les situations floues.',
        finances: 'Le flou, les illusions ; attention aux arnaques.',
        sante: 'La sensibilité, les intoxications, les dépendances.',
        spiritualite: 'La méditation, la mystique, le sentiment d’unité.',
      },
    },

    // =====================================================================
    //  SIGNES
    //  maitres : planètes « chez elles » dans le signe (domicile).
    //  Verseau et Poissons ont un maître classique (Saturne, Jupiter)
    //  et un maître moderne (Uranus, Neptune).
    // =====================================================================
    belier: {
      categorie: 'signe', titre: '♈ Bélier', maitres: ['mars'],
      court: 'Feu cardinal : l’élan, le départ, l’affirmation.',
      lumiere: 'Courage, enthousiasme, esprit pionnier.',
      ombre: 'Impatience, impulsivité, égocentrisme.',
      motsCles: ['initiative', 'courage', 'impulsion'],
      domaines: {
        essence: 'Exister en agissant, être le premier.',
        amour: 'Coups de cœur, passion directe, besoin de conquête.',
        travail: 'Lancer, diriger, relever les défis.',
        finances: 'Décisions rapides, achats impulsifs.',
        sante: 'Énergie vive ; la tête, les maux de tête, les coups de chaleur.',
        spiritualite: 'Trouver le courage d’être soi.',
      },
    },
    taureau: {
      categorie: 'signe', titre: '♉ Taureau', maitres: ['venus'],
      court: 'Terre fixe : la stabilité, les sens, la possession.',
      lumiere: 'Patience, fiabilité, sensualité.',
      ombre: 'Entêtement, possessivité, inertie.',
      motsCles: ['sécurité', 'plaisir', 'patience'],
      domaines: {
        essence: 'Se sentir en sécurité, apprécier le concret.',
        amour: 'Fidélité, tendresse, plaisir des sens.',
        travail: 'Construire lentement, valoriser les ressources.',
        finances: 'Épargne, goût de la propriété et du confort.',
        sante: 'Robustesse ; la gorge, le cou, la gourmandise.',
        spiritualite: 'Trouver le sacré dans la nature et le corps.',
      },
    },
    gemeaux: {
      categorie: 'signe', titre: '♊ Gémeaux', maitres: ['mercure'],
      court: 'Air mutable : la curiosité, l’échange, la multiplicité.',
      lumiere: 'Curiosité, vivacité, sens de l’échange.',
      ombre: 'Dispersion, superficialité, nervosité.',
      motsCles: ['communication', 'mobilité', 'esprit'],
      domaines: {
        essence: 'Comprendre, relier, bouger.',
        amour: 'Complicité, jeu, besoin de dialogue.',
        travail: 'Communication, commerce, polyvalence.',
        finances: 'Petits échanges, revenus multiples, dépenses éparpillées.',
        sante: 'Les nerfs, les poumons, les bras et les mains.',
        spiritualite: 'Apprendre sans cesse, garder l’esprit ouvert.',
      },
    },
    cancer: {
      categorie: 'signe', titre: '♋ Cancer', maitres: ['lune'],
      court: 'Eau cardinale : la protection, le foyer, la mémoire.',
      lumiere: 'Sensibilité, protection, mémoire.',
      ombre: 'Susceptibilité, repli, dépendance.',
      motsCles: ['famille', 'émotion', 'refuge'],
      domaines: {
        essence: 'Prendre soin, appartenir, se sentir chez soi.',
        amour: 'Tendresse, attachement, désir de fonder un foyer.',
        travail: 'Soin, accueil, entreprises familiales.',
        finances: 'Prudence, épargne pour la famille, immobilier.',
        sante: 'L’estomac, la poitrine ; une grande sensibilité aux émotions.',
        spiritualite: 'Les racines, les ancêtres, l’intuition.',
      },
    },
    lion: {
      categorie: 'signe', titre: '♌ Lion', maitres: ['soleil'],
      court: 'Feu fixe : le rayonnement, la création, la fierté.',
      lumiere: 'Générosité, créativité, rayonnement.',
      ombre: 'Orgueil, besoin d’admiration, autoritarisme.',
      motsCles: ['expression', 'générosité', 'cœur'],
      domaines: {
        essence: 'Briller, créer, être reconnu.',
        amour: 'Romantisme, fidélité fière, besoin d’être admiré.',
        travail: 'Diriger, créer, se mettre en scène.',
        finances: 'Générosité, goût du luxe.',
        sante: 'Le cœur, le dos ; une grande vitalité.',
        spiritualite: 'Rayonner de l’intérieur, donner de la joie.',
      },
    },
    vierge: {
      categorie: 'signe', titre: '♍ Vierge', maitres: ['mercure'],
      court: 'Terre mutable : l’analyse, le service, le soin du détail.',
      lumiere: 'Précision, sens du service, discernement.',
      ombre: 'Perfectionnisme, critique, anxiété.',
      motsCles: ['méthode', 'santé', 'utilité'],
      domaines: {
        essence: 'Être utile, améliorer, mettre en ordre.',
        amour: 'Attentions concrètes, pudeur, fidélité discrète.',
        travail: 'Méthode, analyse, travail bien fait.',
        finances: 'Budget tenu, dépenses raisonnées.',
        sante: 'Les intestins, l’hygiène de vie, le soin du détail.',
        spiritualite: 'Le service humble, la justesse des gestes quotidiens.',
      },
    },
    balance: {
      categorie: 'signe', titre: '♎ Balance', maitres: ['venus'],
      court: 'Air cardinal : la relation, l’équilibre, l’esthétique.',
      lumiere: 'Diplomatie, sens de la justice, élégance.',
      ombre: 'Indécision, dépendance, évitement des conflits.',
      motsCles: ['partenariat', 'justice', 'harmonie'],
      domaines: {
        essence: 'Être en relation, chercher l’équilibre.',
        amour: 'Couple, harmonie, séduction raffinée.',
        travail: 'Négociation, partenariats, métiers de l’art et du droit.',
        finances: 'Associations, dépenses esthétiques.',
        sante: 'Les reins, le bas du dos ; le besoin d’équilibre.',
        spiritualite: 'La paix intérieure, la justice.',
      },
    },
    scorpion: {
      categorie: 'signe', titre: '♏ Scorpion', maitres: ['mars'],
      court: 'Eau fixe : l’intensité, la transformation, ce qui est caché.',
      detail: 'Maître classique : Mars. L’astrologie moderne lui attribue aussi Pluton, que Toiles ne calcule pas encore.',
      lumiere: 'Intensité, lucidité, capacité de renaissance.',
      ombre: 'Jalousie, contrôle, rancune.',
      motsCles: ['profondeur', 'crise', 'renaissance'],
      domaines: {
        essence: 'Aller au fond des choses, se transformer.',
        amour: 'Passion, exclusivité, fusion.',
        travail: 'Enquête, gestion de crise, finance, psychologie.',
        finances: 'Héritages, ressources partagées, investissements.',
        sante: 'Les organes génitaux, l’élimination ; une forte capacité de régénération.',
        spiritualite: 'Mourir à l’ancien pour renaître.',
      },
    },
    sagittaire: {
      categorie: 'signe', titre: '♐ Sagittaire', maitres: ['jupiter'],
      court: 'Feu mutable : l’horizon, le sens, l’aventure.',
      lumiere: 'Optimisme, ouverture, quête de sens.',
      ombre: 'Excès, dogmatisme, fuite en avant.',
      motsCles: ['voyage', 'foi', 'enseignement'],
      domaines: {
        essence: 'Explorer, comprendre le monde, croire.',
        amour: 'Liberté, aventure à deux, partage d’idéaux.',
        travail: 'Enseignement, voyages, édition, droit.',
        finances: 'Chance, optimisme parfois imprudent.',
        sante: 'Les hanches, les cuisses, le foie ; le besoin de grand air.',
        spiritualite: 'Philosophie, religion, sagesse.',
      },
    },
    capricorne: {
      categorie: 'signe', titre: '♑ Capricorne', maitres: ['saturne'],
      court: 'Terre cardinale : l’ambition, la structure, l’autorité.',
      lumiere: 'Ambition, persévérance, sens des responsabilités.',
      ombre: 'Froideur, rigidité, pessimisme.',
      motsCles: ['carrière', 'rigueur', 'durée'],
      domaines: {
        essence: 'Bâtir, atteindre un sommet, durer.',
        amour: 'Engagement sérieux, loyauté, pudeur.',
        travail: 'Carrière, autorité, stratégie à long terme.',
        finances: 'Gestion prudente, patrimoine.',
        sante: 'Les os, les genoux, les dents, la peau.',
        spiritualite: 'La maîtrise de soi, la sagesse de l’âge.',
      },
    },
    verseau: {
      categorie: 'signe', titre: '♒ Verseau', maitres: ['saturne', 'uranus'],
      court: 'Air fixe : le collectif, l’originalité, l’avenir.',
      detail: 'Maître classique : Saturne ; maître moderne : Uranus.',
      lumiere: 'Originalité, fraternité, vision d’avenir.',
      ombre: 'Détachement, rébellion, froideur.',
      motsCles: ['amitié', 'liberté', 'idéaux'],
      domaines: {
        essence: 'Être libre et utile au groupe.',
        amour: 'Amitié amoureuse, indépendance, liens atypiques.',
        travail: 'Innovation, technologie, projets collectifs.',
        finances: 'Investissements novateurs, gains et pertes imprévus.',
        sante: 'Les chevilles, la circulation, le système nerveux.',
        spiritualite: 'L’idéal humaniste, l’éveil collectif.',
      },
    },
    poissons: {
      categorie: 'signe', titre: '♓ Poissons', maitres: ['jupiter', 'neptune'],
      court: 'Eau mutable : la sensibilité, l’imaginaire, la compassion.',
      detail: 'Maître classique : Jupiter ; maître moderne : Neptune.',
      lumiere: 'Compassion, imagination, intuition.',
      ombre: 'Confusion, fuite, sacrifice de soi.',
      motsCles: ['intuition', 'rêve', 'lâcher-prise'],
      domaines: {
        essence: 'Ressentir, se fondre, dépasser les frontières.',
        amour: 'Romantisme, dévouement, amour inconditionnel.',
        travail: 'Art, soin, aide, métiers de l’invisible.',
        finances: 'Flou, générosité, besoin de cadre.',
        sante: 'Les pieds, l’immunité, la sensibilité aux substances.',
        spiritualite: 'Mystique, méditation, unité.',
      },
    },

    // =====================================================================
    //  ASPECTS
    // =====================================================================
    conjonction: {
      categorie: 'aspect', titre: '☌ Conjonction (0°)',
      court: 'Deux planètes au même endroit : leurs énergies fusionnent et s’intensifient.',
      detail: 'Ni bonne ni mauvaise en soi : tout dépend des planètes réunies.',
      lumiere: 'Concentration, puissance, nouveau départ.',
      ombre: 'Confusion des énergies, excès.',
      motsCles: ['fusion', 'intensité', 'commencement'],
      domaines: {
        essence: 'Deux fonctions se fondent en une seule.',
        amour: 'Fusion, coup de foudre, intensité.',
        travail: 'Un élan concentré sur un seul objectif.',
        finances: 'Un sujet d’argent prend toute la place.',
        sante: 'Énergie concentrée, à ne pas surmener.',
        spiritualite: 'Un nouveau cycle commence.',
      },
    },
    sextile: {
      categorie: 'aspect', titre: '⚹ Sextile (60°)',
      court: 'Une opportunité : les énergies s’entendent, à condition d’agir pour en profiter.',
      lumiere: 'Opportunité, coopération, facilité d’apprentissage.',
      ombre: 'Occasions manquées faute d’agir.',
      motsCles: ['opportunité', 'coopération', 'ouverture'],
      domaines: {
        essence: 'Deux énergies s’entraident si on les sollicite.',
        amour: 'Rencontres faciles, complicité.',
        travail: 'Contacts utiles, occasions à saisir.',
        finances: 'Petits gains, bonnes affaires.',
        sante: 'Un équilibre facile à entretenir.',
        spiritualite: 'Apprendre par l’échange.',
      },
    },
    carre: {
      categorie: 'aspect', titre: '□ Carré (90°)',
      court: 'Une tension qui pousse à agir : frottement, obstacle, mais aussi moteur.',
      lumiere: 'Motivation, dépassement, croissance par l’effort.',
      ombre: 'Conflit, blocage, stress.',
      motsCles: ['tension', 'défi', 'effort'],
      domaines: {
        essence: 'Deux énergies se contrarient et obligent à agir.',
        amour: 'Frictions, désirs contradictoires à concilier.',
        travail: 'Obstacles, pression, défis qui font progresser.',
        finances: 'Dépenses imprévues, arbitrages.',
        sante: 'Tensions, fatigue nerveuse.',
        spiritualite: 'Grandir par la difficulté.',
      },
    },
    trigone: {
      categorie: 'aspect', titre: '△ Trigone (120°)',
      court: 'Une harmonie naturelle : les énergies circulent facilement, parfois sans effort conscient.',
      lumiere: 'Fluidité, talent, chance.',
      ombre: 'Facilité, paresse, manque d’effort.',
      motsCles: ['fluidité', 'talent', 'aisance'],
      domaines: {
        essence: 'Deux énergies coulent ensemble naturellement.',
        amour: 'Entente, douceur, harmonie.',
        travail: 'Talents naturels, réussite aisée.',
        finances: 'Rentrées faciles, stabilité.',
        sante: 'Bonne vitalité, récupération rapide.',
        spiritualite: 'Grâce, confiance dans la vie.',
      },
    },
    opposition: {
      categorie: 'aspect', titre: '☍ Opposition (180°)',
      court: 'Deux énergies face à face : besoin de trouver l’équilibre entre deux pôles.',
      lumiere: 'Prise de conscience, complémentarité.',
      ombre: 'Polarisation, projection sur l’autre.',
      motsCles: ['polarité', 'équilibre', 'conscience'],
      domaines: {
        essence: 'Deux pôles se font face et demandent un équilibre.',
        amour: 'Attirance des contraires, tiraillements.',
        travail: 'Négociation, rivalités, compromis à trouver.',
        finances: 'Arbitrage entre deux besoins.',
        sante: 'Alternance de hauts et de bas.',
        spiritualite: 'Intégrer ses contraires.',
      },
    },

    // =====================================================================
    //  ÉLÉMENTS ET MODES
    //  Les signes de chaque élément / mode sont listés automatiquement
    //  dans la fiche (src/fiches.js), à partir de Toiles.astres.SIGNES.
    // =====================================================================
    feu:      { categorie: 'notion', titre: 'Feu', court: 'Élan, enthousiasme, action. Signes : Bélier, Lion, Sagittaire.', motsCles: ['élan', 'enthousiasme', 'action'] },
    terre:    { categorie: 'notion', titre: 'Terre', court: 'Concret, stabilité, matière. Signes : Taureau, Vierge, Capricorne.', motsCles: ['concret', 'stabilité', 'patience'] },
    air:      { categorie: 'notion', titre: 'Air', court: 'Idées, échanges, relations. Signes : Gémeaux, Balance, Verseau.', motsCles: ['idées', 'échanges', 'relations'] },
    eau:      { categorie: 'notion', titre: 'Eau', court: 'Émotions, intuition, lien. Signes : Cancer, Scorpion, Poissons.', motsCles: ['émotions', 'intuition', 'lien'] },
    cardinal: { categorie: 'notion', titre: 'Mode cardinal', court: 'Initier, lancer. Les signes qui ouvrent chaque saison : Bélier, Cancer, Balance, Capricorne.', motsCles: ['initier', 'lancer'] },
    fixe:     { categorie: 'notion', titre: 'Mode fixe', court: 'Maintenir, consolider. Le cœur des saisons : Taureau, Lion, Scorpion, Verseau.', motsCles: ['maintenir', 'consolider'] },
    mutable:  { categorie: 'notion', titre: 'Mode mutable', court: 'Adapter, transmettre. La fin des saisons : Gémeaux, Vierge, Sagittaire, Poissons.', motsCles: ['adapter', 'transmettre'] },

    // =====================================================================
    //  NOTIONS DE NUMÉROLOGIE
    // =====================================================================
    reduction: {
      categorie: 'notion',
      titre: 'Réduction',
      court: 'Additionner les chiffres d’un nombre jusqu’à n’en garder qu’un (ex. 2026 → 2+0+2+6 = 10 → 1).',
    },
    maitreNombre: {
      categorie: 'notion',
      titre: 'Maître-nombre',
      court: '11, 22 et 33 ne sont pas réduits : ils portent une vibration plus intense que 2, 4 et 6.',
    },
    cascade: {
      categorie: 'notion',
      titre: 'Cascade',
      court: 'Chaque période vibre dans la plus longue : mois = année + mois, jour = mois + jour.',
      detail: 'Additionner directement tous les chiffres de la date donne presque toujours le même résultat ; la cascade diffère seulement quand elle croise un maître-nombre, qu’elle conserve.',
    },
    cheminDeVie: {
      categorie: 'notion',
      titre: 'Chemin de vie',
      court: 'Le nombre de ta date de naissance : la grande direction de ta vie.',
      detail: 'Jour, mois et année de naissance sont réduits séparément, puis additionnés et réduits à nouveau (maîtres-nombres conservés).',
    },
  };

  /** Clé du glossaire pour un nom affiché ("Gémeaux" → "gemeaux", "Carré" → "carre").
   *  Rangée à part (Toiles.cleGlossaire) pour ne pas être prise pour une entrée. */
  T.cleGlossaire = (nom) =>
    nom.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  /** Clé du glossaire pour un nombre (7 → "nombre7"). */
  T.cleNombre = (n) => 'nombre' + n;
})(globalThis.Toiles = globalThis.Toiles || {});
