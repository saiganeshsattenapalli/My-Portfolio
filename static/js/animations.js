export function initAnimations() {
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements=[...document.querySelectorAll('.reveal')];
  if(preference.matches)return;
  document.documentElement.classList.add('js-motion');
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.06,rootMargin:'0px 0px -15px 0px'});
  // Short, bounded sequence adapted from the birthday site's scene reveals.
  elements.forEach(element=>{
    const siblings=[...element.parentElement.children].filter(item=>item.classList.contains('reveal'));
    element.style.setProperty('--reveal-delay',`${Math.min(siblings.indexOf(element)*140,420)}ms`);
    observer.observe(element);
  });
  preference.addEventListener('change',event=>{if(event.matches){document.documentElement.classList.remove('js-motion');elements.forEach(element=>element.classList.add('is-visible'));observer.disconnect();}});
}
