// 数据访问层：笔记。页面组件只允许从这里取数（PLAN.md 二.4 纪律）。
import { getCollection, render, type CollectionEntry } from 'astro:content';
import noteCategoriesJson from '../../data/note-categories.json';

export type Note = CollectionEntry<'notes'>;

export async function listNotes(): Promise<Note[]> {
  const notes = await getCollection('notes');
  return notes.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getNote(id: string): Promise<Note | undefined> {
  const notes = await getCollection('notes');
  return notes.find((n) => n.id === id);
}

export async function renderNote(note: Note) {
  return render(note);
}

export async function listNoteTags(): Promise<string[]> {
  const notes = await listNotes();
  return [...new Set(notes.flatMap((n) => n.data.tags))].sort();
}

export interface NoteCategory {
  key: string;
  label: string;
  order: number;
}

/**
 * 笔记分类：note-categories.json（后台"笔记分类"集合维护）为登记表，
 * 笔记正文里自由填写的新分类自动并入（后台没登记也生效）。
 */
export async function listNoteCategories(): Promise<NoteCategory[]> {
  const notes = await listNotes();
  const registered: NoteCategory[] = noteCategoriesJson.categories.map((c) => ({
    key: c.key,
    label: c.label,
    order: c.order ?? 99,
  }));
  const known = new Set(registered.map((c) => c.key));
  const extras: NoteCategory[] = [];
  for (const note of notes) {
    const cat = note.data.category?.trim();
    if (cat && !known.has(cat)) {
      known.add(cat);
      extras.push({ key: cat, label: cat, order: 98 });
    }
  }
  return [...registered, ...extras].sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
}
