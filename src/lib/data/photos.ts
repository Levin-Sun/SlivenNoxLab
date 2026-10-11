// 摄影集数据：扫描 src/assets/photos/<相册>/ 下的图片自动成册。
// 新增照片 = 把图丢进对应相册文件夹 → 重新构建，无需改代码。
// 相册中文名在 src/config/photos.ts 里登记（不登记就用文件夹名）。
import { Image } from 'astro:assets';
import { albumMeta } from '../../config/photos';

export interface Photo {
  src: Image['props']['src'];
  filename: string;
  albumSlug: string;
}

export interface Album {
  slug: string;
  title: string;
  desc?: string;
  photos: Photo[];
  cover: Photo | undefined;
}

type ImageModule = { default: Image['props']['src'] };

const files = import.meta.glob<ImageModule>('../../assets/photos/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
  eager: true,
});

function buildAlbums(): Album[] {
  const map = new Map<string, Photo[]>();
  for (const [path, mod] of Object.entries(files)) {
    // 路径形如 ../../assets/photos/<album>/<file>，相对导入路径统一规格化
    const norm = path.replace(/\\/g, '/');
    const m = norm.match(/assets\/photos\/([^/]+)\/([^/]+)$/);
    if (!m) continue;
    const [, albumSlug, filename] = m;
    const list = map.get(albumSlug) ?? [];
    list.push({ src: mod.default, filename, albumSlug });
    map.set(albumSlug, list);
  }
  return [...map.entries()]
    .map(([slug, photos]) => ({
      slug,
      title: albumMeta[slug]?.title ?? slug,
      desc: albumMeta[slug]?.desc,
      photos: photos.sort((a, b) => a.filename.localeCompare(b.filename)),
      cover: photos.slice().sort((a, b) => a.filename.localeCompare(b.filename))[0],
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export const albums: Album[] = buildAlbums();

export function getAlbum(slug: string): Album | undefined {
  return albums.find((a) => a.slug === slug);
}
