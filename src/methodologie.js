/**
 * Toiles — volet Méthodologie & Pédagogie
 *
 * Ce fichier rassemble les explications méthodologiques, les principes
 * de calcul, les formules mathématiques et astronomiques ainsi que les limites
 * des modèles adoptés par Toiles.
 *
 * Il alimente le panneau Méthodologie accessible depuis l'en-tête et depuis
 * le lien « En savoir plus » des infobulles.
 *
 * Structure :
 *   1. Numérologie : pythagoricienne, réduction, cascade, semaine ISO
 *   2. Ciel : zodiaque tropical, Schlyter, Kepler, perturbations, phases, dignités
 *   3. Lecture croisée : table de correspondances, leçon du jour
 */
(function (T) {
  'use strict';

  const METHODOLOGIE = {
    numerologie: {
      id: 'numerologie',
      titre: 'Numérologie',
      description: 'Fondements historiques, arithmétique symbolique et logique de cascade des cycles temporels.',
      sections: {
        pythagoricienne: {
          id: 'pythagoricienne',
          titre: 'L’école pythagoricienne',
          resume: 'Une approche symbolique et rythmique fondée sur 9 archétypes premiers.',
          paragraphes: [
            'Attribuée au philosophe et mathématicien grec Pythagore de Samos (VIe siècle av. J.-C.) et à son école de Crotone, la numérologie pythagoricienne repose sur l’axiome fondamental : « Tout est nombre ». Dans cette vision, les nombres ne sont pas seulement des outils de mesure quantitative, mais des principes d’ordre universel et des symboles qualitatifs exprimant des lois de croissance et d’harmonie.',
            'L’école retient 9 nombres premiers, de 1 à 9, considérés comme les briques élémentaires de toute manifestation. Chaque nombre incarne une étape spécifique d’un cycle d’évolution complet : le 1 symbolise l’impulsion initiale et l’affirmation, le 2 la dualité et la coopération, le 3 l’expression et la créativité, le 4 la structure et la matière, le 5 le mouvement et l’expérience, le 6 l’harmonie et la responsabilité, le 7 l’introspection et la quête de sens, le 8 le pouvoir et l’alignement matériel, et le 9 l’accomplissement et le bilan avant la renaissance.',
            'Dans Toiles, la numérologie est abordée de façon moderne, laïque et pédagogique : elle ne sert pas à prédire l’avenir de manière fataliste, mais offre une grille de lecture des rythmes temporels, invitant à observer les dynamiques intérieures et extérieures au fil des jours, des mois et des années.'
          ],
        },
        reduction: {
          id: 'reduction',
          titre: 'La réduction théosophique et les maîtres-nombres',
          resume: 'L’addition répétée des chiffres pour extraire la racine vibratoire d’une valeur, en préservant 11, 22 et 33.',
          formule: 'n → somme des chiffres de |n|, répétée jusqu’à n ≤ 9, sauf si n ∈ {11, 22, 33}.',
          paragraphes: [
            'La réduction théosophique (ou réduction numérologique) consiste à additionner tous les chiffres d’un nombre, puis à recommencer avec le total obtenu jusqu’à parvenir à un résultat à un seul chiffre compris entre 1 et 9. Par exemple, pour l’année 2026 : 2 + 0 + 2 + 6 = 10, puis 1 + 0 = 1. L’année 2026 vibre donc sous l’énergie du 1.',
            'Sur le plan arithmétique, cette opération équivaut au calcul du reste modulo 9 (le principe même de la « preuve par 9 » classique), le reste 0 étant assimilé au nombre 9. Cette opération ramène n’importe quel nombre arbitrairement grand à sa racine archétypale fondamentale.',
            'Une exception essentielle s’applique aux « maîtres-nombres » : 11, 22 et 33. Constitués du redoublement d’un chiffre premier (1, 2 ou 3), ces nombres portent une intensité vibratoire particulière considérée comme une « octave supérieure » (11 résonne comme une inspiration spirituelle du 2, 22 comme une construction d’envergure du 4, et 33 comme un dévouement universel du 6). Lorsqu’une étape de calcul produit l’un de ces trois nombres, Toiles interrompt la réduction pour en préserver la nuance et la puissance.'
          ],
        },
        cascade: {
          id: 'cascade',
          titre: 'La cascade des périodes (universel et personnel)',
          resume: 'L’emboîtement des cycles : l’année donne le climat général, le mois colore la saison, le jour concrétise au quotidien.',
          formule: 'Nombres universels :\n  • Année universelle (AU) = réduire(somme des chiffres de l’année)\n  • Mois universel (MU) = réduire(AU + mois civil)\n  • Jour universel (JU) = réduire(MU + jour civil)\n\nNombres personnels (avec date de naissance) :\n  • Année personnelle (AP) = réduire(jour naiss. réduit + mois naiss. réduit + AU)\n  • Mois personnel (MP) = réduire(AP + mois civil)\n  • Jour personnel (JP) = réduire(MP + jour civil)\n  • Chemin de vie = réduire(jour naiss. réduit + mois naiss. réduit + annee naiss. réduite)',
          paragraphes: [
            'Pourquoi une « cascade » plutôt qu’un calcul isolé de chaque période ? En numérologie pythagoricienne, le temps est structuré comme des cycles concentriques emboîtés, à l’image de poupées russes. Un cycle court (le jour) ne se déploie jamais dans le vide : il prend racine dans la dynamique du mois, qui elle-même s’inscrit dans le cadre de l’année.',
            'Ainsi, le mois universel additionne le chiffre de l’année au numéro du mois : un mois de mai (5) dans une Année universelle 1 donne 1 + 5 = 6 (énergie d’harmonie, de responsabilité et de choix), tandis que ce même mois de mai dans une Année universelle 9 donne 9 + 5 = 14 → 5 (énergie de transition, de mouvement et de renouvellement). L’ambiance mensuelle est indissociable du grand cycle annuel qui la porte.',
            'Le même emboîtement s’applique au jour : le jour universel combine le mois universel et le quantième du jour civil. Pour les nombres personnels, la date de naissance de l’individu (son jour et son mois de naissance) forme une empreinte immuable qui vient s’associer à l’année collective, personnalisant la cascade à l’échelle individuelle.',
            'Le Chemin de vie, quant à lui, est calculé à partir de la date de naissance intégrale (jour, mois et année de naissance réduits). Il représente le thème de fond, la leçon majeure et les talents innés que la personne est invitée à déployer tout au long de son existence.'
          ],
        },
        semaineISO: {
          id: 'semaineISO',
          titre: 'La semaine ISO 8601 (convention Toiles)',
          resume: 'Une intégration claire de la semaine civile dans la cascade mensuelle.',
          formule: 'Semaine = réduire(Mois [universel ou personnel] + réduire(semaine ISO 8601))',
          paragraphes: [
            'Contrairement à l’année (cycle solaire), au mois (cycle des saisons) et au jour (cycle terrestre circadien), la semaine de 7 jours ne correspond à aucun cycle astronomique direct exact. La tradition numérologique classique ne propose ainsi aucune règle universellement admise pour déterminer le nombre d’une semaine.',
            'Certains praticiens ignorent la semaine, d’autres additionnent directement le jour au mois, d’autres encore découpent arbitrairement l’année en 52 tranches. Pour apporter une réponse rigoureuse, transparente et vérifiable, Toiles adopte une convention claire : insérer le numéro de semaine civil international (norme ISO 8601) au cœur de la cascade mensuelle.',
            'La norme internationale ISO 8601 définit la semaine comme débutant le lundi. La semaine 1 d’une année est celle qui contient le premier jeudi de janvier (soit au moins quatre jours de la nouvelle année). En réduisant ce numéro de semaine et en l’additionnant au mois (universel ou personnel), Toiles assure une continuité fluide : la semaine reflète l’avancement opérationnel au sein du thème du mois en cours.'
          ],
        },
      },
    },
    ciel: {
      id: 'ciel',
      titre: 'Ciel & Dynamiques célestes',
      description: 'Mécanique céleste analytique, passage géocentrique et grille d’analyse astrologique.',
      sections: {
        zodiaqueTropical: {
          id: 'zodiaqueTropical',
          titre: 'Le zodiaque tropical géocentrique',
          resume: 'La météo céleste observée depuis la Terre, calée sur l’équinoxe de printemps et le cycle des saisons.',
          paragraphes: [
            'L’astrologie telle qu’elle est pratiquée dans Toiles est géocentrique : elle s’intéresse à la position des corps célestes telle qu’elle apparaît depuis la surface de la Terre, lieu de notre expérience vivante. C’est une approche phénoménologique où le ciel forme une voûte d’observation autour de nous.',
            'Elle utilise le zodiaque tropical, standard de la tradition astrologique occidentale depuis l’Antiquité alexandrine (Ptolémée). Le zodiaque tropical est directement synchronisé avec le cycle des saisons de l’hémisphère nord : le point de référence zéro (0° Bélier, ou point vernal) est l’intersection exacte entre l’écliptique (le plan de l’orbite terrestre) et l’équateur céleste, franchi par le Soleil lors de l’équinoxe de printemps (autour du 20 mars).',
            'Le zodiaque tropical se distingue du zodiaque sidéral, qui s’aligne sur les constellations d’étoiles fixes lointaines. En raison de la précession des équinoxes (une lente oscillation de l’axe de rotation de la Terre sur un cycle d’environ 25 772 ans), le point vernal recule lentement le long des constellations d’environ 1° tous les 72 ans. Le zodiaque tropical demeure cependant immuable par rapport aux saisons terrestres et se divise en 12 secteurs réguliers de 30° chacun.'
          ],
        },
        schlyter: {
          id: 'schlyter',
          titre: 'Les éléments orbitaux de Paul Schlyter',
          resume: 'Un modèle analytique compact permettant de calculer les positions sans base de données volumineuse.',
          paragraphes: [
            'Pour calculer la position précise des astres à une date quelconque, les éphémérides modernes de haute précision (comme la série JPL DE405 de la NASA ou les théories semi-analytiques VSOP87 du Bureau des longitudes) nécessitent des tables de coefficients occupant plusieurs mégaoctets. Un tel volume est incompatible avec la volonté de faire fonctionner Toiles en totale autonomie, sans dépendance externe et en double-clic local (file://).',
            'Toiles utilise donc la méthode analytique conçue par l’astronome suédois Paul Schlyter (« How to compute planetary positions »). Cette méthode s’appuie sur les éléments orbitaux osculateurs calibrés à l’époque standard J2000.0 (31 décembre 1999 à 0h Temps Universel, correspondant au jour julien 2451543.5). Pour chaque planète, six éléments fondamentaux sont exprimés sous forme de polynômes linéaires en fonction du nombre de jours écoulés d :',
            '  • N : longitude du nœud ascendant (orientation spatiale du plan de l’orbite)\n  • i : inclinaison par rapport au plan de l’écliptique\n  • w : argument du périhélie (orientation de l’ellipse dans son plan)\n  • a : demi-grand axe (dimension de l’orbite en Unités Astronomiques)\n  • e : excentricité orbitale (forme de l’ellipse)\n  • M : anomalie moyenne (position linéaire théorique de l’astre sur son orbite).',
            'Ces éléments permettent de reconstituer la position héliocentrique de la planète (par rapport au Soleil), puis d’effectuer une translation vectorielle avec la position de la Terre pour obtenir sa longitude et sa latitude écliptiques géocentriques vues de notre planète.'
          ],
        },
        kepler: {
          id: 'kepler',
          titre: 'L’équation de Kepler et Newton-Raphson',
          resume: 'La résolution de l’orbite elliptique et de la vitesse variable par approximations successives.',
          formule: 'M = E - e · sin(E)\nRésolution par Newton-Raphson :\n  E_{k+1} = E_k - (E_k - (e / RAD) · sin(E_k) - M) / (1 - e · cos(E_k))',
          paragraphes: [
            'La première loi de Kepler énonce que les planètes décrivent des ellipses dont le Soleil occupe l’un des foyers. La deuxième loi (loi des aires) stipule que la planète accélère lorsqu’elle s’approche du périhélie et ralentit à l’aphélie. Sa vitesse angulaire n’est donc pas uniforme au cours du temps.',
            'L’anomalie moyenne M représente la position angulaire linéaire théorique d’un corps fictif avançant à vitesse constante. Pour convertir M en la position géométrique réelle sur l’ellipse, Kepler a établi l’équation fondamentale : M = E - e · sin(E), où E est l’anomalie excentrique (un angle auxiliaire projeté sur le cercle circonscrit à l’ellipse) et e l’excentricité de l’orbite.',
            'Cette équation est dite transcendante : il est mathématiquement impossible d’exprimer E par une formule algébrique directe en fonction de M. Pour la résoudre numériquement, Toiles implémente la méthode de Newton-Raphson. En partant d’une première approximation proposée par Schlyter (E₀ = M + e · sin(M) · (1 + e · cos(M))), l’algorithme ajuste la valeur itérativement en divisant l’erreur par la dérivée f’(E) = 1 - e · cos(E).',
            'En raison des faibles excentricités des planètes de notre système solaire (e < 0,21), la convergence de Newton-Raphson est quadratique : 2 à 3 itérations suffisent pour obtenir une précision supérieure à 10⁻⁶ degré. On en déduit ensuite l’anomalie vraie v (l’angle polaire réel par rapport au foyer) et la distance physique r, projetées enfin dans l’espace 3D de l’écliptique.'
          ],
        },
        perturbations: {
          id: 'perturbations',
          titre: 'Les perturbations gravitationnelles majeures',
          resume: 'Au-delà de Kepler : les attractions gravitationnelles mutuelles de la Lune, de Jupiter et de Saturne.',
          paragraphes: [
            'Le modèle képlérien pur suppose un système idéal à deux corps isolés (par exemple le Soleil et une planète). Dans la réalité, tous les corps du système solaire exercent des attractions gravitationnelles les uns sur les autres : ce sont les perturbations orbitales.',
            'Pour la Lune, ces perturbations sont majeures en raison de l’influence gravitationnelle concurrente de la Terre et du Soleil (problème des trois corps). Une simple orbite képlérienne accumulerait une erreur de plus de 5° ! Toiles intègre les 12 termes de perturbation principaux de la théorie de Brown/Schlyter :',
            '  • L’évection (-1,274° · sin(Mm - 2D)) : découverte par Ptolémée au IIe siècle, causée par la déformation périodique de l’orbite lunaire par le Soleil selon l’alignement de sa ligne des apsides ;\n  • La variation (+0,658° · sin(2D)) : découverte par Tycho Brahe au XVIe siècle, due à l’accélération de la Lune vers les syzygies (nouvelle et pleine lune) et son ralentissement aux quadratures ;\n  • L’équation annuelle (-0,186° · sin(Ms)) : provoquée par la variation saisonnière de la distance Terre-Soleil (l’orbite terrestre étant elliptique) ;\n  • 9 harmoniques complémentaires assurant une précision d’environ 0,2° à 0,5°.',
            'Pour les planètes géantes Jupiter et Saturne, leurs masses considérables et leurs périodes orbitales (11,86 ans et 29,46 ans) sont en quasi-résonance 5:2 (5 révolutions de Jupiter correspondent presque exactement à 2 révolutions de Saturne, phénomène historique connu sous le nom de « Grande Inégalité »). Toiles intègre leurs termes mutuels (jusqu’à +0,812° sur Saturne et -0,332° sur Jupiter), garantissant une précision globale inférieure à 1° sur l’ensemble du ciel.'
          ],
        },
        phases: {
          id: 'phases',
          titre: 'Les phases lunaires et l’élongation',
          resume: 'L’angle Soleil-Terre-Lune déterminant la lumière visible et les 8 étapes du cycle synodique.',
          formule: 'Élongation = lon(Lune) - lon(Soleil) (normalisée entre 0° et 360°)\nIllumination = (1 - cos(élongation)) / 2',
          paragraphes: [
            'La Lune ne produit pas de lumière propre : elle réfléchit celle du Soleil. Depuis la Terre, la portion visible de sa face éclairée dépend de l’angle géocentrique formé entre la Lune et le Soleil le long du zodiaque, appelé l’élongation écliptique.',
            'L’élongation évolue de 0° à 360° au cours du mois synodique (la lunaison, d’une durée moyenne d’environ 29,53 jours) :',
            '  • 0° : Nouvelle lune (la Lune est entre la Terre et le Soleil, sa face éclairée nous est invisible, illumination 0 %) ;\n  • 45° : Premier croissant ;\n  • 90° : Premier quartier (demi-disque éclairé, illumination 50 %, quadrature croissante) ;\n  • 135° : Gibbeuse croissante ;\n  • 180° : Pleine lune (la Terre est entre le Soleil et la Lune, face visible entièrement illuminée à 100 %, opposition) ;\n  • 225° : Gibbeuse décroissante ;\n  • 270° : Dernier quartier (illumination 50 %, quadrature décroissante) ;\n  • 315° : Dernier croissant.',
            'La fraction de surface illuminée k est calculée par la formule trigonométrique exacte k = (1 - cos(élongation)) / 2. Cette valeur pilote dynamiquement le disque graphique de la Lune affiché dans l’interface de Toiles.'
          ],
        },
        dignites: {
          id: 'dignites',
          titre: 'Les dignités et débilités planétaires',
          resume: 'L’aisance ou l’inconfort d’une planète selon le signe du zodiaque dans lequel elle séjourne.',
          paragraphes: [
            'Dans la tradition astrologique, chaque signe du zodiaque possède une planète maîtresse (son « maître » ou « domicile ») dont les caractéristiques symboliques sont en parfaite résonance avec la nature du signe. Lorsqu’une planète traverse le ciel, sa faculté d’expression est modulée par le signe qu’elle occupe.',
            'Le système classique des dignités et débilités essentielles retenu dans Toiles distingue quatre états majeurs :',
            '  • Domicile : la planète est dans son propre signe (ex. le Soleil en Lion, Mars en Bélier). Elle dispose pleinement de ses moyens et s’exprime avec naturel et puissance ;\n  • Exaltation : la planète est reçue comme une invitée d’honneur (ex. le Soleil en Bélier, la Lune en Taureau). Ses qualités positives sont magnifiées et valorisées ;\n  • Exil (ou détriment) : opposé au domicile (à 180°), la planète est dans un environnement étranger à sa nature fondamentale (ex. le Soleil en Verseau, Mars en Balance), l’obligeant à s’adapter ou à faire des compromis ;\n  • Chute : opposée à l’exaltation, la planète y perd ses repères usuels (ex. le Soleil en Balance, la Lune en Scorpion) et doit transformer sa manière d’agir pour surmonter cette tension.',
            'Lorsqu’une planète n’occupe aucune de ces quatre positions, elle est dite « pérégrine » (état neutre). Toiles évalue également l’affinité élémentaire (une planète de feu en signe de feu, etc.) et le mode d’action (cardinal pour initier, fixe pour stabiliser, mutable pour adapter) afin d’établir la synthèse de la Dynamique des énergies.'
          ],
        },
        transits: {
          id: 'transits',
          titre: 'Les transits planétaires et le thème natal',
          resume: 'La rencontre entre le ciel du jour et le thème de naissance : cycles de fond, déclencheurs et orbes resserrés.',
          formule: 'Écart angulaire = min(|lon_céleste − lon_natale|, 360° − |lon_céleste − lon_natale|)\nCondition d’activation : |Écart − Angle_aspect| ≤ Orbe (1° à 3°)',
          paragraphes: [
            'Alors que la météo collective du « Ciel du moment » s’applique à tout le monde de façon identique, les transits personnels individualisent l’analyse astrologique. Un transit se produit lorsqu’une planète en mouvement dans le ciel actuel vient former un angle géométrique précis (conjonction, opposition, trigone, carré ou sextile) avec l’un des astres immobiles de ton thème natal.',
            'Pourquoi distinguer les planètes lentes des planètes rapides ?\nLa vitesse de déplacement des corps célestes détermine la portée temporelle et l’intensité du transit. La Lune traverse un aspect en quelques heures (humeur ou résonance émotionnelle fugace), le Soleil, Mercure et Vénus en 2 à 3 jours (événements ou sensations éphémères), et Mars en une à deux semaines (impulsion d’action ou poussée d’énergie). À l’inverse, les planètes lentes — Jupiter (cycle de 12 ans), Saturne (29,5 ans), Uranus (84 ans) et Neptune (165 ans) — stationnent plusieurs semaines ou plusieurs mois sur un même degré (notamment lors de leurs phases rétrogrades). Leurs transits structurent les grandes transitions de vie, les apprentissages profonds et les tournants majeurs d’évolution personnelle. C’est pourquoi Toiles les affiche en priorité absolue.',
            'Pourquoi des orbes resserrés (1° à 3°) ?\nDans l’analyse d’un thème natal isolé ou d’un ciel collectif, la tradition astrologique tolère des orbes larges allant jusqu’à 7° ou 8°. Mais pour l’étude des transits quotidiens, un tel orbe saturerait l’affichage de dizaines d’aspects lointains actifs en permanence, occultant l’essentiel. Toiles applique une règle stricte d’orbes resserrés (3° pour la conjonction et l’opposition, 2,5° pour le carré et le trigone, 2° pour le sextile). Un transit n’apparaît que lorsqu’il entre dans sa phase de réelle résonance opérative, culminant lors de son exactitude (orbe proche de 0°).',
            'La convention de midi TU et la détection du signe lunaire :\nL’heure exacte de naissance n’étant pas toujours connue de mémoire, Toiles calcule le thème natal de référence à 12h00 Temps Universel (midi TU). Cette convention mathématique standardise le calcul et minimise l’erreur angulaire maximale sur la journée (±12 heures). Pour le Soleil et toutes les planètes, le déplacement sur une demi-journée est minime (< 0,5°) et ne change presque jamais leur signe zodiacal. En revanche, la Lune parcourt environ 13° par jour : elle change de signe environ une fois tous les deux jours et demi. Si la Lune franchit la frontière entre deux signes au cours de ta journée de naissance (entre 0h et 24h TU), Toiles affiche automatiquement un avertissement pour te signaler que son signe natal exact reste dépendant de ton heure de naissance.'
          ],
        },
      },
    },
    croisee: {
      id: 'croisee',
      titre: 'Lecture croisée',
      description: 'Comment Toiles relie les nombres et le ciel, et comment il choisit la leçon du jour.',
      sections: {
        correspondances: {
          id: 'correspondances',
          titre: 'La table nombre ↔ planète ↔ élément',
          resume: 'Un pont entre deux traditions : chaque nombre de 1 à 9 est relié à une planète, et par elle à un élément.',
          formule: '1 Soleil (Feu) · 2 Lune (Eau) · 3 Jupiter (Feu) · 4 Uranus (Air) · 5 Mercure (Air)\n6 Vénus (Terre) · 7 Neptune (Eau) · 8 Saturne (Terre) · 9 Mars (Feu)\nMaîtres-nombres : 11 → 2, 22 → 4, 33 → 6 (planète de la racine)\nÉlément du nombre = élément du domicile de sa planète',
          paragraphes: [
            'Numérologie et astrologie sont deux systèmes nés séparément. Il n’existe pas de table officielle qui les relie : chaque auteur propose la sienne. Toiles retient la plus répandue dans les manuels de numérologie occidentale moderne (dans la lignée de Cheiro, début du XXe siècle), en remplaçant les nœuds lunaires, que Toiles ne calcule pas encore, par Uranus et Neptune, déjà admis par beaucoup d’auteurs pour le 4 et le 7.',
            'Pourquoi un élément ? Pour avoir une base de comparaison simple avec le ciel du jour. On prend l’élément du domicile de la planète : le Soleil gouverne le Lion (Feu), donc le 1 est un nombre de Feu. Mercure et Vénus ont deux domiciles ; on garde le premier dans l’ordre du zodiaque (Gémeaux, Taureau). C’est une convention de Toiles, assumée comme telle.',
            'Les éléments se comparent selon la règle astrologique classique : même élément = écho ; Feu et Air (actifs) ou Terre et Eau (réceptifs) = complices ; actif face à réceptif = contraste. Un contraste n’est pas « mauvais » : il signale deux manières d’avancer à concilier.',
            'La lecture croisée liste ces correspondances une par une (la planète du nombre et son signe du jour, l’élément du nombre face à la teinte du ciel, les aspects serrés que reçoit la planète), puis relie le domaine choisi avec trois phrases de sources différentes. Elle ne calcule volontairement aucune note globale : le but est de comprendre les liens, pas d’obtenir un score.'
          ],
        },
        leconDuJour: {
          id: 'leconDuJour',
          titre: 'La leçon du jour',
          resume: 'Une notion par jour, choisie parce qu’elle est visible dans le ciel ou les nombres de la date.',
          formule: 'Priorité (du plus rare au plus courant) :\n  1. Nouvelle ou pleine lune (élongation à moins de 6,5° de 0° ou 180°)\n  2. Station : une planète change de sens entre la veille et le lendemain\n  3. Jour universel = maître-nombre (11, 22, 33)\n  4. Aspect exact entre deux planètes (écart < 0,5°, Lune exclue)\n  5. Mercure, Vénus ou Mars rétrograde\n  6. Sinon : une notion de base, selon le jour de l’année',
          paragraphes: [
            'On apprend mieux une notion quand on peut la voir à l’œuvre. La leçon du jour cherche donc d’abord l’événement le plus rare de la date : une lunaison n’arrive que deux fois par mois, une station quelques fois par an.',
            'Pourquoi 6,5° pour les lunaisons ? La Lune gagne environ 12° par jour sur le Soleil : une fenêtre de ±6,5° autour de l’exact désigne le jour civil où la lunaison a lieu, sans en garder deux.',
            'Le texte affiché est celui de la fiche du glossaire correspondante : la leçon ne réécrit rien, elle choisit quoi montrer. Le lien « Fiche complète » mène à la fiche, « En savoir plus » à la méthode.'
          ],
        },
      },
    },
  };

  /**
   * Retrouve une section ou un article à partir d'une clé.
   * Accepte : 'numerologie', 'ciel', ou l'identifiant d'une sous-section
   * ('pythagoricienne', 'reduction', 'cascade', 'semaineISO',
   *  'zodiaqueTropical', 'schlyter', 'kepler', 'perturbations', 'phases', 'dignites').
   * Supporte aussi les alias d'infobulles : 'dynamique' → 'dignites', 'aspects' → 'ciel'.
   */
  function trouver(cle) {
    if (!cle) return null;
    if (cle === 'dynamique') cle = 'dignites';
    if (cle === 'aspects') cle = 'ciel';

    if (METHODOLOGIE[cle]) return { type: 'domaine', ...METHODOLOGIE[cle] };
    // On cherche la section dans chaque domaine (numerologie, ciel, croisee).
    for (const domaine in METHODOLOGIE) {
      const section = METHODOLOGIE[domaine].sections[cle];
      if (section) return { type: 'section', domaine, ...section };
    }
    return null;
  }

  /**
   * Renvoie la liste ordonnée des sous-sections pour un domaine ('numerologie' ou 'ciel').
   */
  function lister(domaine) {
    const dom = METHODOLOGIE[domaine];
    return dom ? Object.values(dom.sections) : [];
  }

  T.methodologie = {
    donnees: METHODOLOGIE,
    trouver,
    lister,
  };
})(globalThis.Toiles = globalThis.Toiles || {});
