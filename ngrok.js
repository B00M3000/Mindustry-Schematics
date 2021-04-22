const ngrok = require('ngrok');

ngrok.connect({
  authtoken: process.env.ngrok_token,
  proto: 'http',
  addr: process.env.PORT || 3000,
  region: process.env.ngrok_region || "us",
})
  .then(url => {
    console.log(`ngrok tunnel established, see output at ${url}`)
  })