import { Router } from 'express';

const router = Router();
export default router;

router.get('/', (req, res) => {
  res.render('downloads.pug');
});
