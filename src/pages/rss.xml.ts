import rss from '@astrojs/rss';
import { listNotes } from '../lib/data/notes';
import { site } from '../config/site';

export async function GET(context) {
  const notes = await listNotes();
  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: notes.map((n) => ({
      title: n.data.title,
      description: n.data.description ?? '',
      pubDate: n.data.pubDate,
      link: `/notes/${n.id}/`,
      categories: n.data.tags,
    })),
    customData: '<language>zh-cn</language>',
  });
}
