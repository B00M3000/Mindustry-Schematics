import 'pug';
import './util/config_env';
import * as routes from './routes';
import { DiscordWebhookHandler, EventHandler, rootDir } from './util';
import UserTokenSchema, { UserTokenDocument } from './schemas/UserToken';
import cookieParser from 'cookie-parser';
import express from 'express';
import fileuploader from 'express-fileupload';
import fs from 'fs';
import mongo from './mongo';
import path from 'path';

const PORT = process.env.PORT || 3000;

const app = express();

const discordWebhookHandler = new DiscordWebhookHandler(
  process.env.WEBHOOK_URL as string
);
const eventHandler = new EventHandler(
  discordWebhookHandler,
  process.env.WEBSITE_URL as string
);
app.set('eventHandler', eventHandler);

app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static(path.join(rootDir, '/static')));
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
  const { token } = req.cookies
  
  if(token){
    const user = await UserTokenSchema.findOne({
      token,
    })
    
    if(user) res.locals.user = user
  }

  req.url = req.originalUrl;

  next();
});

app.use('/', routes.main);
app.use('/info', routes.info);
app.use('/downloads', routes.downloads);
app.use('/help', routes.help);
app.use('/admin', routes.admin);
app.use('/api', routes.api);
app.use('/raw', routes.raw);
app.use('/user', routes.user)

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
