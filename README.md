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

### ⚙️ Phase 1 : Système de Paramètres Avancés

- **Sélecteur de Difficulté :**
  - **Facile :** Accélération à +3% par coup de raquette, vitesse de l'IA à 60% du joueur.
  - **Moyen :** Accélération standard à +5%, vitesse de l'IA à 75%.
  - **Difficile :** Accélération hardcore à +10%, vitesse de l'IA à 95% (Style demi-dieu).
- **Customisation Esthétique :** Menu permettant de choisir la couleur néon de sa raquette et de sa traînée d'énergie (Cyan, Rose, Vert acide, Jaune fluo).
- **Gestion des Côtés :** Choix de son emplacement de départ sur la table de jeu (Gauche/Droite sur PC, Haut/Bas sur Mobile).

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
