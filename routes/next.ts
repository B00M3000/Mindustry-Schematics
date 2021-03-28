import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.render('next/index.pug');
});
router.get('/downloads', (req, res) => {
  res.render('next/downloads.pug');
});
router.get('/help', (req, res) => {
  res.render('next/help.pug');
});
router.get('/info', (req, res) => {
  res.render('next/info.pug');
});
router.get('/info/credits', (req, res) => {
  res.render('next/credits.pug');
});
export default router;
