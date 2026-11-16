/**
 * Toiles — Journal de bord.
 *
 * Noter chaque jour son ressenti face aux configurations du jour, c'est la
 * meilleure façon d'apprendre : au bout de quelques semaines, on peut relire
 * ce qu'on a vécu les jours « 7 », ou pendant une rétrogradation de Mercure,
 * et se faire sa propre idée.
 *
 * Une entrée : {
 *   date: 'AAAA-MM-JJ', profil: id ou '' (aucun),
 *   texte, humeur: 1–5 ou null,
 *   contexte: { jourUniversel, jourPersonnel, phase, teinte }   ← photo du jour
 *   modifie: horodatage ISO
 * }
 * Le CONTEXTE est recopié au moment de l'écriture : si un calcul de Toiles est
 * corrigé plus tard, l'entrée garde ce que tu avais sous les yeux ce jour-là.
 *
 * Une entrée par jour ET par profil (on peut tenir un journal pour deux personnes).
 * Stockage : localStorage, clé 'toiles_journal', toujours dans un try/catch ;
 * repli en mémoire si le stockage est bloqué (comme src/profils.js).
 * Aucun accès à la page ici : src/app.js s'occupe de l'affichage.
 */
(function (T) {
  'use strict';

  const CLE = 'toiles_journal';

  const secours = {};
  const stockage = {
    lire() {
      try { return globalThis.localStorage.getItem(CLE); } catch { return secours[CLE] ?? null; }
    },
    ecrire(valeur) {
      try { globalThis.localStorage.setItem(CLE, valeur); } catch { secours[CLE] = valeur; }
    },
  };

  /** Toutes les entrées, de la plus récente à la plus ancienne. */
  function lister(profil) {
    let liste;
    try {
      liste = JSON.parse(stockage.lire() || '[]');
      if (!Array.isArray(liste)) liste = [];
    } catch {
      liste = [];
    }
    if (profil !== undefined) liste = liste.filter((e) => (e.profil || '') === (profil || ''));
    return liste.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  }

  const memeEntree = (e, date, profil) => e.date === date && (e.profil || '') === (profil || '');

  /** L'entrée d'un jour pour un profil, ou null. */
  function lire(date, profil = '') {
    return lister().find((e) => memeEntree(e, date, profil)) || null;
  }

  /**
   * La « photo » du jour enregistrée avec l'entrée : les repères les plus
   * parlants pour relire plus tard. date : objet Date (midi local).
   */
  function contexteDuJour(date, naissance) {
    const N = T.numerologie, A = T.astres;
    return {
      jourUniversel: N.jourUniversel(date),
      jourPersonnel: naissance ? N.jourPersonnel(date, naissance) : null,
      phase: A.phaseLunaire(date).nom,
      teinte: A.teinteDuJour(A.positions(date)).element,
    };
  }

  /**
   * Crée ou remplace l'entrée d'un jour. Un texte vide (et pas d'humeur) efface l'entrée.
   * Renvoie l'entrée enregistrée, ou null si elle a été effacée.
   */
  function ecrire({ date, profil = '', texte = '', humeur = null, contexte = null }) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('Date du journal invalide.');
    if (humeur !== null && !(Number.isInteger(humeur) && humeur >= 1 && humeur <= 5))
      throw new Error('L’humeur va de 1 à 5.');
    const autres = lister().filter((e) => !memeEntree(e, date, profil));
    const propre = String(texte).trim();
    if (!propre && humeur === null) {
      stockage.ecrire(JSON.stringify(autres));
      return null;
    }
    const entree = { date, profil: profil || '', texte: propre, humeur, contexte, modifie: new Date().toISOString() };
    stockage.ecrire(JSON.stringify([...autres, entree]));
    return entree;
  }

  function effacer(date, profil = '') {
    stockage.ecrire(JSON.stringify(lister().filter((e) => !memeEntree(e, date, profil))));
  }

  /** Dates (AAAA-MM-JJ) où une entrée existe, pour marquer le calendrier. */
  const datesRemplies = (profil = '') => new Set(lister(profil).map((e) => e.date));

  /** Fichier de sauvegarde (.json), lisible à l'œil. */
  function exporter() {
    return JSON.stringify({ application: 'Toiles', type: 'journal', version: 1, date: new Date().toISOString(), entrees: lister() }, null, 2);
  }

  /**
   * Export texte (Markdown) : pour relire son journal dans n'importe quel éditeur.
   * nomsProfils : { id: nom } pour écrire le nom plutôt que l'identifiant.
   */
  function exporterTexte(nomsProfils = {}) {
    const lignes = ['# Journal de bord — Toiles', ''];
    for (const e of lister()) {
      const c = e.contexte || {};
      const qui = e.profil ? ` — ${nomsProfils[e.profil] || 'profil ' + e.profil}` : '';
      lignes.push(`## ${e.date.split('-').reverse().join('/')}${qui}`);
      const reperes = [
        c.jourUniversel != null && `jour universel ${c.jourUniversel}`,
        c.jourPersonnel != null && `jour personnel ${c.jourPersonnel}`,
        c.phase, c.teinte && `teinte ${c.teinte}`,
        e.humeur && `humeur ${e.humeur}/5`,
      ].filter(Boolean);
      if (reperes.length) lignes.push(`*${reperes.join(' · ')}*`, '');
      lignes.push(e.texte || '(sans texte)', '');
    }
    return lignes.join('\n');
  }

  T.journal = { lister, lire, ecrire, effacer, contexteDuJour, datesRemplies, exporter, exporterTexte };
})(globalThis.Toiles = globalThis.Toiles || {});
