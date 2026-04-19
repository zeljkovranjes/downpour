/**
 * @author pschroen / https://ufo.ai/
 */

import { Interface } from '@alienkitty/space.js';

import { Footer } from './Footer.js';
import { Header } from './Header.js';
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
        this.header = new Header();
        this.add(this.header);

        this.menu = new Menu();
        this.add(this.menu);

        this.footer = new Footer();
        this.add(this.footer);
    }

    // Public methods

    animateIn = () => {
        this.header.animateIn();
        this.menu.animateIn();
        this.footer.animateIn();
    };

    animateOut = () => {
        this.header.animateOut();
        this.menu.animateOut();
        this.footer.animateOut();
    };

    destroy = () => {
        return super.destroy();
    };
}
