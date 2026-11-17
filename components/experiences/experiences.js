import { mountTemplate, loadJSON } from '../../js/loader.js';

export async function render(target) {
  if (!target) return;
  await mountTemplate(target, './components/experiences/experiences.html', './components/experiences/experiences.css');

  const [expData, techData] = await Promise.all([
    loadJSON('./data/experiences.json'),
    loadJSON('./data/technologies.json')
  ]);

  target.querySelector('#experiences-section-title').textContent = expData.sectionTitle;
  target.querySelector('#experiences-section-subtitle').textContent = expData.sectionSubtitle;

  const grid = target.querySelector('#experiences-grid');
  grid.innerHTML = '';

  (expData.items || []).forEach(item => {
    const card = document.createElement('div');
    card.className = `experience-card ${item.current ? 'is-current' : ''}`;

    // Busca SVGs no technologies.json centralizado
    const techPills = (item.technologies || []).map(techId => {
      const techObj = techData?.items?.find(t => t.icon === techId);
      if (!techObj) return '';
      return `
        <span class="exp-tech-pill">
          ${techObj.svg || ''}
          ${techObj.title}
        </span>
      `;
    }).join('');

    // Renderiza tags complementares (ex: Power BI, Pandas, C#, AlterData, etc.)
    const customPills = (item.customTags || []).map(tag => `
      <span class="exp-tech-pill is-custom">${tag}</span>
    `).join('');

    const allPills = techPills + customPills;

    card.innerHTML = `
      <div class="experience-card-top">
        <div class="experience-meta-row">
          <span class="experience-period">${item.period}</span>
          <span class="experience-badge">${item.type}</span>
        </div>
        <h3 class="experience-company">${item.company}</h3>
        <p class="experience-role">${item.role}</p>
      </div>
      <p class="experience-desc">${item.description}</p>
      ${allPills ? `<div class="experience-techs">${allPills}</div>` : ''}
    `;

    grid.appendChild(card);
  });
}
