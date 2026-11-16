import { mountTemplate, loadJSON } from '../../js/loader.js';

export async function render(target) {
  if (!target) return;

  await mountTemplate(target, './views/home/home.html', './views/home/home.css');

  // Carrega o conteúdo textual desacoplado
  const data = await loadJSON('./data/home.json');

  // Preenche o Hero
  target.querySelector('#hero-greeting').textContent = data.hero.greeting;
  target.querySelector('#hero-name').textContent = data.hero.name;
  target.querySelector('#hero-subtitle').textContent = data.hero.subtitle;
  target.querySelector('#hero-description').textContent = data.hero.description;

  const btnPrimary = target.querySelector('#hero-btn-primary');
  btnPrimary.textContent = data.hero.primaryActionText;
  btnPrimary.href = data.hero.primaryActionRoute;

  const btnSecondary = target.querySelector('#hero-btn-secondary');
  btnSecondary.textContent = data.hero.secondaryActionText;
  btnSecondary.href = data.hero.secondaryActionRoute;

  // Renderiza os cards de destaque inferiores dinamicamente
  const highlightsGrid = target.querySelector('#home-highlights-grid');
  highlightsGrid.innerHTML = '';

  data.highlights.forEach(item => {
    const card = document.createElement('div');
    card.className = 'highlight-card';
    card.innerHTML = `
      <div class="highlight-icon">${item.icon}</div>
      <h3 class="highlight-title">${item.title}</h3>
      <p class="highlight-desc">${item.description}</p>
    `;
    highlightsGrid.appendChild(card);
  });
}
