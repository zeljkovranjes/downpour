/**
 * @author pschroen / https://ufo.ai/
 */

import { Stage, ticker } from '@alienkitty/space.js';

import { Events } from '../config/Events.js';
import { Global } from '../config/Global.js';

const lerp = (a, b, t) => a + (b - a) * t;

export class LoaderController {
    static init() {
        this.progress = 0;
        this.eased = 0;
        this.holdTimer = 0;
        this.holdDuration = 1.0;
        this.phase = 'idle';

        this.resolutionFrom = 16;
        this.resolutionTo = 1;
        this.blurFrom = 6;
        this.blurTo = 0;
        this.saturationFrom = 0.1;
        this.saturationTo = 1;
        this.timeScaleFrom = 0.25;
        this.timeScaleTo = 1;
        this.volumeFrom = 0;
        this.volumeTo = 0.55;

        this.addListeners();
        this.applyToGlobal(0);
    }

    static addListeners() {
        Stage.events.on(Events.LOAD_BEGIN, this.onLoadBegin);
        Stage.events.on(Events.LOAD_PROGRESS, this.onLoadProgress);
        ticker.add(this.onUpdate);
    }

    static removeListeners() {
        Stage.events.off(Events.LOAD_BEGIN, this.onLoadBegin);
        Stage.events.off(Events.LOAD_PROGRESS, this.onLoadProgress);
        ticker.remove(this.onUpdate);
    }

    // Event handlers

    static onLoadBegin = () => {
        if (this.phase !== 'idle') {
            return;
        }

        this.phase = 'revealing';
    };

    static onLoadProgress = ({ progress }) => {
        this.progress = Math.min(1, this.progress + progress);
    };

    static onUpdate = (time, delta) => {
        if (this.phase === 'idle' || this.phase === 'complete') {
            return;
        }

        const dt = Math.min(delta * 0.001, 1 / 30);

        if (this.phase === 'revealing') {
            this.eased += (this.progress - this.eased) * Math.min(1, dt * 2.5);
            this.applyToGlobal(this.eased);

            if (this.eased >= 0.99 && this.progress >= 1) {
                this.eased = 1;
                this.applyToGlobal(1);
                this.phase = 'holding';
                this.holdTimer = 0;
            }
        } else if (this.phase === 'holding') {
            this.holdTimer += dt;

            if (this.holdTimer >= this.holdDuration) {
                this.applyToGlobal(1);
                this.phase = 'complete';
                Stage.events.emit(Events.LOAD_COMPLETE);
            }
        }
    };

    // Public methods

    static applyToGlobal = t => {
        Global.loadProgress = t;
        Global.shaderResolution = lerp(this.resolutionFrom, this.resolutionTo, t);
        Global.shaderBlur = lerp(this.blurFrom, this.blurTo, t);
        Global.shaderSaturation = lerp(this.saturationFrom, this.saturationTo, t);
        Global.shaderTimeScale = lerp(this.timeScaleFrom, this.timeScaleTo, t);
        Global.audioVolume = lerp(this.volumeFrom, this.volumeTo, t);
    };

    static destroy = () => {
        this.removeListeners();
    };
}
