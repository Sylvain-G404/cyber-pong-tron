import { playBeep } from '../../Engine/sound.js';
import { MenuControls } from '../../Engine/input.js';

// ========================================================
// 🎨 BASE DE DONNÉES DES COULEURS DU JEU (FACILE À ENRICHIR)
// C'est ICI et UNIQUEMENT ICI que tu ajoutes tes nouvelles couleurs !
// ========================================================
const CYBER_PALETTE = [
    // --- COULEURS D'ACTION (Raquettes, Balle, Éléments de jeu) ---
    { name: 'CYAN TRON',        hex: '#00f3ff' }, // Ta couleur d'origine (Parfait pour le Joueur 1)
    { name: 'MAGENTA PUNK',     hex: '#ff00ff' }, // Ta couleur d'origine (Parfait pour le Joueur 2)
    { name: 'VERT MATRICE',     hex: '#00ff66' }, // Ta couleur d'origine (Power-ups ou mode Turbo)
    { name: 'JAUNE CYBER',      hex: '#ffff00' }, // Ta couleur d'origine (La balle principale)
    { name: 'BLANC PURE',       hex: '#ffffff' }, // Ta couleur d'origine (Impacts et flashs)
    { name: 'ROUGE ALERTE',     hex: '#ff0000' }, // Ta couleur d'origine (Zone de danger / Point perdu)
    { name: 'ORANGE VAPOR',     hex: '#ff5500' }, // Ta couleur d'origine (Bonus de vitesse)

    // --- ENHANCEMENTS & EFFETS (Traînées et reflets néon) ---
    { name: 'BLEU LASER',       hex: '#0044ff' }, // Version sombre du Cyan pour les ombres portées
    { name: 'ROSE NEON',        hex: '#ff007f' }, // Alternative ou traînée pour le Magenta
    { name: 'AMBRE RETRO',      hex: '#ffaa00' }, // Ambiance borne d'arcade rétro

    // --- FONDS ET INTERFACE (Arène, Grille, Tableau des scores) ---
    { name: 'NOIR ABYSSAL',     hex: '#0a0a12' }, // Le fond d'écran parfait (légèrement bleuté, pas 100% noir)
    { name: 'GRILLE CYBER',     hex: '#1a1a2e' }, // Pour tracer les lignes du terrain et le filet central
    { name: 'TEXTE VAPOR',      hex: '#4d4dff' }  // Bleu électrique adouci pour l'affichage des scores en arrière-plan
];

export class ColorView {
    constructor(stateManager) {
        this.stateManager = stateManager;

        // On lie notre liste de couleurs statique à notre vue
        this.palette = CYBER_PALETTE;

        // Configuration des éléments écrits sur l'écran
        this.elements = [
            { id: 'player',   label: 'RAQUETTE JOUEUR' },
            { id: 'opponent', label: 'RAQUETTE ADVERSAIRE' },
            { id: 'walls',    label: 'COULEUR DES MURS' },
            { id: 'ball',     label: 'COULEUR DE LA BALLE' }
        ];

        this.localIndex = 0;

        // Sécurité AAA : Si le jeu n'a pas encore de couleurs enregistrées, on met celles de base
        if (!this.stateManager.colors) {
            this.stateManager.colors = {
                player: '#00ff66',
                opponent: '#ff00ff',
                walls: '#00f3ff',
                ball: '#ff5500'
            };
        }
    }

    handleKeyDown(event, onBackToMenu) {
        // 1. Déplacement vertical entre les éléments (Joueur, IA, Murs, Balle)
        if (MenuControls.isUp(event)) {
            if (this.localIndex > 0) {
                this.localIndex--;
                playBeep(400, 0.05);
            }
        }
        else if (MenuControls.isDown(event)) {
            if (this.localIndex < this.elements.length - 1) {
                this.localIndex++;
                playBeep(400, 0.05);
            }
        }
        // 2. Déplacement horizontal pour changer la couleur de l'élément en temps réel
        else if (event.code === 'KeyA') { // Touche Q (AZERTY) / Touche A (QZERTY)
            this.changeColorIndex(-1);
        }
        else if (event.code === 'KeyD') { // Touche D
            this.changeColorIndex(1);
        }
        // 3. Simple feedback sonore si le joueur appuie sur Entrée ou Espace (il reste dans le menu !)
        else if (MenuControls.isAction(event)) {
            playBeep(600, 0.08); // Petit bip de confirmation, mais on ne quitte pas !
        }
        // 4. SEUL LE BOUTON ANNULER (TAB) valide et te renvoie à la colonne de gauche !
        else if (MenuControls.isCancel(event)) {
            playBeep(400, 0.05);
            onBackToMenu(); // Retour à la colonne de gauche
        }
    }

