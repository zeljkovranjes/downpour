/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface, Stage, ticker } from '@alienkitty/space.js';

import { Events } from '../../config/Events.js';
import { Global } from '../../config/Global.js';

export class SoundToggle extends Interface {
    constructor() {
        super('.sound-toggle');

        this.points = 40;
        this.amplitude = 4;
        this.targetAmplitude = 4;
        this.frequency = 0.18;
        this.phase = 0;
        this.width = 36;
        this.height = 24;
        this.muted = false;
        this.hovered = false;

        this.baseAmplitude = 4;
        this.baseFrequency = 0.18;
        this.baseSpeed = 2.2;

        this.amplitudeBoost = 3.5;
        this.frequencyBoost = 0.06;
        this.speedBoost = 1.0;

        this.audio = 0;
        this.audioSmoothing = 5;

        this.initHTML();
        this.initSVG();
        this.addListeners();
    }

    initHTML = () => {
        this.css({
            display: 'inline-block',
            width: this.width,
            height: this.height,
            color: 'inherit',
            cursor: 'pointer',
            pointerEvents: 'auto',
            webkitTapHighlightColor: 'rgba(0, 0, 0, 0)'
        });
    };

    initSVG = () => {
        this.svg = new Interface(null, 'svg');
        this.svg.element.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
        this.svg.element.setAttribute('width', this.width);
        this.svg.element.setAttribute('height', this.height);
        this.svg.element.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        this.svg.css({
            display: 'block'
        });
        this.add(this.svg);

        this.path = new Interface(null, 'svg', 'path');
        this.path.element.setAttribute('stroke', 'currentColor');
        this.path.element.setAttribute('stroke-width', '1.5');
        this.path.element.setAttribute('stroke-linecap', 'round');
        this.path.element.setAttribute('fill', 'none');
        this.svg.add(this.path);

        this.redraw();
    };

    addListeners = () => {
        this.element.addEventListener('mouseenter', this.onHover);
        this.element.addEventListener('mouseleave', this.onHover);
        this.element.addEventListener('click', this.onClick);
        ticker.add(this.onUpdate);
    };

    removeListeners = () => {
        this.element.removeEventListener('mouseenter', this.onHover);
        this.element.removeEventListener('mouseleave', this.onHover);
        this.element.removeEventListener('click', this.onClick);
        ticker.remove(this.onUpdate);
    };

    // Event handlers

    onHover = e => {
        this.hovered = e.type === 'mouseenter';
        this.updateTargetAmplitude();
    };

    onClick = () => {
        this.muted = !this.muted;
        this.updateTargetAmplitude();

        Stage.events.emit(Events.SOUND_TOGGLED, { muted: this.muted });
    };

    onUpdate = (time, delta) => {
        const dt = delta * 0.001;

        this.audio += (Global.audioLevel - this.audio) * Math.min(1, dt * this.audioSmoothing);

        const reactive = !this.muted && !this.hovered;
        const drive = reactive ? this.audio : 0;

        const liveAmplitude = this.baseAmplitude + drive * this.amplitudeBoost;
        const liveFrequency = this.baseFrequency + drive * this.frequencyBoost;
        const liveSpeed = this.baseSpeed + drive * this.speedBoost;

        if (reactive) {
            this.targetAmplitude = liveAmplitude;
        }

        this.amplitude += (this.targetAmplitude - this.amplitude) * Math.min(1, dt * 6);
        this.phase += liveSpeed * dt;

        this.frequency = liveFrequency;

        this.redraw();
    };

    // Public methods

    updateTargetAmplitude = () => {
        if (this.muted) {
            this.targetAmplitude = 0;
        } else if (this.hovered) {
            this.targetAmplitude = 1.2;
        } else {
            this.targetAmplitude = this.baseAmplitude;
        }
    };

    redraw = () => {
        const cy = this.height * 0.5;
        const step = this.width / (this.points - 1);

        let d = '';

        for (let i = 0; i < this.points; i++) {
            const x = i * step;
            const y = cy + Math.sin(i * step * this.frequency + this.phase) * this.amplitude;

            d += (i === 0 ? 'M' : 'L') + x.toFixed(2) + ' ' + y.toFixed(2) + ' ';
        }

        this.path.element.setAttribute('d', d.trim());
    };

    destroy = () => {
        this.removeListeners();

        this.path = null;
        this.svg = null;

        return super.destroy();
    };
}
