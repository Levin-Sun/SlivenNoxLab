// 数据访问层：AI 热点解读。
import { getCollection, render, type CollectionEntry } from 'astro:content';

export type HotRead = CollectionEntry<'hotreads'>;

export async function listHotReads(): Promise<HotRead[]> {
  const items = await getCollection('hotreads');
  return items.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function renderHotRead(item: HotRead) {
  return render(item);
}
