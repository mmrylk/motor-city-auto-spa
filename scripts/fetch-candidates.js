const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'public', 'media', 'candidates');
fs.mkdirSync(dir, { recursive: true });

const ids = {
  a: 'photo-1503376780353-7e6692767b70',
  b: 'photo-1544636331-e26879cd4d9b',
  c: 'photo-1555215695-3004980ad54e',
  d: 'photo-1583121274602-3e2820c69888',
  e: 'photo-1601362840469-51e4d8d58785',
  f: 'photo-1607860108855-64acf2078ed9',
  g: 'photo-1618843479313-40f8afb4b4d8',
  h: 'photo-1619642751034-765dfdf7c58e',
  i: 'photo-1520340356584-f9917d1eea6f',
  j: 'photo-1492144534655-ae79c964c9d7',
  k: 'photo-1502877338535-766e1452684a',
  l: 'photo-1542362567-b07e54358753',
  m: 'photo-1552519507-da3b142c6e3d',
  n: 'photo-1580273916550-e323be2ae537',
  o: 'photo-1592198084033-aade902d1aae',
  p: 'photo-1605515298946-d062f2e9da53',
  q: 'photo-1552930294-6b595f4c2974',
  r: 'photo-1486262715619-67b85e0b08d3',
  s: 'photo-1493238792000-8113da705763',
  t: 'photo-1511919884226-fd3cad34687c'
};

(async () => {
  for (const [key, id] of Object.entries(ids)) {
    const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;
    try {
      const r = await fetch(url);
      if (!r.ok) { console.log(key, 'FAIL', r.status); continue; }
      const b = Buffer.from(await r.arrayBuffer());
      fs.writeFileSync(path.join(dir, `${key}.jpg`), b);
      console.log(key, id, b.length);
    } catch (e) { console.log(key, 'ERR', e.message); }
  }
})();
