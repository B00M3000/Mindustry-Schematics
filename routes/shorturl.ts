import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
  res.render('create_shorturl', {});
});

router.post('/', (req, res) => {});

export default router;
