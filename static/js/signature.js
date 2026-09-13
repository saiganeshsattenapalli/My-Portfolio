/* Curiora's glass core and 12s / 16s breathing ellipses, extended into a
   locally rendered 3D orbital sculpture. No graphics libraries or network calls. */
export function initSignature() {
  const stage = document.getElementById('curioraSignature');
  const canvas = document.getElementById('signature-canvas');
  const glass = stage?.querySelector('.signature-glass');
  const toggle = document.getElementById('motion-toggle');
  if (!stage || !canvas || !glass || !toggle) return;
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  let paused = preference.matches;
  let visible = true;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;
  let cursorX = 0, cursorY = 0, smoothX = 0, smoothY = 0;
  let gl;
  try { gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' }); } catch (_) { /* CSS signature remains visible. */ }
  let program, positionLocation, colorLocation, matrixLocation, pointSizeLocation;
  let meshes = [];
  let ready = false;
  const shader = (type, source) => {
    const result = gl.createShader(type);
    gl.shaderSource(result, source); gl.compileShader(result);
    if (!gl.getShaderParameter(result, gl.COMPILE_STATUS)) { gl.deleteShader(result); throw new Error('Signature shader unavailable'); }
    return result;
  };
  function buildScene() {
    if (!gl) return;
    try {
      const vertex = shader(gl.VERTEX_SHADER, `attribute vec3 aPosition; attribute vec4 aColor; uniform mat4 uMatrix; uniform float uPointSize; varying vec4 vColor; void main(){gl_Position=uMatrix*vec4(aPosition,1.0);gl_PointSize=uPointSize;vColor=aColor;}`);
      const fragment = shader(gl.FRAGMENT_SHADER, `precision mediump float; varying vec4 vColor; void main(){gl_FragColor=vColor;}`);
      program = gl.createProgram(); gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Signature program unavailable');
      gl.deleteShader(vertex); gl.deleteShader(fragment);
      positionLocation = gl.getAttribLocation(program, 'aPosition'); colorLocation = gl.getAttribLocation(program, 'aColor'); matrixLocation = gl.getUniformLocation(program, 'uMatrix'); pointSizeLocation = gl.getUniformLocation(program, 'uPointSize');
      const add = (positions, colors, group, mode) => {
        const position = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, position); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        const color = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, color); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        meshes.push({ position, color, count: positions.length / 3, group, mode });
      };
      // Two families of elliptical filaments retain the original crossing orbits.
      for (let group = 0; group < 2; group++) {
        for (let band = 0; band < 17; band++) {
          const points = [], colors = [];
          for (let i = 0; i <= 320; i++) {
            const theta = i / 320 * Math.PI * 2;
            const offset = (band - 8) * .017;
            const radius = 1.65 + offset;
            const x = Math.cos(theta) * radius;
            const y = Math.sin(theta) * (group === 0 ? .67 : .95) * (1 + offset * .28);
            const z = Math.sin(theta * 2 + band * .04) * .08 + offset * .55;
            points.push(x, y, z);
            const shine = .5 + .5 * Math.sin(theta + group * 2.1);
            const edge = 1 - Math.abs(band - 8) / 12;
            colors.push(.49 + shine * .3, .66 + shine * .27, .52 + shine * .17, (.10 + shine * .32) * edge);
          }
          add(points, colors, group, gl.LINE_STRIP);
        }
      }
      // A quiet field of deterministic stars and brighter orbit nodes.
      const points = [], colors = [];
      for (let i = 0; i < 74; i++) {
        const theta = i * 2.399963;
        const radius = .65 + Math.sqrt((i + 1) / 74) * 1.8;
        points.push(Math.cos(theta) * radius, Math.sin(theta) * radius * .72, Math.sin(i * 1.3) * .7);
        colors.push(.63, .8, .63, .1 + (i % 5) * .065);
      }
      add(points, colors, 2, gl.POINTS);
      for (let group = 0; group < 2; group++) {
        const points = [], colors = [];
        [0.55, 2.6, 4.5].forEach(theta => { points.push(Math.cos(theta) * 1.65, Math.sin(theta) * (group === 0 ? .67 : .95), Math.sin(theta * 2) * .08); colors.push(.8, .96, .72, .85); });
        add(points, colors, group, gl.POINTS);
      }
      gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE); gl.disable(gl.DEPTH_TEST);
      ready = true; stage.classList.add('webgl-ready');
    } catch (_) { ready = false; canvas.style.display = 'none'; }
  }
  // Column-major rotation and perspective projection.
  function multiply(a, b) {
    const output = new Float32Array(16);
    for (let col = 0; col < 4; col++)for (let row = 0; row < 4; row++)for (let k = 0; k < 4; k++)output[col * 4 + row] += a[k * 4 + row] * b[col * 4 + k];
    return output;
  }
  function matrix(group, time) {
    const phase = group === 0 ? time * Math.PI * 2 / 12 : time * Math.PI * 2 / 16;
    const x = (group === 0 ? .72 : -.58) + smoothY * .11 + Math.sin(phase) * .05;
    const y = (group === 0 ? -.20 : .32) + smoothX * .15;
    const z = (group === 0 ? -.28 : .40) + Math.sin(phase) * .065;
    const cx = Math.cos(x), sx = Math.sin(x), cy = Math.cos(y), sy = Math.sin(y), cz = Math.cos(z), sz = Math.sin(z);
    const rx = [1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1];
    const ry = [cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1];
    const rz = [cz, sz, 0, 0, -sz, cz, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    const aspect = canvas.width / canvas.height;
    const f = 2.10, near = .1, far = 100;
    const perspective = [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, 2 * far * near / (near - far), 0];
    const zoom = stage.clientWidth < 500 ? 1.03 : 1;
    const breathe = group === 2 ? 1 : 1 + Math.sin(phase) * .018;
    const translation = [zoom * breathe, 0, 0, 0, 0, zoom * breathe, 0, 0, 0, 0, 1, 0, 0, .025, -4.15, 1];
    return multiply(perspective, multiply(translation, multiply(rz, multiply(ry, rx))));
  }
  function draw() {
    if (!ready || gl.isContextLost()) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.7);
    const width = Math.round(stage.clientWidth * ratio), height = Math.round(stage.clientHeight * ratio);
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; gl.viewport(0, 0, width, height); }
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.useProgram(program);
    const matrices = [matrix(0, elapsed), matrix(1, elapsed), matrix(2, elapsed * .2)];
    meshes.forEach(mesh => {
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.position); gl.enableVertexAttribArray(positionLocation); gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, mesh.color); gl.enableVertexAttribArray(colorLocation); gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);
      gl.uniformMatrix4fv(matrixLocation, false, matrices[mesh.group]); gl.uniform1f(pointSizeLocation, mesh.group === 2 ? ratio : 2.6 * ratio);
      gl.drawArrays(mesh.mode, 0, mesh.count);
    });
  }
  function animate(time) {
    frame = 0;
    if (paused || !visible || document.hidden) return;
    // ~30 fps is enough for this deliberate, slow motion.
    if (time - lastTime >= 30) { elapsed += Math.min((time - lastTime) / 1000, .05); lastTime = time; smoothX += (cursorX - smoothX) * .06; smoothY += (cursorY - smoothY) * .06; draw(); }
    frame = requestAnimationFrame(animate);
  }
  function sync() {
    document.documentElement.classList.toggle('motion-paused', paused);
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
    toggle.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
    if (frame) cancelAnimationFrame(frame); frame = 0;
    if (!paused && visible && !document.hidden) { lastTime = performance.now(); frame = requestAnimationFrame(animate); } else { draw(); }
  }
  function resetTilt() { cursorX = 0; cursorY = 0; glass.style.removeProperty('transform'); glass.style.setProperty('--mouse-x', '25%'); glass.style.setProperty('--mouse-y', '10%'); }
  stage.addEventListener('pointermove', event => {
    if (paused || !finePointer.matches || event.pointerType === 'touch') return;
    const bounds = stage.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width, y = (event.clientY - bounds.top) / bounds.height;
    cursorX = (x - .5) * 2; cursorY = (y - .5) * 2;
    glass.style.setProperty('--mouse-x', `${x * 100}%`); glass.style.setProperty('--mouse-y', `${y * 100}%`);
    glass.style.transform = `perspective(700px) rotateX(${10 - cursorY * 10}deg) rotateY(${-20 + cursorX * 12}deg) rotateZ(-9deg) translateZ(8px)`;
  });
  stage.addEventListener('pointerleave', resetTilt);
  toggle.addEventListener('click', () => { paused = !paused; if (paused) resetTilt(); sync(); });
  preference.addEventListener('change', event => { paused = event.matches; resetTilt(); sync(); });
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: .02 }).observe(stage);
  new ResizeObserver(() => draw()).observe(stage);
  canvas.addEventListener('webglcontextlost', event => { event.preventDefault(); ready = false; stage.classList.remove('webgl-ready'); if (frame) cancelAnimationFrame(frame); });
  canvas.addEventListener('webglcontextrestored', () => { meshes = []; buildScene(); sync(); });
  buildScene(); draw(); sync();
}
