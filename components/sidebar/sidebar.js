import { mountTemplate } from '../../js/loader.js';
import { render as renderLogo } from '../logo/logo.js';
import { render as renderMenu } from '../menu/menu.js';
import { render as renderThemeSwitcher } from '../theme-switcher/theme-switcher.js';

export async function render(target) {
  await mountTemplate(
    target,
    './components/sidebar/sidebar.html',
    './components/sidebar/sidebar.css'
  );

  await Promise.all([
    renderLogo(target.querySelector('#logo-slot')),
    renderMenu(target.querySelector('#menu-slot')),
    renderThemeSwitcher(target.querySelector('#theme-switcher-slot'))
  ]);
}
