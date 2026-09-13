import { initSignature } from './signature.js';
import { initNavigation } from './navigation.js';
import { initAnimations } from './animations.js';

const projects = {
  campus: {
    title: 'Curiora CampusOS', kicker: 'AI ENGINEERING / WORKING PROTOTYPE',
    summary: 'A campus-oriented platform exploring a shared intelligence layer. Its most developed part is Curio: a local text-and-image AI interface.',
    sections: [
      ['The question', ['How can students ask questions naturally, using text or an image, through one coherent interface?']],
      ['What I built', ['A FastAPI text and image inference endpoint connecting GPT-OSS-20B and Qwen3-VL-8B through a shared model gateway.', 'MLX and PyTorch runtime adapters with Apple Silicon, CUDA, and CPU selection, lazy loading, and model unloading before a switch.', 'Conversation IDs, input and image-size validation, temporary-file cleanup, and inference dispatched away from the request event loop.']],
      ['How I think about it', ['Separate the interface, gateway, and runtime so that a change in the model does not require rebuilding the entire experience. Work within real memory constraints.']]
    ],
    note: 'Current scope: a local AI prototype. The wider campus administration, authentication, and reporting workflows remain incomplete. Cross-device performance and production deployment are not claimed.',
    github: 'https://github.com/saiganeshsattenapalli/Curiora-CampusOS'
  },
  pay: {
    title: 'Curiora Pay', kicker: 'DATA + MACHINE LEARNING / PROTOTYPE',
    summary: 'A Python and PostgreSQL financial workflow experiment, connecting application logic, structured data, reporting, and a small classification exercise.',
    sections: [
      ['The question', ['How do transactions become useful, queryable data, and how can that data feed a simple learning experiment?']],
      ['What I built', ['Account, balance, deposit, withdrawal, internal-transfer, and transaction-history workflows.', 'SQL queries feeding pandas dataframes and locally generated CSV statements.', 'Argon2 password hashing and Fernet encryption for transaction notes.', 'A scikit-learn logistic-regression demonstration using account balance and transaction-count features.']],
      ['What it taught me', ['Keep data retrieval, business rules, and model assumptions understandable. A prediction is only as meaningful as the data and evaluation supporting it.']]
    ],
    note: 'The classifier uses eight synthetic examples with no held-out evaluation. It demonstrates an integration pattern, not validated credit-risk prediction. Payment network integrations and production banking are outside the implemented scope.',
    github: 'https://github.com/Curiora-intelligence/Curiora-Pay'
  },
  research: {
    title: 'Curiora Research', kicker: 'APPLIED AI / LOCAL VISION EXPERIMENT',
    summary: 'A place to study visual intelligence through working software, beginning with local vision-language inference.',
    sections: [
      ['The question', ['How can a local model describe what is actually visible, and acknowledge what it cannot determine?']],
      ['What I built', ['A Qwen3-VL integration using MLX behind a FastAPI image-analysis endpoint.', 'Lazy model loading and a lock to serialize inference.', 'Image-upload, camera-preview, and browser speech-input interfaces for asking visual questions.']],
      ['The approach', ['Ground answers in the image. Treat uncertainty as part of a useful answer. Explore the full interaction between model, prompt, runtime, and interface.']]
    ],
    note: 'This is an image-based experiment. Camera preview does not imply continuous video analysis. Agent and reasoning-system ideas shown elsewhere in the ecosystem are still a roadmap.',
    github: 'https://github.com/saiganeshsattenapalli/Curiora-Research'
  },
  foundations: {
    title: 'The foundations matter.', kicker: 'DATA + ML / CONTINUOUS LEARNING',
    summary: 'I am a second-year B.Tech student, building from programming fundamentals toward data analysis, machine learning, and useful AI applications.',
    sections: [
      ['Practice areas', ['Python problem solving and small asynchronous web-server experiments.', 'SQL queries, pandas transformations, NumPy, and structured data workflows.', 'Classification fundamentals through logistic-regression exercises and feature preparation.']],
      ['The learning loop', ['Start with a question. Build a small version. Inspect what works, identify what does not, and use that evidence to choose the next step.']]
    ],
    note: 'These are learning exercises and project experience. I am currently seeking my first internship or early-career opportunity.',
    github: 'https://github.com/saiganeshsattenapalli'
  }
};

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
    document.getElementById('dialog-title').textContent=project.title;
    document.getElementById('dialog-kicker').textContent=project.kicker;
    document.getElementById('dialog-summary').textContent=project.summary;
    shell.replaceChildren();
    project.sections.forEach(([title,items])=>{
      const heading=document.createElement('h3');heading.textContent=title;shell.append(heading);
      const list=document.createElement('ul');items.forEach(text=>{const item=document.createElement('li');item.textContent=text;list.append(item);});shell.append(list);
    });
    const note=document.createElement('p');note.className='dialog-note';note.textContent=project.note;shell.append(note);
    document.getElementById('dialog-github').href=project.github;
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
