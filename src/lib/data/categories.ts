/**
 * 笔记分类合并 —— 纯函数（登记表 ∪ 笔记中自由填写的新分类）。
 * 登记表来自 src/data/note-categories.json（后台可编辑）；
 * 笔记正文里写新分类名即自动并入，无需先登记。
 */
export interface NoteCategory {
  key: string;
  label: string;
  order: number;
}

/** 合并去重排序：登记表优先，笔记中出现的新分类追加其后 */
export function mergeNoteCategories(
  registered: NoteCategory[],
  seenInNotes: string[],
): NoteCategory[] {
  const known = new Set(registered.map((c) => c.key));
  const extras: NoteCategory[] = [];
  for (const cat of seenInNotes) {
    const key = cat.trim();
    if (!key || known.has(key)) continue;
    known.add(key);
    extras.push({ key, label: key, order: 98 });
  }
  return [...registered, ...extras].sort(
    (a, b) => a.order - b.order || a.label.localeCompare(b.label),
  );
}
