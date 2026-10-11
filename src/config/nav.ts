// 导航配置驱动：增删模块只改这里，导航栏/页脚/移动菜单自动跟随
// URL 前缀规范见 PLAN.md（拷问 Q4 确认的站点结构）
export interface NavItem {
  label: string;
  href: string;
}

export const navItems: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '作品集', href: '/projects/' },
  { label: '工具台', href: '/lab/' },
  { label: '收藏夹', href: '/favorites/' },
  { label: '笔记', href: '/notes/' },
  { label: '摄影', href: '/photos/' },
  { label: '关于', href: '/about/' },
];
