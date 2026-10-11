import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 技术笔记：碎片形态，无 TOC；stage 字段为远期"沉淀为知识库"留数据基础
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    stage: z.enum(['seedling', 'evergreen']).default('seedling'),
  }),
});

// 作品集：封面、技术栈、源码与 Demo 链接、分类
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    cover: z.string().optional(),
    tech: z.array(z.string()).default([]),
    category: z.enum(['dev', 'design', 'photo']).default('dev'),
    demoUrl: z.string().url().optional(),
    repoUrl: z.string().url().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { notes, projects };
