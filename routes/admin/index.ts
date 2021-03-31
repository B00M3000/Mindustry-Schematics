import { Router } from 'express';
import changesRouter from './schematic_changes';
const router = Router();

const secret = 'tadatada';

router.use((req, res, next) => {
  const { originalUrl } = req;
  if (originalUrl.includes('/image')) return next();

  if (originalUrl === '/admin/' + secret) {
    res.cookie('secret', secret, { maxAge: 3600000 }); // 1 hour
    return res.redirect('/admin');
  }

  const s = req.cookies.secret;

  if (s && s === secret) return next();

  res.redirect('/next');
});

router.get('/', (req, res) => {
  res.render('admin');
});

router.use('/schematic_changes', changesRouter);

export default router;
