/**
 * @author pschroen / https://ufo.ai/
 */

import { Group } from 'three';

import { HeartfeltView } from './heartfelt/HeartfeltView.js';

export class Scene extends Group {
    constructor() {
        super();

        this.visible = false;

        this.initViews();
    }

    initViews() {
        this.heartfelt = new HeartfeltView();
        this.add(this.heartfelt);
    }

    // Public methods

    resize = (width, height) => {
        this.heartfelt.resize(width, height);
    };

    update = (time, delta, frame) => {
        this.heartfelt.update(time, delta, frame);
    };

    animateIn = () => {
        this.visible = true;

        this.heartfelt.animateIn();
    };

    ready = async () => {
        return this.heartfelt.ready();
    };

    destroy = () => {
        this.heartfelt.destroy();
    };
}
