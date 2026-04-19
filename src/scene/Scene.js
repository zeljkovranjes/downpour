/**
 * @author pschroen / https://ufo.ai/
 */

import { Group } from 'three';

export class Scene extends Group {
    constructor() {
        super();

        this.visible = false;
    }

    // Public methods

    resize = (width, height) => {
    };

    update = (time, delta, frame) => {
    };

    animateIn = () => {
        this.visible = true;
    };

    ready = async () => {
    };

    destroy = () => {
    };
}
