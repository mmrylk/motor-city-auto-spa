const fs = require('fs');
const path = require('path');

const out = path.join(process.cwd(), 'public', 'fonts');
fs.mkdirSync(out, { recursive: true });

const families = {
  Syne: 'Syne:wght@600;700;800',
  'Space Grotesk': 'Space+Grotesk:wght@300;400;500;600;700',
  'IBM Plex Mono': 'IBM+Plex+Mono:wght@400;500'
};

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

(async () => {
  for (const [name, query] of Object.entries(families)) {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${query}&display=swap`;
    const res = await fetch(cssUrl, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      console.log(name, 'CSS FAIL', res.status);
      continue;
    }
    const css = await res.text();
    fs.writeFileSync(path.join(out, `${name.replace(/\s+/g, '-')}.css`), css);
    const blocks = css.split('@font-face').slice(1);
    let i = 0;
    for (const block of blocks) {
      const weight = (block.match(/font-weight:\s*(\d+)/) || [])[1] || '400';
      const url = (block.match(/src:\s*url\((https:[^)]+)\)/) || [])[1];
      const unicode = /unicode-range/.test(block) ? (block.match(/unicode-range:\s*([^;]+)/) || [])[1] : '';
      // keep latin + latin-ext subsets only (last two blocks are typically those)
      if (!url || !/latin/.test(css.slice(0, css.indexOf(block)).split('@font-face').pop() || '')) {
        // still save latin by detecting range
      }
      if (unicode && !/U\+0000-00FF|U\+0100-02AF|U\+1E00-1EFF/.test(unicode)) continue;
      const fname = `${name.replace(/\s+/g, '-')}-${weight}-${i++}.woff2`;
      const bin = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!bin.ok) continue;
      const buf = Buffer.from(await bin.arrayBuffer());
      fs.writeFileSync(path.join(out, fname), buf);
      console.log(name, weight, fname, buf.length);
    }
  }
})();
