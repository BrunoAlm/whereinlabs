const { parse } = require('rss-to-json');
const fs = require('fs');
const path = require('path');

const FEEDS = [
  { id: 'ign-news', url: 'https://feeds.feedburner.com/ign/news' },
  { id: 'eurogamer-news', url: 'https://www.eurogamer.net/feed/news' },
  { id: 'meups-news', url: 'https://meups.com.br/feed/' }
];

const STEAM_APP_ID = '440'; // Team Fortress 2 (example)

async function sync() {
  const dataDir = path.join(__dirname, '../public/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Sync RSS Feeds
  for (const feed of FEEDS) {
    try {
      console.log(`Syncing ${feed.id}...`);
      const rss = await parse(feed.url);
      fs.writeFileSync(
        path.join(dataDir, `${feed.id}.json`),
        JSON.stringify(rss, null, 2)
      );
      console.log(`✓ ${feed.id} updated.`);
    } catch (error) {
      console.error(`✗ Error syncing ${feed.id}:`, error.message);
    }
  }

  // Sync Steam News (Bypassing CORS)
  try {
    console.log(`Syncing Steam News...`);
    const steamUrl = `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${STEAM_APP_ID}&count=10`;
    const response = await fetch(steamUrl);
    const steamData = await response.json();
    fs.writeFileSync(
      path.join(dataDir, `steam-news.json`),
      JSON.stringify(steamData, null, 2)
    );
    console.log(`✓ Steam News updated.`);
  } catch (error) {
    console.error(`✗ Error syncing Steam:`, error.message);
  }

  // Aggregated RSS Feed for Google News
  let aggregatedItems = [];

  // Update status file
  fs.writeFileSync(
    path.join(dataDir, 'status.json'),
    JSON.stringify({ 
      last_sync: new Date().toISOString(), 
      status: 'online' 
    })
  );

  // Collect samples for aggregated feed
  for (const feed of FEEDS) {
    try {
      const filePath = path.join(dataDir, `${feed.id}.json`);
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (data.items) {
           aggregatedItems = [...aggregatedItems, ...data.items.slice(0, 10).map(item => ({
             ...item,
             source: feed.id.split('-')[0].toUpperCase()
           }))];
        }
      }
    } catch (e) {}
  }

  // Generate XML Feed
  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
 <title>WhereinLabs Global Gaming News</title>
 <link>https://us.whereingames.com/</link>
 <description>O melhor conteúdo de games agregado em tempo real.</description>
 <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
 <language>pt-br</language>
 ${aggregatedItems.sort((a,b) => new Date(b.published || b.date) - new Date(a.published || a.date)).slice(0, 30).map(item => `
 <item>
  <title><![CDATA[[${item.source}] ${item.title}]]></title>
  <link>${item.link}</link>
  <guid isPermaLink="false">${item.id || item.link}</guid>
  <pubDate>${new Date(item.published || item.date || Date.now()).toUTCString()}</pubDate>
  <description><![CDATA[${item.description || item.summary || ''}]]></description>
 </item>`).join('')}
</channel>
</rss>`;

  fs.writeFileSync(path.join(dataDir, 'feed.xml'), rssXml);
  console.log('✓ Google News RSS Feed generated.');
}

sync();
