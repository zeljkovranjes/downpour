/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface, Stage } from '@alienkitty/space.js';

import { Events } from '../config/Events.js';

export class Loader extends Interface {
    constructor() {
        super('.loader');

        this.dismissed = false;

        this.initHTML();
        this.initGrain();
        this.initText();
        this.addListeners();
    }

    initHTML = () => {
        this.css({
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            background: '#000',
            zIndex: 9999,
            cursor: 'default',
            opacity: 1,
            transition: 'opacity 800ms ease-out',
            overflow: 'hidden'
        });
    };

    initGrain = () => {
        this.grain = new Interface(null, 'div');
        this.grain.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            opacity: 0.08,
            pointerEvents: 'none',
            mixBlendMode: 'screen'
        });
        this.grain.html(`
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <filter id="loader-grain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
                    <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/>
                </filter>
                <rect width="100%" height="100%" filter="url(#loader-grain)"/>
            </svg>
        `);
        this.add(this.grain);
    };

    initText = () => {
        this.text = new Interface(null, 'div');
        this.text.html('enter');
        this.text.css({
            position: 'absolute',
            left: 0,
            top: '65%',
            width: '100%',
            textAlign: 'center',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 300,
            fontStyle: 'normal',
            fontSize: 13,
            color: 'rgba(255, 255, 255, 0.55)',
            letterSpacing: '0.4em',
            paddingLeft: '0.4em',
            opacity: 0,
            transition: 'opacity 1400ms ease-out'
        });
        this.add(this.text);

        this.fadeTimer = setTimeout(() => {
            this.text.css({ opacity: 1 });
        }, 600);
    };

    addListeners = () => {
        this.element.addEventListener('pointerdown', this.onDismiss);
        window.addEventListener('keydown', this.onDismiss);
    };

    removeListeners = () => {
        this.element.removeEventListener('pointerdown', this.onDismiss);
        window.removeEventListener('keydown', this.onDismiss);
    };

    // Event handlers

    onDismiss = () => {
        if (this.dismissed) {
            return;
        }

        this.dismissed = true;

        this.text.css({
            opacity: 0,
            transition: 'opacity 400ms ease-out'
        });

        this.overlayTimer = setTimeout(() => {
            this.css({ opacity: 0 });
        }, 200);

        Stage.events.emit(Events.LOAD_BEGIN);

        this.dismissTimer = setTimeout(this.destroy, 1100);
    };

    destroy = () => {
        this.removeListeners();

        clearTimeout(this.fadeTimer);
        clearTimeout(this.overlayTimer);
        clearTimeout(this.dismissTimer);

        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    };
}
