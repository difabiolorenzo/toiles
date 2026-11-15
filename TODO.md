# TODO — Toiles

## Grandes lignes

1. **Socle & Vue Aujourd'hui** : numérologie pythagoricienne, ciel tropical géocentrique, dynamique des énergies, aspects majeurs et profils en local.
2. **Transits personnels** : comparaison du ciel du jour avec le thème natal du profil (positions planétaires à la naissance, orbes resserrés).
3. **Fiches & Glossaire enrichi** : fiches complètes par nombre, signe, planète et aspect (lumière/ombre, 6 domaines), vue dédiée et liens directs.
4. **Lecture croisée** : correspondances concertées nombre ↔ astre ↔ élément, phrases explicatives dynamiques par domaine de vie.
5. **Méthodologie & Pédagogie** : volet explicatif complet (formules, pas à pas, limites) accessible depuis les infobulles, leçon du jour.
6. **Ascendant & Maisons** : heure et lieu de naissance, temps sidéral, domification (système égal ou Placidus), association aux 6 domaines.
7. **Évolutions futures** : import des profils, journal quotidien, calendrier mensuel, cycles longs, nœuds lunaires, publication GitHub Pages.

## Décisions prises

- **Approche technique** : JavaScript vanilla (ES6+), HTML5 et CSS3 natifs, zéro dépendance, zéro outil de build ni bundler, zéro CDN
- **Mode d'exécution** : ouverture directe par double-clic sur `index.html` (protocole `file://`) ; scripts classiques `<script src>` rattachés à `globalThis.Toiles` (pas de modules ES `import`/`export` bloqués en local, pas de `fetch` de fichiers locaux) ; exécution compatible Node.js pour les tests
- **Langue & documentation** : 100 % français (interface, noms de variables explicites, commentaires détaillés expliquant le *pourquoi* des calculs)
- **Architecture du code** : séparation stricte entre calculs purs sans DOM (`src/numerologie.js`, `src/astres.js`, `src/transits.js`, `src/fiches.js`), données textuelles (`src/textes.js`, `src/glossaire.js` — qui contient aussi le sens des nombres —, `src/positions.js`), stockage (`src/profils.js`) et rendu d'interface (`src/app.js`)
- **Persistance des données** : stockage exclusif dans le `localStorage` du navigateur (profils, filtres d'affichage), systématiquement encapsulé dans des `try/catch` ; export de sécurité en JSON
- **Interface & Expérience** : interface sobre, accessible et réactive (ordinateur et mobile) ; support automatique du mode sombre selon les préférences système ; dialogues modaux natifs `<dialog>` sans alert/confirm intrusifs
- **Domaines de vie** : grille de lecture unifiée en 6 domaines (`essence`, `amour`, `travail`, `finances`, `sante`, `spiritualite`)
- **Numérologie** : école pythagoricienne ; réduction théosophique préservant les maîtres-nombres 11, 22 et 33 ; calculs universels et personnels (année, mois, jour) ; convention Toiles pour la semaine (mois universel/personnel + n° de semaine ISO)
- **Astrologie** : zodiaque tropical géocentrique ; 9 astres calculés (Soleil, Lune, Mercure, Vénus, Mars, Jupiter, Saturne, Uranus, Neptune) ; positions selon les éléments orbitaux de Paul Schlyter complétés par les perturbations majeures (Lune, Jupiter, Saturne) ; précision < 1° vérifiée sur des dates repères ; granularité journalière (midi TU par défaut)
- **Aspects & Dignités** : 5 aspects majeurs (conjonction 0°, opposition 180°, trigone 120°, carré 90°, sextile 60°) avec orbes définis ; système de dignités classiques (domicile, exaltation, exil, chute, affinité d'élément) documenté dans `src/positions.js`
- **Validation** : suite de tests automatisée sans dépendance (`node tests/tout.js` ou `tests/index.html`), passage obligatoire au vert avant chaque livraison

## Prochaines étapes

### v0.1 — Socle & Vue Aujourd'hui
- [x] Structure du projet sans build (index.html, src/, tests/, feuille de style `toiles.css` avec support clair/sombre)
- [x] Module Numérologie (`src/numerologie.js`) — réduction théosophique, maîtres-nombres 11/22/33, nombres universels et personnels (année, mois, semaine ISO, jour), décomposition pas à pas
- [x] Module Ciel (`src/astres.js`) — positions de Schlyter, perturbations Lune/Jupiter/Saturne, phases lunaires, rétrogradations, aspects majeurs, équilibre éléments/modes
- [x] Textes et descriptions initiales — 108 textes « planète en signe » rédigés (`src/positions.js`), glossaire de base (`src/glossaire.js`), infobulles « Comment ça marche » (`src/textes.js`)
- [x] Gestionnaire de profils (`src/profils.js`) — stockage local dans localStorage, sélection, modal `<dialog>`, export JSON
- [x] Interface Aujourd'hui (`src/app.js`) — affichage par date et domaine, bascule de vue (numérologie / ciel / tout), popups d'infobulles et glossaire au clic
- [x] Suite de tests (`tests/tout.js`, `tests/tests.js`, `tests/index.html`) — 16 tests de non-régression couvrant les calculs, textes et profils
- [x] Commentaires détaillés dans le code — expliciter en français le *pourquoi* des algorithmes : Schlyter et perturbations dans `longitude()`, résolution de Kepler par Newton-Raphson dans `positionOrbitale()` (`src/astres.js`), cascade des périodes dans `src/numerologie.js`
- [x] Volet Méthodologie initial (`src/methodologie.js`) — rédiger les sections Numérologie (pythagoricienne, réduction, cascade, semaine ISO) et Ciel (zodiaque tropical, Schlyter, Kepler, perturbations, phases, dignités)
- [x] Navigation vers la Méthodologie — ajouter le lien « En savoir plus » au bas des infobulles existantes vers la section dédiée

### v0.2 — Transits & Thème natal
- [x] Thème natal dans `src/astres.js` ou module dédié — calcul des positions planétaires à la date de naissance d'un profil (à midi TU faute d'heure) avec avertissement si la Lune change de signe ce jour-là
- [x] Module Transits (`src/transits.js`) — calcul des aspects entre le ciel du jour et le thème natal, avec orbes resserrés (1° à 3°) et tri par importance (planètes lentes prioritaires)
- [x] Intégration dans la vue Aujourd'hui (`index.html`, `src/app.js`) — nouvelle carte « Transits personnels », filtre d'affichage adapté
- [x] Infobulle et méthodologie des transits (`src/textes.js`, `src/methodologie.js`) — expliquer la distinction ciel collectif / transits personnels, orbes et rôle des lentes
- [x] Tests unitaires des transits (`tests/tests.js`) — validation des calculs d'aspects natals et des orbes (6 tests : thème natal J2000, avertissement Lune, limites d'orbes, tri, auto-conjonction, calcul détaillé)

