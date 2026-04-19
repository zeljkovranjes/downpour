/**
 * @author pschroen / https://ufo.ai/
 */

import { Stage, ticker } from '@alienkitty/space.js';

import { Events } from '../../config/Events.js';

export class SceneController {
    static init(view) {
        this.view = view;

        this.addListeners();
        this.onResize();
    }

    static addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
        ticker.add(this.onUpdate);
    }

    static removeListeners() {
        Stage.events.off(Events.RESIZE, this.onResize);
        ticker.remove(this.onUpdate);
    }

    // Event handlers

    static onResize = () => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

        this.view.resize(width, height);
    };

    static onUpdate = (time, delta, frame) => {
        this.view.update(time, delta, frame);
    };

    // Public methods

    static animateIn = () => {
        this.view.animateIn();
    };

    static ready = () => this.view.ready();

    static destroy = () => {
        this.removeListeners();

        this.view.destroy();
    };
}
