import { Router } from 'express';
import tutorials from '../tutorials.json';

const router = Router();

router.get('/', (req, res) => {
  res.render('tutorials', {
    tutorials,
  });
});

router.get('/:name', (req, res) => {
  const name = req.params.name;
  const tutorial = tutorials.find((t) => t.name == name);

  if (!tutorial) res.redirect('/tutorials');

  res.render('tutorial', tutorial);
});

export default router;
