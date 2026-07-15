const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'screenshots');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));
files.sort();

const outPath = path.join(__dirname, 'src', 'ShowcaseVideo', 'images.js');
const lines = [];

for (const file of files) {
  const imgPath = path.join(dir, file);
  const buf = fs.readFileSync(imgPath);
  const b64 = buf.toString('base64');
  const name = 'img_' + file.replace(/\.png$/, '').replace(/-/g, '_');
  const dataUrl = 'data:image/png;base64,' + b64;
  lines.push('export const ' + name + ' = ');
  lines.push(JSON.stringify(dataUrl) + ';');
}

fs.writeFileSync(outPath, lines.join('\n'));
console.log('Generated images.js with ' + files.length + ' images');
