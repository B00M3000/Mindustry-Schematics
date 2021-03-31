import { Router } from 'express';

const router = Router();
export default router;

router.get('/', (req, res) => {
  res.render('info.pug');
});
router.get('/credits', (req, res) => {
  res.render('credits.pug');
});
