/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface, clearTween, tween } from '@alienkitty/space.js';

export class Loader extends Interface {
    constructor() {
        super('.loader');

        this.init();
    }

    init() {
        this.css({
            position: 'fixed',
            left: '50%',
            top: '50%',
            width: 180,
            height: 2,
            marginLeft: -90,
            marginTop: -1,
            background: 'rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 100
        });

        this.bar = new Interface('.bar');
        this.bar.css({
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: '0%',
            background: 'var(--ui-color)'
        });
        this.add(this.bar);
    }

    // Public methods

    update = progress => {
        clearTween(this.bar.style);

        tween(this.bar.style, { width: `${progress * 100}%` }, 500, 'easeOutCubic');
    };

    animateIn = () => {
    };

    animateOut = () => {
        return this.tween({ opacity: 0 }, 400, 'easeOutCubic');
    };

    destroy = () => {
        clearTween(this.bar.style);

        return super.destroy();
    };
}
