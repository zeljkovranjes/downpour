/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '@alienkitty/space.js';

export class Header extends Interface {
    constructor() {
        super('.header');

        this.init();
    }

    init() {
        this.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            padding: '24px',
            pointerEvents: 'none',
            zIndex: 10
        });

        this.title = new Interface('.title', 'h1');
        this.title.css({
            margin: 0,
            fontFamily: 'var(--ui-font-family)',
            fontWeight: 'var(--ui-font-weight)',
            fontSize: 'var(--ui-font-size)',
            lineHeight: 'var(--ui-line-height)',
            letterSpacing: 'var(--ui-letter-spacing)',
            textTransform: 'uppercase'
        });
        this.title.text('Liminal');
        this.add(this.title);
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
