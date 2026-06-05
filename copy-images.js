const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\KISHORE S\\.gemini\\antigravity\\brain\\b781250e-e3a1-4898-8761-e4ec611e9e36';
const dstDir = path.join(__dirname, 'public', 'images', 'category');

if (!fs.existsSync(dstDir)) fs.mkdirSync(dstDir, { recursive: true });

fs.copyFileSync(path.join(srcDir, 'drone_components_1780658340361.png'), path.join(dstDir, 'drone_components.png'));
fs.copyFileSync(path.join(srcDir, 'ai_robotics_1780658368826.png'), path.join(dstDir, 'ai_robotics.png'));
fs.copyFileSync(path.join(srcDir, 'photography_1780658398953.png'), path.join(dstDir, 'photography.png'));
fs.copyFileSync(path.join(srcDir, 'gaming_1780658437633.png'), path.join(dstDir, 'gaming.png'));
fs.copyFileSync(path.join(srcDir, 'fitness_1780658451832.png'), path.join(dstDir, 'fitness.png'));
fs.copyFileSync(path.join(srcDir, 'books_1780658469945.png'), path.join(dstDir, 'books.png'));
fs.copyFileSync(path.join(srcDir, 'home_office_1780658492039.png'), path.join(dstDir, 'home_office.png'));

console.log('Copied all images successfully.');
