const https = require('https');

https.get('https://unsplash.com/s/photos/drone', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+[^\s"']+/);
    if (match) {
      console.log('FOUND:', match[0]);
    } else {
      console.log('NOT FOUND');
      console.log(data.substring(0, 1000));
    }
  });
});
