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