### v0.3 — Fiches & Glossaire complet
- [x] Centralisation des nombres dans `src/glossaire.js` — `SENS` migré depuis `src/numerologie.js` en entrées `nombre1`…`nombre33` (mot, 6 domaines, lumière, ombre, mots-clés) ; `interpreter()` lit le glossaire au moment de l'appel
- [x] Enrichissement des entrées existantes — champ `categorie` partout ; signes : planètes maîtresses (`maitres`), lumière/ombre, 6 domaines ; planètes et aspects : lumière/ombre, 6 domaines
- [x] Relecture éditoriale des 108 combinaisons « planète en signe » dans `src/positions.js` — règles de rédaction documentées en tête de `TEXTES` (forme « … : … », ≤ 110 caractères, 3 mots-clés, revers distinct des mots-clés) ; Mars en Lion resserré, Jupiter en Vierge réécrit (cohérent avec l'exil), recoupements revers/mots-clés corrigés
- [x] Vue dédiée « Fiches glossaire » — `src/fiches.js` (assemblage pur : liens dignités, éléments, maîtres) + panneau `<dialog>` dans `index.html` / `src/app.js` : onglets par catégorie, recherche sans accents, fiches dépliables
- [x] Liens transversaux — « Fiche complète → » au pied de chaque bulle (termes, positions, aspects, transits), pastilles des nombres cliquables, liens d'une fiche à l'autre
- [x] Test de complétude du glossaire — `tests/tests.js` : aucun terme cliquable sans fiche ni bloc vide, lumière/ombre/6 domaines, maîtres = domiciles, liens transversaux, recherche, forme des 108 textes

### v0.4 — Lecture croisée & Leçon du jour
- [ ] Décision concertée sur la table de correspondances — formaliser les équivalences nombre ↔ planète ↔ élément et leurs sources
- [ ] Module Lecture croisée (`src/croisee.js`) — synthèse rédigée par domaine faisant dialoguer nombres du jour et positions planétaires sans redondance de formulation
- [ ] Infobulle et méthodologie de la lecture croisée dans `src/textes.js` et `src/methodologie.js`
- [ ] Leçon du jour — sélection dynamique quotidienne d'un concept marquant du jour (pleine lune, aspect exact, maître-nombre, rétrogradation) avec explication pédagogique issue des fiches
- [ ] Tests de non-régression pour la lecture croisée et la leçon du jour

### v0.5 — Ascendant & Domification (Maisons)
- [ ] Profil enrichi — ajout optionnel de l'heure légale et du lieu de naissance dans `src/profils.js`
- [ ] Référentiel des villes (`src/villes.js`) — table locale de coordonnées géographiques avec calcul du temps universel (TU) et gestion des fuseaux/heures d'été historiques
- [ ] Calculs astronomiques d'angles — calcul du temps sidéral local, de l'Ascendant (AS) et du Milieu du Ciel (MC)
- [ ] Calcul des 12 maisons astrologiques — choix et implémentation d'un système de domification (maisons égales ou Placidus)
- [ ] Rattachement des maisons aux domaines — projection des 12 maisons sur les 6 domaines de Toiles (ex. Maison X ↔ travail, Maison VII ↔ amour)
- [ ] Tests comparatifs sur des thèmes astraux de référence (naissances hiver / été)

### v0.6+ — Consolidation & Évolutions futures
- [ ] Import des profils JSON — rechargement du fichier de sauvegarde avec validation de format et détection des doublons dans `src/profils.js`
- [ ] Module Journal de bord — saisie et conservation du ressenti quotidien face aux configurations du jour (stockage localStorage, export)
- [ ] Calendrier mensuel — vue d'ensemble du mois combinant nombres du jour et cycle des phases lunaires
- [ ] Cycles longs en numérologie — calcul des cycles de 9 ans, pinacles et défis
- [ ] Nœuds lunaires (Nord et Sud) — formule de calcul et intégration dans la carte du ciel
- [ ] Quiz d'apprentissage — module interactif de mémorisation basé sur les fiches du glossaire
- [ ] Publication sur GitHub Pages — documentation et adaptation pour hébergement statique en ligne
- [ ] Numérologie du nom complet — calcul de l'expression, de l'élan spirituel et du moi intime (conventions lettres/accents)
- [ ] Intégration de Pluton — algorithme orbital adapté pour orbite perturbée
- [ ] Option astrologie sidérale — sélection d'un ayanamsa (Lahiri, Fagan-Bradley) pour comparaison tropical / sidéral
- [ ] Intégration de Chiron — éphémérides ou approximation de son orbite très excentrique
