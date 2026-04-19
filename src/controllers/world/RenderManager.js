/**
 * @author pschroen / https://ufo.ai/
 */

import {
    HalfFloatType,
    Mesh,
    OrthographicCamera,
    WebGLRenderTarget
} from 'three';
import { Stage, ticker } from '@alienkitty/space.js';

import { Events } from '../../config/Events.js';
import { WorldController } from './WorldController.js';

export class RenderManager {
    static init() {
        this.renderer = WorldController.renderer;
        this.scene = WorldController.scene;
        this.camera = WorldController.camera;

        this.initRenderer();

        this.addListeners();
    }

    static initRenderer() {
        // Fullscreen triangle
        this.screenCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Render targets
        this.renderTargetA = new WebGLRenderTarget(1, 1, {
            depthBuffer: false,
            type: HalfFloatType
        });

        this.renderTargetB = this.renderTargetA.clone();

        this.renderTargetA.depthBuffer = true;

        // Materials

        // Fullscreen triangle mesh (reused across passes)
        this.screen = new Mesh();
        this.screen.frustumCulled = false;
    }

    static addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
        ticker.add(this.onUpdate);
    }

    static removeListeners() {
        Stage.events.off(Events.RESIZE, this.onResize);
        ticker.remove(this.onUpdate);
    }

    // Event handlers

    static onResize = () => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        const dpr = window.devicePixelRatio;

        const w = Math.round(width * dpr);
        const h = Math.round(height * dpr);

        this.renderTargetA.setSize(w, h);
        this.renderTargetB.setSize(w, h);
    };

    static onUpdate = () => {
        const renderer = this.renderer;
        const scene = this.scene;
        const camera = this.camera;

        // Scene pass
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);
    };

    // Public methods

    static destroy = () => {
        this.removeListeners();

        // Render targets
        this.renderTargetA.dispose();
        this.renderTargetB.dispose();

        // Materials

        // Geometries

        // Empty arrays
    };
}
