// 收藏夹数据源：工具台"收藏跳转"与收藏夹模块共用这一份（拷问 Q-B 确认的合并设计）。
// 分类配置驱动：新增类别 = 加一个对象；新增条目 = 数组加一行。
export interface FavoriteItem {
  name: string;
  desc: string;
  host?: string;
  href: string;
}

export interface FavoriteCategory {
  key: string;
  label: string;
  items: FavoriteItem[];
}

export const favoriteCategories: FavoriteCategory[] = [
  {
    key: 'website',
    label: '网站',
    items: [
      { name: 'GitHub', desc: '代码与项目托管', host: 'github.com', href: 'https://github.com/Levin-Sun' },
      { name: 'DeepSeek', desc: 'AI 热点解读的 LLM 供应商', host: 'deepseek.com', href: 'https://deepseek.com/' },
      { name: 'MDN Web Docs', desc: 'Web 标准权威参考', host: 'developer.mozilla.org', href: 'https://developer.mozilla.org/zh-CN/' },
      { name: 'Can I Use', desc: '浏览器兼容性查询', host: 'caniuse.com', href: 'https://caniuse.com/' },
      { name: 'Figma', desc: '界面与素材设计', host: 'figma.com', href: 'https://www.figma.com/' },
      { name: '阿里云', desc: '站点部署的服务器', host: 'aliyun.com', href: 'https://www.aliyun.com/' },
    ],
  },
  {
    key: 'skill',
    label: 'skill',
    items: [
      { name: 'impeccable', desc: '设计总监工作流，本站视觉基底就是它审的', href: 'https://github.com/pbakaus/impeccable' },
      { name: 'taste-skill', desc: '反 AI 味前端规范，60 项交付前检查', href: 'https://github.com/Leonxlnx/taste-skill' },
      { name: 'Pagefind', desc: '静态站中文全文搜索，本站在用', host: 'pagefind.app', href: 'https://pagefind.app/' },
      { name: 'Astro', desc: '内容站框架，Content Layers 好用', host: 'astro.build', href: 'https://astro.build/' },
    ],
  },
  {
    key: 'movie',
    label: '片单',
    items: [],
  },
];
