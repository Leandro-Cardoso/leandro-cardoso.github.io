import { mountTemplate, loadJSON } from '../../js/loader.js';

const DEFAULT_PRINT_SVG = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
`;

export async function render(target, options = {}) {
  if (!target) return;

  const [, iconsData] = await Promise.all([
    mountTemplate(
      target,
      './components/print-button/print-button.html',
      './components/print-button/print-button.css'
    ),
    loadJSON('./data/icons.json').catch(() => ({}))
  ]);

  const iconSlot = target.querySelector('[data-icon-slot="print"]');
  const customSvg = iconsData?.actions?.print || iconsData?.print;
  if (iconSlot) {
    iconSlot.innerHTML = customSvg || DEFAULT_PRINT_SVG;
  }

  const labelEl = target.querySelector('#print-btn-label');
  if (labelEl && options.label) {
    labelEl.textContent = options.label;
  }

  const btn = target.querySelector('#trigger-print-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      window.print();
    });
  }
}
