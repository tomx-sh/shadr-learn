precision highp float;

varying vec2 vUv;

uniform sampler2D uBgTex;   // background image to sample
uniform sampler2D uSDFTex;  // single-channel SDF (R): 1.0 inside, ~0.5 at edge
uniform float uZoom;        // max zoom amount in [0, 1). e.g. 0.3 → up to 30% zoom
uniform vec2 uCenter;      // lens center in UV coords (e.g. vec2(0.5, 0.5) on the quad)
uniform float uCurve;       // shaping exponent for the inside ramp (e.g. 0.8)

void main() {
    // Build anti-aliased mask from SDF
    float d = texture2D(uSDFTex, vUv).r;             // 1.0 deep inside, ~0.5 edge, <0.5 outside
    float w = fwidth(d);
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
    vec3 bg0 = texture2D(uBgTex, vUv).rgb;        // unmodified background
    vec3 bgZ = texture2D(uBgTex, uvZoomed).rgb;   // magnified sample (stays "behind" the logo)
    vec3 color = mix(bg0, bgZ, mask);
    gl_FragColor = vec4(color, 1.0);
    //gl_FragColor = vec4(vec3(d), 1.0);
}