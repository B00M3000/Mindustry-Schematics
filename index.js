require('dotenv').config()
require('pug')

const express = require('express');
const bodyParser = require('body-parser');

const mongo = require('./mongo.js')

const PORT = process.env.PORT || 3000

const app = express();

app.set('view engine', 'pug');
app.set('views','./views');
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('index')
})

app.use('/schematics', require('./routes/schematics'))

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

mongo().then(connection => {
  console.log('MongoDB Connection Established!')
})
