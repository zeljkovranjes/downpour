/**
 * @author pschroen / https://ufo.ai/
 */

import { Group } from 'three';

import { NightView } from './night/NightView.js';

export class Scene extends Group {
    constructor() {
        super();

        this.initViews();
    }

    initViews() {
        this.night = new NightView();
        this.add(this.night);
    }

    // Public methods

    resize = (width, height) => {
        this.night.resize(width, height);
    };

    update = (time, delta, frame) => {
        this.night.update(time, delta, frame);
    };

    animateIn = () => {
        this.visible = true;

        this.night.animateIn();
    };

    ready = async () => {
        return this.night.ready();
    };

    destroy = () => {
        this.night.destroy();
    };
}
