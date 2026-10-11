---
title: Pagefind：静态站的中文全文搜索
description: 构建时索引、分片加载、原生中文分词，个人站搜索的最优解。
pubDate: 2026-10-12
tags: [搜索, pagefind]
stage: seedling
---

本站搜索的选型记录。需求：纯静态、无后端、支持中文、零维护。

## 候选对比

- **手写 JSON 全量加载**：文章一多加载体积爆炸，否决
- **Lunr/Fuse 前端分词**：中文分词要自己接 segmentit，维护成本高
- **Pagefind**：构建时用 Rust 生成索引，按需分片，**原生支持中日韩分词**，一层 CSS 变量就能换肤

## 接入方式

```bash
npm i -D pagefind astro-pagefind
```

```mjs
// astro.config.mjs
export default defineConfig({
  integrations: [pagefind()],
});
```

集成会在构建完成后自动执行 `pagefind --site dist`。前端用官方 UI 组件，样式全走 `--pagefind-ui-*` 变量。

## 注意

Pagefind 只索引**构建产物**，所以 `astro dev` 开发模式下看到的是假数据提示，属正常现象——想看真实搜索必须 `build && preview`。
