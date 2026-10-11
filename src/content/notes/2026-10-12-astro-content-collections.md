---
title: Astro Content Collections 入门与三层解耦
description: 内容即类型：glob loader 加 zod schema，把"写错字段"从线上事故变成构建报错。
pubDate: 2026-10-12
tags: [astro, 类型安全]
stage: seedling
---

这个站的内容层用的是 Astro 的 Content Collections，核心收益一句话：**Markdown 的前置元信息有了编译期类型校验**。

## 定义集合

`src/content.config.ts` 里用 glob loader 指向内容目录，schema 用 zod 描述：

```ts
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    stage: z.enum(['seedling', 'evergreen']).default('seedling'),
  }),
});
```

`z.coerce.date()` 很关键——YAML 里写的 `2026-10-12` 是字符串，coerce 顺手续了类型转换。

## 踩过的坑

- Astro 5 之后 `getEntryBySlug` 废弃，统一走 `entry.id` + `render(entry)`，网上的老教程会误导。
- 内容目录必须放在 `src/content/`（或 loader 里显式声明的 base），放错位置 loader 静默匹配 0 个文件，不报错——第一次就栽在这里。

## 与三层解耦的关系

页面组件禁止直接 `import { getCollection }`，统一走 `src/lib/data/`。这样阶段五换数据源（SQLite / API）时页面零改动，代价只是给 lib 加一层 ESLint `no-restricted-imports` 规则。
