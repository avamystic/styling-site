export async function onRequestGet() {
  const FEED_URL = 'https://avamystic.substack.com/feed';
  const CACHE_SECONDS = 3600;

  try {
    const res = await fetch(FEED_URL, {
      headers: { 'User-Agent': 'StyleWithAva/1.0' },
    });
    if (!res.ok) throw new Error(`Feed returned ${res.status}`);

    const xml = await res.text();
    const items = parseItems(xml).slice(0, 3);

    return Response.json({ items }, {
      headers: {
        'Cache-Control': `public, max-age=${CACHE_SECONDS}`,
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return Response.json({ items: [], error: err.message }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}

function getTag(block, tag) {
  const m = block.match(
    new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i')
  );
  return m ? m[1].trim() : '';
}

function stripHtml(str) {
  return str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function parseDate(str) {
  const d = new Date(str);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function parseItems(xml) {
  const items = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    const title   = getTag(block, 'title');
    const link    = getTag(block, 'link');
    const date    = parseDate(getTag(block, 'pubDate'));
    const rawDesc = stripHtml(getTag(block, 'description'));
    const excerpt = rawDesc.length > 160
      ? rawDesc.slice(0, 160).trimEnd() + '...'
      : rawDesc;
    if (title && link) items.push({ title, link, date, excerpt });
  }
  return items;
}
