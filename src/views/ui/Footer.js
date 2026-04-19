/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '@alienkitty/space.js';

export class Footer extends Interface {
    constructor() {
        super('.footer');

        this.init();
    }

    init() {
        this.css({
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            padding: '24px',
            pointerEvents: 'none',
            zIndex: 10
        });

        this.caption = new Interface('.caption');
        this.caption.css({
            fontFamily: 'var(--ui-font-family)',
            fontSize: 'var(--ui-secondary-font-size)',
            letterSpacing: 'var(--ui-secondary-letter-spacing)',
            textTransform: 'uppercase',
            opacity: 0.7
        });
        this.caption.text('© 2026');
        this.add(this.caption);
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
