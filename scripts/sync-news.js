const { parse } = require('rss-to-json');
const fs = require('fs');
const path = require('path');

const FEEDS = [
  { id: 'ign-news', url: 'https://feeds.feedburner.com/ign/news' },
  { id: 'eurogamer-news', url: 'https://www.eurogamer.net/feed/news' },
  { id: 'meups-news', url: 'https://meups.com.br/feed/' }
];

async function sync() {
  const dataDir = path.join(__dirname, '../public/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

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

  // Update status file
  fs.writeFileSync(
    path.join(dataDir, 'status.json'),
    JSON.stringify({ 
      last_sync: new Date().toISOString(), 
      status: 'online' 
    })
  );
}

sync();
