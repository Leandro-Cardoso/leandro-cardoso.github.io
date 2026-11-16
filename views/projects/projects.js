import { mountTemplate, loadJSON } from '../../js/loader.js';
import { render as renderSearchBar } from '../../components/search-bar/search-bar.js';

export async function render(target) {
  if (!target) return;

  await mountTemplate(target, './views/projects/projects.html', './views/projects/projects.css');

  const [projects, iconsData] = await Promise.all([
    loadJSON('./data/projects.json'),
    loadJSON('./data/icons.json')
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
        const matchTag = p.tags.some(t => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchTag) return false;
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

      const mediaHTML = p.image 
        ? `<img src="${p.image}" alt="${p.title}" class="project-img" loading="lazy" />`
        : `<div class="project-icon-fallback" title="Sistema / Código">${gearSvg}</div>`;

      let linksHTML = '';
      if (p.githubUrl) linksHTML += `<a href="${p.githubUrl}" target="_blank" rel="noopener" class="project-link-btn">GitHub ↗</a>`;
      if (p.liveUrl) linksHTML += `<a href="${p.liveUrl}" target="_blank" rel="noopener" class="project-link-btn">Demo Web ↗</a>`;
      if (p.downloadUrl) linksHTML += `<a href="${p.downloadUrl}" target="_blank" rel="noopener" class="project-link-btn">Download ⬇</a>`;
      if (p.docsUrl) linksHTML += `<a href="${p.docsUrl}" target="_blank" rel="noopener" class="project-link-btn">Docs 📖</a>`;

      const tagsHTML = p.tags.map(t => `<span class="project-tag-pill">${t}</span>`).join('');

      card.innerHTML = `
        <div class="project-media">
          ${mediaHTML}
          ${p.featured ? '<div class="project-featured-badge" title="Projeto em Destaque">★</div>' : ''}
        </div>
        <div class="project-body">
          <span class="project-category-tag">${p.category}</span>
          <h2 class="project-card-title">${p.title}</h2>
          <p class="project-card-desc">${p.description}</p>
          <div class="project-tags">${tagsHTML}</div>
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
