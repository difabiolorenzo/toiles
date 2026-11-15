/**
 * Toiles — module Numérologie
 * Vanilla JS, sans dépendance. Expose window.Toiles.numerologie (ou globalThis).
 *
 * Deux familles de nombres :
 *  - UNIVERSELS : l'énergie collective d'une période (même pour tout le monde)
 *  - PERSONNELS : l'énergie d'une période pour une personne (nécessite sa date de naissance)
 */
(function (T) {
  'use strict';

  const MAITRES = [11, 22, 33];

  /** Somme des chiffres d'un nombre (ex. 2026 -> 10). */
  function sommeChiffres(n) {
    return String(Math.abs(n)).split('').reduce((s, c) => s + Number(c), 0);
  }

  /** Réduction théosophique jusqu'à 1 chiffre, en conservant 11/22/33 si demandé. */
  function reduire(n, garderMaitres = true) {
    while (n > 9) {
      if (garderMaitres && MAITRES.includes(n)) return n;
      n = sommeChiffres(n);
    }
    return n;
  }

  /** Numéro de semaine ISO 8601 (1–53). */
  function semaineISO(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const jour = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - jour);
    const debut = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil(((d - debut) / 86400000 + 1) / 7);
  }

  // =====================================================================
  //  CASCADE DES PÉRIODES (NOMBRES UNIVERSELS ET PERSONNELS)
  //
  //  Pourquoi une « cascade » en numérologie ?
  //  Dans la tradition pythagoricienne, le temps n'est pas une succession
  //  d'instants découpés arbitrairement, mais une suite de cycles emboîtés
  //  comme des poupées russes. Un cycle court s'exprime toujours à l'intérieur
  //  du climat du cycle plus vaste qui l'englobe :
  //
  //  1. L'Année (cycle macroscopique de 9 ans) :
  //     Fixe la toile de fond, la thématique générale de l'évolution.
  //
  //  2. Le Mois (inflexion saisonnière au sein de l'année) :
  //     Il ne se calcule pas isolément. Il découle de l'année en cours :
  //        mois = reduire(annee + numeroDuMois)
  //     Pourquoi ? Parce qu'un mois de mai (5) n'a pas la même résonance dans
  //     une Année 1 (élan initial : 1 + 5 = 6, harmonie et structuration)
  //     que dans une Année 9 (clôture de cycle : 9 + 5 = 14 → 5, transition et rupture).
  //
  //  3. Le Jour (concrétisation au quotidien) :
  //     Il s'ancre dans l'énergie du mois qui le porte :
  //        jour = reduire(mois + jourDuMois)
  //     Le jour matérialise pas à pas les leçons et opportunités du mois.
  //
  //  4. La Semaine (convention Toiles) :
  //     La tradition classique n'a pas fixé de règle universelle pour la semaine.
  //     Pour respecter la logique de cascade sans invention obscure, Toiles greffe
  //     la semaine civile standard (norme ISO 8601) directement sur le mois actif :
  //        semaine = reduire(mois + reduire(semaineISO))
  //
  //  5. Nombres universels vs personnels :
  //     - Les nombres universels donnent la tonalité collective partagée par tous.
  //     - Les nombres personnels individualisent cette météo : ils additionnent l'empreinte
  //       natale (jour et mois de naissance réduits) à l'année universelle collective.
  //       L'année personnelle ainsi obtenue cascade ensuite vers le mois personnel,
  //       la semaine personnelle et le jour personnel.
  //
  //  6. Préservation des maîtres-nombres :
  //     À chaque marche de l'addition, si le total donne 11, 22 ou 33, la réduction
  //     est suspendue : on conserve la vibration intensifiée du maître-nombre pour
  //     irriguer la période et les calculs descendants suivants.
  // =====================================================================

  // ---------- Nombres universels ----------
  function anneeUniverselle(date) { return reduire(sommeChiffres(date.getFullYear())); }
  function moisUniversel(date)    { return reduire(anneeUniverselle(date) + (date.getMonth() + 1)); }
  /** Convention Toiles : semaine = mois universel + n° de semaine ISO (à ajuster si tu préfères une autre école). */
  function semaineUniverselle(date) { return reduire(moisUniversel(date) + reduire(semaineISO(date))); }
  function jourUniversel(date)    { return reduire(moisUniversel(date) + date.getDate()); }

  // ---------- Nombres personnels ----------
  function anneePersonnelle(date, naissance) {
    return reduire(reduire(naissance.getDate()) + reduire(naissance.getMonth() + 1) + anneeUniverselle(date));
  }
  function moisPersonnel(date, naissance)    { return reduire(anneePersonnelle(date, naissance) + (date.getMonth() + 1)); }
  function semainePersonnelle(date, naissance) { return reduire(moisPersonnel(date, naissance) + reduire(semaineISO(date))); }
  function jourPersonnel(date, naissance)    { return reduire(moisPersonnel(date, naissance) + date.getDate()); }

  /** Chemin de vie (nombre de naissance). */
  function cheminDeVie(naissance) {
    return reduire(
      reduire(naissance.getDate()) + reduire(naissance.getMonth() + 1) + reduire(sommeChiffres(naissance.getFullYear()))
    );
  }

  // ---------- Interprétations par domaine ----------
  const DOMAINES = ['essence', 'amour', 'travail', 'finances', 'sante', 'spiritualite'];

  // Le sens des nombres (mot-clé, 6 domaines, lumière, ombre) vit dans
  // src/glossaire.js, avec toutes les autres définitions : un seul endroit à
  // relire et à corriger. Clé : "nombre" + valeur (ex. nombre7, nombre11).
  //
  // Pourquoi lire le glossaire « au moment de l'appel » et pas au chargement ?
  // numerologie.js est chargé AVANT glossaire.js dans index.html : au moment où
  // ce fichier s'exécute, Toiles.glossaire n'existe pas encore. En allant le
  // chercher dans interpreter(), on l'utilise une fois que tout est chargé.

  /** Interprétation d'un nombre, optionnellement filtrée par domaine. */
  function interpreter(n, domaine) {
    const fiche = T.glossaire && T.glossaire['nombre' + n];
    if (!fiche) return null;
    if (domaine) return { nombre: n, mot: fiche.mot, domaine, texte: fiche.domaines[domaine] };
    return { nombre: n, mot: fiche.mot, ...fiche.domaines, lumiere: fiche.lumiere, ombre: fiche.ombre };
  }

  /** Vue d'ensemble pour une date (et une naissance optionnelle). */
  function profil(date, naissance) {
    const out = {
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      semaineISO: semaineISO(date),
      universel: {
        annee: anneeUniverselle(date),
        mois: moisUniversel(date),
        semaine: semaineUniverselle(date),
        jour: jourUniversel(date),
      },
    };
    if (naissance) {
      out.cheminDeVie = cheminDeVie(naissance);
      out.personnel = {
        annee: anneePersonnelle(date, naissance),
        mois: moisPersonnel(date, naissance),
        semaine: semainePersonnelle(date, naissance),
        jour: jourPersonnel(date, naissance),
      };
    }
    return out;
  }

  // ---------- Calcul détaillé (pour apprendre) ----------
  //
  // Les fonctions ci-dessus donnent seulement le résultat. Celles-ci refont le
  // même calcul en notant chaque étape sous forme de phrase, pour que l'on
  // puisse vérifier à la main. Elles ne remplacent pas les fonctions rapides :
  // un test (voir TODO) vérifie que les deux donnent toujours le même nombre.

  /** "2026" → "2+0+2+6" : écrit l'addition des chiffres d'un nombre. */
  function addition(n) {
    return String(n).split('').join('+');
  }

  /**
   * Réduit un nombre en notant les étapes.
   * Ex. 29 → ["29 → 2+9 = 11 (maître-nombre, on s'arrête)"]
   * Renvoie { valeur, etapes }.
   */
  function reduireAvecEtapes(n) {
    const etapes = [];
    while (n > 9) {
      if (MAITRES.includes(n)) {
        etapes.push(`${n} est un maître-nombre : on le garde.`);
        return { valeur: n, etapes };
      }
      const suivant = sommeChiffres(n);
      etapes.push(`${n} → ${addition(n)} = ${suivant}`);
      n = suivant;
    }
    return { valeur: n, etapes };
  }

  /**
   * Ajoute « a + b », puis réduit le total. Sert à chaque marche de la cascade
   * année → mois → semaine/jour.
   * nomA / nomB décrivent les deux termes dans la phrase affichée.
   */
  function additionner(nomA, a, nomB, b) {
    const total = a + b;
    const r = reduireAvecEtapes(total);
    return {
      valeur: r.valeur,
      etapes: [`${nomA} (${a}) + ${nomB} (${b}) = ${total}`, ...r.etapes],
    };
  }

  /**
   * Explique un nombre de la vue Aujourd'hui.
   * type      : 'annee' | 'mois' | 'semaine' | 'jour'
   * personnel : false → nombre universel ; true → nombre personnel (naissance requise)
   * Renvoie { valeur, etapes } ; etapes est une liste de phrases à afficher.
   */
  function expliquer(type, date, naissance, personnel = false) {
    // 1re marche : l'année (universelle ou personnelle).
    const annee = date.getFullYear();
    const au = reduireAvecEtapes(sommeChiffres(annee));
    let base = {
      valeur: au.valeur,
      etapes: [`Année ${annee} → ${addition(annee)} = ${sommeChiffres(annee)}`, ...au.etapes],
    };
    let nomBase = 'année universelle';

    if (personnel) {
      // Année personnelle = jour de naissance + mois de naissance + année universelle,
      // chacun réduit avant l'addition.
      const j = reduire(naissance.getDate());
      const m = reduire(naissance.getMonth() + 1);
      const total = j + m + au.valeur;
      const r = reduireAvecEtapes(total);
      base = {
        valeur: r.valeur,
        etapes: [
          ...base.etapes.map((e) => 'Année universelle : ' + e),
          `Jour de naissance (${naissance.getDate()} → ${j}) + mois de naissance (${naissance.getMonth() + 1} → ${m}) + année universelle (${au.valeur}) = ${total}`,
          ...r.etapes,
        ],
      };
      nomBase = 'année personnelle';
    }
    if (type === 'annee') return base;

    // 2e marche : le mois = année + n° du mois.
    const mois = additionner(nomBase, base.valeur, 'mois', date.getMonth() + 1);
    mois.etapes = [...base.etapes, ...mois.etapes];
    if (type === 'mois') return mois;

    const nomMois = personnel ? 'mois personnel' : 'mois universel';

    // 3e marche : la semaine = mois + n° de semaine ISO réduit (convention Toiles).
    if (type === 'semaine') {
      const s = semaineISO(date);
      const sr = reduire(s);
      const r = additionner(nomMois, mois.valeur, `semaine ISO ${s}${s > 9 && sr !== s ? ' réduite' : ''}`, sr);
      return { valeur: r.valeur, etapes: [...mois.etapes, ...r.etapes] };
    }

    // 3e marche : le jour = mois + jour du mois.
    const r = additionner(nomMois, mois.valeur, 'jour', date.getDate());
    return { valeur: r.valeur, etapes: [...mois.etapes, ...r.etapes] };
  }

  /**
   * Version courte du calcul du jour universel, pour l'afficher sous le nombre :
   *   "2+0+2+6 = 10 → 1 · 1 + 11 = 12 → 3 · 3 + 15 = 18 → 9"
   * (année réduite · + mois · + jour). On suit la MÊME cascade que
   * jourUniversel(), et pas la somme de tous les chiffres de la date :
   * les deux diffèrent quand un maître-nombre apparaît en chemin.
   */
  function additionDuJour(date) {
    const fleche = (total, valeur) => (total === valeur ? `${total}` : `${total} → ${valeur}`);
    const annee = date.getFullYear();
    const au = reduire(sommeChiffres(annee));
    const mois = date.getMonth() + 1, jourDuMois = date.getDate();
    const mu = reduire(au + mois);
    const ju = reduire(mu + jourDuMois);
    return {
      valeur: ju,
      texte: `${addition(annee)} = ${fleche(sommeChiffres(annee), au)}` +
        ` · ${au} + ${mois} = ${fleche(au + mois, mu)}` +
        ` · ${mu} + ${jourDuMois} = ${fleche(mu + jourDuMois, ju)}`,
    };
  }

  T.numerologie = {
    additionDuJour,
    reduire, sommeChiffres, semaineISO, reduireAvecEtapes, expliquer,
    anneeUniverselle, moisUniversel, semaineUniverselle, jourUniversel,
    anneePersonnelle, moisPersonnel, semainePersonnelle, jourPersonnel,
    cheminDeVie, interpreter, profil, DOMAINES,
  };
})(globalThis.Toiles = globalThis.Toiles || {});
