// 首页区块数据（阶段二）：阶段三接入 Content Collections 后由 lib/data 接管
export interface ModuleInfo {
  name: string;
  glyph: string;
  href: string;
  desc: string;
  status: { label: string; live: boolean };
  tone: 'accent' | 'base';
}

// 首页 bento：五项五格（拷问 Q4 确认），顺序即优先级
export const modules: ModuleInfo[] = [
  {
    name: '作品集',
    glyph: '集',
    href: '/projects/',
    desc: 'Umax RAG 已就位',
    status: { label: '1 件已收录', live: true },
    tone: 'accent',
  },
  {
    name: '笔记',
    glyph: '记',
    href: '/notes/',
    desc: '日常心得 · 网页内编辑发布',
    status: { label: '阶段三上线', live: false },
    tone: 'base',
  },
  {
    name: '工具台',
    glyph: '台',
    href: '/lab/',
    desc: '效率工具与 AI 热点解读',
    status: { label: '阶段三上线', live: false },
    tone: 'base',
  },
  {
    name: '收藏夹',
    glyph: '藏',
    href: '/favorites/',
    desc: '常用网站 · skill · 片单',
    status: { label: '阶段四上线', live: false },
    tone: 'base',
  },
  {
    name: '摄影',
    glyph: '影',
    href: '/photos/',
    desc: '相册与瀑布流',
    status: { label: '素材就绪', live: true },
    tone: 'base',
  },
];

// 精选作品（1 全宽 + 2 占位半宽）
export interface Work {
  title: string;
  desc: string;
  meta?: string;
  media?: string;
  alt?: string;
  links?: Array<{ label: string; href: string; external?: boolean }>;
  placeholder?: boolean;
}

export const featuredWorks: Work[] = [
  {
    title: 'Umax RAG',
    desc: '基于 LangChain 的知识库问答系统：邮箱账号体系、后台管理与检索增强问答，支持浅色 / 深色 / 护眼三种主题。',
    meta: 'WEB · RAG · 2026',
    media: '/works/umax-rag.png',
    alt: 'Umax RAG 系统登录界面截图',
    links: [
      { label: '访问 Demo', href: 'https://umax.dpdns.org/', external: true },
      { label: '查看源码', href: 'https://github.com/Levin-Sun/Umax_LangChainRagProject', external: true },
    ],
  },
  { title: '预留作品位', desc: '这一格在等下一个作品。', placeholder: true },
  { title: '预留作品位', desc: '这一格在等下下个作品。', placeholder: true },
];

// 常用工具（收藏跳转类，JSON 配置驱动；收藏夹模块将复用同一份数据源）
export interface ToolLink {
  name: string;
  desc: string;
  host: string;
  href: string;
}

export const tools: ToolLink[] = [
  { name: 'GitHub', desc: '代码与项目托管', host: 'github.com', href: 'https://github.com/Levin-Sun' },
  { name: 'DeepSeek', desc: 'AI 热点解读的 LLM 供应商', host: 'deepseek.com', href: 'https://deepseek.com/' },
  { name: 'MDN Web Docs', desc: 'Web 标准权威参考', host: 'developer.mozilla.org', href: 'https://developer.mozilla.org/zh-CN/' },
  { name: 'Can I Use', desc: '浏览器兼容性查询', host: 'caniuse.com', href: 'https://caniuse.com/' },
  { name: 'Figma', desc: '界面与素材设计', host: 'figma.com', href: 'https://www.figma.com/' },
  { name: '阿里云', desc: '站点部署的服务器', host: 'aliyun.com', href: 'https://www.aliyun.com/' },
];

// 建设日志（站点自身动态，真实事项）
export const timeline: Array<{ date: string; text: string }> = [
  { date: '10.12', text: '阶段一：项目骨架与暗夜紫视觉基底上线' },
  { date: '10.12', text: '背景光场逆向复刻 Limited 极光，接入鼠标交互' },
  { date: '10.12', text: '阶段二：首页区块与通用组件库（本页）' },
];
