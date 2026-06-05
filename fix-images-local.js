const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'lib', 'sampleProducts.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all image URLs based on the category of the item.
// In sampleProducts.ts, objects look like:
// {
//   id: "...",
//   title: "...",
//   price: ...,
//   rating: ...,
//   reviews: ...,
//   image: "...",
//   category: "Drone Components",
//   ...
// }

// We need to parse the array or do regex carefully.
// A simpler way: evaluate the TS file? No, it's TS.
// Let's use regex to find blocks and replace the image URL based on the category inside that block.

let newContent = content.replace(/{[^}]+category:\s*"([^"]+)"[^}]+}/g, (match, category) => {
  let imageName = 'gaming.png'; // default
  
  if (category === 'Drone Components') imageName = 'drone_components.png';
  else if (category === 'AI & Robotics') imageName = 'ai_robotics.png';
  else if (category === 'Photography') imageName = 'photography.png';
  else if (category === 'Gaming') imageName = 'gaming.png';
  else if (category === 'Fitness') imageName = 'fitness.png';
  else if (category === 'Books') imageName = 'books.png';
  else if (category === 'Home Office') imageName = 'home_office.png';
  
  return match.replace(/image:\s*"[^"]+"/, 'image: "/images/category/' + imageName + '"');
});

fs.writeFileSync(filePath, newContent);
console.log('Replaced all images with local category images in sampleProducts.ts');
