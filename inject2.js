const fs = require('fs');
const dbPath = './.data/db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const code = fs.readFileSync('./temp.html', 'utf8');

db.workshops = db.workshops.filter(w => w.title !== 'Karakter Prompt Oluşturucu'); // Remove existing if any
db.workshops.unshift({
  id: `wks_${Date.now()}`,
  title: 'Karakter Prompt Oluşturucu',
  slug: 'karakter-prompt-olusturucu',
  description: 'SientoOPS Karakter Oluşturucu - Donmuş Karakterler',
  category: 'YouTube Kanalı',
  difficulty: 'İleri',
  estimated_hours: 1,
  repo_url: '',
  code_content: code,
  code_language: 'html',
  file_attachments: [],
  tags: ['ai', 'prompt', 'karakter'],
  cover_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
  created_at: new Date().toISOString()
});
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Successfully injected 2nd Workshop into database.');
