import { describe, it, expect } from 'vitest';
import { mergeNoteCategories } from '../src/lib/data/categories';

describe('mergeNoteCategories（笔记分类合并契约）', () => {
  const registered = [
    { key: 'tech', label: '技术', order: 1 },
    { key: 'daily', label: '日常', order: 2 },
    { key: 'thought', label: '感悟', order: 3 },
  ];

  it('无新分类时返回登记表（按 order 排序）', () => {
    expect(mergeNoteCategories(registered, [])).toEqual(registered);
  });

  it('笔记中出现的新分类自动并入（后台未登记也生效——自由填写契约）', () => {
    const result = mergeNoteCategories(registered, ['tech', '随想']);
    expect(result.some((c) => c.key === '随想')).toBe(true);
    expect(result.filter((c) => c.key === 'tech')).toHaveLength(1);
  });

  it('去重：同一新分类出现多次只收录一次', () => {
    const result = mergeNoteCategories(registered, ['随想', '随想']);
    expect(result.filter((c) => c.key === '随想')).toHaveLength(1);
  });

  it('空白分类名被忽略', () => {
    const result = mergeNoteCategories(registered, ['  ', '']);
    expect(result).toHaveLength(3);
  });

  it('排序稳定：登记表按 order，新分类追加其后', () => {
    const result = mergeNoteCategories(registered, ['随想']);
    expect(result.map((c) => c.label)).toEqual(['技术', '日常', '感悟', '随想']);
  });
});
