// views/home/home.js
import { mountTemplate, loadJSON, loadTXT } from '../../js/loader.js';

export async function render(target) {
  // 1. Injeta o esqueleto HTML e registra o CSS específico da view
  await mountTemplate(target, './views/home/home.html', './views/home/home.css');

  // 2. Busca os dados estruturados (JSON) e o texto corrido (TXT) em paralelo
  const [data, bioText] = await Promise.all([
    loadJSON('./data/home.json'),
    loadTXT('./data/textos/home-bio.txt')
  ]);

  // 3. Preenche os elementos do Hero
  target.querySelector('#home-badge').textContent = data.badge;
  target.querySelector('#home-greeting').textContent = data.greeting;
  target.querySelector('#home-name').textContent = data.name;
  target.querySelector('#home-role').textContent = data.role;

  // Converte parágrafos separados por linha em branco no TXT em tags <p>
  const bioContainer = target.querySelector('#home-bio');
  bioText
    .trim()
    .split(/\n\s*\n/)
    .forEach((paragraph) => {
      const p = document.createElement('p');
      p.textContent = paragraph.trim();
      bioContainer.appendChild(p);
    });

  // 4. Configura os botões de ação
  const ctaPrimary = target.querySelector('#home-cta-primary');
  ctaPrimary.textContent = data.ctaPrimary.label;
  ctaPrimary.href = data.ctaPrimary.route;

  const ctaSecondary = target.querySelector('#home-cta-secondary');
  ctaSecondary.textContent = data.ctaSecondary.label;
  ctaSecondary.href = data.ctaSecondary.route;

  // 5. Renderiza os cards de destaque
  const highlightsContainer = target.querySelector('#home-highlights');
  data.highlights.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'highlight-card';
    card.setAttribute('data-accent', item.accent || 'yellow');
    card.innerHTML = `
      <span class="highlight-label">${item.label}</span>
      <strong class="highlight-value">${item.value}</strong>
    `;
    highlightsContainer.appendChild(card);
  });
}
