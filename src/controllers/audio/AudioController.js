/**
 * @author pschroen / https://ufo.ai/
 */

import { Stage, ticker } from '@alienkitty/space.js';

import { Events } from '../../config/Events.js';
import { Global } from '../../config/Global.js';
import { AudioAnalyser } from './AudioAnalyser.js';

export class AudioController {
    static BG_VOLUME_RATIO = 0.30;

    static init() {
        this.muted = false;
        this.started = false;
        this.bgAvailable = null;

        this.initAudioElement();
        this.initBgElement();

        this.analyser = new AudioAnalyser(this.audioElement);

        this.addListeners();
    }

    static initAudioElement() {
        this.audioElement = new Audio();
        this.audioElement.src = 'assets/sounds/heavy-rain.mp3';
        this.audioElement.loop = true;
        this.audioElement.crossOrigin = 'anonymous';
        this.audioElement.preload = 'auto';
        this.audioElement.volume = 1;
        this.audioElement.setAttribute('playsinline', '');
        this.audioElement.setAttribute('webkit-playsinline', '');

        this.audioElement.addEventListener('canplaythrough', this.onCanPlayThrough, { once: true });
    }

    static initBgElement() {
        this.bgElement = new Audio();
        this.bgElement.src = 'assets/sounds/bg.mp3';
        this.bgElement.loop = true;
        this.bgElement.crossOrigin = 'anonymous';
        this.bgElement.preload = 'auto';
        this.bgElement.volume = 1;
        this.bgElement.setAttribute('playsinline', '');
        this.bgElement.setAttribute('webkit-playsinline', '');

        this.bgElement.addEventListener('error', () => {
            console.warn('bg.mp3 failed to load — continuing without background layer');
            this.bgAvailable = false;
        });

        this.bgElement.addEventListener('canplaythrough', () => {
            this.bgAvailable = true;
        }, { once: true });
    }

    static addListeners() {
        Stage.events.on(Events.VISIBILITY, this.onVisibility);
        Stage.events.on(Events.SOUND_TOGGLED, this.onSoundToggled);
        Stage.events.on(Events.LOAD_BEGIN, this.onFirstGesture);
        ticker.add(this.onUpdate);
    }

    static removeListeners() {
        Stage.events.off(Events.VISIBILITY, this.onVisibility);
        Stage.events.off(Events.SOUND_TOGGLED, this.onSoundToggled);
        Stage.events.off(Events.LOAD_BEGIN, this.onFirstGesture);
        ticker.remove(this.onUpdate);
    }

    // Event handlers

    static onCanPlayThrough = () => {
        Stage.events.emit(Events.LOAD_PROGRESS, { progress: 0.5 });
    };

    static onVisibility = () => {
        if (document.hidden) {
            this.audioElement.pause();

            if (this.bgAvailable !== false) {
                this.bgElement.pause();
            }
        } else if (!this.muted && this.started) {
            this.audioElement.play().catch(() => {});

            if (this.bgAvailable !== false) {
                this.bgElement.play().catch(() => {});
            }
        }
    };

    static onSoundToggled = ({ muted }) => {
        this.muted = muted;

        if (!this.started) {
            return;
        }

        this.analyser.resume();

        if (this.muted) {
            this.audioElement.pause();

            if (this.bgAvailable !== false) {
                this.bgElement.pause();
            }
        } else {
            this.audioElement.play().catch(() => {});

            if (this.bgAvailable !== false) {
                this.bgElement.play().catch(() => {});
            }
        }
    };

    static onFirstGesture = async () => {
        if (this.started) {
            return;
        }

        this.started = true;

        this.analyser.connect();

        if (this.bgAvailable !== false) {
            try {
                const ctx = this.analyser.getContext();

                this.bgSource = ctx.createMediaElementSource(this.bgElement);
                this.bgGain = ctx.createGain();
                this.bgGain.gain.value = 0;

                this.bgSource.connect(this.bgGain);
                this.bgGain.connect(ctx.destination);
            } catch (err) {
                console.warn('bg graph setup failed:', err.message);
                this.bgAvailable = false;
            }
        }

        const ctx = this.analyser.getContext();

        if (ctx && ctx.state === 'suspended') {
            await ctx.resume();
        }

        if (!this.muted) {
            await this.kickstartIOS(this.audioElement);

            if (this.bgAvailable !== false) {
                await this.kickstartIOS(this.bgElement);
            }
        }
    };

    static kickstartIOS = async element => {
        try {
            await element.play();
            element.pause();
            element.currentTime = 0;
            await element.play();
        } catch (err) {
            console.warn('kickstart fallback:', err.message);
        }
    };

    static onUpdate = () => {
        if (!this.analyser) {
            return;
        }

        const rainTarget = this.muted ? 0 : Math.max(Global.audioVolume, 0);

        this.analyser.setVolume(rainTarget);

        if (this.bgGain) {
            const bgTarget = rainTarget * this.BG_VOLUME_RATIO;
            const ctx = this.analyser.getContext();

            this.bgGain.gain.setTargetAtTime(bgTarget, ctx.currentTime, 0.05);
        }
    };

    // Public methods

    static destroy = () => {
        this.removeListeners();

        if (this.analyser) {
            this.analyser.destroy();
        }

        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.src = '';
        }

        if (this.bgSource) {
            this.bgSource.disconnect();
        }

        if (this.bgGain) {
            this.bgGain.disconnect();
        }

        if (this.bgElement) {
            this.bgElement.pause();
            this.bgElement.src = '';
        }

        this.bgSource = null;
        this.bgGain = null;
        this.bgElement = null;
    };
}
