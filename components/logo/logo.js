// components/logo/logo.js
import { mountTemplate } from '../../js/loader.js';

export async function render(target) {
  if (!target) return;
  await mountTemplate(target, './components/logo/logo.html', './components/logo/logo.css');
}
