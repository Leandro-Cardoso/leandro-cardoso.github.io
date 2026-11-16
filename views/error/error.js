import { mountTemplate, loadJSON } from '../../js/loader.js';

export async function render(target, { type = '404', path = '' } = {}) {
  await mountTemplate(target, './views/error/error.html', './views/error/error.css');

  const errorsData = await loadJSON('./data/error.json');
  const info = errorsData[type] || errorsData['404'];

  target.querySelector('#error-badge').textContent = info.badge;
  target.querySelector('#error-code').textContent = info.code;
  target.querySelector('#error-title').textContent = info.title;
  target.querySelector('#error-description').textContent = info.description;

  const pathEl = target.querySelector('#error-path');
  if (path) {
    pathEl.textContent = `Rota solicitada: #${path}`;
  } else {
    pathEl.style.display = 'none';
  }

  const btn = target.querySelector('#error-action-btn');
  btn.textContent = info.actionLabel;
  btn.href = info.actionRoute;
}
