# 🌌 Cyber Pong Tron — Version 1.0.0

Un jeu d'arcade frénétique rétro-futuriste inspiré de l'univers de TRON, développé en JavaScript Vanilla (Canvas 2D) avec une architecture logicielle modulaire haut de gamme.

## ![Cyber Pong Tron Preview](<Screen_Site/Screenshot 2026-11-01 at 17-35-34 cyber-pong-tron_Depart.png>)

## 🕹️ Concept & Game Design (Rupture des Codes)

Contrairement au Pong traditionnel où la balle s'échappe et réinitialise le jeu à chaque point, **Cyber Pong Tron maintient le flux d'énergie continu** :

- **Arène Verrouillée :** La balle rebondit sur les 4 murs en permanence. Les lignes de fond derrière les raquettes deviennent des zones de pénalité de flux.
- **Murs de Danger (Système d'Avantage) :** Encaisser un but allume votre mur de fond en rouge néon fixe (Alerte Critique). Encaisser un second but en mode Alerte déclenche le **Game Over**.
- **Mécanique de Tie-Break Visuel :** Marquer un but alors que votre mur est rouge éteint votre alerte et vous remet en jeu. Pour gagner, vous devez éteindre votre alerte, pousser le mur adverse en mode Danger, puis lui asséner le coup de grâce !
- **Vitesse Exponentielle :** La comète orange accélère de 5% à chaque impact de raquette pour une tension maximale. Encaisser un but divise l'énergie de la balle par 2 (sans jamais descendre sous sa vitesse d'origine).

## 🏗️ Architecture Logicielle (Modulaire ES6)

Le projet applique les Design Patterns classiques du jeu vidéo pour une séparation stricte des responsabilités :

```text
cyber-pong-tron/
├── index.html          # Point d'entrée unique (Mode Module)
├── Style/
│   └── style.css       # Ambiance néon Cyberpunk (Effets de Bloom/Shadow)
└── JavaScript/
    ├── main.js         # Initialisation et orchestration globale
    ├── Engine/
    │   ├── gameLoop.js # Cœur du jeu (Gestion du DeltaTime à FPS constant)
    │   ├── input.js    # Gestionnaire des entrées clavier (Position physique KeyW/KeyS)
    │   └── network.js  # Prévu pour le mode WebRTC P2P
    ├── States/
    │   ├── stateManager.js # Machine à États (Aiguilleur des écrans)
    │   ├── menuState.js    # Écran d'accueil bleu néon
    │   ├── gameState.js    # Zone de match (IA intégrée, collisions avancées, décompte)
    │   └── endState.js     # Écran de fin dynamique (Victoire / Game Over)
    └── Entities/
        ├── board.js    # Gestion adaptative de l'arène (PC horizontal vs Mobile vertical)
        ├── paddle.js   # Raquettes néon avec bords arrondis (roundRect)
        └── ball.js     # Comète d'énergie orange avec traînée continue (Lightcycle trail)
```

## 🎮 Commandes

