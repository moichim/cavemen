precision mediump float;
varying vec2 vTexCoord;
uniform sampler2D tex0;
uniform float time;

void main() {
  vec2 uv = vTexCoord;
  // Jednoduché vlnění pro efekt kouře
  uv.y += 0.02 * sin(uv.x * 20.0 + time * 0.5);
  uv.x += 0.02 * cos(uv.y * 20.0 + time * 0.5);
  vec4 col = texture2D(tex0, uv);

  // Jemné rozmazání (smoke-like)
  for (float i = -2.0; i <= 2.0; i++) {
    for (float j = -2.0; j <= 2.0; j++) {
      col += texture2D(tex0, uv + vec2(i, j) * 0.002) * 0.04;
    }
  }
  col /= 1.4;
  gl_FragColor = col;
}