/* Opening animation: a band of light on a screen mesh, pulled around by the cursor.
   Colours and the mesh pattern are measured off the reference image.

   - Strand: the band's centre line, a damped string that bends toward the cursor.
   - Light: how lit each screen cell is, one texel per cell. It rises fast and cools
     slowly, so the band leaves an afterglow that fades down the palette.
   - Mesh: draws each cell through the palette and the scanlines, at full resolution. */
(() => {
  const stage = document.querySelector('.opening');
  if (!stage) return;
  const canvas = stage.querySelector('.opening__light');
  const gl = canvas.getContext('webgl2', { alpha: false, antialias: false });
  if (!gl) return;   // the CSS background stays as a still frame

  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Two ramps from unlit to fully lit: the dark end is the page's black, and the bright end
  // comes from the reference by brightness: its least saturated colours (to amber) and its most (to vermilion).
  const MUTED = ['#120F0D', '#120F0D', '#2b1f1b', '#4f3630', '#834938', '#a05933', '#b56933', '#da7931'];
  const VIVID = ['#120F0D', '#120F0D', '#4a171f', '#962b2f', '#bb352a', '#d14526', '#da5626', '#de6a2b'];

  const NODES = 64;          // points along the strand
  const TENSION = 6000;      // how fast a bend travels along it
  const SPRING = 2.5;        // pull back to its resting curve
  const PULL = 38;           // pull toward the cursor
  const DAMP = 3.2;
  const HOLD = 3;            // seconds a tap or keyboard focus keeps the light

  const VERT = `#version 300 es
out vec2 uv;
void main() {
  vec2 p = vec2(gl_VertexID & 1, gl_VertexID >> 1) * 2.;
  uv = p;
  gl_Position = vec4(p * 2. - 1., 0., 1.);
}`;

  const LIGHT = `#version 300 es
precision highp float;
in vec2 uv;
out vec4 frag;
uniform sampler2D uLast, uStrand;
uniform float uTime, uDt, uAspect, uIntro, uCharge, uSpeed, uCool;
uniform vec2 uMouse, uMouseFrom, uMouseVel;

float hash(vec2 p) {
  vec3 q = fract(p.xyx * .1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float s = 0., a = .5;
  for (int i = 0; i < 3; i++) { s += a * noise(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + 7.3; a *= .5; }
  return s / .875;
}
vec4 strand(float y) { return texture(uStrand, vec2((y + .1) / 1.2, .5)); }
float screen(float a, float b) { return 1. - (1. - a) * (1. - b); }

void main() {
  vec2 p = vec2(uv.x, 1. - uv.y);   // stage space, y running down
  vec2 scale = vec2(uAspect, 1.);
  vec2 q = p * scale;
  float n1 = fbm(q * 1.2 + vec2(0., -uTime * .05));
  float n2 = fbm(q * 2.6 + vec2(uTime * .07, 4.));

  // Distance across the band, true even where the cursor bends it hard
  float y = p.y + (n1 - .5) * .14;
  vec4 s = strand(y);
  float slope = (strand(y + .025).r - strand(y - .025).r) / .05 * uAspect;
  float d = ((p.x - s.r) * uAspect + (n2 - .5) * .06) / sqrt(1. + slope * slope);
  float fast = s.g;

  float low = smoothstep(.2, .72, p.y);   // where the band opens into a flame

  // Amber ridge, tighter on its right side
  float w = mix(.036, .06, low) * (1. + fast * .8);
  float ridge = exp(-d * d / (w * w * (d > 0. ? .6 : 1.2)));
  // Vermilion body spreading left of the ridge, lower down
  float wide = mix(.04, .46, low) * (.65 + .7 * n2);
  float reach = max(-d + (n1 - .5) * .3 * low, 0.);
  // Its top edge falls away from the ridge, like a curtain, instead of ending level
  float rise = smoothstep(.2, .72, p.y - reach * .4 + (n1 - .5) * .28);
  float body = rise * (d < 0. ? exp(-pow(reach / wide, 1.5)) : exp(-d * d / (w * w * 2.)));
  // A soft crimson arc leaving the body toward the top left
  float ax = (d + mix(.3, 0., smoothstep(.2, .62, p.y)) + (n2 - .5) * .1) / .1;
  float arc = exp(-ax * ax) * smoothstep(.1, .4, p.y) * (1. - low * low) * (.5 + .5 * n1);
  // Dusty haze top left, wine haze lower right
  float mauve = (1. - smoothstep(0., .46, p.y)) * smoothstep(0., .2, -d) * (.6 + .4 * n1);
  float wine = smoothstep(.38, .9, p.y) * exp(-abs(d) / .55) * (.6 + .4 * n2);
  // A bed of red swooping along the bottom, with a paler streak in it
  float bedTop = .64 + .22 * p.x + (n1 - .5) * .4 + .14 * smoothstep(0., .45, d);
  float bed = smoothstep(bedTop, bedTop + .38, p.y);
  float sy = (p.y - .945 - .035 * p.x + (n1 - .5) * .2) / .028;
  float streak = exp(-sy * sy) * n2;
  // A mound of light behind the title, so black type reads wherever the band goes: high over
  // LUISE, low at the ends of BAPTISTELLA, and swelling and brightening around the band, so
  // the field answers the cursor. Above it stays black.
  float side = (p.x - .5) * 2.;
  float moundTop = .45 + .27 * side * side + (n1 - .5) * .24 + (n2 - .5) * .08 - .16 * exp(-d * d / .05);
  float glow = smoothstep(moundTop - .2, moundTop + .03, p.y) * mix(.72, 1., max(exp(-side * side * 3.), exp(-d * d / .1)));

  float h = .05;                          // black
  h = screen(h, .3 * mauve);
  h = screen(h, .24 * wine);
  h = screen(h, .4 * arc);
  h = screen(h, .66 * bed);
  h = screen(h, .72 * body);
  h = screen(h, .55 * streak);
  h = screen(h, .84 * glow);
  h = screen(h, mix(.8, .95, low) * ridge);
  h *= mix(.4, 1., smoothstep(0., .24, p.y));    // keeps the header readable

  // Vivid in the lower half; the ridge and streak stay amber wherever they go
  float sat = max(max(smoothstep(.3, .55, p.y + (n2 - .5) * .25), arc), smoothstep(.1, .5, glow));
  sat *= (1. - .8 * ridge) * (1. - .7 * streak);
  sat = max(sat, fast * .7);

  // The cursor warms what's near it; moving it fast strikes a hot stroke
  vec2 a = uMouseFrom * scale, ab = uMouse * scale - a;
  float seg = length(q - a - ab * clamp(dot(q - a, ab) / max(dot(ab, ab), 1e-6), 0., 1.));
  float near = exp(-seg * seg / .035) * uCharge;
  float stroke = exp(-seg * seg / .006) * uSpeed;
  h = screen(h, .3 * near);
  h = screen(h, .9 * stroke);
  sat = clamp(sat + near * .9 + stroke, 0., 1.);

  // On load the screen lights from the top down
  float front = uIntro * 1.35;
  h *= 1. - smoothstep(front - .3, front, p.y);

  // Afterglow: last frame nudged along, dragged by the cursor; rises fast, cools slowly
  vec2 flow = (vec2(n1, n2) - .5) * .05 + vec2(0., .012);
  flow += uMouseVel * vec2(1., -1.) * exp(-seg * seg / .06) * .25;
  vec2 last = texture(uLast, uv - flow * uDt).rg;
  float up = 1. - exp(-uDt / .08), down = 1. - exp(-uDt / uCool);
  frag = vec4(mix(last.r, h, h > last.r ? up : down),
              mix(last.g, sat, sat > last.g ? up : down * .5), 0., 1.);
}`;

  const MESH = `#version 300 es
precision highp float;
out vec4 frag;
uniform sampler2D uLight, uPalette;
uniform vec2 uCell, uCursor;    // device pixels
uniform float uCharge, uReach;

float hash(vec2 p) {
  vec3 q = fract(p.xyx * .1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

void main() {
  vec2 c = gl_FragCoord.xy / uCell, id = floor(c), f = c - id;
  vec2 l = clamp(texelFetch(uLight, ivec2(id), 0).rg, 0., 1.);
  vec3 col = texture(uPalette, vec2((l.r * 7. + .5) / 8., l.g * .5 + .25)).rgb;

  // The dark cells open up around the cursor
  vec2 toCursor = (gl_FragCoord.xy - uCursor) / uReach;
  float lens = uCharge * exp(-dot(toCursor, toCursor));

  // A green-leaning scanline between rows of dark cells
  float row = .5 - .5 * cos(6.2832 * f.y);
  vec2 o = (f - .5) / mix(.2, .34, lens);
  vec3 mesh = mix(vec3(1.05, 1.18, 1.05), vec3(1., .92, 1.02), row);
  mesh = mix(mesh, vec3(.82, .66, .74) * mix(1., .78, lens), exp(-dot(o, o)));

  col *= mesh * (.98 + .04 * hash(id));
  frag = vec4(col + (hash(gl_FragCoord.xy) - .5) / 255., 1.);
}`;

  /* ---------------------------------------------------------
     Strand: nodes run down the stage, from just above to just below it
     --------------------------------------------------------- */
  const nodeY = Float32Array.from({ length: NODES }, (_, i) => ((i + .5) / NODES) * 1.2 - .1);
  // Its resting curve, from the reference: a long arc that hooks right at the bottom
  const rest = (y, t) => .355 + .47 * y - .22 * y * y + 2 * Math.max(0, y - .72) ** 2
    + .018 * Math.sin(t * .21 + y * 2.2) + .012 * Math.sin(t * .37 - y * 5);
  const pos = nodeY.map((y) => rest(y, 0));
  const vel = new Float32Array(NODES);
  const heat = new Float32Array(NODES);
  const strandData = new Float32Array(NODES * 4);

  const stepStrand = (h, t, mx, my, pull) => {
    for (let i = 1; i < NODES - 1; i++) {
      const y = nodeY[i];
      const near = Math.exp(-(((y - my) / .36) ** 2));
      const force = TENSION * (pos[i - 1] - 2 * pos[i] + pos[i + 1])
        + SPRING * (rest(y, t) - pos[i])
        + PULL * pull * near * (mx - pos[i])
        - DAMP * vel[i];
      vel[i] += force * h;
    }
    for (let i = 1; i < NODES - 1; i++) pos[i] += vel[i] * h;
    pos[0] = pos[1];
    pos[NODES - 1] = pos[NODES - 2];
  };

  /* ---------------------------------------------------------
     WebGL setup
     --------------------------------------------------------- */
  let lightProg, meshProg, strandTex, paletteTex, fields = [];
  let floatOK = false, cols = 0, rows = 0, cellW = 0, cellH = 0, needsFit = true;

  const program = (fragSrc) => {
    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(sh));
      return sh;
    };
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fragSrc));
    gl.linkProgram(p);
    const u = {};
    const count = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < count; i++) {
      const { name } = gl.getActiveUniform(p, i);
      u[name] = gl.getUniformLocation(p, name);
    }
    return { p, u };
  };

  const texture = (filter) => {
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return tex;
  };

  const setup = () => {
    floatOK = !!(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'));
    lightProg = program(LIGHT);
    meshProg = program(MESH);

    gl.activeTexture(gl.TEXTURE1);
    strandTex = texture(gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, NODES, 1, 0, gl.RGBA, gl.FLOAT, strandData);

    const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
    const palette = new Uint8Array([...MUTED, ...VIVID].flatMap((c) => [...rgb(c), 255]));
    gl.activeTexture(gl.TEXTURE2);
    paletteTex = texture(gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 8, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, palette);
    gl.activeTexture(gl.TEXTURE0);
    fields = [];
    needsFit = true;
  };

  // The backing store matches device pixels exactly and cells are whole pixels: no moiré.
  const fit = () => {
    needsFit = false;
    const r = canvas.getBoundingClientRect();
    const dpr = devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    cellW = Math.max(Math.round(3 * dpr), Math.round(canvas.width / 240));
    cellH = Math.round(cellW * 1.39);   // the reference's cell shape
    cols = Math.ceil(canvas.width / cellW);
    rows = Math.ceil(canvas.height / cellH);
    fields.forEach((f) => { gl.deleteTexture(f.tex); gl.deleteFramebuffer(f.fbo); });
    fields = [0, 1].map(() => {
      const tex = texture(gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, floatOK ? gl.RGBA16F : gl.RGBA8, cols, rows, 0, gl.RGBA, floatOK ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE, null);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      return { tex, fbo };
    });
  };

  /* ---------------------------------------------------------
     Input: the mouse, a finger, or keyboard focus can lead the light
     --------------------------------------------------------- */
  const aim = { x: .5, y: .5 };
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let mouseInside = false, lastInput = -Infinity;

  const aimAt = (x, y) => {
    const r = canvas.getBoundingClientRect();
    aim.x = clamp((x - r.left) / r.width, -.1, 1.1);
    aim.y = clamp((y - r.top) / r.height, -.1, 1.1);
    lastInput = performance.now() / 1000;
  };
  const onPointer = (e) => {
    mouseInside = e.pointerType === 'mouse';
    aimAt(e.clientX, e.clientY);
  };

  /* ---------------------------------------------------------
     Frame
     --------------------------------------------------------- */
  const m = { x: .5, y: .5, fromX: .5, fromY: .5, vx: 0, vy: 0, speed: 0 };
  let time = 0, intro = 0, charge = 0, lastMs = 0, carry = 0, swap = 0;

  const draw = (dt) => {
    if (needsFit) fit();
    for (let i = 0; i < NODES; i++) {
      strandData[i * 4] = pos[i];
      strandData[i * 4 + 1] = heat[i];
    }
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, strandTex);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, NODES, 1, gl.RGBA, gl.FLOAT, strandData);
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, paletteTex);
    gl.activeTexture(gl.TEXTURE0);

    const last = fields[swap], next = fields[1 - swap];
    swap = 1 - swap;

    let { p, u } = lightProg;
    gl.useProgram(p);
    gl.bindFramebuffer(gl.FRAMEBUFFER, next.fbo);
    gl.viewport(0, 0, cols, rows);
    gl.bindTexture(gl.TEXTURE_2D, last.tex);
    gl.uniform1i(u.uLast, 0);
    gl.uniform1i(u.uStrand, 1);
    gl.uniform1f(u.uTime, time);
    gl.uniform1f(u.uDt, dt);
    gl.uniform1f(u.uAspect, canvas.width / canvas.height);
    gl.uniform1f(u.uIntro, intro);
    gl.uniform1f(u.uCharge, charge);
    gl.uniform1f(u.uSpeed, m.speed);
    gl.uniform1f(u.uCool, floatOK ? .55 : .15);   // 8-bit buffers can't hold a slow fade
    gl.uniform2f(u.uMouse, m.x, m.y);
    gl.uniform2f(u.uMouseFrom, m.fromX, m.fromY);
    gl.uniform2f(u.uMouseVel, m.vx, m.vy);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    ({ p, u } = meshProg);
    gl.useProgram(p);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.bindTexture(gl.TEXTURE_2D, next.tex);
    gl.uniform1i(u.uLight, 0);
    gl.uniform1i(u.uPalette, 2);
    gl.uniform2f(u.uCell, cellW, cellH);
    gl.uniform2f(u.uCursor, m.x * canvas.width, (1 - m.y) * canvas.height);
    gl.uniform1f(u.uCharge, charge);
    gl.uniform1f(u.uReach, canvas.height * .2);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const animate = (dt, now) => {
    time += dt;
    intro = Math.min(1, intro + dt / 1.5);

    // The cursor leads while it's around; otherwise the light wanders by itself
    const live = mouseInside || now - lastInput < HOLD;
    charge += ((live ? 1 : 0) - charge) * (1 - Math.exp(-dt * (live ? 5 : .7)));
    const tx = live ? aim.x : .52 + .15 * Math.sin(time * .31) + .05 * Math.sin(time * .83);
    const ty = live ? aim.y : .5 + .32 * Math.sin(time * .23 + 1);

    m.fromX = m.x;
    m.fromY = m.y;
    const ease = 1 - Math.exp(-dt * 12);
    m.x += (tx - m.x) * ease;
    m.y += (ty - m.y) * ease;
    m.vx = (m.x - m.fromX) / dt;
    m.vy = (m.y - m.fromY) / dt;
    const speed = Math.min(1, Math.hypot(m.vx * 16 / 9, m.vy) * .45 * charge);
    m.speed += (speed - m.speed) * (1 - Math.exp(-dt * 15));

    // Fixed steps keep the string stable at any frame rate
    const pull = .14 + .86 * charge;
    const STEP = 1 / 120;
    carry += dt;
    while (carry >= STEP) {
      stepStrand(STEP, time, m.x, m.y, pull);
      carry -= STEP;
    }
    const cool = 1 - Math.exp(-dt * 6);
    for (let i = 0; i < NODES; i++) heat[i] += (Math.min(1, Math.abs(vel[i]) * 1.1) - heat[i]) * cool;
  };

  let raf = 0, onScreen = true;
  const frame = (ms) => {
    raf = requestAnimationFrame(frame);
    const now = ms / 1000;
    const dt = clamp(now - lastMs, 1 / 240, .05);
    lastMs = now;
    animate(dt, now);
    draw(dt);
  };
  const start = () => { if (!raf && onScreen) { lastMs = performance.now() / 1000; raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };

  setup();

  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); });
  canvas.addEventListener('webglcontextrestored', () => { setup(); if (reduceMotion) draw(100); else start(); });

  // Reduced motion: one settled frame, redrawn only when the size changes.
  if (reduceMotion) {
    intro = 1;
    draw(100);
    new ResizeObserver(() => { needsFit = true; draw(100); }).observe(canvas);
    return;
  }

  addEventListener('pointermove', onPointer, { passive: true });
  addEventListener('pointerdown', onPointer, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { mouseInside = false; });
  addEventListener('focusin', (e) => {
    if (!e.target.matches || !e.target.matches(':focus-visible')) return;
    const r = e.target.getBoundingClientRect();
    aimAt(r.left + r.width / 2, r.top + r.height / 2);
  });

  new ResizeObserver(() => { needsFit = true; }).observe(canvas);
  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    if (onScreen) start(); else stop();
  }).observe(stage);
  start();
})();
