precision highp float;

varying vec2 vUv;

uniform sampler2D uBgTex;   // background image to sample
uniform sampler2D uSDFTex;  // single-channel SDF (R): 1.0 inside, ~0.5 at edge
uniform float uZoom;        // max zoom amount in [0, 1). e.g. 0.3 → up to 30% zoom
uniform vec2 uCenter;      // lens center in UV coords (e.g. vec2(0.5, 0.5) on the quad)
uniform float uCurve;       // shaping exponent for the inside ramp (e.g. 0.8)
uniform float uTime;
// 4-color colormap endpoints (0.0, ~0.33, ~0.66, 1.0)
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;

float stripeValue(vec2 uv, float freq, float t) {
    // Smooth periodic stripes in [0,1] using a cosine wave
    // 0.0 → 1.0 → 0.0 fade across each period; sign of t controls direction
    float x = uv.y * freq + t;
    return 0.5 + 0.5 * cos(6.28318530718 * x); // 2*pi = 6.283185...
}

// Piecewise-linear 4-stop colormap over t∈[0,1]
vec3 colormap4(float t, vec3 c0, vec3 c1, vec3 c2, vec3 c3) {
    t = clamp(t, 0.0, 1.0);
    float seg = t * 3.0; // three segments: [0,1), [1,2), [2,3]
    if(seg < 1.0) {
        return mix(c0, c1, seg);
    } else if(seg < 2.0) {
        return mix(c1, c2, seg - 1.0);
    } else {
        return mix(c2, c3, seg - 2.0);
    }
}

void main() {
    // Build anti-aliased mask from SDF
    float d = texture2D(uSDFTex, vUv).r;             // 1.0 deep inside, ~0.5 edge, <0.5 outside
    float w = fwidth(d) + 0.02;
    float mask = smoothstep(0.5 - w, 0.5 + w, d);    // 0 outside → 1 inside

    // 0 at edge → 1 at deep interior
    // This remap does not depend on generator maxDistance.
    float inside01 = clamp((d - 0.5) * 2.0, 0.0, 1.0);

    // Optional smoother ramp like a magnifying lens profile.
    // Using a half-sine gives gentle falloff from center to edge.
    float lensProfile = sin(inside01 * 1.57079632679);
    lensProfile = pow(lensProfile, uCurve); // smaller → bulgier magnifier

    // Centered zoom mapping (keeps sampling inside the logo)
    // Move sample point toward the chosen center; 0 movement at edge, max at center.
    // newUv = center + (uv - center) * (1 - uZoom * lensProfile)
    vec2 delta = vUv - uCenter;
    float scale = 1.0 - (uZoom * lensProfile);
    vec2 uvZoomed = uCenter + delta * scale;

    // Sample background; composite with mask
    //vec3 bg0 = texture2D(uBgTex, vUv).rgb;        // unmodified background
    //vec3 bgZ = texture2D(uBgTex, uvZoomed).rgb;   // magnified sample (stays "behind" the logo)

    // Colormap applied everywhere: background as shade 0.0, inside uses stripe shade
    vec3 bg0 = colormap4(0.0, uC0, uC1, uC2, uC3);
    float shadeZ = stripeValue(uvZoomed, 2.0, uTime * 0.1);
    vec3 bgZ = colormap4(shadeZ, uC0, uC1, uC2, uC3);

    // Composite
    vec3 color = mix(bg0, bgZ, mask);
    gl_FragColor = vec4(color, 1.0);
    //gl_FragColor = vec4(vec3(d), 1.0);
    //gl_FragColor = vec4(vec3(stripeValue(vUv, 20.0, uTime * 1.0)), 1.0);
}