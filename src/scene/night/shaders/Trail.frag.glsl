precision highp float;

uniform sampler2D uPrevTrail;
uniform float uDt;
uniform float uDecay;
uniform float uDripSpeed;
uniform vec2 uCursorPoints[12];
uniform int uCursorCount;
uniform float uCursorRadius;
uniform float uCursorStrength;

in vec2 vUv;
out vec4 fragColor;

void main() {
    float prev = texture(uPrevTrail, vUv).r;
    float carried = texture(uPrevTrail, vUv + vec2(0.0, uDripSpeed * uDt)).r;

    float decayHere = clamp(1.0 - uDecay * uDt, 0.0, 1.0);
    float decayCarried = clamp(1.0 - uDecay * uDt * 1.2, 0.0, 1.0);

    float trail = max(prev * decayHere, carried * decayCarried);

    for (int i = 0; i < 12; i++) {
        if (i >= uCursorCount) {
            break;
        }

        vec2 pos = uCursorPoints[i];

        if (pos.x < 0.0) {
            continue;
        }

        float d = distance(vUv, pos);
        float stamp = smoothstep(uCursorRadius, 0.0, d) * uCursorStrength;
        trail = max(trail, stamp);
    }

    fragColor = vec4(trail, 0.0, 0.0, 1.0);
}
