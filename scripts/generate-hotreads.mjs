// AI 热点解读流水线：RSS 拉取 → DeepSeek 摘要 → 写入 src/content/hotreads/
// 由 .github/workflows/hotreads.yml 每日调用；本地可用 DEEPSEEK_API_KEY=xxx node scripts/generate-hotreads.mjs 试跑
// 无第三方依赖：RSS 用正则粗提取（够用），LLM 走 OpenAI 兼容接口

import { mkdir, writeFile } from 'node:fs/promises';

const FEEDS = [
  { name: '机器之心', url: 'https://www.jiqizhixin.com/rss' },
  { name: '量子位', url: 'https://www.qbitai.com/feed' },
  { name: '阮一峰周刊', url: 'https://www.ruanyifeng.com/blog/atom.xml' },
  { name: 'HelloGitHub', url: 'https://hellogithub.com/rss' },
  { name: 'Hacker News 精选', url: 'https://hnrss.org/best?points=200' },
];

const PER_FEED = 3; // 每个源取前 N 条
const MODEL = 'deepseek-chat';
const API_BASE = 'https://api.deepseek.com';

const stripTags = (s) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, { headers: { 'User-Agent': 'SlivenNoxLab/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const items = [...xml.matchAll(/<(?:item|entry)[\s\S]*?<\/(?:item|entry)>/g)]
      .slice(0, PER_FEED)
      .map((m) => {
        const block = m[0];
        const title = stripTags(block.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? '');
        const link = stripTags(block.match(/<link[^>]*href=["']([^"']+)["']/)?.[1] ?? block.match(/<link[^>]*>([\s\S]*?)<\/link>/)?.[1] ?? '');
        const desc = stripTags(block.match(/<(?:description|summary|content)[^>]*>([\s\S]*?)<\/(?:description|summary|content)>/)?.[1] ?? '').slice(0, 400);
        return { title, link, desc, source: feed.name };
      })
      .filter((it) => it.title);
    return items;
  } catch (e) {
    console.warn(`[hotreads] ${feed.name} 拉取失败: ${e.message}`);
    return [];
  }
}

async function summarize(items) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error('缺少 DEEPSEEK_API_KEY');
  const prompt = `下面是今天的技术资讯列表（JSON）。请生成一份中文"每日技术热点解读"：
1. 用 3-5 个要点归纳今天最值得关注的趋势，每个要点 2-3 句话，说清楚"发生了什么、为什么值得注意"；
2. 结尾给一段 50 字以内的"一句话点评"；
3. 语气平实，不用营销词，不用破折号；
4. 直接输出 Markdown 正文，不要输出标题和寒暄。

${JSON.stringify(items, null, 1)}`;

  const res = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
    }),
  });
  if (!res.ok) throw new Error(`DeepSeek HTTP ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

const today = new Date();
const dateSlug = today.toISOString().slice(0, 10);

const feedResults = await Promise.all(FEEDS.map(fetchFeed));
const items = feedResults.flat();
if (items.length === 0) {
  console.warn('[hotreads] 所有源都拉取失败，跳过本次生成');
  process.exit(0);
}

console.log(`[hotreads] 共 ${items.length} 条资讯，生成摘要中...`);
const summary = await summarize(items);

const sources = [...new Set(items.map((i) => i.source))]
  .map((s) => `- ${s}`)
  .join('\n');

const frontmatter = `---
title: 每日技术热点 ${dateSlug}
description: DeepSeek 摘要：今日技术资讯要点与一句话点评。
pubDate: ${dateSlug}
tags: [热点, 摘要]
---

`;

const body = `${summary}

## 今日资讯来源

${sources}
`;

await mkdir('src/content/hotreads', { recursive: true });
await writeFile(`src/content/hotreads/${dateSlug}.md`, frontmatter + body, 'utf8');
console.log(`[hotreads] 已写入 src/content/hotreads/${dateSlug}.md`);
