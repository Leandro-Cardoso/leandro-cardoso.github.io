import { mountTemplate, loadJSON } from '../../js/loader.js';

const AWARD_SVG = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
`;

const EXTERNAL_PDF_SVG = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
  </svg>
`;

export async function render(target) {
  if (!target) return;
  await mountTemplate(target, './components/certifications/certifications.html', './components/certifications/certifications.css');

  const [certData, techData] = await Promise.all([
    loadJSON('./data/certifications.json'),
    loadJSON('./data/technologies.json')
  ]);

  target.querySelector('#certifications-section-title').textContent = certData.sectionTitle;
  target.querySelector('#certifications-section-subtitle').textContent = certData.sectionSubtitle;

  const grid = target.querySelector('#certifications-grid');
  grid.innerHTML = '';

  (certData.items || []).forEach(item => {
    const card = document.createElement('div');
    card.className = 'cert-card';

    const metaText = item.hours ? `${item.year} • ${item.hours}` : `${item.year}`;

    // Pílulas de tecnologias buscando os SVGs no technologies.json
    const techPills = (item.technologies || []).map(techId => {
      const techObj = techData?.items?.find(t => t.icon === techId);
      if (!techObj) return '';
      return `
        <span class="cert-tech-pill">
          ${techObj.svg || ''}
          ${techObj.title}
        </span>
      `;
    }).join('');

    // Tags complementares
    const customPills = (item.customTags || []).map(tag => `
      <span class="cert-tech-pill is-custom">${tag}</span>
    `).join('');

    const allPills = techPills + customPills;

    const actionButton = item.file
      ? `<a href="${item.file}" target="_blank" rel="noopener noreferrer" class="cert-view-btn" title="Visualizar certificado em PDF">
           ${EXTERNAL_PDF_SVG}
           <span>Ver PDF</span>
         </a>`
      : '';

    card.innerHTML = `
      <div class="cert-card-top">
        <div class="cert-icon-box">${AWARD_SVG}</div>
        ${item.category ? `<span class="cert-category-tag">${item.category}</span>` : ''}
      </div>
      <div class="cert-body">
        <span class="cert-issuer">${item.issuer}</span>
        <h3 class="cert-title">${item.title}</h3>
      </div>
      ${allPills ? `<div class="cert-techs">${allPills}</div>` : ''}
      <div class="cert-footer">
        <span class="cert-meta">${metaText}</span>
        ${actionButton}
      </div>
    `;

    grid.appendChild(card);
  });
}
