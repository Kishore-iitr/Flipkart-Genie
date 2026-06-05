const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'lib', 'sampleProducts.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Reliable unsplash image IDs
const unsplashIds = [
  "1603732551681-2e9110e3ce94", "1508614589041-895b88991e3e", "1527977966376-1c8408f9f108",
  "1542272604-787c3835535d", "1508444845599-5c89863b1c44", "1569317002804-ab77fcf1b7a3",
  "1562774053-701939374585", "1567581935884-3349723552ca", "1553406830-ef2513450b14",
  "1581092335871-2ef0b9c3d15b", "1563208366-450005a6d1c4", "1581090464777-f3220bbe1b8b",
  "1581291518633-83b4ebd1d83e", "1618261388319-c0e77b78a679", "1621799754526-a0d52c49fad5",
  "1562813733-b31f71025d54", "1581244277943-fe4b9c8dfe6b", "1588872657578-7efd1f1555ed"
];

let i = 0;
content = content.replace(/image: "(.*?)",/g, () => {
  const id = unsplashIds[i % unsplashIds.length];
  i++;
  return `image: "https://images.unsplash.com/photo-${id}?w=600&q=80",`;
});

fs.writeFileSync(filePath, content);
console.log('Restored Unsplash URLs in sampleProducts.ts');
