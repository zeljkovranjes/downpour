/**
 * @author pschroen / https://ufo.ai/
 */

import { Panel, PanelItem, Stage } from '@alienkitty/space.js';

export class PanelController {
    static init(view) {
        this.view = view;

        this.initPanel();
    }

    static initPanel() {
        const items = [
            {
                type: 'graph',
                name: 'FPS',
                noText: true,
                noHover: true,
                callback: value => value
            }
        ];

        this.panel = new Panel();
        this.panel.animateIn();

        items.forEach(data => {
            this.panel.add(new PanelItem(data));
        });

        Stage.add(this.panel);
    }

    // Public methods

    static destroy = () => {
        this.panel = this.panel.destroy();
    };
}
