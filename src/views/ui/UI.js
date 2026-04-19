/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '@alienkitty/space.js';

import { Menu } from './Menu.js';

export class UI extends Interface {
    constructor() {
        super('.ui');

        this.init();
        this.initViews();
    }

    init() {
        this.css({
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            webkitUserSelect: 'none',
            userSelect: 'none'
        });
    }

    initViews() {
        this.menu = new Menu();
        this.add(this.menu);
    }

    // Public methods

    animateIn = () => {
        this.menu.animateIn();
    };

    animateOut = () => {
        this.menu.animateOut();
    };

    destroy = () => {
        return super.destroy();
    };
}
