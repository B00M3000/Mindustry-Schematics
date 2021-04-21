import { User, accessLevels } from '../../auth';
import { Router } from 'express';
import changesRouter from './schematic_changes';
const router = Router();

router.use((req, res, next) => {
  const { originalUrl } = req;
  if (originalUrl.includes('/image')) return next();

  const user = res.locals.user as User;
  if (!user) return res.redirect('/');

  const access = user.access;

  if (access >= accessLevels.mod) return next();
  else return res.redirect('/');
});

router.get('/', (req, res) => {
  res.render('admin');
});

router.get('/tokens', (req, res) => res.render('user_tokens'));

router.use('/schematic_changes', changesRouter);

export default router;
