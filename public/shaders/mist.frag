precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D tex0;
uniform float time;
uniform vec2 resolution;

// --- Jednoduchý 2D noise ---
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
           (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

void main() {
    vec2 uv = vTexCoord;
    vec4 col = texture2D(tex0, uv);

    // Zjisti světlost pixelu (luminance)
    float brightness = dot(col.rgb, vec3(0.299, 0.587, 0.114));

    // Kouř se emituje jen z extrémně světlých míst
    float smokeSource = smoothstep(0.97, 1.0, brightness);

    // Pohyb a rozplývání kouře pomocí šumu a času
    float n = 0.0;
    float scale = 2.0;
    float fade = 0.0;
    for (int i = 0; i < 5; i++) {
        float t = time * (0.18 + float(i) * 0.11);
        n += noise(uv * scale + t);
        scale *= 2.0;
        fade += 0.7;
    }
    n /= fade;

    // Kouřová mlha - světlá, poloprůhledná, s animací
    float smoke = smokeSource * n;
    smoke = pow(smoke, 2.5); // rychlejší vytrácení

    // Kouřová barva (lehce namodralá)
    vec3 smokeColor = vec3(0.85, 0.87, 0.95);
    float alpha = clamp(smoke * 0.45, 0.0, 1.0);

    // Výsledná barva: pouze kouř, jinak černé pozadí
    gl_FragColor = vec4(smokeColor, alpha);
}