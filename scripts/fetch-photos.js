const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'public', 'media', 'source');
fs.mkdirSync(dir, { recursive: true });

const picks = {
  garage: 'photo-1492144534655-ae79c964c9d7',
  studio: 'photo-1580273916550-e323be2ae537',
  night: 'photo-1544636331-e26879cd4d9b',
  wash: 'photo-1601362840469-51e4d8d58785',
  spray: 'photo-1520340356584-f9917d1eea6f',
  engine: 'photo-1619642751034-765dfdf7c58e',
  red: 'photo-1583121274602-3e2820c69888',
  detail: 'photo-1552930294-6b595f4c2974',
  porsche: 'photo-1503376780353-7e6692767b70'
};

(async () => {
  for (const [key, id] of Object.entries(picks)) {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2400&q=85`;
    const res = await fetch(url);
    if (!res.ok) { console.log(key, 'FAIL', res.status); continue; }
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(dir, `${key}.jpg`), buf);
    console.log(key, buf.length);
  }
})();
