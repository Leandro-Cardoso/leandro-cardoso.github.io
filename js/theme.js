const STORAGE_KEY = 'leandro-dev-theme';

export function getSavedTheme() {
  return localStorage.getItem(STORAGE_KEY) || 'system';
}

export function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === 'dark' || theme === 'light') {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  } else {
    // Modo 'system': remove o atributo para o CSS respeitar @media (prefers-color-scheme)
    root.removeAttribute('data-theme');
    localStorage.setItem(STORAGE_KEY, 'system');
  }

  window.dispatchEvent(
    new CustomEvent('themeChanged', { detail: { theme: getSavedTheme() } })
  );
}

export function initTheme() {
  applyTheme(getSavedTheme());
}
