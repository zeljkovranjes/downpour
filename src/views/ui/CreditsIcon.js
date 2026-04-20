/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface, Stage } from '@alienkitty/space.js';

import { Events } from '../../config/Events.js';

export class CreditsIcon extends Interface {
    constructor() {
        super('.credits-icon');

        this.initHTML();
        this.initIcon();
        this.addListeners();
    }

    initHTML = () => {
        this.css({
            position: 'fixed',
            left: 24,
            bottom: 24,
            width: 18,
            height: 18,
            cursor: 'pointer',
            opacity: 0.85,
            transition: 'opacity 400ms ease-out',
            zIndex: 100,
            pointerEvents: 'auto',
            color: 'currentColor'
        });
    };

    initIcon = () => {
        this.icon = new Interface(null, 'div');
        this.icon.html(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18" fill="none">
                <circle cx="9" cy="9" r="7.5" stroke="currentColor" stroke-width="1.5"/>
                <line x1="9" y1="8" x2="9" y2="12.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <line x1="9" y1="5.5" x2="9" y2="5.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
        `);
        this.icon.css({
            width: '100%',
            height: '100%',
            color: 'inherit'
        });
        this.add(this.icon);
    };

    addListeners = () => {
        this.element.addEventListener('mouseenter', this.onHover);
        this.element.addEventListener('mouseleave', this.onHover);
        this.element.addEventListener('click', this.onClick);
    };

    removeListeners = () => {
        this.element.removeEventListener('mouseenter', this.onHover);
        this.element.removeEventListener('mouseleave', this.onHover);
        this.element.removeEventListener('click', this.onClick);
    };

    // Event handlers

    onHover = e => {
        this.css({ opacity: e.type === 'mouseenter' ? 1 : 0.85 });
    };

    onClick = () => {
        Stage.events.emit(Events.CREDITS_OPEN);
    };

    destroy = () => {
        this.removeListeners();

        this.icon = null;

        return super.destroy();
    };
}
