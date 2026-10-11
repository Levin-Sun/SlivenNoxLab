// @ts-check
import { defineConfig } from 'astro/config';
import pagefind from 'astro-pagefind';
import sitemap from '@astrojs/sitemap';

// 站点域名在阶段四上线时生效；本地开发不受影响
export default defineConfig({
  site: 'https://umax.dpdns.org',
  integrations: [pagefind(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'one-dark-pro',
    },
  },
});
