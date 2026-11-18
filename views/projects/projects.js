import { mountTemplate, loadJSON } from '../../js/loader.js';
import { render as renderSearchBar } from '../../components/search-bar/search-bar.js';

export async function render(target) {
  if (!target) return;

  await mountTemplate(target, './views/projects/projects.html', './views/projects/projects.css');

  const [projects, iconsData, techData] = await Promise.all([
    loadJSON('./data/projects.json'),
    loadJSON('./data/icons.json'),
    loadJSON('./data/technologies.json')
  ]);

  const gearSvg = iconsData?.categories?.gear || '';

  let currentSearchQuery = '';
  let currentCategory = 'Todos';
  let showOnlyFeatured = false;

  function updateFeaturedCount() {
    const count = projects.filter(p => p.featured).length;
    target.querySelector('#featured-count').textContent = count;
  }

  function renderProjectsList() {
    const grid = target.querySelector('#projects-grid');
    const emptyState = target.querySelector('#projects-empty');
    grid.innerHTML = '';

    const filtered = projects.filter(p => {
      if (showOnlyFeatured && !p.featured) return false;
      if (currentCategory !== 'Todos' && p.category !== currentCategory) return false;

      if (currentSearchQuery) {
        const query = currentSearchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        
        // Busca tanto nos IDs/nomes das tecnologias quanto nas customTags
        const matchTech = (p.technologies || []).some(techId => {
          const techObj = techData?.items?.find(t => t.icon === techId);
          return techId.toLowerCase().includes(query) || (techObj && techObj.title.toLowerCase().includes(query));
        });
        const matchCustomTag = (p.customTags || []).some(t => t.toLowerCase().includes(query));

        if (!matchTitle && !matchDesc && !matchTech && !matchCustomTag) return false;
      }

      return true;
    });

    if (filtered.length === 0) {
      emptyState.style.display = 'block';
      return;
    } else {
      emptyState.style.display = 'none';
    }

    filtered.forEach(p => {
      const card = document.createElement('article');
      card.className = 'project-card';

      // Exibe imagem se existir; caso contrário (ou se falhar), exibe a engrenagem animada
      const mediaHTML = p.image 
        ? `<img src="${p.image}" alt="${p.title}" class="project-img" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
           <div class="project-icon-fallback" style="display: none;" title="Sistema / Código">${gearSvg}</div>`
        : `<div class="project-icon-fallback" title="Sistema / Código">${gearSvg}</div>`;

      let linksHTML = '';
      if (p.githubUrl) linksHTML += `<a href="${p.githubUrl}" target="_blank" rel="noopener" class="project-link-btn">GitHub ↗</a>`;
      if (p.liveUrl) linksHTML += `<a href="${p.liveUrl}" target="_blank" rel="noopener" class="project-link-btn">Abrir ↗</a>`;
      if (p.downloadUrl) linksHTML += `<a href="${p.downloadUrl}" target="_blank" rel="noopener" class="project-link-btn">Download ⬇</a>`;
      if (p.docsUrl) linksHTML += `<a href="${p.docsUrl}" target="_blank" rel="noopener" class="project-link-btn">Docs ↗</a>`;

      // Pílulas de tecnologias com SVG do technologies.json (fallback apenas com o nome caso a tech ainda não esteja lá, ex: "java")
      const techPillsHTML = (p.technologies || []).map(techId => {
        const techObj = techData?.items?.find(t => t.icon === techId);
        if (techObj) {
          return `
            <span class="project-tag-pill is-tech">
              ${techObj.svg || ''}
              ${techObj.title}
            </span>
          `;
        }
        const capitalized = techId.charAt(0).toUpperCase() + techId.slice(1);
        return `<span class="project-tag-pill is-tech">${capitalized}</span>`;
      }).join('');

      // Tags complementares
      const customTagsHTML = (p.customTags || []).map(t => `
        <span class="project-tag-pill">${t}</span>
      `).join('');

      const allTagsHTML = techPillsHTML + customTagsHTML;

      card.innerHTML = `
        <div class="project-media">
          ${mediaHTML}
          ${p.featured ? '<div class="project-featured-badge" title="Projeto em Destaque">★</div>' : ''}
        </div>
        <div class="project-body">
          <span class="project-category-tag">${p.category}</span>
          <h2 class="project-card-title">${p.title}</h2>
          <p class="project-card-desc">${p.description}</p>
          ${allTagsHTML ? `<div class="project-tags">${allTagsHTML}</div>` : ''}
        </div>
        <footer class="project-footer">
          ${linksHTML}
        </footer>
      `;

      grid.appendChild(card);
    });
  }

  const categories = ['Todos', ...new Set(projects.map(p => p.category))];
  const filtersContainer = target.querySelector('#category-filters');
  
  categories.forEach(cat => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `filter-chip ${cat === 'Todos' ? 'is-active' : ''}`;
    chip.textContent = cat;
    chip.addEventListener('click', () => {
      filtersContainer.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      currentCategory = cat;
      renderProjectsList();
    });
    filtersContainer.appendChild(chip);
  });

  const featuredBtn = target.querySelector('#filter-featured-btn');
  featuredBtn.addEventListener('click', () => {
    showOnlyFeatured = !showOnlyFeatured;
    featuredBtn.classList.toggle('is-active', showOnlyFeatured);
    renderProjectsList();
  });

  await renderSearchBar(target.querySelector('#search-slot'), {
    onSearch: (query) => {
      currentSearchQuery = query;
      renderProjectsList();
    }
  });

  updateFeaturedCount();
  renderProjectsList();
}
