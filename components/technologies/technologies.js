import { mountTemplate, loadJSON } from '../../js/loader.js';

export async function render(target) {
  if (!target) return;
  await mountTemplate(target, './components/technologies/technologies.html', './components/technologies/technologies.css');

  // Carrega os dados das tecnologias e o arquivo de ícones (para pegar o fallback caso necessário)
  const [techData, iconsData] = await Promise.all([
    loadJSON('./data/technologies.json'),
    loadJSON('./data/icons.json')
  ]);

  target.querySelector('#tech-section-title').textContent = techData.sectionTitle;
  target.querySelector('#tech-section-subtitle').textContent = techData.sectionSubtitle;

  const grid = target.querySelector('#tech-grid');
  grid.innerHTML = '';

  techData.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'tech-card';

    // Usa o SVG direto do item no technologies.json, ou usa o "code" do icons.json como segurança
    const iconSvg = item.svg || iconsData?.categories?.code || '';

    card.innerHTML = `
      <div class="tech-card-icon">${iconSvg}</div>
      <div class="tech-card-body">
        <h3 class="tech-card-title">${item.title}</h3>
        <p class="tech-card-desc">${item.description}</p>
      </div>
    `;

    grid.appendChild(card);
  });
}
