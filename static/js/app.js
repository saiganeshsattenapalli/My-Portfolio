import { initSignature } from './signature.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';

// The server embeds the exact canonical records used by Jinja and /projects.
// Keep project copy in data/projects.json; JavaScript only renders interactions.
const records = JSON.parse(document.getElementById('project-data').textContent);
const projects = Object.fromEntries(records.map(project => [project.id, project]));

function initProjects() {
  const filters=[...document.querySelectorAll('[data-filter]')];
  const cards=[...document.querySelectorAll('[data-categories]')];
  function filter(category) {
    filters.forEach(button=>{const active=button.dataset.filter===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
    let count=0;
    cards.forEach(card=>{const matches=category==='all'||card.dataset.categories.split(' ').includes(category);card.hidden=!matches;if(matches){count++;card.classList.add('is-visible');}});
    document.getElementById('filter-status').textContent=`Showing ${count} ${category==='all'?'':category.toUpperCase()+' '}projects.`;
  }
  filters.forEach(button=>button.addEventListener('click',()=>filter(button.dataset.filter)));
  // Evidence links still resolve when a previous filter hid their target.
  document.querySelectorAll('a[href$="-project"]').forEach(link=>link.addEventListener('click',()=>filter('all')));
  const revealHashTarget=()=>{const card=cards.find(card=>'#'+card.id===location.hash);if(card?.hidden)filter('all');};
  window.addEventListener('hashchange',revealHashTarget);
  const dialog=document.getElementById('project-dialog');
  const shell=document.getElementById('dialog-content');
  let opener;
  document.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{
    const project=projects[button.dataset.project];if(!project)return;
    opener=button;
    document.getElementById('dialog-title').textContent=project.name;
    document.getElementById('dialog-kicker').textContent=`${project.focus.toUpperCase()} / ${project.status.toUpperCase()}`;
    document.getElementById('dialog-summary').textContent=project.description;
    shell.replaceChildren();
    const sections = [
      ['The question', [project.question]],
      [project.kind === 'learning_collection' ? 'Practice areas' : 'Implemented in source', project.capabilities.map(item => item.text)],
      ['The approach', [project.approach]]
    ];
    if (project.architecture) {
      const { implemented, product_direction: direction } = project.architecture;
      sections.push(['Current implemented architecture', [implemented.stages.join(' → '), implemented.note]]);
      sections.push(['Product direction', direction.stages.map(stage => `${stage.name} — ${stage.status}: ${stage.scope}`)]);
    }
    sections.forEach(([title,items])=>{
      const heading=document.createElement('h3');heading.textContent=title;shell.append(heading);
      const list=document.createElement('ul');items.forEach(text=>{const item=document.createElement('li');item.textContent=text;list.append(item);});shell.append(list);
    });
    const note=document.createElement('p');note.className='dialog-note';note.textContent=project.limitations.join(' ');shell.append(note);
    document.getElementById('dialog-github').href=project.github_url;
    dialog.showModal();document.body.classList.add('modal-open');
  }));
  dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus({preventScroll:true});});
}
function initCapabilities() {
  const tabs=[...document.querySelectorAll('[role="tab"]')];
  function select(tab,focus=false){tabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!active;});if(focus)tab.focus();}
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>select(tab));
    tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();select(tabs[next],true);}});
  });
  const layout=window.matchMedia('(max-width: 600px)');
  const orientation=()=>document.querySelector('[role="tablist"]').setAttribute('aria-orientation',layout.matches?'horizontal':'vertical');
  orientation();layout.addEventListener('change',orientation);
}
initNavigation();initAnimations();initProjects();initCapabilities();initSignature();
