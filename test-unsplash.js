const https = require('https');

https.get('https://unsplash.com/napi/search/photos?query=drone&per_page=1', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(parsed.results[0].urls.regular);
    } catch (e) {
      console.error(e);
    }
  });
});
