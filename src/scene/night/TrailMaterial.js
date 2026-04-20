/**
 * @author pschroen / https://ufo.ai/
 */

import { GLSL3, RawShaderMaterial, Vector2 } from 'three';

import vertexShader from './shaders/Trail.vert.glsl?raw';
import fragmentShader from './shaders/Trail.frag.glsl?raw';

export class TrailMaterial extends RawShaderMaterial {
    constructor() {
        const points = [];

        for (let i = 0; i < 12; i++) {
            points.push(new Vector2(-1, -1));
        }

        super({
            glslVersion: GLSL3,
            uniforms: {
                uPrevTrail: { value: null },
                uDt: { value: 1 / 60 },
                uDecay: { value: 3.5 },
                uDripSpeed: { value: 0 },
                uCursorPoints: { value: points },
                uCursorCount: { value: 0 },
                uCursorRadius: { value: 0.015 },
                uCursorStrength: { value: 1.0 }
            },
            vertexShader,
            fragmentShader,
            depthTest: false,
            depthWrite: false
        });
    }
}
