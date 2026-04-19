/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface, Stage } from '@alienkitty/space.js';

import { Events } from '../config/Events.js';

export class Letterbox extends Interface {
    constructor() {
        super('.letterbox');

        this.barHeight = '8vh';
        this.released = false;

        this.initHTML();
        this.initBars();
        this.addListeners();
    }

    initHTML = () => {
        this.css({
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: 10000,
            pointerEvents: 'none'
        });
    };

    initBars = () => {
        const transition = 'height 3000ms cubic-bezier(0.22, 1, 0.36, 1)';

        this.topBar = new Interface(null, 'div');
        this.topBar.css({
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: 0,
            background: '#000',
            pointerEvents: 'none',
            transition
        });
        this.add(this.topBar);

        this.bottomBar = new Interface(null, 'div');
        this.bottomBar.css({
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: 0,
            background: '#000',
            pointerEvents: 'auto',
            transition
        });
        this.add(this.bottomBar);
    };

    addListeners = () => {
        Stage.events.on(Events.LOAD_BEGIN, this.onLoadBegin);
        Stage.events.on(Events.FRAME_RELEASE, this.release);
    };

    removeListeners = () => {
        Stage.events.off(Events.LOAD_BEGIN, this.onLoadBegin);
        Stage.events.off(Events.FRAME_RELEASE, this.release);
    };

    // Event handlers

    onLoadBegin = () => {
        this.topBar.css({ height: this.barHeight });
        this.bottomBar.css({ height: this.barHeight });
    };

    // Public methods

    release = () => {
        if (this.released) {
            return;
        }

        this.released = true;

        this.topBar.css({ height: 0 });
        this.bottomBar.css({ height: 0, pointerEvents: 'none' });
    };

    destroy = () => {
        this.removeListeners();

        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    };
}
