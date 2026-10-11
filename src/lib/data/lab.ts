// 工具台数据：收藏跳转类工具 + 自研工具入口（配置驱动，收藏夹模块复用）
export interface LabTool {
  name: string;
  desc: string;
  host: string;
  href: string;
  group: '自研工具' | '收藏跳转';
}

export const labTools: LabTool[] = [
  {
    name: 'AI 热点解读',
    desc: '每日定时抓取技术资讯，LLM 生成中文摘要',
    host: '本站自研',
    href: '/lab/hotreads/',
    group: '自研工具',
  },
  { name: 'GitHub', desc: '代码与项目托管', host: 'github.com', href: 'https://github.com/Levin-Sun', group: '收藏跳转' },
  { name: 'DeepSeek', desc: 'AI 热点解读的 LLM 供应商', host: 'deepseek.com', href: 'https://deepseek.com/', group: '收藏跳转' },
  { name: 'MDN Web Docs', desc: 'Web 标准权威参考', host: 'developer.mozilla.org', href: 'https://developer.mozilla.org/zh-CN/', group: '收藏跳转' },
  { name: 'Can I Use', desc: '浏览器兼容性查询', host: 'caniuse.com', href: 'https://caniuse.com/', group: '收藏跳转' },
  { name: 'Figma', desc: '界面与素材设计', host: 'figma.com', href: 'https://www.figma.com/', group: '收藏跳转' },
  { name: '阿里云', desc: '站点部署的服务器', host: 'aliyun.com', href: 'https://www.aliyun.com/', group: '收藏跳转' },
];
