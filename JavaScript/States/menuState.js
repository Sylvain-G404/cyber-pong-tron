import { startMenuMusic } from '../Engine/sound.js';
import { playBeep } from '../Engine/sound.js';
import { MenuControls } from '../Engine/input.js';

export class MenuState {
    constructor(stateManager, input) {
        this.stateManager = stateManager;
        this.input = input;

        // Configuration du menu interactif
        this.options = ['Jouer', 'Options', 'Crédits', 'Portfolio'];
        this.selectedIndex = 0; // 0 = Jouer, 1 = Options, 2 = Crédits, 3 = Portfolio
        
        // Liaison du contexte pour les événements clavier
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    enter() {
        startMenuMusic();
        // On écoute les touches du clavier dès qu'on entre dans le menu
        window.addEventListener('keydown', this.handleKeyDown);
    }

    exit() {
        // TRÈS IMPORTANT : On retire l'écouteur pour éviter les fuites de mémoire et les conflits d'inputs
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown(event) {
        if (MenuControls.isUp(event)) {
            if (this.selectedIndex > 0) { this.selectedIndex--; playBeep(400, 0.05); }
        } 
        else if (MenuControls.isDown(event)) {
            if (this.selectedIndex < this.options.length - 1) { this.selectedIndex++; playBeep(400, 0.05); }
        } 
        else if (MenuControls.isAction(event)) {
            playBeep(600, 0.08);
            this.selectOption();
        }
    }

    selectOption() {
        // Redirection AAA basée sur l'index sélectionné
        if (this.selectedIndex === 0) {
            this.stateManager.changeState('game');
        } else if (this.selectedIndex === 1) {
            this.stateManager.changeState('options');
        } else if (this.selectedIndex === 2) {
            this.stateManager.changeState('credits');
        } else if (this.selectedIndex === 3) {
            window.open('https://sylvain-g404.github.io/Mon-Portfolio-Temps/', '_blank', 'noopener,noreferrer');
        }
    }

    update(deltaTime) {
        // Le menu principal est statique pour le moment (pas d'animations complexes nécessaires ici)
    }

    draw(ctx, canvas) {
        // 1. Fond noir profond
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // --- CALCULS DE TAILLES TYPOGRAPHIQUES AUTOMATIQUES AAA ---
        const titleSize = Math.floor(canvas.height * 0.075); // 7.5% de la hauteur (Ex: 75px en résolution 1000)
        const optionSize = Math.floor(canvas.height * 0.04); // 4% de la hauteur (Ex: 40px en résolution 1000)
        const spacing = Math.floor(canvas.height * 0.08);    // 8% d'espacement (Ex: 80px)

        // 2. Titre du jeu principal
        ctx.fillStyle = '#00f3ff';
        ctx.font = `bold ${titleSize}px 'Courier New', Courier, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CYBER PONG TRON', canvas.width / 2, canvas.height / 2 - (spacing * 2.3));

        // 3. Rendu dynamique des options du menu
        const startY = canvas.height / 2 - (spacing * 0.5);

        this.options.forEach((option, index) => {
            const isPortfolio = (option === 'Portfolio');
            const yPos = startY + (index * spacing);

            if (index === this.selectedIndex) {
                ctx.font = `bold ${optionSize}px 'Courier New', Courier, monospace`;

                if (isPortfolio) {
                    // 1. Chevrons orange centrés uniquement autour du mot "Portfolio"
                    ctx.fillStyle = '#ff8800';
                    ctx.fillText(`> ${option} <`, canvas.width / 2, yPos);

                    // 2. Mot "Portfolio" centré en blanc
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(option, canvas.width / 2, yPos);

                    // 3. Flèche externe dessinée à droite sans décaler le centrage
                    const fullWidth = ctx.measureText(`> ${option} <`).width;
                    ctx.fillStyle = '#ff8800';
                    ctx.fillText('↗', canvas.width / 2 + fullWidth / 2 + (optionSize * 0.9), yPos);
                } else {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText(`> ${option} <`, canvas.width / 2, yPos);
                }
            } else {
                // Style Options Inactives : le mot reste parfaitement centré
                ctx.fillStyle = isPortfolio ? '#7799aa' : '#558899';
                ctx.font = `${optionSize}px 'Courier New', Courier, monospace`;
                ctx.fillText(option, canvas.width / 2, yPos);

                if (isPortfolio) {
                    const wordWidth = ctx.measureText(option).width;
                    ctx.fillText('↗', canvas.width / 2 + wordWidth / 2 + 25, yPos);
                }
            }
        });


        // ==========================================
        // HUD DISCRET : GUIDE DES COMMANDES (TUTO) ACCORDE AU DESIGN AAA
        // ==========================================
        ctx.save();

        // Calcul de la taille de police proportionnelle (3% de la hauteur)
        const helpSize = Math.floor(ctx.canvas.height * 0.03); 
        ctx.font = helpSize + "px 'Courier New', Courier, monospace";
        ctx.textAlign = "center";

        // Couleur cyan néon avec opacité réduite (0.4) pour rester très discret
        ctx.fillStyle = "rgba(0, 243, 255, 0.4)";

        // Positionnement dynamique centré et calé tout en bas (à 90% de la hauteur)
        const hudX = ctx.canvas.width / 2; 
        const hudY = ctx.canvas.height * 0.90; 

        // Dessin du texte de contrôle
        ctx.fillText(
            "[ Navigation ]  Haut : Z-W / ⬆  |  Bas : S / ⬇  |  Validation : Entrée / Espace",
            hudX,
            hudY
        );

        ctx.restore();
    }
}
