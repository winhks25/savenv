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
      ? 'Correct! Well done.'
      : `Not quite. The correct answer is: ${answers[correct].textContent}.`;
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
