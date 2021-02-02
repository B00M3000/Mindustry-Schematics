require('dotenv').config()
require('pug')

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const mongo = require('./mongo.js')

const PORT = process.env.PORT || 3000

const app = express();

app.set('view engine', 'pug');
app.set('views','./views');
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req, res) => {
  res.render('index')
})

app.use('/schematics', require('./routes/schematics'))
app.use('/tutorials', require('./routes/tutorials'))

// Handle 404
app.use((req, res) => {
  res.status(404)
  res.render('errors/404')
})

// // Handle 500
app.use((error, req, res, next) => {
  res.status(505)
  res.render('errors/500')
  console.log(error)
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`)
})

mongo().then(connection => {
  console.log('MongoDB Connection Established!')
})
