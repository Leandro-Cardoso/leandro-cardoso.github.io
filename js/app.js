import { initTheme } from './theme.js';
import { render as renderBase } from '../components/base/base.js';
import { initRouter } from './router.js';

async function bootstrap() {
  initTheme();

  const appRoot = document.getElementById('app');
  const { viewSlot } = await renderBase(appRoot);
  await initRouter(viewSlot);
}

document.addEventListener('DOMContentLoaded', bootstrap);
