import 'pug';
import '@/util/config_env';
import * as routes from '@/routes';
import * as sapper from '@sapper/server';
import { DiscordWebhookHandler, EventHandler, rootDir } from '../util';
import { User, accessLevels } from '@/auth';
import UserTokenSchema from '@/schemas/UserToken';
import cookieParser from 'cookie-parser';
import express from 'express';
import fileuploader from 'express-fileupload';
import fs from 'fs';
import mongo from '@/mongo';
import path from 'path';
import sirv from 'sirv';
const { PORT = 3000, NODE_ENV } = process.env;

const dev = NODE_ENV === 'development';

const app = express();

const discordWebhookHandler = new DiscordWebhookHandler(
  process.env.WEBHOOK_URL as string
);
const eventHandler = new EventHandler(
  discordWebhookHandler,
  process.env.WEBSITE_URL as string
);
app.set('eventHandler', eventHandler);

app.use(express.static(path.join(rootDir, 'static')));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileuploader());

const backgrounds = fs
  .readdirSync(path.join(rootDir, '/static/assets/backgrounds'))
  .map((file) => path.join('/assets/backgrounds', file).replace(/\\/g, '/'));

app.locals = {
  backgrounds,
  _backgrounds: JSON.stringify(backgrounds),
};

app.use(async (req, res, next) => {
  const { token } = req.cookies;
  res.locals.levels = accessLevels;
  if (token) {
    const userDoc = await UserTokenSchema.findOne({
      token,
    });
    if (!userDoc) return next();
    const user = new User({
      name: userDoc.username,
      access: userDoc.access,
      token: userDoc.token,
    });
    if (user.access >= accessLevels.admin) {
      const docs = await UserTokenSchema.find({});
      res.locals.users = docs;
    }
    res.locals.user = user;
  }

  req.url = req.originalUrl;

  next();
});

// app.use('/', routes.main);
// app.use('/info', routes.info);
// app.use('/downloads', routes.downloads);
// app.use('/help', routes.help);
// app.use('/admin', routes.admin);
app.use('/api', routes.api);
app.use('/raw', routes.raw);
// app.use('/user', routes.user);

app.use(sirv('static', { dev }));
app.use(sapper.middleware());

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
