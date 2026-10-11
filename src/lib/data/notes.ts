// 数据访问层：笔记。页面组件只允许从这里取数（PLAN.md 二.4 纪律）。
import { getCollection, render, type CollectionEntry } from 'astro:content';

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
