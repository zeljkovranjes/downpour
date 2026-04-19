/**
 * @author pschroen / https://ufo.ai/
 */

import { Stage, ticker } from '@alienkitty/space.js';

import { Events } from '../../config/Events.js';
import { Global } from '../../config/Global.js';

export class AudioAnalyser {
    constructor(audioElement) {
        this.audioElement = audioElement;
        this.context = null;
        this.source = null;
        this.analyser = null;
        this.data = null;

        this.threshold = 0.55;
        this.cooldown = 0;
        this.cooldownDuration = 0.4;
        this.envelope = 0;
        this.attack = 25;
        this.decay = 1.8;

        this.bandStart = 0;
        this.bandEnd = 8;

        this.level = 0;
        this.levelAttack = 8;
        this.levelDecay = 3;

        this.addListeners();
    }

    addListeners = () => {
        Stage.events.on(Events.SOUND_TOGGLED, this.onSoundToggled);
        ticker.add(this.onUpdate);
    };

    removeListeners = () => {
        Stage.events.off(Events.SOUND_TOGGLED, this.onSoundToggled);
        ticker.remove(this.onUpdate);
    };

    // Event handlers

    onSoundToggled = ({ muted }) => {
        if (muted) {
            this.envelope = 0;
            this.level = 0;
            Global.thunder = 0;
            Global.audioLevel = 0;
        }
    };

    onUpdate = (time, delta) => {
        if (!this.analyser) {
            return;
        }

        const dt = Math.min(delta * 0.001, 1 / 30);

        this.analyser.getByteFrequencyData(this.data);

        let sum = 0;

        for (let i = this.bandStart; i < this.bandEnd; i++) {
            sum += this.data[i];
        }

        const energy = sum / ((this.bandEnd - this.bandStart) * 255);

        this.cooldown = Math.max(0, this.cooldown - dt);

        const triggered = energy > this.threshold && this.cooldown === 0;

        if (triggered) {
            this.envelope = 1;
            this.cooldown = this.cooldownDuration;
        } else {
            this.envelope -= this.envelope * Math.min(1, dt * this.decay);

            if (this.envelope < 0.001) {
                this.envelope = 0;
            }
        }

        Global.thunder = this.envelope;

        let total = 0;

        for (let i = 0; i < this.data.length; i++) {
            total += this.data[i];
        }

        const target = total / (this.data.length * 255);
        const rate = target > this.level ? this.levelAttack : this.levelDecay;
        this.level += (target - this.level) * Math.min(1, dt * rate);

        Global.audioLevel = this.level;
    };

    // Public methods

    connect = () => {
        if (this.context) {
            return;
        }

        const Ctx = window.AudioContext || window.webkitAudioContext;

        this.context = new Ctx();
        this.source = this.context.createMediaElementSource(this.audioElement);
        this.analyser = this.context.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.smoothingTimeConstant = 0.4;
        this.data = new Uint8Array(this.analyser.frequencyBinCount);

        this.source.connect(this.analyser);
        this.analyser.connect(this.context.destination);
    };

    resume = () => {
        if (this.context && this.context.state === 'suspended') {
            this.context.resume();
        }
    };

    destroy = () => {
        this.removeListeners();

        if (this.source) {
            this.source.disconnect();
        }

        if (this.analyser) {
            this.analyser.disconnect();
        }

        if (this.context && this.context.state !== 'closed') {
            this.context.close();
        }

        this.audioElement = null;
        this.source = null;
        this.analyser = null;
        this.context = null;
        this.data = null;

        Global.thunder = 0;
        Global.audioLevel = 0;
    };
}
