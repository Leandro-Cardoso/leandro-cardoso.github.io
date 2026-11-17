import { mountTemplate, loadJSON } from '../../js/loader.js';

export async function render(target) {
  if (!target) return;
  await mountTemplate(target, './components/expertise/expertise.html', './components/expertise/expertise.css');

  const [expertiseData, iconsData] = await Promise.all([
    loadJSON('./data/expertise.json'),
    loadJSON('./data/icons.json')
  ]);

  target.querySelector('#expertise-title').textContent = expertiseData.sectionTitle;
  target.querySelector('#expertise-subtitle').textContent = expertiseData.sectionSubtitle;

  const grid = target.querySelector('#expertise-grid');
  grid.innerHTML = '';

  expertiseData.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'expertise-card';

    const iconSvg = iconsData?.categories?.[item.icon] || '';
    const techPills = (item.technologies || []).map(techId => {
      const techObj = iconsData?.technologies?.find(t => t.id === techId);
      return techObj ? `<span class="tech-pill">${techObj.name}</span>` : '';
    }).join('');

    card.innerHTML = `
      <div class="expertise-icon">${iconSvg}</div>
      <h3 class="expertise-card-title">${item.title}</h3>
      <p class="expertise-card-desc">${item.description}</p>
      <div class="expertise-techs">${techPills}</div>
    `;

    grid.appendChild(card);
  });
}
