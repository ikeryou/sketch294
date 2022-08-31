uniform float rate;
uniform vec3 color;
uniform vec3 edgeColor;

varying vec2 vUv;


float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}


void main(void) {

  float d = distance(vUv, vec2(0.5, 0.5));
  float a = step(rate, d);
  if(a <= 0.01) {
    discard;
  }

  float edge = 0.97;
  gl_FragColor = vec4(mix(edgeColor * 1.2, color, step(vUv.y, edge) * step(vUv.x, edge)), a);
}
