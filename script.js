const environmentDialog = document.querySelector('.environment-dialog');
function fillGallery(container, paths, alt) {
  container.replaceChildren(...paths.split('|').map(path => {
    const image = document.createElement('img');
    image.src = path;
    image.alt = alt;
    image.loading = 'lazy';
    return image;
  }));
}
for (const card of document.querySelectorAll('.discovery-grid .image-reveal')) {
  card.addEventListener('click', () => {
    fillGallery(environmentDialog.querySelector('.dialog-gallery'), card.dataset.images, card.querySelector('.image-label').firstChild.textContent.trim());
    environmentDialog.querySelector('#environment-dialog-title').textContent = card.querySelector('.image-label').firstChild.textContent.trim();
    environmentDialog.querySelector('#environment-dialog-description').textContent = card.dataset.description;
    environmentDialog.showModal();
  });
}

environmentDialog.addEventListener('click', event => {
  if (event.target !== environmentDialog) return;
  const bounds = environmentDialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
    environmentDialog.close();
  }
});

const detailDialog = document.querySelector('#detail-dialog');
for (const card of document.querySelectorAll('.benefit-card, .protection-card')) {
  card.addEventListener('click', () => {
    const benefit = card.classList.contains('benefit-card');
    const title = benefit ? card.querySelector('h3').textContent.trim() : card.dataset.title;
    detailDialog.classList.toggle('protection-view', !benefit);
    detailDialog.classList.toggle('benefit-view', benefit);
    detailDialog.style.backgroundColor = benefit ? getComputedStyle(card).backgroundColor : '';
    console.assert(!benefit || detailDialog.style.backgroundColor !== 'rgba(0, 0, 0, 0)', 'Advantage cards need a background color');
    detailDialog.querySelector('#detail-eyebrow').textContent = benefit ? 'THE ADVANTAGES' : 'OUR PROTECTION';
    detailDialog.querySelector('#detail-title').textContent = title;
    detailDialog.querySelector('#detail-description').textContent = card.querySelector('p').textContent.trim();
    fillGallery(detailDialog.querySelector('.detail-gallery'), card.dataset.images, title);
    detailDialog.showModal();
  });
}

document.querySelector('.team-open').addEventListener('click', () => {
  document.querySelector('.team-menu').open = false;
  document.querySelector('#team-dialog').showModal();
});

const grammarOptions = [
  'A. has to / have to',
  "B. don't have to / doesn't have to",
  'C. must',
  "D. mustn't"
];
const grammarExplanations = [
  'This is a practical necessity.',
  'This action is unnecessary.',
  'This expresses strong advice.',
  'This action should be avoided.'
];
const grammarQuestions = [
  ['Humans and animals ___ breathe the oxygen provided by Earth’s atmosphere to live.', 0],
  ['Trees ___ take in carbon dioxide as part of the ecosystem described in the passage.', 0],
  ['We ___ pay for the warmth, light, and energy we receive from the sun; they are free of charge.', 1],
  ['We ___ have water for daily life, and rain is one source of it.', 0],
  ['People ___ rely on the natural environment for basic needs such as food, clothing, and shelter.', 0],
  ['Because the environment supports a balanced ecosystem, we ___ protect it.', 2],
  ['We ___ cut down trees carelessly, because doing so harms the environment.', 3],
  ['People ___ overfish, because fish populations may almost run out.', 3],
  ['To reduce environmental harm, we ___ avoid burning fossil fuels.', 2],
  ['As the world’s population grows, communities ___ meet a growing need for houses and farmland.', 0],
  ['We ___ destroy the forests that provide homes for wild animals.', 3],
  ['Because some species have disappeared and others are endangered, we ___ protect the species that remain.', 2],
  ['Farmers ___ use chemical fertilizers carelessly, because they can degrade the soil.', 3],
  ['Factories ___ keep emitting dangerous greenhouse gases without concern for their effects.', 3],
  ['Since greenhouse gases make the globe warmer, we ___ reduce harmful emissions.', 2],
  ['Because the ozone layer is getting thinner and dangerous rays are entering the atmosphere, we ___ protect it.', 2],
  ['Factories ___ dispose of chemical waste in rivers and seas.', 3],
  ['To prevent the water pollution described in the passage, factories ___ manage their chemical waste properly.', 2],
  ['Humans and animals ___ have enough clean drinking water to stay healthy.', 0],
  ['Because overfishing has nearly exhausted fish in the sea, we ___ protect fish populations.', 2],
  ['To protect food security and leave fish for people to eat in the future, we ___ stop overfishing.', 2],
  ['We ___ continue activities that destroy the beautiful environment on which we depend.', 3],
  ['If the environment stopped providing our basic needs, we ___ find another way to obtain them.', 0],
  ['Because global warming and climate change are linked in the passage to floods, storms, landslides, droughts, and wildfires, we ___ change our behaviour.', 2],
  ['To help stop global warming and climate change, we ___ reduce the number of trees we cut down.', 2],
  ['To protect the environment, we ___ use chemical fertilizers when we can avoid them.', 3],
  ['To help stop global warming, we ___ keep burning fossil fuels unnecessarily.', 3],
  ['We ___ learn the three R’s: reduce, reuse, and recycle.', 2],
  ['We ___ reduce the amount of waste we produce.', 2],
  ['To reduce waste as the passage suggests, we ___ use plastic bags unnecessarily.', 3],
  ['We ___ throw away an item after using it once if we can use it again.', 1],
  ['Before throwing away a reusable item, we ___ consider using it again.', 2],
  ['We ___ recycle old newspapers and plastic bottles to help save natural resources.', 2],
  ['We ___ waste natural resources when reducing, reusing, and recycling can help conserve them.', 3],
  ['If we care about future generations and planet Earth, we ___ take action to protect the environment before it is too late.', 2]
];
const grammarContainer = document.querySelector('#grammar-questions');
grammarQuestions.forEach(([prompt, correct], index) => {
  const question = document.createElement('fieldset');
  question.className = 'question';
  question.dataset.correct = correct;
  question.dataset.explanation = grammarExplanations[correct];
  const legend = document.createElement('legend');
  legend.textContent = `${index + 1}. ${prompt}`;
  const answers = document.createElement('div');
  answers.className = 'answers';
  answers.replaceChildren(...grammarOptions.map(option => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = option;
    return button;
  }));
  const feedback = document.createElement('p');
  feedback.className = 'feedback';
  feedback.setAttribute('role', 'status');
  question.append(legend, answers, feedback);
  grammarContainer.append(question);
});

