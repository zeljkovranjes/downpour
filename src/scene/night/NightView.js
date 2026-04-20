/**
 * @author pschroen / https://ufo.ai/
 */

import {
    Group,
    LinearMipmapLinearFilter,
    Mesh,
    OrthographicCamera,
    PlaneGeometry,
    RepeatWrapping,
    SRGBColorSpace,
    Scene as ThreeScene,
    TextureLoader,
    WebGLRenderTarget
} from 'three';

import { Stage } from '@alienkitty/space.js';

import { Events } from '../../config/Events.js';
import { Global } from '../../config/Global.js';
import { TimeOfDayController } from '../../controllers/world/TimeOfDayController.js';
import { WorldController } from '../../controllers/world/WorldController.js';
import { NightMaterial } from './NightMaterial.js';
import { TrailMaterial } from './TrailMaterial.js';

const SLOTS = ['morning', 'afternoon', 'evening', 'night'];

export class NightView extends Group {
    constructor() {
        super();

        this.mouse = { x: 0, y: 0, z: 0 };
        this.elapsed = 0;
        this.textures = {};
        this.activeSlot = null;
        this.blend = 0;
        this.targetBlend = 0;
        this.crossfadeRate = 0.6;

        this.cursorTrail = [];
        this.cursorTrailMax = 12;
        this.cursorActive = false;
        this.cursorMoved = false;

        this.initMesh();
        this.initTrailPipeline();
        this.addListeners();
    }

    initMesh() {
        this.geometry = new PlaneGeometry(2, 2);
        this.material = new NightMaterial();

        this.mesh = new Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = false;
        this.add(this.mesh);
    }

    initTrailPipeline() {
        this.trailMaterial = new TrailMaterial();

        this.trailScene = new ThreeScene();
        this.trailCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.trailGeometry = new PlaneGeometry(2, 2);
        this.trailMesh = new Mesh(this.trailGeometry, this.trailMaterial);
        this.trailMesh.frustumCulled = false;
        this.trailScene.add(this.trailMesh);

        this.trailRTRead = new WebGLRenderTarget(1, 1, { depthBuffer: false });
        this.trailRTWrite = new WebGLRenderTarget(1, 1, { depthBuffer: false });
    }

    addListeners() {
        Stage.events.on(Events.TIME_OF_DAY_CHANGED, this.onTimeOfDayChanged);
        window.addEventListener('pointermove', this.onPointerMove);

        const canvas = WorldController.element;
        canvas.style.touchAction = 'none';
        canvas.addEventListener('pointerdown', this.onCursorDown);
        canvas.addEventListener('pointermove', this.onCursorMove);
        canvas.addEventListener('pointerup', this.onCursorUp);
        canvas.addEventListener('pointerleave', this.onCursorUp);
    }

    removeListeners() {
        Stage.events.off(Events.TIME_OF_DAY_CHANGED, this.onTimeOfDayChanged);
        window.removeEventListener('pointermove', this.onPointerMove);

        const canvas = WorldController.element;

        if (canvas) {
            canvas.removeEventListener('pointerdown', this.onCursorDown);
            canvas.removeEventListener('pointermove', this.onCursorMove);
            canvas.removeEventListener('pointerup', this.onCursorUp);
            canvas.removeEventListener('pointerleave', this.onCursorUp);
        }
    }

    configureTexture = texture => {
        texture.wrapS = RepeatWrapping;
        texture.wrapT = RepeatWrapping;
        texture.minFilter = LinearMipmapLinearFilter;
        texture.colorSpace = SRGBColorSpace;
        texture.generateMipmaps = true;
        texture.anisotropy = 8;

        return texture;
    };

    pushCursorPoint = e => {
        const canvas = WorldController.element;
        const rect = canvas.getBoundingClientRect();
        const u = (e.clientX - rect.left) / rect.width;
        const v = 1.0 - (e.clientY - rect.top) / rect.height;

        if (u < 0 || u > 1 || v < 0 || v > 1) {
            return;
        }

        this.cursorTrail.push([u, v]);

        if (this.cursorTrail.length > this.cursorTrailMax) {
            this.cursorTrail.shift();
        }
    };

    // Event handlers

