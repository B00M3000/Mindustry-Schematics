import { Router } from 'express';

const router = Router();
export default router;

router.get('/downloads', (req, res) => {
  res.render('next/downloads.pug');
});
