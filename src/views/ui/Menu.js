/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '@alienkitty/space.js';

export class Menu extends Interface {
    constructor() {
        super('.menu');

        this.init();
    }

    init() {
        this.css({
            position: 'absolute',
            right: 0,
            top: 0,
            padding: '24px',
            pointerEvents: 'auto',
            zIndex: 10
        });
    }

    // Public methods

    animateIn = () => {
    };

    animateOut = () => {
    };

    destroy = () => {
        return super.destroy();
    };
}
