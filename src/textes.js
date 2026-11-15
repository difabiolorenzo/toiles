/**
 * Toiles — textes des infobulles « Comment ça marche ».
 *
 * Les textes sont dans un fichier .js (et non .json) parce que la page s'ouvre
 * en double-clic (file://) : le navigateur y interdit fetch() sur les fichiers locaux.
 *
 * Format de chaque entrée :
 *   titre    : nom du module
 *   principe : l'idée en une ou deux phrases
 *   base     : sur quoi repose le calcul
 *   limites  : ce qu'il faut garder en tête
 * Tu peux modifier ces phrases librement : l'affichage les relit à chaque ouverture.
 */
(function (T) {
  'use strict';

  T.textes = {
    /* Tendance associée à la teinte du jour (élément dominant), pour la Synthèse.
       Un seul mot : on écrit « tendance : … », jamais une prédiction. */
    tendances: {
      feu: 'élan',
      terre: 'concret',
      air: 'échanges',
      eau: 'intériorité',
    },
    infobulles: {
      synthese: {
        titre: 'Synthèse du jour',
        principe: 'Un résumé de la journée en un coup d’œil : sa teinte (l’élément qui rassemble le plus d’astres), le nombre du jour et la phase de la Lune.',
        base: 'Teinte : on compte les 9 astres par élément (Feu, Terre, Air, Eau), chacun pour 1 ; la barre montre cette proportion. Nombre : le jour universel, avec sa cascade année → mois → jour écrite en petit.',
        limites: 'C’est un résumé : il ne remplace pas le détail des cartes en dessous. La tendance est un mot-clé de l’élément, pas une prévision.',
        sectionMethodologie: 'ciel',
      },
      geocentrique: {
        titre: 'Le ciel vu de la Terre',
        principe: 'Le schéma montre où se trouve chaque astre dans le zodiaque, tel qu’on le verrait depuis la Terre, placée au centre.',
        base: 'Chaque point est posé à sa vraie longitude du jour. Bélier (0°) à gauche, puis les signes dans le sens inverse des aiguilles d’une montre, comme sur un thème astral.',
        limites: 'Quand deux astres sont à moins de 12° l’un de l’autre, le second est dessiné plus près du centre pour rester lisible ; un trait fin le relie à son degré exact.',
        sectionMethodologie: 'zodiaqueTropical',
      },
      heliocentrique: {
        titre: 'Le système solaire',
        principe: 'Le même instant vu de dessus, depuis le Soleil : on voit les planètes tourner sur leurs orbites, et la Terre parmi elles.',
        base: 'Longitudes héliocentriques calculées avec les mêmes orbites (méthode de Paul Schlyter). Quand une planète extérieure est alignée avec la Terre du même côté du Soleil, elle est à l’opposition.',
        limites: 'Les distances ne sont pas à l’échelle : les orbites sont espacées régulièrement, sinon Neptune sortirait de l’écran. Seuls les angles sont justes.',
        sectionMethodologie: 'kepler',
      },
      numerologie: {
        titre: 'Numérologie',
        principe: 'Chaque période porte un nombre de 1 à 9 (ou 11, 22, 33). Les nombres universels valent pour tout le monde ; les nombres personnels ajoutent ta date de naissance.',
        base: 'Méthode pythagoricienne : on additionne les chiffres jusqu’à n’en garder qu’un. Cascade : année → mois (+ n° du mois) → jour (+ jour du mois). Ouvre « Voir le calcul » sous chaque nombre.',
        limites: 'La semaine n’a pas de règle commune : Toiles utilise mois + n° de semaine ISO. Les maîtres-nombres 11, 22, 33 ne sont pas réduits.',
        sectionMethodologie: 'numerologie',
      },
      ciel: {
        titre: 'Ciel du moment',
        principe: 'La position des planètes vue depuis la Terre, rapportée aux 12 signes du zodiaque. C’est la « météo » collective, la même pour tout le monde.',
        base: 'Astrologie tropicale : le zodiaque commence à l’équinoxe de printemps (0° Bélier). Positions calculées à partir des orbites des planètes (méthode de Paul Schlyter).',
        limites: 'Précision inférieure à 1°, suffisante pour les signes. Une planète « ℞ » (rétrograde) semble reculer vue de la Terre : c’est une illusion d’optique, lue comme un temps de retour sur soi.',
        sectionMethodologie: 'ciel',
      },
      dynamique: {
        titre: 'Dynamique des énergies',
        principe: 'Une synthèse du ciel : quels éléments et quels modes dominent, et si les planètes se parlent plutôt en harmonie ou en tension.',
        base: 'Éléments (feu, terre, air, eau) et modes (cardinal = initier, fixe = maintenir, mutable = adapter) des signes occupés. Soleil et Lune comptent triple, les planètes personnelles double.',
        limites: 'Ces pondérations sont un choix de Toiles. Le « climat » compare la force des aspects harmonieux et tendus.',
        sectionMethodologie: 'dignites',
      },
      aspects: {
        titre: 'Aspects',
        principe: 'Un aspect est un angle particulier entre deux planètes. Il dit comment leurs énergies se combinent.',
        base: 'Conjonction 0° (fusion), sextile 60° et trigone 120° (harmonie), carré 90° et opposition 180° (tension). L’orbe est la marge tolérée autour de l’angle exact.',
        limites: 'Plus l’écart est petit, plus l’aspect est fort. Les aspects de la Lune changent vite : ils colorent la journée, pas la saison.',
        sectionMethodologie: 'ciel',
      },
      transits: {
        titre: 'Transits personnels',
        principe: 'Les transits comparent la position actuelle des planètes dans le ciel avec celles de ton thème natal. Ils montrent comment la météo collective du jour peut résonner avec ta sensibilité propre.',
        base: 'Aspects majeurs (conjonction, opposition, trigone, carré, sextile) entre planètes célestes et planètes natales. Orbes resserrés (1° à 3°) pour isoler les configurations réellement actives.',
        limites: 'Les planètes lentes (Jupiter à Neptune) marquent les grandes transformations sur plusieurs semaines ou mois. Les planètes rapides et la Lune apportent des déclencheurs ponctuels d’un à deux jours. Sans heure de naissance exacte, la position de la Lune natale reste indicative.',
        sectionMethodologie: 'transits',
      },
      croisee: {
        titre: 'Lecture croisée',
        principe: 'Faire dialoguer les deux langages : le nombre du jour est relié à une planète et à un élément, puis on regarde où se trouve cette planète aujourd’hui.',
        base: 'Table nombre ↔ planète la plus répandue (1 Soleil, 2 Lune, 3 Jupiter, 4 Uranus, 5 Mercure, 6 Vénus, 7 Neptune, 8 Saturne, 9 Mars) ; l’élément du nombre est celui du domicile de sa planète. Avec un profil, on croise le jour personnel.',
        limites: 'Les correspondances varient selon les écoles : celle-ci est un choix de Toiles. On liste des échos et des contrastes expliqués, jamais une note globale.',
        sectionMethodologie: 'correspondances',
      },
      lecon: {
        titre: 'Leçon du jour',
        principe: 'Chaque jour, une notion à apprendre, choisie parce qu’elle se voit dans le ciel ou les nombres de la date.',
        base: 'Priorité au plus rare : nouvelle ou pleine lune, planète qui change de sens, maître-nombre, aspect exact (< 0,5°), rétrogradation de Mercure, Vénus ou Mars ; sinon une notion de base qui tourne.',
        limites: 'Le texte vient des fiches du glossaire : la leçon choisit, elle ne réécrit pas. Les jours calmes, c’est une révision.',
        sectionMethodologie: 'leconDuJour',
      },
    },
  };
})(globalThis.Toiles = globalThis.Toiles || {});
