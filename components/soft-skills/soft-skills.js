import { mountTemplate, loadJSON } from '../../js/loader.js';

export async function render(target) {
  if (!target) return;
  await mountTemplate(target, './components/soft-skills/soft-skills.html', './components/soft-skills/soft-skills.css');

  const [softSkillsData, iconsData] = await Promise.all([
    loadJSON('./data/soft-skills.json'),
    loadJSON('./data/icons.json')
  ]);

  const titleEl = target.querySelector('#soft-skills-section-title');
  const descEl = target.querySelector('#soft-skills-section-desc');
  if (titleEl) titleEl.textContent = softSkillsData.sectionTitle;
  if (descEl) descEl.textContent = softSkillsData.sectionSubtitle;

  const skillsGrid = target.querySelector('#soft-skills-grid');
  skillsGrid.innerHTML = '';

  (softSkillsData.items || []).forEach(skill => {
    const card = document.createElement('div');
    card.className = 'soft-skill-card';

    const iconSvg = skill.svg || iconsData?.categories?.code || '';

    card.innerHTML = `
      <div class="soft-skill-header-row">
        <div class="soft-skill-icon">${iconSvg}</div>
        <span class="soft-skill-tag">${skill.category}</span>
      </div>
      <h3 class="soft-skill-title">${skill.title}</h3>
      <p class="soft-skill-desc">${skill.description}</p>
    `;

    skillsGrid.appendChild(card);
  });
}
