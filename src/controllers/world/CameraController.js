/**
 * @author pschroen / https://ufo.ai/
 */

import { Vector3 } from 'three';
import { Stage, ticker } from '@alienkitty/space.js';

import { Events } from '../../config/Events.js';

export class CameraController {
    static init(camera) {
        this.camera = camera;

        this.mouse = { x: 0, y: 0 };
        this.lookAt = new Vector3();
        this.origin = new Vector3();
        this.target = new Vector3();

        this.lerpSpeed = 0.07;

        this.origin.copy(this.camera.position);

        this.addListeners();
    }

    static addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
        ticker.add(this.onUpdate);

        window.addEventListener('pointermove', this.onPointerMove);
    }

    static removeListeners() {
        Stage.events.off(Events.RESIZE, this.onResize);
        ticker.remove(this.onUpdate);

        window.removeEventListener('pointermove', this.onPointerMove);
    }

    // Event handlers

    static onResize = () => {
    };

    static onPointerMove = e => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

        this.mouse.x = (e.clientX / width) * 2 - 1;
        this.mouse.y = -((e.clientY / height) * 2 - 1);
    };

    static onUpdate = () => {
        this.target.x = this.origin.x + this.mouse.x * 0.5;
        this.target.y = this.origin.y + this.mouse.y * 0.5;
        this.target.z = this.origin.z;

        this.camera.position.lerp(this.target, this.lerpSpeed);
        this.camera.lookAt(this.lookAt);
    };

    // Public methods

    static animateIn = () => {
    };

    static destroy = () => {
        this.removeListeners();
    };
}
