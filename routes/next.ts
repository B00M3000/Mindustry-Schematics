import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.render('next/index.pug');
});

export default router;
