/**
 * Toiles — référentiel des villes et passage de l'heure légale au temps universel (TU).
 *
 * Pourquoi ce module ?
 * L'Ascendant et les maisons dépendent de l'heure EXACTE et du LIEU de naissance :
 *   - le lieu donne la latitude (inclinaison de l'horizon) et la longitude
 *     (décalage du temps sidéral local) ;
 *   - l'heure notée à l'état civil est une heure LÉGALE (heure d'hiver, heure d'été,
 *     heure allemande de 1940-1944…). Les calculs astronomiques, eux, se font en TU.
 *
 * Fuseaux et heures d'été historiques :
 * Plutôt que de recopier à la main l'historique des changements d'heure de chaque pays
 * (des centaines de règles, faciles à rater), Toiles s'appuie sur la base IANA des fuseaux
 * horaires (« tz database ») déjà présente dans tout navigateur moderne et dans Node,
 * via l'objet standard Intl.DateTimeFormat. Aucune dépendance, aucun téléchargement,
 * et ça marche en double-clic (file://). Il suffit de connaître le nom du fuseau
 * de la ville (ex. 'Europe/Paris').
 *
 * Limites :
 *   - la base IANA simplifie certaines périodes (France 1940-1945 : la zone libre n'a pas
 *     toujours suivi l'heure de la zone occupée) ; pour ces années, vérifier l'heure à la main ;
 *   - une ville absente de la liste → prendre la plus proche : 1° de longitude ≈ 4 minutes
 *     de temps sidéral ≈ 1° d'Ascendant environ.
 */
