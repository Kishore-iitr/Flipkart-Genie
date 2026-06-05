const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'lib', 'sampleProducts.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find each product block and replace the image line
// We will look for title: "Something", ... image: "..."
let updated = content;

const blocks = content.split('id: "');
for (let i = 1; i < blocks.length; i++) {
  const block = blocks[i];
  const titleMatch = block.match(/title: "(.*?)",/);
  if (titleMatch) {
    const title = titleMatch[1];
    const encodedTitle = encodeURIComponent(title);
    const newImage = `https://placehold.co/600x400/1e293b/ffffff?text=${encodedTitle}`;
    
    // Replace the image line inside this specific block
    blocks[i] = block.replace(/image: ".*?",/, `image: "${newImage}",`);
  }
}

updated = blocks[0] + 'id: "' + blocks.slice(1).join('id: "');

fs.writeFileSync(filePath, updated);
console.log('Successfully updated image URLs in sampleProducts.ts');
