const fs = require('fs');
const dbPath = './.data/db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const code = fs.readFileSync('./temp.html', 'utf8');

db.workshops = db.workshops.filter(w => w.title !== 'TheÇapacı YT Studio V3 - AI Ses Çeviri'); // Remove existing if any
db.workshops.unshift({
  id: `wks_${Date.now()}`,
  title: 'TheÇapacı YT Studio V3 - AI Ses Çeviri',
  slug: 'thecapaci-yt-studio-v3-ai-ses-ceviri',
  description: 'Metinlerinizi sese dönüştürün.',
  category: 'YouTube Kanalı',
  difficulty: 'Orta',
  estimated_hours: 1,
  repo_url: '',
  code_content: code,
  code_language: 'html',
  file_attachments: [],
  tags: ['ai', 'ses', 'tts'],
  cover_image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
  created_at: new Date().toISOString()
});
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Successfully injected 3rd Workshop into database.');
