// 收藏夹数据：来自 src/data/favorites.json（Decap 后台"收藏夹"集合可增删改查）。
// 工具台"收藏跳转"与收藏夹模块共用这一份（单一事实源）。
import favoritesJson from '../../data/favorites.json';

export interface FavoriteItem {
  name: string;
  desc: string;
  host?: string;
  href: string;
  icon?: string;
  cover?: string;
}

export interface FavoriteCategory {
  key: string;
  label: string;
  items: FavoriteItem[];
}

export const favoriteCategories: FavoriteCategory[] = favoritesJson.categories;

// 自动图标：未自定义图标时按域名抓取站点 favicon（加载失败回退字母印章，见组件）
export function autoIcon(item: FavoriteItem): string | undefined {
  if (item.icon) return item.icon;
  if (item.host) return `https://favicon.im/${item.host}?larger=true`;
  return undefined;
}
