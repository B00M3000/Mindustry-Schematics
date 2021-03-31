import { Router } from 'express';
import { mapTutorials } from '../util';

const router = Router();
export default router;

const tutorials = mapTutorials();

router.get('/help', (req, res) => {
  res.render('help.pug', {
    tutorials,
  });
});
router.get('/help/:name', (req, res) => {
  const { name } = req.params;
  const tutorial = tutorials.get(name);
  if (!tutorial) return res.redirect('/help');
  res.render('tutorial.pug', {
    html: tutorial.html,
    title: tutorial.title,
  });
});
