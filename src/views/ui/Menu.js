/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '@alienkitty/space.js';

import { SoundToggle } from './SoundToggle.js';

export class Menu extends Interface {
    constructor() {
        super('.menu');

        this.init();
        this.initViews();
    }

    init() {
        this.css({
            position: 'absolute',
            right: 0,
            bottom: 0,
            padding: '24px',
            pointerEvents: 'auto',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        });
    }

    initViews() {
        this.soundToggle = new SoundToggle();
        this.add(this.soundToggle);
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
