import { Router } from 'express';

const router = Router();
export default router;

router.get('/info', (req, res) => {
  res.render('next/info.pug');
});
router.get('/info/credits', (req, res) => {
  res.render('next/credits.pug');
});