- **Menu :** ESPACE pour lancer le match.
- **Match (Joueur) :** Touches Z / S (S'adapte automatiquement en W / S sur les claviers QWERTY grâce à la détection de l'emplacement physique).
- **Match (IA) :** Algorithme de tracking automatique autonome avec zone morte de stabilisation.
- **Écran de Fin :** ENTRÉE pour Rejouer (Reset complet de l'état du match) / ÉCHAP pour revenir au Menu.

## 🚀 Roadmap (Évolutions à venir)

### ⚙️ Phase 1 : Système de Paramètres Avancés (Validée & Opérationnelle)

- [x] **Sélecteur de Difficulté Dynamique :**
  - **Facile :** Accélération à +3% par coup de raquette, vitesse de l'IA à 60% du joueur.
  - **Moyen :** Accélération standard à +5%, vitesse de l'IA à 75%.
  - **Difficile :** Vitesse de l'IA à 95% (Style demi-dieu).
  - **Hardcore :** Le défi ultime pour les pilotes d'élite (Vitesse maximale et malice agressive activée).
- [x] **Customisation Esthétique Néon (Palette Isolée) :** Menu à défilement horizontal permettant de changer instantanément la couleur de la raquette joueur, de la raquette adverse, de la comète d'énergie (avec sa traînée _Lightcycle_) et de l'encadrement lumineux de l'arène.
- [x] **Gestion des Côtés & Inversion Logique :** Inversion complète et en temps réel des commandes physiques, des alarmes de danger critiques et du comportement autonome de l'IA selon le côté choisi (Gauche ou Droite).
- [x] **Centralisation Audio (Master Volume) :** Contrôle absolu du gain à paliers de 5% géré de manière autonome par le moteur audio sur l'intégralité des bips système et des thèmes MP3.

### 🤝 Phase 2 : Révolution Multijoueur

- **Mode Multijoueur Local :** Possibilité de jouer à deux sur le même clavier PC (Joueur 1 en Z/S, Joueur 2 en Flèches) ou sur le même écran tactile mobile (Face-à-Face vertical).
- **Mode En Ligne WebRTC (Peer-to-Peer) :**
  - Connexion instantanée sans serveur de jeu lourd.
  - Génération d'un QR Code unique sur l'appareil hôte.
  - Scan par le Joueur 2 pour lier les deux téléphones en une fraction de seconde.

---

## 👤 À propos de l'Auteur

Ce moteur de jeu rétro-futuriste a été développé avec passion par **Ki->ir->rA**, développeur indépendant spécialisé dans la création d'interfaces web dynamiques, d'expérimentations graphiques sur Canvas et de moteurs de jeu bidimensionnels légers.

Si ce voyage au cœur de la Grille néon vous a plu ou que vous utilisez ces modules d'architecture dans vos propres créations, n'hésitez pas à laisser une ⭐️ sur ce dépôt pour soutenir le projet !

- **GitHub :** [@Sylvain-G404](https://github.com/Sylvain-G404)
- **Portfolio :** [Mon-Portfolio-Temps](https://sylvain-g404.github.io/Mon-Portfolio-Temps/)

---

## ⚡ NOUVEAUTÉ : Version 2.0 — L'Ère HD & Physique Adaptative (Active)

Cette mise à jour marque le passage du prototype vers une architecture de production haut de gamme (AAA), préparant le jeu pour son intégration finale sous **Tauri 2**.

### 🛠️ Le Journal des Modifications (Changelog V2)

#### 1. Moteur Physique Dynamique (Système de Croquis 🎯)

- **Rebonds Réalistes :** Liaison des axes de vitesse vertical (`vy`) et horizontal (`vx`) via le théorème de Pythagore. La balle conserve une énergie cinétique globale constante lors de l'impact, supprimant les accélérations anormales.
- **Technique des 3 Zones d'Impact :**
  - **Zone Centre (Impact Neutre) :** Redressement de la trajectoire à l'horizontale parfaite (`vy = 0`) et application d'un boost de vitesse standard de **+5%**.
  - **Zones Intermédiaires :** Déviation angulaire moyenne et boost progressif de **+6% à +7%**.
  - **Zones Extrêmes (Bords de Raquette) :** Angle d'éjection maximal (prise de risque) récompensé par un boost critique de **+8%**.

#### 2. Résolution Logique Immuable (1600x1000)

- **Arène Virtuelle Fixe :** Le cœur du jeu effectue désormais tous ses calculs dans un espace logique unique de `1600x1000 pixels`. Le gameplay (vitesse, trajectoires, dimensions) est rigoureusement identique et équitable, peu importe la taille de l'écran ou de la fenêtre du navigateur.
- **Responsive Typographique :** Les polices de caractères et espacements des menus utilisent des ratios dynamiques basés sur `canvas.height` (ex: `7.5%` pour les titres), garantissant une lisibilité et des proportions parfaites en plein écran HD ou 4K.
- **Sécurité Mobile "Landscape Only" :** Intégration d'un overlay CSS intelligent qui bloque le jeu en mode portrait, forçant le joueur à incliner son appareil à l'horizontale pour préserver l'intégrité de l'arène.

#### 3. Refactoring & Optimisation du Code

- **Purge Massives des Spaghettis :** Suppression de plus de 45% de code redondant (méthodes obsolètes, conditions `isVertical`, axes doubles) dans `gameState.js`, `ball.js` et `paddle.js`. Le jeu n'exécute plus que la physique horizontale universelle.
- **UX Centralisée :** Harmonisation des menus (Écran Titre, Options, Écran de Fin) fonctionnant tous avec un système interactif de flèches du clavier (`selectedIndex`), d'écouteurs isolés et de retours sonores rétro dédiés.

---

### ⚡ NOUVEAUTÉ : Version 2.5 — L'Architecture AAA Centrale & Customisation (Active)

Cette mise à jour marque l'indépendance totale du moteur graphique et audio par rapport aux configurations rigides. L'expérience utilisateur (UX) et la flexibilité du code ont été poussées aux standards des studios professionnels (Clean Code & DRY).

#### 🛠️ Le Journal des Modifications (Changelog V2.5)

### 📂 Focus sur la Nouvelle Structure des Options

L'architecture à double volet a nécessité la création d'un dossier dédié aux composants de réglages, garantissant un fichier `optionsState.js` ultra-léger (Responsabilité Unique) :

```text
cyber-pong-tron/
└── JavaScript/
    ├── Engine/
    │   └── sound.js             # 🎛️ Moteur Audio centralisé avec Master Volume dynamique
    └── States/
        ├── optionsState.js      # 🎭 Le Chef d'orchestre (Gère la navigation de la colonne de gauche)
        └── OptionsViews/        # 📦 DOSSIER COMPOSANTS : Gestion exclusive du volet de droite
            ├── colorView.js     # 🎨 Palette cosmétique autonome (CYBER_PALETTE) & défilement Q/D
            ├── difficultyView.js# 📈 Sélecteur adaptatif des 4 modes (Facile -> Hardcore)
            ├── sideView.js      # ↔️ Checkbox de positionnement joueur (Inversion de gameplay Gauche/Droite)
            └── volumeView.js    # 🔊 Rendu des jauges de son textuelles [■■■■□□□□□□] à paliers de 5%
```

##### 1. Refactoring Cosmétique & Palette Isolée (Clean Architecture)

- **Base de Données Cosmétique :** Extraction complète des données de style de la classe d'affichage. Les thèmes graphiques sont désormais centralisés dans une constante globale statique (`CYBER_PALETTE`) facile à enrichir.
- **Ajout de Teintes Cyber-Rétro :** Intégration immédiate des nouvelles couleurs de combat : **ROUGE ALERTE** (`#ff0000`) et **ORANGE VAPOR** (`#ff5500`).
- **Rendu Dynamique de l'Arène :** Suppression totale des bordures rigides dans le fichier `style.css`. C'est désormais la classe `Board` (Le terrain) qui dessine son propre encadrement néon 2D et sa grille avec un effet de halo lumineux (_Bloom/Shadow_) synchronisé sur la couleur sélectionnée par le joueur.

##### 2. Centralisation Audio Intégrale (Anti-Spaghetti Volume)

- **Master Volume Système :** Éradication complète des modificateurs de volume (`.volume`) éparpillés dans le code. Le moteur audio (`sound.js`) intègre désormais un multiplicateur global (`masterVolume`) qui pilote à la racine l'intensité de l'API Web Audio et des fichiers MP3.
- **Ajustement en Temps Réel :** Les bips de touches, les alarmes dynamiques de danger ("battement de cœur") et les pistes de fond s'adaptent instantanément à la volée dès que le joueur modifie sa jauge dans les options.

##### 3. Ergonomie & Menu à Double Volet AAA

- **Inversion Dynamique du Gameplay :** Le sélecteur de côté de jeu est 100% opérationnel. Le fichier `gameState.js` adapte à la volée les écouteurs du clavier (`Input`), les alarmes de danger et le script d'intelligence artificielle (`updateAI`) selon que le joueur choisit le côté GAUCHE ou DROITE.
- **Navigation Fluide (UX Retravaillée) :** Intégration de la touche `TAB` (Tabulation) comme commande de retour/annulation universelle universellement accessible sous la main gauche, évitant les conflits d'écrans avec la touche `ÉCHAP` sur la plateforme Itch.io.
- **Persistance des Choix :** Sauvegarde immédiate et en temps réel de tous les réglages cosmétiques et physiques à l'intérieur du `StateManager` global du jeu pour une persistance parfaite entre les écrans.

---

## 🚀 Prochaines Étapes : En route vers la Version 3.0

La Phase 1 étant close avec brio, le développement se tourne vers le gameplay pur, le chaos visuel et l'introduction de mécaniques physiques inédites.

### 🎱 Phase 3 : L'Ère Multi-Balles & Collision Cinétique

- **Introduction de la "Balle de la Mort" :**
  - Apparition d'une seconde sphère d'énergie noire/rouge sur le terrain après un certain nombre d'échanges.
  - Cette comète instable aura pour rôle de perturber le flux et de limiter indirectement la vitesse folle de la première balle.
- **Physique de Collision "Effet Billard" :**
  - Développement d'un moteur de collision cercle-contre-cercle (Calcul de la distance des centres et des vecteurs de masses).
  - Lorsque la comète principale et la Balle de la Mort se percuteront, elles s'éjecteront mutuellement selon l'angle d'impact, créant des trajectoires totalement imprévisibles pour le joueur et l'IA !
  - _...Vous en découvrirez plus dans la V3 ;)_

### ✨ Effets Visuels & Polish Cyberpunk (AAA)

- **Système de Particules Néon :** Génération de projections d'étincelles lumineuses aux couleurs de l'entité lors de chaque impact critique (Raquettes, Murs).
- **Distorsion d'Écran (_Screen Shake_) :** Secousse dynamique du canvas lors d'un but encaissé ou d'un choc à haute vitesse pour renforcer l'impact.

### 🤝 Phase 4 : Révolution Multijoueur (Local & P2P)

- **Mode Face-à-Face Local :** Activation du second profil de touches pour jouer à deux sur le même clavier (Joueur 1 en Z-W/S, Joueur 2 avec les flèches directionnelles).
- **Mode Réseau WebRTC :** Liaison Peer-to-Peer instantanée par simple scan de QR Code pour des duels à distance sans latence.
