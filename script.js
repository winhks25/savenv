for (const question of document.querySelectorAll('.question')) {
  const answers = [...question.querySelectorAll('button')];
  const correct = Number(question.dataset.correct);
  console.assert(Number.isInteger(correct) && correct >= 0 && correct < answers.length, 'Each quiz question needs one valid correct answer');
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
