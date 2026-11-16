// components/mobile-header/mobile-header.js
import { mountTemplate } from '../../js/loader.js';
import { render as renderLogo } from '../logo/logo.js';

export async function render(target, { onToggle } = {}) {
  await mountTemplate(
    target,
    './components/mobile-header/mobile-header.html',
    './components/mobile-header/mobile-header.css'
  );

  // Monta o componente logo dentro do cabeçalho mobile
  const logoSlot = target.querySelector('#mobile-logo-slot');
  await renderLogo(logoSlot);

  const headerBar = target.querySelector('#mobile-header-bar');
  const toggleBtn = target.querySelector('#mobile-menu-toggle');

  toggleBtn?.addEventListener('click', () => {
    if (typeof onToggle === 'function') onToggle();
  });

  // Retorna controlador para o base.js esconder/mostrar o header conforme o estado do menu
  return {
    setHidden(hidden) {
      headerBar?.classList.toggle('is-hidden', hidden);
    }
  };
}
