const fs = require('fs');
const b = fs.readFileSync('public/models/ferrari.glb');
const jsonLen = b.readUInt32LE(12);
const json = JSON.parse(b.slice(20, 20 + jsonLen).toString('utf8'));
for (const i of [0,1,18,11,22,36,43,50]) {
  console.log(i, JSON.stringify(json.nodes[i], null, 1).slice(0, 500));
}
console.log('scene', JSON.stringify(json.scenes));
console.log('asset', JSON.stringify(json.asset));
