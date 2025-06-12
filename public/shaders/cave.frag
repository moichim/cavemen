#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D currentFrame;   // this.render (předchozí stav)
uniform sampler2D newFrame;       // this.prerender (nový snímek)
uniform float threshold;          // práh světlosti (0.0–1.0)
uniform float alpha;              // opacita černého překrytí (0.0–1.0)
uniform float blurAmount;         // velikost rozostření (např. 1.0/šířka)
uniform vec3 smokeColor;          // barva kouře (např. [1.0, 1.0, 1.0])
varying vec2 vTexCoord;

void main() {
    // 1. Rozostření stávajícího frame (box blur 3x3)
    vec4 blurred = vec4(0.0);
    for(int x = -1; x <= 1; x++) {
        for(int y = -1; y <= 1; y++) {
            blurred += texture2D(currentFrame, vTexCoord + vec2(x, y) * blurAmount);
        }
    }
    blurred /= 9.0;

    // 2. Překrytí černou barvou s danou opacitou
    blurred.rgb = mix(blurred.rgb, vec3(0.0), alpha);

    // 3. Přidání světlých bodů z nového snímku v dané barvě
    vec4 newPix = texture2D(newFrame, vTexCoord);
    float brightness = dot(newPix.rgb, vec3(0.299, 0.587, 0.114));
    if (brightness > threshold) {
        blurred.rgb = mix(blurred.rgb, smokeColor, (brightness - threshold) / (1.0 - threshold));
    }

    gl_FragColor = vec4(blurred.rgb, 1.0);
}