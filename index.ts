import 'pug';
import './util/config_env';
import * as routes from './routes';
import cookieParser from 'cookie-parser';
import express from 'express';
import fileuploader from 'express-fileupload';
import mongo from './mongo';
import path from 'path';
import { rootDir } from './util';

const PORT = process.env.PORT || 3000;

const app = express();

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static(path.join(rootDir, '/static')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileuploader());

app.use((req, res, next) => {
  req.url = req.originalUrl;
  next();
});

app.get('/', (req, res) => res.render('index'));

app.get('/credits', (req, res) => res.render('credits'));

app.use('/schematics', routes.schematics);
app.use('/tutorials', routes.tutorials);
app.use('/admin', routes.admin);
app.use('/api', routes.api);
app.use('/raw', routes.raw);

// Handle 404
app.use((req, res) => {
  res.status(404);
  res.render('errors/404');
});

// Handle 500
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(505);
    res.render('errors/500');
    console.log(error);
  }
);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

mongo().then(() => {
  console.log('MongoDB Connection Established!');
});