    // Fonction utilitaire pour faire défiler la palette de couleurs en boucle
    changeColorIndex(direction) {
        const elementId = this.elements[this.localIndex].id;
        const currentHex = this.stateManager.colors[elementId];
        
        // Trouve l'index actuel dans la palette
        let paletteIndex = this.palette.findIndex(c => c.hex === currentHex);
        if (paletteIndex === -1) paletteIndex = 0;

        // Calcul du nouvel index avec bouclage automatique (0 -> max -> 0)
        paletteIndex = (paletteIndex + direction + this.palette.length) % this.palette.length;

        // Sauvegarde immédiate dans la mémoire globale
        this.stateManager.colors[elementId] = this.palette[paletteIndex].hex;
        playBeep(480, 0.05); // Bip cosmétique moyen
    }

    draw(ctx, canvas, startX, startY) {
        const optionSize = Math.floor(canvas.height * 0.038);
        const spacing = Math.floor(canvas.height * 0.085);

        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        // AJUSTEMENT AAA : On décale le point de départ de 60px vers la gauche pour aérer la colonne
        const adjustedStartX = startX - 60; 

        // --- TITRE DU VOLET ---
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${optionSize}px 'Courier New', Courier, monospace`;
        ctx.fillText("PERSONNALISATION VISUELLE", adjustedStartX, startY);

        this.elements.forEach((elem, index) => {
            const y = startY + 70 + (index * spacing);
            const currentHex = this.stateManager.colors[elem.id];
            const colorObj = this.palette.find(c => c.hex === currentHex) || this.palette[0];

            // Rendu du libellé de l'élément (décalé à gauche)
            if (index === this.localIndex) {
                const pulse = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
                ctx.fillStyle = `rgba(255, 255, 255, ${pulse})`;
                ctx.font = `bold ${optionSize}px 'Courier New', Courier, monospace`;
                ctx.fillText(`> ${elem.label}`, adjustedStartX, y);
            } else {
                ctx.fillStyle = '#558899';
                ctx.font = `${optionSize}px 'Courier New', Courier, monospace`;
                ctx.fillText(`  ${elem.label}`, adjustedStartX, y);
            }

            // Calcul de valueX : on laisse plus d'espace pour éviter les collisions (décalage à 0.36)
            const valueX = adjustedStartX + (canvas.width * 0.34);
            
            // Dessin du petit carré de couleur néon témoin
            ctx.fillStyle = currentHex;
            ctx.fillRect(valueX - 30, y - 8, 16, 16);

            // Texte du nom de la couleur
            if (index === this.localIndex) {
                ctx.fillStyle = currentHex;
                ctx.font = `bold ${optionSize * 0.9}px 'Courier New', Courier, monospace`;
                ctx.fillText(`<- ${colorObj.name} ->`, valueX, y);
            } else {
                ctx.fillStyle = '#446677';
                ctx.font = `${optionSize * 0.9}px 'Courier New', Courier, monospace`;
                ctx.fillText(`   ${colorObj.name}`, valueX, y);
            }
        });

        // ========================================================
        // AJUSTEMENT HUD : ALIGNEMENT ET POSITIONNEMENT PARFAIT
        // ========================================================
        ctx.textAlign = 'left'; // On reste aligné à gauche pour contrôler le départ
        ctx.fillStyle = '#224455';
        ctx.font = `${optionSize * 0.55}px 'Courier New', Courier, monospace`;
        
        // Décalage chirurgical de +30px pour le centrer parfaitement sous le bloc de droite
        ctx.fillText('Z/S : Choisir élément  |  Q/D : Faire défiler les couleurs', startX + 30, canvas.height * 0.78);
    }

}
