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
    infobulles: {
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
        principe: 'Les transits comparent la position actuelle des planètes dans le ciel avec celles de votre thème natal. Ils révèlent comment la météo collective du jour résonne intimement avec votre sensibilité propre.',
        base: 'Aspects majeurs (conjonction, opposition, trigone, carré, sextile) entre planètes célestes et planètes natales. Orbes resserrés (1° à 3°) pour isoler les configurations réellement actives.',
        limites: 'Les planètes lentes (Jupiter à Neptune) marquent les grandes transformations sur plusieurs semaines ou mois. Les planètes rapides et la Lune apportent des déclencheurs ponctuels d’un à deux jours. Sans heure de naissance exacte, la position de la Lune natale reste indicative.',
        sectionMethodologie: 'transits',
      },
    },
  };
})(globalThis.Toiles = globalThis.Toiles || {});
