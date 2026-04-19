/**
 * @author pschroen / https://ufo.ai/
 */

import {
    Color,
    ColorManagement,
    PerspectiveCamera,
    Scene,
    Vector2,
    WebGLRenderer
} from 'three';
import { Stage, ticker } from '@alienkitty/space.js';

import { Events } from '../../config/Events.js';

export class WorldController {
    static init() {
        this.initWorld();

        this.addListeners();
        this.onResize();
    }

    static initWorld() {
        ColorManagement.enabled = false;

        this.renderer = new WebGLRenderer({
            powerPreference: 'high-performance',
            stencil: false,
            antialias: false
        });

        this.element = this.renderer.domElement;

        // Tone mapping
        this.renderer.toneMappingExposure = 1;

        // 3D scene
        this.scene = new Scene();
        this.scene.background = new Color(0x0e0e0e);
        this.camera = new PerspectiveCamera(30);
        this.camera.near = 0.5;
        this.camera.far = 40;
        this.camera.position.z = 8;
        this.camera.lookAt(this.scene.position);

        // Global geometries

        // Global uniforms
        this.resolution = { value: new Vector2() };
        this.texelSize = { value: new Vector2() };
        this.aspect = { value: 1 };
        this.time = { value: 0 };
        this.frame = { value: 0 };

        // Global settings
        this.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    }

    static addListeners() {
        Stage.events.on(Events.RESIZE, this.onResize);
        ticker.add(this.onUpdate);
    }

    // Event handlers

    static onResize = () => {
        const width = document.documentElement.clientWidth;
        const height = document.documentElement.clientHeight;
        const dpr = window.devicePixelRatio;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setPixelRatio(dpr);
        this.renderer.setSize(width, height);

        const w = Math.round(width * dpr);
        const h = Math.round(height * dpr);

        this.resolution.value.set(w, h);
        this.texelSize.value.set(1 / w, 1 / h);
        this.aspect.value = w / h;
    };

    static onUpdate = (time, delta, frame) => {
        this.time.value = time;
        this.frame.value = frame;
    };
}
