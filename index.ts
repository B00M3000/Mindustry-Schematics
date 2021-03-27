import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import fileuploader from 'express-fileupload';
import path from 'path';

import mongo from './mongo';

import 'pug';
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static(__dirname + '/static'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileuploader());

app.use((req, res, next) => {
  req.url = req.originalUrl;
  next();
});

app.get('/', (req, res) => res.render('index'));

app.get('/credits', (req, res) => res.render('credits'));

app.use('/schematics', require('./routes/schematics'));
app.use('/tutorials', require('./routes/tutorials'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));
app.use('/raw', require('./routes/raw'));
//app.use('/shorturl', require('./routes/shorturl'))

// Handle 404
app.use((req, res) => {
  res.status(404);
  res.render('errors/404');
});

// Handle 500
app.use((error, req, res, next) => {
  res.status(505);
  res.render('errors/500');
  console.log(error);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

mongo().then((connection) => {
  console.log('MongoDB Connection Established!');
});
