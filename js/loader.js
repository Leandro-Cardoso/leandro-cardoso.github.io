const loadedStyles = new Set();
let appVersion = '2.0.0';

export function setAppVersion(version) {
  if (version) appVersion = version;
}

function withVersion(path) {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}v=${appVersion}`;
}

export function loadCSS(href) {
  if (loadedStyles.has(href)) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = withVersion(href);
  document.head.appendChild(link);
  loadedStyles.add(href);
}

export async function loadHTML(path) {
  const res = await fetch(withVersion(path));
  if (!res.ok) throw new Error(`Erro ao carregar HTML: ${path} (${res.status})`);
  return await res.text();
}

export async function loadJSON(path) {
  const res = await fetch(withVersion(path));
  if (!res.ok) throw new Error(`Erro ao carregar JSON: ${path} (${res.status})`);
  return await res.json();
}

export async function loadTXT(path) {
  const res = await fetch(withVersion(path));
  if (!res.ok) throw new Error(`Erro ao carregar TXT: ${path} (${res.status})`);
  return await res.text();
}

/**
 * Helper para montar um módulo HTML + CSS dentro de um container alvo
 */
export async function mountTemplate(target, htmlPath, cssPath = null) {
  if (cssPath) loadCSS(cssPath);
  const html = await loadHTML(htmlPath);
  target.innerHTML = html;
}
