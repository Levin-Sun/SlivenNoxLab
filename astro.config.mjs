// @ts-check
import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';

// 站点域名在阶段四上线时生效；本地开发不受影响
export default defineConfig({
  site: 'https://umax.dpdns.org',
  integrations: [pagefind()],
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
    },
  },
});
