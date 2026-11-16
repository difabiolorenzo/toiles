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
  //  Dans la numérologie moderne (convention du XXe siècle, malgré le nom
  //  « pythagoricienne »), le temps n'est pas une succession
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

  // =====================================================================
  //  CYCLES LONGS : cycle de 9 ans, cycles de vie, pinacles et défis
  //
  //  Les nombres de la vue Aujourd'hui découpent le temps en années, mois et
  //  jours. La numérologie lit aussi des périodes de plusieurs années, toutes
  //  tirées de la date de naissance :
  //   - le CYCLE DE 9 ANS : l'année personnelle va de 1 à 9 puis recommence ;
  //     on repère l'année 1 qui a ouvert le cycle en cours ;
  //   - les 3 CYCLES DE VIE : la jeunesse (mois de naissance), la maturité
  //     (jour), la sagesse (année) ;
  //   - les 4 PINACLES (« sommets ») : les opportunités d'une période ;
  //   - les 4 DÉFIS : la difficulté à travailler pendant la même période.
  //
  //  Conventions Toiles (les écoles varient, on le signale dans la méthodologie) :
  //   - mois, jour et année de naissance sont d'abord réduits à UN chiffre
  //     (sans maître-nombre : 29 → 11 → 2) ;
  //   - pinacles : réduits en gardant les maîtres-nombres (5 + 6 = 11 reste 11) ;
  //   - défis : différences, donc toujours entre 0 et 8 (0 = « défi du choix ») ;
  //   - le 1er pinacle finit à 36 − chemin de vie (chemin réduit à un chiffre :
  //     11 → 2, 22 → 4, 33 → 6), les deux suivants durent 9 ans, le 4e jusqu'au bout ;
  //   - les cycles de vie suivent les mêmes âges : jeunesse = 1er pinacle,
  //     maturité = 2e et 3e pinacles, sagesse = 4e.
  //  Les âges sont des anniversaires : « de 0 à 33 ans » = jusqu'au 33e anniversaire.
  // =====================================================================

  /**
   * Position dans le cycle de 9 ans à une date.
   * Renvoie { rang: 1–9, anneeDebut, anneeFin }. Les maîtres-nombres comptent
   * pour leur racine (année personnelle 11 = 2e année du cycle).
   */
  function cycleNeufAns(date, naissance) {
    const rang = reduire(anneePersonnelle(date, naissance), false);
    const anneeDebut = date.getFullYear() - (rang - 1);
    return { rang, anneeDebut, anneeFin: anneeDebut + 8 };
  }

  /**
   * Cycles de vie, pinacles et défis d'une naissance.
   * date (facultative) : marque comme « actif » le pinacle / cycle en cours.
   */
  function cyclesLongs(naissance, date) {
    const un = (n) => reduire(n, false);   // réduction à un chiffre, sans maître-nombre
    const m = un(naissance.getMonth() + 1);
    const j = un(naissance.getDate());
    const a = un(sommeChiffres(naissance.getFullYear()));
    const chemin = un(cheminDeVie(naissance));

    // Âges de fin (anniversaires) des trois premiers pinacles.
    const fin1 = 36 - chemin, fin2 = fin1 + 9, fin3 = fin2 + 9;
    const p1 = reduire(m + j), p2 = reduire(j + a);
    const p3 = reduire(p1 + p2), p4 = reduire(m + a);
    const d1 = Math.abs(m - j), d2 = Math.abs(j - a);
    const d3 = Math.abs(d1 - d2), d4 = Math.abs(m - a);

    const periode = (debut, fin) => ({
      ageDebut: debut, ageFin: fin,
      anneeDebut: naissance.getFullYear() + debut,
      anneeFin: fin === null ? null : naissance.getFullYear() + fin,
    });
    const periodes = [periode(0, fin1), periode(fin1, fin2), periode(fin2, fin3), periode(fin3, null)];
    const pinacles = [
      { rang: 1, valeur: p1, calcul: `mois (${m}) + jour (${j}) = ${m + j}`, ...periodes[0] },
      { rang: 2, valeur: p2, calcul: `jour (${j}) + année (${a}) = ${j + a}`, ...periodes[1] },
      { rang: 3, valeur: p3, calcul: `1er pinacle (${p1}) + 2e pinacle (${p2}) = ${p1 + p2}`, ...periodes[2] },
      { rang: 4, valeur: p4, calcul: `mois (${m}) + année (${a}) = ${m + a}`, ...periodes[3] },
    ];
    const defis = [
      { rang: 1, valeur: d1, calcul: `|mois (${m}) − jour (${j})|`, ...periodes[0] },
      { rang: 2, valeur: d2, calcul: `|jour (${j}) − année (${a})|`, ...periodes[1] },
      { rang: 3, valeur: d3, calcul: `|1er défi (${d1}) − 2e défi (${d2})|`, ...periodes[2] },
      { rang: 4, valeur: d4, calcul: `|mois (${m}) − année (${a})|`, ...periodes[3] },
    ];
    const cyclesDeVie = [
      { nom: 'Jeunesse', valeur: reduire(naissance.getMonth() + 1), source: 'mois de naissance', ...periode(0, fin1) },
      { nom: 'Maturité', valeur: reduire(naissance.getDate()), source: 'jour de naissance', ...periode(fin1, fin3) },
      { nom: 'Sagesse', valeur: reduire(sommeChiffres(naissance.getFullYear())), source: 'année de naissance', ...periode(fin3, null) },
    ];

    // Période en cours : on compare l'âge (en anniversaires révolus) aux bornes.
    if (date) {
      const age = ageRevolu(naissance, date);
      const enCours = (p) => age >= p.ageDebut && (p.ageFin === null || age < p.ageFin);
      for (const liste of [pinacles, defis, cyclesDeVie]) for (const p of liste) p.actif = enCours(p);
    }
    return {
      base: { mois: m, jour: j, annee: a, chemin },
      pinacles, defis, cyclesDeVie,
      cycleNeufAns: date ? cycleNeufAns(date, naissance) : null,
      age: date ? ageRevolu(naissance, date) : null,
    };
  }

  /** Âge en années révolues (anniversaire passé ou non dans l'année). */
  function ageRevolu(naissance, date) {
    let age = date.getFullYear() - naissance.getFullYear();
    const avantAnniversaire = date.getMonth() < naissance.getMonth() ||
      (date.getMonth() === naissance.getMonth() && date.getDate() < naissance.getDate());
    if (avantAnniversaire) age--;
    return age;
  }

  // =====================================================================
  //  NUMÉROLOGIE DU NOM
  //
  //  Table pythagoricienne : les lettres sont numérotées 1 à 9 en boucle.
  //     1  2  3  4  5  6  7  8  9
  //     A  B  C  D  E  F  G  H  I
  //     J  K  L  M  N  O  P  Q  R
  //     S  T  U  V  W  X  Y  Z
  //  Trois nombres :
  //   - EXPRESSION     : toutes les lettres (comment on agit, ses talents) ;
  //   - ÉLAN SPIRITUEL : les voyelles (ce qui motive en profondeur) ;
  //   - MOI INTIME     : les consonnes (l'image que l'on donne, le « moi » discret).
  //  Les noms varient selon les livres (voyelles = « nombre intime » chez
  //  certains auteurs, consonnes = « nombre de réalisation ») : la méthodologie le dit.
  //
  //  Conventions Toiles :
  //   - accents et cédille retirés (é → E, ç → C) ; Œ → OE, Æ → AE, ß → SS ;
  //   - tirets, apostrophes et espaces séparent les MOTS ; tout le reste est ignoré ;
  //   - Y est compté comme VOYELLE (règle simple ; d'autres écoles regardent
  //     s'il se prononce comme une voyelle, ce qu'un programme ne peut pas deviner) ;
  //   - chaque mot (prénom, nom…) est réduit séparément, puis les mots sont
  //     additionnés et réduits : cela laisse apparaître les maîtres-nombres.
  // =====================================================================

  const VOYELLES = 'AEIOUY';

  /** Valeur pythagoricienne d'une lettre A–Z (A = 1 … I = 9, J = 1 …). */
  const valeurLettre = (lettre) => ((lettre.charCodeAt(0) - 65) % 9) + 1;

  /** "Hélène-Ève d'Aÿ" → ["HELENE", "EVE", "D", "AY"] : mots en lettres A–Z seules. */
  function motsDuNom(nom) {
    return (nom || '')
      .replace(/[œŒ]/g, 'oe').replace(/[æÆ]/g, 'ae').replace(/ß/g, 'ss')
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .split(/[\s\-'’]+/)
      .map((mot) => mot.replace(/[^A-Z]/g, ''))
      .filter(Boolean);
  }

  /**
   * Calcul d'un des trois nombres du nom, avec ses étapes.
   * filtre : 'toutes' | 'voyelles' | 'consonnes'.
   */
  function nombreDuNom(nom, filtre = 'toutes') {
    const garder = (l) => filtre === 'toutes' || (filtre === 'voyelles') === VOYELLES.includes(l);
    const etapes = [];
    let total = 0;
    for (const mot of motsDuNom(nom)) {
      const lettres = [...mot].filter(garder);
      if (!lettres.length) continue;
      const somme = lettres.reduce((s, l) => s + valeurLettre(l), 0);
      const r = reduire(somme);
      etapes.push(`${mot} : ${lettres.map((l) => `${l}=${valeurLettre(l)}`).join(' ')} → ${somme}${r !== somme ? ' → ' + r : ''}`);
      total += r;
    }
    if (!etapes.length) return { valeur: null, etapes: ['Aucune lettre à compter.'] };
    const fin = reduireAvecEtapes(total);
    etapes.push(`Total des mots : ${total}`, ...fin.etapes);
    return { valeur: fin.valeur, etapes };
  }

  /** Les trois nombres du nom complet (de naissance, tel qu'à l'état civil). */
  function nombresDuNom(nom) {
    return {
      expression: nombreDuNom(nom, 'toutes'),
      elanSpirituel: nombreDuNom(nom, 'voyelles'),
      moiIntime: nombreDuNom(nom, 'consonnes'),
    };
  }

  T.numerologie = {
    cycleNeufAns, cyclesLongs, ageRevolu,
    valeurLettre, motsDuNom, nombreDuNom, nombresDuNom,
    additionDuJour,
    reduire, sommeChiffres, semaineISO, reduireAvecEtapes, expliquer,
    anneeUniverselle, moisUniversel, semaineUniverselle, jourUniversel,
    anneePersonnelle, moisPersonnel, semainePersonnelle, jourPersonnel,
    cheminDeVie, interpreter, profil, DOMAINES,
  };
})(globalThis.Toiles = globalThis.Toiles || {});
