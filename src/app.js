/**
 * Toiles — vue Aujourd'hui.
 *
 * Ce fichier ne calcule rien : il lit le formulaire, appelle les modules
 * (Toiles.numerologie, Toiles.astres) et écrit le résultat dans la page.
 * Organisation :
 *   1. outils         petites fonctions utilitaires
 *   2. filtre         afficher numérologie / ciel / les deux
 *   3. infobulles     « Comment ça marche »
 *   4. rendu          dessin des cartes (+ profils, méthodologie, fiches glossaire)
 *   5. démarrage
 */
(function () {
  'use strict';
  const { numerologie: N, astres: A, schemas: S, transits: TR, textes: TXT, glossaire: G, methodologie: M, fiches: F, croisee: C, maisons: MS, villes: V, cleGlossaire, cleNombre } = window.Toiles;
  // Modules de la v0.7 : points complémentaires, calendrier, journal, quiz.
  const { complements: CP, calendrier: CAL, journal: J, quiz: Q } = window.Toiles;

  // Stocke les transits calculés pour la date courante (utilisé par contenuTransit lors du clic)
  let transitsCourants = [];

  // ===================== 1. Outils =====================

  const $ = (id) => document.getElementById(id);
  const pct = (x) => Math.round(x * 100) + ' %';

  // Noms affichés des 6 domaines (définis une seule fois, dans src/fiches.js).
  const LIBELLES_DOMAINES = F.LIBELLES_DOMAINES;

  /** "2026-10-28" (valeur d'un <input type="date">) → Date locale à midi.
   *  Midi plutôt que minuit : la lecture est « par jour », et midi évite qu'un
   *  décalage de fuseau fasse basculer la date de la veille. */
  function lireDate(valeur) {
    const [a, m, j] = valeur.split('-').map(Number);
    return new Date(a, m - 1, j, 12, 0);
  }

  /** Date → "2026-10-28", pour remplir un <input type="date">. */
  /** La date choisie dans le formulaire (les bulles en ont besoin pour refaire un calcul). */
  const dateCourante = () => lireDate($('date').value);

  function versChamp(date) {
    const deux = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${deux(date.getMonth() + 1)}-${deux(date.getDate())}`;
  }

  /** Lecture / écriture du navigateur, sans planter si le stockage est bloqué
   *  (navigation privée, fichier local selon le navigateur…). */
  const memoire = {
    lire(cle, defaut) {
      try { return localStorage.getItem(cle) ?? defaut; } catch { return defaut; }
    },
    ecrire(cle, valeur) {
      try { localStorage.setItem(cle, valeur); } catch { /* tant pis : rien n'est retenu */ }
    },
  };

  // ===================== 2. Filtre =====================

  /** Montre les cartes dont data-module correspond au choix ("tout" = toutes). */
  function appliquerFiltre(choix) {
    document.querySelectorAll('.carte[data-module]').forEach((carte) => {
      // La Synthèse du jour reste toujours visible : c'est le résumé de tout le reste.
      carte.hidden = choix !== 'tout' && carte.dataset.module !== 'synthese' && carte.dataset.module !== choix;
    });
  }

  function initFiltre() {
    const choix = memoire.lire('toiles_vue', 'tout');
    const radio = document.querySelector(`#filtre input[value="${choix}"]`);
    if (radio) radio.checked = true;
    appliquerFiltre(choix);

    $('filtre').addEventListener('change', (e) => {
      memoire.ecrire('toiles_vue', e.target.value);
      appliquerFiltre(e.target.value);
    });
  }

  // ===================== 3. Infobulles =====================
  //
  // Une seule bulle pour toute la page, placée sous l'élément cliqué.
  // Deux sortes de déclencheurs :
  //   - bouton « ? » d'une carte (classe .info, data-info="cle")  → src/textes.js
  //   - terme cliquable (classe .terme, data-glossaire="cle")     → src/glossaire.js
  // On l'ouvre au clic (et non au survol) pour qu'elle marche aussi au doigt
  // sur téléphone. Elle se ferme : en recliquant, en cliquant ailleurs, ou avec Échap.
  //
  // Le pied de chaque bulle propose « Fiche complète → » (data-fiche="cle") :
  // c'est le lien transversal vers le panneau Fiches glossaire (section plus bas).

  let boutonOuvert = null;

  /** Boutons « Fiche … → » à mettre au pied d'une bulle. cles : clés du glossaire. */
  function liensFiches(cles) {
    return cles.filter((c) => G[c]).map((c) =>
      `<button type="button" class="lien lien-methode" data-fiche="${c}">Fiche ${G[c].titre} →</button>`).join(' ');
  }

  /** Contenu d'un bouton « ? » : comment fonctionne un module. */
  function contenuModule(cle) {
    const t = TXT.infobulles[cle];
    if (!t) return null;
    const cible = t.sectionMethodologie || cle;
    return `
      <strong>${t.titre} — comment ça marche</strong>
      <p>${t.principe}</p>
      <h4>Sur quoi c'est basé</h4><p>${t.base}</p>
      <h4>À garder en tête</h4><p>${t.limites}</p>
      <div class="bulle-pied">
        <button type="button" class="lien lien-methode" data-methode="${cible}">En savoir plus →</button>
      </div>`;
  }

  /**
   * Contenu d'un terme : son entrée dans le glossaire.
   * astre (optionnel) : la planète concernée, quand le terme dépend d'elle
   * (ex. le ℞ de la ligne Mercure affiche aussi « Pour Mercure »).
   */
  function contenuTerme(cle, astre) {
    const t = G[cle];
    if (!t) return null;
    const propre = astre && t.parAstre && t.parAstre[astre];
    return `
      <strong>${t.titre}${propre ? ' — ' + A.ASTRES[astre].nom : ''}</strong>
      <p>${t.court}</p>
      ${t.detail ? `<p>${t.detail}</p>` : ''}
      ${t.effet ? `<h4>Ce que ça fait</h4><p>${t.effet}</p>` : ''}
      ${propre ? `<h4>Pour ${A.ASTRES[astre].nom}</h4><p>${propre}</p>` : ''}
      ${t.conseil ? `<h4>Conseil</h4><p>${t.conseil}</p>` : ''}
      ${t.motsCles ? `<h4>Mots-clés</h4><p>${t.motsCles.join(' · ')}</p>` : ''}
      <div class="bulle-pied">
        <button type="button" class="lien lien-methode" data-fiche="${cle}">Fiche complète →</button>
      </div>`;
  }

  /**
   * Contenu « planète en signe » (ex. Mars en Lion) : texte rédigé, revers,
   * mots-clés et dignité. Les textes sont dans src/positions.js.
   */
  function contenuPosition(astre, signe) {
    const l = window.Toiles.positions.lire(astre, Number(signe));
    const S = A.SIGNES[Number(signe)];
    const etat = l.dignite.etats[0]; // sert à la couleur du badge (voir toiles.css)
    return `
      <strong>${A.ASTRES[astre].glyphe} ${A.ASTRES[astre].nom} en ${S.glyphe} ${S.nom}</strong>
      <span class="dignite dignite-${etat}">${l.dignite.libelle}</span>
      <p>${l.texte}</p>
      ${l.revers ? `<h4>Revers</h4><p>${l.revers}</p>` : ''}
      <h4>Mots-clés</h4><p>${l.motsCles.join(' · ')}</p>
      <h4>Dignité</h4><p>${l.dignite.explication}</p>
      ${l.assemble ? '<p><em>Texte assemblé automatiquement (pas encore rédigé).</em></p>' : ''}
      ${blocCalcul(A.expliquerPosition(astre, dateCourante()))}
      <div class="bulle-pied">
        ${liensFiches([astre, cleGlossaire(S.nom)])}
        <button type="button" class="lien lien-methode" data-methode="dignites">En savoir plus sur les dignités →</button>
      </div>`;
  }

  /**
   * Contenu d'un aspect (clic sur son écart) : le calcul pas à pas,
   * puis la définition de l'orbe.
   * index : position de l'aspect dans la liste affichée.
   */
  function contenuAspect(index) {
    const date = dateCourante();
    const pos = A.positions(date);
    const x = A.aspects(pos)[Number(index)];
    if (!x) return null;
    return `
      <strong>${A.ASTRES[x.a].nom} ${x.nom.toLowerCase()} ${A.ASTRES[x.b].nom}</strong>
      <p>${G[cleGlossaire(x.nom)].court}</p>
      ${blocCalcul(A.expliquerAspect(x, pos), true)}
      <h4>${G.orbe.titre}</h4><p>${G.orbe.court}</p>
      <div class="bulle-pied">
        ${liensFiches([cleGlossaire(x.nom)])}
        <button type="button" class="lien lien-methode" data-methode="ciel">En savoir plus sur le calcul du ciel →</button>
      </div>`;
  }

  /**
   * Contenu d'un transit personnel (clic sur son écart) :
   * calcul détaillé pas à pas, rythme d'influence et définition de l'orbe.
   */
  function contenuTransit(index) {
    const t = transitsCourants[Number(index)];
    if (!t) return null;
    const c = t.posTransitant, n = t.posNatal;
    return `
      <strong>${A.ASTRES[c.cle].nom} céleste ${t.nom.toLowerCase()} ${A.ASTRES[n.cle].nom} natal</strong>
      <span class="badge-transit ${t.categorie.type}">${t.categorie.libelle}</span>
      <p>${G[cleGlossaire(t.nom)] ? G[cleGlossaire(t.nom)].court : ''}</p>
      ${blocCalcul(TR.expliquer(t), true)}
      <h4>Rythme &amp; portée</h4><p>${t.categorie.duree}</p>
      <h4>${G.orbe.titre}</h4><p>${G.orbe.court}</p>
      <div class="bulle-pied">
        ${liensFiches([cleGlossaire(t.nom)])}
        <button type="button" class="lien lien-methode" data-methode="transits">En savoir plus sur les transits →</button>
      </div>`;
  }

  /** Le « Voir le calcul » commun aux cartes et aux bulles. ouvert : déplié d'office. */
  function blocCalcul(etapes, ouvert = false) {
    return `
      <details class="calcul"${ouvert ? ' open' : ''}>
        <summary>Voir le calcul</summary>
        <ol>${etapes.map((e) => `<li>${e}</li>`).join('')}</ol>
      </details>`;
  }

  function ouvrirBulle(bouton) {
    const d = bouton.dataset;
    const html = d.info ? contenuModule(d.info)
      : d.position ? contenuPosition(d.position, d.signe)
      : d.aspect !== undefined ? contenuAspect(d.aspect)
      : d.transit !== undefined ? contenuTransit(d.transit)
      : contenuTerme(d.glossaire, d.astre);
    if (!html) return; // clé absente des textes : on n'ouvre rien plutôt qu'une bulle vide
    const bulle = $('bulle');
    bulle.innerHTML = html;
    bulle.hidden = false;

    // Position : sous le bouton, sans dépasser du bord droit de l'écran.
    const r = bouton.getBoundingClientRect();
    const largeur = Math.min(340, window.innerWidth - 32);
    bulle.style.width = largeur + 'px';
    bulle.style.top = window.scrollY + r.bottom + 8 + 'px';
    bulle.style.left = Math.max(16, Math.min(r.left, window.innerWidth - largeur - 16)) + 'px';

    bouton.setAttribute('aria-expanded', 'true');
    boutonOuvert = bouton;
  }

  function fermerBulle() {
    $('bulle').hidden = true;
    if (boutonOuvert) boutonOuvert.setAttribute('aria-expanded', 'false');
    boutonOuvert = null;
  }

  function initInfobulles() {
    document.addEventListener('click', (e) => {
      // Lien vers le volet Méthodologie dans une bulle
      const lien = e.target.closest('[data-methode]');
      if (lien) {
        fermerBulle();
        ouvrirMethodologie(lien.dataset.methode);
        return;
      }

      // Lien vers une fiche complète (depuis une bulle, ou d'une fiche à l'autre)
      const lienFiche = e.target.closest('[data-fiche]');
      if (lienFiche) {
        fermerBulle();
        ouvrirFiches(lienFiche.dataset.fiche);
        return;
      }

      const bouton = e.target.closest('.info, .terme');
      if (bouton) {
        const memeBouton = bouton === boutonOuvert;
        fermerBulle();
        if (!memeBouton) ouvrirBulle(bouton);
      } else if (!e.target.closest('#bulle')) {
        fermerBulle();
      }
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fermerBulle(); });
    window.addEventListener('resize', fermerBulle);
  }

  // ===================== 4. Rendu =====================

  /**
   * Un terme cliquable qui ouvre sa définition du glossaire.
   * C'est un <button> (et non un <span>) pour être atteignable au clavier.
   */
  function terme(cle, contenu, titre, astre) {
    // astre : précise la planète concernée (ex. ℞ de Mercure) → data-astre, lu par contenuTerme().
    const contexte = astre ? ` data-astre="${astre}"` : '';
    return `<button type="button" class="terme" data-glossaire="${cle}"${contexte} aria-label="${titre || contenu} : définition">${contenu}</button>`;
  }

  /**
   * Un bloc « nombre » : pastille, mot-clé, texte du domaine,
   * et le calcul détaillé dans un <details> (dépliable, natif, sans JS).
   * La pastille est un terme cliquable : elle ouvre la définition du nombre
   * (entrée « nombreN » du glossaire), d'où l'on rejoint sa fiche complète.
   */
  function blocNombre(titre, explication, domaine) {
    const n = explication.valeur;
    const sens = N.interpreter(n, domaine);
    return `
      <div class="nombre">
        <button type="button" class="terme chiffre" data-glossaire="${cleNombre(n)}" aria-label="Nombre ${n} : définition">${n}</button>
        <div>
          <strong>${titre} · ${sens.mot}</strong>
          <p>${sens.texte}</p>
          ${blocCalcul(explication.etapes)}
        </div>
      </div>`;
  }

  function rendreNumerologie(date, naissance, domaine) {
    const semaine = N.semaineISO(date);
    const ligne = (titre, type, perso) => blocNombre(titre, N.expliquer(type, date, naissance, perso), domaine);

    let html = '<h3>Énergie collective</h3>' +
      ligne('Année', 'annee', false) +
      ligne('Mois', 'mois', false) +
      ligne(`Semaine ${semaine}`, 'semaine', false) +
      ligne('Jour', 'jour', false);

    if (naissance) {
      html += `<h3>Énergie personnelle <small>${terme('cheminDeVie', 'chemin de vie ' + N.cheminDeVie(naissance))}</small></h3>` +
        ligne('Année', 'annee', true) +
        ligne('Mois', 'mois', true) +
        ligne('Semaine', 'semaine', true) +
        ligne('Jour', 'jour', true);
    }
    $('numero').innerHTML = html;
  }

  function rendreCiel(date) {
    const dyn = A.dynamique(date);

    // Lune
    $('lune').innerHTML = `
      <span class="disque" style="--ill:${dyn.lune.illumination};--sens:${dyn.lune.croissante ? 1 : -1}"></span>
      <div><strong>${terme('phase', dyn.lune.nom)}</strong><br>${pct(dyn.lune.illumination)} éclairée</div>`;

    // Positions
    // Chaque symbole et chaque nom ouvre sa définition (glossaire).
    // Degrés entiers dans le texte (22° Scorpion) : les décimales restent
    // dans le calcul détaillé. On tronque (22,9° → 22°), comme les éphémérides.
    // \uFE0E après un glyphe force le rendu « texte » (pas d'émoji en couleur).
    $('astres').innerHTML = dyn.positions.map((x) => `
      <tr>
        <td class="g">${terme(x.cle, x.glyphe + '\uFE0E', x.nom)}</td>
        <td><button type="button" class="terme" data-position="${x.cle}" data-signe="${x.signe.index}"
              aria-label="${x.nom} en ${x.signe.nom} : lecture">${x.nom}</button>${x.retrograde
          ? ' ' + terme('retrograde', '<span class="retro" title="rétrograde">℞</span>', `${x.nom} rétrograde`, x.cle) : ''}</td>
        <td class="num">${terme('degre', Math.floor(x.signe.degre) + '°', 'Degré')} ${terme(cleGlossaire(x.signe.nom), `<span class="glyphe">${x.signe.glyphe}\uFE0E</span> ${x.signe.nom}`, x.signe.nom)}</td>
      </tr>`).join('');

    // Points complémentaires (Pluton, Chiron, nœuds) : même présentation, sans
    // lecture « planète en signe » (pas de textes rédigés pour eux).
    $('complements').innerHTML = CP.positions(date).map((x) => `
      <tr>
        <td class="g">${terme(x.cle, x.glyphe + '︎', x.nom)}</td>
        <td>${terme(x.cle, x.nom)}${x.retrograde
          ? ' ' + terme('retrograde', '<span class="retro" title="rétrograde">℞</span>', `${x.nom} rétrograde`) : ''}</td>
        <td class="num">${Math.floor(x.signe.degre)}° ${terme(cleGlossaire(x.signe.nom), `<span class="glyphe">${x.signe.glyphe}︎</span> ${x.signe.nom}`, x.signe.nom)}</td>
      </tr>`).join('');

    // Dynamique
    const barres = (o) => Object.entries(o).map(([k, v]) =>
      `<div class="barre"><span>${terme(k, k)}</span><i style="--v:${v}"></i><b>${pct(v)}</b></div>`).join('');
    const c = dyn.climat;
    const climat = c.indice > 0.2 ? 'plutôt fluide' : c.indice < -0.2 ? 'plutôt tendu' : 'contrasté';
    $('dynamique').innerHTML = `
      <p>Élément dominant : <strong>${terme(dyn.elementDominant, dyn.elementDominant)}</strong> · mode <strong>${terme(dyn.modeDominant, dyn.modeDominant)}</strong> · climat <strong>${climat}</strong></p>
      <h3>Éléments</h3>${barres(dyn.elements)}
      <h3>Modes</h3>${barres(dyn.modes)}
      ${dyn.retrogrades.length ? `<p>${terme('retrograde', 'Rétrogrades')} : ${dyn.retrogrades.map((k) => terme('retrograde', A.ASTRES[k].nom, `${A.ASTRES[k].nom} rétrograde`, k)).join(', ')}</p>` : ''}`;

    // Aspects (les 10 plus forts). Le symbole de l'aspect et l'écart ouvrent leur définition.
    // i : rang de l'aspect, relu par contenuAspect() (la liste est triée de la même façon).
    $('aspects').innerHTML = dyn.aspects.slice(0, 10).map((x, i) => `
      <li class="${x.nature}">
        <span>${terme(x.a, A.ASTRES[x.a].glyphe, A.ASTRES[x.a].nom)} ${terme(cleGlossaire(x.nom), x.glyphe, x.nom)} ${terme(x.b, A.ASTRES[x.b].glyphe, A.ASTRES[x.b].nom)}</span>
        <span>${A.ASTRES[x.a].nom} ${x.nom.toLowerCase()} ${A.ASTRES[x.b].nom} <small class="nature">${x.nature}</small></span>
        <em><button type="button" class="terme" data-aspect="${i}"
              aria-label="Calcul de l'aspect">${x.ecart.toFixed(1).replace('.', ',')}°</button></em></li>`).join('') || '<li>Aucun aspect majeur.</li>';
  }

  // ===================== Synthèse du jour =====================
  //
  // Le résumé en tête de page : teinte (élément dominant), nombre du jour,
  // tendance, Lune. Les calculs viennent de src/astres.js (teinteDuJour,
  // phaseLunaire) et src/numerologie.js (additionDuJour) ; ici, seulement l'affichage.

  const NOMS_ELEMENTS = { feu: 'Feu', terre: 'Terre', air: 'Air', eau: 'Eau' };

  function rendreSynthese(date, pos) {
    const teinte = A.teinteDuJour(pos);
    const lune = A.phaseLunaire(date);
    const nombre = N.additionDuJour(date);
    const nomElement = NOMS_ELEMENTS[teinte.element];
    $('synthese').innerHTML = `
      <div class="synthese-teinte">
        <p class="heading">Teinte du jour : ${terme(teinte.element, nomElement)}</p>
        <div class="barre-proportion" role="img" aria-label="${teinte.nombre} astres sur ${teinte.total} en ${nomElement}">
          <span style="width:${(teinte.proportion * 100).toFixed(1)}%"></span>
        </div>
        <p class="caption">${teinte.nombre} astres sur ${teinte.total} en ${nomElement} (${pct(teinte.proportion)})</p>
        <p>Tendance : ${TXT.tendances[teinte.element]}</p>
      </div>
      <div class="synthese-nombre">
        <span class="label">Nombre du jour</span>
        <button type="button" class="terme numeral" data-glossaire="${cleNombre(nombre.valeur)}" aria-label="Nombre ${nombre.valeur} : définition">${nombre.valeur}</button>
        <span class="caption">${nombre.texte}</span>
      </div>
      <div class="synthese-lune">
        <span class="disque" style="--ill:${lune.illumination};--sens:${lune.croissante ? 1 : -1}"></span>
        <span>${terme('phase', lune.nom)}<br><span class="caption">${pct(lune.illumination)} éclairée</span></span>
      </div>`;
  }

  // ===================== Lecture croisée & Leçon du jour =====================
  //
  // Les phrases sont construites dans src/croisee.js (calcul pur) ;
  // ici on les met en page et on rend cliquables les termes du glossaire.

  /** Petit libellé de la relation entre deux éléments (écho, complices, contraste…). */
  const LIBELLES_RELATIONS = { echo: 'écho', complices: 'complices', contraste: 'contraste', harmonie: 'harmonie', tension: 'tension', fusion: 'fusion' };

  function rendreCroisee(date, naissance, domaine) {
    const L = C.lire(date, naissance, domaine);
    const corr = L.correspondance;
    const planete = A.ASTRES[corr.planete];
    $('croisee').innerHTML = `
      <div class="nombre">
        <button type="button" class="terme chiffre" data-glossaire="${cleNombre(L.nombre)}" aria-label="Nombre ${L.nombre} : définition">${L.nombre}</button>
        <div>
          <strong>Jour ${L.source} ↔ ${terme(corr.planete, planete.glyphe + '︎ ' + planete.nom, planete.nom)} ↔ ${terme(corr.element, NOMS_ELEMENTS[corr.element])}</strong>
          <p class="caption">Le ${L.nombre} est relié à ${planete.nom} (domicile : ${corr.domicile})</p>
        </div>
      </div>
      <h3>Correspondances</h3>
      <ul class="correspondances">${L.correspondances.map((c) => `
        <li>${c.relation ? `<small class="nature">${LIBELLES_RELATIONS[c.relation]}</small> ` : ''}${c.texte}</li>`).join('')}
      </ul>
      <h3>${LIBELLES_DOMAINES[domaine]}</h3>
      <dl class="domaines-fiche">
        <dt>Côté nombre</dt><dd>${L.domaine.coteNombre}</dd>
        <dt>Côté ciel</dt><dd>${L.domaine.coteCiel}</dd>
        <dt>Ensemble</dt><dd>${L.domaine.liaison}</dd>
      </dl>`;
  }

  function rendreLecon(date) {
    const l = C.lecon(date);
    $('lecon').innerHTML = `
      <p class="heading">${terme(l.cle, l.titre)}</p>
      <p><strong>Pourquoi aujourd’hui ?</strong> ${l.pourquoi}</p>
      <p>${l.texte}</p>
      ${l.effet ? `<p>${l.effet}</p>` : ''}
      ${l.propre ? `<p><strong>Pour ${A.ASTRES[l.propre.astre].nom} :</strong> ${l.propre.texte}</p>` : ''}
      <p class="liens-fiche">
        <button type="button" class="lien" data-fiche="${l.cle}">Fiche complète →</button>
        <button type="button" class="lien" data-methode="${l.methode}">En savoir plus →</button>
      </p>`;
  }

  /**
   * Étoiles du thème sombre : des points posés au hasard… mais un hasard FIXE
   * (suite pseudo-aléatoire à graine constante), pour qu'elles ne sautent pas
   * à chaque changement de date. En thème clair, le jeton --star vaut la
   * couleur de la carte : elles sont invisibles.
   */
  function semerEtoiles() {
    let graine = 7;
    const hasard = () => { graine = (graine * 16807) % 2147483647; return graine / 2147483647; };
    let html = '';
    for (let i = 0; i < 40; i++) {
      html += `<i style="left:${(hasard() * 100).toFixed(1)}%;top:${(hasard() * 100).toFixed(1)}%;animation-delay:${(hasard() * 4).toFixed(1)}s"></i>`;
    }
    $('etoiles').innerHTML = html;
  }

  // ===================== Schémas du ciel =====================
  //
  // La géométrie (où poser chaque point) est calculée par src/schemas.js ;
  // ici on écrit les balises SVG. Les couleurs viennent des jetons CSS
  // (classes .schema-…), pour suivre automatiquement le thème.


  /** pos : les 9 astres, éventuellement suivis des points complémentaires (dessinés plus discrets). */
  function rendreCarteGeo(pos) {
    const g = S.carteGeocentrique(pos);
    const c = g.centre;
    let svg = `<svg class="schema" viewBox="0 0 ${g.taille} ${g.taille}" role="img" aria-labelledby="titre-geo">
      <title id="titre-geo">Positions des astres dans le zodiaque, vues depuis la Terre</title>
      <circle class="schema-trait" cx="${c}" cy="${c}" r="${g.rayonExterieur}"/>
      <circle class="schema-trait" cx="${c}" cy="${c}" r="${g.rayonInterieur}"/>`;
    // Les 12 signes : un trait de séparation et le glyphe au milieu du secteur.
    for (const sg of g.signes) {
      const signe = A.SIGNES[sg.index];
      svg += `<line class="schema-trait" x1="${sg.traitInterieur.x}" y1="${sg.traitInterieur.y}" x2="${sg.traitExterieur.x}" y2="${sg.traitExterieur.y}"/>
        <text class="schema-signe" x="${sg.glyphe.x}" y="${sg.glyphe.y}"><title>${signe.nom}</title>${signe.glyphe}\uFE0E</text>`;
    }
    // Les astres : petit repère sur l'anneau, et un trait fin vers le glyphe s'il a reculé.
    for (const a of g.astres) {
      const p = pos.find((x) => x.cle === a.cle);
      const titre = `${p.nom} : ${Math.floor(p.signe.degre)}° ${p.signe.nom}${p.retrograde ? ' ℞ (rétrograde)' : ''}`;
      if (a.niveau > 0) {
        svg += `<line class="schema-lien" x1="${a.repere.x}" y1="${a.repere.y}" x2="${a.point.x}" y2="${a.point.y}"/>`;
      }
      svg += `<circle class="schema-repere" cx="${a.repere.x}" cy="${a.repere.y}" r="2"/>
        <text class="schema-astre${p.complement ? ' schema-complement' : ''}" x="${a.point.x}" y="${a.point.y}"><title>${echapper(titre)}</title>${p.glyphe}\uFE0E</text>`;
    }
    // La Terre au centre : le point de vue.
    svg += `<circle class="schema-terre" cx="${c}" cy="${c}" r="7"><title>La Terre (point de vue)</title></circle></svg>`;
    $('carte-geo').innerHTML = svg;
  }

  function rendreCarteHelio(date) {
    const h = S.carteHeliocentrique(A.positionsHeliocentriques(date));
    const c = h.centre;
    let svg = `<svg class="schema" viewBox="0 0 ${h.taille} ${h.taille}" role="img" aria-labelledby="titre-helio">
      <title id="titre-helio">Les planètes sur leurs orbites autour du Soleil, vues de dessus</title>`;
    for (const o of h.orbites) {
      svg += `<circle class="schema-orbite" cx="${c}" cy="${c}" r="${o.rayon}"/>`;
    }
    svg += `<circle class="schema-soleil" cx="${c}" cy="${c}" r="10"><title>Soleil</title></circle>`;
    for (const o of h.orbites) {
      const estTerre = o.cle === 'terre';
      const nom = estTerre ? 'Terre' : A.ASTRES[o.cle].nom;
      const titre = `${nom} : ${Math.floor(o.lon)}° de longitude héliocentrique`;
      svg += `<circle class="${estTerre ? 'schema-terre' : 'schema-planete'}" cx="${o.point.x}" cy="${o.point.y}" r="${estTerre ? 6 : 4.5}"><title>${echapper(titre)}</title></circle>`;
    }
    svg += '</svg>';
    $('carte-helio').innerHTML = svg;
  }

  /**
   * Carte « Ascendant & maisons ». r : résultat de Toiles.maisons.calculer(profil),
   * ou null si le profil n'a pas d'heure ou de lieu de naissance.
   */
  function rendreMaisons(r, profil, domaine) {
    if (!profil) {
      $('maisons').innerHTML = '<p class="aide-profil">Choisis un profil pour calculer ton Ascendant et tes maisons.</p>';
      return;
    }
    if (!r) {
      $('maisons').innerHTML = '<p class="aide-profil">Ajoute l’heure et le lieu de naissance de ce profil (bouton « Gérer ») pour calculer l’Ascendant et les maisons.</p>';
      return;
    }
    // Glyphe cliquable + degré entier + nom du signe (U+FE0E : pas de rendu emoji).
    const enSigne = (lon) => {
      const s = A.signe(lon);
      return `${terme(cleGlossaire(s.nom), s.glyphe + '\uFE0E', s.nom)} ${Math.floor(s.degre)}° ${s.nom}`;
    };
    // Dans le tableau, forme courte (glyphe + degré, glyphes des planètes) pour tenir
    // dans une colonne de téléphone ; le nom complet est dans l'aria-label et la bulle.
    const signeCourt = (lon) => {
      const s = A.signe(lon);
      return `<span title="${s.nom}">${terme(cleGlossaire(s.nom), s.glyphe + '\uFE0E', s.nom)} ${Math.floor(s.degre)}°</span>`;
    };
    const astresDe = (m) => m.astres.length
      ? m.astres.map((c) => terme(c, A.ASTRES[c].glyphe + '\uFE0E', A.ASTRES[c].nom)).join(' ')
      : '—';
    const titreMaison = (m) => G['maison' + m.numero].titre;

    // Le domaine choisi dans le formulaire : ses deux maisons, une phrase chacune.
    const phrases = MS.DOMAINES_MAISONS[domaine].map((n) => {
      const m = r.maisons[n - 1];
      const habitants = m.astres.length ? `, avec ${m.astres.map((c) => A.ASTRES[c].nom).join(', ')}` : ', sans planète';
      return `<li>${terme('maison' + m.numero, titreMaison(m), titreMaison(m))} : commence en ${m.signe.nom}${habitants}.</li>`;
    }).join('');

    const lignes = r.maisons.map((m) => `
      <tr${MS.DOMAINES_MAISONS[domaine].includes(m.numero) ? ' class="maison-domaine"' : ''}>
        <td class="g">${terme('maison' + m.numero, m.romain, titreMaison(m))}</td>
        <td class="num">${signeCourt(m.cuspide)}</td>
        <td>${LIBELLES_DOMAINES[m.domaine]}</td>
        <td class="g">${astresDe(m)}</td>
      </tr>`).join('');

    const c = r.conversion;
    const alerte = {
      inexistante: 'Cette heure n’a pas existé (passage à l’heure d’été) : vérifie l’heure notée. Toiles retient l’heure d’hiver.',
      ambigue: 'Cette heure a été vécue deux fois (retour à l’heure d’hiver) : Toiles retient la première, encore en heure d’été.',
    }[c.statut];
    $('maisons').innerHTML = `
      <p class="angles-theme">
        <span>${terme('ascendant', 'AS', 'Ascendant')} ${enSigne(r.asc)}</span>
        <span>${terme('milieuDuCiel', 'MC', 'Milieu du Ciel')} ${enSigne(r.mc)}</span>
      </p>
      <p class="natal-resume"><small>Naissance à ${profil.heure} (heure légale, ${V.texteDecalage(c.decalage)}) à ${echapper(profil.lieu.nom)} → ${versHeureTU(c.date)} TU · ${r.systeme === 'placidus' ? 'maisons de Placidus' : 'maisons égales (latitude polaire)'}</small></p>
      ${alerte ? `<div class="avertissement-lune"><strong>À noter</strong> <div>${alerte}</div></div>` : ''}
      <p class="label">Domaine ${LIBELLES_DOMAINES[domaine]}</p>
      <ul class="maisons-domaine">${phrases}</ul>
      <table class="astres maisons-table">
        <thead><tr><th>Maison</th><th>Début</th><th>Domaine</th><th>Planètes</th></tr></thead>
        <tbody>${lignes}</tbody>
      </table>
      ${blocCalcul(MS.expliquer(profil, r))}
      ${complementsNatals(r)}`;
  }

  /** Pluton, Chiron et les nœuds dans les maisons du thème natal (à l'heure exacte). */
  function complementsNatals(r) {
    const lignes = CP.positions(r.theme.date).map((x) =>
      `<li>${terme(x.cle, x.glyphe + '︎ ' + x.nom, x.nom)} : ${Math.floor(x.signe.degre)}° ${x.signe.nom}, maison ${MS.ROMAINS[MS.maisonDe(x.lon, r.cuspides) - 1]}</li>`).join('');
    return `<h3>Points complémentaires natals</h3><ul class="maisons-domaine">${lignes}</ul>`;
  }

  // ===================== Tropical / sidéral =====================

  function rendreSideral(date, pos) {
    const ecole = $('ayanamsa').value || 'lahiri';
    const ayan = CP.ayanamsa(date, ecole);
    const deg = Math.floor(ayan), min = Math.floor((ayan - deg) * 60);
    const lignes = CP.comparerSideral(pos, date, ecole).map((x) => `
      <tr${x.change ? '' : ' class="maison-domaine"'}>
        <td class="g">${terme(x.cle, x.glyphe + '︎', x.nom)}</td>
        <td class="num">${x.tropical.glyphe}︎ ${Math.floor(x.tropical.degre)}°</td>
        <td class="num">${x.sideral.glyphe}︎ ${Math.floor(x.sideral.degre)}° <small>${x.sideral.nom}</small></td>
      </tr>`).join('');
    const memes = CP.comparerSideral(pos, date, ecole).filter((x) => !x.change).length;
    $('sideral').innerHTML = `
      <p>${terme('ayanamsa', 'Ayanamsa')} ${AYANAMSA_NOMS[ecole]} : <strong>${deg}° ${String(min).padStart(2, '0')}′</strong> — chaque astre recule d’autant en ${terme('sideral', 'sidéral')}.</p>
      <table class="astres maisons-table">
        <thead><tr><th>Astre</th><th>Tropical</th><th>Sidéral</th></tr></thead>
        <tbody>${lignes}</tbody>
      </table>
      <p class="caption">${memes} astre(s) sur ${pos.length} gardent leur signe (lignes surlignées). Les textes de Toiles restent tropicaux.</p>`;
  }
  const AYANAMSA_NOMS = Object.fromEntries(Object.entries(CP.AYANAMSAS).map(([k, v]) => [k, v.nom]));

  // ===================== Cycles longs & nombres du nom =====================

  /** Une ligne de période (pinacle, défi, cycle de vie) : âges, années, nombre cliquable. */
  function lignePeriode(titre, p, detail) {
    const ages = p.ageFin === null ? `dès ${p.ageDebut} ans (${p.anneeDebut})` : `${p.ageDebut}–${p.ageFin} ans (${p.anneeDebut}–${p.anneeFin})`;
    const pastille = cleNombre(p.valeur) in G
      ? `<button type="button" class="terme chiffre" data-glossaire="${cleNombre(p.valeur)}" aria-label="Nombre ${p.valeur} : définition">${p.valeur}</button>`
      : `<span class="chiffre">${p.valeur}</span>`; // défi 0 : pas de fiche « nombre0 »
    return `
      <div class="nombre${p.actif ? ' periode-active' : ''}">
        ${pastille}
        <div><strong>${titre}${p.actif ? ' · en cours' : ''}</strong>
          <p>${ages}${detail ? ' · ' + detail : ''}</p></div>
      </div>`;
  }

  function rendreCycles(date, naissance) {
    if (!naissance) {
      $('cycles').innerHTML = '<p class="aide-profil">Choisis un profil ou saisis une date de naissance pour voir tes cycles longs.</p>';
      return;
    }
    const c = N.cyclesLongs(naissance, date);
    const neuf = c.cycleNeufAns;
    const mot = (n) => (G[cleNombre(n)] ? G[cleNombre(n)].mot : 'choix libre');
    const etapes = [
      `Mois de naissance → ${c.base.mois}, jour → ${c.base.jour}, année → ${c.base.annee} (réduits à un chiffre)`,
      `Chemin de vie réduit à un chiffre : ${c.base.chemin} → 1er pinacle jusqu’à 36 − ${c.base.chemin} = ${36 - c.base.chemin} ans`,
      ...c.pinacles.map((p) => `Pinacle ${p.rang} : ${p.calcul} → ${p.valeur}`),
      ...c.defis.map((d) => `Défi ${d.rang} : ${d.calcul} = ${d.valeur}`),
    ];
    $('cycles').innerHTML = `
      <p>${terme('cycleNeufAns', 'Cycle de 9 ans')} : année <strong>${neuf.rang}</strong> sur 9 (cycle ${neuf.anneeDebut}–${neuf.anneeFin}) · ${c.age} ans</p>
      <div class="frise-neuf" role="img" aria-label="Année ${neuf.rang} du cycle de 9 ans">${Array.from({ length: 9 }, (_, i) =>
        `<span class="${i + 1 === neuf.rang ? 'actuelle' : i + 1 < neuf.rang ? 'passee' : ''}">${i + 1}</span>`).join('')}</div>
      <h3>${terme('cycleDeVie', 'Cycles de vie')}</h3>
      ${c.cyclesDeVie.map((p) => lignePeriode(`${p.nom} · ${mot(p.valeur)}`, p, p.source)).join('')}
      <h3>${terme('pinacle', 'Pinacles')}</h3>
      ${c.pinacles.map((p) => lignePeriode(`Pinacle ${p.rang} · ${mot(p.valeur)}`, p)).join('')}
      <h3>${terme('defi', 'Défis')}</h3>
      ${c.defis.map((p) => lignePeriode(`Défi ${p.rang} · ${p.valeur === 0 ? 'défi du choix' : mot(p.valeur)}`, p)).join('')}
      ${blocCalcul(etapes)}`;
  }

  function rendreNom(profil, domaine) {
    if (!profil || !profil.nomComplet) {
      $('nom').innerHTML = `<p class="aide-profil">${profil
        ? 'Ajoute le nom complet de naissance de ce profil (bouton « Gérer ») pour calculer les nombres du nom.'
        : 'Choisis un profil et renseigne son nom complet de naissance pour calculer les nombres du nom.'}</p>`;
      return;
    }
    const n = N.nombresDuNom(profil.nomComplet);
    const bloc = (cle, titre, r) => r.valeur === null
      ? `<p class="aide-profil">${titre} : aucune lettre à compter.</p>`
      : blocNombre(terme(cle, titre), r, domaine);
    $('nom').innerHTML = `
      <p class="natal-resume"><small>${echapper(profil.nomComplet)}</small></p>
      ${bloc('expression', 'Expression', n.expression)}
      ${bloc('elanSpirituel', 'Élan spirituel', n.elanSpirituel)}
      ${bloc('moiIntime', 'Moi intime', n.moiIntime)}`;
  }

  // ===================== Calendrier du mois =====================

  function rendreCalendrier(date, naissance) {
    const profilId = profilCourant() ? profilCourant().id : '';
    const m = CAL.mois(date.getFullYear(), date.getMonth(), naissance, J.datesRemplies(profilId));
    const choisie = versChamp(date);
    const cellule = (j) => {
      if (!j) return '<td></td>';
      const nombre = j.jourPersonnel ?? j.jourUniversel;
      const lune = j.lunaison ? `<span class="cal-lunaison" title="${j.lunaison.nom}">${j.lunaison.glyphe}</span>` : '';
      return `<td${j.date === choisie ? ' class="cal-choisi"' : ''}>
        <button type="button" class="cal-jour" data-jour="${j.date}" aria-label="${j.numero} : jour ${nombre}${j.lunaison ? ', ' + j.lunaison.nom : ''}${j.journal ? ', note au journal' : ''}">
          <span class="cal-numero">${j.numero}${j.journal ? '<i class="cal-note" aria-hidden="true">✎</i>' : ''}</span>
          <span class="cal-nombre">${nombre}</span>
          <span class="cal-lune"><span class="disque mini" style="--ill:${j.illumination};--sens:${j.croissante ? 1 : -1}"></span>${lune}</span>
        </button></td>`;
    };
    $('calendrier').innerHTML = `
      <div class="cal-entete">
        <button type="button" class="lien" data-mois="-1" aria-label="Mois précédent">← Préc.</button>
        <p class="heading">${m.titre}</p>
        <button type="button" class="lien" data-mois="1" aria-label="Mois suivant">Suiv. →</button>
      </div>
      <p class="caption">Nombre de chaque case : jour ${naissance ? 'personnel' : 'universel'}. ● nouvelle lune · ◐ premier quartier · ○ pleine lune · ◑ dernier quartier · ✎ note au journal.</p>
      <table class="calendrier">
        <thead><tr>${m.entetes.map((e) => `<th>${e}</th>`).join('')}</tr></thead>
        <tbody>${m.semaines.map((s) => `<tr>${s.map(cellule).join('')}</tr>`).join('')}</tbody>
      </table>
      <ul class="cal-lunaisons">${m.lunaisons.map((j) => `<li>${j.lunaison.glyphe} ${j.lunaison.nom} : ${dateFr(j.date)}</li>`).join('')}</ul>`;
  }

  /** Change la date de toute la page (clic sur une case du calendrier, mois précédent/suivant). */
  function allerA(date) {
    $('date').value = versChamp(date);
    rendre();
  }

  function initCalendrier() {
    $('calendrier').addEventListener('click', (e) => {
      const jour = e.target.closest('[data-jour]');
      if (jour) return allerA(lireDate(jour.dataset.jour));
      const mois = e.target.closest('[data-mois]');
      if (mois) {
        const d = dateCourante();
        // Le 1er du mois visé : évite le 31 janvier + 1 mois = 3 mars.
        allerA(new Date(d.getFullYear(), d.getMonth() + Number(mois.dataset.mois), 1, 12));
      }
    });
  }

  // ===================== Journal de bord =====================

  const HUMEURS = { 1: 'basse', 2: 'plutôt basse', 3: 'moyenne', 4: 'plutôt haute', 5: 'haute' };

  function rendreJournal(date, naissance) {
    const profil = profilCourant();
    const id = profil ? profil.id : '';
    const e = J.lire(versChamp(date), id);
    const ctx = J.contexteDuJour(date, naissance);
    $('journal-contexte').textContent = `${dateFr(versChamp(date))}${profil ? ' · ' + profil.nom : ''} · jour universel ${ctx.jourUniversel}` +
      `${ctx.jourPersonnel ? ', personnel ' + ctx.jourPersonnel : ''} · ${ctx.phase} · teinte ${NOMS_ELEMENTS[ctx.teinte]}`;
    $('journal-texte').value = e ? e.texte : '';
    $('journal-humeur').value = e && e.humeur ? String(e.humeur) : '';
    $('journal-etat').textContent = e ? `Enregistré le ${new Date(e.modifie).toLocaleString('fr-FR')}` : '';

    const dernieres = J.lister(id).slice(0, 5);
    $('liste-journal').innerHTML = dernieres.length
      ? dernieres.map((x) => `
        <li><button type="button" class="lien" data-jour-journal="${x.date}">${dateFr(x.date)}</button>
          <small>${x.contexte ? `jour ${x.contexte.jourPersonnel ?? x.contexte.jourUniversel} · ${x.contexte.phase}` : ''}${x.humeur ? ` · humeur ${HUMEURS[x.humeur]}` : ''}</small>
          <p>${echapper(x.texte.length > 140 ? x.texte.slice(0, 140) + '…' : x.texte)}</p></li>`).join('')
      : '<li class="aide-profil">Aucune note pour l’instant.</li>';
  }

  function initJournal() {
    $('form-journal').addEventListener('submit', (e) => {
      e.preventDefault();
      const date = dateCourante();
      const profil = profilCourant();
      const humeur = $('journal-humeur').value ? Number($('journal-humeur').value) : null;
      try {
        const entree = J.ecrire({
          date: versChamp(date), profil: profil ? profil.id : '',
          texte: $('journal-texte').value, humeur,
          contexte: J.contexteDuJour(date, naissanceCourante()),
        });
        rendreJournal(date, naissanceCourante());
        rendreCalendrier(date, naissanceCourante()); // le signe ✎ du jour apparaît ou disparaît
        $('journal-etat').textContent = entree ? 'Note enregistrée.' : 'Note effacée (texte vide).';
      } catch (err) {
        $('journal-etat').textContent = err.message;
      }
    });
    // Le formulaire du journal fait partie du <main>, pas du formulaire de date : rien à filtrer.
    $('liste-journal').addEventListener('click', (e) => {
      const b = e.target.closest('[data-jour-journal]');
      if (b) allerA(lireDate(b.dataset.jourJournal));
    });
    const nomsProfils = () => Object.fromEntries(P.lister().map((p) => [p.id, p.nom]));
    $('journal-exporter').addEventListener('click', () =>
      telecharger(`toiles-journal-${versChamp(new Date())}.json`, J.exporter()));
    $('journal-exporter-texte').addEventListener('click', () =>
      telecharger(`toiles-journal-${versChamp(new Date())}.md`, J.exporterTexte(nomsProfils()), 'text/markdown'));
  }

  // ===================== Quiz =====================

  let questionQuiz = null;
  const scoreQuiz = { justes: 0, total: 0, recentes: [] };

  function nouvelleQuestion() {
    questionQuiz = Q.question($('quiz-categorie').value, Math.random, scoreQuiz.recentes);
    scoreQuiz.recentes = [...scoreQuiz.recentes, questionQuiz.cle].slice(-10); // évite les répétitions proches
    $('quiz-question').innerHTML = `
      <p class="label">${questionQuiz.consigne}</p>
      <p class="heading">${echapper(questionQuiz.enonce)}</p>
      <div class="quiz-choix">${questionQuiz.choix.map((c, i) =>
        `<button type="button" class="quiz-reponse" data-reponse="${i}">${c.libelle}</button>`).join('')}</div>
      <div id="quiz-retour" role="status"></div>`;
  }

  function repondreQuiz(index) {
    const q = questionQuiz;
    if (!q || q.repondue) return;
    q.repondue = true;
    const juste = Q.verifier(q, index);
    scoreQuiz.total++;
    if (juste) scoreQuiz.justes++;
    document.querySelectorAll('#quiz-question .quiz-reponse').forEach((b, i) => {
      b.disabled = true;
      if (i === q.bonne) b.classList.add('juste');
      else if (i === index) b.classList.add('fausse');
    });
    $('quiz-retour').innerHTML = `
      <p><strong>${juste ? 'Juste !' : `Pas tout à fait : c’était ${q.choix[q.bonne].libelle}.`}</strong> ${echapper(q.explication)}</p>
      <p class="liens-fiche">
        <button type="button" class="lien" data-fiche="${q.cle}">Fiche complète →</button>
        <button type="button" class="principal" id="quiz-suivante">Question suivante</button>
      </p>`;
    $('quiz-score').textContent = `Score : ${scoreQuiz.justes} / ${scoreQuiz.total}`;
    $('quiz-suivante').focus();
  }

  function initQuiz() {
    $('quiz-categorie').innerHTML = [{ id: 'tout', libelle: 'Tout' }, ...F.CATEGORIES]
      .map((c) => `<option value="${c.id}">${c.libelle}</option>`).join('');
    $('ouvrir-quiz').addEventListener('click', () => {
      nouvelleQuestion();
      $('panneau-quiz').showModal();
    });
    $('fermer-quiz').addEventListener('click', () => $('panneau-quiz').close());
    $('panneau-quiz').addEventListener('click', (e) => {
      if (e.target === $('panneau-quiz')) return $('panneau-quiz').close();
      const r = e.target.closest('[data-reponse]');
      if (r) return repondreQuiz(Number(r.dataset.reponse));
      if (e.target.closest('#quiz-suivante')) nouvelleQuestion();
      // « Fiche complète » : le panneau des fiches s'ouvre par-dessus (écouteur global).
    });
    $('quiz-categorie').addEventListener('change', nouvelleQuestion);
  }

  /** Date → « 09:40 » en temps universel. */
  const versHeureTU = (d) => `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`;

  /**
   * themePrecis : thème calculé à l'heure exacte (src/maisons.js), s'il existe ;
   * sinon les transits utilisent le thème « midi TU » de la date de naissance.
   */
  function rendreTransits(date, naissance, themePrecis) {
    if (!naissance) {
      transitsCourants = [];
      $('transits').innerHTML = '<p class="aide-profil">Choisis un profil ou saisis une date de naissance pour afficher tes transits personnels.</p>';
      return;
    }

    const res = TR.calculer(date, themePrecis || naissance);
    transitsCourants = res.transits;
    const theme = res.themeNatal;

    let html = theme.heurePrecise
      ? `<div class="natal-resume"><small>Thème natal calculé à l’heure exacte : ${dateFr(versChamp(naissance))} à ${versHeureTU(theme.date)} TU</small></div>`
      : `<div class="natal-resume"><small>Thème natal calculé au ${dateFr(versChamp(theme.date))} (midi TU)</small></div>`;
    if (theme.luneChangeDeSigne) {
      html += `<div class="avertissement-lune"><strong>À noter</strong> <div>${theme.avertissementLune}</div></div>`;
    }

    if (res.transits.length === 0) {
      html += '<p class="aide-profil">Aucun transit majeur actif avec les orbes resserrés (1° à 3°).</p>';
    } else {
      html += '<ul class="aspects liste-transits">' + res.transits.map((t, i) => {
        const c = t.posTransitant, n = t.posNatal;
        return `
          <li class="${t.nature}">
            <span>${terme(c.cle, A.ASTRES[c.cle].glyphe, A.ASTRES[c.cle].nom)} ${terme(cleGlossaire(t.nom), t.glyphe, t.nom)} ${terme(n.cle, A.ASTRES[n.cle].glyphe, A.ASTRES[n.cle].nom)}</span>
            <span>
              <strong>${A.ASTRES[c.cle].nom}</strong> <small>(ciel)</small>
              ${t.nom.toLowerCase()}
              <strong>${A.ASTRES[n.cle].nom}</strong> <small>(natal)</small>
              <small class="nature">${t.nature}</small>
              <span class="badge-transit ${t.categorie.type}">${t.categorie.libelle}</span>
            </span>
            <em><button type="button" class="terme" data-transit="${i}" aria-label="Calcul du transit">${t.ecart.toFixed(1).replace('.', ',')}°</button></em>
          </li>`;
      }).join('') + '</ul>';
    }

    $('transits').innerHTML = html;
  }

  // ===================== Profils =====================
  //
  // Les données sont gérées par src/profils.js ; ici, seulement l'affichage :
  //   - le sélecteur « Profil » du formulaire ;
  //   - le panneau « Gérer » (ajouter, modifier, supprimer, exporter).

  const P = window.Toiles.profils;
  let enEdition = null;        // id du profil en cours de modification (null = ajout)
  let suppressionDemandee = null; // id dont la suppression attend confirmation

  /** Date de naissance à utiliser : celle du profil choisi, ou celle tapée à la main. */
  function naissanceCourante() {
    const choix = $('profil').value;
    if (choix === 'autre') return $('naissance').value ? lireDate($('naissance').value) : null;
    const p = choix && P.obtenir(choix);
    return p ? lireDate(p.naissance) : null;
  }

  /** Le profil enregistré choisi dans le sélecteur (null pour « Aucun » ou « Autre date… »). */
  function profilCourant() {
    const choix = $('profil').value;
    return choix && choix !== 'autre' ? P.obtenir(choix) : null;
  }

  /** Remplit le sélecteur et montre le champ date seulement pour « Autre date… ». */
  function remplirSelecteur() {
    const actif = P.actif();
    $('profil').innerHTML =
      '<option value="">Aucun</option>' +
      P.lister().map((p) => `<option value="${p.id}">${echapper(p.nom)}</option>`).join('') +
      '<option value="autre">Autre date…</option>';
    $('profil').value = actif;
    $('champ-naissance').hidden = actif !== 'autre';
  }

  /** Le nom est tapé par l'utilisateur : on neutralise < > & avant de l'insérer dans la page. */
  function echapper(texte) {
    return texte.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  }

  /** "1990-05-15" → "15/05/1990" pour l'affichage. */
  const dateFr = (v) => v.split('-').reverse().join('/');

  function dessinerListe() {
    const liste = P.lister();
    $('liste-profils').innerHTML = liste.length
      ? liste.map((p) => `
        <li>
          <span><strong>${echapper(p.nom)}</strong> <small>${dateFr(p.naissance)}${p.heure ? ' à ' + p.heure : ''}${p.lieu ? ', ' + echapper(p.lieu.nom) : ''} · chemin de vie ${N.cheminDeVie(lireDate(p.naissance))}</small></span>
          <span class="actions">
            <button type="button" class="lien" data-modifier="${p.id}">Modifier</button>
            ${suppressionDemandee === p.id
              ? `<button type="button" class="lien danger" data-supprimer="${p.id}">Confirmer la suppression</button>
                 <button type="button" class="lien" data-garder>Garder</button>`
              : `<button type="button" class="lien" data-demander="${p.id}">Supprimer</button>`}
          </span>
        </li>`).join('')
      : '<li class="vide">Aucun profil pour l’instant.</li>';
  }

  /** Remet le formulaire du panneau en mode « ajout ». */
  function viderFormulaire() {
    enEdition = null;
    $('form-profil').reset();
    $('titre-form').textContent = 'Nouveau profil';
    $('profil-valider').textContent = 'Ajouter';
    $('profil-annuler').hidden = true;
    $('profil-erreur').hidden = true;
  }

  /** Télécharge un fichier sans serveur : un lien temporaire vers un Blob. */
  function telecharger(nomFichier, contenu, type = 'application/json') {
    const url = URL.createObjectURL(new Blob([contenu], { type }));
    const lien = Object.assign(document.createElement('a'), { href: url, download: nomFichier });
    document.body.append(lien);
    lien.click();
    lien.remove();
    URL.revokeObjectURL(url);
  }

  /**
   * Lit le lieu tapé dans le formulaire du panneau.
   * Vide → null ; ville connue → copie de ses données ; inconnue → erreur explicite.
   */
  function lireLieu() {
    const texte = $('profil-lieu').value.trim();
    if (!texte) return null;
    const ville = V.trouver(texte);
    if (!ville) throw new Error(`Ville inconnue : « ${texte} ». Choisis-la dans la liste, ou la ville la plus proche.`);
    return { ...ville };
  }

  function initProfils() {
    remplirSelecteur();
    // Suggestions des villes pendant la saisie (élément <datalist> natif).
    $('liste-villes').innerHTML = V.VILLES.map((v) => `<option value="${echapper(V.libelle(v))}"></option>`).join('');

    $('profil').addEventListener('change', () => {
      P.choisirActif($('profil').value);
      $('champ-naissance').hidden = $('profil').value !== 'autre';
      rendre();
    });

    $('gerer').addEventListener('click', () => {
      suppressionDemandee = null;
      viderFormulaire();
      dessinerListe();
      $('panneau-profils').showModal();
    });
    $('fermer-profils').addEventListener('click', () => $('panneau-profils').close());

    // À la fermeture du panneau : la page reflète les changements.
    $('panneau-profils').addEventListener('close', () => { remplirSelecteur(); rendre(); });

    // Boutons de la liste (un seul écouteur pour toute la liste).
    $('liste-profils').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.modifier) {
        const p = P.obtenir(b.dataset.modifier);
        enEdition = p.id;
        $('profil-nom').value = p.nom;
        $('profil-naissance').value = p.naissance;
        $('profil-heure').value = p.heure || '';
        $('profil-lieu').value = p.lieu ? V.libelle(p.lieu) : '';
        $('profil-nom-complet').value = p.nomComplet || '';
        $('titre-form').textContent = `Modifier ${p.nom}`;
        $('profil-valider').textContent = 'Enregistrer';
        $('profil-annuler').hidden = false;
        $('profil-nom').focus();
      } else if (b.dataset.demander) {
        suppressionDemandee = b.dataset.demander;
      } else if (b.dataset.supprimer) {
        P.supprimer(b.dataset.supprimer);
        if (enEdition === b.dataset.supprimer) viderFormulaire();
        suppressionDemandee = null;
      } else if ('garder' in b.dataset) {
        suppressionDemandee = null;
      }
      dessinerListe();
    });

    $('form-profil').addEventListener('submit', (e) => {
      e.preventDefault();
      try {
        const champs = {
          nom: $('profil-nom').value,
          naissance: $('profil-naissance').value,
          heure: $('profil-heure').value || null,
          lieu: lireLieu(),
          nomComplet: $('profil-nom-complet').value,
        };
        if (enEdition) {
          P.modifier(enEdition, champs);
        } else {
          // Le premier profil créé devient le profil actif : c'est sans doute « moi ».
          const p = P.ajouter(champs);
          if (P.lister().length === 1) P.choisirActif(p.id);
        }
        viderFormulaire();
        dessinerListe();
      } catch (err) {
        $('profil-erreur').textContent = err.message;
        $('profil-erreur').hidden = false;
      }
    });
    $('profil-annuler').addEventListener('click', viderFormulaire);

    $('exporter').addEventListener('click', () =>
      telecharger(`toiles-profils-${versChamp(new Date())}.json`, P.exporter()));

    // Import : le bouton ouvre le sélecteur de fichier ; le fichier est lu dans le
    // navigateur (FileReader via file.text()), rien n'est envoyé nulle part.
    $('importer').addEventListener('click', () => $('fichier-import').click());
    $('fichier-import').addEventListener('change', async () => {
      const fichier = $('fichier-import').files[0];
      $('fichier-import').value = ''; // pour pouvoir réimporter le même fichier
      if (!fichier) return;
      const bilan = $('import-bilan');
      bilan.hidden = false;
      try {
        const r = P.importer(await fichier.text());
        const morceaux = [`${r.ajoutes.length} profil(s) ajouté(s)`];
        if (r.doublons.length) morceaux.push(`${r.doublons.length} doublon(s) ignoré(s) : ${r.doublons.map(echapper).join(', ')}`);
        if (r.invalides.length) morceaux.push(`${r.invalides.length} écarté(s) : ${r.invalides.map((x) => `${echapper(x.nom)} (${x.raison})`).join(', ')}`);
        bilan.innerHTML = morceaux.join(' · ') + '.';
        dessinerListe();
      } catch (err) {
        bilan.textContent = err.message;
      }
    });
  }

  // ===================== Méthodologie =====================
  //
  // Le volet Méthodologie & Pédagogie (src/methodologie.js).
  // Modal <dialog> natif, structuré en deux onglets : Numérologie et Ciel.
  // Chaque fiche détaille le pourquoi, la formule, les limites et les conventions.

  let domaineMethodeActif = 'numerologie';

  function dessinerMethodologie(domaine, sectionIdCible = null) {
    domaineMethodeActif = domaine;

    // Mise à jour des boutons d'onglets
    document.querySelectorAll('#onglets-methodologie .onglet').forEach((btn) => {
      const actif = btn.dataset.onglet === domaine;
      btn.classList.toggle('actif', actif);
      btn.setAttribute('aria-selected', actif ? 'true' : 'false');
    });

    const infoDomaine = M.donnees[domaine];
    $('intro-methodologie').textContent = infoDomaine ? infoDomaine.description : '';

    const sections = M.lister(domaine);
    $('corps-methodologie').innerHTML = sections.map((sec) => `
      <article class="fiche-methode" id="methode-${sec.id}">
        <h3>${sec.titre}</h3>
        <p class="resume">${sec.resume}</p>
        ${sec.formule ? `
          <div class="cadre-formule">
            <strong>Formule &amp; méthode</strong>
            <pre>${sec.formule}</pre>
          </div>` : ''}
        ${sec.paragraphes.map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('')}
      </article>
    `).join('');

    // Défilement fluide vers la section ciblée
    if (sectionIdCible) {
      setTimeout(() => {
        const el = $(`methode-${sectionIdCible}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.classList.add('ciblee');
          setTimeout(() => el.classList.remove('ciblee'), 2500);
        }
      }, 60);
    }
  }

  function ouvrirMethodologie(cleCible = 'numerologie') {
    const cible = M.trouver(cleCible);
    let domaine = 'numerologie';
    let sectionId = null;

    if (cible) {
      if (cible.type === 'domaine') {
        domaine = cible.id;
      } else if (cible.type === 'section') {
        domaine = cible.domaine;
        sectionId = cible.id;
      }
    } else if (cleCible === 'ciel') {
      domaine = 'ciel';
    }

    dessinerMethodologie(domaine, sectionId);
    const panneau = $('panneau-methodologie');
    if (!panneau.open) panneau.showModal();
  }

  function initMethodologie() {
    $('ouvrir-methodologie').addEventListener('click', () => ouvrirMethodologie('numerologie'));
    $('fermer-methodologie').addEventListener('click', () => $('panneau-methodologie').close());

    // Clic sur l'arrière-plan sombre (<dialog>::backdrop) pour fermer
    $('panneau-methodologie').addEventListener('click', (e) => {
      if (e.target === $('panneau-methodologie')) $('panneau-methodologie').close();
    });

    // Clic sur un onglet de navigation
    $('onglets-methodologie').addEventListener('click', (e) => {
      const onglet = e.target.closest('[data-onglet]');
      if (!onglet) return;
      dessinerMethodologie(onglet.dataset.onglet);
    });
  }

  // ===================== Fiches glossaire =====================
  //
  // Panneau <dialog> listant toutes les fiches (src/fiches.js les assemble).
  // - Onglets : « Tout » + une catégorie par onglet (nombres, signes, planètes…).
  // - Recherche : filtre sur le titre, la définition, la lumière/ombre et les mots-clés.
  // - Chaque fiche est un <details> natif : résumé visible, contenu complet au dépli.
  // - ouvrirFiches(cle) : ouvre le panneau directement sur une fiche, dépliée et
  //   mise en évidence. C'est ce qu'appellent les liens « Fiche complète → ».

  let categorieFiches = 'tout';

  /** HTML d'un bloc de fiche (texte, liens vers d'autres fiches, ou 6 domaines). */
  function blocFiche(b) {
    let html = `<h4>${b.titre}</h4>`;
    if (b.texte) html += `<p>${b.texte}</p>`;
    if (b.domaines) {
      html += '<dl class="domaines-fiche">' + b.domaines.map((d) =>
        `<dt>${d.libelle}</dt><dd>${d.texte}</dd>`).join('') + '</dl>';
    }
    if (b.liens) {
      html += '<p class="liens-fiche">' + b.liens.map((l) =>
        `<button type="button" class="lien" data-fiche="${l.cle}">${l.libelle}</button>`).join(' ') + '</p>';
    }
    return html;
  }

  /** HTML d'une fiche complète, repliée par défaut (ouverte si ouverte = true). */
  function htmlFiche(cle, ouverte) {
    const f = F.construire(cle);
    return `
      <details class="fiche" id="fiche-${cle}"${ouverte ? ' open' : ''}>
        <summary><strong>${f.titre}</strong><span>${f.court}</span></summary>
        <div class="fiche-corps">${f.blocs.map(blocFiche).join('')}</div>
      </details>`;
  }

  /** Redessine les onglets et la liste selon la catégorie et la recherche en cours. */
  function dessinerFiches(cleOuverte = null) {
    $('onglets-fiches').innerHTML = [{ id: 'tout', libelle: 'Tout' }, ...F.CATEGORIES].map((c) => `
      <button type="button" class="onglet${c.id === categorieFiches ? ' actif' : ''}" data-categorie="${c.id}"
        role="tab" aria-selected="${c.id === categorieFiches}">${c.libelle}</button>`).join('');

    const recherche = cleGlossaire($('recherche-fiches').value.trim());
    const cles = F.lister(categorieFiches).filter((c) => !recherche || F.texteRecherche(c).includes(recherche));
    $('corps-fiches').innerHTML = cles.length
      ? cles.map((c) => htmlFiche(c, c === cleOuverte)).join('')
      : '<p class="aide-profil">Aucune fiche ne correspond à cette recherche.</p>';
  }

  /** Ouvre le panneau ; avec une clé, se place sur cette fiche (dépliée, surlignée). */
  function ouvrirFiches(cle = null) {
    if (cle && G[cle]) {
      categorieFiches = G[cle].categorie; // on affiche l'onglet de la fiche visée
      $('recherche-fiches').value = '';   // et on retire un éventuel filtre qui la cacherait
    }
    dessinerFiches(cle);
    const panneau = $('panneau-fiches');
    if (!panneau.open) panneau.showModal();
    if (cle) {
      const el = $(`fiche-${cle}`);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        el.classList.add('ciblee');
        setTimeout(() => el.classList.remove('ciblee'), 2500);
      }
    }
  }

  function initFiches() {
    $('ouvrir-fiches').addEventListener('click', () => ouvrirFiches());
    $('fermer-fiches').addEventListener('click', () => $('panneau-fiches').close());
    // Clic sur l'arrière-plan sombre pour fermer
    $('panneau-fiches').addEventListener('click', (e) => {
      if (e.target === $('panneau-fiches')) $('panneau-fiches').close();
    });
    $('onglets-fiches').addEventListener('click', (e) => {
      const onglet = e.target.closest('[data-categorie]');
      if (!onglet) return;
      categorieFiches = onglet.dataset.categorie;
      dessinerFiches();
    });
    $('recherche-fiches').addEventListener('input', () => dessinerFiches());
  }

  /** Relit le formulaire et redessine tout. */
  function rendre() {
    if (!$('date').value) return;
    const date = lireDate($('date').value);
    const naissance = naissanceCourante();
    rendreNumerologie(date, naissance, $('domaine').value);
    const pos = A.positions(date);
    rendreSynthese(date, pos);
    rendreCiel(date);
    rendreCarteGeo([...pos, ...CP.positions(date)]);
    rendreCarteHelio(date);
    const profil = profilCourant();
    const theme = MS.calculer(profil);   // null sans heure ni lieu de naissance
    rendreMaisons(theme, profil, $('domaine').value);
    rendreTransits(date, naissance, theme && theme.theme);
    rendreCroisee(date, naissance, $('domaine').value);
    rendreLecon(date);
    // v0.7 : cycles longs, nom, sidéral, calendrier, journal.
    rendreCycles(date, naissance);
    rendreNom(profil, $('domaine').value);
    rendreSideral(date, pos);
    rendreCalendrier(date, naissance);
    rendreJournal(date, naissance);
  }

  // ===================== 5. Démarrage =====================

  $('domaine').innerHTML = N.DOMAINES
    .map((d) => `<option value="${d}">${LIBELLES_DOMAINES[d]}</option>`).join('');
  $('date').value = versChamp(new Date());

  // Bouton de thème clair / sombre (logique dans src/theme.js).
  globalThis.Toiles.theme.brancherBoutonTheme($('bouton-theme'));
  semerEtoiles();
  initFiltre();
  initInfobulles();
  initProfils();
  initMethodologie();
  initFiches();
  initCalendrier();
  initJournal();
  initQuiz();
  // Choix de l'ayanamsa (comparaison sidérale), mémorisé comme le filtre.
  $('ayanamsa').innerHTML = Object.entries(CP.AYANAMSAS)
    .map(([cle, a]) => `<option value="${cle}">${a.nom}</option>`).join('');
  $('ayanamsa').value = memoire.lire('toiles_ayanamsa', 'lahiri');
  $('ayanamsa').addEventListener('change', () => { memoire.ecrire('toiles_ayanamsa', $('ayanamsa').value); rendre(); });
  // Le filtre et le sélecteur de profil ont leur propre écouteur : on ne redessine pas pour eux.
  $('form').addEventListener('input', (e) => { if (e.target.name !== 'vue' && e.target.id !== 'profil') rendre(); });
  rendre();
})();
