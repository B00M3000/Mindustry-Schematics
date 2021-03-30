import { Router } from 'express';
import { mapTutorials } from '../util';

const tutorials = mapTutorials();

const router = Router();

router.get('/', (req, res) => {
  res.render('tutorials', {
    tutorials,
  });
});

router.get('/:name', (req, res) => {
  const name = req.params.name;
  const tutorial = tutorials.get(name);

  if (!tutorial) return res.redirect('/tutorials');

  res.render('tutorial', {
    html: tutorial.html,
    title: tutorial.title,
  });
});

export default router;
