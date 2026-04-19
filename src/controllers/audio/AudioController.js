/**
 * @author pschroen / https://ufo.ai/
 */

import { Stage } from '@alienkitty/space.js';

import { Events } from '../../config/Events.js';
import { AudioAnalyser } from './AudioAnalyser.js';

export class AudioController {
    static init() {
        this.muted = false;
        this.started = false;

        this.initAudioElement();

        this.analyser = new AudioAnalyser(this.audioElement);

        this.addListeners();
    }

    static initAudioElement() {
        this.audioElement = new Audio();
        this.audioElement.src = 'assets/sounds/heavy-rain.mp3';
        this.audioElement.loop = true;
        this.audioElement.crossOrigin = 'anonymous';
        this.audioElement.preload = 'auto';
    }

    static addListeners() {
        Stage.events.on(Events.VISIBILITY, this.onVisibility);
        Stage.events.on(Events.SOUND_TOGGLED, this.onSoundToggled);
    }

    static removeListeners() {
        Stage.events.off(Events.VISIBILITY, this.onVisibility);
        Stage.events.off(Events.SOUND_TOGGLED, this.onSoundToggled);
    }

    // Event handlers

    static onVisibility = () => {
        if (document.hidden) {
            this.audioElement.pause();
        } else if (!this.muted && this.started) {
            this.audioElement.play().catch(() => {});
        }
    };

    static onSoundToggled = ({ muted }) => {
        this.muted = muted;

        this.analyser.resume();

        if (!this.started) {
            return;
        }

        if (this.muted) {
            this.audioElement.pause();
        } else {
            this.audioElement.play().catch(() => {});
        }
    };

    // Public methods

    static onFirstGesture = () => {
        if (this.started) {
            return;
        }

        this.started = true;
        this.analyser.connect();

        if (!this.muted) {
            this.audioElement.play().catch(() => {});
        }
    };

    static destroy = () => {
        this.removeListeners();

        if (this.analyser) {
            this.analyser.destroy();
        }

        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.src = '';
        }
    };
}
