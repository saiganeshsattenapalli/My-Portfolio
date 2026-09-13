export function initNavigation() {
  const toggle=document.querySelector('.menu-toggle');
  const menu=document.getElementById('mobile-nav');
  function close(){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');}
  toggle.addEventListener('click',()=>{const opening=menu.hidden;menu.hidden=!opening;toggle.setAttribute('aria-expanded',String(opening));toggle.setAttribute('aria-label',opening?'Close navigation':'Open navigation');});
  menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',close));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){close();toggle.focus();}});
  document.addEventListener('click',event=>{if(!menu.hidden&&!event.target.closest('.site-header'))close();});
  const desktop=window.matchMedia('(min-width: 601px)');desktop.addEventListener('change',event=>{if(event.matches)close();});
  let scheduled=false;
  const progress=document.querySelector('.reading-progress');
  const update=()=>{const range=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=`${range>0?window.scrollY/range*100:0}%`;scheduled=false;};
  window.addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});
  window.addEventListener('resize',update);update();
}
