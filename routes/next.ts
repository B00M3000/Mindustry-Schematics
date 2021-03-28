import { Router } from 'express';
import tutorials from '../tutorials.json';

const router = Router();

router.get('/', (req, res) => {
  res.render('next/index.pug');
});
router.get('/downloads', (req, res) => {
  res.render('next/downloads.pug');
});
router.get('/help', (req, res) => {
  res.render('next/help.pug', {
    tutorials,
  });
});
router.get('/help/:name', (req, res) => {
  const { name } = req.params;
  const tutorial = tutorials.find((t) => t.name === name);
  if (!tutorial) res.redirect('/help');
  res.render('next/tutorial.pug', tutorial);
});
router.get('/info', (req, res) => {
  res.render('next/info.pug');
});
router.get('/info/credits', (req, res) => {
  res.render('next/credits.pug');
});
export default router;