for (const question of document.querySelectorAll('.question')) {
  const answers = [...question.querySelectorAll('button')];
  const correct = Number(question.dataset.correct);
  console.assert(
    Number.isInteger(correct) && correct >= 0 && correct < answers.length,
    'Each quiz question needs one valid correct answer'
  );
  answers.forEach((answer, index) => answer.addEventListener('click', () => {
    if (question.dataset.answered) return;
    question.dataset.answered = 'true';
    answers.forEach((button, buttonIndex) => {
      button.disabled = true;
      if (buttonIndex === correct) button.classList.add('correct');
      if (buttonIndex === index && index !== correct) button.classList.add('incorrect');
    });
    question.querySelector('.feedback').textContent = index === correct
      ? `Correct! ${question.dataset.explanation}`
      : `The correct answer is ${answers[correct].textContent}. ${question.dataset.explanation}`;
  }));
}

document.querySelector('.quiz-reset').addEventListener('click', () => {
  for (const question of document.querySelectorAll('.question')) {
    delete question.dataset.answered;
    for (const answer of question.querySelectorAll('button')) {
      answer.disabled = false;
      answer.classList.remove('correct', 'incorrect');
    }
    question.querySelector('.feedback').textContent = '';
  }
});

const logos = [...document.querySelectorAll('.brand img')];
const logoTargets = [...document.querySelectorAll('.hero-logos span')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let logoOrigins;
let logoFrame;

function positionLogos() {
  const progress = reducedMotion.matches ? 1 : Math.min(1, scrollY / 220);
  logos.forEach((logo, index) => {
    const target = logoTargets[index].getBoundingClientRect();
    const origin = logoOrigins[index];
    const x = (target.left - origin.left) * (1 - progress);
    const y = (target.top - origin.top) * (1 - progress);
    const scale = 1 + 0.3 * (1 - progress);
    logo.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  });
}

function measureLogos() {
  logos.forEach(logo => logo.style.transform = '');
  logoOrigins = logos.map(logo => logo.getBoundingClientRect());
  positionLogos();
}

addEventListener('scroll', () => {
  if (logoFrame) return;
  logoFrame = requestAnimationFrame(() => {
    positionLogos();
    logoFrame = null;
  });
}, { passive: true });
addEventListener('resize', measureLogos);
reducedMotion.addEventListener('change', measureLogos);
measureLogos();

const nav = document.querySelector('.site-header nav');
const navLinks = [...nav.querySelectorAll('a[href^="#"]')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
const indicator = document.createElement('span');
indicator.className = 'nav-indicator';
indicator.setAttribute('aria-hidden', 'true');
nav.prepend(indicator);

function selectNav(link, force = false) {
  const current = nav.querySelector('[aria-current="location"]');
  if (current === link && !force) return;
  current?.removeAttribute('aria-current');
  link.setAttribute('aria-current', 'location');
  indicator.style.width = `${link.offsetWidth}px`;
  indicator.style.height = `${link.offsetHeight}px`;
  indicator.style.transform = `translate(${link.offsetLeft}px, ${link.offsetTop}px)`;
}

function syncNav() {
  const threshold = document.querySelector('.site-header').offsetHeight + 48;
  const index = sections.findLastIndex(section => section.getBoundingClientRect().top <= threshold);
  selectNav(navLinks[Math.max(0, index)], true);
}

let navFrame;
addEventListener('scroll', () => {
  if (navFrame) return;
  navFrame = requestAnimationFrame(() => {
    syncNav();
    navFrame = null;
  });
}, { passive: true });
addEventListener('resize', () => {
  indicator.style.transition = 'none';
  syncNav();
  requestAnimationFrame(() => indicator.style.removeProperty('transition'));
});
navLinks.forEach(link => link.addEventListener('click', () => selectNav(link)));
indicator.style.transition = 'none';
syncNav();
requestAnimationFrame(() => indicator.style.removeProperty('transition'));
