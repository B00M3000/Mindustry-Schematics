import { Router } from 'express';
import changesRouter from './schematic_changes';
const router = Router();

router.use((req, res, next) => {
  const { originalUrl } = req;
  if (originalUrl.includes('/image')) return next();

  if(!(res.locals && res.locals.user)) return res.redirect('/')

  const access = res.locals.user.access
  
  if(access == "mod" || access == "admin") return next();
  else return res.redirect('/')
});

router.get('/', (req, res) => {
  res.render('admin');
});

router.use('/schematic_changes', changesRouter);

export default router;
