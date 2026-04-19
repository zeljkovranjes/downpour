/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface, Stage } from '@alienkitty/space.js';

import { Events } from '../config/Events.js';

export class OpeningLine extends Interface {
    constructor() {
        super('.opening-line');

        this.text = 'the rain has been falling for some time';
        this.holdDuration = 7000;
        this.fadeIn = 2400;
        this.fadeOut = 3000;

        this.initHTML();
        this.initText();
        this.addListeners();
    }

    initHTML = () => {
        this.css({
            position: 'fixed',
            left: 0,
            top: 'calc(8vh + 32px)',
            width: '100%',
            textAlign: 'center',
            zIndex: 9998,
            pointerEvents: 'none'
        });
    };

    initText = () => {
        this.line = new Interface(null, 'div');
        this.line.html(this.text);
        this.line.css({
            display: 'inline-block',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 300,
            fontStyle: 'normal',
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.75)',
            letterSpacing: '0.08em',
            opacity: 0,
            transition: `opacity ${this.fadeIn}ms ease-out`
        });
        this.add(this.line);
    };

    addListeners = () => {
        Stage.events.on(Events.LOAD_COMPLETE, this.onLoadComplete);
    };

    removeListeners = () => {
        Stage.events.off(Events.LOAD_COMPLETE, this.onLoadComplete);
    };

    // Event handlers

    onLoadComplete = () => {
        this.appearTimer = setTimeout(this.appear, 1200);
    };

    appear = () => {
        this.line.css({ opacity: 1 });
        this.disappearTimer = setTimeout(this.disappear, this.fadeIn + this.holdDuration);
    };

    disappear = () => {
        this.line.css({
            opacity: 0,
            transition: `opacity ${this.fadeOut}ms ease-in`
        });

        Stage.events.emit(Events.FRAME_RELEASE);

        this.destroyTimer = setTimeout(this.destroy, this.fadeOut + 200);
    };

    destroy = () => {
        this.removeListeners();

        clearTimeout(this.appearTimer);
        clearTimeout(this.disappearTimer);
        clearTimeout(this.destroyTimer);

        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    };
}
