import { mountTemplate, loadJSON } from '../../js/loader.js';

export async function render(target) {
  if (!target) return;

  await mountTemplate(target, './components/menu/menu.html', './components/menu/menu.css');
  const items = await loadJSON('./data/menu.json');

  const list = target.querySelector('#nav-menu-list');

  items.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="${item.href}" class="nav-menu-link" data-route="${item.route}">
        <span>${item.label}</span>
        <span class="nav-menu-indicator" aria-hidden="true"></span>
      </a>
    `;
    list.appendChild(li);
  });

  function updateActiveLink(activePath) {
    const links = list.querySelectorAll('.nav-menu-link');
    links.forEach((link) => {
      const isMatch = link.getAttribute('data-route') === activePath;
      link.classList.toggle('is-active', isMatch);
      if (isMatch) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  // Define o estado inicial baseado na URL atual
  const initialPath = window.location.hash.replace(/^#/, '') || '/';
  updateActiveLink(initialPath);

  // Atualiza sempre que o router mudar de rota
  window.addEventListener('routeChanged', (event) => {
    updateActiveLink(event.detail.path);
  });
}