(function (T) {
  'use strict';

  // Fuseau horaire par défaut de chaque pays (nom IANA).
  const FUSEAUX = {
    'France': 'Europe/Paris',
    'Belgique': 'Europe/Brussels',
    'Suisse': 'Europe/Zurich',
    'Luxembourg': 'Europe/Luxembourg',
    'Monaco': 'Europe/Monaco',
    'Maroc': 'Africa/Casablanca',
    'Algérie': 'Africa/Algiers',
    'Tunisie': 'Africa/Tunis',
    'Sénégal': 'Africa/Dakar',
    "Côte d'Ivoire": 'Africa/Abidjan',
    'Guadeloupe': 'America/Guadeloupe',
    'Martinique': 'America/Martinique',
    'Guyane': 'America/Cayenne',
    'La Réunion': 'Indian/Reunion',
    'Mayotte': 'Indian/Mayotte',
    'Nouvelle-Calédonie': 'Pacific/Noumea',
    'Polynésie française': 'Pacific/Tahiti',
  };

  /** Une ville : nom, pays, latitude (+ = nord), longitude (+ = est), fuseau. */
  const v = (nom, pays, lat, lon, fuseau) => ({ nom, pays, lat, lon, fuseau: fuseau || FUSEAUX[pays] });

  // Coordonnées arrondies au centième de degré (≈ 1 km) : bien plus fin que nécessaire.
  // Tu peux ajouter ta ville : v('Nom', 'Pays', latitude, longitude[, 'Fuseau/IANA']).
  const VILLES = [
    // ---- France métropolitaine ----
    v('Paris', 'France', 48.86, 2.35),
    v('Marseille', 'France', 43.30, 5.37),
    v('Lyon', 'France', 45.76, 4.84),
    v('Toulouse', 'France', 43.60, 1.44),
    v('Nice', 'France', 43.70, 7.27),
    v('Nantes', 'France', 47.22, -1.55),
    v('Montpellier', 'France', 43.61, 3.88),
    v('Strasbourg', 'France', 48.57, 7.75),
    v('Bordeaux', 'France', 44.84, -0.58),
    v('Lille', 'France', 50.63, 3.06),
    v('Rennes', 'France', 48.11, -1.68),
    v('Reims', 'France', 49.26, 4.03),
    v('Toulon', 'France', 43.12, 5.93),
    v('Saint-Étienne', 'France', 45.44, 4.39),
    v('Le Havre', 'France', 49.49, 0.11),
    v('Grenoble', 'France', 45.19, 5.72),
    v('Dijon', 'France', 47.32, 5.04),
    v('Angers', 'France', 47.47, -0.55),
    v('Nîmes', 'France', 43.84, 4.36),
    v('Villeurbanne', 'France', 45.77, 4.88),
    v('Clermont-Ferrand', 'France', 45.78, 3.08),
    v('Le Mans', 'France', 48.00, 0.20),
    v('Aix-en-Provence', 'France', 43.53, 5.45),
    v('Brest', 'France', 48.39, -4.49),
    v('Tours', 'France', 47.39, 0.69),
    v('Amiens', 'France', 49.89, 2.30),
    v('Limoges', 'France', 45.83, 1.26),
    v('Annecy', 'France', 45.90, 6.13),
    v('Perpignan', 'France', 42.70, 2.90),
    v('Metz', 'France', 49.12, 6.18),
    v('Besançon', 'France', 47.24, 6.02),
    v('Orléans', 'France', 47.90, 1.91),
    v('Rouen', 'France', 49.44, 1.10),
    v('Mulhouse', 'France', 47.75, 7.34),
    v('Caen', 'France', 49.18, -0.37),
    v('Nancy', 'France', 48.69, 6.18),
    v('Argenteuil', 'France', 48.95, 2.25),
    v('Montreuil', 'France', 48.86, 2.44),
    v('Boulogne-Billancourt', 'France', 48.84, 2.24),
    v('Saint-Denis', 'France', 48.94, 2.36),
    v('Versailles', 'France', 48.80, 2.13),
    v('Rueil-Malmaison', 'France', 48.88, 2.18),
    v('Créteil', 'France', 48.79, 2.46),
    v('Nanterre', 'France', 48.89, 2.21),
    v('Avignon', 'France', 43.95, 4.81),
    v('Poitiers', 'France', 46.58, 0.34),
    v('La Rochelle', 'France', 46.16, -1.15),
    v('Pau', 'France', 43.30, -0.37),
    v('Bayonne', 'France', 43.49, -1.47),
    v('Calais', 'France', 50.95, 1.86),
    v('Dunkerque', 'France', 51.03, 2.38),
    v('Valence', 'France', 44.93, 4.89),
    v('Troyes', 'France', 48.30, 4.08),
    v('Chambéry', 'France', 45.56, 5.92),
    v('Lorient', 'France', 47.75, -3.37),
    v('Quimper', 'France', 48.00, -4.10),
    v('Vannes', 'France', 47.66, -2.76),
    v('Saint-Brieuc', 'France', 48.51, -2.76),
    v('Saint-Malo', 'France', 48.65, -2.03),
    v('Cherbourg', 'France', 49.64, -1.62),
    v('Colmar', 'France', 48.08, 7.36),
    v('Béziers', 'France', 43.34, 3.22),
    v('Ajaccio', 'France', 41.93, 8.74),
    v('Bastia', 'France', 42.70, 9.45),
    v('Cannes', 'France', 43.55, 7.01),
    v('Antibes', 'France', 43.58, 7.12),
    v('Angoulême', 'France', 45.65, 0.16),
    v('Niort', 'France', 46.32, -0.46),
    v('Bourges', 'France', 47.08, 2.40),
    v('Blois', 'France', 47.59, 1.33),
    v('Chartres', 'France', 48.45, 1.49),
    v('Laval', 'France', 48.07, -0.77),
    v('Cholet', 'France', 47.06, -0.88),
    v('Saint-Nazaire', 'France', 47.27, -2.21),
    v('Agen', 'France', 44.20, 0.62),
    v('Montauban', 'France', 44.02, 1.35),
    v('Albi', 'France', 43.93, 2.15),
    v('Tarbes', 'France', 43.23, 0.08),
    v('Carcassonne', 'France', 43.21, 2.35),
    v('Narbonne', 'France', 43.18, 3.00),
    v('Périgueux', 'France', 45.18, 0.72),
    v('Brive-la-Gaillarde', 'France', 45.16, 1.53),
    v('Aurillac', 'France', 44.93, 2.44),
    v('Rodez', 'France', 44.35, 2.57),
    v('Mende', 'France', 44.52, 3.50),
    v('Le Puy-en-Velay', 'France', 45.04, 3.88),
    v('Gap', 'France', 44.56, 6.08),
    v('Digne-les-Bains', 'France', 44.09, 6.24),
    v('Mâcon', 'France', 46.31, 4.83),
    v('Bourg-en-Bresse', 'France', 46.21, 5.23),
    v('Nevers', 'France', 46.99, 3.16),
    v('Auxerre', 'France', 47.80, 3.57),
    v('Châlons-en-Champagne', 'France', 48.96, 4.36),
    v('Charleville-Mézières', 'France', 49.77, 4.72),
    v('Épinal', 'France', 48.17, 6.45),
    v('Belfort', 'France', 47.64, 6.86),
    v('Arras', 'France', 50.29, 2.78),
    v('Beauvais', 'France', 49.43, 2.08),
    v('Évreux', 'France', 49.02, 1.15),
    v('Alençon', 'France', 48.43, 0.09),
    v('Saint-Lô', 'France', 49.12, -1.09),
    v('Châteauroux', 'France', 46.81, 1.69),
    v('Guéret', 'France', 46.17, 1.87),
    v('Tulle', 'France', 45.27, 1.77),
    v('Vichy', 'France', 46.13, 3.43),
    v('Moulins', 'France', 46.57, 3.33),
    v('Roanne', 'France', 46.04, 4.07),
    v('Lourdes', 'France', 43.09, -0.05),
    v('Biarritz', 'France', 43.48, -1.56),
    v('Arles', 'France', 43.68, 4.63),
    v('Fréjus', 'France', 43.43, 6.74),
    v('Thionville', 'France', 49.36, 6.17),
    v('Haguenau', 'France', 48.82, 7.79),
    v('Roubaix', 'France', 50.69, 3.18),
    v('Tourcoing', 'France', 50.72, 3.16),
    v('Valenciennes', 'France', 50.36, 3.52),
    v('Douai', 'France', 50.37, 3.08),
    v('Boulogne-sur-Mer', 'France', 50.73, 1.61),
    v('Saint-Quentin', 'France', 49.85, 3.29),
    v('Compiègne', 'France', 49.42, 2.83),
    v('Meaux', 'France', 48.96, 2.88),
    v('Melun', 'France', 48.54, 2.66),
    v('Évry', 'France', 48.63, 2.44),
    v('Cergy', 'France', 49.04, 2.08),
    v('Pontoise', 'France', 49.05, 2.10),
    // ---- Outre-mer ----
    v('Pointe-à-Pitre', 'Guadeloupe', 16.24, -61.53),
    v('Basse-Terre', 'Guadeloupe', 16.00, -61.73),
    v('Fort-de-France', 'Martinique', 14.60, -61.07),
    v('Cayenne', 'Guyane', 4.94, -52.33),
    v('Saint-Denis (La Réunion)', 'La Réunion', -20.88, 55.45),
    v('Saint-Pierre (La Réunion)', 'La Réunion', -21.34, 55.48),
    v('Mamoudzou', 'Mayotte', -12.78, 45.23),
    v('Nouméa', 'Nouvelle-Calédonie', -22.28, 166.46),
    v('Papeete', 'Polynésie française', -17.54, -149.57),
    // ---- Pays voisins et francophones ----
    v('Bruxelles', 'Belgique', 50.85, 4.35),
    v('Liège', 'Belgique', 50.63, 5.57),
    v('Charleroi', 'Belgique', 50.41, 4.44),
    v('Namur', 'Belgique', 50.47, 4.87),
    v('Mons', 'Belgique', 50.45, 3.95),
    v('Genève', 'Suisse', 46.20, 6.15),
    v('Lausanne', 'Suisse', 46.52, 6.63),
    v('Neuchâtel', 'Suisse', 46.99, 6.93),
    v('Fribourg', 'Suisse', 46.81, 7.16),
    v('Sion', 'Suisse', 46.23, 7.36),
    v('Berne', 'Suisse', 46.95, 7.45),
    v('Zurich', 'Suisse', 47.37, 8.54),
    v('Luxembourg', 'Luxembourg', 49.61, 6.13),
    v('Monaco', 'Monaco', 43.74, 7.42),
    v('Montréal', 'Canada', 45.50, -73.57, 'America/Toronto'),
    v('Québec', 'Canada', 46.81, -71.21, 'America/Toronto'),
    v('Casablanca', 'Maroc', 33.57, -7.59),
    v('Rabat', 'Maroc', 34.02, -6.83),
    v('Marrakech', 'Maroc', 31.63, -8.01),
    v('Alger', 'Algérie', 36.75, 3.06),
    v('Oran', 'Algérie', 35.70, -0.63),
    v('Constantine', 'Algérie', 36.37, 6.61),
    v('Tunis', 'Tunisie', 36.81, 10.18),
    v('Dakar', 'Sénégal', 14.69, -17.45),
    v('Abidjan', "Côte d'Ivoire", 5.36, -4.01),
  ];

  /** Minuscules sans accents ni tirets : « saint étienne » trouve « Saint-Étienne ». */
  const simplifier = (texte) => String(texte || '').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[-'’]/g, ' ').replace(/\s+/g, ' ').trim();

  /** Nom affiché dans la liste de choix : « Amiens (France) ». */
  const libelle = (ville) => `${ville.nom} (${ville.pays})`;

  /** Retrouve une ville par son nom ou son libellé ; null si inconnue. */
  function trouver(texte) {
    const cherche = simplifier(texte);
    if (!cherche) return null;
    return VILLES.find((ville) => simplifier(libelle(ville)) === cherche)
      || VILLES.find((ville) => simplifier(ville.nom) === cherche)
      || null;
  }

  // ---------- Heure légale → temps universel ----------

  /**
   * Décalage (en minutes, avec décimales) entre l'heure légale d'un fuseau et le TU,
   * à un instant donné. Ex. Paris en juillet 2000 → +120 (heure d'été, TU+2).
   *
   * Comment : on demande à Intl d'écrire l'instant en heure locale du fuseau,
   * on relit cette heure comme si c'était du TU, et la différence est le décalage.
   * Les secondes comptent : avant 1911, Paris vivait à l'heure locale de son méridien
   * (TU + 9 min 21 s), et la base IANA le sait.
   */
  function decalageMinutes(fuseau, instantMs) {
    const format = new Intl.DateTimeFormat('en-US', {
      timeZone: fuseau, hourCycle: 'h23',
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
    });
    const parts = {};
    for (const p of format.formatToParts(new Date(instantMs))) parts[p.type] = Number(p.value);
    const commeTU = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour % 24, parts.minute, parts.second);
    // On compare à la seconde près (l'instant de départ peut porter des millisecondes).
    return (commeTU - Math.floor(instantMs / 1000) * 1000) / 60000;
  }

  /**
   * Convertit une heure légale (« AAAA-MM-JJ », « HH:MM ») d'un fuseau en instant TU.
   *
   * Le piège : le décalage dépend de l'instant… que l'on cherche. On essaie donc les deux
   * décalages possibles autour de la date (12 h avant, 12 h après) et on garde celui
   * qui retombe bien sur l'heure demandée. Deux cas particuliers, une fois par an :
   *   - « inexistante » : au passage à l'heure d'été, de 2 h à 3 h n'existe pas ;
   *     on garde le décalage d'hiver (l'heure la plus probablement voulue) ;
   *   - « ambiguë » : au retour à l'heure d'hiver, de 2 h à 3 h existe deux fois ;
   *     on garde la première (encore en heure d'été).
   *
   * Renvoie { date (Date TU), decalage (minutes), statut: 'normale' | 'inexistante' | 'ambigue' }.
   */
  function heureLegaleVersTU(jourTexte, heureTexte, fuseau) {
    const [a, m, j] = jourTexte.split('-').map(Number);
    const [h, min] = heureTexte.split(':').map(Number);
    const commeSiTU = Date.UTC(a, m - 1, j, h, min);
    const DOUZE_HEURES = 12 * 3600000;

    const candidats = [...new Set([
      decalageMinutes(fuseau, commeSiTU - DOUZE_HEURES),
      decalageMinutes(fuseau, commeSiTU + DOUZE_HEURES),
    ])];
    // Un décalage est valable si l'instant obtenu a bien ce décalage-là.
    const valables = candidats.filter((dec) => decalageMinutes(fuseau, commeSiTU - dec * 60000) === dec);

    let decalage, statut;
    if (valables.length === 0) {
      decalage = candidats[0]; statut = 'inexistante';
    } else if (valables.length > 1) {
      decalage = Math.max(...valables); statut = 'ambigue';   // plus grand décalage = heure d'été = instant le plus tôt
    } else {
      decalage = valables[0]; statut = 'normale';
    }
    return { date: new Date(commeSiTU - decalage * 60000), decalage, statut };
  }

  /** +120 → « TU+2 », +60 → « TU+1 », +9,35 → « TU+0 h 09 min 21 s ». */
  function texteDecalage(decalageMin) {
    const signe = decalageMin < 0 ? '−' : '+';
    const total = Math.round(Math.abs(decalageMin) * 60);
    const h = Math.floor(total / 3600), mn = Math.floor((total % 3600) / 60), s = total % 60;
    if (!mn && !s) return `TU${signe}${h}`;
    if (!s) return `TU${signe}${h} h ${String(mn).padStart(2, '0')}`;
    return `TU${signe}${h} h ${String(mn).padStart(2, '0')} min ${String(s).padStart(2, '0')} s`;
  }

  T.villes = { VILLES, FUSEAUX, trouver, libelle, simplifier, decalageMinutes, heureLegaleVersTU, texteDecalage };
})(globalThis.Toiles = globalThis.Toiles || {});
