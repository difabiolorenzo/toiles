# TODO — Toiles

## Grandes lignes

1. **Socle & Vue Aujourd'hui** : numérologie pythagoricienne, ciel tropical géocentrique, dynamique des énergies, aspects majeurs et profils en local.
2. **Transits personnels** : comparaison du ciel du jour avec le thème natal du profil (positions planétaires à la naissance, orbes resserrés).
3. **Fiches & Glossaire enrichi** : fiches complètes par nombre, signe, planète et aspect (lumière/ombre, 6 domaines), vue dédiée et liens directs.
4. **Habillage « Toiles »** : application du système de design (thèmes Carte céleste / Nuit vivante, Inter, jetons de couleur et d'espacement, schémas géocentrique et héliocentrique).
5. **Lecture croisée** : correspondances concertées nombre ↔ astre ↔ élément, phrases explicatives dynamiques par domaine de vie.
6. **Méthodologie & Pédagogie** : volet explicatif complet (formules, pas à pas, limites) accessible depuis les infobulles, leçon du jour.
7. **Ascendant & Maisons** : heure et lieu de naissance, temps sidéral, domification (système égal ou Placidus), association aux 6 domaines.
8. **Évolutions futures** : import des profils, journal quotidien, calendrier mensuel, cycles longs, nœuds lunaires, publication GitHub Pages.

## Décisions prises

- **Approche technique** : JavaScript vanilla (ES6+), HTML5 et CSS3 natifs, zéro dépendance, zéro outil de build ni bundler, zéro CDN
- **Mode d'exécution** : ouverture directe par double-clic sur `index.html` (protocole `file://`) ; scripts classiques `<script src>` rattachés à `globalThis.Toiles` (pas de modules ES `import`/`export` bloqués en local, pas de `fetch` de fichiers locaux) ; exécution compatible Node.js pour les tests
- **Langue & documentation** : 100 % français (interface, noms de variables explicites, commentaires détaillés expliquant le *pourquoi* des calculs)
- **Architecture du code** : séparation stricte entre calculs purs sans DOM (`src/numerologie.js`, `src/astres.js`, `src/transits.js`, `src/fiches.js`, `src/croisee.js`), données textuelles (`src/textes.js`, `src/glossaire.js` — qui contient aussi le sens des nombres —, `src/positions.js`), stockage (`src/profils.js`) et rendu d'interface (`src/app.js`)
- **Persistance des données** : stockage exclusif dans le `localStorage` du navigateur (profils, filtres d'affichage), systématiquement encapsulé dans des `try/catch` ; export de sécurité en JSON
- **Interface & Expérience** : interface sobre (voir *Système de design*), accessible et réactive (ordinateur et mobile) ; support automatique du mode sombre selon les préférences système ; dialogues modaux natifs `<dialog>` sans alert/confirm intrusifs
- **Système de design** : référence = artefact « Toiles - Système de design » (claude.ai). Deux thèmes à structure commune : **Carte céleste** (clair : parchemin `#efe4cc`, encre `#241b10`, filets dorés) et **Nuit vivante** (sombre : nuit `#080b1f`, lavande, étoiles scintillantes) ; suivi de `prefers-color-scheme` + bouton de thème forçant `data-theme` sur `<html>` (mémorisé en localStorage). Lisibilité avant ambiance : texte ≥ 7:1 dans les deux thèmes ; `accent` réservé aux surfaces, `glyph` pour symboles et texte coloré ; `line` décoratif seulement (bordure de contrôle = `ink-muted`). Pas de couleur par élément (on les nomme), pas de carte à bordure gauche colorée, pas d'ombre
- **Typographie** : une seule police, **Inter**, mais **embarquée localement** (`polices/Inter-*.woff2` + `@font-face`) au lieu du lien Google Fonts proposé par le système de design — règle zéro CDN et usage hors ligne en `file://` ; repli `system-ui`. Échelle : `numeral` 76/300, `title` 32/500 (0,12em), `heading` 22/500, `body`/`data` 19px (450 en clair, 400 en sombre ; `data` en `tabular-nums`), `label` 15/500, `caption` 15 italique
- **Écarts assumés avec le système de design** : `glyph` clair = `#523a10` (un ton plus foncé que `accent`, pour garder 7:1 sur `track`) ; texte jamais posé sur `accent` (6,5:1 en clair, 4,2:1 en sombre) → pastilles et boutons pleins en `--pastille` (= `glyph`) avec texte `--sur-pastille` (= `surface`) ; harmonie / tension / fusion assombries en clair (≥ 7:1) ; Toiles garde ses **9 astres** (le système en montre 7 : on ajoute Uranus et Neptune aux tables et schémas) ; les aspects harmonie / tension / fusion ne sont plus distingués par la teinte seule mais par le symbole et le mot, avec au besoin une variation de clarté ; les glyphes Unicode sont suivis de `U+FE0E` (pas de rendu emoji)
- **Domaines de vie** : grille de lecture unifiée en 6 domaines (`essence`, `amour`, `travail`, `finances`, `sante`, `spiritualite`)
- **Numérologie** : école pythagoricienne ; réduction théosophique préservant les maîtres-nombres 11, 22 et 33 ; calculs universels et personnels (année, mois, jour) ; convention Toiles pour la semaine (mois universel/personnel + n° de semaine ISO)
- **Astrologie** : zodiaque tropical géocentrique ; 9 astres calculés (Soleil, Lune, Mercure, Vénus, Mars, Jupiter, Saturne, Uranus, Neptune) ; positions selon les éléments orbitaux de Paul Schlyter complétés par les perturbations majeures (Lune, Jupiter, Saturne) ; précision < 1° vérifiée sur des dates repères ; granularité journalière (midi TU par défaut)
- **Lecture croisée** : table nombre ↔ planète (1 Soleil, 2 Lune, 3 Jupiter, 4 Uranus, 5 Mercure, 6 Vénus, 7 Neptune, 8 Saturne, 9 Mars ; maîtres-nombres → racine), élément = domicile de la planète ; correspondances expliquées une à une, jamais de note globale
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

### v0.4 — Habillage « Toiles » (système de design)
- [x] Jetons CSS (`src/toiles.css`) — remplacer `--fond`, `--carte`, `--texte`, `--doux`, `--ligne`, `--accent` par les jetons du système : `--bg`, `--surface`, `--ink`, `--ink-muted`, `--accent`, `--glyph`, `--line`, `--track`, `--sun`, `--earth`, `--planet`, `--star`, `--focus` ; espacements `--space-1`…`--space-7` (grille 4px), rayons `--radius-sm` 6px / `--radius-md` 16px / `--radius-pill` ; commenter en tête le rôle et le contraste de chaque jeton
- [x] Thèmes clair / sombre — valeurs sous `@media (prefers-color-scheme: dark)` gardé par `:root:not([data-theme="light"])` et répétées sous `:root[data-theme="dark"]` ; fondu des couleurs en 0,4 s
- [x] Bouton de thème (`index.html`, `src/theme.js` chargé dans le `<head>` pour éviter le flash, branché dans `src/app.js`) — pilule `ink-muted`, libellé « Passer en thème sombre / clair », `data-theme` sur `<html>`, choix mémorisé en localStorage dans un `try/catch`, anneau `focus` 2px
- [x] Police Inter locale — Inter 4.1 variable (rsms/inter) dans `polices/` (`InterVariable.woff2`, `-Italic`, licence OFL jointe) ; `@font-face` dans `src/toiles.css` (`local()` d'abord, repli système) (woff2 300–600, licence OFL jointe), `@font-face` dans `src/toiles.css`, graisse 450 en clair / 400 en sombre ; vérifier le chargement en double-clic (`file://`)
- [x] Échelle typographique — classes `numeral`, `title`, `heading`, `body`, `data`, `label`, `caption` ; en-tête « ✶ Toiles » en `title` (fin des majuscules espacées en `--accent`)
- [x] Synthèse du jour (nouveau composant pleine largeur en tête de la grille) — teinte = élément dominant parmi les astres, barre de proportion (`track` / `accent`), nombre du jour en `numeral` avec son addition en `caption` (`1+5+1+1+2+0+2+6 = 18 → 9`), tendance, Lune (disque `track`, partie éclairée `planet`) ; étoiles scintillantes en thème sombre seulement, figées si `prefers-reduced-motion` ; Lune masquée sous 560px ; calcul de la teinte dans `src/astres.js` (`teinteDuJour()`, un astre = 1, départage par le poids) + test ; l'addition suit la cascade du jour universel (`additionDuJour()` dans `src/numerologie.js`, pas la somme brute des chiffres qui diverge avec les maîtres-nombres) ; tendance = mot de l'élément (`tendances` dans `src/textes.js`) ; reste toujours visible quel que soit le filtre
- [x] Table des positions — glyphe en `glyph`, nom en `ink`, position en `data` à droite, degrés entiers dans le texte (décimales réservées aux vues techniques), séparateurs pointillés `line`, ℞ en `glyph` avec `title="rétrograde"` (remplace `.retro` en `--tension`)
- [x] Carte géocentrique (SVG généré dans `src/app.js`, géométrie pure dans `src/schemas.js` : `carteGeocentrique()`, `niveauxDeRecul()`) — Terre au centre, anneau de 12 signes, Bélier 0° à gauche, sens antihoraire ; astres à moins de 12° décalés de 28px vers l'intérieur avec trait `ink-muted` vers leur degré ; `<title>` (nom, position, ℞) sur chaque glyphe
- [x] Carte héliocentrique — Soleil au centre, orbites pointillées régulières (`line`, tirets 3/4), Terre en `earth` plus grosse, même orientation ; note « distances non à l'échelle » obligatoire ; `positionsHeliocentriques()` dans `src/astres.js` (Terre = Soleil + 180°), testé sur les oppositions de Mars 01/2025, Saturne 09/2025, Jupiter 01/2026 ; 8 orbites (jusqu'à Neptune)
- [x] Aspects et transits sans code couleur seul — retirer les bordures gauches colorées (`.aspects li.harmonie/tension/fusion`, `.avertissement-lune`) ; nature de l'aspect portée par le symbole et le mot ; badges de transit en `ink-muted` / `glyph`
- [x] Grille et cartes — cartes `surface` + bordure `line` 1px, `radius-md`, rembourrage et gouttière `space-5`, colonnes de 300px minimum, une colonne sur mobile (gouttière `space-4`), marges de page `space-7`
- [x] Panneaux `<dialog>`, bulles et formulaires (profils, fiches, méthodologie) — mêmes jetons ; contrôles bordés en `ink-muted`, focus visible ; intertitres en style `label` (fin des majuscules espacées), rayons `radius-sm` / `radius-md`, cadres de formule sans bordure gauche, fiche ciblée entourée en `focus`
- [x] Ton des textes — relire `src/textes.js`, `src/positions.js`, `src/methodologie.js` : présent, pas de prédiction affirmée (« tendance : … », jamais « vous allez… »), noms des signes et planètes avec majuscule, degrés sans décimale ; aucune prédiction trouvée ; tutoiement unifié (les textes des transits et du thème natal vouvoyaient)
- [x] Vérification — contrastes mesurés dans le navigateur sur chaque texte visible, page et panneaux ouverts : minimum 7,3:1 en clair, 10,3:1 en sombre, téléphone et ordinateur, aucune erreur console, `node tests/tout.js` au vert
- [x] Logo « L'étoile tissée » (piste 1 de la maquette « Toiles - Pistes de logo ») — trois fils croisés, cœur évidé, point `glyph` ; SVG en ligne dans l'en-tête de `index.html` (suit les jetons et le bouton de thème), icône d'onglet `images/logo.svg` (couleurs clair/sombre via `prefers-color-scheme`)

### v0.5 — Lecture croisée & Leçon du jour
- [x] Décision concertée sur la table de correspondances — `CORRESPONDANCES` dans `src/croisee.js` : 1 Soleil, 2 Lune, 3 Jupiter, 4 Uranus, 5 Mercure, 6 Vénus, 7 Neptune, 8 Saturne, 9 Mars (table moderne la plus répandue, lignée Cheiro) ; 11/22/33 → planète de la racine ; élément = élément du domicile de la planète (convention Toiles) ; relations écho / complices (Feu-Air, Terre-Eau) / contraste — validée par l'utilisateur
- [x] Module Lecture croisée (`src/croisee.js`, `lire()`) — jour personnel (ou universel sans profil) ↔ planète ↔ élément : signe et dignité du jour de la planète, élément face au signe et à la teinte, aspects serrés (≤ 3°) ; domaine en trois phrases de sources distinctes (nombre, planète, relation) ; pas de note globale. Carte « Lecture croisée » + filtre « Croisée » (`index.html`, `rendreCroisee()` dans `src/app.js`)
- [x] Infobulle et méthodologie de la lecture croisée — `croisee` et `lecon` dans `src/textes.js` ; troisième onglet « Lecture croisée » dans `src/methodologie.js` (sections `correspondances`, `leconDuJour`), `trouver()` parcourt tous les domaines
- [x] Leçon du jour (`lecon()` dans `src/croisee.js`, `rendreLecon()` dans `src/app.js`) — priorité : lunaison (jour civil le plus proche de l'exact, ±6,5°), station (sens différent aujourd'hui / demain), maître-nombre du jour, aspect exact (< 0,5°, Lune exclue), rétrogradation de Mercure/Vénus/Mars, sinon notion de base tournante ; texte tiré de la fiche du glossaire, liens « Fiche complète » et « En savoir plus »
- [x] Tests de non-régression — 7 tests dans `tests/tests.js` : table vs domiciles du glossaire, relations, 15/11/2026, jour personnel, un an × 6 domaines sans phrase vide ni répétée, dates connues (nouvelle lune 9/11/2026, pleine lune 24/11/2026, station directe de Mercure 13/11/2026, jour 22 le 19/11/2026), ≈ 49 lunaisons sur deux ans sans doublon
- [x] Vérification dans le navigateur (http://localhost/GitHub/toiles/) — cartes Leçon du jour et Lecture croisée rendues, aucune erreur console
- [x] Bouton de thème en icône (`src/theme.js`, `.bouton-icone` dans `src/toiles.css`) — ☾ pour passer en sombre, ☀ pour passer en clair ; libellé complet conservé en `aria-label` et `title`, cible de 44px

### v0.6 — Ascendant & Domification (Maisons)
- [ ] Profil enrichi — ajout optionnel de l'heure légale et du lieu de naissance dans `src/profils.js`
- [ ] Référentiel des villes (`src/villes.js`) — table locale de coordonnées géographiques avec calcul du temps universel (TU) et gestion des fuseaux/heures d'été historiques
- [ ] Calculs astronomiques d'angles — calcul du temps sidéral local, de l'Ascendant (AS) et du Milieu du Ciel (MC)
- [ ] Calcul des 12 maisons astrologiques — choix et implémentation d'un système de domification (maisons égales ou Placidus)
- [ ] Rattachement des maisons aux domaines — projection des 12 maisons sur les 6 domaines de Toiles (ex. Maison X ↔ travail, Maison VII ↔ amour)
- [ ] Tests comparatifs sur des thèmes astraux de référence (naissances hiver / été)

### v0.7+ — Consolidation & Évolutions futures
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
