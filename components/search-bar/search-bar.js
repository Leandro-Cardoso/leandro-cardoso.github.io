import { mountTemplate } from '../../js/loader.js';

export async function render(target, { onSearch } = {}) {
  if (!target) return;
  await mountTemplate(target, './components/search-bar/search-bar.html', './components/search-bar/search-bar.css');

  const input = target.querySelector('#project-search-input');
  const clearBtn = target.querySelector('#search-clear-btn');

  input.addEventListener('input', (e) => {
    const query = e.target.value;
    clearBtn.style.display = query ? 'flex' : 'none';
    if (typeof onSearch === 'function') onSearch(query);
  });

  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    if (typeof onSearch === 'function') onSearch('');
    input.focus();
  });
}
