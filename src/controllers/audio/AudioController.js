/**
 * @author pschroen / https://ufo.ai/
 */

import { Stage, WebAudio } from '@alienkitty/space.js';

import { Events } from '../../config/Events.js';

export class AudioController {
    static init() {
        this.muted = false;

        this.addListeners();
    }

    static addListeners() {
        Stage.events.on(Events.VISIBILITY, this.onVisibility);
    }

    static removeListeners() {
        Stage.events.off(Events.VISIBILITY, this.onVisibility);
    }

    // Event handlers

    static onVisibility = () => {
        if (document.hidden) {
            WebAudio.mute();
        } else if (!this.muted) {
            WebAudio.unmute();
        }
    };

    // Public methods

    static trigger = event => {
        switch (event) {
            default:
                break;
        }
    };

    static mute = () => {
        this.muted = true;
        WebAudio.mute();
    };

    static unmute = () => {
        this.muted = false;
        WebAudio.unmute();
    };

    static destroy = () => {
        this.removeListeners();
    };
}
