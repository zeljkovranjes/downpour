/**
 * @author pschroen / https://ufo.ai/
 */

import {
    Group,
    LinearMipmapLinearFilter,
    Mesh,
    PlaneGeometry,
    RepeatWrapping,
    SRGBColorSpace,
    TextureLoader
} from 'three';

import { Stage } from '@alienkitty/space.js';

import { Events } from '../../config/Events.js';
import { Global } from '../../config/Global.js';
import { HeartfeltMaterial } from './HeartfeltMaterial.js';

export class HeartfeltView extends Group {
    constructor() {
        super();

        this.mouse = { x: 0, y: 0, z: 0 };
        this.elapsed = 0;
        this.texturePath = 'assets/textures/heartfelt.jpg';

        this.initMesh();
        this.addListeners();
    }

    initMesh() {
        this.geometry = new PlaneGeometry(2, 2);
        this.material = new HeartfeltMaterial();

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = false;
        this.add(this.mesh);
    }

    addListeners() {
        window.addEventListener('pointermove', this.onPointerMove);
    }

    removeListeners() {
        window.removeEventListener('pointermove', this.onPointerMove);
    }

    // Event handlers

    onPointerMove = e => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    };

    // Public methods

    resize = (width, height) => {
        this.material.uniforms.iResolution.value.set(width, height);
    };

    update = (time, delta) => {
        const dt = Math.min(delta * 0.001, 1 / 30) * Global.shaderTimeScale;
        this.elapsed += dt;

        this.material.uniforms.iTime.value = this.elapsed;
        this.material.uniforms.iMouse.value.set(this.mouse.x, this.mouse.y, this.mouse.z);
        this.material.uniforms.uThunder.value = Global.thunder;
        this.material.uniforms.uResolution.value = Global.shaderResolution;
        this.material.uniforms.uBlur.value = Global.shaderBlur;
        this.material.uniforms.uSaturation.value = Global.shaderSaturation;
    };

    animateIn = () => {
        this.visible = true;
    };

    ready = async () => {
        const texture = await new TextureLoader().loadAsync(this.texturePath).catch(() => null);

        if (!texture) {
            console.warn(`[HeartfeltView] Missing ${this.texturePath} — drop a city-night photo (jpg, 1024+) there.`);
            return;
        }

        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.minFilter = LinearMipmapLinearFilter;
        texture.colorSpace = SRGBColorSpace;
        texture.generateMipmaps = true;
        texture.anisotropy = 8;

        this.texture = texture;
        this.material.uniforms.iChannel0.value = texture;

        Stage.events.emit(Events.LOAD_PROGRESS, { progress: 0.5 });
    };

    destroy = () => {
        this.removeListeners();

        if (this.texture) {
            this.texture.dispose();
        }

        this.geometry.dispose();
        this.material.dispose();
    };
}
