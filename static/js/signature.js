/* One CSS glass signature. JavaScript only reacts to input and visibility. */
export function initSignature() {
  const stage = document.getElementById('curioraSignature');
  const toggle = document.getElementById('motion-toggle');
  if (!stage || !toggle) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  let userPaused = false;
  let visible = true;
  let frame = 0;
  let point = { x: 0, y: 0 };
  const reset = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    ['--tilt-x', '--tilt-y', '--pointer-x', '--pointer-y', '--mouse-x', '--mouse-y'].forEach(name => stage.style.removeProperty(name));
  };
  const update = () => {
    const paused = userPaused || preference.matches;
    stage.dataset.motion = paused || !visible || document.hidden ? 'paused' : 'running';
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', preference.matches ? 'Animation disabled by reduced motion preference' : paused ? 'Play animation' : 'Pause animation');
    toggle.disabled = preference.matches;
    toggle.firstElementChild.textContent = paused ? '▶' : 'Ⅱ';
    if (stage.dataset.motion === 'paused') reset();
  };
  toggle.addEventListener('click', () => { userPaused = !userPaused; update(); });
  stage.addEventListener('pointermove', event => {
    if (!finePointer.matches || stage.dataset.motion !== 'running') return;
    const bounds = stage.getBoundingClientRect();
    point = { x: (event.clientX - bounds.left) / bounds.width - .5, y: (event.clientY - bounds.top) / bounds.height - .5 };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      stage.style.setProperty('--mouse-x', `${(point.x + .5) * 100}%`);
      stage.style.setProperty('--mouse-y', `${(point.y + .5) * 100}%`);
      stage.style.setProperty('--tilt-x', `${-point.y * 8}deg`);
      stage.style.setProperty('--tilt-y', `${point.x * 12}deg`);
      stage.style.setProperty('--pointer-x', `${point.x * 8}px`);
      stage.style.setProperty('--pointer-y', `${point.y * 6}px`);
      frame = 0;
    });
  });
  stage.addEventListener('pointerleave', reset);
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }, { threshold: .05 }).observe(stage);
  document.addEventListener('visibilitychange', update);
  preference.addEventListener('change', update);
  finePointer.addEventListener('change', reset);
  update();
}
