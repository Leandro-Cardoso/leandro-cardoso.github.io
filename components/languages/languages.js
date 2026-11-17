import { mountTemplate, loadJSON } from '../../js/loader.js';

export async function render(target) {
  if (!target) return;
  await mountTemplate(target, './components/languages/languages.html', './components/languages/languages.css');

  const langData = await loadJSON('./data/languages.json');

  target.querySelector('#languages-section-title').textContent = langData.sectionTitle;
  target.querySelector('#languages-section-subtitle').textContent = langData.sectionSubtitle;

  const grid = target.querySelector('#languages-grid');
  grid.innerHTML = '';

  (langData.items || []).forEach(item => {
    const card = document.createElement('div');
    card.className = 'language-card';

    card.innerHTML = `
      <div class="language-card-top">
        <div class="language-flag">${item.svg || ''}</div>
        <div class="language-info">
          <h3 class="language-name">${item.name}</h3>
          <span class="language-level">${item.level}</span>
        </div>
      </div>
      ${item.proficiency ? `
        <div class="language-bar-track">
          <div class="language-bar-fill" style="width: ${item.proficiency}%"></div>
        </div>
      ` : ''}
    `;

    grid.appendChild(card);
  });
}
