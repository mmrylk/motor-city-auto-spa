const fs = require('fs');
const b = fs.readFileSync('public/models/ferrari.glb');
const jsonLen = b.readUInt32LE(12);
const json = JSON.parse(b.slice(20, 20 + jsonLen).toString('utf8'));
console.log('nodes:', json.nodes.map((n, i) => `${i}:${n.name}${n.mesh !== undefined ? ' mesh=' + n.mesh : ''}`).join('\n'));
console.log('\nmeshes:', json.meshes.map((m, i) => `${i}:${m.name} primitives=${m.primitives.length} mat=${m.primitives.map(p => p.material).join(',')}`).join('\n'));
console.log('\nmaterials:', json.materials.map((m, i) => `${i}:${m.name} pbr=${JSON.stringify(m.pbrMetallicRoughness)} alpha=${m.alphaMode} double=${m.doubleSided}`).join('\n'));
console.log('\naccessors with POSITION:');
for (const m of json.meshes) for (const p of m.primitives) {
  const a = json.accessors[p.attributes.POSITION];
  console.log(m.name, a.min, a.max);
}
