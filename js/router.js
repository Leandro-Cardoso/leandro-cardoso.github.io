// js/router.js
import { loadJSON, setAppVersion } from './loader.js';

export async function initRouter(viewSlot) {
  const config = await loadJSON('./data/config.json');
  setAppVersion(config.version);

  async function renderErrorView(type, path) {
    const errorModule = await import('../views/error/error.js');
    await errorModule.render(viewSlot, { type, path });
    document.title = `Erro ${type === '404' ? '404' : ''} | ${config.title}`;
  }

  async function handleRoute() {
    const rawHash = window.location.hash.replace(/^#/, '');
    const currentPath = rawHash || config.defaultRoute || '/';

    // 1. Notifica o menu e o mobile-header imediatamente (mantém o item clicado ativo)
    window.dispatchEvent(
      new CustomEvent('routeChanged', { detail: { path: currentPath } })
    );

    const routeConfig = config.routes[currentPath];
    viewSlot.setAttribute('data-loading', 'true');

    try {
      // 2. Se a rota não estiver registrada no config.json -> Erro 404
      if (!routeConfig) {
        await renderErrorView('404', currentPath);
        return;
      }

      // 3. Tenta carregar o módulo da view registrada
      const viewModule = await import(`../views/${routeConfig.view}/${routeConfig.view}.js`);
      await viewModule.render(viewSlot);
      document.title = routeConfig.pageTitle || config.title;
    } catch (error) {
      // 4. Se a rota existe no menu/config, mas a view ainda não foi criada -> Erro 503
      console.warn(`Módulo da view "${routeConfig?.view}" indisponível:`, error);
      await renderErrorView('500', currentPath);
    } finally {
      viewSlot.removeAttribute('data-loading');
      viewSlot.scrollTop = 0;
    }
  }

  window.addEventListener('hashchange', handleRoute);
  await handleRoute();
}
