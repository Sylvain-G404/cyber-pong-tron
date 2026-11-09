let audioContext = null;
let menuMusic = null;
let gameMusic = null; // 🎵 Ajout pour la musique de jeu
let endSound = null;  // 🔊 Ajout pour le son de victoire/défaite

// Variable pour gérer l'intervalle du battement de cœur
let heartInterval = null;

// Variable magique qui va stocker le volume (par défaut à 80% soit 0.8)
let masterVolume = 0.8;

// Volumes de référence (Tes valeurs d'origine !)
const BEEP_VOLUME = 0.1;   
const ALARM_VOLUME = 0.015;  
const MENU_MUSIC_BASE_VOL = 0.05;
const GAME_MUSIC_BASE_VOL = 0.05;
const END_SOUND_BASE_VOL = 0.1;

// ==========================================
// 🎛️ CENTRALISATION DU VOLUME GÉNÉRAL (AAA)
// ==========================================
export function setMasterVolume(percent) {
    masterVolume = percent / 100; // Convertit (0 à 100) en (0.0 à 1.0)

    // Si les musiques sont chargées, on ajuste leur volume EN DIRECT !
    if (menuMusic) menuMusic.volume = MENU_MUSIC_BASE_VOL * masterVolume;
    if (gameMusic) gameMusic.volume = GAME_MUSIC_BASE_VOL * masterVolume;
    if (endSound)  endSound.volume = END_SOUND_BASE_VOL * masterVolume;
}

// Les bips d'impacts (Raquettes, Murs, Buts, Compte à rebours)
export function playAdvancedBeep(frequency, duration, type = 'square', customVolume = BEEP_VOLUME) {
    if (!audioContext) audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

    gainNode.gain.setValueAtTime(customVolume * masterVolume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

export function playBeep(frequency, duration) {
    playAdvancedBeep(frequency, duration, 'square', BEEP_VOLUME);
}

// L'alarme "BATTEMENT DE CŒUR" DYNAMIQUE
export function startDangerAlarm(type) {
    if (heartInterval) return;

    let intervalTime = 600; 
    let frequency = 80;

    if (type === 'joueur') {
        intervalTime = 250;
        frequency = 110; 
    }

    heartInterval = setInterval(() => {
        playAdvancedBeep(frequency, 0.15, 'sawtooth', ALARM_VOLUME);
    }, intervalTime);
}

export function stopDangerAlarm() {
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
}

// ==========================================
// 🎶 GESTION DES MUSIQUES ET ÉVÉNEMENTS (MP3)
// ==========================================

// Musique du Menu Principal
export function startMenuMusic() {
    if (!menuMusic) {
        menuMusic = new Audio('Assets/Son/menu_theme.mp3');
        menuMusic.loop = true;
    }

    // Application du volume dynamique calculé
    menuMusic.volume = MENU_MUSIC_BASE_VOL * masterVolume;

    if (menuMusic.paused) {
        menuMusic.play().catch(err => console.log("Audio bloqué : attend une interaction.", err));
    }
}

export function stopMenuMusic() {
    if (menuMusic) {
        menuMusic.pause();
        menuMusic.currentTime = 0;
    }
}

// Musique de la partie (game_theme.mp3)
export function startGameMusic() {
    if (!gameMusic) {
        gameMusic = new Audio('Assets/Son/game_theme.mp3');
        gameMusic.loop = true;
    }

    // Application du volume dynamique calculé
    gameMusic.volume = GAME_MUSIC_BASE_VOL * masterVolume;

    if (gameMusic.paused) {
        gameMusic.play().catch(err => console.log("Audio de jeu bloqué.", err));
    }
}

export function stopGameMusic() {
    if (gameMusic) {
        gameMusic.pause();
        gameMusic.currentTime = 0;
    }
}

// Sons de fin de partie (Victoire / Défaite selon la difficulté)
// 'victory' ou 'defeat' | 'eazy', 'hard', 'hardcore'
export function playEndSound(status, difficulty) {
    // On arrête d'abord un éventuel son de fin déjà en cours
    stopEndSound(); 
    
    const filePath = `Assets/Son/${status}_${difficulty}.mp3`;
    endSound = new Audio(filePath);

    // Application du volume dynamique calculé
    endSound.volume = END_SOUND_BASE_VOL * masterVolume;

    endSound.play().catch(err => console.log("Erreur lecture son de fin.", err));
}

export function stopEndSound() {
    if (endSound) {
        endSound.pause();
        endSound.currentTime = 0;
        endSound = null;
    }
}

// Arrêt total révisé pour tout nettoyer d'un coup
export function stopAmbientMusic() {
    stopDangerAlarm();
    stopMenuMusic();
    stopGameMusic();
    stopEndSound();
}

// INITIALISATION AUTOMATIQUE AAA
export function initAudio(stateManager) {
    if (stateManager.globalVolume === undefined) {
        stateManager.globalVolume = 80; // Valeur par défaut en mémoire
    }
    // On appelle notre fonction interne directement ici !
    setMasterVolume(stateManager.globalVolume);
    console.log(`[Audio Centralisé System] Initialisé à ${stateManager.globalVolume}%`);
}