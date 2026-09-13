export function initAnimations() {
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const elements=[...document.querySelectorAll('.reveal')];
  if(preference.matches)return;
  document.documentElement.classList.add('js-motion');
  const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});},{threshold:.06,rootMargin:'0px 0px -15px 0px'});
  elements.forEach(element=>observer.observe(element));
  preference.addEventListener('change',event=>{if(event.matches){document.documentElement.classList.remove('js-motion');elements.forEach(element=>element.classList.add('is-visible'));observer.disconnect();}});
}
