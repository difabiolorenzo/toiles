/**
 * Toiles — module Profils.
 *
 * Gère seulement les DONNÉES des profils (pas l'affichage, qui est dans app.js).
 * Un profil : { id, nom, naissance: 'AAAA-MM-JJ', heure, lieu, nomComplet }
 *   heure : 'HH:MM' (heure LÉGALE notée à l'état civil) ou null si inconnue ;
 *   lieu  : { nom, pays, lat, lon, fuseau } (copié depuis src/villes.js) ou null.
 *   nomComplet : nom de naissance complet (prénoms + nom) pour la numérologie du nom, ou null.
 *   Ces trois champs sont facultatifs ; heure et lieu, ensemble, ils permettent l'Ascendant et les maisons
 *   (src/maisons.js). Le lieu est COPIÉ dans le profil (et non référencé par son nom)
 *   pour qu'une correction future de la table des villes ne change pas un thème en silence.
 *
 * Stockage : localStorage du navigateur, sous une seule clé.
 *   - Si le stockage est bloqué (navigation privée, réglages…), on garde les profils
 *     en mémoire le temps de la visite : la page marche, mais rien n'est retenu.
 *   - Dans Node (tests), localStorage n'existe pas : même solution en mémoire.
 */
(function (T) {
  'use strict';

  const CLE = 'toiles_profils';
  const CLE_ACTIF = 'toiles_profil_actif';

  // ---------- Accès au stockage, sans jamais planter ----------
  const secours = {}; // utilisé si localStorage est absent ou bloqué
  const stockage = {
    lire(cle) {
      try { return globalThis.localStorage.getItem(cle); } catch { return secours[cle] ?? null; }
    },
    ecrire(cle, valeur) {
      try { globalThis.localStorage.setItem(cle, valeur); } catch { secours[cle] = valeur; }
    },
  };

  /** Lit la liste ; un contenu abîmé donne une liste vide plutôt qu'une erreur. */
  function lister() {
    try {
      const liste = JSON.parse(stockage.lire(CLE) || '[]');
      return Array.isArray(liste) ? liste : [];
    } catch {
      return [];
    }
  }

  function enregistrer(liste) {
    stockage.ecrire(CLE, JSON.stringify(liste));
  }

  const obtenir = (id) => lister().find((p) => p.id === id) || null;

  /** Vérifie un profil avant de l'enregistrer. Renvoie un message d'erreur, ou null si tout va bien. */
  function verifier({ nom, naissance, heure, lieu, nomComplet }) {
    if (typeof nom !== 'string' || !nom.trim()) return 'Le nom est obligatoire.';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(naissance || '') || isNaN(Date.parse(naissance))) return 'La date de naissance est obligatoire.';
    if (nomComplet != null && typeof nomComplet !== 'string') return 'Le nom complet doit être un texte.';
    if (heure && !/^([01]\d|2[0-3]):[0-5]\d$/.test(heure)) return 'L’heure de naissance doit être au format HH:MM.';
    if (lieu && !(typeof lieu.lat === 'number' && typeof lieu.lon === 'number' && lieu.fuseau && lieu.nom))
      return 'Le lieu de naissance est incomplet.';
    return null;
  }

  /** Identifiant unique simple : horodatage + hasard (pas besoin de plus pour un usage personnel). */
  const nouvelId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  function ajouter(champs) {
    const erreur = verifier(champs);
    if (erreur) throw new Error(erreur);
    const profil = {
      id: nouvelId(), nom: champs.nom.trim(), naissance: champs.naissance,
      heure: champs.heure || null, lieu: champs.lieu || null,
      nomComplet: (champs.nomComplet || '').trim() || null,
    };
    enregistrer([...lister(), profil]);
    return profil;
  }

  function modifier(id, champs) {
    const liste = lister();
    const i = liste.findIndex((p) => p.id === id);
    if (i < 0) throw new Error('Profil introuvable.');
    const nouveau = { ...liste[i], ...champs, id };
    const erreur = verifier(nouveau);
    if (erreur) throw new Error(erreur);
    nouveau.nom = nouveau.nom.trim();
    nouveau.heure = nouveau.heure || null;   // champ vidé → null (pas de chaîne vide)
    nouveau.lieu = nouveau.lieu || null;
    nouveau.nomComplet = (nouveau.nomComplet || '').trim() || null;
    liste[i] = nouveau;
    enregistrer(liste);
    return nouveau;
  }

  function supprimer(id) {
    enregistrer(lister().filter((p) => p.id !== id));
    if (actif() === id) choisirActif('');
  }

  // ---------- Profil actif (le dernier choisi, retrouvé à la visite suivante) ----------
  // Valeurs possibles : '' (aucun), 'autre' (date tapée à la main), ou l'id d'un profil.
  function actif() {
    const v = stockage.lire(CLE_ACTIF) || '';
    return v === 'autre' || v === '' || obtenir(v) ? v : '';
  }
  const choisirActif = (valeur) => stockage.ecrire(CLE_ACTIF, valeur);

  /** Contenu du fichier de sauvegarde (.json), lisible à l'œil. */
  function exporter() {
    return JSON.stringify({ application: 'Toiles', version: 1, date: new Date().toISOString(), profils: lister() }, null, 2);
  }

  // ---------- Import du fichier de sauvegarde ----------
  /**
   * Deux profils sont des DOUBLONS s'ils ont le même nom (sans tenir compte des
   * majuscules, accents et espaces) et la même date de naissance. On ne compare
   * pas l'identifiant : un profil recréé à la main a un autre id, mais c'est
   * bien la même personne.
   */
  const empreinte = (p) => String(p.nom).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/\s+/g, ' ').trim() + '|' + p.naissance;

  /**
   * Recharge un fichier de sauvegarde (texte JSON produit par exporter()).
   * Accepte aussi une simple liste de profils.
   * Ne remplace jamais un profil existant : les doublons sont ignorés, les
   * profils invalides sont écartés avec leur raison.
   * Renvoie { ajoutes: [profils], doublons: [noms], invalides: [{ nom, raison }] }.
   * Lève une erreur (message en français) si le fichier lui-même n'est pas lisible.
   */
  function importer(texte) {
    let donnees;
    try { donnees = JSON.parse(texte); } catch { throw new Error('Ce fichier n’est pas un JSON lisible.'); }
    const liste = Array.isArray(donnees) ? donnees : donnees && donnees.profils;
    if (!Array.isArray(liste)) throw new Error('Aucune liste de profils trouvée dans ce fichier.');
    if (donnees && !Array.isArray(donnees) && donnees.application && donnees.application !== 'Toiles')
      throw new Error(`Ce fichier vient de « ${donnees.application} », pas de Toiles.`);

    const existants = lister();
    const vus = new Set(existants.map(empreinte));
    const ids = new Set(existants.map((p) => p.id));
    const resultat = { ajoutes: [], doublons: [], invalides: [] };

    for (const brut of liste) {
      const nomAffiche = brut && typeof brut.nom === 'string' && brut.nom.trim() ? brut.nom.trim() : '(sans nom)';
      if (!brut || typeof brut !== 'object') { resultat.invalides.push({ nom: nomAffiche, raison: 'entrée illisible' }); continue; }
      const erreur = verifier(brut);
      if (erreur) { resultat.invalides.push({ nom: nomAffiche, raison: erreur }); continue; }
      if (vus.has(empreinte(brut))) { resultat.doublons.push(nomAffiche); continue; }
      // On garde l'id d'origine s'il est libre (le profil actif d'une autre machine
      // reste reconnaissable), sinon on en crée un.
      const id = typeof brut.id === 'string' && brut.id && !ids.has(brut.id) ? brut.id : nouvelId();
      const profil = {
        id, nom: brut.nom.trim(), naissance: brut.naissance,
        heure: brut.heure || null, lieu: brut.lieu || null,
        nomComplet: (brut.nomComplet || '').trim() || null,
      };
      vus.add(empreinte(profil));
      ids.add(id);
      resultat.ajoutes.push(profil);
    }
    if (resultat.ajoutes.length) enregistrer([...existants, ...resultat.ajoutes]);
    return resultat;
  }

  T.profils = { lister, obtenir, ajouter, modifier, supprimer, actif, choisirActif, exporter, importer, verifier };
})(globalThis.Toiles = globalThis.Toiles || {});
