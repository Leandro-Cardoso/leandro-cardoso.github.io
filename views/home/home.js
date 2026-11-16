import { mountTemplate, loadJSON } from '../../js/loader.js';

export async function render(target) {
  if (!target) return;

  await mountTemplate(target, './views/home/home.html', './views/home/home.css');

  const [homeData, iconsData] = await Promise.all([
    loadJSON('./data/home.json'),
    loadJSON('./data/icons.json')
  ]);

  const techMap = new Map(
    (iconsData.technologies || []).map(tech => [tech.id, tech])
  );
  const categoryIcons = iconsData.categories || {};

  // Preenche o Hero
  target.querySelector('#hero-name').textContent = homeData.hero.name;
  target.querySelector('#hero-subtitle').textContent = homeData.hero.subtitle;
  target.querySelector('#hero-description').textContent = homeData.hero.description;

  const btnPrimary = target.querySelector('#hero-btn-primary');
  btnPrimary.textContent = homeData.hero.primaryActionText;
  btnPrimary.href = homeData.hero.primaryActionRoute;

  const btnSecondary = target.querySelector('#hero-btn-secondary');
  btnSecondary.textContent = homeData.hero.secondaryActionText;
  btnSecondary.href = homeData.hero.secondaryActionRoute;

  // Renderiza os cards de Destaque
  const highlightsGrid = target.querySelector('#home-highlights-grid');
  highlightsGrid.innerHTML = '';

  homeData.highlights.forEach(item => {
    const card = document.createElement('div');
    card.className = 'highlight-card';

    let techPillsHTML = '';
    if (Array.isArray(item.technologies)) {
      const pills = item.technologies
        .map(techId => {
          const tech = techMap.get(techId);
          if (!tech) return '';
          return `
            <span class="highlight-tech-pill">
              ${tech.svg} ${tech.name}
            </span>
          `;
        })
        .join('');

      techPillsHTML = `<div class="highlight-tech-list">${pills}</div>`;
    }

    const highlightSvg = categoryIcons[item.icon] || categoryIcons.code || '';

    card.innerHTML = `
      <div class="highlight-icon-box">${highlightSvg}</div>
      <h3 class="highlight-title">${item.title}</h3>
      <p class="highlight-desc">${item.description}</p>
      ${techPillsHTML}
    `;
    highlightsGrid.appendChild(card);
  });

  // Renderiza a seção completa de Tecnologias
  const techGrid = target.querySelector('#home-tech-grid');
  techGrid.innerHTML = '';

  (iconsData.technologies || []).forEach(tech => {
    const techCard = document.createElement('div');
    techCard.className = 'tech-card';

    techCard.innerHTML = `
      <div class="tech-icon-box">${tech.svg}</div>
      <div class="tech-card-content">
        <h4 class="tech-card-title">${tech.name}</h4>
        <p class="tech-card-desc">${tech.description}</p>
      </div>
    `;
    techGrid.appendChild(techCard);
  });
}
