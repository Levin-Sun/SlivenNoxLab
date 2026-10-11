// 工具台数据：自研工具 + 收藏跳转（收藏跳转来自 favorites 数据源，单一事实）
import { favoriteCategories } from './favorites';

export interface LabTool {
  name: string;
  desc: string;
  host?: string;
  href: string;
  group: '自研工具' | '收藏跳转';
}

export const ownTools: LabTool[] = [
  {
    name: 'AI 热点解读',
    desc: '每日定时抓取技术资讯，LLM 生成中文摘要',
    href: '/lab/hotreads/',
    group: '自研工具',
  },
  {
    name: '音乐播放器',
    desc: 'Web Audio 频谱可视化，列表循环播放',
    href: '/lab/music/',
    group: '自研工具',
  },
];

export const linkTools: LabTool[] = favoriteCategories
  .find((c) => c.key === 'website')!
  .items.map((item) => ({
    name: item.name,
    desc: item.desc,
    host: item.host,
    href: item.href,
    group: '收藏跳转' as const,
  }));
