import { playBeep } from '../Engine/sound.js';
import { MenuControls } from '../Engine/input.js';
import { DifficultyView } from './OptionsViews/difficultyView.js';
import { VolumeView } from './OptionsViews/volumeView.js';
import { SideView } from './OptionsViews/sideView.js';
import { ColorView } from './OptionsViews/colorView.js';


export class OptionsState {
    constructor(stateManager, input) {
        this.stateManager = stateManager;
        this.input = input;

        // Menu de gauche basé sur tes plans Paint
        this.categories = ['DIFFICULTE', 'VOLUME', 'COTE JEU', 'COULEURS'];
        this.selectedCategory = 0;
        this.isSubMenuFocused = false;

        // Initialisation de la sous-vue
        this.difficultyView = new DifficultyView(this.stateManager);
        this.volumeView = new VolumeView(this.stateManager);
        this.sideView = new SideView(this.stateManager);
        this.colorView = new ColorView(this.stateManager);

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    enter() { window.addEventListener('keydown', this.handleKeyDown); }
    exit() { window.removeEventListener('keydown', this.handleKeyDown); }

    handleKeyDown(event) {
        // Relais des commandes si on est dans le volet de droite
        if (this.isSubMenuFocused) {
            if (this.selectedCategory === 0) {
                this.difficultyView.handleKeyDown(event, () => this.isSubMenuFocused = false);
            } else if (this.selectedCategory === 1) {
                this.volumeView.handleKeyDown(event, () => this.isSubMenuFocused = false);
            } else if (this.selectedCategory === 2) {
                this.sideView.handleKeyDown(event, () => this.isSubMenuFocused = false);
            } else if (this.selectedCategory === 3) {
                this.colorView.handleKeyDown(event, () => this.isSubMenuFocused = false);
            }
            return;
        }

        // Navigation dans le menu principal de gauche
        if (MenuControls.isUp(event)) {
            if (this.selectedCategory > 0) { 
                this.selectedCategory--; 
                playBeep(400, 0.05); 
            }
        }
        else if (MenuControls.isDown(event)) {
            if (this.selectedCategory < this.categories.length - 1) { 
                this.selectedCategory++; 
                playBeep(400, 0.05); 
            }
        }
        else if (MenuControls.isAction(event)) {
            playBeep(600, 0.08);
            if (this.selectedCategory >= 0 && this.selectedCategory <= 3) {
                this.isSubMenuFocused = true;
            }
        }
        else if (MenuControls.isCancel(event)) {
            playBeep(400, 0.05);
            this.stateManager.changeState('menu'); // Quitte l'écran
        }
    }

    draw(ctx, canvas) {
        // 1. Fond noir de ton moteur
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Vos calculs de tailles AAA adaptatifs
        const titleSize = Math.floor(canvas.height * 0.065);
        const optionSize = Math.floor(canvas.height * 0.04);
        const helpSize = Math.floor(canvas.height * 0.026);
        const spacing = Math.floor(canvas.height * 0.09);

        // 2. Grand Titre Tron
        ctx.fillStyle = '#00f3ff';
        ctx.font = `bold ${titleSize}px 'Courier New', Courier, monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('CONFIGURATION SYSTÈME', canvas.width / 2, canvas.height * 0.1);

        // Repères de mise en page en 2 colonnes (Format Paint !)
        const colLeftX = canvas.width * 0.05;
        const colRightX = canvas.width * 0.45;
        const startY = canvas.height * 0.3;

        // 3. Rendu de la Colonne de Gauche (Les Catégories)
        ctx.textBaseline = 'middle';
        this.categories.forEach((cat, index) => {
            const y = startY + (index * spacing);
            ctx.textAlign = 'left';

            if (index === this.selectedCategory) {
                if (this.isSubMenuFocused) {
                    ctx.fillStyle = '#005566'; // Mode gelé (On est dans le menu de droite)
                    ctx.font = `${optionSize}px 'Courier New', Courier, monospace`;
                    ctx.fillText(`■ ${cat}`, colLeftX, y);
                } else {
                    ctx.fillStyle = '#ffffff'; // Sélectionné et actif à gauche
                    ctx.font = `bold ${optionSize}px 'Courier New', Courier, monospace`;
                    const offset = Math.sin(Date.now() * 0.007) * 5; // Ton effet ping-pong visuel
                    ctx.fillText(`> ${cat}`, colLeftX + offset, y);
                }
            } else {
                ctx.fillStyle = '#336677'; // Inactif
                ctx.font = `${optionSize}px 'Courier New', Courier, monospace`;
                ctx.fillText(`  ${cat}`, colLeftX, y);
            }
        });

        // Ligne verticale néon de séparation (Maquette Paint)
        ctx.strokeStyle = '#224455';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width * 0.40, canvas.height * 0.22);
        ctx.lineTo(canvas.width * 0.40, canvas.height * 0.85);
        ctx.stroke();

        // 4. Rendu de la Colonne de Droite (Contenu Dynamique)
        if (this.selectedCategory === 0) {
            this.difficultyView.draw(ctx, canvas, colRightX, startY);
        } else if (this.selectedCategory === 1) {
            this.volumeView.draw(ctx, canvas, colRightX, startY);
        } else if (this.selectedCategory === 2) {
            this.sideView.draw(ctx, canvas, colRightX, startY);
        } else if (this.selectedCategory === 3) {
            this.colorView.draw(ctx, canvas, colRightX, startY);
        } else {
            // Emplacement vide pour les prochains modules
            ctx.fillStyle = '#224455';
            ctx.font = `${optionSize * 0.7}px 'Courier New', Courier, monospace`;
            ctx.fillText('SOUS-SYSTÈME EN ATTENTE...', colRightX, startY);
        }

        // 5. HUD Dynamique en bas
        ctx.fillStyle = '#336677';
        ctx.font = `${helpSize}px 'Courier New', Courier, monospace`;
        ctx.textAlign = 'center';
        if (this.isSubMenuFocused) {
            ctx.fillText('[ Navigation ]  Haut : Z-W / ⬆  |  Bas : S / ⬇  |  Validation : Espace / Entré  |  Retour : TAB', canvas.width / 2, canvas.height - (canvas.height * 0.06));
        } else {
            ctx.fillText('[ Navigation ]  Haut : Z-W / ⬆  |  Bas : S / ⬇  |  Validation : Espace / Entré  |  Quitter : TAB', canvas.width / 2, canvas.height - (canvas.height * 0.06));
        }
    }
}
