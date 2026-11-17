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
