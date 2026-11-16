import { mountTemplate, loadJSON } from '../../js/loader.js';

export async function render(target) {
  if (!target) return;
  await mountTemplate(target, './components/hero/hero.html', './components/hero/hero.css');

  const hero = await loadJSON('./data/hero.json');

  target.querySelector('#hero-name').textContent = hero.name;
  target.querySelector('#hero-tagline').textContent = hero.title;
  target.querySelector('#hero-desc').textContent = hero.description;

  const primaryBtn = target.querySelector('#hero-primary-btn');
  primaryBtn.textContent = hero.primaryActionText;
  primaryBtn.href = hero.primaryActionRoute;

  const secondaryBtn = target.querySelector('#hero-secondary-btn');
  secondaryBtn.textContent = hero.secondaryActionText;
  secondaryBtn.href = hero.secondaryActionRoute;
}