    onPointerMove = e => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    };

    onCursorDown = e => {
        this.cursorActive = true;
        this.pushCursorPoint(e);
        this.cursorMoved = true;
    };

    onCursorMove = e => {
        if (!this.cursorActive) {
            return;
        }

        this.pushCursorPoint(e);
        this.cursorMoved = true;
    };

    onCursorUp = () => {
        this.cursorActive = false;
        this.cursorTrail = [];
    };

    onTimeOfDayChanged = ({ current }) => {
        const next = this.textures[current];

        if (!next || current === this.activeSlot) {
            return;
        }

        this.material.uniforms.uTextureB.value = next;
        this.blend = 0;
        this.targetBlend = 1;
        this.activeSlot = current;
    };

    // Public methods

    resize = (width, height) => {
        this.material.uniforms.iResolution.value.set(width, height);

        const renderer = WorldController.renderer;
        const dpr = renderer ? renderer.getPixelRatio() : 1;
        const w = Math.max(1, Math.round(width * dpr));
        const h = Math.max(1, Math.round(height * dpr));

        this.trailRTRead.setSize(w, h);
        this.trailRTWrite.setSize(w, h);
    };

    update = (time, delta) => {
        const dt = Math.min(delta * 0.001, 1 / 30);
        this.elapsed += dt * Global.shaderTimeScale;

        if (!this.cursorMoved && this.cursorTrail.length > 0) {
            this.cursorTrail.shift();
        }

        this.cursorMoved = false;

        if (this.targetBlend > 0 && this.blend < 1) {
            this.blend = Math.min(1, this.blend + dt * this.crossfadeRate);

            if (this.blend >= 1) {
                this.material.uniforms.uTextureA.value = this.material.uniforms.uTextureB.value;
                this.blend = 0;
                this.targetBlend = 0;
            }
        }

        this.runTrailPass(dt);

        this.material.uniforms.uBlend.value = this.blend;
        this.material.uniforms.iTime.value = this.elapsed;
        this.material.uniforms.iMouse.value.set(this.mouse.x, this.mouse.y, this.mouse.z);
        this.material.uniforms.uThunder.value = Global.thunder;
        this.material.uniforms.uResolution.value = Global.shaderResolution;
        this.material.uniforms.uBlur.value = Global.shaderBlur;
        this.material.uniforms.uSaturation.value = Global.shaderSaturation;
    };

    runTrailPass = dt => {
        const renderer = WorldController.renderer;

        if (!renderer) {
            return;
        }

        const uniforms = this.trailMaterial.uniforms;
        const points = uniforms.uCursorPoints.value;

        for (let i = 0; i < points.length; i++) {
            if (i < this.cursorTrail.length) {
                points[i].set(this.cursorTrail[i][0], this.cursorTrail[i][1]);
            } else {
                points[i].set(-1, -1);
            }
        }

        uniforms.uCursorCount.value = this.cursorTrail.length;
        uniforms.uDt.value = dt;
        uniforms.uPrevTrail.value = this.trailRTRead.texture;

        const prevTarget = renderer.getRenderTarget();

        renderer.setRenderTarget(this.trailRTWrite);
        renderer.render(this.trailScene, this.trailCamera);
        renderer.setRenderTarget(prevTarget);

        const tmp = this.trailRTRead;
        this.trailRTRead = this.trailRTWrite;
        this.trailRTWrite = tmp;

        this.material.uniforms.uTrail.value = this.trailRTRead.texture;
    };

    animateIn = () => {
        this.visible = true;
    };

    ready = async () => {
        const loader = new TextureLoader();

        const loadOne = slot => loader
            .loadAsync(`assets/textures/${slot}.jpg`)
            .then(this.configureTexture)
            .catch(() => {
                console.warn(`[NightView] Missing assets/textures/${slot}.jpg`);
                return null;
            });

        const loaded = await Promise.all(SLOTS.map(loadOne));

        SLOTS.forEach((slot, i) => {
            if (loaded[i]) {
                this.textures[slot] = loaded[i];
            }
        });

        const initial = TimeOfDayController.current || 'night';
        const startTexture = this.textures[initial] || this.textures.night || Object.values(this.textures)[0];

        if (startTexture) {
            this.activeSlot = initial;
            this.material.uniforms.uTextureA.value = startTexture;
            this.material.uniforms.uTextureB.value = startTexture;
            this.material.uniforms.uBlend.value = 0;
        }

        Stage.events.emit(Events.LOAD_PROGRESS, { progress: 0.5 });
    };

    destroy = () => {
        this.removeListeners();

        Object.values(this.textures).forEach(texture => texture.dispose());
        this.textures = null;

        this.trailRTRead.dispose();
        this.trailRTWrite.dispose();
        this.trailGeometry.dispose();
        this.trailMaterial.dispose();

        this.geometry.dispose();
        this.material.dispose();
    };
}
