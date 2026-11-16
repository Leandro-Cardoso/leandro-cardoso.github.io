import { mountTemplate } from '../../js/loader.js';
import { render as renderSidebar } from '../sidebar/sidebar.js';
import { render as renderMobileHeader } from '../mobile-header/mobile-header.js';

export async function render(target) {
  await mountTemplate(target, './components/base/base.html', './components/base/base.css');

  const mobileHeaderSlot = target.querySelector('#mobile-header-slot');
  const sidebarSlot = target.querySelector('#sidebar-slot');
  const viewSlot = target.querySelector('#view-slot');
  const overlay = target.querySelector('#sidebar-overlay');

  let mobileHeaderControl = null;

  function setMenuOpen(isOpen) {
    sidebarSlot.classList.toggle('is-open', isOpen);
    overlay.classList.toggle('is-open', isOpen);
    mobileHeaderControl?.setHidden(isOpen);
  }

  // Monta o mobile-header e a sidebar em paralelo
  [mobileHeaderControl] = await Promise.all([
    renderMobileHeader(mobileHeaderSlot, {
      onToggle: () => setMenuOpen(true)
    }),
    renderSidebar(sidebarSlot)
  ]);

  overlay?.addEventListener('click', () => setMenuOpen(false));
  window.addEventListener('routeChanged', () => setMenuOpen(false));

  return { viewSlot };
}
