import { Router } from 'express';

const router = Router();
export default router;

router.get('/info', (req, res) => {
  res.render('info.pug');
});
router.get('/info/credits', (req, res) => {
  res.render('credits.pug');
});
