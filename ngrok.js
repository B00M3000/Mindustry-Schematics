'use strict';
const ngrok = require('ngrok');
const fetch = require('node-fetch')
const path = require('path')

require('dotenv').config({
  path: path.join(__dirname, ".env")
})

ngrok.connect({
  authtoken: process.env.ngrok_token,
  proto: 'http',
  addr: process.env.PORT || 3000,
  region: process.env.ngrok_region || "us",
})
  .then(url => {
    console.log(`ngrok tunnel established, see output at ${url}`)
    
    fetch(process.env.WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        embeds: [
          {
            title: "A ngrok tunnel has been established.",
            description: "Tunnel Link: " + url,
            url,
          }  
        ]
      }
    })
  })