import { mountTemplate, loadJSON } from '../../js/loader.js';
import { getSavedTheme, applyTheme } from '../../js/theme.js';

export async function render(target) {
  if (!target) return;

  const [, iconsData] = await Promise.all([
    mountTemplate(
      target,
      './components/theme-switcher/theme-switcher.html',
      './components/theme-switcher/theme-switcher.css'
    ),
    loadJSON('./data/icons.json')
  ]);

  const themeIcons = iconsData?.theme || {};
  target.querySelectorAll('[data-icon-slot]').forEach((slot) => {
    const key = slot.getAttribute('data-icon-slot');
    if (themeIcons[key]) {
      slot.innerHTML = themeIcons[key];
    }
  });

  const buttons = target.querySelectorAll('.theme-btn');

  function syncActiveState(currentTheme) {
    buttons.forEach((btn) => {
      const isMatch = btn.getAttribute('data-theme-value') === currentTheme;
      btn.classList.toggle('is-active', isMatch);
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selected = btn.getAttribute('data-theme-value');
      applyTheme(selected);
    });
  });

  // Estado inicial e escuta global
  syncActiveState(getSavedTheme());
  window.addEventListener('themeChanged', (e) => syncActiveState(e.detail.theme));
}
