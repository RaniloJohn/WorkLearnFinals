let currentStep = 0;
const steps = document.querySelectorAll('.form-step');
const indicators = document.querySelectorAll('.step');
const backBtn = document.querySelector('.btn-back');
const nextBtn = document.querySelector('.btn-next');

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle('active', i === index);
    indicators[i].classList.toggle('active', i <= index);
  });

  backBtn.style.display = index === 0 ? 'none' : 'inline-block';
  nextBtn.style.display = index < steps.length - 1 ? 'inline-block' : 'none';
}

function changeStep(direction) {
  currentStep += direction;
  currentStep = Math.max(0, Math.min(currentStep, steps.length - 1));
  showStep(currentStep);
}

document.getElementById('applicationForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Your application has been submitted!');
  this.reset();
  currentStep = 0;
  showStep(currentStep);
});

showStep(currentStep);