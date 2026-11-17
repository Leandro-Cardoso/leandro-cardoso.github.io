import { mountTemplate, loadJSON } from '../../js/loader.js';

const GRADUATION_SVG = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
  </svg>
`;

export async function render(target) {
  if (!target) return;
  await mountTemplate(target, './components/education/education.html', './components/education/education.css');

  const eduData = await loadJSON('./data/education.json');

  target.querySelector('#education-section-title').textContent = eduData.sectionTitle;
  target.querySelector('#education-section-subtitle').textContent = eduData.sectionSubtitle;

  const grid = target.querySelector('#education-grid');
  grid.innerHTML = '';

  (eduData.items || []).forEach(item => {
    const card = document.createElement('div');
    card.className = `education-card ${item.inProgress ? 'is-active' : ''}`;

    const visualMedia = item.logo
      ? `<img src="${item.logo}" alt="${item.institution}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" /><span style="display:none;">${GRADUATION_SVG}</span>`
      : GRADUATION_SVG;

    card.innerHTML = `
      <div class="education-logo-box">${visualMedia}</div>
      <div class="education-body">
        <div class="education-top-row">
          <span class="education-institution">${item.institution}</span>
          <span class="education-status-badge">${item.status}</span>
        </div>
        <h3 class="education-course">${item.course}</h3>
        <span class="education-degree">${item.degree}</span>
        <span class="education-period">${item.period}</span>
      </div>
    `;

    grid.appendChild(card);
  });
}
