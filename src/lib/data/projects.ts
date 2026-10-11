// 数据访问层：作品集。
import { getCollection, render, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export async function listProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  return projects.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getProject(id: string): Promise<Project | undefined> {
  const projects = await getCollection('projects');
  return projects.find((p) => p.id === id);
}

export async function renderProject(project: Project) {
  return render(project);
}

export const projectCategories = [
  { key: 'all', label: '全部' },
  { key: 'dev', label: '开发' },
  { key: 'design', label: '设计' },
  { key: 'photo', label: '摄影' },
] as const;
