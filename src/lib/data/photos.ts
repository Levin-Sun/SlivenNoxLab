// 摄影集数据：相册定义来自 src/data/albums.json（Decap 后台可编辑），
// 照片扫描 src/assets/photos/<相册slug>/ 文件夹自动收录。
// 创建新相册：后台"相册"集合新建（或直接改 albums.json）→ 建同名文件夹丢图 → 重新构建。
import { Image } from 'astro:assets';
import albumsJson from '../../data/albums.json';

export interface Photo {
  src: Image['props']['src'];
  filename: string;
  albumSlug: string;
}

export interface Album {
  slug: string;
  title: string;
  category: string;
  desc?: string;
  order: number;
  photos: Photo[];
  coverSrc: Image['props']['src'] | null;
  coverFallback: string;
}

type ImageModule = { default: Image['props']['src'] };

const files = import.meta.glob<ImageModule>('../../assets/photos/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
});

const photoMap = new Map<string, Photo[]>();
for (const [path, mod] of Object.entries(files)) {
  const norm = path.replace(/\\/g, '/');
  const m = norm.match(/assets\/photos\/([^/]+)\/([^/]+)$/);
  if (!m) continue;
  const [, albumSlug, filename] = m;
  const list = photoMap.get(albumSlug) ?? [];
  list.push({ src: mod.default, filename, albumSlug });
  photoMap.set(albumSlug, list);
}

interface AlbumDef {
  slug: string;
  title: string;
  category: string;
  desc?: string;
  order?: number;
}

const defs = (albumsJson.albums as AlbumDef[]).slice().sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

export const albums: Album[] = defs.map((def) => {
  const photos = (photoMap.get(def.slug) ?? []).sort((a, b) => a.filename.localeCompare(b.filename));
  return {
    slug: def.slug,
    title: def.title,
    category: def.category,
    desc: def.desc,
    order: def.order ?? 99,
    photos,
    coverSrc: photos[0]?.src ?? null,
    // 空相册的占位封面（按 slug 稳定取图，观感统一）
    coverFallback: `https://picsum.photos/seed/nox-album-${def.slug}/900/640`,
  };
});

export const photoCategories: Array<{ key: string; label: string }> = [
  { key: 'all', label: '全部' },
  ...[...new Set(albums.map((a) => a.category))].map((c) => ({ key: c, label: c })),
];

export function getAlbum(slug: string): Album | undefined {
  return albums.find((a) => a.slug === slug);
}
