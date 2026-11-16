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
 *   3. Ascendant & maisons : heure légale → TU, temps sidéral, angles, Placidus, domaines
 *   4. Lecture croisée : table de correspondances, leçon du jour
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
        cyclesLongs: {
          id: 'cyclesLongs',
          titre: 'Les cycles longs : 9 ans, cycles de vie, pinacles et défis',
          resume: 'Des périodes de plusieurs années tirées de la date de naissance, pour situer l’année en cours dans un mouvement plus vaste.',
          formule: 'm, j, a = mois, jour, année de naissance réduits à 1 chiffre (sans maître-nombre)\nPinacles : P1 = m + j · P2 = j + a · P3 = P1 + P2 · P4 = m + a   (réduits, maîtres-nombres gardés)\nDéfis : D1 = |m − j| · D2 = |j − a| · D3 = |D1 − D2| · D4 = |m − a|\nÂges : P1 de 0 à 36 − chemin de vie (réduit à 1 chiffre) · P2 et P3 : 9 ans chacun · P4 jusqu’au bout\nCycles de vie : jeunesse = mois (pendant P1) · maturité = jour (P2 et P3) · sagesse = année (P4)\nCycle de 9 ans : rang = année personnelle réduite à 1 chiffre ; l’année 1 du cycle = année − (rang − 1)',
          paragraphes: [
            'Pourquoi 36 ? Le nombre 36 (= 4 × 9) est la borne traditionnelle : le premier pinacle couvre l’enfance et la jeunesse, et finit d’autant plus tôt que le chemin de vie est grand. Ensuite chaque pinacle dure un cycle complet de 9 ans.',
            'Exemple (naissance le 15/05/1990) : m = 5, j = 1 + 5 = 6, a = 1 + 9 + 9 + 0 = 19 → 10 → 1, chemin de vie 3. Pinacles : 5 + 6 = 11 (maître-nombre gardé), 6 + 1 = 7, 11 + 7 = 18 → 9, 5 + 1 = 6. Défis : 1, 5, 4, 4. Âges : 0-33, 33-42, 42-51, 51 et plus.',
            'Convention Toiles : les écoles ne s’accordent ni sur la réduction des composants (certaines gardent 11 et 22), ni sur les bornes des cycles de vie (parfois liées à l’année personnelle 1 la plus proche de 28 et 56 ans). Toiles retient la règle la plus fréquente dans les manuels français et l’affiche en clair dans « Voir le calcul ».',
            'Le défi 0 n’est pas une absence : il signifie que toutes les leçons sont possibles et qu’il revient à chacun de choisir la sienne.'
          ],
        },
        nomComplet: {
          id: 'nomComplet',
          titre: 'Les nombres du nom',
          resume: 'Transformer les lettres en nombres avec la table pythagoricienne, puis lire trois sommes : toutes les lettres, les voyelles, les consonnes.',
          formule: '1 2 3 4 5 6 7 8 9\nA B C D E F G H I\nJ K L M N O P Q R\nS T U V W X Y Z\n\nExpression = toutes les lettres · Élan spirituel = voyelles (A E I O U Y) · Moi intime = consonnes\nChaque mot est réduit séparément, puis les mots sont additionnés et réduits.',
          paragraphes: [
            'Quel nom ? Celui de l’état civil à la naissance : tous les prénoms et le nom de naissance. La tradition y voit la « vibration » reçue en arrivant ; un nom d’usage ou un pseudonyme peut se calculer à part, mais ne remplace pas celui-ci.',
            'Conventions Toiles pour le français : accents et cédille retirés (É → E, Ç → C), ligatures dédoublées (Œ → OE, Æ → AE), tirets, apostrophes et espaces séparent les mots, tout autre signe est ignoré. Y est toujours compté comme voyelle : d’autres écoles regardent s’il se prononce comme une voyelle (Yves) ou une consonne (Yann), ce qu’un programme ne peut pas deviner.',
            'Pourquoi réduire mot par mot ? Additionner toutes les lettres d’un coup donne presque toujours le même chiffre final, mais efface les maîtres-nombres qui apparaissent dans un prénom ou un nom. C’est la méthode la plus répandue.',
            'Les noms des trois nombres varient selon les livres : les voyelles sont aussi appelées « nombre intime » ou « nombre de l’âme », les consonnes « nombre de réalisation » ou « personnalité ». Le calcul, lui, ne change pas.'
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

        complements: {
          id: 'complements',
          titre: 'Pluton, Chiron et les nœuds lunaires',
          resume: 'Trois points complémentaires, calculés et affichés à part pour ne pas changer les lectures fondées sur les 9 astres.',
          formule: 'Pluton : série de Schlyter (angles P = 238,95° + 0,003968789 d et S = 50,03° + 0,033459652 d)\nChiron : équation de Kepler, éléments du périhélie de 1996 (a = 13,648 UA, e = 0,3801, i = 6,935°)\nNœud Nord moyen (Meeus 47.7) : Ω = 125,0445° − 1934,1363° T  (T en siècles depuis J2000)\nNœud Sud = Ω + 180°',
          paragraphes: [
            'Pluton : son orbite est trop inclinée (17°) et trop perturbée par Neptune pour une ellipse fixe. Paul Schlyter donne une somme de sinus et cosinus de deux angles qui tournent lentement ; elle reste à moins de 0,1° entre 1900 et 2100 (vérifié sur ses entrées en Capricorne, 2008, et en Verseau, 2024).',
            'Chiron : aucune série compacte n’existe. Toiles fige son orbite au passage au périhélie (février 1996) et résout l’équation de Kepler comme pour les autres planètes. Saturne et Uranus déforment peu à peu cette orbite : précision d’environ 0,5° de 1975 à 2030, qui se dégrade lentement au-delà.',
            'Nœuds lunaires : le plan de l’orbite de la Lune est incliné de 5° sur l’écliptique ; il le coupe en deux points opposés, les nœuds. Le Soleil fait tourner ce plan : les nœuds reculent d’environ 19,3° par an. Toiles utilise le nœud MOYEN (mouvement régulier) ; le nœud « vrai » oscille de ±1,5° autour. Les éclipses ont lieu quand une nouvelle ou pleine lune tombe près d’un nœud.',
            'Pourquoi à part ? Les 9 astres alimentent la teinte, l’équilibre des éléments, les aspects, les transits et la lecture croisée. Ajouter ces points changerait toutes ces lectures d’un coup. Ils sont donc montrés dans le ciel du moment, sur la carte du ciel et dans les maisons du thème natal, sans voter.'
          ],
        },
        sideral: {
          id: 'sideral',
          titre: 'Zodiaque tropical et zodiaque sidéral',
          resume: 'Deux façons de placer le début du Bélier : sur l’équinoxe (tropical, Toiles) ou sur les étoiles (sidéral).',
          formule: 'Longitude sidérale = longitude tropicale − ayanamsa\nAyanamsa(t) = valeur au 1/1/2000 + 50,29″ × années écoulées\nLahiri : 23,853° en 2000 · Fagan-Bradley : 24,740° en 2000',
          paragraphes: [
            'La précession des équinoxes : l’axe de la Terre décrit un cône en environ 25 800 ans. Le point vernal (Soleil à l’équinoxe de printemps, 0° Bélier tropical) recule donc lentement devant les étoiles, de 50,29″ par an, soit 1° tous les 72 ans.',
            'Le zodiaque tropical suit les saisons : le Soleil entre en Bélier à l’équinoxe de mars, chaque année. Le zodiaque sidéral suit les étoiles : il faut retrancher l’ayanamsa, aujourd’hui supérieur à 24°. Un astre placé dans les 24 premiers degrés d’un signe tropical se trouve donc dans le signe précédent en sidéral.',
            'Aucun ayanamsa n’est « le bon » : chaque école choisit l’étoile ou l’époque qui fixe le départ. Lahiri (Chitrapaksha) est l’ayanamsa officiel en Inde depuis 1955 ; Fagan-Bradley est le plus utilisé par les sidéralistes occidentaux. Ils diffèrent d’environ 0,9°.',
            'Toiles reste tropical : ses textes sont écrits pour ce zodiaque. La comparaison sert à comprendre, pas à remplacer.'
          ],
        },
      },
    },
    maisons: {
      id: 'maisons',
      titre: 'Ascendant & maisons',
      description: 'De l’heure notée à l’état civil jusqu’aux 12 maisons : fuseaux, temps sidéral, angles et domification.',
      sections: {
        heureLegale: {
          id: 'heureLegale',
          titre: 'De l’heure légale au temps universel',
          resume: 'L’heure de l’état civil est une heure légale ; l’astronomie calcule en temps universel (TU).',
          formule: 'TU = heure légale − décalage du fuseau ce jour-là\nFrance : TU+1 en hiver, TU+2 en été (depuis 1976) ; TU+1 toute l’année de 1946 à 1975 ;\nheure allemande (TU+1 / TU+2) en 1940-1944 ; heure du méridien de Paris (TU+9 min 21 s) avant 1911.',
          paragraphes: [
            'Le décalage n’est pas fixe : il dépend du pays, de l’année et de la saison. Plutôt que de recopier ces règles à la main, Toiles interroge la base des fuseaux horaires (IANA) intégrée à ton navigateur, via l’objet standard Intl. Il suffit de connaître le fuseau de la ville (ex. Europe/Paris) : les heures d’été historiques sont prises en compte.',
            'Deux cas particuliers chaque année : au passage à l’heure d’été, l’heure entre 2 h et 3 h n’existe pas (Toiles garde alors le décalage d’hiver) ; au retour à l’heure d’hiver, elle existe deux fois (Toiles garde la première). Le calcul détaillé le signale.',
            'La ville sert aussi à donner la latitude et la longitude. Si ta ville n’est pas dans la liste, prends la plus proche : un écart de 1° de longitude (environ 75 km en France) déplace l’Ascendant d’environ 1°.'
          ],
        },
        tempsSideral: {
          id: 'tempsSideral',
          titre: 'Le temps sidéral',
          resume: 'L’heure des étoiles : quel point du ciel passe au méridien du lieu.',
          formule: 'Temps sidéral de Greenwich (Meeus 12.4) :\n  θ₀ = 280,46061837° + 360,98564736629° × (JJ − 2451545) + 0,000387933° × T² − T³ ÷ 38 710 000\n  (JJ = jour julien, T = siècles depuis le 1/1/2000 à midi TU)\nTemps sidéral local = θ₀ + longitude (est positive)\n15° = 1 heure sidérale',
          paragraphes: [
            'Notre horloge suit le Soleil : 24 h séparent deux midis. Mais en un jour, la Terre avance aussi d’environ 1° sur son orbite ; par rapport aux étoiles, elle a donc tourné de 360,9856°, un peu plus d’un tour. Le jour sidéral dure 23 h 56 min 4 s.',
            'Le temps sidéral local, exprimé en degrés, est l’ascension droite du méridien (RAMC) : c’est la donnée de départ de tout le calcul des maisons. Vérification : Toiles retrouve la valeur de l’exemple 12.a de Meeus (10 avril 1987, 0 h TU : 13 h 10 min 46 s).'
          ],
        },
        anglesDuTheme: {
          id: 'anglesDuTheme',
          titre: 'Ascendant et Milieu du Ciel',
          resume: 'Les deux axes du thème : l’horizon (Ascendant – Descendant) et le méridien (Milieu du Ciel – Fond du Ciel).',
          formule: 'ε = obliquité de l’écliptique ≈ 23,44° ; φ = latitude\nMC = atan2(sin RAMC, cos RAMC × cos ε)\nAS = atan2(cos RAMC, −(sin RAMC × cos ε + tan φ × sin ε))\nDescendant = AS + 180° ; Fond du Ciel = MC + 180°',
          paragraphes: [
            'Le Milieu du Ciel est le degré du zodiaque qui culmine au méridien. On passe de l’équateur (où se mesure le temps sidéral) à l’écliptique (où se mesure le zodiaque) en tenant compte de leur inclinaison mutuelle ε.',
            'L’Ascendant est le degré qui se lève à l’horizon est. La latitude entre en jeu parce que l’horizon s’incline sur l’écliptique quand on s’éloigne de l’équateur : à Paris, le Poissons ou le Bélier se lèvent en moins d’une heure, la Vierge ou la Balance en près de trois. C’est pourquoi certains Ascendants sont plus fréquents que d’autres.',
            'Le zodiaque entier défile à l’horizon en 24 h : l’Ascendant avance d’environ 1° toutes les 4 minutes. Une heure de naissance arrondie à la demi-heure peut donc faire hésiter entre deux signes quand l’Ascendant est en début ou fin de signe.'
          ],
        },
        maisons: {
          id: 'maisons',
          titre: 'La domification de Placidus',
          resume: 'Douze maisons qui partagent en trois le temps de montée de chaque degré, au-dessus et au-dessous de l’horizon.',
          formule: 'Arc semi-diurne d’un degré de déclinaison δ : ASD = 90° + asin(tan φ × tan δ)\nCuspide XI : ascension droite = RAMC + ASD ÷ 3   ;  XII : RAMC + 2 × ASD ÷ 3\nCuspide II : RAMC + 180° − 2 × (180° − ASD) ÷ 3 ;  III : RAMC + 180° − (180° − ASD) ÷ 3\n(on recalcule δ et ASD jusqu’à ce que la cuspide ne bouge plus)\nI = Ascendant, X = MC ; IV, V, VI, VII, VIII, IX = opposées de X, XI, XII, I, II, III',
          paragraphes: [
            'Pourquoi Placidus ? C’est le système le plus utilisé en France, dans les manuels comme dans les logiciels : tes résultats seront comparables à ceux que tu trouveras ailleurs. Son idée : les maisons ne découpent pas l’espace en parts égales, mais le temps. La cuspide XI est le degré qui a parcouru le premier tiers de son trajet entre son lever et sa culmination.',
            'Le calcul est itératif : le temps de trajet d’un degré dépend de sa déclinaison, donc de sa position… qu’on cherche. On part d’une estimation et on recommence jusqu’à stabilité (une dizaine de tours).',
            'Limite : au-delà des cercles polaires (latitude > 66,5°), certains degrés ne se lèvent ou ne se couchent jamais et Placidus n’a plus de solution. Toiles passe alors en maisons égales (30° chacune depuis l’Ascendant) et le signale.',
            'Vérification : pour trois naissances de référence (fiabilité AA, actes d’état civil), l’Ascendant, le Milieu du Ciel et les cuspides calculés par Toiles s’écartent de moins de 3 minutes d’arc des valeurs publiées.'
          ],
        },
        maisonsDomaines: {
          id: 'maisonsDomaines',
          titre: 'Les maisons et les 6 domaines (convention Toiles)',
          resume: 'Deux maisons par domaine, chacune dans un seul domaine, pour relier le thème à la grille de lecture de Toiles.',
          formule: 'Essence : I (soi) et IV (racines)\nAmour : V (amours, plaisir) et VII (couple)\nTravail : X (vocation) et III (échanges)\nFinances : II (ressources) et VIII (ressources partagées)\nSanté : VI (quotidien) et XII (repos, retrait)\nSpiritualité : IX (quête de sens) et XI (idéaux)',
          paragraphes: [
            'La tradition donne plusieurs significations à chaque maison ; Toiles en retient une principale pour la ranger dans un domaine. Certains choix se discutent : la maison XII est aussi celle de la vie intérieure et du mysticisme, la XI celle des amitiés, la VI celle du travail quotidien. C’est une convention de Toiles, assumée comme telle.',
            'Pour chaque domaine, Toiles indique le signe sur la cuspide des deux maisons (la manière de vivre ce domaine) et les planètes qui s’y trouvent (les énergies qui l’animent). Une maison vide n’est pas un domaine absent : son signe et le maître de ce signe en parlent toujours.'
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
    suivi: {
      id: 'suivi',
      titre: 'Suivi & quiz',
      description: 'Les outils pour apprendre par l’expérience : calendrier du mois, journal de bord, quiz, sauvegardes.',
      sections: {
        calendrier: {
          id: 'calendrier',
          titre: 'Le calendrier mensuel',
          resume: 'Chaque jour du mois avec son nombre et sa Lune, et les quatre moments clés de la lunaison.',
          formule: 'Nombre de la case = jour universel (ou personnel avec un profil)\nMoment clé ce jour-là si l’élongation Lune − Soleil franchit 0°, 90°, 180° ou 270° entre 0 h et 24 h (heure locale)',
          paragraphes: [
            'L’élongation (l’écart entre la Lune et le Soleil) augmente d’environ 12° par jour. En la mesurant aux deux minuits qui encadrent la journée, on sait si un moment clé a eu lieu ce jour-là, sans risque d’en compter deux ni d’en manquer un.',
            'Les dates sont en heure locale : une pleine lune à 0 h 30 à Paris tombe le lendemain de celle annoncée à 23 h 30 en temps universel. C’est normal, et c’est pourquoi un calendrier publié dans un autre pays peut décaler une lunaison d’un jour.'
          ],
        },
        journal: {
          id: 'journal',
          titre: 'Le journal de bord',
          resume: 'Noter son ressenti pour vérifier soi-même, au fil des semaines, ce que les nombres et le ciel évoquent.',
          paragraphes: [
            'Une note par jour et par profil. En l’enregistrant, Toiles recopie une « photo » du jour : jour universel et personnel, phase de la Lune, teinte. Si un calcul est corrigé plus tard, la note garde ce que tu avais sous les yeux.',
            'Tout reste dans le navigateur (localStorage). Exporte régulièrement : le fichier .json se recharge plus tard, le fichier .md se lit dans n’importe quel éditeur de texte.',
            'Conseil d’apprentissage : écris d’abord ce que tu as vécu, puis seulement après regarde les nombres. Dans l’autre sens, on finit par voir ce qu’on s’attend à voir.'
          ],
        },
        quiz: {
          id: 'quiz',
          titre: 'Le quiz',
          resume: 'Des questions à choix multiples fabriquées à partir des fiches du glossaire.',
          paragraphes: [
            'Quatre sortes de questions : retrouver une notion à partir de sa définition, ou de ses mots-clés ; l’élément d’un signe ; la planète qui gouverne un signe. Les mauvaises réponses sont tirées de la même catégorie, pour qu’on ne puisse pas deviner à la forme.',
            'Le nom de la réponse est masqué dans l’énoncé (« … »). Après chaque réponse, la définition complète s’affiche, avec un lien vers sa fiche.'
          ],
        },
        sauvegardes: {
          id: 'sauvegardes',
          titre: 'Sauvegarder et recharger',
          resume: 'Les profils et le journal vivent dans le navigateur : un fichier de sauvegarde les met à l’abri.',
          paragraphes: [
            'Import des profils : Toiles relit le fichier .json exporté, vérifie chaque profil (nom, date, heure, lieu) et n’écrase jamais rien. Un profil de même nom (sans tenir compte des majuscules ni des accents) et de même date de naissance est un doublon : il est ignoré. Les profils invalides sont écartés, avec la raison.',
            'Pourquoi pas de fusion automatique des doublons ? Parce qu’on ne sait pas lequel est le plus juste. Pour remplacer un profil, supprime-le d’abord puis réimporte.'
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
