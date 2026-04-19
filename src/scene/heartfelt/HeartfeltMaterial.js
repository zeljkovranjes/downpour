/**
 * @author pschroen / https://ufo.ai/
 */

import { GLSL3, RawShaderMaterial, Vector2, Vector3 } from 'three';

import vertexShader from './shaders/Heartfelt.vert.glsl?raw';
import fragmentShader from './shaders/Heartfelt.frag.glsl?raw';

export class HeartfeltMaterial extends RawShaderMaterial {
    constructor() {
        super({
            glslVersion: GLSL3,
            uniforms: {
                iTime: { value: 0 },
                iResolution: { value: new Vector2() },
                iMouse: { value: new Vector3() },
                iChannel0: { value: null },
                uThunder: { value: 0 },
                uResolution: { value: 16 },
                uBlur: { value: 6 },
                uSaturation: { value: 0.1 }
            },
            vertexShader,
            fragmentShader,
            depthTest: false,
            depthWrite: false
        });
    }
}
