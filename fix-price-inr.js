const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'lib', 'sampleProducts.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The prices are like `price: 149.0,` or `price: 39.99,`
content = content.replace(/price:\s*([\d.]+),/g, (match, p1) => {
  const usd = parseFloat(p1);
  const inr = Math.round(usd * 83.5);
  return 'price: ' + inr + ',';
});

fs.writeFileSync(filePath, content);
console.log('Prices converted to INR successfully.');
