import { mountTemplate } from '../../js/loader.js';
import { render as renderHero } from '../../components/hero/hero.js';
import { render as renderExpertise } from '../../components/expertise/expertise.js';

export async function render(target) {
  if (!target) return;

  await mountTemplate(target, './views/home/home.html', './views/home/home.css');

  // Renderiza todos os componentes da Home em paralelo nas posições corretas
  await Promise.all([
    renderHero(target.querySelector('#hero-slot')),
    renderExpertise(target.querySelector('#expertise-slot'))
  ]);
}
