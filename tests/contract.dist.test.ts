import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { SELECTORS } from '../src/lib/contracts/dom';

/**
 * 构建产物契约测试：静态站没有运行时，dist 就是交付物——
 * 关键 data-* 契约属性缺失 = 页面交互静默失效（灯箱/聚光/RADIO 都发生过）。
 * 运行方式：npm run verify（先构建再断言）。
 */
const distReady = existsSync('dist/index.html');
const read = (p: string) => readFileSync(`dist/${p}`, 'utf-8');

describe.skipIf(!distReady)('构建产物契约（dist）', () => {
  it('主页：RADIO 卡 + 迷你条 + 品牌契约', () => {
    const html = read('index.html');
    expect(html).toContain('data-hero-deck');
    expect(html).toContain('data-hd-act="toggle"');
    expect(html).toContain('id="mini-player"');
    expect(html).toContain('NOX RADIO');
  });

  it('笔记页：分类 tabs + Pagefind 搜索 + 编辑入口', () => {
    const html = read('notes/index.html');
    expect(html).toContain(SELECTORS.noteTab);
    expect(html).toContain('pagefind-ui');
    expect(html).toContain('/admin/');
  });

  it('收藏夹：分类 tab 契约', () => {
    const html = read('favorites/index.html');
    expect(html).toContain(SELECTORS.favTab);
  });

  it('相册详情：灯箱契约（每张照片必有原图地址与索引）', () => {
    const html = read('photos/street/index.html');
    // 只统计元素上的契约属性（排除内联脚本中的选择器字符串）
    const items = html.match(/data-lightbox-item data-index/g) ?? [];
    const fulls = html.match(/data-full=/g) ?? [];
    expect(items.length).toBeGreaterThan(0);
    expect(fulls.length).toBe(items.length);
    expect(html).toContain('data-lb-next');
  });

  it('播放页：控制契约 + 环形频谱画布', () => {
    const html = read('lab/music/index.html');
    expect(html).toContain(SELECTORS.playerToggle);
    expect(html).toContain('data-ring');
  });

  it('工具台：两个自研工具入口', () => {
    const html = read('lab/index.html');
    expect(html).toContain('/lab/hotreads/');
    expect(html).toContain('/lab/music/');
  });

  it('SEO：sitemap 与 canonical', () => {
    expect(existsSync('dist/sitemap-index.xml')).toBe(true);
    const html = read('index.html');
    expect(html).toContain('rel="canonical"');
  });
});
