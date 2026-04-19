/**
 * @author pschroen / https://ufo.ai/
 */

import { Raycaster, Vector2 } from 'three';
import { Stage } from '@alienkitty/space.js';

import { Events } from '../../config/Events.js';

export class InputManager {
    static init(scene, camera) {
        this.scene = scene;
        this.camera = camera;

        this.raycaster = new Raycaster();
        this.pointer = new Vector2();
        this.hover = null;
        this.selected = null;
        this.objects = [];
        this.enabled = true;

        this.addListeners();
    }

    static addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);

        window.addEventListener('pointerdown', this.onPointerDown);
        window.addEventListener('pointermove', this.onPointerMove);
        window.addEventListener('pointerup', this.onPointerUp);
    }

    static removeListeners() {
        Stage.events.off(Events.RESIZE, this.onResize);

        window.removeEventListener('pointerdown', this.onPointerDown);
        window.removeEventListener('pointermove', this.onPointerMove);
        window.removeEventListener('pointerup', this.onPointerUp);
    }

    static updatePointer = e => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;

        this.pointer.x = (e.clientX / width) * 2 - 1;
        this.pointer.y = -((e.clientY / height) * 2 - 1);
    };

    // Event handlers

    static onResize = () => {
    };

    static onPointerDown = e => {
        if (!this.enabled) {
            return;
        }

        this.updatePointer(e);
        this.raycaster.setFromCamera(this.pointer, this.camera);

        const hits = this.raycaster.intersectObjects(this.objects);

        if (hits.length) {
            this.selected = hits[0].object;
            Stage.events.emit(Events.CLICK, { target: this.selected });
        } else {
            this.selected = null;
        }
    };

    static onPointerMove = e => {
        if (!this.enabled) {
            return;
        }

        this.updatePointer(e);
        this.raycaster.setFromCamera(this.pointer, this.camera);

        const hits = this.raycaster.intersectObjects(this.objects);
        const next = hits.length ? hits[0].object : null;

        if (next !== this.hover) {
            this.hover = next;
            Stage.events.emit(Events.HOVER, { target: this.hover });
        }
    };

    static onPointerUp = e => {
        if (!this.enabled) {
            return;
        }

        this.selected = null;
    };

    // Public methods

    static add = (...objects) => {
        this.objects.push(...objects);
    };

    static remove = (...objects) => {
        objects.forEach(object => {
            const i = this.objects.indexOf(object);

            if (~i) {
                this.objects.splice(i, 1);
            }
        });
    };

    static destroy = () => {
        this.removeListeners();

        this.objects = null;
    };
}
